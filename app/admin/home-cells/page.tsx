'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  collection, query, orderBy, onSnapshot, addDoc, doc, updateDoc, deleteDoc, serverTimestamp,
} from 'firebase/firestore';
import { seedHomeCells } from '@/lib/seed-homecells';
import { type HomeCell } from '@/lib/types';
import {
  Loader2, LogOut, Plus, Users, Phone, Trash2, Pencil, Archive, ArchiveRestore,
  Search, X, Home,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function HomeCellsAdmin() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [homeCells, setHomeCells] = useState<HomeCell[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<HomeCell | null>(null);
  const [deleting, setDeleting] = useState<HomeCell | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formLeaders, setFormLeaders] = useState<string[]>(['']);
  const [formContacts, setFormContacts] = useState<string[]>(['']);
  const [formActive, setFormActive] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) { router.push('/admin/login'); return; }
      setUser(u);
    });
    return () => unsub();
  }, [router]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const q = query(collection(db, 'homeCells'), orderBy('name'));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          name: data.name || '',
          leaders: data.leaders || [],
          contactNumbers: data.contactNumbers || [],
          isActive: data.isActive !== false,
          createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate() : new Date(),
          updatedAt: data.updatedAt?.toDate?.() ? data.updatedAt.toDate() : undefined,
        } as HomeCell;
      });
      setHomeCells(data);
      setLoading(false);
    }, (err) => {
      toast.error('Failed to load home cells: ' + err.message);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  async function handleLogout() {
    await signOut(auth);
    toast.success('Logged out successfully');
    router.push('/');
  }

  async function handleSeed() {
    setLoading(true);
    try {
      const result = await seedHomeCells();
      if (result.seeded) {
        toast.success(result.message);
      } else {
        toast.info(result.message);
      }
    } catch (err) {
      toast.error('Failed to seed home cells');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    const name = formName.trim();
    const leaders = formLeaders.filter((l) => l.trim());
    const contacts = formContacts.filter((c) => c.trim());
    if (!name) { toast.error('Name is required'); return; }
    if (leaders.length === 0) { toast.error('At least one leader is required'); return; }

    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'homeCells', editing.id), {
          name, leaders, contactNumbers: contacts, isActive: formActive,
          updatedAt: serverTimestamp(),
        });
        toast.success('Home cell updated');
      } else {
        await addDoc(collection(db, 'homeCells'), {
          name, leaders, contactNumbers: contacts, isActive: formActive,
          createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
        });
        toast.success('Home cell created');
      }
      setEditing(null);
      setIsAddOpen(false);
      resetForm();
    } catch (err) {
      toast.error('Failed to save home cell');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteDoc(doc(db, 'homeCells', id));
      toast.success('Home cell deleted');
      setDeleting(null);
    } catch {
      toast.error('Failed to delete home cell');
    }
  }

  async function handleToggleActive(cell: HomeCell) {
    try {
      await updateDoc(doc(db, 'homeCells', cell.id), {
        isActive: !cell.isActive,
        updatedAt: serverTimestamp(),
      });
      toast.success(cell.isActive ? 'Home cell archived' : 'Home cell activated');
    } catch {
      toast.error('Failed to update status');
    }
  }

  function resetForm() {
    setFormName('');
    setFormLeaders(['']);
    setFormContacts(['']);
    setFormActive(true);
  }

  function openEdit(cell: HomeCell) {
    setEditing(cell);
    setFormName(cell.name);
    setFormLeaders(cell.leaders.length ? cell.leaders : ['']);
    setFormContacts(cell.contactNumbers.length ? cell.contactNumbers : ['']);
    setFormActive(cell.isActive);
    setIsAddOpen(true);
  }

  function openAdd() {
    setEditing(null);
    resetForm();
    setIsAddOpen(true);
  }

  const filtered = homeCells.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.leaders.some((l) => l.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[hsl(207,72%,30%)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(207,72%,97%)] dark:bg-[hsl(207,72%,5%)]">
      <header className="bg-[hsl(207,72%,30%)] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 bg-white rounded-full p-1">
            <Image src="/afm_big_logo.png" alt="Logo" fill className="object-contain rounded-full" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">Home Cells</h1>
            <p className="text-xs text-white/80">Administration</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/dashboard">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">Dashboard</Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-white hover:bg-white/10">
            <LogOut className="h-4 w-4 mr-1" /> Logout
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search home cells..."
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
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleSeed}>
              <Home className="h-4 w-4 mr-1" /> Seed
            </Button>
            <Button size="sm" className="bg-[hsl(207,72%,30%)] hover:bg-[hsl(207,72%,25%)] text-white" onClick={openAdd}>
              <Plus className="h-4 w-4 mr-1" /> Add Home Cell
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((cell) => (
            <Card key={cell.id} className={cell.isActive ? '' : 'opacity-60'}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{cell.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={cell.isActive ? 'default' : 'secondary'} className={cell.isActive ? 'bg-[hsl(50,70%,45%)] text-white' : ''}>
                        {cell.isActive ? 'Active' : 'Archived'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(cell)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleToggleActive(cell)}>
                      {cell.isActive ? <Archive className="h-4 w-4" /> : <ArchiveRestore className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setDeleting(cell)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                    <Users className="h-3 w-3" /> Leaders
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {cell.leaders.map((l, i) => (
                      <Badge key={i} variant="outline">{l}</Badge>
                    ))}
                  </div>
                </div>
                {cell.contactNumbers.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                      <Phone className="h-3 w-3" /> Contacts
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {cell.contactNumbers.map((n, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">{n}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Home className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No home cells found. Click Seed to add the default home cells.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Home Cell' : 'Add Home Cell'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Home cell name" />
            </div>
            <div className="space-y-2">
              <Label>Leaders</Label>
              {formLeaders.map((l, i) => (
                <div key={i} className="flex gap-2">
                  <Input value={l} onChange={(e) => {
                    const next = [...formLeaders]; next[i] = e.target.value; setFormLeaders(next);
                  }} placeholder="Leader name" />
                  <Button variant="outline" size="icon" onClick={() => setFormLeaders(formLeaders.filter((_, idx) => idx !== i))}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setFormLeaders([...formLeaders, ''])}>
                <Plus className="h-4 w-4 mr-1" /> Add Leader
              </Button>
            </div>
            <div className="space-y-2">
              <Label>Contact Numbers</Label>
              {formContacts.map((c, i) => (
                <div key={i} className="flex gap-2">
                  <Input value={c} onChange={(e) => {
                    const next = [...formContacts]; next[i] = e.target.value; setFormContacts(next);
                  }} placeholder="Contact number" />
                  <Button variant="outline" size="icon" onClick={() => setFormContacts(formContacts.filter((_, idx) => idx !== i))}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setFormContacts([...formContacts, ''])}>
                <Plus className="h-4 w-4 mr-1" /> Add Contact
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="active" checked={formActive} onChange={(e) => setFormActive(e.target.checked)} className="rounded" />
              <Label htmlFor="active" className="mb-0">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsAddOpen(false); setEditing(null); resetForm(); }}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-[hsl(207,72%,30%)] hover:bg-[hsl(207,72%,25%)] text-white">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
              {editing ? 'Save Changes' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleting} onOpenChange={() => setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Home Cell</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deleting?.name}? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleting(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleting && handleDelete(deleting.id)} className="bg-destructive text-white hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
