import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const isExpired = authService.isTokenExpired();

  const token = localStorage.getItem('authToken');

  if (isExpired) {
    authService.logout();
    router.navigate(['/login']);
    return false;
  }

  return true;
};
