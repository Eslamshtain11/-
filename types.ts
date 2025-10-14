
export interface Payment {
  id: string;
  studentName: string;
  groupName:string;
  amount: number;
  date: string; // YYYY-MM-DD
}

export type NewPayment = Omit<Payment, 'id'>;

export interface User {
  id: string;
  phone: string;
  name: string;
  guestCode?: string | null;
}

export interface Group {
    id: string;
    name: string;
}


export enum Screen {
  DASHBOARD = 'DASHBOARD',
  MONTHLY_REPORT = 'MONTHLY_REPORT',
  STATISTICS = 'STATISTICS',
  ADVANCED_SEARCH = 'ADVANCED_SEARCH',
  MANAGE_GROUPS = 'MANAGE_GROUPS',
  GUEST_ACCESS = 'GUEST_ACCESS',
}