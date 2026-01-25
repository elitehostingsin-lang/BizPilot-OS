"use client";

export const runtime = 'edge';

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";

export default function SignupPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSignedUp, setIsSignedUp] = useState(false);

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
                // Redirect to onboarding instead of showing verification page
                router.push('/onboarding');
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

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 p-4">
            <Card className="w-full max-w-md border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
                {!isSignedUp ? (
                    <>
                        <CardHeader className="space-y-4">
                            <div className="flex justify-center">
                                <Image
                                    src="/logo.png"
                                    alt="BizPilot OS"
                                    width={320}
                                    height={96}
                                    priority
                                    className="h-20 w-auto"
                                />
                            </div>
                            <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
                            <CardDescription className="text-center">
                                Enter your email below to create your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {!isSupabaseConfigured && (
                                    <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/20 border-red-200">
                                        <AlertCircle className="h-4 w-4 text-red-600" />
                                        <AlertTitle className="text-red-800 dark:text-red-400 font-bold">Supabase Setup Required</AlertTitle>
                                        <AlertDescription className="text-red-700 dark:text-red-300 text-sm">
                                            Your `.env.local` file contains placeholder credentials.
                                            Please update it with real values from your Supabase Dashboard to enable authentication.
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
                                <Button className="w-full rounded-xl h-11 text-base" type="submit" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating account...
                                        </>
                                    ) : (
                                        "Create Account"
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                        <CardFooter className="flex justify-center bg-zinc-50/50 dark:bg-zinc-900/50 py-4 border-t border-zinc-100 dark:border-zinc-800">
                            <p className="text-sm text-zinc-500">
                                Already have an account?{" "}
                                <Link href="/login" className="text-blue-500 hover:underline font-medium">
                                    Sign in
                                </Link>
                            </p>
                        </CardFooter>
                    </>
                ) : (
                    <CardContent className="pt-10 pb-12 flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
                            <AlertCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <CardTitle className="text-2xl font-bold mb-2">Check your email</CardTitle>
                        <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-[280px]">
                            We&apos;ve sent a verification link to <span className="font-semibold text-zinc-900 dark:text-zinc-100">{email}</span>. Please click the link to confirm your account.
                        </p>
                        <Button
                            className="w-full rounded-xl"
                            variant="outline"
                            onClick={() => router.push("/login")}
                        >
                            Return to Sign In
                        </Button>
                    </CardContent>
                )}
            </Card>
        </div>
    );
}
