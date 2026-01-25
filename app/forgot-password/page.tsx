"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [isEmailSent, setIsEmailSent] = useState(false);
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
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (resetError) {
                setError(resetError.message);
                setIsLoading(false);
            } else {
                setIsEmailSent(true);
                setIsLoading(false);
            }
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 p-4">
            <Card className="w-full max-w-md border-zinc-200 dark:border-zinc-800 shadow-xl">
                {!isEmailSent ? (
                    <>
                        <CardHeader className="space-y-4">
                            <div className="flex justify-center">
                                <img
                                    src="/logo.png"
                                    alt="BizPilot OS"
                                    style={{ height: '70px', width: 'auto' }}
                                />
                            </div>
                            <CardTitle className="text-2xl font-bold text-center">Reset your password</CardTitle>
                            <CardDescription className="text-center">
                                Enter your email and we'll send you a reset link
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {error && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}
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
                                <Button className="w-full rounded-xl" type="submit" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Sending reset link...
                                        </>
                                    ) : (
                                        "Send Reset Link"
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                        <CardFooter className="flex justify-center">
                            <p className="text-sm text-zinc-500">
                                Remember your password?{" "}
                                <Link href="/login" className="text-blue-500 hover:underline">
                                    Sign in
                                </Link>
                            </p>
                        </CardFooter>
                    </>
                ) : (
                    <CardContent className="pt-10 pb-12 flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                        <CardTitle className="text-2xl font-bold mb-2">Check your email</CardTitle>
                        <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-[280px]">
                            We've sent a password reset link to <span className="font-semibold text-zinc-900 dark:text-zinc-100">{email}</span>. Click the link to reset your password.
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
