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
  rol           : string = '';
  roles         : any = []
  rol_actual    : any = [];
  // _snackBar   :MatSnackBar  = inject(MatSnackBar);

  // PRIMERA VERSION
  // menuNav = [
  //   {name:"Home", route:"home", icon:"home"},
  //   {name:"Usuario", route:"usuario", icon:"account_circle"},
  //   {name:"Tipo Saneo", route:"tipo_saneo", icon:"find_in_page"},
  // ];

    // TERCERA VERSION
    menuNav: {
      name    : string;
      icon    : string;
      route   : string;
      active  : boolean;
      subMenus: { name: string; url: string , active:boolean }[];
    }[] = [];

  constructor(media: MediaMatcher) {
          this.mobileQuery = media.matchMedia('(max-width: 600px)');
    const datos            = sessionStorage.getItem('datos');

    // PARA RESCATAR LOS DATOS
    if(datos){

      let dar         = JSON.parse(datos)
          this.correo = dar.username
          this.roles  = dar.roles
          this.rol    = this.rol_actual.nombre;

      if(this.roles.length > 0){
              this.rol_actual = this.roles[0]
        const rol_id          = this.rol_actual.id
        this.parametrizarRolActual(dar.id ,rol_id)
      }
    }else{
    }
  }

  cerrarSesion(){
    this.loginService.logout()
    this.router.navigate(['login']);
  }

  parametrizarRolActual(usuario:number,rol:number ){
    this.usuarioService.getMenuRol(usuario, rol).subscribe((datos:any) => {

      const datosRecuperados = JSON.parse(datos.menus);
            this.menuNav     = datosRecuperados
            this.rol         = datos.rol.nombre;

      this.usuarioService.setMenuNavData(datosRecuperados);
      this.usuarioService.setRolAsigando(this.rol_actual.nombre);

    })
  }

  cambiarRol(rol:any, nombre:string){
    const datos = sessionStorage.getItem('datos');
    if(datos){
      let dar = JSON.parse(datos)
      this.parametrizarRolActual(dar.id ,rol)
      this.rol = nombre;
    }
  }

}
