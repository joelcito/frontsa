import { Component, OnInit, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { DetalleTipoSaneoElement } from '../detalle-tipo-saneo/detalle-tipo-saneo.component';
import * as CryptoJS from 'crypto-js';
import { TipoSaneoService } from '../../../shared/services/tipo-saneo.service';
import { MatDialog } from '@angular/material/dialog';
import { NewDocumentoDetalleTipoSaneoComponent } from '../new-documento-detalle-tipo-saneo/new-documento-detalle-tipo-saneo.component';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-documento-detalle-tipo-saneo',
  templateUrl: './documento-detalle-tipo-saneo.component.html',
  styleUrl: './documento-detalle-tipo-saneo.component.css'
})

export class DocumentoDetalleTipoSaneoComponent implements OnInit {

  // private router           = inject(Router);
  private route            = inject(ActivatedRoute);
  private tipoSaneoService = inject(TipoSaneoService);
  public  dialog           = inject(MatDialog);
  private snackBar         = inject(MatSnackBar);



  dataSourceDocumentoDetalleTipoSaneo = new MatTableDataSource<DocumentoDetalleTipoSaneoElement>();

          // displayedColumns     : String[]      = ['id', 'tipo_saneo','detalle_tipo_saneo', 'nombre', 'acciones'];
          displayedColumns     : String[]      = ['tipo_saneo','detalle_tipo_saneo', 'nombre', 'acciones'];
  private tipo_saneo_id        : any;
  private detalle_tipo_saneo_id: any;
  private detalle_tipo_saneo   : any = [];



  ngOnInit(): void {
    this.route.params.subscribe(params => {

      // console.log(params)

      const idEncriptadoTipoSaneamiento        = params['tipo_saneo_id'];                                                               // Obteniendo el valor de 'tipo_saneo' de la URL
      const idEncriptadoDetalleTipoSaneamiento = params['detalle_tipo_saneo_id'];                                                       // Obteniendo el valor de 'tipo_saneo' de la URL
            this.tipo_saneo_id                 = this.desencriptarConAESBase64URL(idEncriptadoTipoSaneamiento, 'ESTE ES JOEL');
            this.detalle_tipo_saneo_id         = this.desencriptarConAESBase64URL(idEncriptadoDetalleTipoSaneamiento, 'ESTE ES JOEL');

      // console.log(this.tipo_saneo_id,this.detalle_tipo_saneo_id)

      this.getDocumentoDetalleTipoSaneo(this.detalle_tipo_saneo_id);
      this.getDetalleTiposSaneo(this.tipo_saneo_id);

      // console.log(this.detalle_tipo_saneo)

      // this.getDocumentoDetalleTipoSaneo(this.tipo_saneo_id);

      // this.getDetalleTiposSaneo(this.tipo_saneo_id);

      // const idDesencriptado = this.desencriptar(idEncriptado); // Desencriptar el valor
      // console.log('ID desencriptado:', idDesencriptado);
      // Aquí puedes hacer lo que necesites con el ID desencriptado
    });

    // this.getDetalleTiposSaneo(this.tipo_saneo_id);
    // console.log(this.tipo_saneo_id)

  }

  edit(id:string, nombre:string, descripcion:string){
    console.log(id, nombre, descripcion);
  }

  openTipoSaneoDialog(){
    const dialogRef = this.dialog.open( NewDocumentoDetalleTipoSaneoComponent, {
      width: '405px',
      data: {
        detalles_tipo_saneo   : this.detalle_tipo_saneo,
        detalle_tipo_saneo_id: this.detalle_tipo_saneo_id,
      },
      // data: {name: this.name, animal: this.animal},
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      if(result == 1){
        this.openSnackBar('USUARIO REGISTADO CON EXITO','Exitosa');
        // console.log("se che")
        this.getDocumentoDetalleTipoSaneo(this.detalle_tipo_saneo_id);
        // this.getDetalleTiposSaneo(this.tipo_saneo_id);
      }else if(result == 2){
        this.openSnackBar('SE PRODUCO UN ERROR','Error');
      }
    });
  }

  desencriptarConAESBase64URL(textoEnBase64URL:string, clave:string) {
    const textoEncriptado     = textoEnBase64URL.replace(/-/g, '+').replace(/_/g, '/');
    const bytesDesencriptados = CryptoJS.AES.decrypt(textoEncriptado, clave);
    const textoDesencriptado  = bytesDesencriptados.toString(CryptoJS.enc.Utf8);
    return textoDesencriptado;
  }

  getDocumentoDetalleTipoSaneo(id:any){
    this.tipoSaneoService.getDocumentoDetalleTipoSaneo(id).subscribe({
      next: (datos:any) => {
        // console.log(datos)
        // this.tipo_saneo = dato
        this.procesarDocumentoDetalleTiposSaneosResponse(datos)
      },
      error: (error:any) => {

      }
    })
  }

  procesarDocumentoDetalleTiposSaneosResponse(resp:any){
    const dataTiposSaneo: DocumentoDetalleTipoSaneoElement[] = [];
    let listadoTipoSaneos = resp
    listadoTipoSaneos.forEach((element:DocumentoDetalleTipoSaneoElement) => {
      dataTiposSaneo.push(element)
    })
    this.dataSourceDocumentoDetalleTipoSaneo = new MatTableDataSource<DocumentoDetalleTipoSaneoElement>(dataTiposSaneo)
  }

  openSnackBar(message:string, action:string): MatSnackBarRef<SimpleSnackBar>{
    return this.snackBar.open(message, action,{
      duration:2000
    });
  }

  getDetalleTiposSaneo(id:any){
    // console.log(id)
    this.tipoSaneoService.getDetalleTiposSaneo(id).subscribe(resul => {
      this.detalle_tipo_saneo = resul
      // console.log(resul)
    })
  }

}

export interface DocumentoDetalleTipoSaneoElement{
  id                : number;
  nombre            : string;
  detalleTipoSaneo  : any;
}
