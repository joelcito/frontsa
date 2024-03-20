import { Component, OnInit, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SolicitudService } from '../../../shared/services/solicitud.service';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../../../environment/environment';

@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrl: './solicitud.component.css'
})
export class SolicitudComponent implements OnInit {

  dataSourceSolicitud = new MatTableDataSource<SolicitudElement>();
  // displayedColumns: string[] = ['id', 'descripcion', 'solicitante', 'fechaSolicitud', 'acciones'];
  displayedColumns: string[] = ['id', 'tipo_caso' , 'asignado', 'fechaSolicitud','fechaRespuesta',  'estado' ,'acciones'];
  // displayedColumns: String[]           = ['id', 'descripcion','solicitante','acciones'];

  private solicitudService = inject(SolicitudService);
  private router           = inject(Router);


  ngOnInit(): void {
    this.getSolicitud()
  }

  inicarSolicitud(){
    this.router.navigate(['/solicitud/newTipoSolicitud']); // Redirigir a la URL encriptada
  }

  edit(id:string,nombre:string){

  }

  getSolicitud(){
    const datosRecuperadosString: string | null = sessionStorage.getItem('datos');
    var dato;
    if(datosRecuperadosString !== null){
      let ko = JSON.parse(datosRecuperadosString);
      dato = {
        id:ko.id
      }
    }else{
      dato = {
        id:"1"
      }
    }

    this.solicitudService.getSolicitud(dato).subscribe({
      next: (datos:any) => {
        this.procesarTiposSaneosResponse(datos)
      },
      error: (error:any) => {

      }
    })
  }

  procesarTiposSaneosResponse(resp:any){
    const dataTiposSaneo: SolicitudElement[] = [];
    let listadoTipoSaneos = resp
    listadoTipoSaneos.forEach((element:SolicitudElement) => {
      dataTiposSaneo.push(element)
    })
    this.dataSourceSolicitud = new MatTableDataSource<SolicitudElement>(dataTiposSaneo)
  }

  recuperarSolicitud(datos:any){
    const tipo_saneo_id_encry = this.encriptarConAESBase64URL(datos.formulario.tipoSaneoFormulario.id, 'ESTE ES JOEL');
    const formulario_id_encry = this.encriptarConAESBase64URL(datos.formulario.id, 'ESTE ES JOEL');
    const solicitud_id_encry  = this.encriptarConAESBase64URL(datos.id, 'ESTE ES JOEL');
    this.router.navigate(['solicitud/newTipoSolicitud/newFormularioCorrecionCie', tipo_saneo_id_encry , formulario_id_encry , solicitud_id_encry]);
  }

  encriptarConAESBase64URL(id:string, clave:string) {
    const textoAEncriptar  = id.toString();
    const textoEncriptado  = CryptoJS.AES.encrypt(textoAEncriptar, clave).toString();
    const textoEnBase64URL = this.base64URL(textoEncriptado);
    return textoEnBase64URL;
  }

  base64URL(cadena:string) {
    return cadena.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
  }

  tipoCasoSaneo(dato:any){
    const idEncriptado                 = this.encriptarConAESBase64URL(dato.id, 'ESTE ES JOEL');   // Encriptar el ID
    let datos = {
      sistema           : "extranjeria",
      pregunta_respuesta: "respuesta",
      formulario        : dato.formulario.id,
      solicitud         : idEncriptado
    }
    let da = environment.getUrlSolicitudAsignacionRespuesta(datos)
    this.router.navigate(da);
  }

}

export interface SolicitudElement{
  id            : number,
  descripcion   : string,
  fechaSolicitud: Date,
  fechaRespuesta: Date
}


