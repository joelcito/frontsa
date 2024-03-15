import { Injectable } from '@angular/core';
declare const AWS: any;
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class MinioService {

  private s3: any;

  constructor() {

    this.loadAWS().then(() => {
      this.initS3();
    });

  }

  private loadAWS(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const script      = document.createElement('script');
            script.type = 'text/javascript';
            script.src  = 'https://sdk.amazonaws.com/js/aws-sdk-2.1033.0.min.js';  // URL del SDK de AWS
      script.onload = () => {
        resolve();
      };
      script.onerror = (error) => {
        reject(error);
      };
      document.head.appendChild(script);
    });
  }

  private initS3() {
    // Configurar tu instancia de S3
    this.s3 = new AWS.S3({
      // endpoint: 'http://localhost:9000', // URL de tu servidor Minio
      // accessKeyId: 'minioadmin', // Tus credenciales de Minio
      // secretAccessKey: 'minioadmin', // Tus credenciales de Minio

      endpoint       : environment.url_minio,             // URL de tu servidor Minio
      accessKeyId    : environment.user_minio,            // Tus credenciales de Minio
      secretAccessKey: environment.pass_minio,            // Tus credenciales de Minio

      s3ForcePathStyle: true,   // Necesario para Minio
      signatureVersion: 'v4'    // Necesario para Minio
    });
  }

  uploadFile(file: File, bucketName: string, objectKey: string): Promise<any> {
    const params = {
      Bucket: bucketName,
      Key: objectKey,
      Body: file
    };

    return new Promise((resolve, reject) => {
      this.s3.upload(params, (err:any, data:any) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

}
