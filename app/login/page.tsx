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
import Image from "next/image";

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [mounted, setMounted] = useState(false);

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
            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) {
                setError(authError.message);
                setIsLoading(false);
            } else {
                router.push("/dashboard");
            }
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 p-4">
            <Card className="w-full max-w-md border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden animate-in fade-in zoom-in duration-500">
                <CardHeader className="space-y-4">
                    <div className="flex justify-center">
                        <Image
                            src="/logo.png"
                            alt="BizPilot OS"
                            width={150}
                            height={70}
                            priority
                            className="h-[70px] w-auto"
                        />
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
                    <CardDescription className="text-center text-zinc-500">
                        The Serious Business Operating System
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <Alert variant="destructive" className="animate-in slide-in-from-top-2">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@company.com"
                                required
                                className="rounded-xl border-zinc-200 focus:ring-2 focus:ring-black/5"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link href="/forgot-password" virtual-link="true" className="text-sm text-zinc-500 hover:text-black">
                                    Forgot password?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                required
                                className="rounded-xl border-zinc-200 focus:ring-2 focus:ring-black/5"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <Button className="w-full rounded-xl bg-black hover:bg-zinc-800 h-11 text-base transition-all active:scale-95" type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Authenticating...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center bg-zinc-50/50 dark:bg-zinc-900/50 py-4 border-t border-zinc-100 dark:border-zinc-800">
                    <p className="text-sm text-zinc-500">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" virtual-link="true" className="text-black font-semibold hover:underline">
                            Create Account
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
