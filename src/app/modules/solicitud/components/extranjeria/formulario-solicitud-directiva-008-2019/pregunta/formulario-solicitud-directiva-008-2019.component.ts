import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TipoSaneoService } from '../../../../../shared/services/tipo-saneo.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExtranjeriaService } from '../../../../../shared/services/extranjeria.service';
import { SolicitudService } from '../../../../../shared/services/solicitud.service';
import * as CryptoJS from 'crypto-js';
import Swal from 'sweetalert2';
import { RuisegipService } from '../../../../../shared/services/ruisegip.service';
import { environment } from '../../../../../../../environment/environment';


@Component({
  selector: 'app-formulario-solicitud-directiva-008-2019',
  templateUrl: './formulario-solicitud-directiva-008-2019.component.html',
  styleUrl: './formulario-solicitud-directiva-008-2019.component.css'
})

export class FormularioSolicitudDirectiva0082019Component implements OnInit{

  private router             = inject(ActivatedRoute);
  private tipoSaneoService   = inject(TipoSaneoService);
  private fb                 = inject(FormBuilder);
  private extranjeriaService = inject(ExtranjeriaService);
  private solicitudService   = inject(SolicitudService);
  private routerLink         = inject(Router);
  private ruisegipService    = inject(RuisegipService);


  private formulario_id        : any
  private tipo_saneo_id        : any
  public  lista_tipo_solicitud : any
  public  detalle_tipo_saneo_id: any


  public formularioBusquedaExtranjero !: FormGroup
  public solicitudFormularioTramite   !: FormGroup
  public solicitudFormulario          !: FormGroup


  public mostrarTabla:boolean                       = false
  public mostrarTablaExtranjeroSeleccionado:boolean = false
  public mostrarAlertaPersona:boolean               = false




  public extrajerosBuscados  : any [] = []
  public extranjeroElejido   : any    = {};


  public dato_errado         : string = '';
  public dato_correcto       : string = '';
  public mostrarMensajeAlerta:string  = ""


