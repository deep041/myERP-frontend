export interface Company {
  id: string;
  name: string;
  ownerId: string;
  role: 'OWNER' | 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
  createdAt: string;
}
