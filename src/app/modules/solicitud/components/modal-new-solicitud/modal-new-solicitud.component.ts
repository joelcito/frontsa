import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TipoSaneoService } from '../../../shared/services/tipo-saneo.service';
import { FormularioService } from '../../../shared/services/formulario.service';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-new-solicitud',
  templateUrl: './modal-new-solicitud.component.html',
  styleUrl: './modal-new-solicitud.component.css'
})
export class ModalNewSolicitudComponent implements OnInit{

  public  soliForm !   : FormGroup
  private tipo_saneo_id: any

  public nameSolictud:string = "";
  public formularios:any     = [];

  private fb   = inject(FormBuilder);
  public  data = inject(MAT_DIALOG_DATA);  //con este injectamos de otro componete pasamos las VARIABLES
  // private tipoSaneoService = inject(TipoSaneoService)
  private formularioService = inject(FormularioService)
  private router            = inject(Router);
  private dialogRef         = inject(MatDialogRef<ModalNewSolicitudComponent>)


  // @Output() formularioEnviado = new EventEmitter<any>();

  ngOnInit(): void {

    console.log(this.data)
    this.nameSolictud  = this.data.tipo.nombre
    this.tipo_saneo_id = this.data.tipo.id

    this.getFormularios(this.tipo_saneo_id);

    this.soliForm = this.fb.group({
      nombre       : [{value : this.nameSolictud, disabled:true}, Validators.required],
      tipo_saneo_id: [this.tipo_saneo_id, Validators.required],
      formulario_id: ['', Validators.required]
    });
  }

  getFormularios(id:any){
    this.formularioService.getFormulariosByIdTipoSaneo(id).subscribe({
      next:(datos:any) => {
        // console.log(datos)
        this.formularios = datos
      },
      error: (error:any) => {

      }
    })
  }

  onSave(){
    Swal.fire({
      title: "Estas seguro de crear la solicitud?",
      text: "No podras reverir eso!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, crear!"
    }).then((result) => {
      if (result.isConfirmed) {

        const tipo_saneo_id = this.soliForm.value.tipo_saneo_id;
        const formulario_id = this.soliForm.value.formulario_id;

        this.dialogRef.close(1)

        // console.log(this.soliForm.value)

        this.router.navigate(['/solicitud/newTipoSolicitud/newFormulario/', tipo_saneo_id, formulario_id]);

        // this.router.navigate(['/solicitud/newTipoSolicitud/newFormulario', tipoSaneoId, formularioId]);

        // this.formularioService.datosEnviados = data;

        // console.log('Datos enviados:', data);
        // this.formularioEnviado.emit(data);

        // Navegar a la ruta del componente hijo (FormularioSolicitudComponent)
        // this.router.navigate(['/solicitud/newTipoSolicitud/newFormulario'], { state: data });





        // const data = this.soliForm.value;
        // this.formularioEnviado.emit(data);

        // console.log(data)

        // // Navegar a otra ruta después de emitir el evento
        // this.router.navigate(['/solicitud/newTipoSolicitud/newFormulario']);



        // console.log(this.soliForm.value)

        // this.formularioEnviado.emit(this.soliForm.value);

        //  // Navegar a otra ruta después de emitir el evento
        // this.router.navigate(['/solicitud/newTipoSolicitud/newFormulario']);

        // const data = { nombre: "JOEL JONATHAN", apellido: "FLORES QUISPE" };
        // this.router.navigate(['solicitud/newTipoSolicitud/newFormulario', data]);

        // const data = { nombre: "JOEL JONATHAN", apellido: "FLORES QUISPE" };
        // this.formularioEnviado.emit(data);

        // this.router.navigate(['solicitud/newTipoSolicitud/newFormulario'], { state: { nombre: "joelcito", apellido: "Flores" } });

        // Swal.fire({
        //   title: "Deleted!",
        //   text: "Your file has been deleted.",
        //   icon: "success"
        // });
      }
    });
  }

  onCancel(){

  }

}
