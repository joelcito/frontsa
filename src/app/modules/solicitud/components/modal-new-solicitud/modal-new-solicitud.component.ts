import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TipoSaneoService } from '../../../shared/services/tipo-saneo.service';
import { FormularioService } from '../../../shared/services/formulario.service';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../../../environment/environment';


@Component({
  selector: 'app-modal-new-solicitud',
  templateUrl: './modal-new-solicitud.component.html',
  styleUrl: './modal-new-solicitud.component.css'
})
export class ModalNewSolicitudComponent implements OnInit{

  public  soliForm !   : FormGroup
  private tipo_saneo_id: any
  private formulario_id: any

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
      title: "¿Estas seguro de crear la solicitud?",
      text: "¡No podras revertir eso!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, crear"
    }).then((result) => {
      if (result.isConfirmed) {

        this.tipo_saneo_id = this.soliForm.value.tipo_saneo_id;
        this.formulario_id = this.soliForm.value.formulario_id;

        this.dialogRef.close(1)

        const tipo_saneo_id_encry = this.encriptarConAESBase64URL(this.tipo_saneo_id, 'ESTE ES JOEL');
        const formulario_id_encry = this.encriptarConAESBase64URL(this.formulario_id, 'ESTE ES JOEL');
        const sistema             = "extranjeria";
        const pregunta_respuesta  = "pregunta";

        let datos = {
          sistema            : "extranjeria",
          pregunta_respuesta : "pregunta",
          formulario         : this.formulario_id,
          tipo_saneo_id_encry: tipo_saneo_id_encry,
          formulario_id_encry: formulario_id_encry
        }

        // let res = environment.getUrlSolicitudAsignacionRespuesta(sistema,"", pregunta_respuesta, this.formulario_id, formulario_id_encry,  tipo_saneo_id_encry)
        let res = environment.getUrlSolicitudAsignacionRespuesta(datos)
        this.router.navigate(res);

        // if(this.formulario_id === 1){ // CAMBIO DE BANDEJA
        //   this.router.navigate(['/solicitud/newTipoSolicitud/newFormulario/', tipo_saneo_id_encry, formulario_id_encry]);
        // }else if(this.formulario_id === 2){ // DIRECTIVA 008/2019
        //   this.router.navigate(['/solicitud/newTipoSolicitud/newFormularioDirectiva0082019/', tipo_saneo_id_encry, formulario_id_encry]);
        // }










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

  encriptarConAESBase64URL(id:string, clave:string) {
    const textoAEncriptar = id.toString();
    const textoEncriptado = CryptoJS.AES.encrypt(textoAEncriptar, clave).toString();
    const textoEnBase64URL = this.base64URL(textoEncriptado);
    return textoEnBase64URL;
  }

  base64URL(cadena:string) {
    return cadena.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
  }

}
