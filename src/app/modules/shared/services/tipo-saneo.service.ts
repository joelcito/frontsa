import { Injectable, inject } from '@angular/core';
import { LoginService } from '../../../login/login.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class TipoSaneoService {

  private loginService = inject(LoginService);
  private httpHeaders  = new HttpHeaders({'Content-Type': 'application/json'});
  private http         = inject(HttpClient);
  private base_url     = environment.base_url;
  private base_host    = environment.host

  constructor() { }

  private agregarAuthorizationHeader(){
    let token = this.loginService.token;

    if(token != null && token != '')
      return this.httpHeaders.append('Authorization','Bearer ' + token)

    return this.httpHeaders;
  }

  getTiposSaneos(){
    return this.http.get(`${this.base_url}/tipoSaneos/listado`, {headers: this.agregarAuthorizationHeader()});
  }

  saveTipoSaneo(body:any){
    return this.http.post(`${this.base_url}/tipoSaneos/`, body , {headers: this.agregarAuthorizationHeader()});
  }

  updateTipoSaneo(body:any, id:any){
    return this.http.put(`${this.base_url}/tipoSaneos/${id}`, body , {headers: this.agregarAuthorizationHeader()});
  }

  // ******************************** DETALLE TIPO SANEO ********************************
  getDetalleTiposSaneo(id:any){
    return this.http.get(`${this.base_url}/tipoSaneos/detalle_tipo_saneo/${id}`, {headers: this.agregarAuthorizationHeader()});
  }

  saveDetalleTipoSaneo(body:any){
    return this.http.post(`${this.base_url}/tipoSaneos/detalle_tipo_saneo/`, body, {headers: this.agregarAuthorizationHeader()});
  }

  // ******************************** DOCUMENTO DETALLE TIPO SANEO ********************************
  getDocumentoDetalleTipoSaneo(id:any){
    return this.http.get(`${this.base_url}/tipoSaneos/documento_detalle_tipo_saneo/${id}`, {headers: this.agregarAuthorizationHeader()})
  }

  saveDocumentoDetalleTipoSaneo(body:any){
    return this.http.post(`${this.base_url}/tipoSaneos/documento_detalle_tipo_saneo/`, body, {headers: this.agregarAuthorizationHeader()});
  }

}
