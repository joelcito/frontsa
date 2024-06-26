import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { UsuarioService } from '../../../shared/services/usuario.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ValidadorService } from '../../../shared/services/validador.service';
import { Observable } from 'rxjs';
import { RolService } from '../../../shared/services/rol.service';

@Component({
  selector: 'app-new-usuario',
  templateUrl: './new-usuario.component.html',
  styleUrl: './new-usuario.component.css'
})
export class NewUsuarioComponent implements OnInit  {

  public usuarioForm!: FormGroup;
  private fb                             = inject(FormBuilder);
  private usuarioService                 = inject(UsuarioService);
  private dialogRef                      = inject(MatDialogRef<NewUsuarioComponent>);
  private validadorService               = inject(ValidadorService);
  public  data                           = inject(MAT_DIALOG_DATA);
  private rolService                     = inject(RolService);

  private requerimeinto_user:string      = '';

  private validatorsArray: ValidatorFn[] = [];
  public  rolElement:any                 = []

  private botnExisteFuncionario:boolean = false;

  ngOnInit(): void {

    this.usuarioForm = this.fb.group({
      cedula             : [''],
      complemento        : [''],
      nombres            : [''],
      primer_apellido    : [''],
      segundo_apellido   : [''],
      nombre_organizacion: [''],
      nombre_dependencia : [''],
      nombre_cargo       : [''],
      departamento       : [''],
      numero_celular     : [''],

      username        : [''],   // Puedes inicializar con un valor por defecto si es necesario
      password        : [''],
      switchControl   : [true]
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

    if(this.data != null)
      this.updateForm(this.data)


    this.getRoles();

    console.log(this.usuarioForm.value)
  }

  onSave(){

    if(this.data != null){
      let id = this.data.id

      let data = {
        username: this.usuarioForm.get('username')?.value,
        password: this.usuarioForm.get('password')?.value,
        country : "Bolivia",
        estado  : this.usuarioForm.get('switchControl')?.value,

        cedula             : this.usuarioForm.get('cedula')?.value,
        complemento        : this.usuarioForm.get('complemento')?.value,
        nombres            : this.usuarioForm.get('nombres')?.value,
        primer_apellido    : this.usuarioForm.get('primer_apellido')?.value,
        segundo_apellido   : this.usuarioForm.get('segundo_apellido')?.value,
        nombre_organizacion: this.usuarioForm.get('nombre_organizacion')?.value,
        nombre_dependencia : this.usuarioForm.get('nombre_dependencia')?.value,
        nombre_cargo       : this.usuarioForm.get('nombre_cargo')?.value,
        departamento       : this.usuarioForm.get('departamento')?.value,
      }

      this.usuarioService.upDateUsuario(id, data).subscribe(resul => {
        this.dialogRef.close(1)
      }, (error : any) =>{
        this.dialogRef.close(2)
      })

    }else{
      let data = {
        username: this.usuarioForm.get('username')?.value,
        password: this.usuarioForm.get('password')?.value,
        country : "Bolivia",
        estado  : this.usuarioForm.get('switchControl')?.value,

        cedula             : this.usuarioForm.get('cedula')?.value,
        complemento        : this.usuarioForm.get('complemento')?.value,
        nombres            : this.usuarioForm.get('nombres')?.value,
        primer_apellido    : this.usuarioForm.get('primer_apellido')?.value,
        segundo_apellido   : this.usuarioForm.get('segundo_apellido')?.value,
        nombre_organizacion: this.usuarioForm.get('nombre_organizacion')?.value,
        nombre_dependencia : this.usuarioForm.get('nombre_dependencia')?.value,
        nombre_cargo       : this.usuarioForm.get('nombre_cargo')?.value,
        departamento       : this.usuarioForm.get('departamento')?.value,
      }

      this.usuarioService.saveUsario(data).subscribe(resul => {
        this.dialogRef.close(1)
      }, (error : any) =>{
        this.dialogRef.close(2)
      })
    }
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
    // const validatorsArray: ValidatorFn[] = eval(this.requerimeinto_user);
    const validatorsArray: ValidatorFn[] = JSON.parse(this.requerimeinto_user);
    this.validatorsArray = validatorsArray;
    // Aquí se actualiza el FormGroup con los nuevos validadores
    this.usuarioForm = this.fb.group({
      cedula             : ['', Validators.required],
      complemento        : ['', Validators.required],
      nombres            : ['', Validators.required],
      primer_apellido    : ['', Validators.required],
      segundo_apellido   : ['', Validators.required],
      nombre_organizacion: ['', Validators.required],
      nombre_dependencia : ['', Validators.required],
      nombre_cargo       : ['', Validators.required],
      departamento       : ['', Validators.required],


      username     : ['', this.validatorsArray],
      password     : ['', [Validators.required]],
      switchControl: [true]

    });
  }

  updateForm(data:any){

    this.usuarioForm = this.fb.group({

      cedula             : [data.cedula],
      complemento        : [data.complemento],
      nombres            : [data.nombres],
      primer_apellido    : [data.primer_apellido],
      segundo_apellido   : [data.segundo_apellido],
      nombre_organizacion: [data.nombre_organizacion],
      nombre_dependencia : [data.nombre_dependencia],
      nombre_cargo       : [data.nombre_cargo],
      departamento       : [data.departamento],


      username     : [data.username, Validators.required],
      switchControl: [data.estado, Validators.required],
      password     : [''],

    });
  }

  getRoles(){
    this.rolService.getRoles().subscribe(datos =>{
      this.rolElement = datos
    })
  }

  buscarFuncionario(){
    let data = {
      cedula: this.usuarioForm.get('cedula')?.value,
      complemento: this.usuarioForm.get('complemento')?.value,
    }
    this.usuarioService.getFuncionario(data).subscribe((result:any) => {
      if(result != null){
        console.log(result)
        this.usuarioForm.get('nombres')?.setValue(result.nombres);
        this.usuarioForm.get('primer_apellido')?.setValue(result.primer_apellido);
        this.usuarioForm.get('segundo_apellido')?.setValue(result.segundo_apellido);
        this.usuarioForm.get('nombre_organizacion')?.setValue(result.nombre_organizacion);
        this.usuarioForm.get('nombre_dependencia')?.setValue(result.nombre_dependencia);
        this.usuarioForm.get('nombre_cargo')?.setValue(result.nombre_cargo);
        this.usuarioForm.get('departamento')?.setValue("LA PAZ");
        this.botnExisteFuncionario = true
      }else{
        this.botnExisteFuncionario = false
      }
    })
  }

  validarBotonAgragarusuario():boolean{
    // if(this.usuarioForm.invalid && !(this.botnExisteFuncionario))
    //   return true
    // else
    //   return false
    // return (this.usuarioForm.invalid && !(this.botnExisteFuncionario))? true : false ;
    // if(this.usuarioForm.invalid){
    //   return true;
    // }else if(this.usuarioForm.valid){
    //   if(this.botnExisteFuncionario){
    //     return false
    //   }else{
    //     return true
    //   }
    // }else{
    //   return false;
    // }
    // if (this.usuarioForm.invalid) {
    //   return true;
    // } else {
    //   return !this.botnExisteFuncionario;
    // }
    return (this.usuarioForm.invalid)? true : !this.botnExisteFuncionario;
  }
}
