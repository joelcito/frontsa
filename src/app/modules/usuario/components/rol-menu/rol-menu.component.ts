import { Component, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserRolComponent } from '../user-rol/user-rol.component';
import { UsuarioService } from '../../../shared/services/usuario.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-rol-menu',
  templateUrl: './rol-menu.component.html',
  styleUrl: './rol-menu.component.css'
})
export class RolMenuComponent implements OnInit{

  private dialogRefRolMenu = inject(MatDialogRef<UserRolComponent>)
  public  data             = inject(MAT_DIALOG_DATA);
  private usuarioService   = inject(UsuarioService);
  private formBuilder      = inject(FormBuilder);

  public  menuNav: {
                name    : string;
                icon    : string;
                route   : string;
                active  : boolean;
                subMenus: { name: string; url: string , active:boolean }[];
              }[] = [];

  public arrayFormVista: {
                nombre  : string;
                estado  : boolean;
                control : string;
                submenus: { nombre: string; control: string; estado: boolean }[];
              }[] = [];

  private menuRolUser     : any;
  private usuario         : any;
  private rol             : any;
  public  menuFormRolMenu!: FormGroup;



  ngOnInit(): void {

    this.menuFormRolMenu = this.formBuilder.group({});

    if(this.data.menus){
      this.menuNav     = JSON.parse(this.data.menus.menus);
      this.menuRolUser = this.data.menus.id;
      this.usuario     = this.data.uusario;
      this.rol         = this.data.rol;
      // console.log(this.data)
    }

    this.getRolesUser();

    this.generaFormuarlio();

    // console.log(this.menuFormRolMenu.value)
    console.log(this.data)
  }

  getRolesUser(){
    // console.log(this.data.uusario,this.data.rol)
    this.usuarioService.getMenuRol(this.usuario,this.rol).subscribe((result:any) => {
      this.menuNav = JSON.parse(result.menus);
      // console.log(this.menuNav, result.menus)
    })
  }

  generaFormuarlio(){

    // console.log(JSON.stringify(this.menuNav))

      this.menuNav.forEach((menu, index) => {

          let sinEspa  = (menu.name).replaceAll(" ","")
          let submenus = menu.subMenus
          this.menuFormRolMenu.addControl(`${sinEspa}_${index}_padre`, new FormControl(menu.active));
          const formattedMenu = {
            nombre  : menu.name,
            estado  : menu.active,
            control : `${sinEspa}_${index}_padre`,
            submenus: [] as { nombre: string; control: string; estado: boolean }[]
          };

          submenus.forEach((submenu, key) => {
            let sinEspaSubMenu  = (submenu.name).replaceAll(" ","")
            this.menuFormRolMenu.addControl(`${sinEspaSubMenu}_${key}_hijo_${sinEspa}`, new FormControl(submenu.active));
            const formattedSubmenu = {
              nombre : submenu.name,
              estado : submenu.active,
              control: `${sinEspaSubMenu}_${key}_hijo_${sinEspa}`,
            };
            formattedMenu.submenus.push(formattedSubmenu);
          })
          this.arrayFormVista.push(formattedMenu)
          // console.log("-----------------------------
      });
  }

  guardarMenusUsuario(){
    this.menuFormRolMenu.addControl('usuariorol', this.formBuilder.control(this.menuRolUser));
    this.menuFormRolMenu.addControl('rolid', this.formBuilder.control(this.rol));
    this.menuFormRolMenu.addControl('userid', this.formBuilder.control(this.usuario));
    console.log(this.menuFormRolMenu.value)
    this.usuarioService.saveMenuUserById(this.menuFormRolMenu.value).subscribe(resul => {
      console.log(resul)
    })
  }

}
