import { Routes } from '@angular/router';
import { authGuard, companyGuard, guestGuard } from './core/auth/auth.guards';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'companies' },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'companies/new',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/companies/company-create.component').then((m) => m.CompanyCreateComponent),
  },
  {
    path: 'companies',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/companies/company-list.component').then((m) => m.CompanyListComponent),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard, companyGuard],
    loadComponent: () => import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
];
