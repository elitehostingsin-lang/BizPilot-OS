import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, Calendar, User, Clock, Share2, Tag, ArrowRight } from 'lucide-react';
import { blogPosts } from '@/lib/blog-data';
import { Metadata } from 'next';

export const runtime = 'edge';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = blogPosts.find((p) => p.slug === slug);
    if (!post) return { title: 'Post Not Found' };

    const canonicalUrl = `https://bizpilotos.pages.dev/blog/${post.slug}`;

    return {
        title: post.title,
        description: post.excerpt,
        keywords: post.keywords,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            publishedTime: post.date,
            authors: [post.author],
            url: canonicalUrl,
            images: [
                {
                    url: post.image,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                }
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt,
            images: [post.image],
        },
    };
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const post = blogPosts.find((p) => p.slug === slug);

    if (!post) {
        notFound();
    }

    // JSON-LD Structured Data for SEO
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.excerpt,
        image: `https://bizpilotos.pages.dev${post.image}`,
        datePublished: post.date,
        author: {
            '@type': 'Organization',
            name: post.author,
        },
        publisher: {
            '@type': 'Organization',
            name: 'BizPilot OS',
            logo: {
                '@type': 'ImageObject',
                url: 'https://bizpilotos.pages.dev/logo.png',
            },
        },
        keywords: post.keywords.join(', '),
        articleSection: post.category,
    };

    // Get related posts (exclude current)
    const relatedPosts = blogPosts.filter(p => p.slug !== post.slug).slice(0, 2);

    return (
        <div className="min-h-screen bg-white">
            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

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
                                src={post.image}
                                alt={post.title}
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest">
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
                        prose-p:text-gray-600 prose-p:leading-relaxed prose-p:text-lg
                        prose-strong:text-black prose-strong:font-bold
                        prose-li:text-gray-600
                        prose-h1:text-4xl prose-h1:mt-12 prose-h1:mb-6
                        prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-4
                        prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
                    ">
                        {post.content.split('\n').map((line, i) => {
                            if (line.startsWith('# ')) return <h1 key={i}>{line.replace('# ', '')}</h1>;
                            if (line.startsWith('## ')) return <h2 key={i}>{line.replace('## ', '')}</h2>;
                            if (line.startsWith('### ')) return <h3 key={i}>{line.replace('### ', '')}</h3>;
                            if (line.trim().startsWith('1.') || line.trim().startsWith('2.') || line.trim().startsWith('3.')) {
                                return <li key={i} className="ml-6">{line.replace(/^\d+\.\s*/, '')}</li>;
                            }
                            if (line.trim() === '') return <br key={i} />;
                            return <p key={i}>{line}</p>;
                        })}
                    </div>

                    <div className="mt-20 pt-10 border-t border-gray-100 space-y-8">
                        {/* Share Section */}
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-4">
                                <p className="text-sm font-bold uppercase tracking-widest text-gray-400">Share this insight</p>
                                <div className="flex gap-2">
                                    <button className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center hover:bg-zinc-100 transition-colors"><Share2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                            <Link
                                href="/signup"
                                className="bg-black text-white px-8 py-3 rounded-full font-bold text-sm tracking-widest uppercase hover:scale-105 transition-all inline-flex items-center gap-2"
                            >
                                Start Free Trial <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {/* Related Posts */}
                        {relatedPosts.length > 0 && (
                            <div className="mt-16 pt-16 border-t border-gray-100">
                                <h3 className="text-2xl font-bold mb-8">Continue Reading</h3>
                                <div className="grid md:grid-cols-2 gap-8">
                                    {relatedPosts.map((relatedPost) => (
                                        <Link
                                            key={relatedPost.slug}
                                            href={`/blog/${relatedPost.slug}`}
                                            className="group block p-6 border border-gray-100 rounded-2xl hover:shadow-xl transition-all hover:scale-[1.02]"
                                        >
                                            <div className="aspect-video rounded-xl overflow-hidden mb-4">
                                                <img
                                                    src={relatedPost.image}
                                                    alt={relatedPost.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{relatedPost.category}</span>
                                            <h4 className="text-xl font-bold mt-2 mb-2 group-hover:text-primary transition-colors">{relatedPost.title}</h4>
                                            <p className="text-gray-600 text-sm line-clamp-2">{relatedPost.excerpt}</p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </article>
            </main>
        </div>
    );
}
