import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('agrinexus_access_token') : null;

  let requestToForward = req;
  if (token && !req.headers.has('Authorization')) {
    requestToForward = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
  }

  return next(requestToForward).pipe(
    catchError((error: HttpErrorResponse) => {
      // If unauthorized and not attempting login/register, clear session & redirect
      if (error.status === 401 && !req.url.includes('/auth/login') && !req.url.includes('/auth/register')) {
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('agrinexus_access_token');
          localStorage.removeItem('agrinexus_user_profile');
        }
        router.navigate(['/auth/login'], { queryParams: { sessionExpired: 'true' } });
      }
      return throwError(() => error);
    })
  );
};
