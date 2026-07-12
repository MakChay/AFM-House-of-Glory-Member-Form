'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Phone, Search, X, Home, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/footer';
import { type HomeCell } from '@/lib/types';

export default function HomeCellDirectory() {
  const [homeCells, setHomeCells] = useState<HomeCell[]>([]);
  const [memberCounts, setMemberCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
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
        } as HomeCell;
      });
      setHomeCells(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'submissions'), (snap) => {
      const counts: Record<string, number> = {};
      snap.docs.forEach((d) => {
        const data = d.data();
        const cellId = data.homeCellId;
        if (cellId) {
          counts[cellId] = (counts[cellId] || 0) + 1;
        }
      });
      setMemberCounts(counts);
    });
    return () => unsub();
  }, []);

  const filtered = homeCells.filter((c) =>
    c.isActive && (
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.leaders.some((l: string) => l.toLowerCase().includes(search.toLowerCase()))
    )
  );

  return (
    <div className="min-h-screen bg-[hsl(207,72%,97%)] dark:bg-[hsl(207,72%,5%)]">
      <nav className="bg-[hsl(207,72%,30%)] text-white px-6 py-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 bg-white rounded-full p-1">
              <Image src="/afm_big_logo.png" alt="Logo" fill className="object-contain rounded-full" priority />
            </div>
            <div>
              <h1 className="text-sm font-bold leading-tight">House of Glory</h1>
              <p className="text-xs text-white/80">Home Cell Directory</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">Home</Button>
            </Link>
            <Link href="/form">
              <Button size="sm" className="bg-[hsl(50,70%,45%)] hover:bg-[hsl(50,70%,40%)] text-white border-0">
                Submit Info
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[hsl(207,72%,20%)] dark:text-white mb-3">
            Home Cell Directory
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Connect with a home cell near you. Find fellowship, prayer, and community.
          </p>
        </div>

        <div className="relative w-full max-w-md mx-auto mb-10">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or leader..."
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

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/4" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((cell) => (
              <Card key={cell.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Home className="h-5 w-5 text-[hsl(207,72%,30%)]" />
                    {cell.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                      <Users className="h-3 w-3" /> Leaders
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {cell.leaders.map((l: string, i: number) => (
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
                        {cell.contactNumbers.map((n: string, i: number) => (
                          <Badge key={i} variant="secondary" className="text-xs">{n}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="text-xs text-muted-foreground">{memberCounts[cell.id] || 0} members</span>
                    <Badge variant="default" className="bg-[hsl(50,70%,45%)] text-white text-xs">Active</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16">
            <Home className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No home cells found matching your search.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
