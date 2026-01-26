"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase";

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
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

    const handleNext = async () => {
        if (step === 1) {
            const bizName = (document.getElementById('businessName') as HTMLInputElement)?.value;
            if (bizName) {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    await supabase.from('user_profiles').upsert({
                        user_id: user.id,
                        company: bizName,
                        name: user.user_metadata.full_name || 'Business Owner',
                        email: user.email,
                        avatar: (user.user_metadata.full_name || 'Business Owner').split(' ').map((n: string) => n[0]).join(''),
                        join_date: new Date().toISOString(),
                        plan: 'Paid',
                        subscription_status: 'active'
                    });
                }
            }
        }
        if (step < 3) {
            setStep(step + 1);
        } else {
            setIsLoading(true);
            setTimeout(() => {
                router.push("/dashboard");
            }, 2000);
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-900 p-4">
            <div className="flex justify-center mb-6">
                <img
                    src="/logo.png"
                    alt="BizPilot OS"
                    style={{ height: '70px', width: 'auto' }}
                />
            </div>
            <div className="w-full max-w-md mb-8 flex justify-between items-center px-2">
                <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>1</div>
                    <div className={`h-1 w-12 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>2</div>
                    <div className={`h-1 w-12 ${step >= 3 ? 'bg-primary' : 'bg-muted'}`} />
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>3</div>
                </div>
                <span className="text-sm font-medium text-muted-foreground">Step {step} of 3</span>
            </div>

            <Card className="w-full max-w-md border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
                <div className="h-1 w-full bg-zinc-100 dark:bg-zinc-800">
                    <div
                        className="h-full bg-primary transition-all duration-500 ease-in-out"
                        style={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>

                {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <CardHeader>
                            <CardTitle>Tell us about your business</CardTitle>
                            <CardDescription>We'll customize your dashboard based on your business type.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="businessName">Business Name</Label>
                                <Input id="businessName" placeholder="Acme Inc." className="rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <Label>Industry</Label>
                                <Select>
                                    <SelectTrigger className="rounded-xl">
                                        <SelectValue placeholder="Select industry" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="marketing">Marketing Agency</SelectItem>
                                        <SelectItem value="design">Design & Creative</SelectItem>
                                        <SelectItem value="software">Software Development</SelectItem>
                                        <SelectItem value="consulting">Consulting</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <CardHeader>
                            <CardTitle>What are your goals?</CardTitle>
                            <CardDescription>Select all that apply to help us suggest the right tools.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                {[
                                    "Manage Leads & CRM",
                                    "Create Invoices & Proposals",
                                    "Track Projects & Tasks",
                                    "Plan Social Media Content",
                                    "Automate Client Onboarding"
                                ].map((goal, i) => (
                                    <div key={i} className="flex items-center space-x-2 p-3 rounded-xl border border-input hover:bg-muted/50 cursor-pointer transition-colors">
                                        <Checkbox id={`goal-${i}`} />
                                        <Label htmlFor={`goal-${i}`} className="flex-1 cursor-pointer font-normal">{goal}</Label>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </div>
                )}

                {step === 3 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <CardHeader>
                            <CardTitle>You&apos;re all set!</CardTitle>
                            <CardDescription>We&apos;ve configured your workspace based on your preferences.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center py-6 space-y-4">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-2">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <p className="text-center text-muted-foreground">
                                Your BizPilot OS is ready for launch. Click below to enter your dashboard.
                            </p>
                        </CardContent>
                    </div>
                )}

                <CardFooter className="flex justify-between">
                    <Button
                        variant="ghost"
                        onClick={handleBack}
                        disabled={step === 1 || isLoading}
                        className="rounded-xl"
                    >
                        Back
                    </Button>
                    <Button
                        onClick={handleNext}
                        disabled={isLoading}
                        className="rounded-xl"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Launching...
                            </>
                        ) : step === 3 ? (
                            "Go to Dashboard"
                        ) : (
                            "Continue"
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
