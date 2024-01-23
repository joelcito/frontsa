import { Injectable, inject } from '@angular/core';
import { LoginService } from '../../../login/login.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class FormularioService {

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

  getFormulario(){
    return this.http.get(`${this.base_url}/formulario/listado`, {headers: this.agregarAuthorizationHeader()});
  }

  saveFormulario(body:any){
    return this.http.post(`${this.base_url}/formulario/`, body, {headers: this.agregarAuthorizationHeader()});
  }



  // ********************** PREGUNTAS FORMULAIO **********************
  getFormularioPregunta(id:any){
    return this.http.get(`${this.base_url}/formulario/formulario_pregunta/${id}`, {headers: this.agregarAuthorizationHeader()});
  }

  saveFormularioPregunta(body:any){
    return this.http.post(`${this.base_url}/formulario/formulario_pregunta/`, body, {headers: this.agregarAuthorizationHeader()});
  }
}
