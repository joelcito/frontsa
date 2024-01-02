import { Component, OnInit, inject } from '@angular/core';
import { UsuarioService } from '../../../shared/services/usuario.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { NewUsuarioComponent } from '../new-usuario/new-usuario.component';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})

export class UsuarioComponent implements OnInit{

  // con esto injectamos
  private usuarioService = inject(UsuarioService);
  public  dialog         = inject(MatDialog);
  private snackBar       = inject(MatSnackBar);

  displayedColumns: String[]  = ['id', 'usuario','activo', 'acciones'];
                   dataSource = new MatTableDataSource<UsuarioElement>();

  ngOnInit(): void {
   this.getUsuarios();
  }



  getUsuarios(): void{
    this.usuarioService.getUsuarios().subscribe({
      next: (data: any) => {
        this.procesarUsuariosResponse(data);
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  procesarUsuariosResponse(resp:any){

    const dataUsuario: UsuarioElement[] = [];

    // ESTO ES PRA VERIFICAR
    // if(resp.metadata[0].code == "00"){
      let listUsuarios = resp

      listUsuarios.forEach((element: UsuarioElement) => {
        dataUsuario.push(element)
      });

      this.dataSource =  new MatTableDataSource<UsuarioElement>(dataUsuario);
    // }else{

    // }
  }

  openUsuarioDialog(){
    const dialogRef = this.dialog.open( NewUsuarioComponent, {
      width: '405px',
      // data: {name: this.name, animal: this.animal},
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      if(result == 1){
        this.openSnackBar('USUARIO REGISTADO CON EXITO','Exitosa');
        this.getUsuarios();
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
}

export interface UsuarioElement{
  id: number;
  usuario: string;
  activo: boolean;
}
