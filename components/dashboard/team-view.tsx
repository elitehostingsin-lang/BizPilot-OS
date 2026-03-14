"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { GradientHeading } from "@/components/ui/gradient-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
    Users, Plus, Mail, Phone, TrendingUp,
    Shield, UserPlus, MoreVertical, Search,
    Loader2, CheckCircle2, Award, Zap, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export function TeamView() {
    const [teamMembers, setTeamMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        role: 'telecaller' as const,
    });

    useEffect(() => {
        loadTeam();
    }, []);

    const loadTeam = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from("team_members")
                .select("*")
                .eq("business_owner_id", user.id)
                .order("created_at", { ascending: false });

            if (error) throw error;
            setTeamMembers(data || []);
        } catch (error: any) {
            toast.error("Failed to load team");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateMember = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Unauthorized");

            const response = await fetch('/api/team/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    business_owner_id: user.id
                }),
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error);

            toast.success(`${formData.full_name} enlisted to the fleet!`);
            setShowDialog(false);
            setFormData({ full_name: '', email: '', phone: '', role: 'telecaller' });
            loadTeam();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8 p-0">
            {/* 🚀 Team Command Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                            <Shield className="h-6 w-6 text-primary" />
                        </div>
                        <GradientHeading size="sm">Fleet Command</GradientHeading>
                    </div>
                    <p className="text-muted-foreground mt-2 font-medium">Manage your elite telecallers and monitor performance metrics</p>
                </div>

                <Dialog open={showDialog} onOpenChange={setShowDialog}>
                    <DialogTrigger asChild>
                        <Button className="rounded-2xl bg-primary shadow-xl shadow-primary/20 gap-2 h-12 px-8 font-black">
                            <UserPlus className="h-5 w-5" /> Enlist Member
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-[2.5rem] border-border/40 bg-background/80 backdrop-blur-3xl shadow-2xl lg:max-w-lg">
                        <DialogHeader>
                            <DialogTitle className="text-3xl font-black tracking-tighter">Recruit Team Member</DialogTitle>
                            <p className="text-muted-foreground font-medium">Deploy a new member to your lead distribution hub.</p>
                        </DialogHeader>
                        <form onSubmit={handleCreateMember} className="space-y-6 py-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Identity Name</Label>
                                <Input
                                    placeholder="e.g., Alex Johnson"
                                    className="h-12 rounded-2xl bg-muted/20 border-border/50 focus:bg-background transition-all font-bold"
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Communication Email</Label>
                                <Input
                                    type="email"
                                    placeholder="alex@bizpilot.os"
                                    className="h-12 rounded-2xl bg-muted/20 border-border/50 focus:bg-background transition-all font-bold"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Operation Phone</Label>
                                    <Input
                                        placeholder="+91..."
                                        className="h-12 rounded-2xl bg-muted/20 border-border/50 focus:bg-background transition-all font-bold"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Vessel Role</Label>
                                    <select
                                        className="w-full h-12 rounded-2xl bg-muted/20 border-border/50 px-4 text-sm font-bold focus:bg-background outline-none appearance-none cursor-pointer"
                                        value={formData.role}
                                        onChange={(e: any) => setFormData({ ...formData, role: e.target.value })}
                                    >
                                        <option value="telecaller">Tele-Officer</option>
                                        <option value="manager">Fleet Manager</option>
                                        <option value="admin">Admin Commander</option>
                                    </select>
                                </div>
                            </div>
                            <Button
                                className="w-full h-14 rounded-3xl bg-primary text-primary-foreground font-black text-lg shadow-2xl shadow-primary/30 mt-4 group"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                                    <span className="flex items-center gap-2">Confirm Recruitment <Zap className="h-5 w-5 fill-current" /></span>
                                )}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* 📊 Fleet Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border-border/50 shadow-xl bg-card/80 backdrop-blur-xl group overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                        <Users className="h-12 w-12" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardDescription className="text-[10px] font-black uppercase tracking-widest">Active Fleet size</CardDescription>
                        <CardTitle className="text-3xl font-black">{teamMembers.length}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-[10px] text-emerald-500 font-black">+2 Since last cycle</p>
                    </CardContent>
                </Card>
            </div>

            {/* 📋 Team Roster Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {loading ? (
                        [1, 2, 3].map(i => <Card key={i} className="h-64 border-border/50 shadow-lg bg-background/40 animate-pulse rounded-3xl" />)
                    ) : teamMembers.map((member) => (
                        <motion.div
                            key={member.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <Card className="border-border/50 shadow-2xl bg-card/80 backdrop-blur-xl hover:border-primary/40 transition-all overflow-hidden relative rounded-[2.5rem] group">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <div className="flex items-center gap-4">
                                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20">
                                            <span className="text-xl font-black text-primary">{(member.full_name || 'U').charAt(0)}</span>
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-black">{member.full_name || 'Unnamed Member'}</CardTitle>
                                            <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[8px] font-black uppercase tracking-widest mt-1">
                                                {(member.role || 'telecaller') === 'telecaller' ? 'TELE-OFFICER' : (member.role || 'telecaller').toUpperCase()}
                                            </Badge>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10">
                                        <MoreVertical className="h-5 w-5" />
                                    </Button>
                                </CardHeader>
                                <CardContent className="space-y-6 pt-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center text-xs font-bold text-muted-foreground gap-3">
                                            <Mail className="h-4 w-4 opacity-50" /> {member.email}
                                        </div>
                                        {member.phone && (
                                            <div className="flex items-center text-xs font-bold text-muted-foreground gap-3">
                                                <Phone className="h-4 w-4 opacity-50" /> {member.phone}
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border/20">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Assigned</p>
                                            <p className="text-2xl font-black">{member.total_leads_assigned}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Conversion</p>
                                            <div className="flex items-center gap-2">
                                                <p className="text-2xl font-black">{member.conversion_rate || 0}%</p>
                                                <TrendingUp className="h-5 w-5 text-emerald-500" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <Button variant="outline" className="flex-1 rounded-2xl h-12 font-bold text-xs border-border/50 hover:bg-primary/5 transition-all">
                                            Performance
                                        </Button>
                                        <Button className="flex-1 rounded-2xl h-12 font-black text-xs shadow-lg shadow-primary/20 group">
                                            Assign Lead <Zap className="h-3 w-3 ml-1.5 fill-current opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </Button>
                                    </div>
                                </CardContent>
                                {member.is_active && (
                                    <div className="absolute top-6 right-6 flex items-center gap-1.5">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Active</span>
                                    </div>
                                )}
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {!loading && teamMembers.length === 0 && (
                <div className="py-32 text-center space-y-6">
                    <div className="h-24 w-24 bg-muted/10 rounded-full flex items-center justify-center mx-auto border-2 border-dashed border-border/40 opacity-30">
                        <Users className="h-10 w-10" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-black tracking-tight">Fleet Depleted</h3>
                        <p className="text-muted-foreground font-medium max-w-sm mx-auto mt-2">Enlist your first team member to start distributing Meta leads and scaling operations.</p>
                    </div>
                    <Button className="rounded-3xl h-14 px-10 font-black text-lg shadow-2xl shadow-primary/30" onClick={() => setShowDialog(true)}>
                        Recruit First Officer
                    </Button>
                </div>
            )}
        </div>
    );
}
