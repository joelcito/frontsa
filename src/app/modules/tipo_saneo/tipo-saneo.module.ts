import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TipoSaneoComponent } from './components/tipo-saneo/tipo-saneo.component';
import { MaterialModule } from '../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    TipoSaneoComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class TipoSaneoModule { }
