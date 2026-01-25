import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, Calendar, User, Clock, Share2, Tag } from 'lucide-react';
import { blogPosts } from '@/lib/blog-data';
import { Metadata } from 'next';

export const runtime = 'edge';

interface Props {
    params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const post = blogPosts.find((p) => p.slug === params.slug);
    if (!post) return { title: 'Post Not Found' };

    return {
        title: post.title,
        description: post.excerpt,
        keywords: post.keywords,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            publishedTime: post.date,
            authors: [post.author],
        },
    };
}

export default function BlogPostPage({ params }: Props) {
    const post = blogPosts.find((p) => p.slug === params.slug);

    if (!post) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-white">
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/blog" className="flex items-center gap-2 group">
                        <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to Blog</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className="text-xl font-bold tracking-tight">BizPilot<span className="font-light">OS</span></span>
                    </div>
                </div>
            </header>

            <main className="pt-32 pb-20 px-6">
                <article className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <div className="mb-12 space-y-6 text-center">
                        <div className="relative w-full aspect-video rounded-[2.5rem] overflow-hidden mb-12 shadow-2xl border border-gray-100">
                            <img
                                src={post.image.replace('C:/Users/unnati/Desktop/Biz Pilot/bizpilot-os/public', '')}
                                alt={post.title}
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <div className="inline-flex items-center gap-3 px-3 py-1 bg-zinc-100 rounded-full text-[10px] font-bold uppercase tracking-widest">
                            <Tag className="w-3 h-3" /> {post.category}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
                            {post.title}
                        </h1>
                        <div className="flex items-center justify-center gap-6 text-sm text-gray-500 font-medium">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4" /> {post.author}
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" /> {post.date}
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" /> 5 min read
                            </div>
                        </div>
                    </div>

                    <div className="prose prose-zinc prose-lg max-w-none 
                        prose-headings:font-bold prose-headings:tracking-tight
                        prose-p:text-gray-600 prose-p:leading-relaxed
                        prose-strong:text-black prose-strong:font-bold
                        prose-li:text-gray-600
                    ">
                        {/* We're simulating markdown parsing for simplicity or can use a library */}
                        {post.content.split('\n').map((line, i) => {
                            if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-bold mt-12 mb-6">{line.replace('# ', '')}</h1>;
                            if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold mt-10 mb-4">{line.replace('## ', '')}</h2>;
                            if (line.trim() === '') return <br key={i} />;
                            return <p key={i} className="mb-4">{line}</p>;
                        })}
                    </div>

                    <div className="mt-20 pt-10 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <p className="text-sm font-bold uppercase tracking-widest text-gray-400">Share this insight</p>
                            <div className="flex gap-2">
                                <button className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center hover:bg-zinc-100 transition-colors"><LinkIcon className="w-4 h-4" /></button>
                                <button className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center hover:bg-zinc-100 transition-colors"><Twitter className="w-4 h-4" /></button>
                            </div>
                        </div>
                        <Link
                            href="/signup"
                            className="bg-black text-white px-8 py-3 rounded-full font-bold text-sm tracking-widest uppercase hover:scale-105 transition-all"
                        >
                            Start Free Trial
                        </Link>
                    </div>
                </article>
            </main>
        </div>
    );
}

// Minimal icons to avoid missing imports in the blog post page
const LinkIcon = ({ className }: { className?: string }) => (
    <Share2 className={className} />
);

const Twitter = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={className}
        fill="currentColor"
    >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
    </svg>
);
