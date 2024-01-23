import { Component, OnInit, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SolicitudService } from '../../../shared/services/solicitud.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrl: './solicitud.component.css'
})
export class SolicitudComponent implements OnInit {

  dataSourceSolicitud = new MatTableDataSource<SolicitudElement>();
  // displayedColumns: string[] = ['id', 'descripcion', 'solicitante', 'fechaSolicitud', 'acciones'];
  displayedColumns: string[] = ['id', 'descripcion', 'solicitante', 'fechaSolicitud', 'acciones'];
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
    this.solicitudService.getSolicitud().subscribe({
      next: (datos:any) => {
        console.log(datos)
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

}

export interface SolicitudElement{
  id            : number,
  descripcion   : string,
  fechaSolicitud: Date,
  fechaRespuesta: Date
}


