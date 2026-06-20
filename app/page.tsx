import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Users, Heart, Church } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[hsl(207,72%,97%)] dark:bg-[hsl(207,72%,5%)]">
      {/* Navigation */}
      <nav className="bg-[hsl(207,72%,30%)] text-white px-6 py-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 bg-white rounded-full p-1">
              <Image src="/afm_big_logo.png" alt="House of Glory" fill className="object-contain rounded-full" priority />
            </div>
            <div>
              <h1 className="text-sm font-bold leading-tight">House of Glory</h1>
              <p className="text-xs text-white/80">AFM Church</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/login">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 hidden sm:inline-flex">
                Admin
              </Button>
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

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[hsl(207,72%,30%)] text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/afm_big_logo.png')] bg-center bg-no-repeat bg-contain" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-6 text-sm">
            <Church className="h-4 w-4 text-[hsl(50,70%,55%)]" />
            <span className="text-white/90">Apostolic Faith Mission</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Welcome to<br />
            <span className="text-[hsl(50,70%,55%)]">House of Glory</span>
          </h2>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8 leading-relaxed">
            The Glory of the present house will be greater than the Glory of the former house, says the Lord Almighty. And in this place I will grant peace, declares the Lord Almighty.
          </p>
          <p className="text-sm font-medium text-[hsl(50,70%,55%)] mb-10">
            Haggai 2:9
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/form">
              <Button size="lg" className="bg-[hsl(50,70%,45%)] hover:bg-[hsl(50,70%,40%)] text-white border-0 px-8">
                Submit Your Information
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 80L60 73.3C120 66.7 240 53.3 360 46.7C480 40 600 40 720 46.7C840 53.3 960 66.7 1080 70C1200 73.3 1320 66.7 1380 63.3L1440 60V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" fill="hsl(207,72%,97%)" className="dark:fill-[hsl(207,72%,5%)]" />
          </svg>
        </div>
      </section>

      {/* Pastor Welcome Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Pastor Image */}
          <div className="relative">
            <div className="relative w-full max-w-md mx-auto aspect-[4/5] rounded-2xl overflow-hidden bg-[hsl(207,72%,30%)]/10 border-4 border-[hsl(207,72%,30%)]/10 shadow-2xl">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                <div className="relative w-full h-full mb-4">
                  <Image
                    src="/Mr&Mrs Pastor.jpg"
                    alt="Pastor & Mam' Mbuyazi"
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-sm font-medium text-[hsl(207,72%,30%)] dark:text-white/70 mb-2">
                  Pastor & Mrs Mbuyazi
                </p>
                <div className="mt-6 w-16 h-1 bg-[hsl(50,70%,45%)] rounded-full" />
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[hsl(50,70%,45%)]/10 rounded-full blur-2xl" />
            <div className="absolute -top-4 -left-4 w-32 h-32 bg-[hsl(207,72%,30%)]/10 rounded-full blur-2xl" />
          </div>

          {/* Pastor Message */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-[hsl(50,70%,45%)]">
              <Heart className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">A Welcome from Our Pastor</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-[hsl(207,72%,20%)] dark:text-white">
              Welcome to AFM House of Glory!
            </h3>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
              <p>
                We are a family of believers passionate about worship, community, and growing in faith together. Whether you are new to church or looking for a place to call home, we invite you to join us and experience God's love and presence.
              </p>
              <p>
                Our church is built on the foundation of love, faith, and fellowship. We believe in creating a welcoming environment where everyone can grow spiritually and build meaningful relationships.
              </p>
              <p>
                We look forward to meeting you and walking this journey of faith together. May God bless you abundantly!
              </p>
            </div>
            <div className="pt-4 border-t border-border">
              <p className="font-semibold text-[hsl(207,72%,20%)] dark:text-white">
                Pastor T. Mbuyazi
              </p>
              <p className="text-sm text-muted-foreground">
                Senior Pastor, AFM House of Glory
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-[hsl(207,72%,30%)]/5 dark:bg-[hsl(207,72%,10%)] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-[hsl(207,72%,20%)] dark:text-white mb-4">
              What We Believe
            </h3>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Our faith is built on the solid foundation of God's Word and the guiding principles of love, community, and spiritual growth.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-[hsl(207,72%,8%)] rounded-xl p-8 shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[hsl(207,72%,30%)]/10 rounded-lg flex items-center justify-center mb-4">
                <Church className="h-6 w-6 text-[hsl(207,72%,30%)]" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Worship</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We gather together to glorify God through passionate worship, heartfelt praise, and the power of prayer.
              </p>
            </div>
            <div className="bg-white dark:bg-[hsl(207,72%,8%)] rounded-xl p-8 shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[hsl(50,70%,45%)]/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-[hsl(50,70%,45%)]" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Community</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We are a family that supports, encourages, and walks alongside each other through every season of life.
              </p>
            </div>
            <div className="bg-white dark:bg-[hsl(207,72%,8%)] rounded-xl p-8 shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[hsl(207,72%,30%)]/10 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-[hsl(207,72%,30%)]" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Faith & Growth</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We are committed to growing in our understanding of God's Word and deepening our personal relationship with Him.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 text-center">
        <div className="bg-[hsl(207,72%,30%)] rounded-2xl p-10 md:p-16 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-[url('/afm_big_logo.png')] bg-center bg-no-repeat bg-contain" />
          </div>
          <div className="relative">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Join Our Church Family
            </h3>
            <p className="text-white/80 max-w-xl mx-auto mb-8 leading-relaxed">
              We would love to get to know you better. Please share your information with us so we can stay connected and welcome you into our community.
            </p>
            <Link href="/form">
              <Button size="lg" className="bg-[hsl(50,70%,45%)] hover:bg-[hsl(50,70%,40%)] text-white border-0 px-8">
                Submit Your Information
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
