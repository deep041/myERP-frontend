import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('keeps the access token in memory and does not use localStorage', () => {
    spyOn(localStorage, 'setItem');

    service.login({ email: 'ada@example.com', password: 'correct-horse' }).subscribe();

    const request = http.expectOne('/api/v1/auth/login');
    expect(request.request.withCredentials).toBeTrue();
    request.flush({
      accessToken: 'memory-token',
      expiresIn: 900,
      csrfToken: 'csrf-token',
      user: { id: '1', name: 'Ada', email: 'ada@example.com', createdAt: '2026-10-27T00:00:00.000Z' },
    });

    expect(service.getAccessToken()).toBe('memory-token');
    expect(service.user()?.email).toBe('ada@example.com');
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });
});
