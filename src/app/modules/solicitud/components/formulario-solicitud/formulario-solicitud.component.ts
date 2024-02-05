import { Component, Input, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormularioService } from '../../../shared/services/formulario.service';
import { ModalNewSolicitudComponent } from '../modal-new-solicitud/modal-new-solicitud.component';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExtranjeriaService } from '../../../shared/services/extranjeria.service';
import { Observable, catchError, map, of } from 'rxjs';
import { TipoSaneoService } from '../../../shared/services/tipo-saneo.service';
import { SolicitudService } from '../../../shared/services/solicitud.service';

@Component({
  selector: 'app-formulario-solicitud',
  templateUrl: './formulario-solicitud.component.html',
  styleUrl: './formulario-solicitud.component.css'
})
export class FormularioSolicitudComponent implements OnInit{

  private formularioService  = inject(FormularioService);
  private extranjeriaService = inject(ExtranjeriaService);
  private fb                 = inject(FormBuilder);
  private router             = inject(ActivatedRoute);
  private tipoSaneoService   = inject(TipoSaneoService);
  private solicitudService   = inject(SolicitudService);

  private formulario_id       : any
  private tipo_saneo_id       : any
  public  datos_oficina       : any
  public  descripcion         : any
  public  datos_ciudadano     : any
  public  datos_complemento   : any
  public  datos_llenar        : any
  public  datos_llenar_replica: any
  public  datos_footer        : any
  public  lista_tipo_solicitud: any

  public datos_llenar_masa   : any []  = []
  public extrajerosBuscados  : any []  = []
  public extranjeroElejido   : any = {};

  public nombre           : string      = '';
  public nombre_operador  : string      = '';
  public apellido         : string      = '';
  public dato_errado         : string   = '';
  public dato_correcto         : string = '';

  public mostrarTabla:Boolean                       = false
  public mostrarTablaExtranjeroSeleccionado:Boolean = false

  public dato:number                                = 0

  public solicitudFormulario          !: FormGroup
  public formularioBusquedaExtranjero !: FormGroup
  public solicitudFormularioTramite   !: FormGroup

  public image: ArrayBuffer | undefined;

  public longText = `The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog
                      from Japan. A small, agile dog that copes very well with mountainous terrain, the Shiba Inu was
                      originally bred for hunting.`;

