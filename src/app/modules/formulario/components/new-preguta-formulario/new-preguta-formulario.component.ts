import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormularioService } from '../../../shared/services/formulario.service';

@Component({
  selector: 'app-new-preguta-formulario',
  templateUrl: './new-preguta-formulario.component.html',
  styleUrl: './new-preguta-formulario.component.css'
})
export class NewPregutaFormularioComponent  implements OnInit {

  public preguntaFormularioForm !: FormGroup

  private fb                = inject(FormBuilder);
  public  data              = inject(MAT_DIALOG_DATA);
  private formularioService = inject(FormularioService)              //con este injectamos de otro componete pasamos las VARIABLES
  private dialogRef         = inject(MatDialogRef<NewPregutaFormularioComponent>)

  private newData:boolean = false;

  private formulario_id:any

  ngOnInit(): void {

    this.preguntaFormularioForm = this.fb.group({
      nombre   : ['', Validators.required],
      tipo     : ['', Validators.required],
      requerido: ['']
    });

    this.newData       = this.data.newData
    this.formulario_id = this.data.formulario_id

    console.log(Object(this.data).length === 0);
    console.log(this.data);
    console.log(JSON.stringify(this.data).length);

  }

  onSave(){

    console.log(this.preguntaFormularioForm.value);

    let data = {
      nombre    : this.preguntaFormularioForm.get('nombre')?.value,
      tipo      : this.preguntaFormularioForm.get('tipo')?.value,
      requerido : this.preguntaFormularioForm.get('requerido')?.value,
      formulario: this.formulario_id
    }

    // if(this.data != null){
    // if(JSON.stringify(this.data).length > 2){
    if(!this.newData){
      // let  id = this.data.id;
      // this.rolService.updateRol(data, id).subscribe((resul:any) => {
      //   this.dialogRef.close(1)
      // },(error:any) => {
      //   this.dialogRef.close(2)
      // })
    }else{
      this.formularioService.saveFormularioPregunta(data).subscribe(resul => {
        this.dialogRef.close(1)
      }, (error : any) =>{
        this.dialogRef.close(2)
      })
    }
  }

  onCancel(){
    this.dialogRef.close(3)
  }

}
