"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud, Star, Moon, Sun } from "lucide-react";

export function SkyToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const isDark = theme === "dark";

    const toggleTheme = () => {
        setTheme(isDark ? "light" : "dark");
    };

    return (
        <button
            onClick={toggleTheme}
            className={`relative w-20 h-10 rounded-full p-1 transition-colors duration-500 overflow-hidden ${isDark ? "bg-[#1a1b26]" : "bg-[#87CEEB]"
                }`}
            aria-label="Toggle Theme"
        >
            <motion.div
                className={`w-8 h-8 rounded-full shadow-md z-10 relative flex items-center justify-center ${isDark ? "bg-white text-zinc-900" : "bg-yellow-400 text-white"
                    }`}
                animate={{
                    x: isDark ? 40 : 0,
                    rotate: isDark ? 360 : 0
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                {isDark ? <Moon size={16} fill="currentColor" /> : <Sun size={16} fill="currentColor" />}
            </motion.div>

            {/* Clouds for Light Mode */}
            <AnimatePresence>
                {!isDark && (
                    <>
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 20, opacity: 0 }}
                            className="absolute top-2 right-2 text-white/80"
                        >
                            <Cloud size={14} fill="currentColor" />
                        </motion.div>
                        <motion.div
                            initial={{ x: 10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 10, opacity: 0 }}
                            transition={{ delay: 0.1 }}
                            className="absolute bottom-1 right-5 text-white/60"
                        >
                            <Cloud size={10} fill="currentColor" />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Stars for Dark Mode */}
            <AnimatePresence>
                {isDark && (
                    <>
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="absolute top-2 left-3 text-yellow-200"
                        >
                            <Star size={8} fill="currentColor" />
                        </motion.div>
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ delay: 0.1 }}
                            className="absolute bottom-2 left-6 text-white/50"
                        >
                            <Star size={6} fill="currentColor" />
                        </motion.div>
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ delay: 0.2 }}
                            className="absolute top-1 left-7 text-white/80"
                        >
                            <Star size={4} fill="currentColor" />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </button>
    );
}
