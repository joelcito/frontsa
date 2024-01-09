import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RolElement } from '../../../rol/components/rol/rol.component'
import { RolService } from '../../../shared/services/rol.service';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { RolMenuComponent } from '../rol-menu/rol-menu.component';
import { UsuarioService } from '../../../shared/services/usuario.service';

@Component({
  selector: 'app-user-rol',
  templateUrl: './user-rol.component.html',
  styleUrl: './user-rol.component.css'
})

export class UserRolComponent implements OnInit {

  private dialogRef      = inject(MatDialogRef<UserRolComponent>)
  public  data           = inject(MAT_DIALOG_DATA);
  private formBuilde     = inject(FormBuilder);
  private rolService     = inject(RolService);
  public  dialogRolMenu  = inject(MatDialog);
  private snackBar       = inject(MatSnackBar);
  private usuarioService = inject(UsuarioService);

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

  public  roles       : any[] = [];
  public  rolesUsuario: any[] = [];
  public  menuForm!   : FormGroup;
  public  rolesForm!  : FormGroup;
  private usuario     : any;

  ngOnInit(): void {

    // console.log(this.data)

    this.roles        = this.data.roles;
    this.rolesUsuario = this.data.datos;
    this.usuario      = this.data.usuario;

    // ********* PARA ROLRES *********
    this.rolesForm = this.formBuilde.group({});
    this.initializeFormRol()
    // console.log(this.rolesForm.value, JSON.stringify(this.rolesUsuario))
    // console.log(this.roles)

    // *********PARA MENUS *********
    // this.menuNav = this.data.menus
    // this.menuForm = this.formBuilde.group({});
    // this.initializeForm()
    // console.log(this.menuForm.value)
  }

  initializeForm() {

    // this.arrayFormVista = [] as {
    //                         nombre: string;
    //                         estado: boolean;
    //                         submenus: { nombre: string; estado: boolean }[];
    //                       }[];

    if (this.menuForm) {
      this.menuNav.forEach((menu, index) => {
        // console.log(menu)
        let sinEspa  = (menu.name).replaceAll(" ","")
        let submenus = menu.subMenus
        this.menuForm.addControl(`${sinEspa}_${index}_padre`, this.formBuilde.control(menu.active));
        const formattedMenu = {
          nombre  : menu.name,
          estado  : menu.active,
          control : `${sinEspa}_${index}_padre`,
          submenus: [] as { nombre: string; control: string; estado: boolean }[]
        };
        submenus.forEach((submenu, key) => {
          // console.log(submenu)
          let sinEspaSubMenu  = (submenu.name).replaceAll(" ","")
          this.menuForm.addControl(`${sinEspaSubMenu}_${key}_hijo_${sinEspa}`, this.formBuilde.control(submenu.active));
          const formattedSubmenu = {
            nombre : submenu.name,
            estado : submenu.active,
            control: `${sinEspaSubMenu}_${key}_hijo_${sinEspa}`,
          };
          formattedMenu.submenus.push(formattedSubmenu);
        })
        this.arrayFormVista.push(formattedMenu)
        // console.log("-------------------------------------------------")
      });
    } else {
      // console.error('Error: menuForm is not initialized.');
    }


    // console.log(this.arrayFormVista)
  }

  // getRolse(){
  //   this.rolService.getRoles().subscribe(data => {
  //     this.roles = data as RolElement[];
  //     this.roles.forEach((rol, key)=> {
  //       console.log(rol, key)
  //       let nomSinEspa  = (rol.nombre).replaceAll(" ","")
  //       this.rolesForm.addControl(`${nomSinEspa}`, this.formBuilde.control(false));
  //     })
  //   })
  // }

  initializeFormRol(){
    this.roles.forEach((rol, index) => {
      let nomSinEspa  = (rol.nombre).replaceAll(" ","")
      let dato = this.rolesUsuario.some(rolse => rolse.nombre === rol.nombre)
      this.rolesForm.addControl(`${nomSinEspa}_${rol.id}`, this.formBuilde.control(dato));
    })
  }

