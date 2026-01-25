"use client";

import React from 'react';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
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
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">Terms of Service</h1>
                    <p className="text-gray-600 mb-8 italic">Last updated: January 21, 2024</p>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold mt-10">1. Acceptance of Terms</h2>
                        <p className="text-gray-600 leading-relaxed">
                            By accessing or using BizPilot OS, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                        </p>

                        <h2 className="text-2xl font-bold mt-10">2. Use License</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Permission is granted to temporarily download one copy of the materials (information or software) on BizPilot OS's website for personal, non-commercial transitory viewing only.
                        </p>

                        <h2 className="text-2xl font-bold mt-10">3. Disclaimer</h2>
                        <p className="text-gray-600 leading-relaxed">
                            The materials on BizPilot OS's website are provided on an 'as is' basis. BizPilot OS makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                        </p>

                        <h2 className="text-2xl font-bold mt-10">4. Limitations</h2>
                        <p className="text-gray-600 leading-relaxed">
                            In no event shall BizPilot OS or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on BizPilot OS's website.
                        </p>

                        <h2 className="text-2xl font-bold mt-10">5. Accuracy of Materials</h2>
                        <p className="text-gray-600 leading-relaxed">
                            The materials appearing on BizPilot OS's website could include technical, typographical, or photographic errors. BizPilot OS does not warrant that any of the materials on its website are accurate, complete or current.
                        </p>

                        <h2 className="text-2xl font-bold mt-10">6. Governing Law</h2>
                        <p className="text-gray-600 leading-relaxed">
                            These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
                        </p>
                        <h2 className="text-2xl font-bold mt-10 text-destructive">7. Cancellation & Refund Policy</h2>
                        <p className="text-gray-600 leading-relaxed">
                            We offer a 30-day free trial (Founder's Beta Pass) to all new users to fully evaluate our services before any charges are applied. Due to the digital nature of our products and the availability of this evaluation period, **we do not offer refunds** once a paid subscription has been initiated. You may cancel your subscription at any time to prevent future charges, but previous payments are non-refundable.
                        </p>

                        <h2 className="text-2xl font-bold mt-10">8. Subscription Management</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Subscriptions are managed securely via **Dodo Payments**. You can view your status, billing history, and upcoming charges directly within your Dashboard. It is the user's responsibility to manage their subscription to avoid unwanted renewals.
                        </p>

                        <h2 className="text-2xl font-bold mt-10">9. System Security</h2>
                        <p className="text-gray-600 leading-relaxed">
                            BizPilot OS employs industry-standard encryption and security protocols to protect your business data. Our payment processing is fully PCI-compliant through our partnership with Dodo Payments.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
}
