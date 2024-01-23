import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormularioComponent } from './components/formulario/formulario.component';
import { MaterialModule } from '../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewFormularioComponent } from './components/new-formulario/new-formulario.component';
import { PregutaFormularioComponent } from './components/preguta-formulario/preguta-formulario.component';
import { NewPregutaFormularioComponent } from './components/new-preguta-formulario/new-preguta-formulario.component';

@NgModule({
  declarations: [
    FormularioComponent,
    NewFormularioComponent,
    PregutaFormularioComponent,
    NewPregutaFormularioComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class FormularioModule { }
