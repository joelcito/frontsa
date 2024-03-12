import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import * as CryptoJS from 'crypto-js';
import Swal from 'sweetalert2';

import { ExtranjeriaService } from '../../../../../shared/services/extranjeria.service';
import { environment } from '../../../../../../../environment/environment';
import { SolicitudService } from '../../../../../shared/services/solicitud.service';
import { MinioService } from '../../../../../shared/services/minio.service';
import { TipoSaneoService } from '../../../../../shared/services/tipo-saneo.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-formulario-baja-orpe-naturalizacion',
  templateUrl: './formulario-baja-orpe-naturalizacion.component.html',
  styleUrl: './formulario-baja-orpe-naturalizacion.component.css'
})
export class FormularioBajaOrpeNaturalizacionComponent implements OnInit {

  private router             = inject(ActivatedRoute);
  private fb                 = inject(FormBuilder);
  private extranjeriaService = inject(ExtranjeriaService);
  private solicitudService   = inject(SolicitudService);
  private routerLink         = inject(Router);
  private minioService       = inject(MinioService);
  private tipoSaneoService   = inject(TipoSaneoService);
  private datePipe           = inject(DatePipe);

  public solicitudFormulario          !: FormGroup
  public formularioBusquedaExtranjero !: FormGroup
  public solicitudFormularioTramite   !: FormGroup

  private formulario_id        : any
  private tipo_saneo_id        : any
  public  detalle_tipo_saneo_id: any


  public mostrarTabla:boolean                       = false
  public mostrarAlertaPersona:boolean               = false
  public mostrarTablaExtranjeroSeleccionado:boolean = false

  public mostrarMensajeAlerta:string  = ""

  public extrajerosBuscados  : any []       = []
  public listaDocumentosSolicitud  : any [] = []
  public extranjeroElejido   : any          = {};


  ngOnInit(): void {

    this.detalle_tipo_saneo_id = environment.detalle_tipo_saneo_id_baja_orpe_naturalizacion

    this.router.params.subscribe(params => {

      const tipo_saneo_id_encry = params['tipo_saneo_id'];
      const formulario_id_encry = params['formulario_id'];

      this.tipo_saneo_id = this.desencriptarConAESBase64URL(tipo_saneo_id_encry, 'ESTE ES JOEL');
      this.formulario_id = this.desencriptarConAESBase64URL(formulario_id_encry, 'ESTE ES JOEL');

      //  **************************** DE AQUI ES EXTRANJERIA HABER ****************************
      this.formularioBusquedaExtranjero = this.fb.group({
        numero_cedula   : ['100398980', Validators.required],
        complemento     : ['',],
        nombres         : ['',],
        primer_apellido : ['',],
        segundo_apellido: ['',],
      });

      this.solicitudFormularioTramite = this.fb.group({
        tipo_solicitud       : [{value:this.detalle_tipo_saneo_id, disabled:true}, Validators.required],
        nombre_operador      : ['', Validators.required],
        // descripcion          : [''],
        // articulos_reglamentos: ['', Validators.required],
        // datos_procesar       : ['', Validators.required],
        // dato_anterior        : ['',],
        // dato_correcto        : ['',],
        usu_operador_id : ['', Validators.required],
        // naturalizacion  : [{value: true, disabled:true}],
        naturalizacion    : [false],
        baja_orpe         : [false],
        obs_naturalizacion: [''],
        obs_baja_orpe     : [''],

      });


      // console.log(params, )
      // console.log("formulario_id => "+this.formulario_id, "tipo_saneo_id => "+this.tipo_saneo_id)

    })

    // Obtener los datos de sessionStorage como JSON
    const datosRecuperadosString: string | null = sessionStorage.getItem('datos');

    // Verificar si hay datos en sessionStorage
    if (datosRecuperadosString !== null) {
      // Ahora puedes utilizar directamente los datos como un objeto JSON
      const datosRecuperados = JSON.parse(datosRecuperadosString);
      // *************** CREACION DEL FORMULARIO ***************
      this.solicitudFormulario = this.fb.group({
        pais              : [{value:"Bolivia", disabled:true}, Validators.required],
        departamento      : [{value:datosRecuperados.departamento, disabled:true}, Validators.required],
        oficina           : [{value:datosRecuperados.nombre_organizacion, disabled:true}, Validators.required],
        nombre_funcionario: [{value:datosRecuperados.nombres+" "+datosRecuperados.primer_apellido+" "+datosRecuperados.segundo_apellido, disabled:true}, Validators.required],
        fecha_solicitud   : [{value:new Date(), disabled:true}, Validators.required],
        funcionario_id    : [datosRecuperados.id],
        formulario_id     : [this.formulario_id]
      });
    } else {
      // No se encontraron datos en sessionStorage
      console.log('No se encontraron datos en sessionStorage');
    }

  }

  desencriptarConAESBase64URL(textoEnBase64URL:string, clave:string) {
    const textoEncriptado     = textoEnBase64URL.replace(/-/g, '+').replace(/_/g, '/');
    const bytesDesencriptados = CryptoJS.AES.decrypt(textoEncriptado, clave);
    const textoDesencriptado  = bytesDesencriptados.toString(CryptoJS.enc.Utf8);
    return textoDesencriptado;
  }

