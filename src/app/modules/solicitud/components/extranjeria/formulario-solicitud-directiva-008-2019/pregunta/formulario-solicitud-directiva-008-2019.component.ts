import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TipoSaneoService } from '../../../../../shared/services/tipo-saneo.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExtranjeriaService } from '../../../../../shared/services/extranjeria.service';
import { SolicitudService } from '../../../../../shared/services/solicitud.service';
import * as CryptoJS from 'crypto-js';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-formulario-solicitud-directiva-008-2019',
  templateUrl: './formulario-solicitud-directiva-008-2019.component.html',
  styleUrl: './formulario-solicitud-directiva-008-2019.component.css'
})

export class FormularioSolicitudDirectiva0082019Component implements OnInit{

  private router             = inject(ActivatedRoute);
  private tipoSaneoService   = inject(TipoSaneoService);
  private fb                 = inject(FormBuilder);
  private extranjeriaService = inject(ExtranjeriaService);
  private solicitudService   = inject(SolicitudService);
  private routerLink         = inject(Router);


  private formulario_id       : any
  private tipo_saneo_id       : any
  public  lista_tipo_solicitud: any


  public formularioBusquedaExtranjero !: FormGroup
  public solicitudFormularioTramite   !: FormGroup
  public solicitudFormulario          !: FormGroup


  public mostrarTabla:Boolean                       = false
  public mostrarTablaExtranjeroSeleccionado:Boolean = false


  public extrajerosBuscados  : any [] = []
  public extranjeroElejido   : any    = {};


  public dato_errado         : string = '';
  public dato_correcto       : string = '';


  ngOnInit(): void {

    this.router.params.subscribe(params => {

      const tipo_saneo_id_encry = params['tipo_saneo_id'];
      const formulario_id_encry = params['formulario_id'];

      this.tipo_saneo_id = this.desencriptarConAESBase64URL(tipo_saneo_id_encry, 'ESTE ES JOEL');
      this.formulario_id = this.desencriptarConAESBase64URL(formulario_id_encry, 'ESTE ES JOEL');

      console.log(
        this.tipo_saneo_id,
        this.formulario_id
      )

      this.tipoSaneoService.getDetalleTiposSaneo(this.tipo_saneo_id).subscribe(resulg => {
        this.lista_tipo_solicitud = resulg
      })

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

  desencriptarConAESBase64URL(textoEnBase64URL:string, clave:string) {
    const textoEncriptado     = textoEnBase64URL.replace(/-/g, '+').replace(/_/g, '/');
    const bytesDesencriptados = CryptoJS.AES.decrypt(textoEncriptado, clave);
    const textoDesencriptado  = bytesDesencriptados.toString(CryptoJS.enc.Utf8);
    return textoDesencriptado;
  }

  buscarExtranjero(){
    let datos = this.formularioBusquedaExtranjero.value
    this.extranjeriaService.buscarExtranjero(datos).subscribe((result:any) => {
      this.extrajerosBuscados = result
      this.mostrarTabla = true
      this.mostrarTablaExtranjeroSeleccionado = false;
    })
  }

  seleccionarExtranjero(extranjero:any){
    this.solicitudFormularioTramite.get('nombre_operador')?.setValue(extranjero.NombresSegUsuarios+" "+extranjero.PaternoSegUsuarios+" "+extranjero.MaternoSegUsuarios);
    this.solicitudFormularioTramite.get('usu_operador_id')?.setValue(extranjero.LoginSegUsuarios);
    this.extranjeroElejido = extranjero
    this.mostrarTabla = false
    this.mostrarTablaExtranjeroSeleccionado = true;
  }

  tipoCaso(dato:any){
    console.log(dato, "haber",dato.value )
    // let hauy                    = dato.value.toString()
    // let arraySeparado: string[] = hauy.split(' ');
    //     this.dato_errado        = arraySeparado[0]
    //     this.dato_correcto      = arraySeparado[2]
    // console.log(arraySeparado);
  }

  guardarSolicitud(){
    console.log("******************************************************************************************************")
    console.log("========================")
    console.log(this.solicitudFormulario.value)
    console.log("========================")
    console.log(this.extranjeroElejido)
    console.log("========================")
    console.log(this.solicitudFormularioTramite.value)
    console.log("******************************************************************************************************")

    let dato = {
      datosFormularioSolicitud  : this.solicitudFormulario.value,
      datosExtranjeroElejido    : this.extranjeroElejido,
      solicitudFormularioTramite: this.solicitudFormularioTramite.value
    }

    let datosREales = {
      funcionario_id             : this.solicitudFormulario.value.funcionario_id,
      formulario_id              : this.solicitudFormulario.value.formulario_id,
      serialDocumentoExtRegistros: this.extranjeroElejido.SerialDocumentoExtRegistros,
      serialExtRegistros         : this.extranjeroElejido.SerialExtRegistros,
      nroCedulaBolExtRegistros   : this.extranjeroElejido.NroCedulaBolExtRegistros,
      tipo_solicitud             : this.solicitudFormularioTramite.value.tipo_solicitud,

      // PREGUNTAS
      tipo_solicitud_respuesta       : this.solicitudFormularioTramite.value.tipo_solicitud,
      nombre_operador_respuesta      : this.solicitudFormularioTramite.value.nombre_operador,
      descripcion_respuesta          : this.solicitudFormularioTramite.value.descripcion,
      articulos_reglamentos_respuesta: this.solicitudFormularioTramite.value.articulos_reglamentos,
      // datos_procesar_respuesta       : this.solicitudFormularioTramite.value.datos_procesar,
      // dato_anterior_respuesta        : this.solicitudFormularioTramite.value.dato_anterior,
      // dato_correcto_respuesta        : this.solicitudFormularioTramite.value.dato_correcto,
      usu_operador_id_respuesta      : this.solicitudFormularioTramite.value.usu_operador_id,

      api_estado_respuesta : this.solicitudFormularioTramite.value.api_estado,
      estado_cambiar_respuesta: this.solicitudFormularioTramite.value.estado_cambiar,

    }

    // this.solicitudService.saveSolicitudCambioBandeja(dato).subscribe(resul => {
    this.solicitudService.saveSolicitudDesbloqueoDirectiva0082019(datosREales).subscribe((resul:any) => {

      if(resul !== null){

        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Se registro con exito",
          text: "El Caso se le asigno a "+resul.usuarioAsignado.nombres+" "+resul.usuarioAsignado.primer_apellido+" "+resul.usuarioAsignado.segundo_apellido,
          showConfirmButton: false,
          timer: 4000,
          allowOutsideClick: false
        });

        setTimeout(() => {
          this.routerLink.navigate(['/solicitud']);
        }, 4000);

      }else{

      }
      console.log(resul)
    })
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
