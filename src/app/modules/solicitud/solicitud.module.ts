import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SolicitudComponent } from './components/solicitud/solicitud.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewTipoSolicitudComponent } from './components/new-tipo-solicitud/new-tipo-solicitud.component';
import { ModalNewSolicitudComponent } from './components/modal-new-solicitud/modal-new-solicitud.component';
import { FormularioSolicitudComponent } from './components/extranjeria/formulario-solicitud/pregunta/formulario-solicitud.component';
import { FormularioSolicitudDirectiva0082019Component } from './components/extranjeria/formulario-solicitud-directiva-008-2019/pregunta/formulario-solicitud-directiva-008-2019.component';
import { FormularioSolicitudDirectiva0082019RespuestaComponent } from './components/extranjeria/formulario-solicitud-directiva-008-2019/respuesta/formulario-solicitud-directiva-008-2019-respuesta.component';
import { FormularioSolicitudCorreccionCieComponent } from './components/extranjeria/formulario-solicitud-correccion-cie/pregunta/formulario-solicitud-correccion-cie.component';
import { FormularioSolicitudRespuestaComponent } from './components/extranjeria/formulario-solicitud/respuesta/formulario-solicitud-respuesta.component';
import { FormularioSolicitudCorreccionCieRespuestaComponent } from './components/extranjeria/formulario-solicitud-correccion-cie/respuesta/formulario-solicitud-correccion-cie-respuesta.component';
import { FormularioBajaOrpeNaturalizacionComponent } from './components/extranjeria/formulario-baja-orpe-naturalizacion/pregunta/formulario-baja-orpe-naturalizacion.component';
import { FormularioBajaOrpeNaturalizacionRespuestaComponent } from './components/extranjeria/formulario-baja-orpe-naturalizacion/respuesta/formulario-baja-orpe-naturalizacion-respuesta.component';
import { FormularioConvenioComponent } from './components/extranjeria/formulario-convenio/pregunta/formulario-convenio.component';
import { FormularioConvenioRespuestaComponent } from './components/extranjeria/formulario-convenio/respuesta/formulario-convenio-respuesta.component';
import { MaterialModule } from '../shared/material.module';
import { ComentarioComponent } from './components/extranjeria/comentario/comentario.component';
// import { NewDocumentoComponent } from './components/extranjeria/comentario/new-documento/new-documento.component';
import { DocumentacionComponent } from './components/extranjeria/comentario/documentacion/documentacion.component';
import { LicenciasComponent } from './components/licencias/licencias.component';


@NgModule({
  declarations: [
    SolicitudComponent,
    NewTipoSolicitudComponent,
    ModalNewSolicitudComponent,
    FormularioSolicitudComponent,
    FormularioSolicitudDirectiva0082019Component,
    FormularioSolicitudDirectiva0082019RespuestaComponent,
    FormularioSolicitudCorreccionCieComponent,
    FormularioSolicitudRespuestaComponent,
    FormularioSolicitudCorreccionCieRespuestaComponent,
    FormularioBajaOrpeNaturalizacionComponent,
    FormularioBajaOrpeNaturalizacionRespuestaComponent,
    FormularioConvenioComponent,
    FormularioConvenioRespuestaComponent,
    ComentarioComponent,
    // NewDocumentoComponent,
    DocumentacionComponent,
    LicenciasComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,

    // EditorModule
  ],
  providers:[
    DatePipe,

  ]
})
export class SolicitudModule { }
