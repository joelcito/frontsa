import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExtranjeriaService } from '../../../../../shared/services/extranjeria.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../../../../../environment/environment';
import { TipoSaneoService } from '../../../../../shared/services/tipo-saneo.service';
import { DatePipe } from '@angular/common';
import { SolicitudService } from '../../../../../shared/services/solicitud.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formulario-convenio',
  templateUrl: './formulario-convenio.component.html',
  styleUrl: './formulario-convenio.component.css'
})
export class FormularioConvenioComponent implements OnInit{

  private fb                 = inject(FormBuilder);
  private extranjeriaService = inject(ExtranjeriaService);
  private router             = inject(ActivatedRoute);
  private tipoSaneoService   = inject(TipoSaneoService);
  private datePipe           = inject(DatePipe);
  private routerLink         = inject(Router);
  private solicitudService   = inject(SolicitudService);


  public solicitudFormulario          !: FormGroup
  public formularioBusquedaExtranjero !: FormGroup
  public solicitudFormularioTramite   !: FormGroup


  private formulario_id        : any
  private tipo_saneo_id        : any
  public  detalle_tipo_saneo_id: any
  public  lista_tipo_solicitud : any


  public extrajerosBuscados  : any []  = []

  public extranjeroElejido   : any = {};

  public mostrarTabla:Boolean                       = false
  public mostrarTablaExtranjeroSeleccionado:Boolean = false

