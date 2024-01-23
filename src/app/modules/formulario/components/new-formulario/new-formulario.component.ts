import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormularioService } from '../../../shared/services/formulario.service';

@Component({
  selector: 'app-new-formulario',
  templateUrl: './new-formulario.component.html',
  styleUrl: './new-formulario.component.css'
})
export class NewFormularioComponent implements OnInit  {

  public formularioForm !: FormGroup

  private fb                = inject(FormBuilder);
  private dialogRef         = inject(MatDialogRef<NewFormularioComponent>)
  public  data              = inject(MAT_DIALOG_DATA);
  private formularioService = inject(FormularioService)

  ngOnInit(): void {

    this.formularioForm = this.fb.group({
      nombre: ['', Validators.required],
      sigla : ['', Validators.required]
    });

  }

  onSave(){

    let data = {
      nombre: this.formularioForm.get('nombre')?.value,
      sigla : this.formularioForm.get('sigla')?.value,
    }

    if(this.data != null){
      // let  id = this.data.id;
      // this.formularioService.updateRol(data, id).subscribe((resul:any) => {
      //   this.dialogRef.close(1)
      // },(error:any) => {
      //   this.dialogRef.close(2)
      // })
    }else{
      this.formularioService.saveFormulario(data).subscribe(resul => {
        this.dialogRef.close(1)
      }, (error : any) =>{
        this.dialogRef.close(2)
      })
    }

  }

  onCancel(){

  }

}
