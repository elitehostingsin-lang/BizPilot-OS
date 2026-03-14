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
  MessageSquare,
  Linkedin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import ShaderBackground from '@/components/ui/shader-background';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none">
              <path d="M20 80L50 20L80 50L65 50L50 35L35 65L50 65L65 80L20 80Z" fill="currentColor" />
            </svg>
            <span className="text-2xl font-bold tracking-tight">BizPilot<span className="font-light">OS</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#benefits" className="text-muted-foreground hover:text-foreground transition-colors">Benefits</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <Link href="/login">
              <button className="px-6 py-2.5 text-primary-foreground bg-primary rounded-lg hover:opacity-90 transition-all font-semibold">
                Get Started
              </button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-20 dark">
        <ShaderBackground />

        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full border border-primary/10 backdrop-blur-sm">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-sm font-medium text-primary tracking-wide">100% FREE LIFETIME ACCESS • NO CREDIT CARD REQUIRED</span>
            </div>

            <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tighter leading-[1.1]">
              {"Run Your Business".split(" ").map((word, wordIndex) => (
                <span key={wordIndex} className="inline-block mr-4 last:mr-0">
                  {word.split("").map((letter, letterIndex) => (
                    <motion.span
                      key={`${wordIndex}-${letterIndex}`}
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        delay: wordIndex * 0.1 + letterIndex * 0.03,
                        type: "spring",
                        stiffness: 100,
                        damping: 20,
                      }}
                      className="inline-block text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/70"
                    >
                      {letter}
                    </motion.span>
                  ))}
                </span>
              ))}
              <br />
              <span className="text-primary italic">Like a Pro</span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              The complete toolkit for solopreneurs and small businesses. Manage clients, create invoices, track finances, and scale your business—all in one unified operating system.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Link href="/signup">
                <Button
                  size="lg"
                  className="rounded-xl px-10 py-7 text-lg font-bold bg-primary text-primary-foreground hover:opacity-90 shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  Get Lifetime Access →
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-xl px-10 py-7 text-lg font-bold border-border backdrop-blur-md bg-transparent hover:bg-muted/10 transition-all duration-300"
                >
                  Explore Features
                </Button>
              </Link>
            </motion.div>

            <div className="flex flex-wrap items-center justify-center gap-8 pt-8 text-sm text-muted-foreground font-medium">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Unlimited Features</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>referral-based Activation</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>No Hidden Costs</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4 tracking-tight md:text-5xl">Everything You Need to Scale</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Replace 10+ disjointed apps with one unified dashboard designed for speed.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Receipt, title: 'Invoices', desc: 'Create professional invoices with GST support and automated tracking.' },
              { icon: Users, title: 'CRM', desc: 'Manage leads and client relationships effortlessly in one central hub.' },
              { icon: CheckSquare, title: 'Tasks', desc: 'Plan and track your work with high-performance kanban boards.' },
              { icon: DollarSign, title: 'Finance', desc: 'Track income, expenses, and real-time profit margins across currencies.' },
              { icon: FileText, title: 'Content', desc: 'Pre-built templates for high-converting social media and email copy.' },
              { icon: FileCheck, title: 'Proposals', desc: 'Win more clients with professional, high-fidelity business proposals.' },
              { icon: ClipboardList, title: 'Forms', desc: 'Custom feedback and onboarding forms that sync directly to your CRM.' },
              { icon: Globe, title: 'Website Audit', desc: 'Analyze and improve client websites with actionable SEO insights.' },
              { icon: Code, title: 'Scripts', desc: 'Ready-to-use sales and follow-up scripts for every business scenario.' },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="group p-8 bg-card rounded-2xl border border-border hover:border-primary/50 hover:shadow-2xl transition-all duration-500"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-24 px-6 bg-background overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Stop Juggling Multiple Tools</h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Replace 10+ subscriptions with one powerful platform. Save time, money, and reduce complexity. Join the new era of business automation.
              </p>
              <div className="space-y-6">
                {[
                  { title: 'Save $500+/month', desc: 'Replace multiple expensive subscriptions with one free tool.' },
                  { title: 'Save 10 hours/week', desc: 'No more switching between different apps or syncing data manually.' },
                  { title: 'One Unified Workflow', desc: 'Updates in your CRM immediately reflect in tasks and finances.' },
                  { title: 'Professional Results', desc: 'Deliver a high-end experience to your clients that builds trust.' },
                ].map((benefit, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="flex gap-5"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0 text-primary-foreground shadow-lg">
                      <Check className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-1">{benefit.title}</h4>
                      <p className="text-muted-foreground leading-relaxed">{benefit.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/10 rounded-[2rem] p-10 md:p-16 text-foreground shadow-2xl relative overflow-hidden backdrop-blur-3xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -z-10" />
              <h3 className="text-3xl font-bold mb-10 border-b border-border pb-6 uppercase tracking-widest text-xs text-muted-foreground">What You Get</h3>
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
                  'Priority referral-based support',
                  'Lifetime free updates',
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.3 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-4 group"
                  >
                    <div className="h-2 w-2 rounded-full bg-primary group-hover:scale-150 transition-transform" />
                    <span className="text-lg md:text-xl font-bold tracking-tight opacity-90 group-hover:opacity-100 transition-opacity">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 tracking-tight md:text-5xl">Unlock Lifetime Free Access</h2>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">Growth through community. Share once, use forever.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { id: 'basic', name: 'Solopreneur', price: 'Free', desc: 'Everything for solo success', features: ['Unlimited Invoices', 'CRM Suite', 'Kanban Tasks', 'Basic Analytics'] },
              { id: 'standard', name: 'BizPilot Pro', price: 'Free', desc: 'Our most powerful setup', features: ['Website Audit Tool', 'Content Builder', 'Proposal Suite', 'Finance Tracking'], popular: true },
              { id: 'premium', name: 'Team OS', price: 'Free', desc: 'For growing agencies', features: ['Multi-user Access', 'White-labeling', 'API Sandbox', 'Priority Support'] },
            ].map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className={`p-10 rounded-[2.5rem] border ${plan.popular ? 'border-primary bg-card shadow-2xl scale-105 z-10' : 'border-border bg-card/50'} relative overflow-hidden group flex flex-col`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 px-6 py-2 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest rounded-bl-2xl">
                    Most Popular
                  </div>
                )}
                <div className="mb-8 space-y-2">
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm font-medium">{plan.desc}</p>
                </div>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-5xl font-black tracking-tighter">Free</span>
                  <span className="text-muted-foreground font-bold">LIFETIME</span>
                </div>

                <ul className="space-y-4 mb-10 flex-1">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <Check className={`h-5 w-5 ${plan.popular ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className="text-foreground font-semibold">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/signup">
                  <button
                    className={`w-full py-5 rounded-2xl font-bold text-lg transition-all shadow-lg active:scale-95 ${plan.popular ? 'bg-primary text-primary-foreground hover:opacity-90' : 'bg-muted text-foreground hover:bg-muted/80'}`}
                  >
                    Unlock Now →
                  </button>
                </Link>
                <p className="mt-4 text-center text-xs text-muted-foreground font-bold uppercase tracking-wider">Requires 2 Social Shares</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 bg-background relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-none">Ready to Take Control?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
            Join 1,000+ entrepreneurs who trust BizPilot OS. Unlock 100% free lifetime access by sharing the platform today.
          </p>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link href="/signup">
              <button
                className="group px-12 py-7 text-xl font-bold text-primary-foreground bg-primary rounded-2xl hover:opacity-90 transition-all shadow-2xl inline-flex items-center gap-3 relative overflow-hidden"
              >
                <span className="relative z-10">Get Your Free OS Now</span>
                <ChevronRight className="relative z-10 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary bg-[length:200%_100%] animate-shimmer" />
              </button>
            </Link>
          </motion.div>
          <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">Share on 2 platforms to unlock instantly.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20 border-b border-primary-foreground/10 pb-20">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none">
                  <path d="M20 80L50 20L80 50L65 50L50 35L35 65L50 65L65 80L20 80Z" fill="currentColor" />
                </svg>
                <span className="text-2xl font-bold tracking-tight">BizPilot<span className="font-light">OS</span></span>
              </div>
              <p className="text-primary-foreground/70 leading-relaxed font-medium">
                The ultimate business operating system for solopreneurs. Built for speed, precision, and growth.
              </p>
              <div className="flex flex-col gap-3 pt-2">
                <a
                  href="https://www.linkedin.com/in/jaimin-bhatt-150268264"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm font-bold"
                >
                  <Linkedin className="h-4 w-4" />
                  Connect with Founder
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-sm mb-8 uppercase tracking-widest opacity-60">Company</h4>
              <ul className="space-y-5 text-primary-foreground/80 font-bold">
                <li><a href="#features" className="hover:text-primary-foreground transition-colors">Features</a></li>
                <li><a href="#benefits" className="hover:text-primary-foreground transition-colors">Benefits</a></li>
                <li><a href="#pricing" className="hover:text-primary-foreground transition-colors">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm mb-8 uppercase tracking-widest opacity-60">Resources</h4>
              <ul className="space-y-5 text-primary-foreground/80 font-bold">
                <li><Link href="/blog" className="hover:text-primary-foreground transition-colors">Journal</Link></li>
                <li><Link href="/support" className="hover:text-primary-foreground transition-colors">Documentation</Link></li>
                <li><Link href="/help" className="hover:text-primary-foreground transition-colors">Help Center</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm mb-8 uppercase tracking-widest opacity-60">Legal</h4>
              <ul className="space-y-5 text-primary-foreground/80 font-bold">
                <li><Link href="/privacy" className="hover:text-primary-foreground transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-primary-foreground transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:row items-center justify-between gap-6 opacity-60">
            <p className="text-sm font-bold tracking-tight text-center md:text-left">
              © 2026 BizPilot OS. All Rights Reserved. Powered by Innovation.
            </p>
            <div className="flex gap-10 items-center">
              <span className="text-xs font-black tracking-widest uppercase">Verified Secure</span>
              <span className="text-xs font-black tracking-widest uppercase">Global Cloud Infrastructure</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
