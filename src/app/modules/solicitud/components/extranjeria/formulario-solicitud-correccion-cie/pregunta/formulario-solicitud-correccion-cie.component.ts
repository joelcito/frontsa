import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExtranjeriaService } from '../../../../../shared/services/extranjeria.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { TipoSaneoService } from '../../../../../shared/services/tipo-saneo.service';
import { SolicitudService } from '../../../../../shared/services/solicitud.service';
import Swal from 'sweetalert2';
import { environment } from '../../../../../../../environment/environment';
import { Observable, firstValueFrom } from 'rxjs';
import { DatePipe } from '@angular/common';
import { MinioService } from '../../../../../shared/services/minio.service';


@Component({
  selector: 'app-formulario-solicitud-correccion-cie',
  templateUrl: './formulario-solicitud-correccion-cie.component.html',
  styleUrl: './formulario-solicitud-correccion-cie.component.css'
})
export class FormularioSolicitudCorreccionCieComponent implements OnInit{

  // @ViewChild('mensajeTextarea') mensajeTextarea: ElementRef;

  private extranjeriaService = inject(ExtranjeriaService);
  private tipoSaneoService   = inject(TipoSaneoService);
  private fb                 = inject(FormBuilder);
  private router             = inject(ActivatedRoute);
  private solicitudService   = inject(SolicitudService);
  private routerLink         = inject(Router);
  private cdr                = inject(ChangeDetectorRef);
  private datePipe           = inject(DatePipe);
  private minioService       = inject(MinioService);

  public solicitudFormulario          !: FormGroup
  public formularioBusquedaExtranjero !: FormGroup
  public solicitudFormularioTramite   !: FormGroup
  public formularioCoreccionCIE       !: FormGroup

  public mostrarTabla:Boolean                        = false
  public mostrarFormularioBusquedaExtranjero:Boolean = true
  public mostrarTablaExtranjeroSeleccionado:Boolean  = false

  public botonGuardara:boolean   = true

  public  extrajerosBuscados            : any [] = [];
  private camposSeleccionados           : any [] = [];
  public  elementos                     : any [] = [];
  public  elemtosAseleccionar           : any [] = [];
  public  elementosTemporalesGuardados  : any [] = [];
  public  elementosPresentesArecuperar  : any [] = [];
  public  listaDocumentosSolicitud      : any [] = [];

  public  extranjeroElejido             : any = {};

  private formulario_id        : any;
  private tipo_saneo_id        : any;
  private detalle_tipo_saneo_id: any;
  private solicitud_id         : any;
  private solicitud            : any;
  public  bucketName           : any;
  public  lista_tipo_solicitud : any;

  public valorSeleccionado  :string = ''
  public sele1              :string = ''
  public mensaje            :string = ''

