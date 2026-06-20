'use client';

import { MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[hsl(207,72%,15%)] text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Church Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 bg-white rounded-full p-1">
                <Image
                  src="/afm_big_logo.png"
                  alt="AFM House of Glory"
                  fill
                  className="object-contain rounded-full"
                />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight">AFM House of Glory Church</h3>
              </div>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              A place of worship, community, and spiritual growth. Join us as we walk together in faith.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-[hsl(50,70%,55%)]">Quick Links</h4>
            <ul className="space-y-2.5">
              {['Home', 'Contact', 'Privacy Policy'].map((link) => (
                <li key={link}>
                  <Link
                    href={link === 'Home' ? '/' : '#'}
                    className="text-sm text-white/70 hover:text-[hsl(50,70%,55%)] transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Times */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-[hsl(50,70%,55%)]">Service Times</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-[hsl(50,70%,55%)] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Sunday Service</p>
                  <p className="text-xs text-white/60">9:00 AM - 11:30 AM</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-[hsl(50,70%,55%)] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Tuesday Prayer</p>
                  <p className="text-xs text-white/60">17:30 PM - 18:30 PM</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-[hsl(50,70%,55%)] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Youth Service</p>
                  <p className="text-xs text-white/60">Friday, 18:00 PM - 20:00 PM</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-[hsl(50,70%,55%)]">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-[hsl(50,70%,55%)] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm">27 Koos Pootgiter Rd</p>
                  <p className="text-sm text-white/60">Pietermaritzburg, 3201</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-[hsl(50,70%,55%)] mt-0.5 shrink-0" />
                <p className="text-sm">(123) 456-7890</p>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-[hsl(50,70%,55%)] mt-0.5 shrink-0" />
                <p className="text-sm">afmhogpmb@gmail.com</p>
              </li>
            </ul>
            <div className="pt-2">
              <p className="text-xs font-medium text-white/60 mb-1">Our Location</p>
              <p className="text-sm">AFM House of Glory</p>
              <p className="text-xs text-white/50">Pietermaritzburg, South Africa</p>
              <a
                href="https://www.bing.com/maps?q=27+Koos+Pootgiter+Rd+Pietermaritzburg"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[hsl(50,70%,55%)] hover:underline mt-1"
              >
                View on Bing Maps
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/50">
            &copy; 2026 AFM House of Glory Church. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-xs text-white/50 hover:text-white/80 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-xs text-white/50 hover:text-white/80 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
