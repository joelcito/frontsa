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

  private _datosEnviados:any;

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

  getFormulariosByIdTipoSaneo(id:any){
    return this.http.get(`${this.base_url}/formulario/listadoFormulariosByIdTipoSaneo/${id}`, {headers: this.agregarAuthorizationHeader()});
  }

  getFormulariofindById(id:any){
    return this.http.get(`${this.base_url}/formulario/getFormulariofindById/${id}`, {headers: this.agregarAuthorizationHeader()});
  }



  // ********************** PREGUNTAS FORMULAIO **********************
  getFormularioPregunta(id:any){
    return this.http.get(`${this.base_url}/formulario/formulario_pregunta/${id}`, {headers: this.agregarAuthorizationHeader()});
  }

  getFormularioPreguntaByTipoSaneoByTipoDato(formulario_id:any, order_data:any){
    return this.http.get(`${this.base_url}/formulario/formulario_pregunta/${formulario_id}/${order_data}`, {headers: this.agregarAuthorizationHeader()});
  }

  saveFormularioPregunta(body:any){
    return this.http.post(`${this.base_url}/formulario/formulario_pregunta/`, body, {headers: this.agregarAuthorizationHeader()});
  }


  // **************** GETTER SETTER ****************
  // Getter para datosEnviados
  get datosEnviados(): any {
    return this._datosEnviados;
  }

  // Setter para datosEnviados
  set datosEnviados(value: any) {
    this._datosEnviados = value;
  }
}
