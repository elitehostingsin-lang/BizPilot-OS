"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Custom hook for social sharing gate
const useSocialGate = () => {
    const [shares, setShares] = useState<string[]>([]);
    const [isUnlocked, setIsUnlocked] = useState(false);

    const sharePlatforms = [
        { id: 'linkedin', icon: Linkedin, color: 'text-blue-600', label: 'LinkedIn', url: (u: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(u)}` },
        { id: 'twitter', icon: Twitter, color: 'text-black', label: 'Twitter', url: (u: string) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(u)}&text=${encodeURIComponent("Check out BizPilot OS - The all-in-one business operating system for free!")}` },
        { id: 'whatsapp', icon: MessageCircle, color: 'text-green-600', label: 'WhatsApp', url: (u: string) => `https://wa.me/?text=${encodeURIComponent("Check out BizPilot OS - The all-in-one business operating system for free! https://bizpilotos.pages.dev/")}` },
        { id: 'facebook', icon: Facebook, color: 'text-blue-800', label: 'Facebook', url: (u: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}` }
    ];

    const trackShare = (platform: string) => {
        if (!shares.includes(platform)) {
            const newShares = [...shares, platform];
            setShares(newShares);
            if (newShares.length >= 2) {
                setTimeout(() => setIsUnlocked(true), 1500);
            }
        }
    };

    return { shares, isUnlocked, sharePlatforms, trackShare };
};

import { Linkedin, Twitter, MessageCircle, Facebook, Share2, Check } from "lucide-react";

export default function SignupPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSignedUp, setIsSignedUp] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Social gate state
    const { shares, isUnlocked, sharePlatforms, trackShare } = useSocialGate();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 p-4 font-mono text-zinc-500">
                Securing connection...
            </div>
        );
    }

    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const { error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                    },
                },
            });

            if (authError) {
                setError(authError.message);
                setIsLoading(false);
            } else {
                if (name) {
                    localStorage.setItem('bizpilot_onboarding_name', name);
                }
                setIsSignedUp(true);
                setIsLoading(false);
            }
        } catch (err: any) {
            if (err.message?.includes("Failed to fetch")) {
                setError("Network error: Could not connect to Supabase. Check your URL in .env.local and your internet connection.");
            } else {
                setError(err.message || "An unexpected error occurred");
            }
            setIsLoading(false);
        }
    };

    const siteUrl = "https://bizpilotos.pages.dev/";

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 p-4">
            <Card className="w-full max-w-md border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
                {!isUnlocked ? (
                    <div className="p-8 text-center space-y-8 animate-in fade-in zoom-in duration-500">
                        <div className="flex justify-center flex-col items-center gap-4">
                            <img
                                src="/logo.png"
                                alt="BizPilot OS"
                                style={{ height: '70px', width: 'auto' }}
                            />
                            <div className="space-y-2">
                                <CardTitle className="text-2xl font-bold">Unlock BizPilot OS</CardTitle>
                                <CardDescription className="text-zinc-600">
                                    To keep BizPilot OS <span className="text-black font-bold">100% Free Lifetime</span>, help us reach more entrepreneurs!
                                </CardDescription>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-zinc-50 p-6 rounded-2xl border border-dashed border-zinc-200">
                                <p className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4">Step 1: Share on 2 Platforms</p>
                                <div className="grid grid-cols-2 gap-3">
                                    {sharePlatforms.map((platform) => (
                                        <a
                                            key={platform.id}
                                            href={platform.url(siteUrl)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={() => trackShare(platform.id)}
                                            className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all hover:scale-105 active:scale-95 ${shares.includes(platform.id) ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white hover:bg-zinc-50 border-zinc-100'}`}
                                        >
                                            <platform.icon className={`h-4 w-4 ${shares.includes(platform.id) ? 'text-green-600' : platform.color}`} />
                                            <span className="text-xs font-bold">{platform.label}</span>
                                            {shares.includes(platform.id) && <Check className="h-3 w-3" />}
                                        </a>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-zinc-400 px-2">
                                    <span>Progress</span>
                                    <span>{shares.length}/2 Platform Shared</span>
                                </div>
                                <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-black transition-all duration-500 ease-out"
                                        style={{ width: `${(shares.length / 2) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <p className="text-xs text-zinc-400 italic">
                                Once you share, the signup form will automatically appear here.
                            </p>
                        </div>
                    </div>
                ) : !isSignedUp ? (
                    <>
                        <CardHeader className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                            <div className="flex justify-center">
                                <img
                                    src="/logo.png"
                                    alt="BizPilot OS"
                                    style={{ height: '70px', width: 'auto' }}
                                />
                            </div>
                            <div className="bg-green-50 border border-green-100 p-3 rounded-xl flex items-center justify-center gap-2 mb-4">
                                <Check className="h-4 w-4 text-green-600" />
                                <span className="text-xs font-bold text-green-700 uppercase tracking-widest">Access Unlocked!</span>
                            </div>
                            <CardTitle className="text-2xl font-bold text-center">Create account</CardTitle>
                            <CardDescription className="text-center text-zinc-500">
                                Welcome! Set up your free lifetime dashboard.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {!isSupabaseConfigured && (
                                    <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/20 border-red-200">
                                        <AlertCircle className="h-4 w-4 text-red-600" />
                                        <AlertTitle className="text-red-800 dark:text-red-400 font-bold">Supabase Setup Required</AlertTitle>
                                        <AlertDescription className="text-red-700 dark:text-red-300 text-sm">
                                            Your `.env.local` file contains placeholder credentials.
                                            Please update it with real values to enable authentication.
                                        </AlertDescription>
                                    </Alert>
                                )}
                                {error && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        placeholder="John Doe"
                                        required
                                        className="rounded-xl"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        required
                                        className="rounded-xl"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        className="rounded-xl"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <Button className="w-full rounded-xl h-11 text-base bg-black hover:bg-zinc-800" type="submit" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Securing Access...
                                        </>
                                    ) : (
                                        "Create Free Account"
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                        <CardFooter className="flex justify-center bg-zinc-50/50 dark:bg-zinc-900/50 py-4 border-t border-zinc-100 dark:border-zinc-800">
                            <p className="text-sm text-zinc-500">
                                Already turned on?{" "}
                                <Link href="/login" className="text-black hover:underline font-bold">
                                    Sign in
                                </Link>
                            </p>
                        </CardFooter>
                    </>
                ) : (
                    <CardContent className="pt-10 pb-12 flex flex-col items-center text-center animate-in fade-in zoom-in duration-700">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                            <Check className="h-10 w-10 text-green-600 dark:text-green-400" />
                        </div>
                        <CardTitle className="text-3xl font-bold mb-4 tracking-tight">Check your inbox</CardTitle>
                        <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-[320px] text-lg leading-relaxed">
                            We've sent a <span className="font-bold text-black border-b-2 border-green-200">secure verification link</span> to <span className="font-bold text-black">{email}</span>. Please click the link to confirm your account.
                        </p>
                        <div className="w-full space-y-4">
                            <Button
                                className="w-full rounded-xl h-12 bg-black hover:bg-zinc-800"
                                onClick={() => router.push("/login")}
                            >
                                Return to Sign In
                            </Button>
                            <p className="text-xs text-zinc-400">
                                Didn't get it? Check your spam or <button className="underline font-medium hover:text-black">resend link</button>
                            </p>
                        </div>
                    </CardContent>
                )}
            </Card>
        </div>
    );
}
