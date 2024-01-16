import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TipoSaneoService } from '../../../shared/services/tipo-saneo.service';

@Component({
  selector: 'app-new-detalle-tipo-saneo',
  templateUrl: './new-detalle-tipo-saneo.component.html',
  styleUrl: './new-detalle-tipo-saneo.component.css'
})

export class NewDetalleTipoSaneoComponent implements OnInit  {

  private fb               = inject(FormBuilder);
  public  data             = inject(MAT_DIALOG_DATA); //con este injectamos de otro componete pasamos las VARIABLES
  private tipoSaneoService = inject(TipoSaneoService);
  private dialogRef        = inject(MatDialogRef<NewDetalleTipoSaneoComponent>)



  public newDetalleTipoSaneoForm!: FormGroup;
  public tipos_saneos:any;
  private tipo_saneo_id:any;


  ngOnInit(): void {

    // console.log(this.data)
    this.tipos_saneos  = this.data.tipo_saneo;
    this.tipo_saneo_id = this.data.tipo_saneo_id

    this.newDetalleTipoSaneoForm = this.fb.group({
      nombre   : ['', Validators.required],
      // tipoSaneo: [Number(this.tipo_saneo_id), Validators.required, ]
      tipoSaneo: [{ value: Number(this.tipo_saneo_id), disabled: true }, Validators.required]
      // tipoSaneo: [{valeu : Number(this.tipo_saneo_id), disabled:true}, Validators.required, ]
      // tipoSaneo: [0, Validators.required]
    });

    // this.newTipoSaneoForm.get('tipoSaneo')?.readonly = true;

  }

  onSave(){
    this.newDetalleTipoSaneoForm.get('tipoSaneo')?.enable()
    console.log(this.newDetalleTipoSaneoForm.value)
    let datos = this.newDetalleTipoSaneoForm.value
    this.tipoSaneoService.saveDetalleTipoSaneo(datos).subscribe((result:any) => {
      this.dialogRef.close(1)
    },(error:any) => {
      this.dialogRef.close(2)
    })
  }

  onCancel(){

  }

}
