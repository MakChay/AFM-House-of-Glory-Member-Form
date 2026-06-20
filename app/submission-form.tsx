'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SA_PROVINCES } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle } from 'lucide-react';

const submissionSchema = z.object({
  firstName: z.string().min(1, 'First name is required').min(2, 'At least 2 characters'),
  surname: z.string().min(1, 'Surname is required').min(2, 'At least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  contactNumber: z.string().min(1, 'Contact number is required').regex(/^\+?[\d\s\-()]+$/, 'Invalid phone number'),
  alternativeContactNumber: z.string().regex(/^\+?[\d\s\-()]*$/, 'Invalid phone number').optional().or(z.literal('')),
  physicalAddress: z.string().min(1, 'Physical address is required').min(5, 'At least 5 characters'),
  city: z.string().min(1, 'City is required').min(2, 'At least 2 characters'),
  province: z.string().min(1, 'Province is required'),
  postalCode: z.string().min(1, 'Postal code is required').regex(/^\d{4,5}$/, 'Invalid postal code'),
  notes: z.string().optional(),
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
      email: '',
      contactNumber: '',
      alternativeContactNumber: '',
      physicalAddress: '',
      city: '',
      province: '',
      postalCode: '',
      notes: '',
    },
  });

  async function onSubmit(data: SubmissionSchema) {
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'submissions'), {
        ...data,
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
      toast.success('Submission received successfully!');
    } catch (error) {
      toast.error('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="rounded-full bg-[hsl(50,70%,50%)]/10 p-6 mb-6">
          <CheckCircle className="h-16 w-16 text-[hsl(50,70%,45%)]" />
        </div>
        <h2 className="text-2xl font-bold text-[hsl(207,72%,25%)] dark:text-white mb-3">Thank You!</h2>
        <p className="text-muted-foreground max-w-md mb-8">
          Your information has been submitted successfully. We will be in touch with you shortly.
        </p>
        <Button
          onClick={() => { setSubmitted(false); form.reset(); }}
          className="bg-[hsl(207,72%,30%)] hover:bg-[hsl(207,72%,25%)] text-white"
        >
          Submit Another
        </Button>
      </div>
    );
  }

  return (
    <Card className="shadow-lg border-[hsl(207,72%,30%)]/10">
      <CardHeader className="bg-[hsl(207,72%,30%)]/5 rounded-t-lg">
        <CardTitle className="text-xl text-[hsl(207,72%,25%)] dark:text-white">Data Collection Form</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
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
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="+27 123 456 789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="alternativeContactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alternative Contact Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+27 987 654 321" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="physicalAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Physical Address *</FormLabel>
                  <FormControl>
                    <Textarea placeholder="123 Main Street, Suburb" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City *</FormLabel>
                    <FormControl>
                      <Input placeholder="Johannesburg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code *</FormLabel>
                    <FormControl>
                      <Input placeholder="2000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="province"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Province *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select province" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SA_PROVINCES.map((province) => (
                        <SelectItem key={province} value={province}>
                          {province}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Additional information..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-[hsl(207,72%,30%)] hover:bg-[hsl(207,72%,25%)] text-white"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
