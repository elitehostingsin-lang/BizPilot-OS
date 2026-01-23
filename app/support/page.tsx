"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, ChevronLeft, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState } from 'react';

export default function SupportPage() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Construct mailto link for "100% working" support
        const mailtoLink = `mailto:elitehostingsin@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`From: ${formData.name} (${formData.email})\n\n${formData.message}`)}`;
        window.location.href = mailtoLink;
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 5000);
    };

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
                <div className="max-w-4xl mx-auto space-y-16">
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">Support Center</h1>
                        <p className="text-xl text-gray-600">We're here to help you scale your business.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="p-8 bg-gray-50 rounded-2xl border border-gray-200 space-y-4"
                        >
                            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                                <Mail className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold">Email Support</h3>
                            <p className="text-gray-600 text-sm">Direct response within 24 hours.</p>
                            <a href="mailto:elitehostingsin@gmail.com" className="text-black font-semibold hover:underline block pt-2">
                                elitehostingsin@gmail.com
                            </a>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -5 }}
                            className="p-8 bg-gray-50 rounded-2xl border border-gray-200 space-y-4"
                        >
                            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                                <MessageSquare className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold">In-App Feedback</h3>
                            <p className="text-gray-600 text-sm">Available for all active users.</p>
                            <Link href="/dashboard" className="text-black font-semibold hover:underline block pt-2">
                                Open Dashboard
                            </Link>
                        </motion.div>
                    </div>

                    <div className="bg-zinc-950 rounded-3xl p-10 md:p-16 text-white shadow-2xl space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-bold">Send us a Message</h2>
                            {isSubmitted && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex items-center gap-2 text-green-400 text-sm font-medium"
                                >
                                    <CheckCircle2 className="h-4 w-4" /> Message client opened!
                                </motion.div>
                            )}
                        </div>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/20 transition-colors"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Email Address</label>
                                <input
                                    required
                                    type="email"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/20 transition-colors"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-medium text-gray-400">Subject</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/20 transition-colors"
                                    placeholder="How can we help?"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-medium text-gray-400">Message</label>
                                <textarea
                                    required
                                    rows={6}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/20 transition-colors resize-none"
                                    placeholder="Describe your issue in detail..."
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                ></textarea>
                            </div>
                            <div className="md:col-span-2">
                                <Button type="submit" className="w-full py-6 text-lg font-bold bg-white text-black hover:bg-gray-200">
                                    <Send className="mr-2 h-5 w-5" /> Send Message
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