  ngOnInit(): void {
    this.detalle_tipo_saneo_id = environment.detalle_tipo_saneo_id_correccion_cie
    this.bucketName            = environment.bucketName

    this.router.params.subscribe(params => {

      const tipo_saneo_id_encry = params['tipo_saneo_id'];
      const formulario_id_encry = params['formulario_id'];
      const solicitud_id_encry  = params['solicitud_id'];

      this.tipo_saneo_id  = this.desencriptarConAESBase64URL(tipo_saneo_id_encry, 'ESTE ES JOEL');
      this.formulario_id  = this.desencriptarConAESBase64URL(formulario_id_encry, 'ESTE ES JOEL');
      this.solicitud_id   = this.desencriptarConAESBase64URL(solicitud_id_encry, 'ESTE ES JOEL');

      if(this.solicitud_id === "0"){

        console.log("si")

      }else{

        console.log(this.solicitud_id)

        this.solicitudService.findByIdsolicitud(this.solicitud_id).subscribe((result:any) => {

          console.log(result)

          let datos = {
            numero_cedula : result.nrocedulabolextregistros
          }
          this.extranjeriaService.buscarExtranjero(datos).subscribe((itmes:any) => {
            this.extranjeroElejido                    = itmes[0]
            this.mostrarFormularioBusquedaExtranjero  = false
            this.mostrarTablaExtranjeroSeleccionado   = true
          })
        })

        this.solicitudService.getTemporalesByIdSolicitud(this.solicitud_id).subscribe((result:any) => {
          this.elementosTemporalesGuardados = result
        })

        // PARA LOS DOCUMENTOS
        this.tipoSaneoService.getDocumentoDetalleTipoSaneo(this.detalle_tipo_saneo_id).subscribe((resuly :any) => {
          this.listaDocumentosSolicitud = resuly
        })

      }


      this.tipoSaneoService.getDetalleTiposSaneo(this.tipo_saneo_id).subscribe(resulg => {
        this.lista_tipo_solicitud = resulg
      })


      //  **************************** DE AQUI ES EXTRANJERIA HABER ****************************
      this.formularioBusquedaExtranjero = this.fb.group({
        numero_cedula   : ['10131544', Validators.required],
        complemento     : ['',],
        nombres         : ['',],
        primer_apellido : ['',],
        segundo_apellido: ['',],
      });

      this.solicitudFormularioTramite = this.fb.group({
        tipo_solicitud       : [{value:this.detalle_tipo_saneo_id, disabled:true}, Validators.required],
        nombre_operador      : ['', Validators.required],
        descripcion          : ['',],
        articulos_reglamentos: ['', Validators.required],
        // datos_procesar       : ['', Validators.required],
        // dato_anterior        : ['', Validators.required],
        // dato_correcto        : ['', Validators.required],
        usu_operador_id      : ['', Validators.required],

        api_estado    : [{value :'ACTIVO', disabled:true}, Validators.required],
        estado_cambiar: [{value:'DESBLOQUEADO', disabled:true}, Validators.required],

        tipo_prioridad       : ['ATENCIÓN COMUN', Validators.required],

      });
    });

    // Obtener los datos de sessionStorage como JSON
    const datosRecuperadosString: string | null = sessionStorage.getItem('datos');

    // Verificar si hay datos en sessionStorage
    if (datosRecuperadosString !== null) {
      // Ahora puedes utilizar directamente los datos como un objeto JSON
      const datosRecuperados = JSON.parse(datosRecuperadosString);
      // *************** CREACION DEL FORMULARIO ***************
      this.solicitudFormulario = this.fb.group({
        pais              : [{value:"Bolivia", disabled:true}, Validators.required],
        departamento      : [{value:datosRecuperados.departamento, disabled:true}, Validators.required],
        oficina           : [{value:datosRecuperados.nombre_organizacion, disabled:true}, Validators.required],
        nombre_funcionario: [{value:datosRecuperados.nombres+" "+datosRecuperados.primer_apellido+" "+datosRecuperados.segundo_apellido, disabled:true}, Validators.required],
        fecha_solicitud   : [{value:new Date(), disabled:true}, Validators.required],
        funcionario_id    : [datosRecuperados.id],
        formulario_id     : [this.formulario_id]
      });
    } else {
      console.log('No se encontraron datos en sessionStorage');
    }

    // ***************** PARA EL FORMULARIO CORRECION CIE *****************
    this.formularioCoreccionCIE = this.fb.group({});

    // ***************** TIPO DETALLE TIPO SANEO *****************
    this.tipoSaneoService.getTiposDetallesTipoSaneo().subscribe((result:any) => {

      var array:any           = []
      var arrayTemporales:any = []
      var cont :number        = 1;

      result.forEach((item:any) => {

        // ***** PARA SABER QUE CAMPOS HAY EN LA TEMPORAL *****
        let forFast = this.elementosTemporalesGuardados.find(obj => obj.campo === item.nombre_campo)
        if( forFast != undefined){
          let da = {
            actula      : item,
            datoRecobery: forFast
          }
          this.elementosPresentesArecuperar.push(da)
          if(!arrayTemporales.includes(item.nombre_grupo))
            arrayTemporales.push(item.nombre_grupo)
        }
        // ***** PARA SABER QUE CAMPOS HAY EN LA TEMPORAL *****
        if(!array.includes(item.nombre_grupo)){
          this.elemtosAseleccionar.push({
            id    : item.nombre_grupo,
            name  : (item.nombre_grupo === "1")? "DATOS PRIMARIOS" : ((item.nombre_grupo === "2")? "DATOS SECUNDARIOS" : "DATOS COMPLEMENTARIOS "+cont++),
            estado: true,
            hijo: [{
              padre       : item.nombre_grupo,
              name        : item.nombre,
              value       : "",
              nombre_campo: item.nombre_campo,
              tipo_campo  : item.tipo_campo,
              tabla       : item.tabla,
              requerid    : item.requerido,
            }]
          })
          array.push(item.nombre_grupo)
        }else{
          const nodo = this.elemtosAseleccionar.find((elem:any) => elem.id === item.nombre_grupo);
          var dar =  nodo.hijo;
          dar.push({
            padre       : item.nombre_grupo,
            name        : item.nombre,
            value       : "",
            nombre_campo: item.nombre_campo,
            tipo_campo  : item.tipo_campo,
            tabla       : item.tabla,
            requerid    : item.requerido,
          })
          nodo.hijo = dar
        }
      });
      this.agregarBloqueMasa(this.elementosPresentesArecuperar)
    })
  }

