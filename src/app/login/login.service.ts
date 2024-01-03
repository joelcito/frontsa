import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const base_url = environment.host

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private _usuario: any;
  private _token: string = '';

  constructor(private http:HttpClient){}

  public get usuario():any{
    if(this._usuario != null){
      return this._usuario;
    }else if(this._usuario == null && sessionStorage.getItem('usuario') != null){
      const datos = sessionStorage.getItem('usuario')
      this._usuario = datos? JSON.parse(datos) : null;
      return this._usuario
    }
    return this._usuario;
  }

  public get token():string{
    // if(this._token != null){
    //   return this._token;
    // }else if(this._token == null && sessionStorage.getItem('token') != null){
    //   this._token = sessionStorage.getItem('token') || ''
    //   return this._token
    // }
    // return '';

    if(this._token != ''){
      return this._token;
    }else if(this._token == '' && sessionStorage.getItem('token') != null){
      this._token = sessionStorage.getItem('token') || ''
      return this._token
    }
    return '';
  }

  login(datos:any):Observable<any>{
    const endpoint = `${base_url}/auth/login`;

    const httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

    return this.http.post(endpoint, datos, {headers:httpHeaders});
  }

  guardarUsuario(accessToken:string):void{
    let datos = this.obtenerDatosToken(accessToken);
    this._usuario = datos
    sessionStorage.setItem('usuario', JSON.stringify(datos));
  }

  guardartoken(accessToken:string):void{
    this._token = accessToken
    sessionStorage.setItem('token', accessToken);
  }

  guardarUsuarioLogeuado(usuario:any){
    let datos = {
      "username": usuario.username,
      "roles"   : usuario.roles,
      "id"      : usuario.id,
    }
    sessionStorage.setItem('datos', JSON.stringify(datos))
  }

  obtenerDatosToken(token:string):any{
    if(token != null && token != '')
      return JSON.parse(atob(token.split(".")[1]));

    return null;
  }

  isAuthenticated():boolean{
    let payload = this.obtenerDatosToken(this.token)

    // if(payload != null && payload.bad && payload.bad.length > 0 && payload != ''){
    //   return true
    // }
    // return false
    return (payload != null && payload.sub && payload.sub.length > 0 && payload != '')? true : false
  }

  isTokenExpirado(){
    let token = this.token;
    let payload = this.obtenerDatosToken(token);
    let now = new Date().getTime() / 1000;

    if(payload.exp < now)
      return true

    return false
  }

  logout(): void{
    this._token = '';
    this._usuario = null
    sessionStorage.clear();
  }

}
