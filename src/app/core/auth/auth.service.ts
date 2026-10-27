import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, finalize, map, of, shareReplay, switchMap, tap } from 'rxjs';
import { API_URL } from '../api-url';
import { AuthResponse, AuthUser, Credentials, Registration } from './auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly currentUser = signal<AuthUser | null>(null);
  private accessToken: string | null = null;
  private csrfToken: string | null = null;
  private refreshRequest: Observable<string | null> | null = null;

  readonly user = this.currentUser.asReadonly();

  getAccessToken(): string | null {
    return this.accessToken;
  }

  getCsrfToken(): string | null {
    return this.csrfToken ?? readCookie('csrf_token');
  }

  restore(): Promise<void> {
    const existingCsrf = this.getCsrfToken();
    const bootstrap = existingCsrf
      ? of({ csrfToken: existingCsrf })
      : this.http.get<{ csrfToken: string | null }>(`${API_URL}/auth/csrf`, { withCredentials: true });

    return new Promise((resolve) => {
      bootstrap
        .pipe(
          switchMap((body) => {
            if (!body.csrfToken) {
              return of(null);
            }
            this.csrfToken = body.csrfToken;
            return this.refreshAccessToken();
          }),
          catchError(() => of(null)),
        )
        .subscribe(() => resolve());
    });
  }

  register(input: Registration): Observable<AuthUser> {
    return this.http
      .post<AuthResponse>(`${API_URL}/auth/register`, input, { withCredentials: true })
      .pipe(tap((response) => this.remember(response)), map((response) => response.user));
  }

  login(input: Credentials): Observable<AuthUser> {
    return this.http
      .post<AuthResponse>(`${API_URL}/auth/login`, input, { withCredentials: true })
      .pipe(tap((response) => this.remember(response)), map((response) => response.user));
  }

  refreshAccessToken(): Observable<string | null> {
    if (this.refreshRequest) {
      return this.refreshRequest;
    }

    const csrf = this.getCsrfToken();
    if (!csrf) {
      this.clearSession();
      return of(null);
    }

    this.refreshRequest = this.http
      .post<AuthResponse>(
        `${API_URL}/auth/refresh`,
        {},
        {
          withCredentials: true,
          headers: { 'X-CSRF-Token': csrf },
        },
      )
      .pipe(
        tap((response) => this.remember(response)),
        map((response) => response.accessToken),
        catchError(() => {
          this.clearSession();
          return of(null);
        }),
        finalize(() => {
          this.refreshRequest = null;
        }),
        shareReplay(1),
      );

    return this.refreshRequest;
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${API_URL}/auth/logout`, {}, { withCredentials: true }).pipe(
      catchError(() => of(undefined)),
      finalize(() => this.clearSession()),
      map(() => undefined),
    );
  }

  clearSession(): void {
    this.accessToken = null;
    this.csrfToken = null;
    this.currentUser.set(null);
  }

  private remember(response: AuthResponse): void {
    this.accessToken = response.accessToken;
    this.csrfToken = response.csrfToken;
    this.currentUser.set(response.user);
  }
}

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    return null;
  }
  const prefix = `${name}=`;
  const match = document.cookie.split('; ').find((row) => row.startsWith(prefix));
  return match ? decodeURIComponent(match.slice(prefix.length)) : null;
}
