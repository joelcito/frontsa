import { Injectable, inject } from '@angular/core';
import { LoginService } from '../../../login/login.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class RolService {

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

  getRoles(){
    return this.http.get(`${this.base_url}/rol/listado`, {headers: this.agregarAuthorizationHeader()});
  }

  deleteRol(id:any){
    return this.http.delete(`${this.base_url}/rol/deleteRol/${id}`, {headers: this.agregarAuthorizationHeader()});
  }

  updateRolesUser(id:any, body:any){
    return this.http.post(`${this.base_url}/rol/user_rol/${id}`, body, {headers: this.agregarAuthorizationHeader()})
  }

  saveRol(body:any){
    return this.http.post(`${this.base_url}/rol/`, body, {headers: this.agregarAuthorizationHeader()});
  }

  updateRol(body:any, id:any){
    return this.http.put(`${this.base_url}/rol/${id}`, body , {headers: this.agregarAuthorizationHeader()});
  }
}
