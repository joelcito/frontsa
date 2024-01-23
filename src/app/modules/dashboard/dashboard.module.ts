import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './pages/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { UsuarioModule } from '../usuario/usuario.module';
import { TipoSaneoModule } from '../tipo_saneo/tipo-saneo.module';
import { RolModule } from '../rol/rol.module';
import { FormularioModule } from '../formulario/formulario.module';
import { SolicitudModule } from '../solicitud/solicitud.module';


@NgModule({
  declarations: [
    DashboardComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    UsuarioModule,
    TipoSaneoModule,
    RolModule,
    FormularioModule,
    SolicitudModule
  ]
})

export class DashboardModule { }
