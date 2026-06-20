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
