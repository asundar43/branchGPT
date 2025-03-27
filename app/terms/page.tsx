'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BrandIcon } from '@/components/icons'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="w-full p-6">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-white/90 font-bold text-xl tracking-tight flex items-center gap-2">
            <div className="text-white/80">
              <BrandIcon size={24} />
            </div>
            branchGPT
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-white hover:text-white/90 hover:bg-white/10 transition-colors">
                Login
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="outline" className="text-white hover:text-white/90 hover:bg-white/10 border-white/20 transition-colors">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-white/90">Terms of Service</h1>
          <div className="space-y-8 text-neutral-400">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white/80">Introduction</h2>
              <p className="mb-4">
                Welcome to BranchGPT. By accessing or using our service, you agree to be bound by these Terms of Service. Please read them carefully.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white/80">Definitions</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>&ldquo;Service&rdquo; refers to BranchGPT and its features</li>
                <li>&ldquo;User&rdquo; refers to any individual or entity using our Service</li>
                <li>&ldquo;Content&rdquo; includes all information, text, and materials available through the Service</li>
                <li>&ldquo;Account&rdquo; refers to your registered account with BranchGPT</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white/80">Account Terms</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>You must be 13 years or older to use this Service</li>
                <li>You must provide accurate and complete information when creating an account</li>
                <li>You are responsible for maintaining the security of your account</li>
                <li>You must notify us immediately of any unauthorized use of your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white/80">Service Rules</h2>
              <p className="mb-4">
                You agree not to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the Service for any illegal purposes</li>
                <li>Violate any intellectual property rights</li>
                <li>Attempt to access or use the Service in unauthorized ways</li>
                <li>Interfere with or disrupt the Service</li>
                <li>Share your account credentials with others</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white/80">Intellectual Property</h2>
              <p className="mb-4">
                The Service and its original content, features, and functionality are owned by Stride Laboratories, Inc. and are protected by international copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white/80">Termination</h2>
              <p className="mb-4">
                We reserve the right to terminate or suspend your account and access to the Service immediately, without prior notice, for any breach of these Terms of Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white/80">Limitation of Liability</h2>
              <p className="mb-4">
                BranchGPT and/or Stride Laboratories, Inc. shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white/80">Changes to Terms</h2>
              <p className="mb-4">
                We reserve the right to modify or replace these Terms at any time. We will notify you of any changes by posting the new Terms on this page and updating the &ldquo;Last Updated&rdquo; date.
              </p>
              <p className="text-sm text-neutral-500">Last Updated: March 23, 2025</p>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-40 pt-12 pb-8 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left side - Brand and copyright */}
            <div className="flex flex-col gap-4 items-center md:items-start">
              <div className="flex items-center gap-2.5">
                <div className="text-white/80">
                  <BrandIcon size={20} />
                </div>
                <span className="text-sm font-medium text-white/80">
                  branchGPT
                </span>
              </div>
              <div className="text-xs text-white/50">
                © 2025 Stride Laboratories, Inc.
              </div>
            </div>

            {/* Center - Creator credit */}
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="text-base md:text-lg font-medium text-white/90 text-center">
                An Aadhav Sundar Project
              </div>
              <div className="flex items-center gap-4">
                <a 
                  href="https://x.com/1Aadhav" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-white/90 transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a 
                  href="https://www.linkedin.com/in/aadhavsundar/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-white/90 transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Right side - Links and status */}
            <div className="flex flex-col items-center md:items-end gap-4">
              <div className="flex items-center gap-6 text-xs text-white/40">
                <Link href="/privacy" className="hover:text-white/90 transition-colors">
                  Privacy
                </Link>
                <Link href="/terms" className="hover:text-white/90 transition-colors">
                  Terms
                </Link>
                <a href="mailto:aadhav@stride-labs.com" className="hover:text-white/90 transition-colors">
                  Contact
                </a>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500/80" />
                <span className="text-xs text-white/40">All Systems Operational</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 