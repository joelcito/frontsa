import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { SolicitudService } from '../../../../../shared/services/solicitud.service';
import { DatePipe } from '@angular/common';
import { ExtranjeriaService } from '../../../../../shared/services/extranjeria.service';
import { FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';

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
  private routerLink         = inject(Router);

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
  public  listadoDocumentos: any = []

  ngOnInit(): void {
    this.usuario = sessionStorage.getItem('datos');
    this.router.params.subscribe(params => {

      const idEncriptado       = params['solicitud_id'];
      this.solicitud_id  = this.desencriptarConAESBase64URL(idEncriptado, 'ESTE ES JOEL');
      this.solictudNuber = this.solicitud_id
      this.solicitudservice.findByIdsolicitud(this.solicitud_id).subscribe((result:any) => {

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

        // ******************** PARA LOS ARCHIVOS DE LA SOLICITUD ********************
        this.solicitudservice.getSolicitudArchivosById(this.solicitud_id).subscribe((result:any) =>{
          this.listadoDocumentos = result
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

    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "¡EXITO!",
      text: "EL CASO SE PROCESO CON EXITO",
      showConfirmButton: false,
      timer: 5000,
      allowOutsideClick: false
    });


    setTimeout(() => {
      this.routerLink.navigate(['/asignacion']);
    }, 5000);
    // this.solicitudservice.sanearBajaOrpeNaturalizado(this.listadotramites).subscribe((resul:any) => {

    // })
  }

  descargarArchivo(doc:any){
    const url = doc.location;
    window.open(url, "_blank");
  }
}
