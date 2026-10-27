import { Injectable, signal } from '@angular/core';
import { Company } from './company.models';

const STORAGE_KEY = 'erp.selectedCompany';

@Injectable({ providedIn: 'root' })
export class CompanyContextService {
  private readonly selectedState = signal<Company | null>(readStoredCompany());
  readonly selected = this.selectedState.asReadonly();

  select(company: Company): void {
    this.selectedState.set(company);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(company));
  }

  clear(): void {
    this.selectedState.set(null);
    sessionStorage.removeItem(STORAGE_KEY);
  }
}

function readStoredCompany(): Company | null {
  if (typeof sessionStorage === 'undefined') {
    return null;
  }
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as Company;
  } catch {
    return null;
  }
}
