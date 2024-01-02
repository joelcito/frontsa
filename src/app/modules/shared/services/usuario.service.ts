import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable ,inject} from '@angular/core';
import { environment } from '../../../../environment/environment';
import { LoginService } from '../../../login/login.service';



@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private loginService = inject(LoginService);
  private httpHeaders  = new HttpHeaders({'Content-Type': 'application/json'});
  private base_url     = environment.base_url
  private base_host     = environment.host

  constructor(private http:HttpClient) { }

  private agregarAuthorizationHeader(){
    let token = this.loginService.token;

    if(token != null && token != '')
      return this.httpHeaders.append('Authorization','Bearer ' + token)

    return this.httpHeaders;
  }

  // ESTO OPTIENE LOS USUARIO
  getUsuarios(){
    return this.http.get(`${this.base_url}/usuarios`, {headers: this.agregarAuthorizationHeader()});
  }

  // esto ira al register
  saveUsario(body:any){
    return this.http.post(`${this.base_host}/auth/register`, body);
  }

}
