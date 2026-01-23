"use client";

import { GradientHeading } from "@/components/ui/gradient-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Need to check if I have Tabs. I installed Radix UI Slot... let's see. 
// Actually I did not install Tabs specifically in the provided context prompt, but Radix primitives might be there.
// To be safe, I'll use a simple state-based tab system or just sections.
// Or I'll just check package.json or previous installations.
// 'shadcn-ui@latest add tabs' wasn't run.
// I'll stick to a simple vertical layout for settings to avoid errors.

import { User, CreditCard, Bell, Shield } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="space-y-8 max-w-4xl">
            <GradientHeading size="sm">Settings</GradientHeading>

            <div className="grid gap-8">
                {/* Profile Section */}
                <div className="bg-white dark:bg-zinc-900 border rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b dark:border-zinc-800">
                        <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600">
                            <User className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Profile Settings</h3>
                            <p className="text-sm text-zinc-500">Manage your account information.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Full Name</Label>
                            <Input defaultValue="Unnati User" />
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input defaultValue="user@bizpilot.os" disabled className="bg-zinc-50 dark:bg-zinc-800" />
                        </div>
                    </div>
                </div>

                {/* Preferences */}
                <div className="bg-white dark:bg-zinc-900 border rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b dark:border-zinc-800">
                        <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600">
                            <Bell className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Preferences</h3>
                            <p className="text-sm text-zinc-500">Customize your workspace.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">Email Notifications</Label>
                                <p className="text-sm text-zinc-500">Receive updates about your leads.</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">Dark Mode</Label>
                                <p className="text-sm text-zinc-500">Toggle system theme.</p>
                            </div>
                            <Switch />
                        </div>
                    </div>
                </div>

                {/* Subscription (Mock) */}
                <div className="bg-white dark:bg-zinc-900 border rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b dark:border-zinc-800">
                        <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600">
                            <CreditCard className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Subscription</h3>
                            <p className="text-sm text-zinc-500">Manage your billing.</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg">
                        <div>
                            <div className="font-semibold text-lg">Free Beta</div>
                            <div className="text-sm text-zinc-500">Unlimited access</div>
                        </div>
                        <Button variant="outline">Upgrade Plan</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
