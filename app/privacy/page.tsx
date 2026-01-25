"use client";

import React from 'react';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
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
                <div className="max-w-3xl mx-auto prose prose-zinc">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">Privacy Policy</h1>
                    <p className="text-gray-600 mb-8 italic">Last updated: January 21, 2024</p>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold mt-10">1. Information We Collect</h2>
                        <p className="text-gray-600 leading-relaxed">
                            We collect information that you provide directly to us when you create an account, use our tools, or communicate with us. This includes your name, email address, company details, and any business data you input into the OS.
                        </p>

                        <h2 className="text-2xl font-bold mt-10">2. How We Use Your Information</h2>
                        <p className="text-gray-600 leading-relaxed">
                            We use the information we collect to operate, maintain, and improve our services, to communicate with you, and to protect the security of our platform and users.
                        </p>

                        <h2 className="text-2xl font-bold mt-10">3. Data Security</h2>
                        <p className="text-gray-600 leading-relaxed">
                            We take reasonable measures to protect the information that we collect from or about you from unauthorized access, use, or disclosure. However, no method of transmitting information over the Internet or storing information is completely secure.
                        </p>

                        <h2 className="text-2xl font-bold mt-10">4. Sharing Your Information</h2>
                        <p className="text-gray-600 leading-relaxed">
                            We do not share your personal information with third parties except as described in this Privacy Policy, such as with your consent or when required by law.
                        </p>

                        <h2 className="text-2xl font-bold mt-10">5. Cookies</h2>
                        <p className="text-gray-600 leading-relaxed">
                            We may use cookies and similar technologies to collect information about your activities on our website to enhance your user experience.
                        </p>

                        <h2 className="text-2xl font-bold mt-10">6. Your Choices</h2>
                        <p className="text-gray-600 leading-relaxed">
                            You can access, update, or delete your account information at any time by logging into your account settings. You may also contact us for assistance with your data.
                        </p>
                        <h2 className="text-2xl font-bold mt-10">7. Refund Policy</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Please note that BizPilot OS operates on a **No Refund** policy. We provide a comprehensive 30-day free trial to ensure our tools meet your needs before you commit to a paid plan.
                        </p>

                        <h2 className="text-2xl font-bold mt-10">8. Payment Information</h2>
                        <p className="text-gray-600 leading-relaxed">
                            We do not store your credit card information on our servers. All payments are processed by **Dodo Payments**, our secure payment partner. Dodo Payments provides us with certain limited information to confirm your subscription status.
                        </p>

                        <h2 className="text-2xl font-bold mt-10">9. Data Transparency</h2>
                        <p className="text-gray-600 leading-relaxed">
                            We are committed to transparency regarding how your data is handled. You can request a copy of your stored data or ask for its deletion at any time through your account settings or by contacting support.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
}
