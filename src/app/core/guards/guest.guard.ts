import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const guestGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.getToken() && !authService.isTokenExpired()) {
    router.navigate(['/courses']);
    return false;
  }

  return true;
};
