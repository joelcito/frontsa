import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolicitudComponent } from './components/solicitud/solicitud.component';
import { MaterialModule } from '../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewTipoSolicitudComponent } from './components/new-tipo-solicitud/new-tipo-solicitud.component';

@NgModule({
  declarations: [
    SolicitudComponent,
    NewTipoSolicitudComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SolicitudModule { }
