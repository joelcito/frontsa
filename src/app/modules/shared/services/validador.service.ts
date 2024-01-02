import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginService } from '../../../login/login.service';


@Injectable({
  providedIn: 'root'
})
export class ValidadorService {

  private http:HttpClient = inject(HttpClient);
  private loginService    = inject(LoginService);
  private httpHeaders     = new HttpHeaders({'Content-Type': 'application/json'});
  private base_url        = environment.base_url

  constructor() { }

  private agregarAuthorizationHeader(){
    let token = this.loginService.token;

    if(token != null && token != '')
      return this.httpHeaders.append('Authorization','Bearer ' + token)

    return this.httpHeaders;
  }

  getValidadores(){
    return this.http.get(`${this.base_url}/validador`, {headers: this.agregarAuthorizationHeader()});
  }

  getValidadorFindByCampoByFormulario( data:any ):any {
    return this.http.post(`${this.base_url}/validador/formulario`,data, {headers: this.agregarAuthorizationHeader()});
  }

}
