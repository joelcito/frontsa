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

  getSolicitud(){
    return this.http.get(`${this.base_url}/solicitud/listado`, {headers: this.agregarAuthorizationHeader()});
  }
}
