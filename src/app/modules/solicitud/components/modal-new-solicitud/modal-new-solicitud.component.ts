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

    this.tipo_saneo_id = this.soliForm.value.tipo_saneo_id;
    this.formulario_id = this.soliForm.value.formulario_id;

    console.log("********************************")
    console.log(this.soliForm.value)
    console.log("********************************")

    this.dialogRef.close(1)

    const tipo_saneo_id_encry = this.encriptarConAESBase64URL(this.tipo_saneo_id, 'ESTE ES JOEL');
    const formulario_id_encry = this.encriptarConAESBase64URL(this.formulario_id, 'ESTE ES JOEL');
    const solicitud_id_encry  = this.encriptarConAESBase64URL("0", 'ESTE ES JOEL');
    const sistema             = "extranjeria";
    const pregunta_respuesta  = "pregunta";

    let datos = {
      sistema            : "extranjeria",
      pregunta_respuesta : "pregunta",
      formulario         : this.formulario_id,
      tipo_saneo_id_encry: tipo_saneo_id_encry,
      formulario_id_encry: formulario_id_encry,
      solicitud          : solicitud_id_encry
    }

    let res = environment.getUrlSolicitudAsignacionRespuesta(datos)
    this.router.navigate(res);

    // Swal.fire({
    //   title: "¿Estas seguro de crear la solicitud?",
    //   text: "¡No podras revertir eso!",
    //   icon: "warning",
    //   showCancelButton: true,
    //   confirmButtonColor: "#3085d6",
    //   cancelButtonColor: "#d33",
    //   confirmButtonText: "Si, crear"
    // }).then((result) => {
    //   if (result.isConfirmed) {



    //   }
    // });
  }

  onCancel(){
    this.dialogRef.close(3)
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
