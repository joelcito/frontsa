import { Injectable, inject } from '@angular/core';
import { LoginService } from '../../../login/login.service';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from '../../../../environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExtranjeriaService {

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

  getExtranjeros(){
    return this.http.get(`${this.base_url}/extranjeria/datos`, {headers: this.agregarAuthorizationHeader()});
  }

  buscarExtranjero(body:any){
    return this.http.post(`${this.base_url}/extranjeria/buscaExtranjero`, body, {headers: this.agregarAuthorizationHeader()});
  }

  buscaExtranjeroPorSerial(body:any){
    return this.http.post(`${this.base_url}/extranjeria/buscaExtranjeroPorSerial`, body, {headers: this.agregarAuthorizationHeader()});
  }

  saneoCambioBandejaSqlServer(body:any){
    return this.http.post(`${this.base_url}/extranjeria/saneoCambioBandeja`, body, {headers: this.agregarAuthorizationHeader()});
  }

  getDatosParametricas(body:any){
    return this.http.post(`${this.base_url}/extranjeria/getDatosParametricas`, body, {headers: this.agregarAuthorizationHeader()});
  }

  /*
  getImagenExtranjero(body:any):Observable<HttpResponse<ArrayBuffer>>{
    return this.http.post(`${this.base_url}/extranjeria/getImagenExtranjero`, body, {headers: this.agregarAuthorizationHeader(), observe: 'response', responseType: 'arraybuffer' });
  }
  */

}
