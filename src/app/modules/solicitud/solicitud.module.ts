import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SolicitudComponent } from './components/solicitud/solicitud.component';
import { MaterialModule } from '../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewTipoSolicitudComponent } from './components/new-tipo-solicitud/new-tipo-solicitud.component';
import { ModalNewSolicitudComponent } from './components/modal-new-solicitud/modal-new-solicitud.component';
import { FormularioSolicitudComponent } from './components/extranjeria/formulario-solicitud/pregunta/formulario-solicitud.component';
import { FormularioSolicitudDirectiva0082019Component } from './components/extranjeria/formulario-solicitud-directiva-008-2019/pregunta/formulario-solicitud-directiva-008-2019.component';
import { FormularioSolicitudDirectiva0082019RespuestaComponent } from './components/extranjeria/formulario-solicitud-directiva-008-2019/respuesta/formulario-solicitud-directiva-008-2019-respuesta.component';
import { FormularioSolicitudCorreccionCieComponent } from './extranjeria/components/extranjeria/formulario-solicitud-correccion-cie/pregunta/formulario-solicitud-correccion-cie.component';

@NgModule({
  declarations: [
    SolicitudComponent,
    NewTipoSolicitudComponent,
    ModalNewSolicitudComponent,
    FormularioSolicitudComponent,
    FormularioSolicitudDirectiva0082019Component,
    FormularioSolicitudDirectiva0082019RespuestaComponent,
    FormularioSolicitudCorreccionCieComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers:[
    DatePipe
  ]
})
export class SolicitudModule { }
