import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TipoSaneoComponent } from './components/tipo-saneo/tipo-saneo.component';
import { MaterialModule } from '../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewTipoSaneoComponent } from './components/new-tipo-saneo/new-tipo-saneo.component';
import { DetalleTipoSaneoComponent } from './components/detalle-tipo-saneo/detalle-tipo-saneo.component';
import { RouterModule } from '@angular/router';
import { NewDetalleTipoSaneoComponent } from './components/new-detalle-tipo-saneo/new-detalle-tipo-saneo.component';
import { DocumentoDetalleTipoSaneoComponent } from './components/documento-detalle-tipo-saneo/documento-detalle-tipo-saneo.component';
import { NewDocumentoDetalleTipoSaneoComponent } from './components/new-documento-detalle-tipo-saneo/new-documento-detalle-tipo-saneo.component';

@NgModule({
  declarations: [
    TipoSaneoComponent,
    NewTipoSaneoComponent,
    DetalleTipoSaneoComponent,
    NewDetalleTipoSaneoComponent,
    DocumentoDetalleTipoSaneoComponent,
    NewDocumentoDetalleTipoSaneoComponent
  ],
  imports: [
    RouterModule,
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class TipoSaneoModule { }
