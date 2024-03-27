import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import * as CryptoJS from 'crypto-js';
import { SolicitudService } from '../../../../../shared/services/solicitud.service';
import { UsuarioService } from '../../../../../shared/services/usuario.service';
import { ExtranjeriaService } from '../../../../../shared/services/extranjeria.service';
import Swal from 'sweetalert2';
import { RuisegipService } from '../../../../../shared/services/ruisegip.service';
import { environment } from '../../../../../../../environment/environment';

@Component({
  selector: 'app-formulario-solicitud-directiva-008-2019-respuesta',
  templateUrl: './formulario-solicitud-directiva-008-2019-respuesta.component.html',
  styleUrl: './formulario-solicitud-directiva-008-2019-respuesta.component.css'
})
export class FormularioSolicitudDirectiva0082019RespuestaComponent implements OnInit{

  private route              = inject(ActivatedRoute);
  private solicitudService   = inject(SolicitudService);
  private datePipe           = inject(DatePipe);
  private extranjeriaService = inject(ExtranjeriaService)
  private ruisegipService    = inject(RuisegipService)
  private routerLink         = inject(Router);


  public datosOficina:any = {
    departamento: "",
    oficina     : "",
    nombre      : "",
    fecha       : "",
  }

  public datosCiudadano:any = {};
  public datosTramite:any   = {};

  public  solictudNuber        : any;
  private solicitud_id         : any;
  public  usuario              : any;
  public  detalle_tipo_saneo_id: any;


  public solicitud            : any;

  public  listadotramites: any = [];
  public estadosRespuestas:any = [];

  public mostrarBoton!:boolean;


  ngOnInit(): void {
          this.detalle_tipo_saneo_id            = environment.detalle_tipo_saneo_id_directiva_008_2019
    const datosRecuperadosString: string | null = sessionStorage.getItem('datos');
    if (datosRecuperadosString !== null) {
      const datosRecuperados = JSON.parse(datosRecuperadosString);
            this.usuario     = datosRecuperados;
    }

    this.route.params.subscribe(params => {
      const idEncriptado       = params['solicitud_id'];
            this.solicitud_id  = this.desencriptarConAESBase64URL(idEncriptado, 'ESTE ES JOEL');
            this.solictudNuber = this.solicitud_id

      this.solicitudService.findByIdsolicitud(this.solicitud_id).subscribe((resul:any) => {

        this.solicitud = resul

        if(resul.asignado_id === this.usuario.id){
          this.mostrarBoton =   true
          this.estadosRespuestas = [
            {
              nombre: 'OBSERVADO',
              value : 'OBSERVADO'
            },
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
          ]
        }

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

    });

  }

  desencriptarConAESBase64URL(textoEnBase64URL:string, clave:string) {
    const textoEncriptado     = textoEnBase64URL.replace(/-/g, '+').replace(/_/g, '/');
    const bytesDesencriptados = CryptoJS.AES.decrypt(textoEncriptado, clave);
    const textoDesencriptado  = bytesDesencriptados.toString(CryptoJS.enc.Utf8);
    return textoDesencriptado;
  }

  sanear(){

    let datos = {
      cie:this.datosCiudadano.NroCedulaBolExtRegistros
    }

    this.ruisegipService.liberarPciExtranjero(datos).subscribe((resul:any) => {

      if(resul.r === "DESBLOQUEDO" || resul.r === "BLOQUEDO"){
        let da = {
        solicitud: this.solicitud_id,
        usuario  : this.usuario.id
        }
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


        })
      }else{

        Swal.fire({
          position: "top-end",
          icon: "warning",
          title: "¡ALERTA!",
          text: "EL ESTADO DEL CASO ES "+resul.r,
          showConfirmButton: false,
          timer: 5000,
          allowOutsideClick: false
        });

      }
    })
  }
}