  buscarExtranjero(){
    let datos = this.formularioBusquedaExtranjero.value
    this.extranjeriaService.buscarExtranjero(datos).subscribe((result:any) => {
      if(result === null){
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "¡ALERTA!",
          text: "El numero "+datos.numero_cedula+" ya pertenece a un ciudadano BOLIVIANO",
          showConfirmButton: false,
          timer: 6000,
          allowOutsideClick: false
        });
        this.mostrarTabla         = false
        this.mostrarAlertaPersona = true
        this.mostrarMensajeAlerta = "El numero de documento ya comparte con un ciudadano Boliviano, por favor comuniquese con Base de Datos."
      }else{
        this.extrajerosBuscados = result
        this.mostrarTabla = true
        this.mostrarTablaExtranjeroSeleccionado = false;
      }
    })
  }


  seleccionarExtranjero(extranjero:any){

      this.solicitudFormularioTramite.get('nombre_operador')?.setValue(extranjero.NombresSegUsuarios+" "+extranjero.PaternoSegUsuarios+" "+extranjero.MaternoSegUsuarios);
      this.solicitudFormularioTramite.get('usu_operador_id')?.setValue(extranjero.LoginSegUsuarios);
      this.extranjeroElejido                  = extranjero
      this.mostrarTabla                       = false
      this.mostrarTablaExtranjeroSeleccionado = true;
      this.mostrarAlertaPersona               = false;

      // Datos para los documentos
      this.tipoSaneoService.getDocumentoDetalleTipoSaneo(this.detalle_tipo_saneo_id).subscribe((resuly :any) => {
        this.listaDocumentosSolicitud = resuly
      })


      console.log(this.detalle_tipo_saneo_id)
      console.log(this.tipo_saneo_id)
      console.log(this.formulario_id)

  }

  guardarSolicitud(){
    let datos = this.solicitudFormularioTramite.value
    this.solicitudFormularioTramite.enable()
    let datRes = {
      funcionario_id             : this.solicitudFormulario.value.funcionario_id,
      formulario_id              : this.solicitudFormulario.value.formulario_id,
      serialDocumentoExtRegistros: this.extranjeroElejido.SerialDocumentoExtRegistros,
      serialExtRegistros         : this.extranjeroElejido.SerialExtRegistros,
      nroCedulaBolExtRegistros   : this.extranjeroElejido.NroCedulaBolExtRegistros,
      solicitud_id               : 0,
      estado                     : "ASIGNADO",
      tipo_solicitud             : this.solicitudFormularioTramite.value.tipo_solicitud,
      naturalizacion             : this.solicitudFormularioTramite.value.naturalizacion,
      baja_orpe                  : this.solicitudFormularioTramite.value.baja_orpe,
      obs_baja_orpe              : this.solicitudFormularioTramite.value.obs_baja_orpe,
      obs_naturalizacion         : this.solicitudFormularioTramite.value.obs_naturalizacion
    }
    this.solicitudFormularioTramite.disable()
    this.solicitudService.saveSolicitudBajaOrpeNaturalizacion(datRes).subscribe((result:any) => {
      if(result.id !== null && result.estado === "ASIGNADO"){
        const fechaActual  = new Date();
        const anioActual   = fechaActual.getFullYear();
        const mesEnLiteral = fechaActual.toLocaleDateString('es-ES', { month: 'long' });
        const fechaFormato = this.datePipe.transform(fechaActual, 'yyyy-MM-dd');
        let   ruta         = anioActual+"-EXT/"+mesEnLiteral+"/"+fechaFormato+"/solicitud_"+result.id;
        let   numBucles    = 0;
        for (const doc of this.listaDocumentosSolicitud) {
          const fileInput = document.getElementById(`document_${doc.id}`) as HTMLInputElement;
          if(fileInput.files){
            const file       = fileInput.files[0]
            const bucketName = 'saneoxample';
            const nameFile   = file.name.replaceAll(" ", "_" )
            const objectKey  = ruta+"/"+nameFile;
            this.minioService.uploadFile(file, bucketName, objectKey)
            .then(data => {
              if(data !== null){
                let datos = {
                  solicitud      : result.id,
                  usuario_creador: this.solicitudFormulario.value.funcionario_id,
                  gestion        : anioActual,
                  sistema        : "EXT",
                  mes            : mesEnLiteral,
                  fecha          : fechaFormato,
                  nombre_archivo : nameFile ,
                  ETag           : data.ETag,
                  Location       : data.Location,
                  key            : data.Key,
                  Bucket         : data.Bucket,
                }
                this.solicitudService.saveSolicitudArchivo(datos).subscribe((resultado:any) =>{
                  console.log(resultado)
                })
                numBucles++;
                if(numBucles == this.listaDocumentosSolicitud.length){
                  Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Se registro con exito",
                    text: "El Caso se le asigno a "+result.usuarioAsignado.nombres+" "+result.usuarioAsignado.primer_apellido+" "+result.usuarioAsignado.segundo_apellido,
                    showConfirmButton: false,
                    timer: 4000,
                    allowOutsideClick: false
                  });
                  setTimeout(() => {
                    this.routerLink.navigate(['/solicitud']);
                  }, 4000);
                }
              }
            })
            .catch(err => {
              console.error('Error al subir el archivo:', err);
            });
          }
        }
      }
    })
  }


  onFileChange(event:any){

    const file = event.target.files[0];

    const bucketName = 'saneoxample';
    // const objectKey = 'hbas.pdf';
    const objectKey = event.target.files[0].name;

    this.minioService.uploadFile(file, bucketName, objectKey)
      .then(data => {
        console.log('Archivo subido exitosamente:', data.Location);
      })
      .catch(err => {
        console.error('Error al subir el archivo:', err);
      });

  }

  onFileSelected(event: any, tamanio: string, id:number){
    const maxFileSize = parseInt(tamanio) * 1048576;
    const file        = event.target.files[0];
    if (file && file.size > maxFileSize) {
      const fileInput = document.getElementById('document_'+id) as HTMLInputElement;
      fileInput.value = '';
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "¡ERROR!",
        text: "El tamaño del archivo exede los "+tamanio+" MB. permitidos.",
        showConfirmButton: false,
        timer: 6000,
        allowOutsideClick: false
      });
    }
  }

}