  ngOnInit(): void {

    this.detalle_tipo_saneo_id = environment.detalle_tipo_saneo_id_directiva_008_2019

    this.router.params.subscribe(params => {

      const tipo_saneo_id_encry = params['tipo_saneo_id'];
      const formulario_id_encry = params['formulario_id'];

      this.tipo_saneo_id = this.desencriptarConAESBase64URL(tipo_saneo_id_encry, 'ESTE ES JOEL');
      this.formulario_id = this.desencriptarConAESBase64URL(formulario_id_encry, 'ESTE ES JOEL');

      // console.log(
      //   "tipo_saneo_id => "+this.tipo_saneo_id,
      //   "formulario_id => "+this.formulario_id
      // )

      this.tipoSaneoService.getDetalleTiposSaneo(this.tipo_saneo_id).subscribe(resulg => {
        this.lista_tipo_solicitud = resulg
      })

      //  **************************** DE AQUI ES EXTRANJERIA HABER ****************************
      this.formularioBusquedaExtranjero = this.fb.group({
        numero_cedula   : ['100398980', Validators.required],
        complemento     : ['',],
        nombres         : ['',],
        primer_apellido : ['',],
        segundo_apellido: ['',],
      });

      this.solicitudFormularioTramite = this.fb.group({
        tipo_solicitud       : [{value: this.detalle_tipo_saneo_id, disabled:true}, Validators.required],
        descripcion          : ['',],
        articulos_reglamentos: ['', Validators.required],
        // datos_procesar       : ['', Validators.required],
        // dato_anterior        : ['', Validators.required],
        // dato_correcto        : ['', Validators.required],
        usu_operador_id      : ['', Validators.required],

        dato_actual  : [{value :'ACTIVO', disabled:true}, Validators.required],
        dato_corregir: [{value:'DESBLOQUEADO', disabled:true}, Validators.required],

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
    let dato = extranjero.NroCedulaBolExtRegistros

    this.ruisegipService.verificarSiestaBloqueado(dato).subscribe((resul:any) => {
      let respuesta = '';
      if(resul!==null){
        if(resul.bloqueado){
          let gu = {
            serial               : extranjero.SerialExtRegistros,
            detalle_tipo_saneo_id: this.detalle_tipo_saneo_id
          }
          this.solicitudService.verificaSiTieneTramatiesEnviados(gu).subscribe((result:any) => {
            console.log(result)
            if(result.length === 0){
              this.solicitudFormularioTramite.get('nombre_operador')?.setValue(extranjero.NombresSegUsuarios+" "+extranjero.PaternoSegUsuarios+" "+extranjero.MaternoSegUsuarios);
              this.solicitudFormularioTramite.get('usu_operador_id')?.setValue(extranjero.LoginSegUsuarios);
              this.extranjeroElejido = extranjero
              this.mostrarTabla = false
              this.mostrarTablaExtranjeroSeleccionado = true;
              this.mostrarAlertaPersona = false;
            }else{
              respuesta = "Ya existe una solicitud de DESBLOQUEO favor de verificar.";
              this.mostrarAlertaPersona = true;
              this.mostrarAlertValidadorAntesCrearSolicitud(respuesta, true)
            }
          })
        }else{
          respuesta = "El registro ya se encuentra DESBLOQUEADO.";
          this.mostrarAlertaPersona = true;
          this.mostrarMensajeAlerta = respuesta
          this.mostrarAlertValidadorAntesCrearSolicitud(respuesta, this.mostrarAlertaPersona)
        }
      }else{
        respuesta = "El registro no se encuentra en la TABLA DE BLOQUEADOS.";
        this.mostrarAlertaPersona = true;
        this.mostrarMensajeAlerta = respuesta
        this.mostrarAlertValidadorAntesCrearSolicitud(respuesta, this.mostrarAlertaPersona)
      }
      // if(this.mostrarTabla){
      //   Swal.fire({
      //     position: "top-end",
      //     icon: "warning",
      //     title: "¡ALERTA!",
      //     text: respuesta,
      //     showConfirmButton: false,
      //     timer: 4000,
      //     allowOutsideClick: false
      //   });
      // }
    })
  }

  mostrarAlertValidadorAntesCrearSolicitud(mensaje:string, mostrarTabla:boolean){
    this.mostrarAlertaPersona = mostrarTabla;
    this.mostrarMensajeAlerta = mensaje

    if(mostrarTabla){
      Swal.fire({
        position: "top-end",
        icon: "warning",
        title: "¡ALERTA!",
        text: mensaje,
        showConfirmButton: false,
        timer: 4000,
        allowOutsideClick: false
      });
    }

  }

  tipoCaso(dato:any){
    console.log(dato, "haber",dato.value )
    // let hauy                    = dato.value.toString()
    // let arraySeparado: string[] = hauy.split(' ');
    //     this.dato_errado        = arraySeparado[0]
    //     this.dato_correcto      = arraySeparado[2]
    // console.log(arraySeparado);
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

    let dato = {
      datosFormularioSolicitud  : this.solicitudFormulario.value,
      datosExtranjeroElejido    : this.extranjeroElejido,
      solicitudFormularioTramite: this.solicitudFormularioTramite.value
    }

    this.solicitudFormularioTramite.get('tipo_solicitud')?.enable()
    this.solicitudFormularioTramite.get('dato_actual')?.enable()
    this.solicitudFormularioTramite.get('dato_corregir')?.enable()

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
      // dato_anterior_respuesta        : this.solicitudFormularioTramite.value.dato_anterior,
      // dato_correcto_respuesta        : this.solicitudFormularioTramite.value.dato_correcto,
      usu_operador_id_respuesta: this.solicitudFormularioTramite.value.usu_operador_id,

      dato_actual_respuesta    : this.solicitudFormularioTramite.value.dato_actual,
      dato_corregir_respuesta: this.solicitudFormularioTramite.value.dato_corregir,
    }

    // this.solicitudService.saveSolicitudCambioBandeja(dato).subscribe(resul => {
    this.solicitudService.saveSolicitudDesbloqueoDirectiva0082019(datosREales).subscribe((resul:any) => {
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
    })
  }

  volverListado(){
    this.routerLink.navigate(['/solicitud']);
  }

}
