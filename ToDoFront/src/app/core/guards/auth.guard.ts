import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { inject } from '@angular/core';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
