import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import * as CryptoJS from 'crypto-js';
import { SolicitudService } from '../../../../../shared/services/solicitud.service';
import { UsuarioService } from '../../../../../shared/services/usuario.service';
import { ExtranjeriaService } from '../../../../../shared/services/extranjeria.service';
import Swal from 'sweetalert2';

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
  // private usuarioService   = inject(UsuarioService);

  private solicitud_id:any
  public datosOficina:any = {
    departamento: "",
    oficina     : "",
    nombre      : "",
    fecha       : "",
  }

  public solictudNuber:any

  ngOnInit(): void {

    this.route.params.subscribe(params => {

      const idEncriptado      = params['solicitud_id'];
            this.solicitud_id = this.desencriptarConAESBase64URL(idEncriptado, 'ESTE ES JOEL');

            this.solictudNuber = this.solicitud_id

      this.solicitudService.findByIdsolicitud(this.solicitud_id).subscribe((resul:any) => {

        // ******************** DATOS DE LA OFICINA ********************
        this.datosOficina.departamento = resul.usuarioSolicitante.departamento
        this.datosOficina.oficina      = resul.usuarioSolicitante.nombre_organizacion
        this.datosOficina.nombre       = resul.usuarioSolicitante.nombres+" "+resul.usuarioSolicitante.primer_apellido+" "+resul.usuarioSolicitante.segundo_apellido
        this.datosOficina.fecha        = this.datePipe.transform(resul.fechaSolicitud, 'dd/MM/yyyy HH:mm:ss');

        // ******************** DATOS DEL CIUDADANO ********************
        let data = {
          serial : "1Ubzxt1I4n"
        }

        this.extranjeriaService.buscaExtranjeroPorSerial(data).subscribe(resul => {

          console.log(resul)

        })

        console.log(resul)

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
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "SE CORRIGIO CON EXITO",
      // text: "El Caso se le asigno a "+resul.usuarioAsignado.nombres+" "+resul.usuarioAsignado.primer_apellido+" "+resul.usuarioAsignado.segundo_apellido,
      showConfirmButton: false,
      timer: 4000,
      allowOutsideClick: false
    });
  }

}
