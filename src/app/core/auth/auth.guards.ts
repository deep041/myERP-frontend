import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CompanyContextService } from '../company/company-context.service';
import { CompanyService } from '../company/company.service';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.user() ? true : router.createUrlTree(['/login']);
};

export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.user() ? router.createUrlTree(['/companies']) : true;
};

export const companyGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const companies = inject(CompanyService);
  const context = inject(CompanyContextService);

  if (!auth.user()) {
    return router.createUrlTree(['/login']);
  }

  const selected = context.selected();
  if (!selected) {
    return router.createUrlTree(['/companies']);
  }

  try {
    const tenant = await firstValueFrom(companies.get(selected.id));
    context.select(tenant);
    return true;
  } catch {
    context.clear();
    return router.createUrlTree(['/companies']);
  }
};
