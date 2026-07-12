'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';
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
import { Loader2, CheckCircle, Users, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { type HomeCell } from '@/lib/types';

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
  homeCell: z.string().min(1, 'Home cell is required'),
  homeCellId: z.string().min(1, 'Home cell ID is required'),
  notes: z.string().optional(),
});

type SubmissionSchema = z.infer<typeof submissionSchema>;

export default function SubmissionForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [homeCells, setHomeCells] = useState<HomeCell[]>([]);
  const [selectedCell, setSelectedCell] = useState<HomeCell | null>(null);
  const [loadingCells, setLoadingCells] = useState(true);

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
      homeCell: '',
      homeCellId: '',
      notes: '',
    },
  });

  useEffect(() => {
    const q = query(collection(db, 'homeCells'), orderBy('name'));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const cells = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            name: data.name || '',
            leaders: data.leaders || [],
            contactNumbers: data.contactNumbers || [],
            isActive: data.isActive !== false,
            createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate() : new Date(),
          } as HomeCell;
        }).filter((c) => c.isActive);
        setHomeCells(cells);
        setLoadingCells(false);
      },
      () => {
        setLoadingCells(false);
      }
    );
    return () => unsub();
  }, []);

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

  function handleCellChange(cellId: string) {
    const cell = homeCells.find((c) => c.id === cellId);
    if (cell) {
      setSelectedCell(cell);
      form.setValue('homeCell', cell.name);
      form.setValue('homeCellId', cell.id);
    } else {
      setSelectedCell(null);
      form.setValue('homeCell', '');
      form.setValue('homeCellId', '');
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
          onClick={() => { setSubmitted(false); form.reset(); setSelectedCell(null); }}
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
        <CardTitle className="text-xl text-[hsl(207,72%,25%)] dark:text-white">Member Registration Form</CardTitle>
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

            {/* Home Cell Section */}
            <div className="border rounded-lg p-4 bg-[hsl(207,72%,30%)]/5 dark:bg-[hsl(207,72%,10%)]">
              <h4 className="text-sm font-semibold mb-3 text-[hsl(207,72%,25%)] dark:text-white flex items-center gap-2">
                <Users className="h-4 w-4 text-[hsl(207,72%,30%)]" />
                Home Cell Information
              </h4>
              <FormField
                control={form.control}
                name="homeCellId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Home Cell *</FormLabel>
                    <Select
                      onValueChange={(v) => { field.onChange(v); handleCellChange(v); }}
                      value={field.value}
                      disabled={loadingCells}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={loadingCells ? 'Loading home cells...' : 'Select home cell'} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {homeCells.map((cell) => (
                          <SelectItem key={cell.id} value={cell.id}>
                            {cell.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedCell && (
                <div className="mt-4 space-y-3">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Home Cell Leaders</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedCell.leaders.map((leader: string, i: number) => (
                        <Badge key={i} variant="outline" className="border-[hsl(207,72%,30%)]/30 text-[hsl(207,72%,30%)] dark:text-[hsl(207,72%,70%)]">
                          <Users className="h-3 w-3 mr-1" />
                          {leader}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {selectedCell.contactNumbers.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Contact Numbers</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedCell.contactNumbers.map((num: string, i: number) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            <Phone className="h-3 w-3 mr-1" />
                            {num}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

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
                'Submit Registration'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
