import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { MaterialModule } from '../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewUsuarioComponent } from './components/new-usuario/new-usuario.component';
import { UserRolComponent } from './components/user-rol/user-rol.component';
import { RolMenuComponent } from './components/rol-menu/rol-menu.component';

@NgModule({
  declarations: [
    UsuarioComponent,
    NewUsuarioComponent,
    UserRolComponent,
    RolMenuComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})

export class UsuarioModule { }
