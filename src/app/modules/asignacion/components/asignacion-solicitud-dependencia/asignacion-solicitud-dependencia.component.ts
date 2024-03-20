import { Component, OnInit, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SolicitudService } from '../../../shared/services/solicitud.service';

@Component({
  selector: 'app-asignacion-solicitud-dependencia',
  templateUrl: './asignacion-solicitud-dependencia.component.html',
  styleUrl: './asignacion-solicitud-dependencia.component.css'
})
export class AsignacionSolicitudDependenciaComponent implements OnInit {

  private solicitudService = inject(SolicitudService);

                   dataSourceSolicitud = new MatTableDataSource<AsignacionSolicitudDependencia>();
  displayedColumns: string[]           = ['codigo', 'solicitante_oficina','solicitud_formulario', 'asignado','fechaSolicitud','fechaRespuesta',  'estado' ,'acciones'];


  ngOnInit(): void {
    this.getCasos()
  }

  getCasos(){
    const datosRecuperadosString: string | null = sessionStorage.getItem('datos');
    var dato;
    if(datosRecuperadosString !== null){
      let ko = JSON.parse(datosRecuperadosString);
      console.log(ko)
      dato = {
        id             : ko.id,
        dependencia_id : ko.dependencia_id,
        organizacion_id: ko.organizacion_id,
        jer_org_id     : ko.jer_org_id,
        // rol:
      }
    }else{
      dato = {
        id:"1"
      }
    }

    this.solicitudService.listadoCasos(dato).subscribe({
      next: (datos:any) => {

        console.log(datos)

        this.procesarTiposSaneosResponse(datos)
      },
      error: (error:any) => {

      }
    })
  }

  procesarTiposSaneosResponse(resp:any){
    const dataTiposSaneo: AsignacionSolicitudDependencia[] = [];
    let listadoTipoSaneos = resp
    listadoTipoSaneos.forEach((element:AsignacionSolicitudDependencia) => {
      dataTiposSaneo.push(element)
    })
    this.dataSourceSolicitud = new MatTableDataSource<AsignacionSolicitudDependencia>(dataTiposSaneo)
  }


}

export interface AsignacionSolicitudDependencia{
  id            : number,
  descripcion   : string,
  fechaSolicitud: Date,
  fechaRespuesta: Date
}

