import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { SolicitudService } from '../../../../../shared/services/solicitud.service';
import { DatePipe } from '@angular/common';
import { ExtranjeriaService } from '../../../../../shared/services/extranjeria.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formulario-solicitud-correccion-cie-respuesta',
  templateUrl: './formulario-solicitud-correccion-cie-respuesta.component.html',
  styleUrl: './formulario-solicitud-correccion-cie-respuesta.component.css'
})

export class FormularioSolicitudCorreccionCieRespuestaComponent implements OnInit{

  private route              = inject(ActivatedRoute);
  private solicitudService   = inject(SolicitudService);
  private datePipe           = inject(DatePipe);
  private extranjeriaService = inject(ExtranjeriaService);
  private routerLink         = inject(Router);


  public  solictudNuber: any
  private solicitud_id : any
  public  usuario      : any;

  public datos_actuales:any     = []
  public listadoDocumentos: any = []
  public datos_nuevos:any       = []
  public datosTramite   : any   = []

  public datosCiudadano : any = {};

  public datosOficina:any   = {
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

        // ******************** PARA LOS ARCHIVOS DE LA SOLICITUD ********************
        this.solicitudService.getSolicitudArchivosById(this.solicitud_id).subscribe((result:any) =>{
          this.listadoDocumentos = result
        })
      })

      console.log(this.datosCiudadano)


      // ******************** DATOS DEL TRAMITE ********************
      this.solicitudService.tramitesSolicitudesByIdSolicitud(this.solicitud_id).subscribe((resul:any) => {
        let i = 0
        let j = 1
        while(i < resul.length && j < resul.length){

          console.log(this.datosCiudadano)

          let fa:any = {
            campo    : ((resul[i].pregunta).split('_'))[1],
            actual   : resul[i].respuesta,
            modificar: resul[j].respuesta,



          }
          this.datosTramite.push(fa)
          i = i + 2;
          j = j + 2;
        }
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
    let ver = {
      modificacion      : this.datosTramite,
      serialExtRegistros: this.datosCiudadano.SerialExtRegistros,
      nro_cedula        : this.datosCiudadano.NroCedulaBolExtRegistros,
      id_unico          : this.datosCiudadano.IdUnicoExtRegistros
    }

    this.extranjeriaService.saneoCorrecionCIESqlServer(ver).subscribe((result:any) => {

      // Construir HTML para los campos modificados
      var htmlCamposModificados = "<p style='color: #59C534;'>Campos modificados:</p><ul>";
      htmlCamposModificados += "</ul>";
      var htmlCamposModificadosCont = 0
      var veriSaneoCompletado = true

      // Construir HTML para los campos no modificados
      var htmlCamposNoModificados = "<p style='color: #AA280E;'>Campos no modificados:</p><ul>";
      htmlCamposNoModificados += "</ul>";
      var htmlCamposNoModificadosCont = 0

      result.forEach((item:any) => {
        if(item.respuesta){
          htmlCamposModificados += "<li>" + item.campo + "</li>";
          htmlCamposModificadosCont++;
        }else{
          veriSaneoCompletado = false
          htmlCamposNoModificados += "<li>" + item.campo + "</li>";
          htmlCamposNoModificadosCont++;
        }
      })

      if(htmlCamposModificadosCont === 0)
        htmlCamposModificados = "";

      if(htmlCamposNoModificadosCont === 0)
        htmlCamposNoModificados = "";

      if(veriSaneoCompletado){

        let da = {
          solicitud         : this.solicitud_id,
          usuario           : JSON.parse(this.usuario).id
        }

        this.solicitudService.sanearDirectiva0082019(da).subscribe((resul:any) => {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "¡EXITO!",
            text: "EL TRAMITE SE RESOLVIO CON EXITO",
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
          title: "¡ATENCION!",
          // text: "EL CASO SE DESBLOQUEO CON EXITO",
          html :`
              <div>
                <p>DETALLE DE CAMPOS MODIFICADOS</p>
                ${htmlCamposModificados}
                ${htmlCamposNoModificados}
              </div>
              `,
          showConfirmButton: false,
          timer: 10000,
          allowOutsideClick: false
        });
      }
    })
  }

  descargarArchivo(doc:any){
    const url = doc.location;
    window.open(url, "_blank");
  }
}
