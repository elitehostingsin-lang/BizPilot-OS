"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Receipt,
  Users,
  CheckSquare,
  DollarSign,
  FileText,
  FileCheck,
  ClipboardList,
  Globe,
  Code,
  Lock,
  Check,
  ChevronRight,
  Mail,
  Phone,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FloatingPaths } from '@/components/ui/floating-paths';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-black selection:bg-black/5">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none">
              <path d="M20 80L50 20L80 50L65 50L50 35L35 65L50 65L65 80L20 80Z" fill="#000" />
            </svg>
            <span className="text-2xl font-bold tracking-tight">BizPilot<span className="font-light">OS</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#features" className="text-gray-600 hover:text-black transition-colors">Features</a>
            <a href="#benefits" className="text-gray-600 hover:text-black transition-colors">Benefits</a>
            <a href="#pricing" className="text-gray-600 hover:text-black transition-colors">Pricing</a>
            <Link href="/login">
              <button className="px-6 py-2.5 text-white bg-black rounded-lg hover:bg-gray-800 transition-all">
                Get Started
              </button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-20">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />

        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-green-700">100% Free Forever • No Credit Card Required</span>
            </div>

            <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tighter leading-[1.1]">
              {"Run Your Business".split(" ").map((word, wordIndex) => (
                <span key={wordIndex} className="inline-block mr-4 last:mr-0">
                  {word.split("").map((letter, letterIndex) => (
                    <motion.span
                      key={`${wordIndex}-${letterIndex}`}
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        delay: wordIndex * 0.1 + letterIndex * 0.03,
                        type: "spring",
                        stiffness: 150,
                        damping: 25,
                      }}
                      className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700/80"
                    >
                      {letter}
                    </motion.span>
                  ))}
                </span>
              ))}
              <br />
              {"Like a Pro".split(" ").map((word, wordIndex) => (
                <span key={wordIndex + 100} className="inline-block mr-4 last:mr-0">
                  {word.split("").map((letter, letterIndex) => (
                    <motion.span
                      key={`${wordIndex + 100}-${letterIndex}`}
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        delay: 0.3 + wordIndex * 0.1 + letterIndex * 0.03,
                        type: "spring",
                        stiffness: 150,
                        damping: 25,
                      }}
                      className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900"
                    >
                      {letter}
                    </motion.span>
                  ))}
                </span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              The complete toolkit for solopreneurs and small businesses. Manage clients, create invoices, track finances, and scale your business—all in one place.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="inline-block group relative bg-gradient-to-b from-black/10 to-white/10 p-px rounded-2xl backdrop-blur-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <Link href="/signup">
                <Button
                  className="rounded-[1.15rem] px-8 py-6 text-lg font-semibold backdrop-blur-md bg-black hover:bg-gray-800 text-white transition-all duration-300 group-hover:-translate-y-0.5 border border-black/10 hover:shadow-md"
                >
                  <span className="opacity-90 group-hover:opacity-100 transition-opacity">
                    Get Started Free
                  </span>
                  <span className="ml-3 opacity-70 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all duration-300">
                    →
                  </span>
                </Button>
              </Link>
            </motion.div>

            <div className="flex items-center justify-center gap-8 pt-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span>No credit card</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span>Free forever</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span>Setup in 2 minutes</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4 tracking-tight">Everything You Need</h2>
            <p className="text-xl text-gray-600">10 powerful tools • 100% Free • Forever</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Receipt, title: 'Invoices', desc: 'Create professional invoices with GST support' },
              { icon: Users, title: 'CRM', desc: 'Manage leads and client relationships effortlessly' },
              { icon: CheckSquare, title: 'Tasks', desc: 'Plan and track your work with kanban boards' },
              { icon: DollarSign, title: 'Finance', desc: 'Track income, expenses, and profit in real-time' },
              { icon: FileText, title: 'Content', desc: 'Pre-built templates for social media and emails' },
              { icon: FileCheck, title: 'Proposals', desc: 'Win more clients with professional proposals' },
              { icon: ClipboardList, title: 'Forms', desc: 'Custom forms for client onboarding' },
              { icon: Globe, title: 'Website Audit', desc: 'Analyze and improve client websites' },
              { icon: Code, title: 'Scripts', desc: 'Ready-to-use sales and follow-up scripts' },
              { icon: Lock, title: 'Vault', desc: 'Secure notes and knowledge base' },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="group p-8 bg-white rounded-2xl border border-gray-200 hover:border-black hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-24 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Stop Juggling Multiple Tools</h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Replace 10+ subscriptions with one powerful platform. Save time, money, and reduce complexity.
              </p>
              <div className="space-y-6">
                {[
                  { title: 'Save $500+/month', desc: 'Replace multiple expensive subscriptions' },
                  { title: 'Save 10 hours/week', desc: 'No more switching between different apps' },
                  { title: 'One unified workflow', desc: 'Everything syncs automatically' },
                  { title: 'Professional results', desc: 'Look bigger than you are' },
                ].map((benefit, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="flex gap-5"
                  >
                    <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center flex-shrink-0 text-white shadow-sm">
                      <Check className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-1">{benefit.title}</h4>
                      <p className="text-gray-600 leading-relaxed">{benefit.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="bg-zinc-950 rounded-[2rem] p-10 md:p-16 text-white shadow-2xl relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -z-10" />
              <h3 className="text-3xl font-bold mb-10 border-b border-white/10 pb-6 uppercase tracking-widest text-sm text-gray-400">What You Get</h3>
              <div className="grid grid-cols-1 gap-5">
                {[
                  'Unlimited invoices & proposals',
                  'Unlimited CRM contacts',
                  'Unlimited tasks & projects',
                  'Financial tracking & reports',
                  'Content templates library',
                  'Website audit tools',
                  'Sales scripts & guides',
                  'Secure vault storage',
                  'Priority support',
                  'Regular updates & new features',
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.3 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-4 group"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-primary group-hover:scale-150 transition-transform" />
                    <span className="text-lg md:text-xl font-medium tracking-tight opacity-90 group-hover:opacity-100 transition-opacity">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 bg-gray-50 text-center">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 tracking-tight">100% Free Access</h2>
            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">All features. All tools. Completely free. Forever.</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="p-12 md:p-16 rounded-[2.5rem] border border-gray-100 bg-white shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-black" />
              <div className="mb-10 space-y-4">
                <div className="inline-flex items-center gap-2 px-6 py-2 bg-black text-white rounded-full font-bold text-xs uppercase tracking-widest">
                  Limited Time Offer
                </div>
                <h3 className="text-3xl font-bold">Free Forever Plan</h3>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-6xl font-black tracking-tighter">$0</span>
                  <span className="text-gray-400 font-medium">/forever</span>
                </div>
                <p className="text-gray-500 text-lg">Everything included. No hidden fees. No upgrades needed.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 text-left">
                {[
                  'Unlimited invoices & proposals',
                  'Unlimited CRM leads',
                  'Unlimited tasks & projects',
                  'Financial tracking',
                  'All content templates',
                  'Website audit tools',
                  'Sales scripts library',
                  'Secure vault storage',
                  'Form builder UI',
                  'Community support',
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-gray-400" />
                    <span className="text-base font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <Link href="/signup">
                <button
                  className="w-full py-5 bg-black text-white rounded-2xl font-bold text-xl hover:bg-gray-800 transition-all shadow-xl hover:-translate-y-1 active:scale-95"
                >
                  Join Direct Access Now →
                </button>
              </Link>

              <p className="text-sm text-gray-400 mt-8 font-medium italic">
                No credit card required • Cancel anytime • 2-minute setup
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 bg-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none">Ready to Scale?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Join 1,000+ entrepreneurs who trust BizPilot OS to run their business.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/signup">
              <button
                className="group px-12 py-6 text-xl font-bold text-white bg-black rounded-2xl hover:bg-gray-800 transition-all shadow-2xl inline-flex items-center gap-3 relative overflow-hidden"
              >
                <span className="relative z-10">Get Started Free</span>
                <ChevronRight className="relative z-10 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-zinc-800 to-black bg-[length:200%_100%] animate-shimmer" />
              </button>
            </Link>
          </motion.div>
          <p className="text-sm text-gray-400 font-medium">100% Free Forever • No Hidden Fees</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-950 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20 border-b border-white/5 pb-20">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none">
                  <path d="M20 80L50 20L80 50L65 50L50 35L35 65L50 65L65 80L20 80Z" fill="#fff" />
                </svg>
                <span className="text-2xl font-bold tracking-tight">BizPilot<span className="font-light">OS</span></span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                The complete business operating system for solopreneurs and small businesses. Manage everything from one powerful platform.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-8 uppercase tracking-widest text-xs opacity-50">Tools</h4>
              <ul className="space-y-5 text-gray-400 font-medium">
                <li><a href="#features" className="hover:text-white transition-colors">All Features</a></li>
                <li><a href="#benefits" className="hover:text-white transition-colors">Benefits</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-8 uppercase tracking-widest text-xs opacity-50">Support</h4>
              <ul className="space-y-5 text-gray-400 font-medium">
                <li><Link href="/support" className="hover:text-white transition-colors">Email Support</Link></li>
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:row items-center justify-between gap-6">
            <p className="text-gray-500 text-sm font-medium">
              © 2024 BizPilot OS. All rights reserved. Built for creators.
            </p>
            <div className="flex gap-10 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
              <span className="text-xs font-black tracking-widest uppercase">Verified Secure</span>
              <span className="text-xs font-black tracking-widest uppercase">Global Cloud</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
