'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import './styles.css'
import { BrandIcon } from '@/components/icons'

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Animated background */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-neutral-900 opacity-90" />
        <div className="absolute top-0 left-0 w-full h-full">
          {/* Animated branch lines */}
          <svg className="w-full h-full opacity-50" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Main branch */}
            <path 
              className="animate-dash-15s stroke-[0.4] stroke-blue-500/50" 
              d="M20,50 L40,50 Q45,50 45,45 L45,30 Q45,25 50,25 L80,25" 
              fill="none" 
              strokeLinecap="round"
              strokeDasharray="0.5 2"
              pathLength="1"
            />
            {/* Branch 1 */}
            <path 
              className="animate-dash-20s stroke-[0.4] stroke-purple-500/50" 
              d="M20,50 L40,50 Q45,50 45,55 L45,70 Q45,75 50,75 L80,75" 
              fill="none" 
              strokeLinecap="round"
              strokeDasharray="0.5 2"
              pathLength="1"
            />
            {/* Branch 2 */}
            <path 
              className="animate-dash-25s stroke-[0.4] stroke-pink-500/50" 
              d="M45,50 L60,50 Q65,50 65,45 L65,35 Q65,30 70,30 L80,30" 
              fill="none" 
              strokeLinecap="round"
              strokeDasharray="0.5 2"
              pathLength="1"
            />
            {/* Branch 3 */}
            <path 
              className="animate-dash-30s stroke-[0.4] stroke-emerald-500/50" 
              d="M45,50 L60,50 Q65,50 65,55 L65,65 Q65,70 70,70 L80,70" 
              fill="none" 
              strokeLinecap="round"
              strokeDasharray="0.5 2"
              pathLength="1"
            />
          </svg>
        </div>
        {/* Gradient orbs */}
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-1/3 -right-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Navigation */}
      <nav className="fixed w-full p-6 z-50 mix-blend-difference">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white/90 font-bold text-xl tracking-tight flex items-center gap-2">
            <BrandIcon size={24} />
            branchGPT
          </div>
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

      {/* Hero Section */}
      <div className="relative container mx-auto px-4 pt-32 pb-16 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative">
            <h1 className="text-4xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/80 tracking-tight">
              Branch Your AI Conversations
            </h1>
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full filter blur-2xl opacity-20" />
          </div>
          <p className="text-xl mb-12 text-neutral-400 leading-relaxed max-w-2xl mx-auto">
            Experience the future of AI conversations. BranchGPT helps you explore multiple paths simultaneously, 
            making complex problem-solving and creative exploration more efficient than ever.
          </p>
          <div className="flex items-center justify-center">
            <div className="inline-flex flex-col items-center">
              <Link href="/auth/register">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90 transition-all px-8 py-6 text-lg rounded-2xl relative overflow-hidden group shadow-lg shadow-purple-500/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-200%] animate-shine-fast" />
                  Start Free Trial
                </Button>
              </Link>
              <span className="text-neutral-400 text-sm mt-2">No credit card required</span>
            </div>
          </div>

          {/* Social Proof */}
          <div className="mt-16 flex flex-col items-center gap-8">
            <div className="flex items-center gap-2 text-white/80">
              <div className="flex -space-x-2">
                <img 
                  src="/images/matt.jpeg" 
                  alt="Matt Steele"
                  className="w-8 h-8 rounded-full object-cover border-2 border-black"
                />
                <img 
                  src="/images/rohan.jpeg" 
                  alt="Rohan Mathur"
                  className="w-8 h-8 rounded-full object-cover border-2 border-black"
                />
                <img 
                  src="/images/krishna.jpeg" 
                  alt="Krishna Suresh"
                  className="w-8 h-8 rounded-full object-cover border-2 border-black"
                />
              </div>
              <span>Join 10,000+ users already branching their conversations</span>
            </div>
            <div className="flex items-center gap-4 text-white/80">
              <div className="flex items-center gap-1">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>4.9/5</span>
              </div>
              <span>•</span>
              <span>Trusted by developers, researchers, and creatives</span>
            </div>
          </div>

          {/* Demo Video Section */}
          <div id="demo" className="mt-16 relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur opacity-20" />
            <div className="relative rounded-3xl overflow-hidden bg-black/50 backdrop-blur-sm border border-white/10">
              <video 
                className="w-full rounded-3xl"
                controls
                autoPlay
                muted
                loop
                playsInline
              >
                <source src="/images/branchGPTdemo.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-40 grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Branch Conversations",
              description: "Create multiple conversation paths from any point, exploring different directions simultaneously.",
              icon: "🌳"
            },
            {
              title: "Never Lose Context",
              description: "Keep your conversation history organized with our intuitive branching system.",
              icon: "🧠"
            },
            {
              title: "Efficient Exploration",
              description: "Compare different approaches side by side to find the perfect solution.",
              icon: "⚡"
            }
          ].map((feature, i) => (
            <div key={i} className="group p-8 rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all duration-300">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-500" />
                <div className="relative flex items-center gap-3">
                  <span className="text-2xl">{feature.icon}</span>
                  <h3 className="text-xl font-semibold text-white/90">{feature.title}</h3>
                </div>
              </div>
              <p className="text-neutral-400 mt-4">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Comparison Section */}
        <div className="mt-40">
          <h2 className="text-3xl font-bold text-center mb-12 text-white/90">Why Choose BranchGPT?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10">
              <h3 className="text-xl font-semibold mb-4 text-white/90">Traditional AI Chat</h3>
              <ul className="space-y-3 text-neutral-400">
                <li className="flex items-center gap-2">
                  <span className="text-red-500">✕</span>
                  Linear conversation flow
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500">✕</span>
                  Limited exploration options
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500">✕</span>
                  Context loss when switching topics
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500">✕</span>
                  No way to compare approaches
                </li>
              </ul>
            </div>
            <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-lg border border-white/20">
              <h3 className="text-xl font-semibold mb-4 text-white/90">BranchGPT</h3>
              <ul className="space-y-3 text-neutral-400">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Multiple conversation paths
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Unlimited exploration
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Maintain context across branches
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Compare solutions side by side
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-40">
          <h2 className="text-3xl font-bold text-center mb-12 text-white/90">What Our Users Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "BranchGPT cut my debugging time in half. I can explore multiple solutions at once and quickly find the best approach.",
                author: "Matt Steele",
                role: "Software Engineer at Microsoft",
                avatar: "/images/matt.jpeg"
              },
              {
                quote: "Perfect for managing complex projects. I can track different stakeholder requirements and project scenarios all in one place.",
                author: "Rohan Mathur",
                role: "Project Manager at Epic",
                avatar: "/images/rohan.jpeg"
              },
              {
                quote: "Game-changer for security planning. We model multiple threat scenarios simultaneously, making our response strategies more robust.",
                author: "Krishna Suresh",
                role: "Co-founder at VigilAI",
                avatar: "/images/krishna.jpeg"
              }
            ].map((testimonial, i) => (
              <div key={i} className="p-8 rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10">
                <div className="flex items-center gap-4 mb-6">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.author}
                    className="w-10 h-10 rounded-full object-cover border border-white/10"
                  />
                  <div>
                    <p className="text-white/90 font-medium">{testimonial.author}</p>
                    <p className="text-neutral-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-neutral-400">&ldquo;{testimonial.quote}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-40">
          <h2 className="text-3xl font-bold text-center mb-12 text-white/90">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "How does branching work?",
                answer: "When you're in a conversation, you can create a new branch at any point to explore a different direction. Each branch maintains its own context while preserving the original conversation flow."
              },
              {
                question: "What AI models are available?",
                answer: "We offer a comprehensive suite of top AI models including o3-mini-high, GPT 4.5, Grok 2, Sonar Pro, Sonar Deep Research, and more. You can choose the best model for your specific needs or compare responses across different models."
              },
              {
                question: "Can I collaborate with others?",
                answer: "Yes! You can share your branched conversations with team members, allowing for collaborative problem-solving and brainstorming sessions."
              },
              {
                question: "How do I get started?",
                answer: "Simply sign up for an account, and you'll be able to start branching conversations immediately. Our intuitive interface makes it easy to explore multiple conversation paths."
              }
            ].map((faq, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10">
                <h3 className="text-lg font-semibold mb-2 text-white/90">{faq.question}</h3>
                <p className="text-neutral-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-40 text-center">
          <h2 className="text-3xl font-bold mb-6 text-white/90">Ready to Transform Your AI Conversations?</h2>
          <p className="text-xl mb-8 text-neutral-400 max-w-2xl mx-auto">
            Join thousands of users who are already experiencing the future of AI conversations.
          </p>
          <div className="flex items-center justify-center">
            <div className="inline-flex flex-col items-center">
              <Link href="/auth/register">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90 transition-all px-8 py-6 text-lg rounded-2xl relative overflow-hidden group shadow-lg shadow-purple-500/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-200%] animate-shine-fast" />
                  Get Started Now
                </Button>
              </Link>
              <span className="text-neutral-400 text-sm mt-2">No credit card required</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 