import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const userInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  let token: string | null = null;
  if (localStorage.getItem('token') !== null)
    token = localStorage.getItem('token');

  // Check if token exists and add it as an Authorization header if so
  const modifiedReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

  // Log the request URL for debugging purposes
  console.log('Request intercepted:', req.url);

  // Continue with the modified request
  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.error('Unauthorized request - clearing headers and redirecting to login');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('wishList');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
