import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './pages/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { UsuarioModule } from '../usuario/usuario.module';


@NgModule({
  declarations: [
    DashboardComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    UsuarioModule
  ]
})

export class DashboardModule { }
