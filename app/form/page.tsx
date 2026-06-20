import Image from 'next/image';
import SubmissionForm from '../submission-form';
import Link from 'next/link';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function FormPage() {
  return (
    <div className="min-h-screen bg-[hsl(207,72%,97%)] dark:bg-[hsl(207,72%,5%)]">
      <header className="bg-[hsl(207,72%,30%)] text-white px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 bg-white rounded-full p-1">
              <Image src="/afm_big_logo.png" alt="House of Glory" fill className="object-contain rounded-full" priority />
            </div>
            <div>
              <h1 className="text-sm font-bold leading-tight">House of Glory</h1>
              <p className="text-xs text-white/80">Data Collection</p>
            </div>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </Link>
        </div>
      </header>
      <main className="max-w-4xl mx-auto p-4 md:p-6">
        <SubmissionForm />
      </main>
      <Footer />
    </div>
  );
}
