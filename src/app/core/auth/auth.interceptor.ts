import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { API_URL } from '../api-url';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const isAuthEndpoint = req.url.startsWith(`${API_URL}/auth/`);
  let headers = req.headers;
  const accessToken = auth.getAccessToken();

  if (accessToken && !isAuthEndpoint) {
    headers = headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const csrfToken = auth.getCsrfToken();
  if (csrfToken && req.method !== 'GET' && req.method !== 'HEAD') {
    headers = headers.set('X-CSRF-Token', csrfToken);
  }

  const authedRequest = req.clone({ headers, withCredentials: true });

  return next(authedRequest).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse) || error.status !== 401 || isAuthEndpoint || req.headers.has('X-Retry')) {
        return throwError(() => error);
      }

      return auth.refreshAccessToken().pipe(
        switchMap((token) => {
          if (!token) {
            return throwError(() => error);
          }
          return next(
            req.clone({
              headers: req.headers.set('Authorization', `Bearer ${token}`).set('X-Retry', '1'),
              withCredentials: true,
            }),
          );
        }),
      );
    }),
  );
};
