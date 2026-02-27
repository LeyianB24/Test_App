// ========== Authentication Models ==========
export interface User {
  id: string;
  taxpayer_id: string; // KRA PIN - the unique identifier
  password?: string; // For registration only
  name: string;
  email: string;
  type: 'individual' | 'business' | 'admin';
  role?: string; // Role-based access control: SUPER_ADMIN, ADMIN, USER, etc.
  registrationDate: string;
  lastLogin?: string;
  profile?: TaxpayerProfile; // Optional profile data for registration
}

export interface TaxpayerProfile {
  citizenship: string;
  id_number: string;
  first_name: string;
  last_name: string;
  dob: string;
  email: string;
  phone: string;
  county: string;
  town: string;
  address: string;
  station?: string;
}

export interface LoginCredentials {
  taxpayer_id: string; // KRA PIN instead of generic 'pin'
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  data?: {
    user?: User;
    token?: string;
    tokens?: {
      access_token: string;
      refresh_token?: string;
      access_expires_in?: number;
      refresh_expires_in?: number;
    };
  };
  message?: string;
  token?: string;
}

// ========== Taxpayer Models ==========
export interface Taxpayer {
  id: string;
  userId?: string;
  citizenship: string;
  idNumber: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dob: string;
  gender: 'male' | 'female' | 'other';
  residentStatus: 'resident' | 'non-resident';
  economicActivity: string;
  email: string;
  phone: string;
  county: string;
  countyCode?: string;
  subCounty: string;
  ward: string;
  town: string;
  address: string;
  postalAddress?: string;
  postalCode?: string;
  registrationDate: string;
}

export interface Payment {
  id: number;  
  prn: string;
  date: string;
  type: string;
  amount: number;
  status: 'pending' | 'paid';
  method?: string;
  taxpayerId?: string;
}

export interface TaxReturn {
  id: string;
  period: string;
  type: string;
  status: 'submitted' | 'pending' | 'draft';
  dateSubmitted?: string;
  taxpayerId?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  date: string;
  amount: number;
  taxAmount: number;
  status: 'synced' | 'pending' | 'error';
}

// ========== Dashboard & UI Models ==========
export interface SummaryStats {
  totalPaid: number;
  pendingDue: number;
  lastPaymentDate: string;
}

export interface MenuNotification {
  route: string;
  count: number;
  type: 'info' | 'warning' | 'danger';
}
