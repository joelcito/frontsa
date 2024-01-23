import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { FormularioService } from '../../../shared/services/formulario.service';
import { NewFormularioComponent } from '../new-formulario/new-formulario.component';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';


@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.css'
})

export class FormularioComponent implements OnInit  {

  public  dialog            = inject(MatDialog);
  private snackBar          = inject(MatSnackBar);
  private formularioService = inject(FormularioService);
  private router            = inject(Router);


  dataSourceFormulario = new MatTableDataSource<FormularioElement>();

  displayedColumns: String[]           = ['id', 'sigla', 'nombre', 'acciones'];

  ngOnInit(): void {
    this.getFormularios();
  }

  getFormularios(){
    this.formularioService.getFormulario().subscribe({
      next: (datos:any) => {
        this.procesarTiposSaneosResponse(datos)
      },
      error: (error:any) => {

      }
    })
  }

  procesarTiposSaneosResponse(resp:any){
    const dataTiposSaneo: FormularioElement[] = [];
    let listadoTipoSaneos = resp
    listadoTipoSaneos.forEach((element:FormularioElement) => {
      dataTiposSaneo.push(element)
    })
    this.dataSourceFormulario = new MatTableDataSource<FormularioElement>(dataTiposSaneo)
  }

  openTipoSaneoDialog(){
    const dialogRef = this.dialog.open( NewFormularioComponent, {
      width: '405px',
      // data: {name: this.name, animal: this.animal},
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      if(result == 1){
        this.openSnackBar('ROL REGISTADO CON EXITO','Exitosa');
        this.getFormularios();
      }else if(result == 2){
        this.openSnackBar('SE PRODUCO UN ERROR','Error');
      }

    });
  }

  edit(id:string, nombre:string){
    // const dialogRef = this.dialog.open( NewRolComponent, {
    //   width: '405px',
    //   data: {id: id, nombre: nombre},
    // });

    // dialogRef.afterClosed().subscribe((result:any) => {
    //   if(result == 1){
    //     this.openSnackBar('TIPO DE SANEO ACTUALIZADO','Exitosa');
    //     this.getRol();
    //   }else if(result == 2){
    //     this.openSnackBar('SE PRODUCO UN ERROR AL ACTUALIZAR','Error');
    //   }

    // });

  }

  openSnackBar(message:string, action:string): MatSnackBarRef<SimpleSnackBar>{
    return this.snackBar.open(message, action,{
      duration:2000
    });
  }

  preguntas(id:any){
    const idEncriptado = this.encriptarConAESBase64URL(id, 'ESTE ES JOEL'); // Encriptar el ID
    this.router.navigate(['/formulario/', idEncriptado]); // Redirigir a la URL encriptada
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

export interface FormularioElement{
  id         : number,
  nombre     : string,
  estado     : string,
  sigla      : string,
  descripcion: string,
}
