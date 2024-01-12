import { Component, OnInit, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { TipoSaneoService } from '../../../shared/services/tipo-saneo.service';
import { MatDialog } from '@angular/material/dialog';
import { NewDetalleTipoSaneoComponent } from '../new-detalle-tipo-saneo/new-detalle-tipo-saneo.component';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-detalle-tipo-saneo',
  templateUrl: './detalle-tipo-saneo.component.html',
  styleUrl: './detalle-tipo-saneo.component.css'
})

export class DetalleTipoSaneoComponent implements OnInit  {

  private route            = inject(ActivatedRoute);
  private tipoSaneoService = inject(TipoSaneoService);
  private snackBar         = inject(MatSnackBar);
  public  dialog           = inject(MatDialog);


  dataSourceDetalleTipoSaneo = new MatTableDataSource<DetalleTipoSaneoElement>();

  displayedColumns: String[]      = ['id', 'tipo_saneo','nombre', 'acciones'];
  private          tipo_saneo:any = [];
  private          tipo_saneo_id:any;


  ngOnInit(): void {
    this.route.params.subscribe(params => {

      // console.log(params)

      const idEncriptado = params['id']; // Obteniendo el valor de 'tipo_saneo' de la URL
      this.tipo_saneo_id = this.desencriptarConAESBase64URL(idEncriptado, 'ESTE ES JOEL');
      this.getDetalleTiposSaneo(this.tipo_saneo_id);
      // console.log(dato)

      // const idDesencriptado = this.desencriptar(idEncriptado); // Desencriptar el valor
      // console.log('ID desencriptado:', idDesencriptado);
      // Aquí puedes hacer lo que necesites con el ID desencriptado
    });

    this.getTiposSaneos();
  }

  desencriptarConAESBase64URL(textoEnBase64URL:string, clave:string) {
    const textoEncriptado     = textoEnBase64URL.replace(/-/g, '+').replace(/_/g, '/');
    const bytesDesencriptados = CryptoJS.AES.decrypt(textoEncriptado, clave);
    const textoDesencriptado  = bytesDesencriptados.toString(CryptoJS.enc.Utf8);
    return textoDesencriptado;
  }

  openTipoSaneoDialog(){
    const dialogRef = this.dialog.open( NewDetalleTipoSaneoComponent, {
      width: '405px',
      data: {
        tipo_saneo   : this.tipo_saneo,
        tipo_saneo_id: this.tipo_saneo_id,
      },
      // data: {name: this.name, animal: this.animal},
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      if(result == 1){
        this.openSnackBar('USUARIO REGISTADO CON EXITO','Exitosa');
        this.getDetalleTiposSaneo(this.tipo_saneo_id);
      }else if(result == 2){
        this.openSnackBar('SE PRODUCO UN ERROR','Error');
      }
    });
  }

  edit(id:string, nombre:string, descripcion:string){

  }

  getDetalleTiposSaneo(id:any){
    this.tipoSaneoService.getDetalleTiposSaneo(id).subscribe({
      next: (datos:any) => {
        console.log(datos)
        // this.tipo_saneo = dato
        this.procesarDetalleTiposSaneosResponse(datos)
      },
      error: (error:any) => {

      }
    })
  }

  procesarDetalleTiposSaneosResponse(resp:any){
    const dataTiposSaneo: DetalleTipoSaneoElement[] = [];
    let listadoTipoSaneos = resp
    listadoTipoSaneos.forEach((element:DetalleTipoSaneoElement) => {
      dataTiposSaneo.push(element)
    })
    this.dataSourceDetalleTipoSaneo = new MatTableDataSource<DetalleTipoSaneoElement>(dataTiposSaneo)

  }

  openSnackBar(message:string, action:string): MatSnackBarRef<SimpleSnackBar>{
    return this.snackBar.open(message, action,{
      duration:2000
    });
  }

  getTiposSaneos(){
    this.tipoSaneoService.getTiposSaneos().subscribe(resul => {
      this.tipo_saneo = resul
    })
  }

}

export interface DetalleTipoSaneoElement{
  id                : number;
  nombre            : string;
  detalle_tipo_saneo: any;
}

