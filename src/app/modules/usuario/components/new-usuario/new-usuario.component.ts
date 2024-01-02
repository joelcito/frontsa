import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { UsuarioService } from '../../../shared/services/usuario.service';
import { MatDialogRef } from '@angular/material/dialog';
import { ValidadorService } from '../../../shared/services/validador.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-new-usuario',
  templateUrl: './new-usuario.component.html',
  styleUrl: './new-usuario.component.css'
})
export class NewUsuarioComponent implements OnInit  {

  public usuarioForm!: FormGroup;
  private fb                   = inject(FormBuilder);
  private usuarioService       = inject(UsuarioService);
  private dialogRef            = inject(MatDialogRef<NewUsuarioComponent>);
  private validadorService     = inject(ValidadorService);
  private requerimeinto_user:string = '';
  private validatorsArray: ValidatorFn[] = [];


  ngOnInit(): void {


    this.usuarioForm = this.fb.group({
      username: [''], // Puedes inicializar con un valor por defecto si es necesario
      password: ['']
    });

    let datos: { campo: string, formulario: string };
    datos = {
      "campo"  : "usuario",
      "formulario"  : "registroUsuario"
    }

    this.getValidadorFindByCampoByFormulario(datos).subscribe((result: any) => {
      this.requerimeinto_user = result.tipo_validador;
      this.updateValidatorsArray(); // Actualizar los validadores una vez que se obtengan los datos
    });
  }


  onSave(){
    let data = {
      username: this.usuarioForm.get('username')?.value,
      password: this.usuarioForm.get('password')?.value,
      country : "Bolivia",
      estado  : true
    }

    this.usuarioService.saveUsario(data).subscribe(resul => {
      this.dialogRef.close(1)
    }, (error : any) =>{
      this.dialogRef.close(2)
    })

  }

  onCancel(){
    this.dialogRef.close(3)
  }

  getValidadores(){
    this.validadorService.getValidadores().subscribe(result => {
      console.log(result)
    })
  }

  getValidadorFindByCampoByFormulario(datos: any): Observable<any> {
    return this.validadorService.getValidadorFindByCampoByFormulario(datos);
  }

  updateValidatorsArray() {
    const validatorsArray: ValidatorFn[] = eval(this.requerimeinto_user);
    this.validatorsArray = validatorsArray;
    // Aquí se actualiza el FormGroup con los nuevos validadores
    this.usuarioForm = this.fb.group({
      username: ['', this.validatorsArray],
      password: ['', [Validators.required]]
    });
  }
}
