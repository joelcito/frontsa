import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SolicitudService } from '../../../../../shared/services/solicitud.service';
import { DatePipe } from '@angular/common';
import { ExtranjeriaService } from '../../../../../shared/services/extranjeria.service';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../../../../../environment/environment';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';



@Component({
  selector: 'app-formulario-solicitud-respuesta',
  templateUrl: './formulario-solicitud-respuesta.component.html',
  styleUrl: './formulario-solicitud-respuesta.component.css'
})

export class FormularioSolicitudRespuestaComponent implements OnInit{

  private route              = inject(ActivatedRoute);
  private solicitudService   = inject(SolicitudService);
  private datePipe           = inject(DatePipe);
  private extranjeriaService = inject(ExtranjeriaService);
  private routerLink         = inject(Router);
  private fb                 = inject(FormBuilder);

  private solicitud_id : any
  public  solictudNuber: any

  public datosOficina:any = {
    departamento: "",
    oficina     : "",
    nombre      : "",
    fecha       : "",
  }

  public estadosRespuestas:any = [] ;

  public datosCiudadano:any           = {};
  public datosTramite:any             = {};

  public solicitudConversacion:any [] = [];

  public usuario              : any;
  public solicitud            : any;
  public detalle_tipo_saneo_id: any;


  public mostrarBoton!:boolean;


  public formularioRespuesta !:FormGroup

  ngOnInit(): void {

      this.detalle_tipo_saneo_id = environment.detalle_tipo_saneo_id_cambio_bandeja

      // Obtener los datos de sessionStorage como JSON
      const datosRecuperadosString: string | null = sessionStorage.getItem('datos');

      // Verificar si hay datos en sessionStorage
      if (datosRecuperadosString !== null) {
        // console.log(datosRecuperadosString)
        // const datosRecuperados = JSON.stringify(datosRecuperadosString);
        const datosRecuperados = JSON.parse(datosRecuperadosString);

        // console.log(this.usuario, datosRecuperadosString, datosRecuperados)

        this.usuario = datosRecuperados;
      }

    this.route.params.subscribe(params => {

      const idEncriptado      = params['solicitud_id'];
            this.solicitud_id = this.desencriptarConAESBase64URL(idEncriptado, 'ESTE ES JOEL');

            this.solictudNuber = this.solicitud_id

      this.solicitudService.findByIdsolicitud(this.solicitud_id).subscribe((resul:any) => {

        this.solicitud = resul

        // console.log(resul)

        if(resul.asignado_id === this.usuario.id){
          this.mostrarBoton =   true
          this.estadosRespuestas = [
            // {
            //   nombre: 'ASIGNADO',
            //   value : 'ASIGNADO'
            // },
            {
              nombre: 'OBSERVADO',
              value : 'OBSERVADO'
            },
            // {
            //   nombre: 'PROCESADO',
            //   value : 'PROCESADO'
            // },
            {
              nombre: 'RECHAZADO',
              value : 'RECHAZADO'
            },
            {
              nombre: 'ANULADO',
              value : 'ANULADO'
            },
          ]

        }else{
          this.mostrarBoton =   false
          this.estadosRespuestas = [
            {
              nombre: 'REVISADO',
              value : 'REVISADO'
            },
            {
              nombre: 'ANULADO',
              value : 'ANULADO'
            },
            // {
            //   nombre: 'RECHAZADO',
            //   value : 'RECHAZADO'
            // },
          ]
        }

        // this.mostrarBoton = (resul.asignado_id === this.usuario.id) ? true : false

        // ******************** DATOS DE LA OFICINA ********************
        this.datosOficina.departamento = resul.departamento
        this.datosOficina.oficina      = resul.nombre_organizacion
        this.datosOficina.nombre       = resul.nombres+" "+resul.primer_apellido+" "+resul.segundo_apellido
        this.datosOficina.fecha        = this.datePipe.transform(resul.fecha_solicitud, 'dd/MM/yyyy HH:mm:ss');

        // ******************** DATOS DEL CIUDADANO EXTRANJERO ********************
        let data = {
          serial : resul.serialextregistros
        }

        this.extranjeriaService.buscaExtranjeroPorSerial(data).subscribe(resul => {
          this.datosCiudadano = resul
        })

        // console.log(this.solicitud)
      })

      // ******************** DATOS DEL TRAMITE ********************
      this.solicitudService.tramitesSolicitudesByIdSolicitud(this.solicitud_id).subscribe((resul:any) => {
        let fa:any = {}
        resul.forEach((item: any) => { // Utiliza forEach en lugar de map
          const h = {
            [item.pregunta]: item.respuesta
          };
          // Fusiona el objeto h en el objeto fa
          fa = {
            ...fa,
            ...h
          };
        });
        this.datosTramite = fa
      })

      this.formularioRespuesta = this.fb.group({
        mensaje_adicion   : ['', Validators.required],
        tipo_observacion  : ['', Validators.required],
      });

      // ******************** SOLICITUD CONVERSACION ********************
      this.solicitudService.getSolicitudConversacionById(this.solicitud_id).subscribe((result:any) => {
        // console.log(result)
        this.solicitudConversacion = result
      })

    });

  }

  desencriptarConAESBase64URL(textoEnBase64URL:string, clave:string) {
    const textoEncriptado     = textoEnBase64URL.replace(/-/g, '+').replace(/_/g, '/');
    const bytesDesencriptados = CryptoJS.AES.decrypt(textoEncriptado, clave);
    const textoDesencriptado  = bytesDesencriptados.toString(CryptoJS.enc.Utf8);
    return textoDesencriptado;
  }

  sanear(){

    let da = {
      tipo_cambio       : 1,
      solicitud         : this.solicitud_id,
      serialExtRegistros: this.datosCiudadano.SerialExtRegistros,
      nro_cedula        : this.datosCiudadano.NroCedulaBolExtRegistros,
      id_unico_extr     : this.datosCiudadano.IdUnicoExtRegistros,
      usuario           : this.usuario.id
    }


    this.extranjeriaService.saneoCambioBandejaSqlServer(da).subscribe((result:any) => {
      if(result.Resultado){
        this.solicitudService.sanearDirectiva0082019(da).subscribe((resul:any) => {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "¡EXITO!",
            text: "EL CASO SE DESBLOQUEO CON EXITO",
            showConfirmButton: false,
            timer: 5000,
            allowOutsideClick: false
          });
          setTimeout(() => {
            this.routerLink.navigate(['/asignacion']);
          }, 5000);
        });
      }else{
        Swal.fire({
          position: "top-end",
          icon: "warning",
          title: "¡ALERTA!",
          text: "ALGO OCURRIO POR FAVOR REVISAR",
          showConfirmButton: false,
          timer: 5000,
          allowOutsideClick: false
        });
      }
    })
  }

  enviarRespesta(){

    let datos = {
      solicitud_id: this.solicitud_id,
      usuario_id  : this.usuario.id,
      mensaje     : this.formularioRespuesta.value.mensaje_adicion,
      estado      : this.formularioRespuesta.value.tipo_observacion,
      tipo        : "RESPUESTA",
    }

    this.solicitudService.saveSolicitudConversacionRespuesta(datos).subscribe((result:any) => {
      console.log(result)
      if(result == 1){
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "¡EXITO!",
          text: "SE REGISTRO EL COMENTARIO",
          showConfirmButton: false,
          timer: 5000,
          allowOutsideClick: false
        });
        setTimeout(() => {
          this.routerLink.navigate(['/asignacion']);
        }, 5000);
      }else{

      }
    })
  }
}
