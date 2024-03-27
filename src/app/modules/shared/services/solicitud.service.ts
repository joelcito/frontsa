import { Injectable, inject } from '@angular/core';
import { LoginService } from '../../../login/login.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environment/environment';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {

  private loginService = inject(LoginService);
  private router       = inject(Router);

  private httpHeaders  = new HttpHeaders({'Content-Type': 'application/json'});
  private http         = inject(HttpClient);
  private base_url     = environment.base_url;

  constructor() { }

  private agregarAuthorizationHeader(){
    let token = this.loginService.token;

    if(token != null && token != '')
      return this.httpHeaders.append('Authorization','Bearer ' + token)

    return this.httpHeaders;
  }

  private manejarError(error: HttpErrorResponse) {
    if (error.status === 403) {
      // Forbidden: redirigir al usuario al componente de inicio de sesión
      this.router.navigate(['/login']);
    }
    return throwError(error);
  }

  findByIdsolicitud(id:any){
    return this.http.get(`${this.base_url}/solicitud/${id}`, {headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(error => this.manejarError(error))
    );
  }

  getSolicitud(body:any){
    // return this.http.get(`${this.base_url}/solicitud/listado`, {headers: this.agregarAuthorizationHeader()});
    return this.http.post(`${this.base_url}/solicitud/listado`, body, {headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(error => this.manejarError(error))
    );
  }

  listadoCasos(body:any){
    // return this.http.get(`${this.base_url}/solicitud/listado`, {headers: this.agregarAuthorizationHeader()});
    return this.http.post(`${this.base_url}/solicitud/listadoCasos`, body, {headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(error => this.manejarError(error))
    );
  }

  tramitesSolicitudesByIdSolicitud(id:any){
    return this.http.get(`${this.base_url}/solicitud/tramitesSolicitudesByIdSolicitud/${id}`, {headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(error => this.manejarError(error))
    );
  }

  verificaSiTieneTramatiesEnviados(body:any){
    return this.http.post(`${this.base_url}/solicitud/verificaSiTieneTramatiesEnviados`, body, {headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(error => this.manejarError(error))
    );
  }

  saveSolicitudTemporal(body:any){
    return this.http.post(`${this.base_url}/solicitud/saveSolicitudTemporal`, body, {headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(error => this.manejarError(error))
    );
  }

  //***************** PARA LA TABLA DE TEMPORALES DE LA SOLICITUD *****************
  saveTemporalSolicitud(body:any){
    return this.http.post(`${this.base_url}/solicitud/saveTemporalSolicitud`, body, {headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(error => this.manejarError(error))
    );
  }

  getTemporalesByIdSolicitud(id:any){
    return this.http.get(`${this.base_url}/solicitud/getTemporalesByIdSolicitud/${id}`, {headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(error => this.manejarError(error))
    );
  }

  eliminacionLogicaTemporalSolicitudDeseleccion(body:any){
    return this.http.post(`${this.base_url}/solicitud/eliminacionLogicaTemporalSolicitudDeseleccion`, body, {headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(error => this.manejarError(error))
    );
  }



  // ********************* SAVE SOLICICTUD *********************
  saveSolicitudCambioBandeja(body:any){
    return this.http.post(`${this.base_url}/solicitud/`, body, {headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(error => this.manejarError(error))
    );
  }

  saveSolicitudDesbloqueoDirectiva0082019(body:any){
    return this.http.post(`${this.base_url}/solicitud/saveSolicitudDesbloqueoDirectiva0082019`, body, {headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(error => this.manejarError(error))
    );
  }

  saveCorreccionesCIE(body:any){
    return this.http.post(`${this.base_url}/solicitud/saveCorreccionesCIE`, body, {headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(error => this.manejarError(error))
    );
  }

  saveSolicitudBajaOrpeNaturalizacion(body:any){
    return this.http.post(`${this.base_url}/solicitud/saveSolicitudBajaOrpeNaturalizacion`, body, {headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(error => this.manejarError(error))
    );
  }

  saveSolicitudConvenio(body:any){
    return this.http.post(`${this.base_url}/solicitud/saveSolicitudConvenio`, body, {headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(error => this.manejarError(error))
    );
  }

  // ********************* SANEAMIENTO EXTRANJERIA *********************
  sanearDirectiva0082019(body:any){
    return this.http.post(`${this.base_url}/solicitud/sanearDirectiva0082019`, body, {headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(error => this.manejarError(error))
    );
  }

  saneoCambioBandeja(body:any){
    return this.http.post(`${this.base_url}/solicitud/saneoCambioBandeja`, body, {headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(error => this.manejarError(error))
    );
  }

  sanearBajaOrpeNaturalizado(body:any){
    return this.http.post(`${this.base_url}/solicitud/sanearBajaOrpeNaturalizado`, body, {headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(error => this.manejarError(error))
    );
  }

  // ***************** SOLICITUD ARCHIVOS *****************
  saveSolicitudArchivo(body:any){
    return this.http.post(`${this.base_url}/solicitud/saveSolicitudArchivo`, body, {headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(error => this.manejarError(error))
    );
  }

  getSolicitudArchivosById(id:any, conversacion_id:any){
    return this.http.get(`${this.base_url}/solicitud/getSolicitudArchivosById/${id}/${conversacion_id}`, {headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(error => this.manejarError(error))
    );
  }

  //***************** SOLICITUD CONVERSACION *****************
  getSolicitudConversacionById(id:any){
    return this.http.get(`${this.base_url}/solicitud/getSolicitudConversacionById/${id}`, {headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(error => this.manejarError(error))
    );
  }

  saveSolicitudConversacionRespuesta(body:any){
    return this.http.post(`${this.base_url}/solicitud/saveSolicitudConversacionRespuesta`, body, {headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(error => this.manejarError(error))
    );
  }

}
