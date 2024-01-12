import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RolService } from '../../../shared/services/rol.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-rol',
  templateUrl: './new-rol.component.html',
  styleUrl: './new-rol.component.css'
})
export class NewRolComponent implements OnInit {

  public rolForm !: FormGroup

  private fb         = inject(FormBuilder);
  private rolService = inject(RolService);
  private dialogRef  = inject(MatDialogRef<NewRolComponent>)
  public  data       = inject(MAT_DIALOG_DATA);               //con este injectamos de otro componete pasamos las VARIABLES



  ngOnInit(): void {

    this.rolForm = this.fb.group({
      nombre     : ['', Validators.required],
      // descripcion: ['', Validators.required]
    });

    if(this.data != null)
      this.updateForm(this.data);
  }

  onSave(){
    let data = {
      nombre     : this.rolForm.get('nombre')?.value,
      // descripcion: this.tipoSaneoForm.get('descripcion')?.value,
    }

    if(this.data != null){
      let  id = this.data.id;
      this.rolService.updateRol(data, id).subscribe((resul:any) => {
        this.dialogRef.close(1)
      },(error:any) => {
        this.dialogRef.close(2)
      })
    }else{
      this.rolService.saveRol(data).subscribe(resul => {
        this.dialogRef.close(1)
      }, (error : any) =>{
        this.dialogRef.close(2)
      })
    }

  }

  onCancel(){

  }

  updateForm(data:any){
    this.rolForm = this.fb.group({
      nombre     : [data.nombre, Validators.required]
    });
  }

}
