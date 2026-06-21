'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  Loader2,
  CheckCircle,
  User,
  Church,
  Phone,
} from 'lucide-react';

const submissionSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  surname: z.string().min(2, 'Surname is required'),

  contactNumber: z.string().min(1, 'Contact number is required'),

  whatsappNumber: z.string().optional(),

  email: z
    .string()
    .email('Invalid email')
    .optional()
    .or(z.literal('')),

  residentialAddress: z
    .string()
    .min(5, 'Residential address is required'),

  dateOfBirth: z.string().optional(),

  gender: z.string().optional(),

  maritalStatus: z.string().min(1, 'Please select marital status'),

  occupation: z.string().optional(),

  dateJoined: z.string().optional(),

  ministry: z.string().min(1, 'Please select a ministry'),

  emergencyContactName: z
    .string()
    .min(1, 'Emergency contact is required'),

  emergencyRelationship: z
    .string()
    .min(1, 'Relationship is required'),

  emergencyContactNumber: z
    .string()
    .min(1, 'Emergency contact number is required'),

  consent: z.boolean().refine((val) => val === true, {
  message: 'You must accept before submitting.',
}),
});




type SubmissionSchema = z.infer<typeof submissionSchema>;

export default function SubmissionForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<SubmissionSchema>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      firstName: '',
      surname: '',
      contactNumber: '',
      whatsappNumber: '',
      email: '',
      residentialAddress: '',
      dateOfBirth: '',
      gender: '',
      maritalStatus: '',
      occupation: '',
      dateJoined: '',
      ministry: '',
      emergencyContactName: '',
      emergencyRelationship: '',
      emergencyContactNumber: '',
      consent: false,
    },
  });

  async function onSubmit(data: SubmissionSchema) {
    setSubmitting(true);

    try {
      await addDoc(collection(db, 'members'), {
        ...data,
        createdAt: serverTimestamp(),
      });

      toast.success('Registration submitted successfully.');

      setSubmitted(true);
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <Card className="max-w-2xl mx-auto my-8 shadow-lg">
        <CardContent className="flex flex-col items-center justify-center text-center p-8">
          <div className="rounded-full bg-primary/10 p-6 mb-6">
            <CheckCircle className="w-16 h-16 text-primary" />
          </div>

          <h2 className="text-3xl font-bold mb-3">
            Thank You!
          </h2>

          <p className="text-muted-foreground max-w-lg">
            Your information has been successfully submitted.
            Thank you for becoming part of the AFM House of Glory
            family.
          </p>

          <Button
            className="mt-8"
            onClick={() => {
              form.reset();
              setSubmitted(false);
            }}
          >
            Register Another Member
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto my-8 shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">
          AFM House of Glory
        </CardTitle>

        <p className="text-muted-foreground">
          Member Registration Form
        </p>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-10"
          >
            {/* PERSONAL INFORMATION */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <User className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold">
                  Personal Information
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="surname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Surname *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="whatsappNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="residentialAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Residential Address *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maritalStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marital Status *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Marital Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Single">Single</SelectItem>
                          <SelectItem value="Married">Married</SelectItem>
                          <SelectItem value="Divorced">Divorced</SelectItem>
                          <SelectItem value="Widowed">Widowed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="occupation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Occupation</FormLabel>
                      <FormControl>
                        <Input placeholder="Occupation" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* CHURCH INFORMATION */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Church className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold">
                  Church Information
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="dateJoined"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date Joined AFM House of Glory</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ministry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ministry *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Ministry" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="None">None</SelectItem>
                          <SelectItem value="Youth">Youth</SelectItem>
                          <SelectItem value="Children's Church">Children's Church</SelectItem>
                          <SelectItem value="Women's Fellowship">Women's Fellowship</SelectItem>
                          <SelectItem value="Men's Fellowship">Men's Fellowship</SelectItem>
                          <SelectItem value="Praise & Worship">Praise & Worship</SelectItem>
                          <SelectItem value="Media Team">Media Team</SelectItem>
                          <SelectItem value="Ushers">Ushers</SelectItem>
                          <SelectItem value="Hospitality">Hospitality</SelectItem>
                          <SelectItem value="Intercessors">Intercessors</SelectItem>
                          <SelectItem value="Evangelism">Evangelism</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* EMERGENCY CONTACT */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Phone className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold">
                  Emergency Contact
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="emergencyContactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Full Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emergencyRelationship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Parent, Spouse, Sibling" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emergencyContactNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="+27..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* CONSENT & SUBMIT */}
            <div className="space-y-6 pt-4 border-t">
              <FormField
                control={form.control}
                name="consent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I consent to AFM House of Glory storing my information for membership and communication purposes. *
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex justify-center pt-2">
                <Button
                  type="submit"
                  className="w-full md:w-auto px-8 py-6 text-lg font-semibold"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Registration'
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}