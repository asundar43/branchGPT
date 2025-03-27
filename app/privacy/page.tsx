'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BrandIcon } from '@/components/icons'

export default function PrivacyPage() {
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
          <h1 className="text-4xl font-bold mb-8 text-white/90">Privacy Policy</h1>
          <div className="space-y-8 text-neutral-400">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white/80">Introduction</h2>
              <p className="mb-4">
                At BranchGPT, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white/80">Information We Collect</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Account information (email, name, profile picture)</li>
                <li>Conversation data and branching history</li>
                <li>Usage analytics and interaction patterns</li>
                <li>Technical information (IP address, browser type, device info)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white/80">How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To provide and maintain our service</li>
                <li>To improve user experience and develop new features</li>
                <li>To analyze usage patterns and optimize performance</li>
                <li>To communicate with you about service updates</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white/80">Data Security</h2>
              <p className="mb-4">
                We implement industry-standard security measures to protect your data. All conversations are encrypted, and we regularly audit our systems for potential vulnerabilities.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white/80">Data Sharing</h2>
              <p className="mb-4">
                We do not sell your personal information. We may share data with trusted service providers who assist in operating our service, subject to confidentiality obligations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white/80">Your Rights</h2>
              <p className="mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Export your data</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white/80">Contact Us</h2>
              <p className="mb-4">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p className="text-white/80">aadhav@stride-labs.com</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white/80">Updates to This Policy</h2>
              <p className="mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &ldquo;Last Updated&rdquo; date.
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