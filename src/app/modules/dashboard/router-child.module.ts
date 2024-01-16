import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { UsuarioComponent } from '../usuario/components/usuario/usuario.component';
import { TipoSaneoComponent } from '../tipo_saneo/components/tipo-saneo/tipo-saneo.component';
import { RolComponent } from '../rol/components/rol/rol.component';
import { DetalleTipoSaneoComponent } from '../tipo_saneo/components/detalle-tipo-saneo/detalle-tipo-saneo.component';
import { DocumentoDetalleTipoSaneoComponent } from '../tipo_saneo/components/documento-detalle-tipo-saneo/documento-detalle-tipo-saneo.component';

const ChildRoutes: Routes = [
  { path: '', component: HomeComponent },

  { path: 'home', component: HomeComponent },

  { path: 'usuario', component: UsuarioComponent },

  // ************************* TIPO SANEO *************************
  { path: 'tipo_saneo', component: TipoSaneoComponent },
  { path: 'tipo_saneo/:id', component: DetalleTipoSaneoComponent },
  { path: 'tipo_saneo/:tipo_saneo_id/:detalle_tipo_saneo_id', component: DocumentoDetalleTipoSaneoComponent },



  { path: 'rol', component: RolComponent },

]

@NgModule({
  imports: [RouterModule.forChild(ChildRoutes)],
  exports: [RouterModule],
})

export class RouterChildModule { }
