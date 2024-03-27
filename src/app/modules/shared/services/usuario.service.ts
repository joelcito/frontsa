import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable ,inject} from '@angular/core';
import { environment } from '../../../../environment/environment';
import { LoginService } from '../../../login/login.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private loginService = inject(LoginService);
  private router       = inject(Router);

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

  private manejarError(error: HttpErrorResponse) {
    if (error.status === 403) {
      // Forbidden: redirigir al usuario al componente de inicio de sesión
      this.router.navigate(['/login']);
    }
    return throwError(error);
  }

  // ******************** GET ********************
  // ESTO OPTIENE LOS USUARIO
  getUsuarios(){
    return this.http.get(`${this.base_url}/usuarios/listado`, {headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(error => this.manejarError(error))
    );
  }

  getRolesUser(user_id:any){
    return this.http.get(`${this.base_url}/usuarios/roles_user/${user_id}`, {headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(error => this.manejarError(error))
    );;
  }

  findByIdUsuario(id:any){
    return this.http.get(`${this.base_url}/usuarios/${id}`, {headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(error => this.manejarError(error))
    );;
  }

  // ******************** POST ********************
  // esto ira al register
  saveUsario(body:any){
    return this.http.post(`${this.base_host}/auth/register`, body).pipe(
      catchError(error => this.manejarError(error))
    );;
  }

  getMenuRol(usuario:number,rol:number ){
    let datos = {
      "usuario" : usuario,
      "rol" : rol
    }
    return this.http.post(`${this.base_url}/usuarios/menu`, datos, {headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(error => this.manejarError(error))
    );;
  }

  saveMenuUserById(datos:any){
    return this.http.post(`${this.base_url}/usuarios/saveMenuUserById`, datos, {headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(error => this.manejarError(error))
    );
  }

  deleteUsuer(id:any){
    return this.http.delete(`${this.base_url}/usuarios/deleteUsuer/${id}`, {headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(error => this.manejarError(error))
    );
  }

  upDateUsuario(id:any, body:any){
    return this.http.post(`${this.base_url}/usuarios/upDateUsuario/${id}`, body, {headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(error => this.manejarError(error))
    );
  }


  // ******************** PUT ********************
  // ACTUALIZAR USUARIOS
  updateUsuer(body:any, id:any){
    return this.http.put(`${this.base_url}/usuarios`, body, {headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(error => this.manejarError(error))
    );;
  }


  // ******************** PARA BUSCAR EN LA BASE DE DATOS DE COMUN ********************
  getFuncionario(datos:any){
    return this.http.post(`${this.base_url}/comun/datos`, datos, {headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(error => this.manejarError(error))
    );;
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
