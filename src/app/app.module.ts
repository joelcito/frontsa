import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginModule } from './login/login.module';
import { FormularioSolicitudCorreccionCieComponent } from './modules/extranjeria/formulario-solicitud-correccion-cie/pregunta/formulario-solicitud-correccion-cie/formulario-solicitud-correccion-cie.component';

@NgModule({
  declarations: [
    AppComponent,
    FormularioSolicitudCorreccionCieComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DashboardModule,
    BrowserAnimationsModule,
    LoginModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
