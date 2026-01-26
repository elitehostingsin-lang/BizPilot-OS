"use client";

import React, { useState } from 'react';
import { Share2, Linkedin, Twitter, MessageCircle, Link, Check, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ShareButtonsProps {
    url: string;
    title: string;
}

export const BlogShareButtons = ({ url, title }: ShareButtonsProps) => {
    const [copied, setCopied] = useState(false);

    const shareData = {
        title: title,
        url: url
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareLinks = {
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    };

    return (
        <div className="flex items-center gap-4 flex-wrap">
            <p className="text-sm font-bold uppercase tracking-widest text-gray-400">Share this insight</p>
            <div className="flex gap-2">
                <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center hover:bg-zinc-100 transition-colors text-blue-600">
                    <Linkedin className="w-4 h-4" />
                </a>
                <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center hover:bg-zinc-100 transition-colors text-black">
                    <Twitter className="w-4 h-4" />
                </a>
                <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center hover:bg-zinc-100 transition-colors text-green-600">
                    <MessageCircle className="w-4 h-4" />
                </a>
                <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center hover:bg-zinc-100 transition-colors text-blue-800">
                    <Facebook className="w-4 h-4" />
                </a>
                <button onClick={handleCopy}
                    className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center hover:bg-zinc-100 transition-colors text-zinc-600">
                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Link className="w-4 h-4" />}
                </button>
            </div>
        </div>
    );
};