  ngOnInit(): void {

    // VERIFICAR
    this.detalle_tipo_saneo_id = environment.detalle_tipo_saneo_id_solicitud_convenio

    this.router.params.subscribe(params => {

      const tipo_saneo_id_encry = params['tipo_saneo_id'];
      const formulario_id_encry = params['formulario_id'];

      this.tipo_saneo_id = this.desencriptarConAESBase64URL(tipo_saneo_id_encry, 'ESTE ES JOEL');
      this.formulario_id = this.desencriptarConAESBase64URL(formulario_id_encry, 'ESTE ES JOEL');

      this.tipoSaneoService.getDetalleTiposSaneo(this.tipo_saneo_id).subscribe(resulg => {
        this.lista_tipo_solicitud = resulg
      })

      //  **************************** DE AQUI ES EXTRANJERIA HABER ****************************
      this.formularioBusquedaExtranjero = this.fb.group({
        numero_cedula   : ['100398980', Validators.required],
        complemento     : [''],
        nombres         : [''],
        primer_apellido : [''],
        segundo_apellido: [''],
      });

      this.solicitudFormularioTramite = this.fb.group({
        tipo_solicitud       : [{value:this.detalle_tipo_saneo_id, disabled:true}, Validators.required],
        nombre_operador      : ['', Validators.required],
        descripcion          : [''],
        articulos_reglamentos: ['', Validators.required],
        // datos_procesar       : ['', Validators.required],
        dato_anterior        : ['',],
        dato_correcto        : ['',],
        usu_operador_id      : ['', Validators.required],
        fecha_certificacion  : [{value:'', disable:true}, Validators.required],

        tipo_prioridad       : ['ATENCIÓN COMUN', Validators.required],

      });

    });

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
        fecha_solicitud   : [{value: new Date(), disabled:true}, Validators.required],
        funcionario_id    : [datosRecuperados.id],
        formulario_id     : [this.formulario_id]
      });
    } else {
      // No se encontraron datos en sessionStorage
      console.log('No se encontraron datos en sessionStorage');
    }
  }

  buscarExtranjero(){
    let datos = this.formularioBusquedaExtranjero.value
    this.extranjeriaService.buscarExtranjero(datos).subscribe((result:any) => {
      this.extrajerosBuscados = result
      this.mostrarTabla = true
      this.mostrarTablaExtranjeroSeleccionado = false;
    })
  }

  desencriptarConAESBase64URL(textoEnBase64URL:string, clave:string) {
    const textoEncriptado     = textoEnBase64URL.replace(/-/g, '+').replace(/_/g, '/');
    const bytesDesencriptados = CryptoJS.AES.decrypt(textoEncriptado, clave);
    const textoDesencriptado  = bytesDesencriptados.toString(CryptoJS.enc.Utf8);
    return textoDesencriptado;
  }

  seleccionarExtranjero(extranjero:any){

    // if(
    //   extranjero.ApiEstadoExtRegistros === "RENOVADO"  ||
    //   extranjero.ApiEstadoExtRegistros === "DUPLICADO" ||
    //   extranjero.ApiEstadoExtRegistros === "RECIBIDO"
    //   ){
    //     let gu = {
    //       serial               : extranjero.SerialExtRegistros,
    //       detalle_tipo_saneo_id: this.detalle_tipo_saneo_id
    //     }
    //     this.solicitudService.verificaSiTieneTramatiesEnviados(gu).subscribe((resul:any) => {
    //       if(resul.length === 0){

            this.solicitudFormularioTramite.get('nombre_operador')?.setValue(extranjero.NombresSegUsuarios+" "+extranjero.PaternoSegUsuarios+" "+extranjero.MaternoSegUsuarios);
            this.solicitudFormularioTramite.get('nombre_operador')?.disable()

            // this.solicitudFormularioTramite.get('fecha_certificacion')?.setValue(extranjero.FecExpCedExtRegistros);
            this.solicitudFormularioTramite.get('fecha_certificacion')?.setValue(this.datePipe.transform(extranjero.FecExpCedExtRegistros, 'dd/MM/yyyy'));
            this.solicitudFormularioTramite.get('fecha_certificacion')?.disable()

            this.solicitudFormularioTramite.get('usu_operador_id')?.setValue(extranjero.LoginSegUsuarios);
            this.extranjeroElejido                  = extranjero
            this.mostrarTabla                       = false
            this.mostrarTablaExtranjeroSeleccionado = true;
            // this.mostrarAlertaPersona               = false

    //       }else{
    //         Swal.fire({
    //           position: "top-end",
    //           icon: "warning",
    //           title: "¡ALERTA!",
    //           text: "Ya existe una solicitud de CAMBIO DE BANDEJA para el ciudadano favor de verificar.",
    //           showConfirmButton: false,
    //           timer: 6000,
    //           allowOutsideClick: false
    //         });
    //         this.mostrarAlertaPersona = true
    //         this.mostrarMensajeAlerta = "Ya existe una solicitud de CAMBIO DE BANDEJA para el ciudadano favor de verificar."
    //       }
    //     })
    // }else{
    //   Swal.fire({
    //     position: "top-end",
    //     icon: "warning",
    //     title: "¡ALERTA!",
    //     text: "El ciudadano debe estar con un estado de ( RENOVADO, DUPLICADO o RECIBIDO )",
    //     showConfirmButton: false,
    //     timer: 6000,
    //     allowOutsideClick: false
    //   });

    //   // this.mostrarTabla         = false
    //   this.mostrarAlertaPersona = true
    //   this.mostrarMensajeAlerta = "El ciudadano debe estar con un estado de ( RENOVADO, DUPLICADO o RECIBIDO ) para contiuar con el tramite."
    // }
  }

  guardarSolicitud(){
    console.log("******************************************************************************************************")
    console.log("========================")
    console.log(this.solicitudFormulario.value)
    console.log("========================")
    console.log(this.extranjeroElejido)
    console.log("========================")
    console.log(this.solicitudFormularioTramite.value)
    console.log("******************************************************************************************************")

    // let dato = {
    //   datosFormularioSolicitud  : this.solicitudFormulario.value,
    //   datosExtranjeroElejido    : this.extranjeroElejido,
    //   solicitudFormularioTramite: this.solicitudFormularioTramite.value
    // }

    this.solicitudFormularioTramite.enable()
    this.solicitudFormulario.enable()

    let datosREales = {
      funcionario_id             : this.solicitudFormulario.value.funcionario_id,
      formulario_id              : this.solicitudFormulario.value.formulario_id,
      serialDocumentoExtRegistros: this.extranjeroElejido.SerialDocumentoExtRegistros,
      serialExtRegistros         : this.extranjeroElejido.SerialExtRegistros,
      nroCedulaBolExtRegistros   : this.extranjeroElejido.NroCedulaBolExtRegistros,
      tipo_solicitud             : this.solicitudFormularioTramite.value.tipo_solicitud,
      solicitud_id               : 0,
      estado                     : "ASIGNADO",

      // PREGUNTAS
      tipo_solicitud_respuesta       : this.solicitudFormularioTramite.value.tipo_solicitud,
      nombre_operador_respuesta      : this.solicitudFormularioTramite.value.nombre_operador,
      descripcion_respuesta          : this.solicitudFormularioTramite.value.descripcion,
      articulos_reglamentos_respuesta: this.solicitudFormularioTramite.value.articulos_reglamentos,
      // datos_procesar_respuesta       : this.solicitudFormularioTramite.value.datos_procesar,
      dato_anterior_respuesta        : this.solicitudFormularioTramite.value.dato_anterior,
      dato_correcto_respuesta        : this.solicitudFormularioTramite.value.fecha_certificacion,
      usu_operador_id_respuesta      : this.solicitudFormularioTramite.value.usu_operador_id,

      tipo_prioridad : this.solicitudFormularioTramite.value.tipo_prioridad,
      mensaje_adicion: (document.getElementById('mensajeTextarea') as HTMLTextAreaElement).value

    }

    // this.solicitudService.saveSolicitudCambioBandeja(dato).subscribe(resul => {
    this.solicitudService.saveSolicitudConvenio(datosREales).subscribe((resul:any) => {
      if(resul !== null){

        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Se registro con exito",
          text: "El Caso se le asigno a "+resul.usuarioAsignado.nombres+" "+resul.usuarioAsignado.primer_apellido+" "+resul.usuarioAsignado.segundo_apellido,
          showConfirmButton: false,
          timer: 4000,
          allowOutsideClick: false
        });

        setTimeout(() => {
          this.routerLink.navigate(['/solicitud']);
        }, 4000);

      }else{

      }
      // console.log(resul)

    })

  }

}
