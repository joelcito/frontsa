import { Component, Input, OnChanges, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { publishFacade } from '@angular/compiler';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
// import { NewDocumentoComponent } from './new-documento/new-documento.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { SolicitudService } from '../../../../shared/services/solicitud.service';
import { DocumentacionComponent } from './documentacion/documentacion.component';
import { TipoSaneoService } from '../../../../shared/services/tipo-saneo.service';
import { environment } from '../../../../../../environment/environment';
import { DatePipe } from '@angular/common';
import { MinioService } from '../../../../shared/services/minio.service';


@Component({
  selector: 'app-comentario',
  templateUrl: './comentario.component.html',
  styleUrl: './comentario.component.css'
})
export class ComentarioComponent implements OnChanges  {

  private fb               = inject(FormBuilder);
  private solicitudService = inject(SolicitudService);
  private routerLink       = inject(Router);
  public  dialog           = inject(MatDialog);
  private snackBar         = inject(MatSnackBar);
  private tipoSaneoService = inject(TipoSaneoService);
  private datePipe         = inject(DatePipe);
  private minioService     = inject(MinioService);


  @Input() solicitud_id         : any;
  @Input() usuario              : any;
  @Input() solicitud            : any;
  @Input() estadosRespuestas    : any;
  @Input() mostrarBoton         : any;
  @Input() detalle_tipo_saneo_id: any;

  public  bucketName           : any;

  public formularioRespuesta !: FormGroup

  public solicitudConversacion:any[]    = [];
  public listaDocumentosSolicitud:any[] = [];

  ngOnChanges() {
    console.log(this.solicitud_id, this.usuario, this.solicitud, this.estadosRespuestas, this.detalle_tipo_saneo_id);
  }

  ngOnInit(): void {

    this.bucketName            = environment.bucketName

    // ******************** SOLICITUD CONVERSACION ********************
    this.solicitudService.getSolicitudConversacionById(this.solicitud_id).subscribe((result:any) => {
      // console.log(result)
      this.solicitudConversacion = result
    })

    this.solicitudService.findByIdsolicitud(this.solicitud_id).subscribe((result:any) =>{
      this.solicitud = result
    })

    this.formularioRespuesta = this.fb.group({
      mensaje_adicion : ['', Validators.required],
      tipo_observacion: ['', Validators.required],
      archivos_subir  : [''],
    });

    // PARA LOS DOCUMENTOS
    this.tipoSaneoService.getDocumentoDetalleTipoSaneo(this.detalle_tipo_saneo_id).subscribe((resuly :any) => {
      this.listaDocumentosSolicitud = resuly
    })

    // console.log(this.solicitud_id, this.usuario, this.solicitud, this.estadosRespuestas)
  }


  enviarRespesta(){

    let datos = {
      solicitud_id: this.solicitud_id,
      usuario_id  : this.usuario.id,
      mensaje     : this.formularioRespuesta.value.mensaje_adicion,
      estado      : this.formularioRespuesta.value.tipo_observacion,
      tipo        : "RESPUESTA",
    }

    this.solicitudService.saveSolicitudConversacionRespuesta(datos).subscribe((result:any) => {
      const fechaActual  = new Date();
      const anioActual   = fechaActual.getFullYear();
      const mesEnLiteral = fechaActual.toLocaleDateString('es-ES', { month: 'long' });
      const fechaFormato = this.datePipe.transform(fechaActual, 'yyyy-MM-dd');
      let   ruta         = anioActual+"-EXT/"+mesEnLiteral+"/"+fechaFormato+"/solicitud_"+this.solicitud_id+"_respuesta";
      let   numBucles    = 0;

      for (const doc of this.listaDocumentosSolicitud) {
        const fileInput = document.getElementById(`document_${doc.id}`) as HTMLInputElement;
        if(fileInput.files){
          if(fileInput.files.length > 0){
            const file       = fileInput.files[0]
            const bucketName = this.bucketName;
            const nameFile   = file.name.replaceAll(" ", "_" )
            const objectKey  = ruta+"/"+nameFile;

            this.minioService.uploadFile(file, bucketName, objectKey)
              .then(data => {
                // console.log("**************************************")
                // console.log(data)
                // console.log("**************************************")
                if(data !== null){
                  let datos = {
                    solicitud      : this.solicitud_id,
                    usuario_creador: this.usuario.id,
                    gestion        : anioActual,
                    sistema        : "EXT",
                    mes            : mesEnLiteral,
                    fecha          : fechaFormato,
                    nombre_archivo : nameFile,
                    ETag           : data.ETag,
                    Location       : data.Location,
                    key            : data.Key,
                    Bucket         : data.Bucket,
                    tipo_archivo   : "RESPUESTA"
                  }

                  this.solicitudService.saveSolicitudArchivo(datos).subscribe((resultado:any) =>{
                    // console.log(resultado)
                  })
                  // numBucles++;
                  // console.log("far => "+numBucles)
                  // if(numBucles == this.listaDocumentosSolicitud.length){
                  //   Swal.fire({
                  //     position: "top-end",
                  //     icon: "success",
                  //     title: "Se registro con exito",
                  //     text: "El Caso se le asigno a "+result.usuarioAsignado.nombres+" "+result.usuarioAsignado.primer_apellido+" "+result.usuarioAsignado.segundo_apellido,
                  //     showConfirmButton: false,
                  //     timer: 4000,
                  //     allowOutsideClick: false
                  //   });
                  //   setTimeout(() => {
                  //     this.routerLink.navigate(['/solicitud']);
                  //   }, 4000);
                  // }
                }
              })
              .catch(err => {
                console.error('Error al subir el archivo:', err);
              });

              numBucles++;

          }else{
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "¡EXITO!",
              text: "SE REGISTRO EL COMENTARIO",
              showConfirmButton: false,
              timer: 5000,
              allowOutsideClick: false
            });

            let fa = (this.mostrarBoton)? ['/asignacion']:['/solicitud']
            setTimeout(() => {
              this.routerLink.navigate(fa);
            }, 5000);

          }
        }else{
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "¡EXITO!",
            text: "SE REGISTRO EL COMENTARIO",
            showConfirmButton: false,
            timer: 5000,
            allowOutsideClick: false
          });
        }
      }

      if(this.listaDocumentosSolicitud.length == 0){
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "¡EXITO!",
          text: "SE REGISTRO EL COMENTARIO",
          showConfirmButton: false,
          timer: 5000,
          allowOutsideClick: false
        });

        let fa = (this.mostrarBoton)? ['/asignacion'] : ['/solicitud']
        setTimeout(() => {
          this.routerLink.navigate(fa);
        }, 5000);

      }else if(numBucles === 1){

        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "¡EXITO!",
          text: "SE REGISTRO EL COMENTARIO",
          showConfirmButton: false,
          timer: 5000,
          allowOutsideClick: false
        });

        let fa = (this.mostrarBoton)? ['/asignacion'] : ['/solicitud']
        setTimeout(() => {
          this.routerLink.navigate(fa);
        }, 5000);

      }

      // if(result == 1){
      //   Swal.fire({
      //     position: "top-end",
      //     icon: "success",
      //     title: "¡EXITO!",
      //     text: "SE REGISTRO EL COMENTARIO",
      //     showConfirmButton: false,
      //     timer: 5000,
      //     allowOutsideClick: false
      //   });
      //   setTimeout(() => {
      //     this.routerLink.navigate(['/asignacion']);
      //   }, 5000);
      // }else{

      // }
    })

  }

  abreModalArchivos(datos:any){
      const dialogRef = this.dialog.open( DocumentacionComponent, {
        width: '405px',
        data: {
          solicitud_id   : this.solicitud_id,
          conversacion_id: datos.id
        },
      });

      dialogRef.afterClosed().subscribe((result:any) => {
        if(result == 1){
          this.openSnackBar('ROL REGISTADO CON EXITO','Exitosa');
          // this.getRol();
        }else if(result == 2){
          this.openSnackBar('SE PRODUCO UN ERROR','Error');
        }
      });

  }

  verArchivos(datos:any){
    console.log(datos)
  }

  openSnackBar(message:string, action:string): MatSnackBarRef<SimpleSnackBar>{
    return this.snackBar.open(message, action,{
      duration:2000
    });
  }

  onFileSelected(event: any, tamanio: string, id:number){

  }

}
