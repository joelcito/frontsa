import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TipoSaneoService } from '../../../shared/services/tipo-saneo.service';

@Component({
  selector: 'app-new-documento-detalle-tipo-saneo',
  templateUrl: './new-documento-detalle-tipo-saneo.component.html',
  styleUrl: './new-documento-detalle-tipo-saneo.component.css'
})
export class NewDocumentoDetalleTipoSaneoComponent implements OnInit  {

  private fb               = inject(FormBuilder);
  public  data             = inject(MAT_DIALOG_DATA); //con este injectamos de otro componete pasamos las VARIABLES
  private tipoSaneoService = inject(TipoSaneoService);
  private dialogRef        = inject(MatDialogRef<NewDocumentoDetalleTipoSaneoComponent>)

  public  newDocumentoDetalleTipoSaneoForm!: FormGroup;
  public  detalles_tipos_saneos            : any = []
  private detalle_tipo_saneo_id            : any;

  ngOnInit(): void {
    console.log(this.data)

    this.detalles_tipos_saneos            = this.data.detalles_tipo_saneo;
    this.detalle_tipo_saneo_id            = this.data.detalle_tipo_saneo_id;
    this.newDocumentoDetalleTipoSaneoForm = this.fb.group({
      nombre          : ['', Validators.required],
      detalleTipoSaneo: [{ value: Number(this.detalle_tipo_saneo_id) , disabled: true }, Validators.required]
    });
  }

  onSave(){
    this.newDocumentoDetalleTipoSaneoForm.get('detalleTipoSaneo')?.enable()
    // console.log(this.newDocumentoDetalleTipoSaneoForm.value)
    let datos = this.newDocumentoDetalleTipoSaneoForm.value
    this.newDocumentoDetalleTipoSaneoForm.get('detalleTipoSaneo')?.disable()
    this.tipoSaneoService.saveDocumentoDetalleTipoSaneo(datos).subscribe((resul:any) => {
      // console.log(resul)
      this.dialogRef.close(1)
    },(error:any) => {
      this.dialogRef.close(2)
    })




    // this.tipoSaneoService.saveDetalleTipoSaneo(datos).subscribe((result:any) => {
    //   this.dialogRef.close(1)
    // },(error:any) => {
    //   this.dialogRef.close(2)
    // })
  }

  onCancel(){

  }
}
