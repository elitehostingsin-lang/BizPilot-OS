"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Facebook, Instagram, Linkedin, Moon, Send, Sun, Twitter } from "lucide-react"

function Footerdemo() {
    const [isDarkMode, setIsDarkMode] = React.useState(true)

    React.useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark")
        } else {
            document.documentElement.classList.remove("dark")
        }
    }, [isDarkMode])

    return (
        <footer className="relative border-t bg-background text-foreground transition-colors duration-300">
            <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
                    <div className="relative">
                        <div className="flex items-center gap-2 mb-4">
                            <img src="/logo.png" alt="BizPilot OS" className="h-8 w-8" />
                            <span className="text-xl font-bold tracking-tight">BizPilot OS</span>
                        </div>
                        <p className="mb-6 text-muted-foreground text-sm">
                            The all-in-one operating system for freelancers and agencies. Streamline your workflow today.
                        </p>
                        <form className="relative">
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                className="pr-12 backdrop-blur-sm bg-background/50"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                className="absolute right-1 top-1 h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-transform hover:scale-105"
                            >
                                <Send className="h-4 w-4" />
                                <span className="sr-only">Subscribe</span>
                            </Button>
                        </form>
                    </div>
                    <div>
                        <h3 className="mb-4 text-lg font-semibold">Product</h3>
                        <nav className="space-y-2 text-sm">
                            <a href="#" className="block transition-colors hover:text-blue-500">Features</a>
                            <a href="#" className="block transition-colors hover:text-blue-500">Pricing</a>
                            <a href="#" className="block transition-colors hover:text-blue-500">Testimonials</a>
                            <a href="/dashboard" className="block transition-colors hover:text-blue-500">Dashboard</a>
                        </nav>
                    </div>
                    <div>
                        <h3 className="mb-4 text-lg font-semibold">Support</h3>
                        <address className="space-y-2 text-sm not-italic text-muted-foreground">
                            <p>Help Center</p>
                            <p>API Documentation</p>
                            <p>Community Forum</p>
                            <p>Email: support@bizpilotos.com</p>
                        </address>
                    </div>
                    <div className="relative">
                        <h3 className="mb-4 text-lg font-semibold">Follow Us</h3>
                        <div className="mb-6 flex space-x-4">
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-blue-500/10 hover:text-blue-500">
                                <Twitter className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-pink-500/10 hover:text-pink-500">
                                <Instagram className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-blue-700/10 hover:text-blue-700">
                                <Linkedin className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Sun className="h-4 w-4" />
                            <Switch
                                id="dark-mode"
                                checked={isDarkMode}
                                onCheckedChange={setIsDarkMode}
                            />
                            <Moon className="h-4 w-4" />
                        </div>
                    </div>
                </div>
                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-center md:flex-row">
                    <p className="text-sm text-muted-foreground">
                        © 2024 BizPilot OS. All rights reserved.
                    </p>
                    <nav className="flex gap-4 text-sm text-muted-foreground">
                        <a href="#" className="transition-colors hover:text-primary">Privacy Policy</a>
                        <a href="#" className="transition-colors hover:text-primary">Terms</a>
                    </nav>
                </div>
            </div>
        </footer>
    )
}

export { Footerdemo }
