import { MediaMatcher } from '@angular/cdk/layout';
import { Component, inject } from '@angular/core';
import { LoginService } from '../../../../login/login.service';
import { Router } from '@angular/router';
// import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent {

  mobileQuery: MediaQueryList;

  loginService:LoginService = inject(LoginService);
  router      :Router       = inject(Router);
  // _snackBar   :MatSnackBar  = inject(MatSnackBar);

  menuNav = [
    {name:"Home", route:"home", icon:"home"},
    {name:"Usuario", route:"usuario", icon:"account_circle"},
    {name:"Tipo Saneo", route:"tipo_saneo", icon:"find_in_page"},
    // {name:"Productos", route:"product", icon:"production_quantity_limits"},
  ];

  constructor(media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
  }

  cerrarSesion(){
    this.loginService.logout()
    this.router.navigate(['login']);
    // this.openSnackBar('Cerro la session con Exito', 'Cerrar');

  }

  // openSnackBar(message: string, action: string) {
  //   this._snackBar.open(message, action, {
  //     duration: 4000, // Duración en milisegundos
  //     panelClass: ['snackbar-green']
  //   });
  // }


}
