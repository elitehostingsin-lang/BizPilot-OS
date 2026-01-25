import React from 'react';
import Link from 'next/link';
import { ChevronLeft, Calendar, User, Tag } from 'lucide-react';
import { blogPosts } from '@/lib/blog-data';
import { Metadata } from 'next';

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
                                className="group relative border-b border-gray-100 pb-12 animate-in fade-in slide-in-from-bottom-8 duration-700"
                                style={{ animationDelay: `${index * 150}ms` }}
                            >
                                <div className="flex flex-col md:flex-row md:items-start gap-8">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                                            <span className="px-2 py-1 bg-gray-50 rounded text-black">{post.category}</span>
                                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {post.date}</span>
                                        </div>
                                        <h2 className="text-3xl font-bold tracking-tight group-hover:text-primary transition-colors leading-snug">
                                            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                                        </h2>
                                        <p className="text-gray-600 text-lg leading-relaxed">{post.excerpt}</p>
                                        <div className="pt-4 flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-xs text-black">BP</div>
                                                <span>{post.author}</span>
                                            </div>
                                            <Link
                                                href={`/blog/${post.slug}`}
                                                className="inline-flex items-center text-sm font-bold uppercase tracking-widest hover:gap-2 transition-all"
                                            >
                                                Read Entry <ChevronLeft className="h-4 w-4 rotate-180" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
