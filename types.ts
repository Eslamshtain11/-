export interface Payment {
  id: string;
  studentName: string;
  groupName:string;
  amount: number;
  date: string; // YYYY-MM-DD
}

export type NewPayment = Omit<Payment, 'id'>;

export interface User {
  name: string;
  phone: string;
  password: string; // Stored as plain text for this simple app
  guestCode?: string;
}


export enum Screen {
  DASHBOARD = 'DASHBOARD',
  MONTHLY_REPORT = 'MONTHLY_REPORT',
  STATISTICS = 'STATISTICS',
  ADVANCED_SEARCH = 'ADVANCED_SEARCH',
  MANAGE_GROUPS = 'MANAGE_GROUPS',
  GUEST_ACCESS = 'GUEST_ACCESS',
}