import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from './login.service';
import { inject } from '@angular/core';

export const loginGuard: CanActivateFn = (route, state) => {

  const authService: LoginService = inject(LoginService);
  const router: Router            = inject(Router);

  if(authService.isAuthenticated()){
    if(authService.isTokenExpirado()){
      authService.logout();
      router.navigate(['login']);
      return false;
    }
    return true;
  }
  router.navigate(['login']);
  return false;
};


