import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExtranjeriaService } from '../../../../../shared/services/extranjeria.service';
import { ActivatedRoute } from '@angular/router';
import * as CryptoJS from 'crypto-js';


@Component({
  selector: 'app-formulario-solicitud-correccion-cie',
  templateUrl: './formulario-solicitud-correccion-cie.component.html',
  styleUrl: './formulario-solicitud-correccion-cie.component.css'
})
export class FormularioSolicitudCorreccionCieComponent implements OnInit{

  private extranjeriaService = inject(ExtranjeriaService);
  private fb                 = inject(FormBuilder);
  private router             = inject(ActivatedRoute);


  public solicitudFormulario          !: FormGroup
  public formularioBusquedaExtranjero !: FormGroup
  public solicitudFormularioTramite   !: FormGroup


  public mostrarTabla:Boolean                       = false
  public mostrarTablaExtranjeroSeleccionado:Boolean = false


  public extrajerosBuscados  : any [] = []
  public extranjeroElejido   : any    = {};

  private formulario_id       : any
  private tipo_saneo_id       : any



  ngOnInit(): void {

    this.router.params.subscribe(params => {
      const tipo_saneo_id_encry = params['tipo_saneo_id'];
      const formulario_id_encry = params['formulario_id'];

      this.tipo_saneo_id = this.desencriptarConAESBase64URL(tipo_saneo_id_encry, 'ESTE ES JOEL');
      this.formulario_id = this.desencriptarConAESBase64URL(formulario_id_encry, 'ESTE ES JOEL');

      //  **************************** DE AQUI ES EXTRANJERIA HABER ****************************
      this.formularioBusquedaExtranjero = this.fb.group({
        numero_cedula   : ['100398980', Validators.required],
        complemento     : ['',],
        nombres         : ['',],
        primer_apellido : ['',],
        segundo_apellido: ['',],
      });

      this.solicitudFormularioTramite = this.fb.group({
        tipo_solicitud       : [{value:4, disabled:true}, Validators.required],
        descripcion          : ['',],
        articulos_reglamentos: ['', Validators.required],
        // datos_procesar       : ['', Validators.required],
        // dato_anterior        : ['', Validators.required],
        // dato_correcto        : ['', Validators.required],
        usu_operador_id      : ['', Validators.required],

        api_estado    : [{value :'ACTIVO', disabled:true}, Validators.required],
        estado_cambiar: [{value:'DESBLOQUEADO', disabled:true}, Validators.required],

      });

      //  **************************** DE AQUI ES EXTRANJERIA HABER FIN ****************************

    });

    // Obtener los datos de sessionStorage como JSON
    const datosRecuperadosString: string | null = sessionStorage.getItem('datos');

    // Verificar si hay datos en sessionStorage
    if (datosRecuperadosString !== null) {
      // Ahora puedes utilizar directamente los datos como un objeto JSON
      const datosRecuperados = JSON.parse(datosRecuperadosString);
      // *************** CREACION DEL FORMULARIO ***************
      this.solicitudFormulario = this.fb.group({
        departamento      : [{value:datosRecuperados.departamento, disabled:true}, Validators.required],
        oficina           : [{value:datosRecuperados.nombre_organizacion, disabled:true}, Validators.required],
        nombre_funcionario: [{value:datosRecuperados.nombres+" "+datosRecuperados.primer_apellido+" "+datosRecuperados.segundo_apellido, disabled:true}, Validators.required],
        fecha_solicitud   : [{value:new Date(), disabled:true}, Validators.required],
        funcionario_id    : [datosRecuperados.id],
        formulario_id     : [this.formulario_id]
      });
    } else {
      // No se encontraron datos en sessionStorage
      console.log('No se encontraron datos en sessionStorage');
    }
  }


  elementos: any[] = [
  ];
  valorSeleccionado:string = ''
  sele1:string = ''

  elemtosAseleccionar = [
    {
      name:"DATOS PRIMARIOS",
      estado:true
    },
    {
      name:"RECAUDACION",
      estado:true
    },
    {
      name:"ESTADOS",
      estado:true
    }
  ]

  datosPrimarios = [
    {
      name:"NOMBRES",
      value:"JOEL JONATHAN"
    },
    {
      name:"PRIMER APELLIDO",
      value:"FLORES"
    },
    {
      name:"SEGUNDO APELLIDO",
      value:"QUISPE"
    },
    {
      name:"APELLIDO DE CASADA",
      value:""
    },
    {
      name:"FECHA DE NACIMIENTO",
      value:"01/07/2000"
    },
    {
      name:"GENERO",
      value:"MASCULINO"
    },
    {
      name:"ESTADO CIVIL",
      value:"SOLTERO"
    },
  ]


  datosRecaudacion = [
    {
      name:"MULTAS",
      value:"ELABORADO"
    },
    {
      name:"MULTAS 2",
      value:"PAGADO"
    }
  ]

  datosEstados = [
    {
      name:"ESTADO",
      value:"ENTREGADO"
    }
  ]



  seleccionarExtranjero(extranjero:any){
    this.solicitudFormularioTramite.get('nombre_operador')?.setValue(extranjero.NombresSegUsuarios+" "+extranjero.PaternoSegUsuarios+" "+extranjero.MaternoSegUsuarios);
    this.solicitudFormularioTramite.get('usu_operador_id')?.setValue(extranjero.LoginSegUsuarios);
    this.extranjeroElejido = extranjero
    this.mostrarTabla = false
    this.mostrarTablaExtranjeroSeleccionado = true;
  }

  buscarExtranjero(){
    let datos = this.formularioBusquedaExtranjero.value
    this.extranjeriaService.buscarExtranjero(datos).subscribe((result:any) => {
      this.extrajerosBuscados = result
      this.mostrarTabla = true
      this.mostrarTablaExtranjeroSeleccionado = false;
    })
  }

  desencriptarConAESBase64URL(textoEnBase64URL:string, clave:string) {
    const textoEncriptado     = textoEnBase64URL.replace(/-/g, '+').replace(/_/g, '/');
    const bytesDesencriptados = CryptoJS.AES.decrypt(textoEncriptado, clave);
    const textoDesencriptado  = bytesDesencriptados.toString(CryptoJS.enc.Utf8);
    return textoDesencriptado;
  }


  agregarBloque() {
    // this.elementos.push({ inputValor: '', selectValor: '' }); // Agregar un nuevo objeto a la lista de elementos
    if(this.valorSeleccionado !== ''){
      const elemento = this.elemtosAseleccionar.find(item => item.name === this.valorSeleccionado);
      if (elemento) {

          elemento.estado = false;
          let d = {}

          if(this.valorSeleccionado === 'DATOS PRIMARIOS'){
            d = {
              name : this.valorSeleccionado,
              listado : this.datosPrimarios
            }
          }else if(this.valorSeleccionado === 'RECAUDACION'){
            d = {
              name : this.valorSeleccionado,
              listado : this.datosRecaudacion
            }
          }else{
            d = {
              name : this.valorSeleccionado,
              listado : this.datosEstados
            }
          }

          // this.elementos.push({ name: this.valorSeleccionado });
          this.elementos.push(d);
          console.log(`Estado de ${this.valorSeleccionado} cambiado a false.`);
          this.valorSeleccionado = ''

      } else {
          console.log(`${this.valorSeleccionado} no encontrado en la lista.`);
      }
      console.log(this.valorSeleccionado)
    }else{
      console.log(this.valorSeleccionado)
    }

  }

  guardar(as:any){
    console.log(as)
  }

  verificarDato(adi:any){

  }



}
