import { Component, Input, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormularioService } from '../../../../../shared/services/formulario.service';
import { ModalNewSolicitudComponent } from '../../../modal-new-solicitud/modal-new-solicitud.component';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExtranjeriaService } from '../../../../../shared/services/extranjeria.service';
import { Observable, catchError, map, of } from 'rxjs';
import { TipoSaneoService } from '../../../../../shared/services/tipo-saneo.service';
import { SolicitudService } from '../../../../../shared/services/solicitud.service';
import * as CryptoJS from 'crypto-js';
import Swal from 'sweetalert2';
import { environment } from '../../../../../../../environment/environment';

@Component({
  selector: 'app-formulario-solicitud',
  templateUrl: './formulario-solicitud.component.html',
  styleUrl: './formulario-solicitud.component.css'
})
export class FormularioSolicitudComponent implements OnInit{

  private formularioService  = inject(FormularioService);
  private extranjeriaService = inject(ExtranjeriaService);
  private fb                 = inject(FormBuilder);
  private router             = inject(ActivatedRoute);
  private tipoSaneoService   = inject(TipoSaneoService);
  private solicitudService   = inject(SolicitudService);
  private routerLink         = inject(Router);


  private formulario_id        : any
  private tipo_saneo_id        : any
  public  datos_oficina        : any
  public  descripcion          : any
  public  datos_ciudadano      : any
  public  datos_complemento    : any
  public  datos_llenar         : any
  public  datos_llenar_replica : any
  public  datos_footer         : any
  public  lista_tipo_solicitud : any
  public  detalle_tipo_saneo_id: any

  public datos_llenar_masa   : any []  = []
  public extrajerosBuscados  : any []  = []
  public extranjeroElejido   : any = {};

  public nombre           : string   = '';
  public nombre_operador  : string   = '';
  public apellido         : string   = '';
  public mostrarMensajeAlerta:string = ""


  public mostrarTabla:Boolean                       = false
  public mostrarTablaExtranjeroSeleccionado:Boolean = false
  public mostrarAlertaPersona:boolean               = false


  public dato:number                                = 0

  public solicitudFormulario          !: FormGroup
  public formularioBusquedaExtranjero !: FormGroup
  public solicitudFormularioTramite   !: FormGroup

  public image: ArrayBuffer | undefined;

