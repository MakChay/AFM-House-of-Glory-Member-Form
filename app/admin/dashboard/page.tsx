'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  onAuthStateChanged,
  signOut,
  User,
} from 'firebase/auth';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { toast } from 'sonner';
import { type Submission } from '@/lib/types';
import { SA_PROVINCES } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table';
import {
  Loader2,
  Search,
  LogOut,
  FileSpreadsheet,
  FileText,
  FileDown,
  Trash2,
  Pencil,
  Eye,
  Inbox,
  Users,
  CalendarDays,
  Clock,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { format, isToday, startOfDay, endOfDay } from 'date-fns';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function isSubmissionToday(s: Submission): boolean {
  if (!s.createdAt) return false;
  return isToday(s.createdAt);
}

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [provinceFilter, setProvinceFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [sorting, setSorting] = useState<SortingState>([{ id: 'createdAt', desc: true }]);
  const [editing, setEditing] = useState<Submission | null>(null);
  const [viewing, setViewing] = useState<Submission | null>(null);
  const [deleting, setDeleting] = useState<Submission | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.push('/admin/login');
        return;
      }
      setUser(u);
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'submissions'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((docSnap) => {
          const d = docSnap.data();
          const createdAt = d.createdAt?.toDate?.() ? d.createdAt.toDate() : new Date(d.createdAt || Date.now());
          return {
            id: docSnap.id,
            ...d,
            createdAt,
          } as Submission;
        });
        setSubmissions(data);
        setLoading(false);
      },
      (err) => {
        toast.error('Failed to load submissions: ' + err.message);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [user]);

  const filtered = useMemo(() => {
    let data = [...submissions];
    if (search) {
      const s = search.toLowerCase();
      data = data.filter(
        (sub) =>
          sub.firstName.toLowerCase().includes(s) ||
          sub.surname.toLowerCase().includes(s) ||
          sub.email.toLowerCase().includes(s) ||
          sub.contactNumber.toLowerCase().includes(s)
      );
    }
    if (provinceFilter && provinceFilter !== 'all') {
      data = data.filter((sub) => sub.province === provinceFilter);
    }
    if (dateFilter && dateFilter !== 'all') {
      const now = new Date();
      if (dateFilter === 'today') {
        data = data.filter((sub) => isSubmissionToday(sub));
      } else if (dateFilter === 'week') {
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        data = data.filter((sub) => sub.createdAt >= weekAgo);
      } else if (dateFilter === 'month') {
        const monthAgo = new Date(now);
        monthAgo.setMonth(now.getMonth() - 1);
        data = data.filter((sub) => sub.createdAt >= monthAgo);
      }
    }
    return data;
  }, [submissions, search, provinceFilter, dateFilter]);

  const stats = useMemo(() => {
    const today = submissions.filter((s) => isSubmissionToday(s)).length;
    return {
      total: submissions.length,
      today,
      recent: submissions.slice(0, 5),
    };
  }, [submissions]);

  async function handleLogout() {
    await signOut(auth);
    toast.success('Logged out successfully');
    router.push('/admin/login');
  }

  async function handleDelete(id: string) {
    try {
      await deleteDoc(doc(db, 'submissions', id));
      toast.success('Submission deleted');
      setDeleting(null);
    } catch {
      toast.error('Failed to delete submission');
    }
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editing) return;
    const formData = new FormData(e.currentTarget);
    const updateData = {
      firstName: formData.get('firstName') as string,
      surname: formData.get('surname') as string,
      email: formData.get('email') as string,
      contactNumber: formData.get('contactNumber') as string,
      alternativeContactNumber: formData.get('alternativeContactNumber') as string,
      physicalAddress: formData.get('physicalAddress') as string,
      city: formData.get('city') as string,
      province: formData.get('province') as string,
      postalCode: formData.get('postalCode') as string,
      notes: formData.get('notes') as string,
      updatedAt: new Date(),
    };
    try {
      await updateDoc(doc(db, 'submissions', editing.id), updateData);
      toast.success('Submission updated');
      setEditing(null);
    } catch {
      toast.error('Failed to update submission');
    }
  }

  function exportCSV() {
    const headers = [
      'First Name', 'Surname', 'Email', 'Contact Number', 'Alt Contact',
      'Physical Address', 'City', 'Province', 'Postal Code', 'Notes', 'Created At',
    ];
    const rows = filtered.map((s) => [
      s.firstName, s.surname, s.email, s.contactNumber, s.alternativeContactNumber || '',
      s.physicalAddress, s.city, s.province, s.postalCode, s.notes || '',
      format(s.createdAt, 'yyyy-MM-dd HH:mm'),
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '\\"')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `submissions_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    toast.success('CSV exported successfully');
  }

  function exportExcel() {
    const rows = filtered.map((s) => ({
      'First Name': s.firstName,
      'Surname': s.surname,
      'Email': s.email,
      'Contact Number': s.contactNumber,
      'Alt Contact': s.alternativeContactNumber || '',
      'Physical Address': s.physicalAddress,
      'City': s.city,
      'Province': s.province,
      'Postal Code': s.postalCode,
      'Notes': s.notes || '',
      'Created At': format(s.createdAt, 'yyyy-MM-dd HH:mm'),
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Submissions');
    XLSX.writeFile(wb, `submissions_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    toast.success('Excel exported successfully');
  }

  function exportPDF() {
    const doc = new jsPDF();
    doc.text('Submissions Report', 14, 15);
    doc.text(`Generated: ${format(new Date(), 'dd MMM yyyy HH:mm')}`, 14, 22);
    const rows = filtered.map((s) => [
      s.firstName,
      s.surname,
      s.email,
      s.contactNumber,
      s.province,
      format(s.createdAt, 'yyyy-MM-dd'),
    ]);
    autoTable(doc, {
      head: [['First Name', 'Surname', 'Email', 'Contact', 'Province', 'Date']],
      body: rows,
      startY: 30,
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [207, 72, 30] },
    });
    doc.save(`submissions_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    toast.success('PDF exported successfully');
  }

  const columns: ColumnDef<Submission>[] = useMemo(
    () => [
      {
        accessorKey: 'firstName',
        header: () => (
          <div className="flex items-center gap-1">
            First Name
            <ArrowUpDown className="h-3 w-3" />
          </div>
        ),
        cell: ({ row }) => <span className="font-medium">{row.original.firstName}</span>,
      },
      {
        accessorKey: 'surname',
        header: () => (
          <div className="flex items-center gap-1">
            Surname
            <ArrowUpDown className="h-3 w-3" />
          </div>
        ),
      },
      {
        accessorKey: 'email',
        header: () => (
          <div className="flex items-center gap-1">
            Email
            <ArrowUpDown className="h-3 w-3" />
          </div>
        ),
        cell: ({ row }) => <span className="text-xs">{row.original.email}</span>,
      },
      {
        accessorKey: 'contactNumber',
        header: 'Contact',
      },
      {
        accessorKey: 'province',
        header: () => (
          <div className="flex items-center gap-1">
            Province
            <ArrowUpDown className="h-3 w-3" />
          </div>
        ),
        cell: ({ row }) => (
          <Badge variant="outline" className="border-[hsl(207,72%,30%)]/30 text-[hsl(207,72%,30%)] dark:text-[hsl(207,72%,70%)]">
            {row.original.province}
          </Badge>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: () => (
          <div className="flex items-center gap-1">
            Date
            <ArrowUpDown className="h-3 w-3" />
          </div>
        ),
        cell: ({ row }) => (
          <span className="text-xs whitespace-nowrap">{format(row.original.createdAt, 'dd MMM yyyy HH:mm')}</span>
        ),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => setViewing(row.original)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setEditing(row.original)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setDeleting(row.original)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  if (!user || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[hsl(207,72%,30%)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(207,72%,97%)] dark:bg-[hsl(207,72%,5%)]">
      {/* Header */}
      <header className="bg-[hsl(207,72%,30%)] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 bg-white rounded-full p-1">
            <Image src="/afm_big_logo.png" alt="Logo" fill className="object-contain rounded-full" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">House of Glory</h1>
            <p className="text-xs text-white/80">Data Collection Management</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline text-sm text-white/80">{user.email}</span>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-white hover:bg-white/10">
            <LogOut className="h-4 w-4 mr-1" />
            Logout
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Submissions</CardTitle>
              <Users className="h-4 w-4 text-[hsl(207,72%,30%)]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[hsl(207,72%,25%)] dark:text-white">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Today</CardTitle>
              <CalendarDays className="h-4 w-4 text-[hsl(50,70%,45%)]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[hsl(207,72%,25%)] dark:text-white">{stats.today}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Recent (5)</CardTitle>
              <Clock className="h-4 w-4 text-[hsl(207,72%,30%)]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[hsl(207,72%,25%)] dark:text-white">{stats.recent.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search name, email, phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
            <Select value={provinceFilter} onValueChange={setProvinceFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Provinces" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Provinces</SelectItem>
                {SA_PROVINCES.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportCSV}>
              <FileDown className="h-4 w-4 mr-1" />
              CSV
            </Button>
            <Button variant="outline" size="sm" onClick={exportExcel}>
              <FileSpreadsheet className="h-4 w-4 mr-1" />
              Excel
            </Button>
            <Button variant="outline" size="sm" onClick={exportPDF}>
              <FileText className="h-4 w-4 mr-1" />
              PDF
            </Button>
          </div>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((hg) => (
                    <TableRow key={hg.id}>
                      {hg.headers.map((h) => (
                        <TableHead key={h.id} onClick={h.column.getToggleSortingHandler()} className="cursor-pointer select-none">
                          {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="text-center py-16">
                        <div className="flex flex-col items-center gap-3">
                          <Inbox className="h-10 w-10 text-muted-foreground" />
                          <p className="text-muted-foreground">No submissions found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                        ))}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <div className="text-sm text-muted-foreground">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()} ({filtered.length} total)
              </div>
              <div className="flex gap-1">
                <Button variant="outline" size="icon" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Detail */}
      <Sheet open={!!viewing} onOpenChange={() => setViewing(null)}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Submission Details</SheetTitle>
            <SheetDescription>View full details of this submission.</SheetDescription>
          </SheetHeader>
          {viewing && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground text-xs">First Name</Label>
                  <p className="font-medium">{viewing.firstName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Surname</Label>
                  <p className="font-medium">{viewing.surname}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-muted-foreground text-xs">Email</Label>
                  <p className="font-medium">{viewing.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Contact Number</Label>
                  <p className="font-medium">{viewing.contactNumber}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Alt Contact</Label>
                  <p className="font-medium">{viewing.alternativeContactNumber || '—'}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-muted-foreground text-xs">Physical Address</Label>
                  <p className="font-medium">{viewing.physicalAddress}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">City</Label>
                  <p className="font-medium">{viewing.city}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Postal Code</Label>
                  <p className="font-medium">{viewing.postalCode}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Province</Label>
                  <p className="font-medium">{viewing.province}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Submitted</Label>
                  <p className="font-medium">{format(viewing.createdAt, 'dd MMM yyyy HH:mm')}</p>
                </div>
                {viewing.notes && (
                  <div className="col-span-2">
                    <Label className="text-muted-foreground text-xs">Notes</Label>
                    <p className="font-medium">{viewing.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Edit Dialog */}
      <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Submission</DialogTitle>
          </DialogHeader>
          {editing && (
            <form onSubmit={handleUpdate} className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" name="firstName" defaultValue={editing.firstName} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="surname">Surname</Label>
                  <Input id="surname" name="surname" defaultValue={editing.surname} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" defaultValue={editing.email} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Contact Number</Label>
                  <Input id="contactNumber" name="contactNumber" defaultValue={editing.contactNumber} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alternativeContactNumber">Alt Contact</Label>
                  <Input id="alternativeContactNumber" name="alternativeContactNumber" defaultValue={editing.alternativeContactNumber || ''} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="physicalAddress">Physical Address</Label>
                <Textarea id="physicalAddress" name="physicalAddress" defaultValue={editing.physicalAddress} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" defaultValue={editing.city} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input id="postalCode" name="postalCode" defaultValue={editing.postalCode} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="province">Province</Label>
                <Select name="province" defaultValue={editing.province} onValueChange={(v) => {
                  const input = document.getElementById('province-hidden') as HTMLInputElement;
                  if (input) input.value = v;
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SA_PROVINCES.map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input id="province-hidden" type="hidden" name="province" defaultValue={editing.province} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" name="notes" defaultValue={editing.notes || ''} />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditing(null)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-[hsl(207,72%,30%)] hover:bg-[hsl(207,72%,25%)] text-white">
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleting} onOpenChange={() => setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Submission</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the submission for {deleting?.firstName} {deleting?.surname}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleting(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleting && handleDelete(deleting.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
