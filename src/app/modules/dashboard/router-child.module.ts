import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { UsuarioComponent } from '../usuario/components/usuario/usuario.component';
import { TipoSaneoComponent } from '../tipo_saneo/components/tipo-saneo/tipo-saneo.component';

const ChildRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'usuario', component: UsuarioComponent },
  { path: 'tipo_saneo', component: TipoSaneoComponent },
]

@NgModule({
  imports: [RouterModule.forChild(ChildRoutes)],
  exports: [RouterModule],
})

export class RouterChildModule { }