  ngOnInit(): void {

    this.detalle_tipo_saneo_id = environment.detalle_tipo_saneo_id_cambio_bandeja

    this.router.params.subscribe(params => {

      const tipo_saneo_id_encry = params['tipo_saneo_id'];
      const formulario_id_encry = params['formulario_id'];

      this.tipo_saneo_id = this.desencriptarConAESBase64URL(tipo_saneo_id_encry, 'ESTE ES JOEL');
      this.formulario_id = this.desencriptarConAESBase64URL(formulario_id_encry, 'ESTE ES JOEL');

      // console.log(
      //   this.tipo_saneo_id,
      //   this.formulario_id
      // )
      // console.log(params, "HABES")

      // this.formularioService.getFormularioPreguntaByTipoSaneoByTipoDato(this.formulario_id, "datos_oficina").subscribe(resul => {
      //   this.datos_oficina = resul
      // })

      // this.formularioService.getFormularioPreguntaByTipoSaneoByTipoDato(this.formulario_id, "descripcion").subscribe(resul => {
      //   this.descripcion = resul
      // })

      // this.formularioService.getFormularioPreguntaByTipoSaneoByTipoDato(this.formulario_id, "datos_ciudadano").subscribe(resul => {
      //   this.datos_ciudadano = resul
      // })

      // this.formularioService.getFormularioPreguntaByTipoSaneoByTipoDato(this.formulario_id, "datos_complemento").subscribe(resul => {
      //   this.datos_complemento = resul
      // })

      // this.formularioService.getFormularioPreguntaByTipoSaneoByTipoDato(this.formulario_id, "datos_llenar").subscribe(resul => {
      //   this.datos_llenar         = resul
      //   this.datos_llenar_replica = resul
      //   this.datos_llenar_masa    = [resul]
      // })

      // this.formularioService.getFormularioPreguntaByTipoSaneoByTipoDato(this.formulario_id, "datos_footer").subscribe(resul => {
      //   this.datos_footer = resul
      // })

      // this.formularioService.getFormulariofindById(this.formulario_id).subscribe(result => {
      //   console.log(result)
      // })

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
        datos_procesar       : ['', Validators.required],
        dato_anterior        : ['',],
        dato_correcto        : ['',],
        usu_operador_id      : ['', Validators.required],
        mensaje_adicion      : ['', Validators.required],

        tipo_prioridad       : ['ATENCIÓN COMUN', Validators.required],
      });

      //  **************************** DE AQUI ES EXTRANJERIA HABER FIN ****************************

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

  agregarCard(){
    this.datos_llenar_masa.push(this.datos_llenar_replica)
  }

  eliminarCard(index: number) {
    this.datos_llenar_masa = this.datos_llenar_masa.filter((_, i) => i !== index);
  }


  buscarExtranjero(){
    let datos = this.formularioBusquedaExtranjero.value
    this.extranjeriaService.buscarExtranjero(datos).subscribe((result:any) => {
      this.extrajerosBuscados = result
      this.mostrarTabla = true
      this.mostrarTablaExtranjeroSeleccionado = false;
    })
  }

  seleccionarExtranjero(extranjero:any){
    if(
      extranjero.ApiEstadoExtRegistros === "RENOVADO"  ||
      extranjero.ApiEstadoExtRegistros === "DUPLICADO" ||
      extranjero.ApiEstadoExtRegistros === "RECIBIDO"
      ){
        let gu = {
          serial               : extranjero.SerialExtRegistros,
          detalle_tipo_saneo_id: this.detalle_tipo_saneo_id
        }
        this.solicitudService.verificaSiTieneTramatiesEnviados(gu).subscribe((resul:any) => {
          if(resul.length === 0){
            this.solicitudFormularioTramite.get('nombre_operador')?.setValue(extranjero.NombresSegUsuarios+" "+extranjero.PaternoSegUsuarios+" "+extranjero.MaternoSegUsuarios);
            this.solicitudFormularioTramite.get('nombre_operador')?.disable()
            this.solicitudFormularioTramite.get('usu_operador_id')?.setValue(extranjero.LoginSegUsuarios);
            this.extranjeroElejido                  = extranjero
            this.mostrarTabla                       = false
            this.mostrarTablaExtranjeroSeleccionado = true;
            this.mostrarAlertaPersona               = false
          }else{
            Swal.fire({
              position: "top-end",
              icon: "warning",
              title: "¡ALERTA!",
              text: "Ya existe una solicitud de CAMBIO DE BANDEJA para el ciudadano favor de verificar.",
              showConfirmButton: false,
              timer: 6000,
              allowOutsideClick: false
            });
            this.mostrarAlertaPersona = true
            this.mostrarMensajeAlerta = "Ya existe una solicitud de CAMBIO DE BANDEJA para el ciudadano favor de verificar."
          }
        })
    }else{
      Swal.fire({
        position: "top-end",
        icon: "warning",
        title: "¡ALERTA!",
        text: "El ciudadano debe estar con un estado de ( RENOVADO, DUPLICADO o RECIBIDO )",
        showConfirmButton: false,
        timer: 6000,
        allowOutsideClick: false
      });

      // this.mostrarTabla         = false
      this.mostrarAlertaPersona = true
      this.mostrarMensajeAlerta = "El ciudadano debe estar con un estado de ( RENOVADO, DUPLICADO o RECIBIDO ) para contiuar con el tramite."
    }
  }

  tipoCaso(dato:any){
    let hauy                    = dato.value.toString()
    let arraySeparado: string[] = hauy.split(' ');
    this.solicitudFormularioTramite.get('dato_anterior')?.setValue(arraySeparado[0])
    this.solicitudFormularioTramite.get('dato_correcto')?.setValue(arraySeparado[2])
  }

  guardarSolicitud(){
    // console.log("******************************************************************************************************")
    // console.log("========================")
    // console.log(this.solicitudFormulario.value)
    // console.log("========================")
    // console.log(this.extranjeroElejido)
    // console.log("========================")
    // console.log(this.solicitudFormularioTramite.value)
    // console.log("******************************************************************************************************")

    let dato = {
      datosFormularioSolicitud  : this.solicitudFormulario.value,
      datosExtranjeroElejido    : this.extranjeroElejido,
      solicitudFormularioTramite: this.solicitudFormularioTramite.value
    }

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
      datos_procesar_respuesta       : this.solicitudFormularioTramite.value.datos_procesar,
      dato_anterior_respuesta        : this.solicitudFormularioTramite.value.dato_anterior,
      dato_correcto_respuesta        : this.solicitudFormularioTramite.value.dato_correcto,
      usu_operador_id_respuesta      : this.solicitudFormularioTramite.value.usu_operador_id,
      tipo_prioridad                 : this.solicitudFormularioTramite.value.tipo_prioridad,

      // PREGUNTA_CONVERSACION
      mensaje_adicion : this.solicitudFormularioTramite.value.mensaje_adicion

    }

    this.solicitudService.saveSolicitudCambioBandeja(datosREales).subscribe((resul:any) => {
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
      console.log(resul)

    })

  }

  desencriptarConAESBase64URL(textoEnBase64URL:string, clave:string) {
    const textoEncriptado     = textoEnBase64URL.replace(/-/g, '+').replace(/_/g, '/');
    const bytesDesencriptados = CryptoJS.AES.decrypt(textoEncriptado, clave);
    const textoDesencriptado  = bytesDesencriptados.toString(CryptoJS.enc.Utf8);
    return textoDesencriptado;
  }

  volverListado(){

  }

}
