"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { GradientHeading } from "@/components/ui/gradient-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Search, Plus, Filter, Phone, Mail, MapPin,
    Calendar, MoreVertical, ExternalLink, UserCheck,
    TrendingUp, AlertCircle, Download, RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { toast } from "sonner";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export default function LeadsPage() {
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [stats, setStats] = useState({
        total: 0,
        new: 0,
        contacted: 0,
        converted: 0
    });

    useEffect(() => {
        loadLeads();
    }, [statusFilter]);

    async function loadLeads() {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            let query = supabase
                .from('leads')
                .select(`
          *,
          assigned_member:team_members(full_name)
        `)
                .eq('business_owner_id', user.id)
                .order('created_at', { ascending: false });

            if (statusFilter !== 'all') {
                query = query.eq('status', statusFilter);
            }

            const { data, error } = await query;
            if (error) throw error;

            setLeads(data || []);

            // Calculate real-time stats
            setStats({
                total: data?.length || 0,
                new: data?.filter(l => l.status === 'new').length || 0,
                contacted: data?.filter(l => l.status === 'contacted').length || 0,
                converted: data?.filter(l => l.status === 'converted').length || 0
            });

        } catch (error: any) {
            toast.error("Failed to fetch leads");
        } finally {
            setLoading(false);
        }
    }

    const filteredLeads = leads.filter(lead =>
        lead.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone?.includes(searchQuery)
    );

    const getStatusBadge = (status: string) => {
        const styles: any = {
            new: "bg-blue-500/10 text-blue-500 border-blue-500/20",
            contacted: "bg-amber-500/10 text-amber-500 border-amber-500/20",
            converted: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
            lost: "bg-rose-500/10 text-rose-500 border-rose-500/20"
        };
        return styles[status] || "bg-zinc-500/10 text-zinc-500";
    };

    return (
        <div className="space-y-8 p-6 lg:p-10 bg-background/50 backdrop-blur-3xl min-h-screen">
            {/* 🚀 CRM Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                            <TrendingUp className="h-6 w-6 text-primary" />
                        </div>
                        <GradientHeading size="sm">Meta Leads Central</GradientHeading>
                    </div>
                    <p className="text-muted-foreground mt-2 font-medium">Precision lead management with Meta Ads integration</p>
                </div>

                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-2xl border-border/50 gap-2 h-12" onClick={loadLeads}>
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Sync Meta
                    </Button>
                    <Button className="rounded-2xl gap-2 h-12 shadow-xl shadow-primary/20">
                        <Plus className="h-5 w-5" /> Import Leads
                    </Button>
                </div>
            </div>

            {/* 📊 Intelligence Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Volume', value: stats.total, icon: Users, color: 'text-primary' },
                    { label: 'Fresh Leads', value: stats.new, icon: AlertCircle, color: 'text-blue-500' },
                    { label: 'In Pipeline', value: stats.contacted, icon: Phone, color: 'text-amber-500' },
                    { label: 'Success Rate', value: `${(stats.converted / (stats.total || 1) * 100).toFixed(1)}%`, icon: UserCheck, color: 'text-emerald-500' }
                ].map((stat, i) => (
                    <Card key={i} className="border-border/50 bg-background/40 backdrop-blur-xl shadow-lg hover:border-primary/30 transition-all group">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                                <stat.icon className={`h-4 w-4 ${stat.color} opacity-50 group-hover:opacity-100 transition-opacity`} />
                            </div>
                            <CardTitle className="text-3xl font-black">{stat.value}</CardTitle>
                        </CardHeader>
                    </Card>
                ))}
            </div>

            {/* 🔍 Dynamic Filter Bar */}
            <Card className="border-border/40 bg-background/40 backdrop-blur-xl overflow-hidden shadow-2xl">
                <div className="p-4 border-b border-border/40 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Filter leads by name, email or phone..."
                            className="pl-11 h-12 rounded-2xl bg-muted/20 border-border/50 focus:bg-background transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        {['all', 'new', 'contacted', 'qualified', 'converted'].map((status) => (
                            <Button
                                key={status}
                                variant={statusFilter === status ? 'default' : 'ghost'}
                                className={`rounded-xl px-6 capitalize font-bold text-xs h-10 ${statusFilter === status ? 'shadow-lg shadow-primary/20' : ''}`}
                                onClick={() => setStatusFilter(status)}
                            >
                                {status}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* 📋 Leads Matrix */}
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow className="border-border/40 hover:bg-transparent">
                            <TableHead className="font-black text-xs uppercase text-muted-foreground py-6 pl-8">Identity</TableHead>
                            <TableHead className="font-black text-xs uppercase text-muted-foreground">Source Hub</TableHead>
                            <TableHead className="font-black text-xs uppercase text-muted-foreground">Flow State</TableHead>
                            <TableHead className="font-black text-xs uppercase text-muted-foreground">Team Node</TableHead>
                            <TableHead className="font-black text-xs uppercase text-muted-foreground">Captured At</TableHead>
                            <TableHead className="text-right pr-8">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            [1, 2, 3, 4].map(i => (
                                <TableRow key={i} className="animate-pulse border-border/20">
                                    <TableCell colSpan={6}><div className="h-16 bg-muted/20 rounded-2xl w-full" /></TableCell>
                                </TableRow>
                            ))
                        ) : filteredLeads.map((lead) => (
                            <TableRow key={lead.id} className="border-border/20 group hover:bg-primary/5 transition-colors">
                                <TableCell className="py-6 pl-8">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 font-black text-primary">
                                            {lead.full_name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-black text-sm tracking-tight">{lead.full_name}</p>
                                            <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground font-bold">
                                                <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {lead.email || 'N/A'}</span>
                                                <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {lead.phone || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {lead.source === 'meta_ads' ? (
                                            <Badge className="rounded-xl bg-blue-500/10 text-blue-500 border-blue-500/20 gap-1.5 px-3 py-1 text-[10px] font-black">
                                                <Facebook className="h-3 w-3" /> Meta Ads
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="rounded-xl gap-1.5 px-3 py-1 text-[10px] uppercase font-black">
                                                Manual Entry
                                            </Badge>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={`rounded-xl px-3 py-1 text-[10px] font-black border-none ${getStatusBadge(lead.status)}`}>
                                        {lead.status.toUpperCase()}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                                        <UserCheck className="h-3.5 w-3.5 opacity-50" />
                                        {lead.assigned_member?.full_name || 'Unassigned'}
                                    </div>
                                </TableCell>
                                <TableCell className="text-xs font-medium text-muted-foreground">
                                    {format(new Date(lead.created_at), 'MMM dd, hh:mm a')}
                                </TableCell>
                                <TableCell className="text-right pr-8">
                                    <div className="flex items-center justify-end gap-2">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-border/50 hover:bg-primary/10">
                                                    <ExternalLink className="h-4 w-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="rounded-[2.5rem] border-border/40 bg-background/80 backdrop-blur-3xl lg:max-w-4xl max-h-[90vh] overflow-y-auto">
                                                <DialogHeader>
                                                    <DialogTitle className="text-3xl font-black">Lead Intelligence Full Intel</DialogTitle>
                                                </DialogHeader>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
                                                    {/* Info Grid */}
                                                    <div className="space-y-6">
                                                        <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                                            <User className="h-4 w-4" /> Professional Profile
                                                        </h3>
                                                        <div className="grid grid-cols-2 gap-6 bg-muted/20 p-6 rounded-3xl border border-border/20">
                                                            <div><p className="text-[10px] font-bold text-muted-foreground uppercase">Full Name</p><p className="font-black">{lead.full_name}</p></div>
                                                            <div><p className="text-[10px] font-bold text-muted-foreground uppercase">Email Node</p><p className="font-black text-primary">{lead.email || 'None'}</p></div>
                                                            <div><p className="text-[10px] font-bold text-muted-foreground uppercase">Location/City</p><p className="font-black">{lead.city || 'N/A'}</p></div>
                                                            <div><p className="text-[10px] font-bold text-muted-foreground uppercase">Contact Path</p><p className="font-black">{lead.phone || 'None'}</p></div>
                                                        </div>

                                                        <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                                            <Facebook className="h-4 w-4" /> Meta Ads Technical Metadata
                                                        </h3>
                                                        <div className="bg-muted/20 p-6 rounded-3xl border border-border/20 space-y-4">
                                                            <div className="flex justify-between border-b border-border/20 pb-2"><p className="text-xs font-bold text-muted-foreground">Meta Lead ID</p><p className="text-xs font-black font-mono">{lead.meta_lead_id || 'N/A'}</p></div>
                                                            <div className="flex justify-between border-b border-border/20 pb-2"><p className="text-xs font-bold text-muted-foreground">Meta Form ID</p><p className="text-xs font-black font-mono">{lead.meta_form_id || 'N/A'}</p></div>
                                                            <div className="flex justify-between"><p className="text-xs font-bold text-muted-foreground">Meta Page ID</p><p className="text-xs font-black font-mono">{lead.meta_page_id || 'N/A'}</p></div>
                                                        </div>
                                                    </div>

                                                    {/* Activity History */}
                                                    <div className="space-y-6">
                                                        <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                                            <History className="h-4 w-4" /> Operational History
                                                        </h3>
                                                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                                            <ActivityLog leadId={lead.id} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {!loading && filteredLeads.length === 0 && (
                    <div className="py-24 text-center">
                        <div className="h-20 w-20 bg-muted/20 rounded-full flex items-center justify-center mx-auto border border-dashed border-border/50 opacity-20 mb-6">
                            <Users className="h-10 w-10" />
                        </div>
                        <h3 className="text-2xl font-black">Zero Leads Detected</h3>
                        <p className="text-muted-foreground mt-2 font-medium">Connect Meta Ads or Import manually to start your growth cycle.</p>
                    </div>
                )}
            </Card>
        </div>
    );
}

// Simple Activity Log Component
function ActivityLog({ leadId }: { leadId: string }) {
    const [activities, setActivities] = useState<any[]>([]);

    useEffect(() => {
        async function fetchActivities() {
            const { data } = await supabase
                .from('activities')
                .select('*')
                .eq('lead_id', leadId)
                .order('created_at', { ascending: false });
            setActivities(data || []);
        }
        fetchActivities();
    }, [leadId]);

    return (
        <div className="space-y-4">
            {activities.map((act) => (
                <div key={act.id} className="relative pl-6 border-l-2 border-primary/20 pb-4">
                    <div className="absolute -left-1.5 top-1 h-3 w-3 rounded-full bg-primary" />
                    <p className="text-xs font-black tracking-tight">{act.subject}</p>
                    <p className="text-[10px] text-muted-foreground mt-1 font-medium leading-relaxed">{act.description}</p>
                    <p className="text-[8px] font-black uppercase tracking-widest text-primary/40 mt-2">
                        {format(new Date(act.created_at), 'MMM dd, hh:mm a')}
                    </p>
                </div>
            ))}
        </div>
    );
}

function Facebook(props: any) {
    return (
        <svg
            {...props}
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M24 12.0735C24 5.40561 18.6274 0 12 0C5.37258 0 0 5.40561 0 12.0735C0 18.1037 4.38823 23.0984 10.125 24V15.5625H7.07812V12.0735H10.125V9.41324C10.125 6.3875 11.916 4.71691 14.6576 4.71691C15.9705 4.71691 17.3438 4.95221 17.3438 4.95221V7.92647H15.8273C14.3359 7.92647 13.875 8.85765 13.875 9.8125V12.0735H17.2031L16.6711 15.5625H13.875V24C19.6118 23.0984 24 18.1037 24 12.0735Z" />
        </svg>
    );
}

function History(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="m12 7 0 5 3 3" />
        </svg>
    );
}

function User(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
}

function Users(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}
