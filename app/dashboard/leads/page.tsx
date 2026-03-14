"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { GradientHeading } from "@/components/ui/gradient-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Search, Plus, Filter, Phone, Mail, MapPin,
    Calendar, MoreVertical, ExternalLink, UserCheck,
    TrendingUp, AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { toast } from "sonner";

export default function LeadsPage() {
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        new: 0,
        converted: 0,
        conversionRate: 0
    });
    const [filters, setFilters] = useState({
        status: "all",
        search: ""
    });

    useEffect(() => {
        loadLeads();
    }, [filters]);

    const loadLeads = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            let query = supabase
                .from("leads")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (filters.status !== "all") {
                query = query.eq("status", filters.status);
            }

            if (filters.search) {
                query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,company.ilike.%${filters.search}%`);
            }

            const { data, error } = await query;
            if (error) throw error;

            setLeads(data || []);

            // Calculate Stats
            const total = data?.length || 0;
            const newsCount = data?.filter(l => l.status === 'new').length || 0;
            const convertedCount = data?.filter(l => l.status === 'converted').length || 0;
            setStats({
                total,
                new: newsCount,
                converted: convertedCount,
                conversionRate: total > 0 ? (convertedCount / total) * 100 : 0
            });

        } catch (error: any) {
            toast.error("Failed to load leads: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            new: "bg-blue-500/10 text-blue-500 border-blue-500/20",
            contacted: "bg-amber-500/10 text-amber-500 border-amber-500/20",
            qualified: "bg-purple-500/10 text-purple-500 border-purple-500/20",
            converted: "bg-emerald-500/10 text-emerald-500 border-emerald-500/10",
            lost: "bg-rose-500/10 text-rose-500 border-rose-500/20",
            spam: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
        };
        return colors[status] || "bg-zinc-500/10 text-zinc-500";
    };

    return (
        <div className="space-y-8 p-1">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <GradientHeading size="sm">Meta Ads CRM</GradientHeading>
                    <p className="text-muted-foreground text-sm mt-1 font-medium">Capture and distribute leads from Facebook & Instagram</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <Button variant="outline" className="rounded-2xl border-border/50 bg-background/50 backdrop-blur-xl">
                        <Filter className="h-4 w-4 mr-2" /> Filter
                    </Button>
                    <Button className="rounded-2xl bg-primary shadow-lg shadow-primary/20 gap-2">
                        <Plus className="h-4 w-4" /> Add Lead
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Total Leads", value: stats.total, icon: TrendingUp, color: "text-blue-500" },
                    { label: "New Entries", value: stats.new, icon: AlertCircle, color: "text-amber-500" },
                    { label: "Converted", value: stats.converted, icon: UserCheck, color: "text-emerald-500" },
                    { label: "Conv. Rate", value: `${stats.conversionRate.toFixed(1)}%`, icon: TrendingUp, color: "text-purple-500" }
                ].map((stat, i) => (
                    <Card key={i} className="border-border/50 shadow-xl shadow-primary/5 bg-background/60 backdrop-blur-xl overflow-hidden group">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                                    <h3 className="text-2xl font-black mt-1 leading-none">{stat.value}</h3>
                                </div>
                                <div className={`p-2 rounded-xl bg-background/50 border border-border/50 ${stat.color}`}>
                                    <stat.icon className="h-5 w-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Search & Tabs */}
            <div className="flex flex-col md:flex-row gap-4 items-center bg-background/40 backdrop-blur-md p-3 rounded-2xl border border-border/50">
                <div className="relative flex-1 group w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Search by name, email, or company..."
                        className="rounded-xl border-none bg-muted/20 pl-11 h-11 focus-visible:bg-background transition-all"
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                    {["all", "new", "contacted", "qualified", "converted"].map((status) => (
                        <Button
                            key={status}
                            variant={filters.status === status ? "default" : "ghost"}
                            className={`rounded-xl h-11 px-6 text-xs font-bold capitalize transition-all ${filters.status === status ? 'shadow-lg shadow-primary/20' : ''}`}
                            onClick={() => setFilters({ ...filters, status })}
                        >
                            {status}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Leads Table */}
            <Card className="border-border/50 shadow-2xl shadow-primary/5 bg-background/60 backdrop-blur-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/30 border-b border-border/50">
                                <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest text-muted-foreground">Lead Details</th>
                                <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest text-muted-foreground text-center">Status</th>
                                <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest text-muted-foreground">Source</th>
                                <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest text-muted-foreground">Date</th>
                                <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/20">
                            <AnimatePresence>
                                {loading ? (
                                    <tr><td colSpan={5} className="p-12 text-center text-muted-foreground font-medium">Fetching real-time data...</td></tr>
                                ) : leads.length === 0 ? (
                                    <tr><td colSpan={5} className="p-12 text-center text-muted-foreground font-medium">No leads found matching your criteria.</td></tr>
                                ) : (
                                    leads.map((lead) => (
                                        <motion.tr
                                            key={lead.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="hover:bg-primary/5 transition-colors group cursor-pointer"
                                        >
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-foreground group-hover:text-primary transition-colors">{lead.full_name}</span>
                                                    <span className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5 font-medium">
                                                        <Mail className="h-3 w-3" /> {lead.email || "No email"}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                                                        <Phone className="h-3 w-3" /> {lead.phone || "No phone"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <Badge variant="outline" className={`rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-tighter ${getStatusColor(lead.status)}`}>
                                                    {lead.status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <Badge variant="secondary" className="bg-primary/5 text-primary border-none text-[10px] w-fit font-black">
                                                        {lead.source?.replace('_', ' ') || 'Direct'}
                                                    </Badge>
                                                    {lead.meta_form_id && (
                                                        <span className="text-[10px] text-muted-foreground mt-1 font-bold">Form: {lead.meta_form_id}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-muted-foreground">{format(new Date(lead.created_at), "MMM d, yyyy")}</span>
                                                    <span className="text-[10px] text-muted-foreground opacity-50">{format(new Date(lead.created_at), "HH:mm a")}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-all">
                                                        <Phone className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-all">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
