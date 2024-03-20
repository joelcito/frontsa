import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsignacionComponent } from './components/asignacion/asignacion.component';
import { MaterialModule } from '../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsignacionSolicitudDependenciaComponent } from './components/asignacion-solicitud-dependencia/asignacion-solicitud-dependencia.component';

@NgModule({
  declarations: [
    AsignacionComponent,
    AsignacionSolicitudDependenciaComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AsignacionModule { }
