import { Component, OnInit, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AsignacionService } from '../../../shared/services/asignacion.service';
import { environment } from '../../../../../environment/environment';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';


@Component({
  selector: 'app-asignacion',
  templateUrl: './asignacion.component.html',
  styleUrl: './asignacion.component.css'
})

export class AsignacionComponent implements OnInit {

                   dataSourceSolicitud = new MatTableDataSource<AsignacionElemnt>();
  displayedColumns: string[]           = ['id', 'descripcion', 'solicitante', 'fechaSolicitud', 'fechaRespuesta', 'estado', 'acciones'];

  private asignacionService = inject(AsignacionService);
  private router            = inject(Router);

  ngOnInit(): void {
    this.getAsignaciones()
  }

  getAsignaciones(){
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
    this.asignacionService.getAsignaicones(dato).subscribe({
      next: (datos:any) => {
        this.procesarTiposSaneosResponse(datos)
      },
      error: (error:any) => {

      }
    })
  }

  procesarTiposSaneosResponse(resp:any){
    const dataTiposSaneo: AsignacionElemnt[] = [];
    let listadoTipoSaneos = resp
    listadoTipoSaneos.forEach((element:AsignacionElemnt) => {
      dataTiposSaneo.push(element)
    })
    this.dataSourceSolicitud = new MatTableDataSource<AsignacionElemnt>(dataTiposSaneo)
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

  encriptarConAESBase64URL(id:string, clave:string) {
    const textoAEncriptar = id.toString();
    const textoEncriptado = CryptoJS.AES.encrypt(textoAEncriptar, clave).toString();
    const textoEnBase64URL = this.base64URL(textoEncriptado);
    return textoEnBase64URL;
  }

  base64URL(cadena:string) {
    return cadena.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
  }

}

export interface AsignacionElemnt{
  id            : number,
  descripcion   : string,
  fechaSolicitud: Date,
  fechaRespuesta: Date
}
