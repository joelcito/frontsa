import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { MaterialModule } from '../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewUsuarioComponent } from './components/new-usuario/new-usuario.component';

@NgModule({
  declarations: [
    UsuarioComponent,
    NewUsuarioComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})

export class UsuarioModule { }
