import { z } from "zod";
import { SA_PROVINCES } from "./types";

export const submissionSchema = z.object({
  firstName: z.string().min(1, "First name is required").min(2, "At least 2 characters"),
  surname: z.string().min(1, "Surname is required").min(2, "At least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  contactNumber: z.string().min(1, "Contact number is required").regex(/^\+?[\d\s\-()]+$/, "Invalid phone number"),
  alternativeContactNumber: z.string().regex(/^\+?[\d\s\-()]*$/, "Invalid phone number").optional().or(z.literal("")),
  physicalAddress: z.string().min(1, "Physical address is required").min(5, "At least 5 characters"),
  city: z.string().min(1, "City is required").min(2, "At least 2 characters"),
  province: z.string().min(1, "Province is required"),
  postalCode: z.string().min(1, "Postal code is required").regex(/^\d{4,5}$/, "Invalid postal code"),
  notes: z.string().optional(),
});

export type SubmissionSchema = z.infer<typeof submissionSchema>;
