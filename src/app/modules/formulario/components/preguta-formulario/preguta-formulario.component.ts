import { Component, OnInit, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { FormularioService } from '../../../shared/services/formulario.service';
import { MatDialog } from '@angular/material/dialog';
import { NewPregutaFormularioComponent } from '../new-preguta-formulario/new-preguta-formulario.component';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-preguta-formulario',
  templateUrl: './preguta-formulario.component.html',
  styleUrl: './preguta-formulario.component.css'
})
export class PregutaFormularioComponent implements OnInit {

                   dataSourcePreguntasFormulario = new MatTableDataSource<FormularioPreguntaElement>();
  displayedColumns: String[]                     = ['id', 'nombre', 'acciones'];

  private route             = inject(ActivatedRoute);
  private formularioService = inject(FormularioService);
  private router            = inject(Router);
  public  dialog            = inject(MatDialog);
  private snackBar          = inject(MatSnackBar);



  private formulario_id: any;
  private dataNew      : boolean = true;



  ngOnInit(): void {
    this.route.params.subscribe(params => {

      // console.log(params)

      const idEncriptado = params['formulario_id']; // Obteniendo el valor de 'tipo_saneo' de la URL
      this.formulario_id = this.desencriptarConAESBase64URL(idEncriptado, 'ESTE ES JOEL');

      // console.log(this.formulario_id);
      this.getPreguntasFormulario(this.formulario_id);
      // console.log(dato)

      // const idDesencriptado = this.desencriptar(idEncriptado); // Desencriptar el valor
      // console.log('ID desencriptado:', idDesencriptado);
      // Aquí puedes hacer lo que necesites con el ID desencriptado
    });
  }

  openTipoSaneoDialog(){
    const dialogRef = this.dialog.open( NewPregutaFormularioComponent, {
      width: '405px',
      data: {
        newData          : this.dataNew,
        formulario_id: this.formulario_id,
        // tipo_saneo   : this.tipo_saneo,
        // tipo_saneo_id: this.tipo_saneo_id,
      },
      // data: {name: this.name, animal: this.animal},
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      if(result == 1){
        this.openSnackBar('USUARIO REGISTADO CON EXITO','Exitosa');
        this.getPreguntasFormulario(this.formulario_id);
      }else if(result == 2){
        this.openSnackBar('SE PRODUCO UN ERROR','Error');
      }
    });
  }

  edit(id:any, nombre:any){
    this.dataNew = false;
  }

  desencriptarConAESBase64URL(textoEnBase64URL:string, clave:string) {
    const textoEncriptado     = textoEnBase64URL.replace(/-/g, '+').replace(/_/g, '/');
    const bytesDesencriptados = CryptoJS.AES.decrypt(textoEncriptado, clave);
    const textoDesencriptado  = bytesDesencriptados.toString(CryptoJS.enc.Utf8);
    return textoDesencriptado;
  }

  getPreguntasFormulario(id:any){
    this.formularioService.getFormularioPregunta(id).subscribe({
      next: (datos:any) => {
        console.log(datos)
        // this.tipo_saneo = dato
        this.procesarPreguntasFormularioResponse(datos)
      },
      error: (error:any) => {

      }
    })
  }

  procesarPreguntasFormularioResponse(resp:any){
    const dataTiposSaneo: FormularioPreguntaElement[] = [];
    let listadoTipoSaneos = resp
    listadoTipoSaneos.forEach((element:FormularioPreguntaElement) => {
      dataTiposSaneo.push(element)
    })
    this.dataSourcePreguntasFormulario = new MatTableDataSource<FormularioPreguntaElement>(dataTiposSaneo)
  }

  openSnackBar(message:string, action:string): MatSnackBarRef<SimpleSnackBar>{
    return this.snackBar.open(message, action,{
      duration:2000
    });
  }

}

export interface FormularioPreguntaElement{
  id       : number,
  nombre   : string,
  tipo     : string,
  requerido: boolean
}
