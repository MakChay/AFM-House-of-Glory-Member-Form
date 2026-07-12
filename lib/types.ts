export interface Submission {
  id: string;
  firstName: string;
  surname: string;
  email: string;
  contactNumber: string;
  alternativeContactNumber?: string;
  physicalAddress: string;
  city: string;
  province: string;
  postalCode: string;
  notes?: string;
  createdAt: Date;
  updatedAt?: Date;
  homeCellId?: string;
  homeCell?: string;
}

export interface HomeCell {
  id: string;
  name: string;
  leaders: string[];
  contactNumbers: string[];
  isActive: boolean;
  createdAt: Date;
}

export interface SubmissionFormData {
  firstName: string;
  surname: string;
  email: string;
  contactNumber: string;
  alternativeContactNumber: string;
  physicalAddress: string;
  city: string;
  province: string;
  postalCode: string;
  notes: string;
}

export interface DashboardStats {
  totalSubmissions: number;
  submissionsToday: number;
  recentSubmissions: Submission[];
}

export const SA_PROVINCES = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "Northern Cape",
  "North West",
  "Western Cape",
] as const;

export type SAProvince = (typeof SA_PROVINCES)[number];
