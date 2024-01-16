import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TipoSaneoService } from '../../../shared/services/tipo-saneo.service';
import { MatDialog } from '@angular/material/dialog';
import { NewTipoSaneoComponent } from '../new-tipo-saneo/new-tipo-saneo.component';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { sha256 } from 'js-sha256';
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tipo-saneo',
  templateUrl: './tipo-saneo.component.html',
  styleUrl: './tipo-saneo.component.css'
})

export class TipoSaneoComponent implements OnInit {

  private tipoSaneoService = inject(TipoSaneoService);
  public  dialog           = inject(MatDialog);
  private snackBar         = inject(MatSnackBar);
  private cdRef            = inject(ChangeDetectorRef);
  private router           = inject(Router);

                   dataSourceTipoSaneo = new MatTableDataSource<TipoSaneoElement>();
  displayedColumns: String[]           = ['id', 'nombre','descripcion', 'acciones'];


  ngOnInit(): void {
    this.getTiposSaneo()
    // this.getTiposSaneo(); // Tu lógica para obtener los tipos de saneo

    // setTimeout(() => {
    //   this.cdRef.detectChanges(); // Forzar detección de cambios
    // });
  }

  getTiposSaneo(){
    this.tipoSaneoService.getTiposSaneos().subscribe({
      next: (datos:any) => {
        // console.log(datos)
        this.procesarTiposSaneosResponse(datos)
      },
      error: (error:any) => {

      }
    })
  }

  procesarTiposSaneosResponse(resp:any){
    const dataTiposSaneo: TipoSaneoElement[] = [];
    let listadoTipoSaneos = resp
    listadoTipoSaneos.forEach((element:TipoSaneoElement) => {
      dataTiposSaneo.push(element)
    })
    this.dataSourceTipoSaneo = new MatTableDataSource<TipoSaneoElement>(dataTiposSaneo)
  }

  openTipoSaneoDialog(){
    const dialogRef = this.dialog.open( NewTipoSaneoComponent, {
      width: '405px',
      // data: {name: this.name, animal: this.animal},
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      if(result == 1){
        this.openSnackBar('USUARIO REGISTADO CON EXITO','Exitosa');
        this.getTiposSaneo();
      }else if(result == 2){
        this.openSnackBar('SE PRODUCO UN ERROR','Error');
      }

    });
  }

  openSnackBar(message:string, action:string): MatSnackBarRef<SimpleSnackBar>{
    return this.snackBar.open(message, action,{
      duration:2000
    });
  }

  edit(id:string, nombre:string, descripcion:string){
  // edit(element:any){
    // console.log(id, nombre, descripcion);
    // console.log(element);

    const dialogRef = this.dialog.open( NewTipoSaneoComponent, {
      width: '405px',
      data: {id: id, nombre: nombre, descripcion: descripcion},
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      if(result == 1){
        this.openSnackBar('TIPO DE SANEO ACTUALIZADO','Exitosa');
        this.getTiposSaneo();
      }else if(result == 2){
        this.openSnackBar('SE PRODUCO UN ERROR AL ACTUALIZAR','Error');
      }

    });

  }

  viewDetalleTipoSaneo(id:string, nombre:string, descripcion:string){
    console.log(id, nombre, descripcion)
  }


  redirigir(id:any){
    const idEncriptado = this.encriptarConAESBase64URL(id, 'ESTE ES JOEL'); // Encriptar el ID
    this.router.navigate(['/tipo_saneo/', idEncriptado]); // Redirigir a la URL encriptada
  }

  encriptarConAESBase64URL(id:string, clave:string) {
    const textoAEncriptar = id.toString();
    // const textoEncriptado = CryptoJS.AES.encrypt(textoAEncriptar, clave).toString(CryptoJS.enc.Base64);
    const textoEncriptado = CryptoJS.AES.encrypt(textoAEncriptar, clave).toString();
    const textoEnBase64URL = this.base64URL(textoEncriptado);
    return textoEnBase64URL;
  }

  base64URL(cadena:string) {
    return cadena.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
  }

}

export interface TipoSaneoElement{
  id:number;
  nombre:string;
  description:string;
}


