import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { RolService } from '../../../shared/services/rol.service';
import { NewRolComponent } from '../new-rol/new-rol.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rol',
  templateUrl: './rol.component.html',
  styleUrl: './rol.component.css'
})
export class RolComponent implements OnInit{

  public           dialog              = inject(MatDialog);
  private          snackBar            = inject(MatSnackBar);
  private          rolService          = inject(RolService)
                   dataSourceTipoSaneo = new MatTableDataSource<RolElement>();
  displayedColumns: String[]           = ['id', 'nombre', 'acciones'];

  ngOnInit(): void {
    this.getRol()
  }

  getRol(){
    this.rolService.getRoles().subscribe({
      next: (datos:any) => {
        this.procesarTiposSaneosResponse(datos)
      },
      error: (error:any) => {

      }
    })
  }

  procesarTiposSaneosResponse(resp:any){
    const dataTiposSaneo: RolElement[] = [];
    let listadoTipoSaneos = resp
    listadoTipoSaneos.forEach((element:RolElement) => {
      dataTiposSaneo.push(element)
    })
    this.dataSourceTipoSaneo = new MatTableDataSource<RolElement>(dataTiposSaneo)
  }

  openTipoSaneoDialog(){
    const dialogRef = this.dialog.open( NewRolComponent, {
      width: '405px',
      // data: {name: this.name, animal: this.animal},
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      if(result == 1){
        this.openSnackBar('ROL REGISTADO CON EXITO','Exitosa');
        this.getRol();
      }else if(result == 2){
        this.openSnackBar('SE PRODUCO UN ERROR','Error');
      }

    });
  }

  edit(id:string, nombre:string){
      const dialogRef = this.dialog.open( NewRolComponent, {
        width: '405px',
        data: {id: id, nombre: nombre},
      });

      dialogRef.afterClosed().subscribe((result:any) => {
        if(result == 1){
          this.openSnackBar('TIPO DE SANEO ACTUALIZADO','Exitosa');
          this.getRol();
        }else if(result == 2){
          this.openSnackBar('SE PRODUCO UN ERROR AL ACTUALIZAR','Error');
        }

      });

    }

  openSnackBar(message:string, action:string): MatSnackBarRef<SimpleSnackBar>{
    return this.snackBar.open(message, action,{
      duration:2000
    });
  }

  eliminar(datos:any){
    Swal.fire({
      title: "Estas seguro que deseas eliminar el rol "+datos.nombre+"?",
      text: "¡No podras revertir eso!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.rolService.deleteRol(datos.id).subscribe((result) => {
          console.log(result)
        })

        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "¡EXITO!",
          text: "¡Se elimino con Extio!",
          showConfirmButton: false,
          timer: 3000,
          allowOutsideClick: false
        });
        setTimeout(() => {
          this.getRol()
        }, 2000);
      }
    });
  }

}

export interface RolElement{
  id    : number,
  nombre: string
}
