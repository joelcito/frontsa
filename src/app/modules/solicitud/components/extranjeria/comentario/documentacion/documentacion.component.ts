import { Component, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SolicitudService } from '../../../../../shared/services/solicitud.service';

@Component({
  selector: 'app-documentacion',
  templateUrl: './documentacion.component.html',
  styleUrl: './documentacion.component.css'
})
export class DocumentacionComponent implements OnInit{

  private data             = inject(MAT_DIALOG_DATA);  //con este injectamos de otro componete pasamos las VARIABLES
  private solicitudService = inject(SolicitudService)

  public listadoDocumentos: any = []

  private solicitud_id   : any
  private conversacion_id: any

  ngOnInit(): void {

    this.solicitud_id    = this.data.solicitud_id
    this.conversacion_id = this.data.conversacion_id

    // ******************** PARA LOS ARCHIVOS DE LA SOLICITUD ********************
    this.solicitudService.getSolicitudArchivosById(this.solicitud_id, this.conversacion_id).subscribe((result:any) =>{
      this.listadoDocumentos = result
    })

  }

  descargarArchivo(doc:any){
    const url = doc.location;
    window.open(url, "_blank");
  }


}
