import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolComponent } from './components/rol/rol.component';
import { MaterialModule } from '../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    RolComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class RolModule { }
