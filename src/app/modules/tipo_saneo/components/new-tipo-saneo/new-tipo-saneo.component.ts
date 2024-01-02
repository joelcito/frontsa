import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TipoSaneoService } from '../../../shared/services/tipo-saneo.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-tipo-saneo',
  templateUrl: './new-tipo-saneo.component.html',
  styleUrl: './new-tipo-saneo.component.css'
})
export class NewTipoSaneoComponent implements OnInit{
  public tipoSaneoForm!: FormGroup;
  private fb               = inject(FormBuilder);
  private tipoSaneoService = inject(TipoSaneoService);
  private dialogRef        = inject(MatDialogRef<NewTipoSaneoComponent>)
  public  data             = inject(MAT_DIALOG_DATA); //con este injectamos de otro componete pasamos las VARIABLES

  ngOnInit(): void {

    this.tipoSaneoForm = this.fb.group({
      nombre     : ['', Validators.required],
      descripcion: ['', Validators.required]
    });

    if(this.data != null)
      this.updateForm(this.data)

  }

  onSave(){
    let data = {
      nombre     : this.tipoSaneoForm.get('nombre')?.value,
      descripcion: this.tipoSaneoForm.get('descripcion')?.value,
    }

    if(this.data != null){
      let  id = this.data.id;
      this.tipoSaneoService.updateTipoSaneo(data, id).subscribe((resul:any) => {
        this.dialogRef.close(1)
      },(error:any) => {
        this.dialogRef.close(2)
      })
    }else{
      this.tipoSaneoService.saveTipoSaneo(data).subscribe(resul => {
        this.dialogRef.close(1)
      }, (error : any) =>{
        this.dialogRef.close(2)
      })
    }
  }

  onCancel(){
    this.dialogRef.close(3)
  }

  updateForm(data:any){
    this.tipoSaneoForm = this.fb.group({
      nombre     : [data.nombre, Validators.required],
      descripcion: [data.descripcion, Validators.required]
    });
  }

}
