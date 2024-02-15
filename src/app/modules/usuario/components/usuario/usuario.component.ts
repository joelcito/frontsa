import { Component, OnInit, inject } from '@angular/core';
import { UsuarioService } from '../../../shared/services/usuario.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { NewUsuarioComponent } from '../new-usuario/new-usuario.component';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { UserRolComponent } from '../user-rol/user-rol.component';
import { Observable } from 'rxjs';
import { RolService } from '../../../shared/services/rol.service';
import { RolElement } from '../../../rol/components/rol/rol.component';

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
  private rolService     = inject(RolService);

  // displayedColumns: String[]       = ['id', 'usuario','activo', 'acciones'];
  displayedColumns: String[]       = ['nombres', 'primer_apellido', 'segundo_apellido', 'usuario','activo', 'acciones'];
                   dataSource      = new MatTableDataSource<UsuarioElement>();

  private menuNav : any[] = [];
  public  roles: any[]    = [];


  ngOnInit(): void {
   this.getUsuarios();
   this.getRoles();
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
      width: '1000px',
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

  edit(id:string, cedula:string, complemento:string, departamento:string, estado:string, nombre_cargo:string, nombre_dependencia:string, nombre_organizacion:string, nombres:string, primer_apellido:string, segundo_apellido:string, username:string){
    const dialogRef = this.dialog.open( NewUsuarioComponent, {
      width: '1000px',
      data: {
        id                 : id,
        cedula             : cedula,
        complemento        : complemento,
        departamento       : departamento,
        nombre_cargo       : nombre_cargo,
        nombre_dependencia : nombre_dependencia,
        nombre_organizacion: nombre_organizacion,
        nombres            : nombres,
        primer_apellido    : primer_apellido,
        segundo_apellido   : segundo_apellido,
        username           : username,
        estado             : estado
      },
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      if(result == 1){
        this.openSnackBar('USUARIO REGISTADO ACTUALIZADO','Exitosa');
        this.getUsuarios();
      }else if(result == 2){
        this.openSnackBar('SE PRODUCO UN ERROR AL ACTUALIZAR','Error');
      }

    });
  }


  opcionesVer(datos:any, id:any){

    // console.log(datos)

    this.menuNav = this.usuarioService.getMenuNavData();
    const dialogRef = this.dialog.open( UserRolComponent, {
      width: '405px',
      data: {
        datos  : datos,
        menus  : this.menuNav,
        roles  : this.roles,
        usuario: id
      },
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      if(result == 1){
        this.openSnackBar('USUARIO REGISTADO ACTUALIZADO','Exitosa');
        this.getUsuarios();
      }else if(result == 2){
        this.openSnackBar('SE PRODUCO UN ERROR AL ACTUALIZAR','Error');
      }

    });

  }

  getRoles(){
    this.rolService.getRoles().subscribe(resul => {
      this.roles = resul as RolElement[];
    })
  }
}

export interface UsuarioElement{
  id: number;
  usuario: string;
  activo: boolean;
}
