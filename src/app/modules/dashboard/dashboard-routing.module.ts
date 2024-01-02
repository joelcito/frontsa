import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard.component';
import { loginGuard } from '../../login/login.guard';

const routes: Routes = [
  {
    // path: 'dashboard',
    path: '',
    component: DashboardComponent,
    canActivate:[loginGuard],
    loadChildren: () => import('./router-child.module').then(m => m.RouterChildModule)
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class DashboardRoutingModule { }
