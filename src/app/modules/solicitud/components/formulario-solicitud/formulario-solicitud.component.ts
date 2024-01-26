import { Component, Input, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormularioService } from '../../../shared/services/formulario.service';
import { ModalNewSolicitudComponent } from '../modal-new-solicitud/modal-new-solicitud.component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-formulario-solicitud',
  templateUrl: './formulario-solicitud.component.html',
  styleUrl: './formulario-solicitud.component.css'
})
export class FormularioSolicitudComponent implements OnInit{

  private formularioService = inject(FormularioService);
  private router            = inject(ActivatedRoute);

  private formulario_id: any
  private tipo_saneo_id: any
        // private datos_oficina:any [] = []
  public datos_oficina       : any
  public descripcion         : any
  public datos_ciudadano     : any
  public datos_complemento   : any
  public datos_llenar        : any
  public datos_llenar_masa   : any []  = []
  public datos_llenar_replica: any
  public datos_footer        : any

  nombre  : string = '';
  apellido: string = '';

  dato:number = 0

  longText = `The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog
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


    });
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
}
