import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsignacionComponent } from './components/asignacion/asignacion.component';
import { MaterialModule } from '../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AsignacionComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AsignacionModule { }
