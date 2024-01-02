import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { UsuarioComponent } from '../usuario/components/usuario/usuario.component';

const ChildRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'usuario', component: UsuarioComponent },
]

@NgModule({
  imports: [RouterModule.forChild(ChildRoutes)],
  exports: [RouterModule],
})

export class RouterChildModule { }
