import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRoles = route.data?.['roles'] as Array<string> | undefined;
  const userRole = authService.userRole();

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/auth/login'], { queryParams: { returnUrl: state.url } });
  }

  if (expectedRoles && expectedRoles.length > 0) {
    if (userRole === 'ADMIN' || (userRole && expectedRoles.includes(userRole))) {
      return true;
    }
    // Unauthorized role
    return router.createUrlTree(['/dashboard']);
  }

  return true;
};
