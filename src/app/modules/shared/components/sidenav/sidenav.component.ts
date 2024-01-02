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

  // menuNav = [
  //   {name:"Home", route:"home", icon:"home"},
  //   {name:"Usuario", route:"usuario", icon:"account_circle"},
  //   {name:"Tipo Saneo", route:"tipo_saneo", icon:"find_in_page"},
  // ];

    menuNav = [
      {
        name: 'Home',
        icon: 'home',
        route: '/home',
        active: true,
        subMenus: [
          { name: 'Tablets', url: '#' },
          { name: 'Mobiles', url: '#' },
          { name: 'Desktop', url: '#' }
        ] // Puedes añadir submenús aquí si corresponde
      },
      {
        name: 'Profile',
        icon: 'person',
        route: '/profile',
        active: true,
        subMenus: [
          { name: 'Settings', route: '/profile/settings' },
          { name: 'Preferences', route: '/profile/preferences' }
        ]
      },
      {
        name: 'Web Browser',
        icon: 'fa fa-globe',
        active: false,
        subMenus: [
          { name: 'Chrome', url: '#' },
          { name: 'Firefox', url: '#' },
          { name: 'Desktop', url: '#' }
        ]
      }
      // Puedes seguir añadiendo más elementos con submenús si es necesario
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


  // PROBANDO EL NUEVO MENU
  // toggle(index: number) {
  //   // 멀티 오픈을 허용하지 않으면 타깃 이외의 모든 submenu를 클로즈한다.
  //   if (!this.config.multi) {
  //     this.menus
  //       .filter((menu, i) => i !== index && menu.active)
  //       .forEach(menu => (menu.active = !menu.active));
  //   }

  //   // Menu의 active를 반전
  //   this.menus[index].active = !this.menus[index].active;
  // }

}
