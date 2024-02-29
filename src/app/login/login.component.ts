import { Component, OnInit, inject } from '@angular/core';
import { LoginService } from './login.service';
import { Router } from '@angular/router';

import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  constructor(
    private router: Router,
    private _snackBar: MatSnackBar
    ) {
    // Constructor del componente
  }

  ngOnInit(): void {

    if(this.loginService.isAuthenticated())
      this.router.navigate(['/home']);
    else
      this.router.navigate(['/login']);

  }

  private loginService = inject(LoginService);

  formData = {
    username: 'jjjoelcito123@gmail.com',
    password: '123456789'
  };

  onSubmit() {

    this.loginService.login(this.formData).pipe(
      tap((ressul: any) => { // Aquí se está utilizando `any` temporalmente

        this.loginService.guardarUsuarioLogeuado(ressul.user)
        this.loginService.guardarUsuario(ressul.token);
        this.loginService.guardartoken(ressul.token);

        // Redireccionar al dashboard (aquí podrías usar el Router de Angular)
        this.router.navigate(['/home']); // Reemplaza '/dashboard' con tu ruta real
      }),
      catchError((error: any) => {
        // Manejar el error aquí
        console.error('Error al iniciar sesión: haber qui', error);

        if (error.status === 401) {
          // Mostrar mensaje de credenciales incorrectas al usuario
        }

        if (error.status === 502) {
          // Mostrar mensaje de credenciales incorrectas al usuario
          console.log('Error al iniciar sesión en 502')
        }

        // Propagar el error para que otros observables puedan manejarlo si es necesario
        return throwError(error);
      })
    ).subscribe(
      () => {}, // Manejo de respuesta exitosa
      (error: any) => {
        // Manejo de errores generales
        console.error('Error al iniciar sesión:', error);
        this.openSnackBar('Error en las credenciales', 'Cerrar');
      }
    );

    // Puedes llamar a servicios, enviar datos al backend, etc.
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4000, // Duración en milisegundos
    });
  }


}
