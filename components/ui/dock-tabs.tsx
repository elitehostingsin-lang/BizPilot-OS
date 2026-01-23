"use client"

import { useState, useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Home, FileText, Users, DollarSign, Calendar, PenTool, PieChart, Clipboard, Activity, ScrollText, Archive, Settings } from 'lucide-react'
import Link from 'next/link'

interface DockItem {
    id: string
    name: string
    url: string
    icon: React.ReactNode
    color: string
}

const dockItems: DockItem[] = [
    { id: "dashboard", name: "Dashboard", url: "/dashboard", icon: <Home />, color: "bg-blue-600" },
    { id: "content", name: "Content", url: "/dashboard/content", icon: <FileText />, color: "bg-indigo-500" },
    { id: "invoices", name: "Invoices", url: "/dashboard/invoices", icon: <DollarSign />, color: "bg-green-500" },
    { id: "crm", name: "CRM", url: "/dashboard/leads", icon: <Users />, color: "bg-purple-500" },
    { id: "tasks", name: "Tasks", url: "/dashboard/tasks", icon: <Calendar />, color: "bg-amber-500" },
    { id: "proposals", name: "Proposals", url: "/dashboard/proposals", icon: <PenTool />, color: "bg-pink-500" },
    { id: "finance", name: "Finance", url: "/dashboard/expenses", icon: <PieChart />, color: "bg-emerald-500" },
    { id: "forms", name: "Forms", url: "/dashboard/forms", icon: <Clipboard />, color: "bg-cyan-500" },
    { id: "audit", name: "Audit", url: "/dashboard/audit", icon: <Activity />, color: "bg-orange-500" },
    { id: "scripts", name: "Scripts", url: "/dashboard/scripts", icon: <ScrollText />, color: "bg-teal-500" },
    { id: "vault", name: "Vault", url: "/dashboard/notes", icon: <Archive />, color: "bg-indigo-600" },
    { id: "settings", name: "Settings", url: "/dashboard/settings", icon: <Settings />, color: "bg-zinc-600" },
]

function DockIcon({ item, mouseX }: { item: DockItem; mouseX: any }) {
    const ref = useRef<HTMLDivElement>(null)

    const distance = useTransform(mouseX, (val: number) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
        return val - bounds.x - bounds.width / 2
    })

    const widthSync = useTransform(distance, [-150, 0, 150], [40, 60, 40])
    const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 })

    const heightSync = useTransform(distance, [-150, 0, 150], [40, 60, 40])
    const height = useSpring(heightSync, { mass: 0.1, stiffness: 150, damping: 12 })

    const [isHovered, setIsHovered] = useState(false)

    return (
        <Link href={item.url}>
            <motion.div
                ref={ref}
                style={{ width, height }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="aspect-square cursor-pointer flex items-center justify-center relative group"
                whileTap={{ scale: 0.95 }}
            >
                <motion.div
                    className={`w-full h-full rounded-2xl shadow-lg flex items-center justify-center text-white relative overflow-hidden ${item.color}`}
                    animate={{
                        y: isHovered ? -8 : 0,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 17,
                    }}
                >
                    <motion.div
                        className="text-lg md:text-xl"
                        animate={{
                            scale: isHovered ? 1.1 : 1,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 17,
                        }}
                    >
                        {item.icon}
                    </motion.div>

                    {/* Shine effect */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"
                        animate={{
                            opacity: isHovered ? 0.3 : 0.1,
                        }}
                        transition={{ duration: 0.2 }}
                    />
                </motion.div>

                {/* Tooltip */}
                <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{
                        opacity: isHovered ? 1 : 0,
                        y: isHovered ? -20 : 10,
                        scale: isHovered ? 1 : 0.8,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                    }}
                    className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-[10px] md:text-xs px-2 py-1 rounded-md whitespace-nowrap pointer-events-none backdrop-blur-sm z-50"
                >
                    {item.name}
                </motion.div>

                {/* Active indicator dot */}
                <motion.div
                    className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-black/20 dark:bg-white/50 rounded-full"
                    animate={{
                        opacity: isHovered ? 1 : 0,
                    }}
                />
            </motion.div>
        </Link>
    )
}

export function DockTabs() {
    const mouseX = useMotionValue(Infinity)

    return (
        <div className="flex items-end justify-center pb-4">
            <motion.div
                onMouseMove={(e) => mouseX.set(e.pageX)}
                onMouseLeave={() => mouseX.set(Infinity)}
                className="mx-auto flex h-16 md:h-20 items-end gap-2 md:gap-4 rounded-3xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl px-4 md:px-6 pb-2.5 md:pb-3.5 border border-white/20 shadow-2xl"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.1,
                }}
            >
                {dockItems.map((item) => (
                    <DockIcon key={item.id} item={item} mouseX={mouseX} />
                ))}
            </motion.div>
        </div>
    )
}
