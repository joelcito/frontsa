import { Component, OnInit, inject } from '@angular/core';
import { TipoSaneoService } from '../../../shared/services/tipo-saneo.service';
import { TipoSaneoElement } from '../../../tipo_saneo/components/tipo-saneo/tipo-saneo.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalNewSolicitudComponent } from '../modal-new-solicitud/modal-new-solicitud.component';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-new-tipo-solicitud',
  templateUrl: './new-tipo-solicitud.component.html',
  styleUrl: './new-tipo-solicitud.component.css'
})
export class NewTipoSolicitudComponent  implements OnInit{

  private tipoSaneoService = inject(TipoSaneoService);
  public  dialog           = inject(MatDialog);
  private snackBar         = inject(MatSnackBar);

  // public tiposSaneos:TipoSaneoElement [] = [] ;
  public tiposSaneos:any ;

  ngOnInit(): void {
    this.getTiposSaneo()
  }

  getTiposSaneo(){
    this.tipoSaneoService.getTiposSaneos().subscribe(resul => {
      console.log(resul)
      this.tiposSaneos = resul
    })
  }

  abreModalNewSolicitud(element:any){
    const dialogRef = this.dialog.open( ModalNewSolicitudComponent, {
      width: '500px',
      data: {
        tipo: element,
        // animal: this.animal
      },
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      if(result == 1){
        this.openSnackBar('SE REGISTRO CON EXITO','Exitosa');
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

  // getTiposSaneo(){
  //   this.tipoSaneoService.getTiposSaneos().subscribe({
  //     next: (datos:any) => {
  //       // console.log(datos)
  //       this.procesarTiposSaneosResponse(datos)
  //     },
  //     error: (error:any) => {

  //     }
  //   })
  // }

  // procesarTiposSaneosResponse(resp:any){
  //   const dataTiposSaneo: TipoSaneoElement[] = [];
  //   let listadoTipoSaneos = resp
  //   listadoTipoSaneos.forEach((element:TipoSaneoElement) => {
  //     dataTiposSaneo.push(element)
  //   })
  //   this.dataSourceTipoSaneo = new MatTableDataSource<TipoSaneoElement>(dataTiposSaneo)
  // }

}
