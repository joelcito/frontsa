import { Injectable, inject } from '@angular/core';
import { LoginService } from '../../../login/login.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {

  private loginService = inject(LoginService);
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

  findByIdsolicitud(id:any){
    return this.http.get(`${this.base_url}/solicitud/${id}`, {headers: this.agregarAuthorizationHeader()});
  }

  getSolicitud(body:any){
    // return this.http.get(`${this.base_url}/solicitud/listado`, {headers: this.agregarAuthorizationHeader()});
    return this.http.post(`${this.base_url}/solicitud/listado`, body, {headers: this.agregarAuthorizationHeader()});
  }

  tramitesSolicitudesByIdSolicitud(id:any){
    return this.http.get(`${this.base_url}/solicitud/tramitesSolicitudesByIdSolicitud/${id}`, {headers: this.agregarAuthorizationHeader()});
  }

  verificaSiTieneTramatiesEnviados(body:any){
    return this.http.post(`${this.base_url}/solicitud/verificaSiTieneTramatiesEnviados`, body, {headers: this.agregarAuthorizationHeader()});
  }

  saveSolicitudTemporal(body:any){
    return this.http.post(`${this.base_url}/solicitud/saveSolicitudTemporal`, body, {headers: this.agregarAuthorizationHeader()});
  }

  //***************** PARA LA TABLA DE TEMPORALES DE LA SOLICITUD *****************
  saveTemporalSolicitud(body:any){
    return this.http.post(`${this.base_url}/solicitud/saveTemporalSolicitud`, body, {headers: this.agregarAuthorizationHeader()});
  }

  getTemporalesByIdSolicitud(id:any){
    return this.http.get(`${this.base_url}/solicitud/getTemporalesByIdSolicitud/${id}`, {headers: this.agregarAuthorizationHeader()});
  }

  eliminacionLogicaTemporalSolicitudDeseleccion(body:any){
    return this.http.post(`${this.base_url}/solicitud/eliminacionLogicaTemporalSolicitudDeseleccion`, body, {headers: this.agregarAuthorizationHeader()});
  }



  // ********************* SAVE SOLICICTUD *********************
  saveSolicitudCambioBandeja(body:any){
    return this.http.post(`${this.base_url}/solicitud/`, body, {headers: this.agregarAuthorizationHeader()});
  }

  saveSolicitudDesbloqueoDirectiva0082019(body:any){
    return this.http.post(`${this.base_url}/solicitud/saveSolicitudDesbloqueoDirectiva0082019`, body, {headers: this.agregarAuthorizationHeader()});
  }

  saveCorreccionesCIE(body:any){
    return this.http.post(`${this.base_url}/solicitud/saveCorreccionesCIE`, body, {headers: this.agregarAuthorizationHeader()});
  }

  // ********************* SANEAMIENTO EXTRANJERIA *********************
  sanearDirectiva0082019(body:any){
    return this.http.post(`${this.base_url}/solicitud/sanearDirectiva0082019`, body, {headers: this.agregarAuthorizationHeader()});
  }

  saneoCambioBandeja(body:any){
    return this.http.post(`${this.base_url}/solicitud/saneoCambioBandeja`, body, {headers: this.agregarAuthorizationHeader()});
  }

}
