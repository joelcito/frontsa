import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SolicitudService } from '../../../../../shared/services/solicitud.service';
import { DatePipe } from '@angular/common';
import { ExtranjeriaService } from '../../../../../shared/services/extranjeria.service';
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-formulario-convenio-respuesta',
  templateUrl: './formulario-convenio-respuesta.component.html',
  styleUrl: './formulario-convenio-respuesta.component.css'
})
export class FormularioConvenioRespuestaComponent implements OnInit {

  private route              = inject(ActivatedRoute);
  private solicitudService   = inject(SolicitudService);
  private datePipe           = inject(DatePipe);
  private extranjeriaService = inject(ExtranjeriaService);
  private routerLink         = inject(Router);


  public  solictudNuber: any
  private solicitud_id : any
  public  usuario      : any;

  public datosCiudadano:any = {};
  public datosTramite:any   = {};

  public datosOficina:any = {
    departamento: "",
    oficina     : "",
    nombre      : "",
    fecha       : "",
  }

  ngOnInit(): void {

    this.usuario = sessionStorage.getItem('datos');
    this.route.params.subscribe(params => {

      const idEncriptado       = params['solicitud_id'];
            this.solicitud_id  = this.desencriptarConAESBase64URL(idEncriptado, 'ESTE ES JOEL');
            this.solictudNuber = this.solicitud_id

      this.solicitudService.findByIdsolicitud(this.solicitud_id).subscribe((resul:any) => {

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
      })

    })

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
      usuario           : JSON.parse(this.usuario).id
    }
    this.extranjeriaService.saneoCambioBandejaSqlServer(da).subscribe((result:any) => {
      if(result.Resultado){
        this.solicitudService.sanearDirectiva0082019(da).subscribe((resul:any) => {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "¡EXITO!",
            text: "EL CASO SE ACTUALIZO CON EXITO",
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


}
