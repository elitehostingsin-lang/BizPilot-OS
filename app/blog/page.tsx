import React from 'react';
import Link from 'next/link';
import { ChevronLeft, Calendar, User, Tag, ArrowRight } from 'lucide-react';
import { blogPosts } from '@/lib/blog-data';
import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'Business Insights Blog - BizPilot OS',
    description: 'Strategies on efficiency, business architecture, and why unified operations always beat fragmented tools. Expert insights for serious business owners.',
    keywords: ['business blog', 'SaaS insights', 'business efficiency', 'workflow optimization', 'business operating system'],
    alternates: {
        canonical: 'https://bizpilotos.pages.dev/blog',
    },
    openGraph: {
        title: 'Business Insights Blog - BizPilot OS',
        description: 'Expert strategies for building efficient, scalable businesses.',
        type: 'website',
        url: 'https://bizpilotos.pages.dev/blog',
    },
};

export default function BlogPage() {
    return (
        <div className="min-h-screen bg-white">
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to Home</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className="text-xl font-bold tracking-tight">BizPilot<span className="font-light">OS</span> <span className="text-sm font-medium text-gray-400 ml-2">Blog</span></span>
                    </div>
                </div>
            </header>

            <main className="pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6">Insights for the <br /><span className="text-gray-400 text-4xl font-medium">Serious Business Owner</span></h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Strategies on efficiency, business architecture, and why unified operations always beat fragmented tools.
                        </p>
                    </div>

                    <div className="grid gap-12">
                        {blogPosts.map((post, index) => (
                            <article
                                key={post.slug}
                                className="group relative border-b border-gray-100 pb-12 last:border-0 animate-in fade-in slide-in-from-bottom-8 duration-700 hover:scale-[1.01] transition-transform"
                                style={{ animationDelay: `${index * 150}ms` }}
                            >
                                <Link href={`/blog/${post.slug}`} className="block">
                                    <div className="flex flex-col md:flex-row md:items-start gap-8">
                                        {/* Featured Image */}
                                        <div className="md:w-1/3 relative aspect-video rounded-2xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-shadow">
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                                                <span className="px-3 py-1.5 bg-black text-white rounded-full">{post.category}</span>
                                                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {post.date}</span>
                                            </div>
                                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight group-hover:text-primary transition-colors leading-tight">
                                                {post.title}
                                            </h2>
                                            <p className="text-gray-600 text-lg leading-relaxed line-clamp-2">{post.excerpt}</p>
                                            <div className="pt-4 flex items-center justify-between">
                                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center font-bold text-xs text-white shadow-md">BP</div>
                                                    <div>
                                                        <p className="font-semibold text-black">{post.author}</p>
                                                        <p className="text-xs text-gray-400">5 min read</p>
                                                    </div>
                                                </div>
                                                <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-black group-hover:gap-3 transition-all">
                                                    Read Article <ArrowRight className="h-4 w-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </article>
                        ))}
                    </div>

                    {/* CTA Section */}
                    <div className="mt-20 p-12 bg-gradient-to-br from-black to-zinc-800 rounded-[2.5rem] text-center text-white shadow-2xl">
                        <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Business?</h3>
                        <p className="text-zinc-300 mb-8 max-w-2xl mx-auto">
                            Join 1,000+ entrepreneurs using BizPilot OS to streamline operations and scale efficiently.
                        </p>
                        <Link
                            href="/signup"
                            className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
                        >
                            Start Free Trial <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