  seleccionarExtranjero(extranjero:any){
    Swal.fire({
      title             : "¡ALERTA!",
      text              : "Estas seguro que deseas iniciar el tramite con el ciudadano "+extranjero.NombresExtRegistros+"?",
      icon              : "warning",
      showCancelButton  : true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor : "#d33",
      confirmButtonText : "Si",
      cancelButtonText  : "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        let datos = {
          serialExtRegistros         : extranjero.SerialExtRegistros,
          serialDocumentoExtRegistros: extranjero.SerialDocumentoExtRegistros,
          nroCedulaBolExtRegistros   : extranjero.NroCedulaBolExtRegistros,
          formulario_id              : this.formulario_id,
          funcionario_id             : this.solicitudFormulario.value.funcionario_id,
          tipo_solicitud             : this.detalle_tipo_saneo_id,
          estado                     : "EN PROCESO",
        }
        this.solicitudService.saveSolicitudTemporal(datos).subscribe((result:any) => {
          this.solicitud    = result
          this.solicitud_id = result.id
        })
        this.solicitudFormularioTramite.get('nombre_operador')?.setValue(extranjero.NombresSegUsuarios+" "+extranjero.PaternoSegUsuarios+" "+extranjero.MaternoSegUsuarios);
        this.solicitudFormularioTramite.get('nombre_operador')?.disable()

        this.solicitudFormularioTramite.get('usu_operador_id')?.setValue(extranjero.LoginSegUsuarios);
        this.extranjeroElejido                   = extranjero
        this.mostrarTabla                        = false
        this.mostrarTablaExtranjeroSeleccionado  = true;
        this.mostrarFormularioBusquedaExtranjero = false;

        // PARA LOS DOCUMENTOS
        this.tipoSaneoService.getDocumentoDetalleTipoSaneo(this.detalle_tipo_saneo_id).subscribe((resuly :any) => {
          console.log(resuly)
          this.listaDocumentosSolicitud = resuly
        })
      }
    });
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
      // console.log("********************************")
      // console.log(this.valorSeleccionado, this.elemtosAseleccionar, elemento)
      // console.log("********************************")
      if (elemento) {
        elemento.estado = false;
        let d = elemento.hijo
        d = {
          name   : elemento.name,
          listado: elemento.hijo
        }
        this.elementos.push(d);
        (elemento.hijo).forEach((item:any) =>{
          // console.log(item.requerid)
          this.formularioCoreccionCIE.addControl("check_"+item.nombre_campo, this.fb.control(false));
          this.formularioCoreccionCIE.addControl("actual_"+item.nombre_campo, this.fb.control({ value: item.value, disabled: true }));
          this.formularioCoreccionCIE.addControl("nuevo_"+item.nombre_campo, this.fb.control({ value: '', disabled: true }, ((item.requerid) ? Validators.required : null) ));
        });
        this.valorSeleccionado = ''
      } else {
      }
    }
  }

  agregarBloqueMasa(datos:any) {
    var arrayYaEntrados:any           = []
    datos.forEach((itemA:any) => {
      let g = itemA.actula.nombre_grupo
      if(g !== ''){
        const elemento = this.elemtosAseleccionar.find((itemB:any) => itemB.id === g);
        if(!arrayYaEntrados.includes(elemento.id)){
          if (elemento) {
            elemento.estado = false;
            let d = elemento.hijo
            d = {
              name   : elemento.name,
              listado: elemento.hijo
            }
            this.elementos.push(d);
            (elemento.hijo).forEach((itemC:any) =>{
              if(itemC.nombre_campo==itemA.datoRecobery.campo){
                this.formularioCoreccionCIE.addControl("check_"+itemC.nombre_campo, this.fb.control(true));
                this.formularioCoreccionCIE.addControl("actual_"+itemC.nombre_campo, this.fb.control({ value: itemA.datoRecobery.dato_actual, disabled: true }));
                this.formularioCoreccionCIE.addControl("nuevo_"+itemC.nombre_campo, this.fb.control({ value: itemA.datoRecobery.respuesta, disabled: false }, ((itemC.requerid) ? Validators.required : null) ));
              }else{
                this.formularioCoreccionCIE.addControl("check_"+itemC.nombre_campo, this.fb.control(false));
                this.formularioCoreccionCIE.addControl("actual_"+itemC.nombre_campo, this.fb.control({ value: itemC.value, disabled: true }));
                this.formularioCoreccionCIE.addControl("nuevo_"+itemC.nombre_campo, this.fb.control({ value: '', disabled: true }, ((itemC.requerid) ? Validators.required : null) ));
              }
            });
          } else {
            // console.log("holas")
          }
          arrayYaEntrados.push(elemento.id)
        }else{
          console.log(elemento, itemA.datoRecobery)
          this.formularioCoreccionCIE.get("check_"+itemA.datoRecobery.campo)?.setValue(true)
          this.formularioCoreccionCIE.get("actual_"+itemA.datoRecobery.campo)?.setValue(itemA.datoRecobery.dato_actual)
          this.formularioCoreccionCIE.get("nuevo_"+itemA.datoRecobery.campo)?.setValue(itemA.datoRecobery.respuesta)
          this.formularioCoreccionCIE.get("nuevo_"+itemA.datoRecobery.campo)?.enable()
        }
      }else{
        // console.log("holas2")
      }
    })
  }



  validaFormulario(formulario: FormGroup):boolean{
    const keys = Object.keys(formulario.controls);
    return ((keys.length === 0)? true : ((keys.some(key => key.startsWith('check_') && this.formularioCoreccionCIE.get(key)?.value))? formulario.invalid : true));
  }

  guardarSolicitud(){
    this.camposSeleccionados.forEach((item:any) => {
      this.formularioCoreccionCIE.get("actual_"+item)?.enable()
    })

    let datos                            = this.formularioCoreccionCIE.value
    datos['serialExtRegistros']          = this.extranjeroElejido.SerialExtRegistros
    datos['serialDocumentoExtRegistros'] = this.extranjeroElejido.SerialDocumentoExtRegistros
    datos['nroCedulaBolExtRegistros']    = this.extranjeroElejido.NroCedulaBolExtRegistros
    datos['formulario_id']               = this.formulario_id
    datos['funcionario_id']              = this.solicitudFormulario.value.funcionario_id
    datos['tipo_solicitud']              = this.tipo_saneo_id
    datos['solicitud_id']                = this.solicitud_id
    datos['estado']                      = "ASIGNADO"
    datos['tipo_prioridad']              = this.solicitudFormularioTramite.value.tipo_prioridad
    datos['mensaje_adicion']             = (document.getElementById('mensajeTextarea') as HTMLTextAreaElement).value;
    // datos['tipo_archivo']                = ;

    this.solicitudService.saveCorreccionesCIE(datos).subscribe((result:any) => {
      if(result.id !== null && result.estado === "ASIGNADO"){
        const fechaActual  = new Date();
        const anioActual   = fechaActual.getFullYear();
        const mesEnLiteral = fechaActual.toLocaleDateString('es-ES', { month: 'long' });
        const fechaFormato = this.datePipe.transform(fechaActual, 'yyyy-MM-dd');
        let   ruta         = anioActual+"-EXT/"+mesEnLiteral+"/"+fechaFormato+"/solicitud_"+result.id;
        let   numBucles    = 0;
        for (const doc of this.listaDocumentosSolicitud) {
          const fileInput = document.getElementById(`document_${doc.id}`) as HTMLInputElement;
          if(fileInput.files){
            const file       = fileInput.files[0]
            const bucketName = this.bucketName;
            const nameFile   = file.name.replaceAll(" ", "_" )
            const objectKey  = ruta+"/"+nameFile;
            this.minioService.uploadFile(file, bucketName, objectKey)
            .then(data => {
              if(data !== null){
                let datos = {
                  solicitud      : result.id,
                  usuario_creador: this.solicitudFormulario.value.funcionario_id,
                  gestion        : anioActual,
                  sistema        : "EXT",
                  mes            : mesEnLiteral,
                  fecha          : fechaFormato,
                  nombre_archivo : nameFile,
                  ETag           : data.ETag,
                  Location       : data.Location,
                  key            : data.Key,
                  Bucket         : data.Bucket,
                  tipo_archivo   : "INICIO SOLICITUD"


                }
                this.solicitudService.saveSolicitudArchivo(datos).subscribe((resultado:any) =>{
                  console.log(resultado)
                })
                numBucles++;
                if(numBucles == this.listaDocumentosSolicitud.length){
                  Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Se registro con exito",
                    text: "El Caso se le asigno a "+result.usuarioAsignado.nombres+" "+result.usuarioAsignado.primer_apellido+" "+result.usuarioAsignado.segundo_apellido,
                    showConfirmButton: false,
                    timer: 4000,
                    allowOutsideClick: false
                  });
                  
                  setTimeout(() => {
                    this.routerLink.navigate(['/solicitud']);
                  }, 4000);
                }
              }
            })
            .catch(err => {
              console.error('Error al subir el archivo:', err);
            });
          }
        }
      }

      // if(result !== null){
      //   Swal.fire({
      //     position: "top-end",
      //     icon: "success",
      //     title: "Se registro con exito",
      //     text: "El Caso se le asigno a "+result.usuarioAsignado.nombres+" "+result.usuarioAsignado.primer_apellido+" "+result.usuarioAsignado.segundo_apellido,
      //     showConfirmButton: false,
      //     timer: 4000,
      //     allowOutsideClick: false
      //   });
      //   setTimeout(() => {
      //     this.routerLink.navigate(['/solicitud']);
      //   }, 4000);
      // }
    })
  }

  habilitarCampos(datos:any){
    const valor = this.formularioCoreccionCIE.value["check_"+datos.nombre_campo]
    if(valor){
      this.camposSeleccionados.push(datos.nombre_campo)
      this.formularioCoreccionCIE.get('nuevo_'+datos.nombre_campo)?.enable()
    }else{
      this.camposSeleccionados = this.camposSeleccionados.filter(item => item !== datos.nombre_campo);
      this.formularioCoreccionCIE.get('nuevo_'+datos.nombre_campo)?.setValue('')
      this.formularioCoreccionCIE.get('nuevo_'+datos.nombre_campo)?.disable()
      let daEli = {
        nombreCampo     : datos.nombre_campo,
        usarioEliminador: this.solicitudFormulario.value.funcionario_id,
        solicitud_id    : this.solicitud_id
      }
      this.solicitudService.eliminacionLogicaTemporalSolicitudDeseleccion(daEli).subscribe((result:any) => {
        console.log(result)
      })
    }
    if(datos.tipo_campo === "texto"){
      this.formularioCoreccionCIE.get("actual_"+datos.nombre_campo)?.setValue(((valor)? this.extranjeroElejido[datos.nombre_campo] : ""))
    }else if(datos.tipo_campo === "fecha"){
      const nuevoTipo = 'date';
      const inputElement = document.getElementById('nuevo_'+datos.nombre_campo) as HTMLInputElement;
      if (inputElement){
        inputElement.setAttribute('type', nuevoTipo);
        const fecha = new Date(this.extranjeroElejido[datos.nombre_campo]);
        const fechaFormateada = fecha.toLocaleDateString('es-ES'); // Formatear la fecha al formato 'dd/mm/yyyy'
        this.formularioCoreccionCIE.get("actual_" + datos.nombre_campo)?.setValue(valor ? fechaFormateada : '');
        // Establecer el atributo min
        const minDate = new Date(); // Utiliza la fecha actual como mínimo
        const minDateFormatted = minDate.toISOString().split('T')[0]; // Formato ISO (yyyy-mm-dd)
        inputElement.setAttribute('max', minDateFormatted);
        inputElement.setAttribute('min', '1950-01-01');
      }
    }else if(datos.tipo_campo === "combo"){
      let datosRe = {
        tabla:datos.tabla
      }
      this.extranjeriaService.getDatosParametricas(datosRe).subscribe((result:any) => {
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
    }else if(datos.tipo_campo === "comboGenero"){
      console.log(datos, this.extranjeroElejido[datos.nombre_campo])
      this.formularioCoreccionCIE.get("actual_" + datos.nombre_campo)?.setValue(valor ? ((this.extranjeroElejido[datos.nombre_campo])? "MASCULINO": "FEMENINO") : '');
      let options = '<option value="">SELECCIONE</option><option value="1">MASCULINO</option><option value="0">FEMENINO</option>';
      const contenedor           = document.getElementById('contenedorInput_'+datos.nombre_campo) as HTMLElement;
              contenedor.innerHTML = '';

        const select               = document.createElement('select');
        select.setAttribute('formControlName', 'nuevo_' + datos.nombre_campo);
        select.innerHTML = options;
        // Agregar un listener de eventos change que llame a una función para manejar el cambio de selección
        select.addEventListener('change', (event:any) => {
          this.handleSelectChange(event.target.value, datos.nombre_campo); // Llama a una función para manejar el cambio de selección y pasa el valor seleccionado
        });
        contenedor.appendChild(select);
    }else if(datos.tipo_campo === "numero"){
      const nuevoTipo = 'number';
      const inputElement = document.getElementById('nuevo_'+datos.nombre_campo) as HTMLInputElement;
      if (inputElement){
        inputElement.setAttribute('type', nuevoTipo);
        this.formularioCoreccionCIE.get("actual_" + datos.nombre_campo)?.setValue(this.extranjeroElejido[datos.nombre_campo]);
      }
    }
  }

  handleSelectChange(datos:any, campo:string){
    this.formularioCoreccionCIE.get("nuevo_"+campo)?.setValue(datos);

    let f = {
      nombre_campo : campo
    }

    this.guardarTemporalMente(f)
  }

  recuperarSolicitud(datos:any){
    console.log(datos)
  }

  guardarTemporalMente(elem:any){
    // console.log("**********************************************************")
    // console.log(this.formularioCoreccionCIE.get("nuevo_"+elem.nombre_campo)?.value)
    // console.log(elem)
    this.formularioCoreccionCIE.get("actual_"+elem.nombre_campo)?.enable()
    let datos = {
      // solicitud_id   : this.solicitud.id,
      solicitud_id   : this.solicitud_id,
      campoModificado: elem.nombre_campo,
      datoActual     : this.formularioCoreccionCIE.get("actual_"+elem.nombre_campo)?.value,
      datoRespuesta  : this.formularioCoreccionCIE.get("nuevo_"+elem.nombre_campo)?.value,
      funcionario_id : this.solicitudFormulario.value.funcionario_id
    }
    this.formularioCoreccionCIE.get("actual_"+elem.nombre_campo)?.disable()
    this.solicitudService.saveTemporalSolicitud(datos).subscribe((resul:any) => {
      console.log(resul)
    })
  }


  async obtenerDatos() {
    try {
      const result:any = await firstValueFrom(this.solicitudService.findByIdsolicitud(this.solicitud_id));

      if (result) { // Verificar si result no es undefined

        console.log(result.nrocedulabolextregistros)

        const datos = {
          numero_cedula: result.nrocedulabolextregistros
        };

        const items = await firstValueFrom(this.extranjeriaService.buscarExtranjero(datos));
        this.extranjeroElejido = items;
        console.log(this.extranjeroElejido);

        // Aquí puedes realizar cualquier otra operación que necesites con this.extranjeroElejido
        this.mostrarFormularioBusquedaExtranjero = false;
        this.mostrarTablaExtranjeroSeleccionado = true;
      } else {
        console.error('El resultado de la solicitud es undefined.');
      }
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  }


  onFileSelected(event: any, tamanio: string, id:number){

  }

}
