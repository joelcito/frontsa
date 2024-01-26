import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolicitudComponent } from './components/solicitud/solicitud.component';
import { MaterialModule } from '../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewTipoSolicitudComponent } from './components/new-tipo-solicitud/new-tipo-solicitud.component';
import { ModalNewSolicitudComponent } from './components/modal-new-solicitud/modal-new-solicitud.component';
import { FormularioSolicitudComponent } from './components/formulario-solicitud/formulario-solicitud.component';

@NgModule({
  declarations: [
    SolicitudComponent,
    NewTipoSolicitudComponent,
    ModalNewSolicitudComponent,
    FormularioSolicitudComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SolicitudModule { }
