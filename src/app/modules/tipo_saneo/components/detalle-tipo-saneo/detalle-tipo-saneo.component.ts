import { Component, OnInit, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { TipoSaneoService } from '../../../shared/services/tipo-saneo.service';
import { MatDialog } from '@angular/material/dialog';
import { NewDetalleTipoSaneoComponent } from '../new-detalle-tipo-saneo/new-detalle-tipo-saneo.component';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';


@Component({
  selector: 'app-detalle-tipo-saneo',
  templateUrl: './detalle-tipo-saneo.component.html',
  styleUrl: './detalle-tipo-saneo.component.css'
})

export class DetalleTipoSaneoComponent implements OnInit  {

  private route            = inject(ActivatedRoute);
  private tipoSaneoService = inject(TipoSaneoService);
  private snackBar         = inject(MatSnackBar);
  public  dialog           = inject(MatDialog);
  private router           = inject(Router);

  dataSourceDetalleTipoSaneo = new MatTableDataSource<DetalleTipoSaneoElement>();

  displayedColumns: String[]      = ['id', 'tipo_saneo','nombre', 'acciones'];
  private          tipo_saneo:any = [];
  private          tipo_saneo_id:any;

  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);


  ngOnInit(): void {
    this.route.params.subscribe(params => {

      // console.log(params)

      const idEncriptado = params['id']; // Obteniendo el valor de 'tipo_saneo' de la URL
      this.tipo_saneo_id = this.desencriptarConAESBase64URL(idEncriptado, 'ESTE ES JOEL');
      this.getDetalleTiposSaneo(this.tipo_saneo_id);
      // console.log(dato)

      // const idDesencriptado = this.desencriptar(idEncriptado); // Desencriptar el valor
      // console.log('ID desencriptado:', idDesencriptado);
      // Aquí puedes hacer lo que necesites con el ID desencriptado
    });

    this.getTiposSaneos();
  }

  constructor(){
    // this.dataSource.data = TREE_DATA;

    this.dataSource.data =
    [
      {
        name: 'Fruit',
        children: [
          {
            name: 'Apple'
          },
          {
            name: 'Banana'
          },
          {
            name: 'Fruit loops'
          }
        ],
      },
      {
        name: 'Vegetables',
        children: [
          {
            name: 'Green',
            children: [{name: 'Broccoli'}, {name: 'Brussels sprouts'}],
          },
          {
            name: 'Orange',
            children: [{name: 'Pumpkins'}, {name: 'Carrots'}],
          },
        ],
      },
    ];

  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  desencriptarConAESBase64URL(textoEnBase64URL:string, clave:string) {
    const textoEncriptado     = textoEnBase64URL.replace(/-/g, '+').replace(/_/g, '/');
    const bytesDesencriptados = CryptoJS.AES.decrypt(textoEncriptado, clave);
    const textoDesencriptado  = bytesDesencriptados.toString(CryptoJS.enc.Utf8);
    return textoDesencriptado;
  }

  openTipoSaneoDialog(){
    const dialogRef = this.dialog.open( NewDetalleTipoSaneoComponent, {
      width: '405px',
      data: {
        tipo_saneo   : this.tipo_saneo,
        tipo_saneo_id: this.tipo_saneo_id,
      },
      // data: {name: this.name, animal: this.animal},
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      if(result == 1){
        this.openSnackBar('USUARIO REGISTADO CON EXITO','Exitosa');
        this.getDetalleTiposSaneo(this.tipo_saneo_id);
      }else if(result == 2){
        this.openSnackBar('SE PRODUCO UN ERROR','Error');
      }
    });
  }

  edit(id:string, nombre:string, descripcion:string){

  }

  getDetalleTiposSaneo(id:any){
    this.tipoSaneoService.getDetalleTiposSaneo(id).subscribe({
      next: (datos:any) => {

        this.procesarDetalleTiposSaneosResponse(datos)

        console.log(datos)

        const da = datos.map((item:any) => {
          return {
            name    : item.nombre,
            // children:[{name: 'Apple'},{name: 'Banana'},{name: 'Fruit loops'}]
            children: item.tipoDetalleTipoSaneo.map((datos:any) => {
              return {name:datos.nombre}
            })

          }
        })

      //   const da = datos.map((item: any) => {
      //     // Verificar si 'children' está definido y es un array
      //     // if (item.children && Array.isArray(item.children)) {
      //     if (item.children) {
      //         // Mapear los elementos de 'children' de acuerdo a los datos específicos de 'item'
      //         const children = item.children.map((childItem: any) => {
      //             return { name: childItem.nombre };
      //         });

      //         // Retornar el objeto con 'name' de 'item' y los 'children' generados dinámicamente
      //         return {
      //             name: item.nombre,
      //             children: children
      //         };
      //     } else {
      //         // Si 'children' no está definido o no es un array, retornar un objeto con 'name' de 'item'
      //         return {
      //             name: item.nombre,
      //             children: [] // o null, dependiendo de tus necesidades
      //         };
      //     }
      // });

        console.log(da)

        this.dataSource.data = da

      },
      error: (error:any) => {

      }
    })
  }

  procesarDetalleTiposSaneosResponse(resp:any){
    const dataTiposSaneo: DetalleTipoSaneoElement[] = [];
    let listadoTipoSaneos = resp
    listadoTipoSaneos.forEach((element:DetalleTipoSaneoElement) => {
      dataTiposSaneo.push(element)
    })
    this.dataSourceDetalleTipoSaneo = new MatTableDataSource<DetalleTipoSaneoElement>(dataTiposSaneo)

  }

  openSnackBar(message:string, action:string): MatSnackBarRef<SimpleSnackBar>{
    return this.snackBar.open(message, action,{
      duration:2000
    });
  }

  getTiposSaneos(){
    // Llama al servicio para obtener los tipos de saneos
    this.tipoSaneoService.getTiposSaneos().subscribe(
      (resul:any) => {
        // Asigna los resultados a la propiedad this.tipo_saneo
        this.tipo_saneo = resul;
      },
      error => {
        // Maneja cualquier error que pueda ocurrir durante la suscripción
        console.error('Error al obtener tipos de saneos:', error);
      }
    );
  }

  redirigir(id:any){
    const idEncriptado                 = this.encriptarConAESBase64URL(this.tipo_saneo_id, 'ESTE ES JOEL');   // Encriptar el ID
    const idEncriptadoDetalleDocumento = this.encriptarConAESBase64URL(id, 'ESTE ES JOEL');  // Encriptar el ID
    this.router.navigate(['/tipo_saneo/', idEncriptado, idEncriptadoDetalleDocumento]);
  }

  encriptarConAESBase64URL(id:string, clave:string) {
    const textoAEncriptar = id.toString();
    const textoEncriptado = CryptoJS.AES.encrypt(textoAEncriptar, clave).toString();
    const textoEnBase64URL = this.base64URL(textoEncriptado);
    return textoEnBase64URL;
  }

  base64URL(cadena:string) {
    return cadena.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
  }


}

export interface DetalleTipoSaneoElement{
  id                : number;
  nombre            : string;
  detalle_tipo_saneo: any;
}




/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Fruit',
    children: [{name: 'Apple'}, {name: 'Banana'}, {name: 'Fruit loops'}],
  },
  {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [{name: 'Broccoli'}, {name: 'Brussels sprouts'}],
      },
      {
        name: 'Orange',
        children: [{name: 'Pumpkins'}, {name: 'Carrots'}],
      },
    ],
  },
];

interface FoodNode {
  name: string;
  children?: FoodNode[];
}

