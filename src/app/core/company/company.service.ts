import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_URL } from '../api-url';
import { Company } from './company.models';

@Injectable({ providedIn: 'root' })
export class CompanyService {
  private readonly http = inject(HttpClient);

  list(): Observable<Company[]> {
    return this.http.get<{ tenants: Company[] }>(`${API_URL}/tenants`).pipe(map((response) => response.tenants));
  }

  create(name: string): Observable<Company> {
    return this.http
      .post<{ tenant: Company }>(`${API_URL}/tenants`, { name })
      .pipe(map((response) => response.tenant));
  }

  get(id: string): Observable<Company> {
    return this.http.get<{ tenant: Company }>(`${API_URL}/tenants/${id}`).pipe(map((response) => response.tenant));
  }
}
