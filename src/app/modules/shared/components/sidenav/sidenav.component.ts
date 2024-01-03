import { MediaMatcher } from '@angular/cdk/layout';
import { Component, inject } from '@angular/core';
import { LoginService } from '../../../../login/login.service';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
// import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent {

  mobileQuery   : MediaQueryList;
  loginService  : LoginService = inject(LoginService);
  router        : Router      = inject(Router);
  usuarioService: UsuarioService = inject(UsuarioService);
  correo        : string = '';
  roles         : any = []
  rol_actual    : any = [];
  // _snackBar   :MatSnackBar  = inject(MatSnackBar);

  // PRIMERA VERSION
  // menuNav = [
  //   {name:"Home", route:"home", icon:"home"},
  //   {name:"Usuario", route:"usuario", icon:"account_circle"},
  //   {name:"Tipo Saneo", route:"tipo_saneo", icon:"find_in_page"},
  // ];


  // SEGUNDA VERSION
    // menuNav: {
    //   name: string;
    //   icon: string;
    //   route: string;
    //   active: boolean;
    //   subMenus: { name: string; url: string , active:boolean }[];
    // }[] = [
    //         {
    //           name: 'Home',
    //           icon: 'home',
    //           route: '/home',
    //           active: true,
    //           subMenus: [
    //             { name: 'Listado', url: 'home', active:true },
    //           ]
    //         },
    //         {
    //           name: 'Usuario',
    //           icon: 'person',
    //           route: '/profile',
    //           active: true,
    //           subMenus: [
    //             { name: 'Listado Usuarios', url: 'usuario', active:true },
    //             { name: 'Listado Rol', url: 'rol' , active:true},
    //           ]
    //         },
    //         {
    //           name: 'Tipo Saneo',
    //           icon: 'find_in_page',
    //           route: '/home',
    //           active: true,
    //           subMenus: [
    //             { name: 'Listado', url: 'tipo_saneo' , active:true},
    //           ]
    //         }
    //       ];


    // TERCERA VERSION
    menuNav: {
      name: string;
      icon: string;
      route: string;
      active: boolean;
      subMenus: { name: string; url: string , active:boolean }[];
    }[] = [];

  constructor(media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    const datos = sessionStorage.getItem('datos');
    // PARA RESCATAR LOS DATOS
    if(datos){
      let dar = JSON.parse(datos)
      this.correo  = dar.username
      this.roles = dar.roles

      // console.log(this.roles, this.roles.length)
      if(this.roles.length > 0){
        this.rol_actual = this.roles[0]
        const rol_id = this.rol_actual.id
        this.parametrizarRolActual(dar.id ,rol_id)
      }
    }

    // DE AQUI VAMOS A PARAMETRIZAR LOS DATOS
    // this.menuNav = [
    //   {
    //     name: 'Home',
    //     icon: 'home',
    //     route: '/home',
    //     active: true,
    //     subMenus: [
    //       { name: 'Listado', url: 'home', active:true },
    //     ]
    //   },
    //   {
    //     name: 'Usuario',
    //     icon: 'person',
    //     route: '/profile',
    //     active: true,
    //     subMenus: [
    //       { name: 'Listado Usuarios', url: 'usuario', active:true },
    //       { name: 'Listado Rol', url: 'rol' , active:true},
    //     ]
    //   },
    //   {
    //     name: 'Tipo Saneo',
    //     icon: 'find_in_page',
    //     route: '/home',
    //     active: true,
    //     subMenus: [
    //       { name: 'Listado', url: 'tipo_saneo' , active:true},
    //     ]
    //   }
    // ];
  }

  cerrarSesion(){
    this.loginService.logout()
    this.router.navigate(['login']);
    // this.openSnackBar('Cerro la session con Exito', 'Cerrar');
  }

  parametrizarRolActual(usuario:number,rol:number ){
    this.usuarioService.getMenuRol(usuario, rol).subscribe((datos:any) => {

      console.log(datos.menus)

      const datosRecuperados = JSON.parse(datos.menus);
      this.menuNav = datosRecuperados

      console.log(datosRecuperados)
    })
  }

  cambiarRol(rol:any){
    const datos = sessionStorage.getItem('datos');
    if(datos){
      let dar = JSON.parse(datos)
      this.parametrizarRolActual(dar.id ,rol)

      console.log(dar.id ,rol)
    }
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
