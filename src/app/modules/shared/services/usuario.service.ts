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
  private menuNavData: any[] = []; // Inicialmente vacío
  private rol_asignado:string = '';

  constructor(private http:HttpClient) { }

  private agregarAuthorizationHeader(){
    let token = this.loginService.token;

    if(token != null && token != '')
      return this.httpHeaders.append('Authorization','Bearer ' + token)

    return this.httpHeaders;
  }

  // ******************** GET ********************
  // ESTO OPTIENE LOS USUARIO
  getUsuarios(){
    return this.http.get(`${this.base_url}/usuarios/listado`, {headers: this.agregarAuthorizationHeader()});
  }

  getRolesUser(user_id:any){
    return this.http.get(`${this.base_url}/usuarios/roles_user/${user_id}`, {headers: this.agregarAuthorizationHeader()});
  }

  findByIdUsuario(id:any){
    return this.http.get(`${this.base_url}/usuarios/${id}`, {headers: this.agregarAuthorizationHeader()});
  }

  // ******************** POST ********************
  // esto ira al register
  saveUsario(body:any){
    return this.http.post(`${this.base_host}/auth/register`, body);
  }

  getMenuRol(usuario:number,rol:number ){
    let datos = {
      "usuario" : usuario,
      "rol" : rol
    }
    return this.http.post(`${this.base_url}/usuarios/menu`, datos, {headers: this.agregarAuthorizationHeader()});
  }

  saveMenuUserById(datos:any){
    return this.http.post(`${this.base_url}/usuarios/saveMenuUserById`, datos, {headers: this.agregarAuthorizationHeader()});
  }


  // ******************** PUT ********************
  // ACTUALIZAR USUARIOS
  updateUsuer(body:any, id:any){
    return this.http.put(`${this.base_url}/usuarios`, body, {headers: this.agregarAuthorizationHeader()});
  }


  // PARA BUSCAR EN LA BASE DE DATOS DE COMUN
  getFuncionario(datos:any){
    return this.http.post(`${this.base_url}/comun/datos`, datos, {headers: this.agregarAuthorizationHeader()});
  }



  // *********************************  GETTER AND SETTRS *********************************

  setMenuNavData(data: any[]) {
    this.menuNavData = data;
  }

  getMenuNavData(): any[] {
    return this.menuNavData;
  }

  setRolAsigando(rol:string) {
    this.rol_asignado = rol;
  }

  getRolAsigando(): string {
    return this.rol_asignado;
  }

}
