import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormularioService } from '../../../shared/services/formulario.service';
import { TipoSaneoService } from '../../../shared/services/tipo-saneo.service';

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
  private tipoSaneoService  = inject(TipoSaneoService)

  public tipos_saneos: any
  public usuario     : any;


  ngOnInit(): void {

    this.usuario = sessionStorage.getItem('datos');

    this.tipoSaneoService.getTiposSaneos().subscribe((result:any) => {
      this.tipos_saneos = result
    })
    this.formularioForm = this.fb.group({
      nombre   : ['', Validators.required],
      sigla    : ['', Validators.required],
      tipoSaneo: ['', Validators.required]
    });
  }

  onSave(){

    let data = {
      usuario   : JSON.parse(this.usuario).id,
      nombre    : this.formularioForm.get('nombre')?.value,
      sigla     : this.formularioForm.get('sigla')?.value,
      tipo_saneo: this.formularioForm.get('tipoSaneo')?.value,
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
    this.dialogRef.close(3)
  }

}
