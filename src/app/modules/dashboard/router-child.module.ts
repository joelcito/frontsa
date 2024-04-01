import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { UsuarioComponent } from '../usuario/components/usuario/usuario.component';
import { TipoSaneoComponent } from '../tipo_saneo/components/tipo-saneo/tipo-saneo.component';
import { RolComponent } from '../rol/components/rol/rol.component';
import { DetalleTipoSaneoComponent } from '../tipo_saneo/components/detalle-tipo-saneo/detalle-tipo-saneo.component';
import { DocumentoDetalleTipoSaneoComponent } from '../tipo_saneo/components/documento-detalle-tipo-saneo/documento-detalle-tipo-saneo.component';
import { FormularioComponent } from '../formulario/components/formulario/formulario.component';
import { PregutaFormularioComponent } from '../formulario/components/preguta-formulario/preguta-formulario.component';
import { SolicitudComponent } from '../solicitud/components/solicitud/solicitud.component';
import { NewTipoSolicitudComponent } from '../solicitud/components/new-tipo-solicitud/new-tipo-solicitud.component';
import { FormularioSolicitudComponent } from '../solicitud/components/extranjeria/formulario-solicitud/pregunta/formulario-solicitud.component';
import { AsignacionComponent } from '../asignacion/components/asignacion/asignacion.component';
import { FormularioSolicitudDirectiva0082019Component } from '../solicitud/components/extranjeria/formulario-solicitud-directiva-008-2019/pregunta/formulario-solicitud-directiva-008-2019.component';
import { FormularioSolicitudDirectiva0082019RespuestaComponent } from '../solicitud/components/extranjeria/formulario-solicitud-directiva-008-2019/respuesta/formulario-solicitud-directiva-008-2019-respuesta.component';
import { FormularioSolicitudCorreccionCieComponent } from '../solicitud/components/extranjeria/formulario-solicitud-correccion-cie/pregunta/formulario-solicitud-correccion-cie.component';
import { FormularioSolicitudRespuestaComponent } from '../solicitud/components/extranjeria/formulario-solicitud/respuesta/formulario-solicitud-respuesta.component';
import { FormularioSolicitudCorreccionCieRespuestaComponent } from '../solicitud/components/extranjeria/formulario-solicitud-correccion-cie/respuesta/formulario-solicitud-correccion-cie-respuesta.component';
import { FormularioBajaOrpeNaturalizacionComponent } from '../solicitud/components/extranjeria/formulario-baja-orpe-naturalizacion/pregunta/formulario-baja-orpe-naturalizacion.component';
import { FormularioBajaOrpeNaturalizacionRespuestaComponent } from '../solicitud/components/extranjeria/formulario-baja-orpe-naturalizacion/respuesta/formulario-baja-orpe-naturalizacion-respuesta.component';
import { FormularioConvenioComponent } from '../solicitud/components/extranjeria/formulario-convenio/pregunta/formulario-convenio.component';
import { FormularioConvenioRespuestaComponent } from '../solicitud/components/extranjeria/formulario-convenio/respuesta/formulario-convenio-respuesta.component';
import { AsignacionSolicitudDependenciaComponent } from '../asignacion/components/asignacion-solicitud-dependencia/asignacion-solicitud-dependencia.component';

const ChildRoutes: Routes = [
  { path: '', component: HomeComponent },

  // ************************* HOME *************************
  { path: 'home', component: HomeComponent },

  // ************************* USUARIO *************************
  { path: 'usuario', component: UsuarioComponent },

  // ************************* TIPO SANEO *************************
  { path: 'tipo_saneo', component: TipoSaneoComponent },
  { path: 'tipo_saneo/:id', component: DetalleTipoSaneoComponent },
  { path: 'tipo_saneo/:tipo_saneo_id/:detalle_tipo_saneo_id', component: DocumentoDetalleTipoSaneoComponent },

  // ************************* ROL *************************
  { path: 'rol', component: RolComponent },

  // ************************* FORMULARIO *************************
  { path: 'formulario', component: FormularioComponent },
  { path: 'formulario/:formulario_id', component: PregutaFormularioComponent },

  // ************************* SOLICITUD *************************
  { path: 'solicitud', component: SolicitudComponent },
  { path: 'solicitud/newTipoSolicitud', component: NewTipoSolicitudComponent },

  { path: 'solicitud/newTipoSolicitud/newFormulario/:tipo_saneo_id/:formulario_id', component: FormularioSolicitudComponent },
  { path: 'solicitud/newTipoSolicitud/newFormularioRes/:solicitud_id', component: FormularioSolicitudRespuestaComponent },

  { path: 'solicitud/newTipoSolicitud/newFormularioDirectiva0082019/:tipo_saneo_id/:formulario_id', component: FormularioSolicitudDirectiva0082019Component },
  { path: 'solicitud/newTipoSolicitud/newFormularioDirectiva0082019Res/:solicitud_id', component: FormularioSolicitudDirectiva0082019RespuestaComponent },

  { path: 'solicitud/newTipoSolicitud/newFormularioCorrecionCie/:tipo_saneo_id/:formulario_id/:solicitud_id', component: FormularioSolicitudCorreccionCieComponent },
  { path: 'solicitud/newTipoSolicitud/newFormularioCorrecionCieRes/:solicitud_id', component: FormularioSolicitudCorreccionCieRespuestaComponent },

  { path: 'solicitud/newTipoSolicitud/newFormularioBajaOrpeNaturalizacion/:tipo_saneo_id/:formulario_id/:solicitud_id', component: FormularioBajaOrpeNaturalizacionComponent },
  { path: 'solicitud/newTipoSolicitud/newFormularioBajaOrpeNaturalizacionRes/:solicitud_id', component: FormularioBajaOrpeNaturalizacionRespuestaComponent },

  { path: 'solicitud/newTipoSolicitud/newFormularioConvenio/:tipo_saneo_id/:formulario_id/:solicitud_id', component: FormularioConvenioComponent },
  { path: 'solicitud/newTipoSolicitud/newFormularioConvenioRes/:solicitud_id', component: FormularioConvenioRespuestaComponent },

  // ************************* ASIGNACION *************************
  { path: 'asignacion', component: AsignacionComponent},

  // ************************* ASIGNACION SOLICITUD DEPENDENCIA *************************
  { path: 'asignacion_solicitud_dependencia', component: AsignacionSolicitudDependenciaComponent},

]

@NgModule({
  imports: [RouterModule.forChild(ChildRoutes)],
  exports: [RouterModule],
})

export class RouterChildModule { }
