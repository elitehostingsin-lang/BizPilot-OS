"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronLeft, Book, FileText, Settings, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HelpPage() {
    const categories = [
        { icon: Zap, title: 'Getting Started', desc: 'Learn the basics of BizPilot OS.' },
        { icon: FileText, title: 'Invoicing', desc: 'Manage invoices and payments.' },
        { icon: Settings, title: 'Settings', desc: 'Configure your profile and tools.' },
        { icon: Shield, title: 'Security', desc: 'How we keep your data safe.' },
        { icon: Book, title: 'Guides', desc: 'In-depth tutorials for every tool.' },
    ];

    return (
        <div className="min-h-screen bg-white text-black selection:bg-black/5">
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to Home</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className="text-xl font-bold tracking-tight">BizPilot<span className="font-light">OS</span></span>
                    </div>
                </div>
            </header>

            <main className="pt-32 pb-20 px-6">
                <div className="max-w-5xl mx-auto space-y-16">
                    <div className="text-center space-y-8">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">Help Center</h1>
                        <div className="max-w-xl mx-auto relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors" />
                            <input
                                type="text"
                                placeholder="Search for articles, guides..."
                                className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:border-black transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((cat, idx) => {
                            const Icon = cat.icon;
                            return (
                                <motion.div
                                    key={idx}
                                    whileHover={{ y: -5 }}
                                    className="p-8 bg-gray-50 rounded-2xl border border-gray-200 space-y-4 hover:border-black transition-all cursor-pointer"
                                >
                                    <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                                        <Icon className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold">{cat.title}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{cat.desc}</p>
                                </motion.div>
                            );
                        })}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-10">
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold">Popular Articles</h2>
                            <ul className="space-y-4">
                                {['Setting up your customs domain', 'How to export Invoices to PDF', 'Managing your CRM leads', 'Configuring GST settings'].map((article, i) => (
                                    <li key={i}>
                                        <button className="text-gray-600 hover:text-black font-medium text-lg flex items-center gap-2 group">
                                            <FileText className="h-4 w-4 opacity-40" />
                                            {article}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-zinc-950 rounded-3xl p-10 text-white space-y-6">
                            <h2 className="text-2xl font-bold">Can't find what you need?</h2>
                            <p className="text-gray-400">Our support team is always here to help you solve any issues.</p>
                            <Link href="/support">
                                <Button className="bg-white text-black hover:bg-gray-200 font-bold rounded-xl mt-4">
                                    Contact Support
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
