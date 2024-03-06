import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { SolicitudService } from '../../../../../shared/services/solicitud.service';
import { DatePipe } from '@angular/common';
import { ExtranjeriaService } from '../../../../../shared/services/extranjeria.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-formulario-baja-orpe-naturalizacion-respuesta',
  templateUrl: './formulario-baja-orpe-naturalizacion-respuesta.component.html',
  styleUrl: './formulario-baja-orpe-naturalizacion-respuesta.component.css'
})
export class FormularioBajaOrpeNaturalizacionRespuestaComponent implements OnInit {

  private router             = inject(ActivatedRoute);
  private solicitudservice   = inject(SolicitudService);
  private datePipe           = inject(DatePipe);
  private extranjeriaService = inject(ExtranjeriaService)

  // public solicitudFormularioTramite : FormBuilder


  public solictudNuber: any;
  public usuario      : any;
  public solicitud_id : any;

  public datosOficina:any = {
    departamento: "",
    oficina     : "",
    nombre      : "",
    fecha       : "",
  }

  public datosCiudadano:any = {};
  public datosTramite:any   = {};

  public  listadotramites: any = []

  ngOnInit(): void {
    this.usuario = sessionStorage.getItem('datos');
    this.router.params.subscribe(params => {

      const idEncriptado       = params['solicitud_id'];
            this.solicitud_id  = this.desencriptarConAESBase64URL(idEncriptado, 'ESTE ES JOEL');
            this.solictudNuber = this.solicitud_id

            // console.log(this.solicitud_id)

            this.solicitudservice.findByIdsolicitud(this.solicitud_id).subscribe((result:any) => {

              // console.log(result)

              // ******************** DATOS DE LA OFICINA ********************
              this.datosOficina.departamento = result.departamento
              this.datosOficina.oficina      = result.nombre_organizacion
              this.datosOficina.nombre       = result.nombres+" "+result.primer_apellido+" "+result.segundo_apellido
              this.datosOficina.fecha        = this.datePipe.transform(result.fecha_solicitud, 'dd/MM/yyyy HH:mm:ss')

              // // ******************** DATOS DEL CIUDADANO EXTRANJERO ********************
              let data = {
                serial : result.serialextregistros
              }
              this.extranjeriaService.buscaExtranjeroPorSerial(data).subscribe((resultExt:any) => {
                this.datosCiudadano = resultExt
              })

              // ******************** DATOS DEL TRAMITE ********************
              this.solicitudservice.tramitesSolicitudesByIdSolicitud(this.solicitud_id).subscribe((resul:any) => {
                resul.forEach((item:any) => {
                  console.log(item)
                  let g
                  if(item.pregunta == "naturalizado"){
                    g = {
                      nombre: "NATURALIZADO",
                      valor : item.respuesta,
                      dato  : item.pregunta
                    }
                  }else if(item.pregunta == "baja_orpe"){
                    g = {
                      nombre : "BAJA DEL ORPE",
                      valor : item.respuesta,
                      dato  : item.pregunta
                    }
                  }
                  this.listadotramites.push(g)
                })
                // console.log(resul)
                // console.log(this.listadotramites)
              })
            })
      // console.log(params)
    })
  }

  desencriptarConAESBase64URL(textoEnBase64URL:string, clave:string){
    const textoEncriptado     = textoEnBase64URL.replace(/-/g, '+').replace(/_/g, '/');
    const bytesDesencriptados = CryptoJS.AES.decrypt(textoEncriptado, clave);
    const textoDesencriptado  = bytesDesencriptados.toString(CryptoJS.enc.Utf8);
    return textoDesencriptado;
  }

  sanear(){

    this.solicitudservice.sanearBajaOrpeNaturalizado(this.listadotramites).subscribe((resul:any) => {
      console.log(resul)
    })

    console.log(this.listadotramites)

  }
}