  ngOnInit(): void {
    this.router.params.subscribe(params => {

      this.tipo_saneo_id = params['tipo_saneo_id'];
      this.formulario_id = params['formulario_id'];

      console.log(params, "HABES")

      this.formularioService.getFormularioPreguntaByTipoSaneoByTipoDato(this.formulario_id, "datos_oficina").subscribe(resul => {
        this.datos_oficina = resul
      })

      this.formularioService.getFormularioPreguntaByTipoSaneoByTipoDato(this.formulario_id, "descripcion").subscribe(resul => {
        this.descripcion = resul
      })

      this.formularioService.getFormularioPreguntaByTipoSaneoByTipoDato(this.formulario_id, "datos_ciudadano").subscribe(resul => {
        this.datos_ciudadano = resul
      })

      this.formularioService.getFormularioPreguntaByTipoSaneoByTipoDato(this.formulario_id, "datos_complemento").subscribe(resul => {
        this.datos_complemento = resul
      })

      this.formularioService.getFormularioPreguntaByTipoSaneoByTipoDato(this.formulario_id, "datos_llenar").subscribe(resul => {
        this.datos_llenar         = resul
        this.datos_llenar_replica = resul
        this.datos_llenar_masa    = [resul]
      })

      this.formularioService.getFormularioPreguntaByTipoSaneoByTipoDato(this.formulario_id, "datos_footer").subscribe(resul => {
        this.datos_footer = resul
      })

      this.formularioService.getFormulariofindById(this.formulario_id).subscribe(result => {
        console.log(result)
      })

      this.tipoSaneoService.getDetalleTiposSaneo(this.tipo_saneo_id).subscribe(resulg => {
        // console.log(resulg)
        this.lista_tipo_solicitud = resulg
      })

      //  **************************** DE AQUI ES EXTRANJERIA HABER ****************************
      this.extranjeriaService.getExtranjeros().subscribe(resul => {
        console.log(resul)
      })

      this.formularioBusquedaExtranjero = this.fb.group({
        numero_cedula   : ['100398980', Validators.required],
        complemento     : ['', Validators.required],
        nombres         : ['', Validators.required],
        primer_apellido : ['', Validators.required],
        segundo_apellido: ['', Validators.required],
      });

      this.solicitudFormularioTramite = this.fb.group({
        tipo_solicitud       : ['', Validators.required],
        nombre_operador      : ['', Validators.required],
        descripcion          : ['', Validators.required],
        articulos_reglamentos: ['', Validators.required],
        datos_procesar       : ['', Validators.required],
        dato_anterior        : ['', Validators.required],
        dato_correcto        : ['', Validators.required],
        usu_operador_id     : ['', Validators.required],
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
        departamento      : [datosRecuperados.departamento, Validators.required],
        oficina           : [datosRecuperados.nombre_organizacion, Validators.required],
        nombre_funcionario: [datosRecuperados.nombres+" "+datosRecuperados.primer_apellido+" "+datosRecuperados.segundo_apellido, Validators.required],
        fecha_solicitud   : [new Date(), Validators.required],
        funcionario_id    : [datosRecuperados.id],
        formulario_id     : [this.formulario_id]
      });
    } else {
      // No se encontraron datos en sessionStorage
      console.log('No se encontraron datos en sessionStorage');
    }


  }

  agregarCard(){
    // // console.log(this.datos_llenar_replica[0].nombre)
    // this.dato++;
    // const dar = this.datos_llenar_replica[0].nombre+" => "+this.dato;
    // this.datos_llenar_replica[0].nombre = dar
    // // this.datos_llenar_masa.push(this.datos_llenar_replica[0].nombre+" => "+this.dato)
    this.datos_llenar_masa.push(this.datos_llenar_replica)
  }

  eliminarCard(index: number) {


    // console.log(index)
    // console.log(this.datos_llenar_masa)
    // this.datos_llenar_masa.splice(index, 1);


    console.log(index);
    console.log(this.datos_llenar_masa);

    // Crea un nuevo array sin el elemento en el índice proporcionado
    this.datos_llenar_masa = this.datos_llenar_masa.filter((_, i) => i !== index);


  //   console.log(index);
  // console.log(this.datos_llenar_masa);

  // // Crea una copia del array antes de modificarlo
  // const copiaDatos = this.datos_llenar_masa;

  // // Elimina el elemento en el índice proporcionado de la copia
  // copiaDatos.splice(index, 1);

  // // Actualiza la referencia del array original
  // this.datos_llenar_masa = copiaDatos;
  }

  // trackByFn(index: number, item: any): any {
  //   return index; // O podría ser un identificador único del elemento si lo tienes
  // }

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
    let hauy                    = dato.value.toString()
    let arraySeparado: string[] = hauy.split(' ');
        this.dato_errado        = arraySeparado[0]
        this.dato_correcto      = arraySeparado[2]
    console.log(arraySeparado);
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
      datos_procesar_respuesta       : this.solicitudFormularioTramite.value.datos_procesar,
      dato_anterior_respuesta        : this.solicitudFormularioTramite.value.dato_anterior,
      dato_correcto_respuesta        : this.solicitudFormularioTramite.value.dato_correcto,
      usu_operador_id_respuesta      : this.solicitudFormularioTramite.value.usu_operador_id,
    }

    // this.solicitudService.saveSolicitudCambioBandeja(dato).subscribe(resul => {
    this.solicitudService.saveSolicitudCambioBandeja(datosREales).subscribe(resul => {
      console.log(resul)
    })

  }

  /*
  loadImage(serial: string): Observable<string> {
    // Esta función retorna directamente el Observable con la URL base64 de la imagen
    return this.extranjeriaService.getImagenExtranjero(serial).pipe(
      map((response) => {
        const headers = response.headers;
        const contentType = headers.get('content-type');

        if (contentType && contentType.startsWith('image/')) {
          const arrayBuffer = response.body as ArrayBuffer;
          const uint8Array = new Uint8Array(arrayBuffer);
          const byteArray = Array.from(uint8Array);

          const base64String = btoa(String.fromCharCode.apply(null, byteArray));
          return `data:image/jpeg;base64,${base64String}`;
        } else {
          console.error(`El tipo de contenido para ${serial} no es compatible con imágenes.`);
          return ''; // Puedes retornar un valor por defecto o manejar de otra manera según tus necesidades
        }
      }),
      catchError((error) => {
        console.error(`Error al cargar la imagen para ${serial}`, error);
        return of(''); // Puedes retornar un valor por defecto o manejar de otra manera según tus necesidades
      })
    );
  }
 */

}