  guardarRol(){
    // Aquí deberías tener inicializado el formulario 'rolesForm'
    const values: any = {};

    this.roles.forEach((rol, index) => {
      let nomSinEspa = (rol.nombre).replaceAll(" ", "");
      values[nomSinEspa+"_"+rol.id] = this.rolesForm.get(`${nomSinEspa}_${rol.id}`)?.value;
    });

    this.rolService.updateRolesUser(this.usuario, values).subscribe(result => {
      console.log(result)
      this.dialogRef.close(1);
    }, (error:any) => {
      console.log(error)
      this.dialogRef.close(2);
    })
  }

  verMenusHabilitados(rol:any){

    this.usuarioService.getMenuRol(this.usuario, rol).subscribe(result => {
      const dialogRef = this.dialogRolMenu.open( RolMenuComponent, {
        width: '405px',
        data: {
          uusario: this.usuario,
          rol    : rol,
          menus  : result
        },
      });

      dialogRef.afterClosed().subscribe((result:any) => {
        if(result == 1){
          this.openSnackBar('USUARIO REGISTADO CON EXITO','Exitosa');
          // this.getTiposSaneo();
        }else if(result == 2){
          this.openSnackBar('SE PRODUCO UN ERROR','Error');
        }

      });
      // console.log(this.usuario)
      // console.log(rol)
    })


    // this.usuarioService.getRolesUser(this.usuario).subscribe(resul => {
    //   const dialogRef = this.dialogRolMenu.open( RolMenuComponent, {
    //     width: '405px',
    //     data: {
    //       uusario: this.usuario,
    //       rol    : rol,
    //       menus  : resul
    //     },
    //   });

    //   dialogRef.afterClosed().subscribe((result:any) => {
    //     if(result == 1){
    //       this.openSnackBar('USUARIO REGISTADO CON EXITO','Exitosa');
    //       // this.getTiposSaneo();
    //     }else if(result == 2){
    //       this.openSnackBar('SE PRODUCO UN ERROR','Error');
    //     }

    //   });
    //     console.log(this.usuario)
    //     console.log(rol)
    // })

    // const dialogRef = this.dialogRolMenu.open( RolMenuComponent, {
    //   width: '405px',
    //   data: {uusario: this.usuario, rol: rol},
    // });

    // dialogRef.afterClosed().subscribe((result:any) => {
    //   if(result == 1){
    //     this.openSnackBar('USUARIO REGISTADO CON EXITO','Exitosa');
    //     // this.getTiposSaneo();
    //   }else if(result == 2){
    //     this.openSnackBar('SE PRODUCO UN ERROR','Error');
    //   }

    // });
    //  console.log(this.usuario)
    //  console.log(rol)
  }


  // initializeForm() {
  //   this.menuNav.forEach((menu, menuIndex) => {
  //     const menuGroup = this.formBuilde.group({
  //       active: [menu.active]
  //     });

  //     menu.subMenus.forEach((subMenu, subMenuIndex) => {
  //       menuGroup.addControl(
  //         `subMenu${subMenuIndex}`,
  //         this.formBuilde.control(subMenu.active)
  //       );
  //     });

  //     this.menuForm.addControl(`menu${menuIndex}`, menuGroup);
  //   });
  // }

  // openTipoSaneoDialog(){
  //   const dialogRef = this.dialogRolMenu.open( RolMenuComponent, {
  //     width: '405px',
  //     // data: {name: this.name, animal: this.animal},
  //   });

  //   dialogRef.afterClosed().subscribe((result:any) => {
  //     if(result == 1){
  //       this.openSnackBar('USUARIO REGISTADO CON EXITO','Exitosa');
  //       // this.getTiposSaneo();
  //     }else if(result == 2){
  //       this.openSnackBar('SE PRODUCO UN ERROR','Error');
  //     }

  //   });
  // }

  openSnackBar(message:string, action:string): MatSnackBarRef<SimpleSnackBar>{
    return this.snackBar.open(message, action,{
      duration:2000
    });
  }


}
