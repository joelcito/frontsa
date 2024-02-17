import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExtranjeriaService } from '../../../../../shared/services/extranjeria.service';
import { ActivatedRoute } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { TipoSaneoService } from '../../../../../shared/services/tipo-saneo.service';

@Component({
  selector: 'app-formulario-solicitud-correccion-cie',
  templateUrl: './formulario-solicitud-correccion-cie.component.html',
  styleUrl: './formulario-solicitud-correccion-cie.component.css'
})
export class FormularioSolicitudCorreccionCieComponent implements OnInit{

  private extranjeriaService = inject(ExtranjeriaService);
  private tipoSaneoService   = inject(TipoSaneoService);
  private fb                 = inject(FormBuilder);
  private router             = inject(ActivatedRoute);


  public solicitudFormulario          !: FormGroup
  public formularioBusquedaExtranjero !: FormGroup
  public solicitudFormularioTramite   !: FormGroup
  public formularioCoreccionCIE   !    : FormGroup


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


    // ***************** PARA EL FORMULARIO CORRECION CIE *****************
    this.formularioCoreccionCIE = this.fb.group({});


    // ***************** TIPO DETALLE TIPO SANEO *****************
    this.tipoSaneoService.getTiposDetallesTipoSaneo().subscribe((result:any) => {
      var array:any   = []
      var cont:number = 1;
      result.forEach((item:any) => {
        if(!array.includes(item.nombre_grupo)){
          this.elemtosAseleccionar.push({
            id    : item.nombre_grupo,
            name  : (item.nombre_grupo === "1")? "DATOS PRIMARIOS" : ((item.nombre_grupo === "2")? "DATOS SECUNDARIOS" : "DATOS COMPLEMENTARIOS "+cont++),
            estado: true,
            hijo: [{
              padre: item.nombre_grupo,
              name : item.nombre,
              value:"",
              nombre_campo: item.nombre_campo,
              tipo_campo: item.tipo_campo,
              tabla: item.tabla
            }]
          })
          array.push(item.nombre_grupo)
        }else{
          const nodo = this.elemtosAseleccionar.find((elem:any) => elem.id === item.nombre_grupo);
          var dar =  nodo.hijo;
          dar.push({
            padre: item.nombre_grupo,
            name : item.nombre,
            value:"",
            nombre_campo: item.nombre_campo,
            tipo_campo: item.tipo_campo,
            tabla: item.tabla
          })
          nodo.hijo = dar
        }
      });
    })
  }

  elementos           : any[] = [];
  valorSeleccionado  :string  = ''
  sele1               :string = ''
  elemtosAseleccionar:any     = []

  // datosPrimarios = [
  //   {
  //     name:"NOMBRES",
  //     value:"JOEL JONATHAN"
  //   },
  //   {
  //     name:"PRIMER APELLIDO",
  //     value:"FLORES"
  //   },
  //   {
  //     name:"SEGUNDO APELLIDO",
  //     value:"QUISPE"
  //   },
  //   {
  //     name:"APELLIDO DE CASADA",
  //     value:""
  //   },
  //   {
  //     name:"FECHA DE NACIMIENTO",
  //     value:"01/07/2000"
  //   },
  //   {
  //     name:"GENERO",
  //     value:"MASCULINO"
  //   },
  //   {
  //     name:"ESTADO CIVIL",
  //     value:"SOLTERO"
  //   },
  // ]


  // datosRecaudacion = [
  //   {
  //     name:"MULTAS",
  //     value:"ELABORADO"
  //   },
  //   {
  //     name:"MULTAS 2",
  //     value:"PAGADO"
  //   }
  // ]

  // datosEstados = [
  //   {
  //     name:"ESTADO",
  //     value:"ENTREGADO"
  //   }
  // ]



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
    if(this.valorSeleccionado !== ''){
      const elemento = this.elemtosAseleccionar.find((item:any) => item.name === this.valorSeleccionado);
      if (elemento) {
        elemento.estado = false;
        let d = elemento.hijo
        d = {
          name   : elemento.name,
          listado: elemento.hijo
        }
        this.elementos.push(d);

        (elemento.hijo).forEach((item:any) =>{

          this.formularioCoreccionCIE.addControl("check_"+item.nombre_campo, this.fb.control(false));
          this.formularioCoreccionCIE.addControl("actual_"+item.nombre_campo, this.fb.control({ value: item.value, disabled: true }));
          this.formularioCoreccionCIE.addControl("nuevo_"+item.nombre_campo, this.fb.control(''));

        });

        this.valorSeleccionado = ''
      } else {
        // console.log(`${this.valorSeleccionado} no encontrado en la lista.`);
      }
      // console.log(this.valorSeleccionado)
    }else{
      // console.log(this.valorSeleccionado)
    }
  }

  guardar(as:any){
    console.log(as)
  }

  verificarDato(adi:any){

  }

  guardarSolicitud(){
    console.log(this.formularioCoreccionCIE.value)
  }

  habilitarCampos(datos:any){
    if(datos.tipo_campo === "texto"){
      const valor = this.formularioCoreccionCIE.value["check_"+datos.nombre_campo]
      this.formularioCoreccionCIE.get("actual_"+datos.nombre_campo)?.setValue(((valor)? this.extranjeroElejido[datos.nombre_campo] : ""))
    }else if(datos.tipo_campo === "fecha"){
      const nuevoTipo = 'date';
      const inputElement = document.getElementById('nuevo_'+datos.nombre_campo) as HTMLInputElement;
      if (inputElement)
        inputElement.setAttribute('type', nuevoTipo);
    }else if(datos.tipo_campo === "combo"){
      let datosRe = {
        tabla:datos.tabla
      }
      this.extranjeriaService.getDatosParametricas(datosRe).subscribe((result:any) => {

        // const options = result.map((item: any) => ({
        //     value: item['Codigo' + datos.tabla],
        //     label: item['Descripcion' + datos.tabla]
        // }));

        // const contenedor = document.getElementById('contenedorInput_' + datos.nombre_campo) as HTMLElement;
        // contenedor.innerHTML = ''; // Limpiamos el contenido existente

        // // Creamos el elemento <select>
        // const select = document.createElement('select');
        // select.setAttribute('formControlName', 'nuevo_' + datos.nombre_campo);

        // // Agregamos las opciones al <select>
        // options.forEach((option: any) => {
        //     const optionElement = document.createElement('option');
        //     optionElement.value = option.value;
        //     optionElement.textContent = option.label;
        //     select.appendChild(optionElement);
        // });

        // // Reemplazamos el elemento <input> con el <select>
        // contenedor.appendChild(select);

          // Setear el valor seleccionado después de crear el select
          // this.formularioCoreccionCIE.get("nuevo_" + datos.nombre_campo)?.setValue((paisCod ? paisCod['Codigo'+datos.tabla] : ''));




        let options = '<option value="">SELECCIONE</option>';
        let paisCod: any
        result.forEach((item:any) => {
          // options += `<option value="JOEL">${item['Descripcion'+datos.tabla]}</option>`;
          options += '<option value="'+item['Codigo'+datos.tabla]+'">'+item['Descripcion'+datos.tabla]+'</option>';
          if(this.extranjeroElejido[datos.nombre_campo] === item['Codigo'+datos.tabla])
            paisCod = item
        });
        const contenedor           = document.getElementById('contenedorInput_'+datos.nombre_campo) as HTMLElement;
              contenedor.innerHTML = '';
        const select               = document.createElement('select');
        select.setAttribute('formControlName', 'nuevo_' + datos.nombre_campo);
        select.innerHTML = options;
        // Agregar un listener de eventos change que llame a una función para manejar el cambio de selección
        select.addEventListener('change', (event:any) => {
          this.handleSelectChange(event.target.value, datos.nombre_campo); // Llama a una función para manejar el cambio de selección y pasa el valor seleccionado
          // this.handleSelectChange(event.target,); // Llama a una función para manejar el cambio de selección y pasa el valor seleccionado
        });
        contenedor.appendChild(select);
        this.formularioCoreccionCIE.get("actual_"+datos.nombre_campo)?.setValue(paisCod['Descripcion'+datos.tabla])
      })
    }
  }

  handleSelectChange(datos:any, campo:string){
    // console.log(datos, campo)
    this.formularioCoreccionCIE.get("nuevo_"+campo)?.setValue(datos);
  }
}
