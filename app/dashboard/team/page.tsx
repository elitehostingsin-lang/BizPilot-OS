"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
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
    Loader2, CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function TeamPage() {
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
            toast.error("Failed to load team: " + error.message);
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
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer placeholder', // In real app, passes user token
                    'x-owner-id': user.id
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error);

            toast.success(`${formData.full_name} added to the pilot team!`);
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
        <div className="space-y-8 p-1">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <GradientHeading size="sm">Team & Fleet</GradientHeading>
                    <p className="text-muted-foreground text-sm mt-1 font-medium">Manage your telecallers and track their conversion rates</p>
                </div>

                <Dialog open={showDialog} onOpenChange={setShowDialog}>
                    <DialogTrigger asChild>
                        <Button className="rounded-2xl bg-primary shadow-lg shadow-primary/20 gap-2 h-11 px-8">
                            <UserPlus className="h-4 w-4" /> Add Member
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-[2.5rem] border-border/50 bg-background/80 backdrop-blur-2xl shadow-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black tracking-tight">Expand Your Fleet</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateMember} className="space-y-6 py-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</Label>
                                <Input
                                    placeholder="e.g., Alex Johnson"
                                    className="h-12 rounded-2xl bg-muted/20 border-border/50 focus:bg-background transition-all"
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Work Email</Label>
                                <Input
                                    type="email"
                                    placeholder="alex@company.com"
                                    className="h-12 rounded-2xl bg-muted/20 border-border/50 focus:bg-background transition-all"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Phone</Label>
                                    <Input
                                        placeholder="+1..."
                                        className="h-12 rounded-2xl bg-muted/20 border-border/50 focus:bg-background transition-all"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">System Role</Label>
                                    <select
                                        className="w-full h-12 rounded-2xl bg-muted/20 border-border/50 px-4 text-sm font-medium focus:bg-background outline-none appearance-none cursor-pointer"
                                        value={formData.role}
                                        onChange={(e: any) => setFormData({ ...formData, role: e.target.value })}
                                    >
                                        <option value="telecaller">Telecaller</option>
                                        <option value="manager">Fleet Manager</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>
                            <Button
                                className="w-full h-14 rounded-3xl bg-primary text-primary-foreground font-black text-lg shadow-xl shadow-primary/20 mt-4"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : "Deploy Team Member"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border-border/50 shadow-xl shadow-primary/5 bg-background/60 backdrop-blur-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <Users className="h-12 w-12" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardDescription className="text-xs font-black uppercase tracking-widest">Active Fleet</CardDescription>
                        <CardTitle className="text-3xl font-black">{teamMembers.length}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-[10px] text-emerald-500 font-black">+2 Since last month</p>
                    </CardContent>
                </Card>
                {/* Add more metric cards here if needed */}
            </div>

            {/* Team Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {loading ? (
                        [1, 2, 3].map(i => <Card key={i} className="h-64 border-border/50 shadow-lg bg-background/60 animate-pulse" />)
                    ) : teamMembers.map((member) => (
                        <motion.div
                            key={member.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ y: -4 }}
                        >
                            <Card className="border-border/50 shadow-xl shadow-primary/5 bg-background/60 backdrop-blur-xl hover:shadow-primary/10 transition-all overflow-hidden relative">
                                <CardHeader className="flex flex-row items-start justify-between pb-2">
                                    <div className="flex items-center gap-4">
                                        <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                            <span className="text-lg font-black text-primary">{member.full_name.charAt(0)}</span>
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg font-black">{member.full_name}</CardTitle>
                                            <Badge variant="secondary" className="bg-primary/5 text-primary border-none text-[10px] font-black uppercase tracking-tighter mt-1">
                                                {member.role === 'telecaller' ? 'TELE-OFFICER' : member.role}
                                            </Badge>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </CardHeader>
                                <CardContent className="space-y-6 pt-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center text-xs font-bold text-muted-foreground gap-2">
                                            <Mail className="h-3.5 w-3.5" /> {member.email}
                                        </div>
                                        {member.phone && (
                                            <div className="flex items-center text-xs font-bold text-muted-foreground gap-2">
                                                <Phone className="h-3.5 w-3.5" /> {member.phone}
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border/20">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Assigned</p>
                                            <p className="text-xl font-black mt-1">{member.total_leads_assigned}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Conversion</p>
                                            <div className="flex items-center gap-1.5 mt-1">
                                                <p className="text-xl font-black">{member.conversion_rate || 0}%</p>
                                                <TrendingUp className="h-4 w-4 text-emerald-500" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 mt-4">
                                        <Button variant="outline" className="w-full rounded-xl text-xs font-bold border-border/50 h-10">
                                            Performance
                                        </Button>
                                        <Button className="w-full rounded-xl text-xs font-bold h-10 shadow-lg shadow-primary/20">
                                            Assign Lead
                                        </Button>
                                    </div>
                                </CardContent>
                                {member.is_active && (
                                    <div className="absolute top-4 right-4 translate-x-12 -translate-y-12 rotate-45 bg-emerald-500/10 p-1 px-4 border border-emerald-500/20">
                                        <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Online</span>
                                    </div>
                                )}
                            </Card>
                        </motion.div>
                    ))}
                    {!loading && teamMembers.length === 0 && (
                        <div className="col-span-full py-20 text-center space-y-4">
                            <div className="h-20 w-20 bg-muted/20 rounded-full flex items-center justify-center mx-auto border-2 border-dashed border-border/50">
                                <Shield className="h-8 w-8 text-muted-foreground opacity-20" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black">No Team Members Yet</h3>
                                <p className="text-muted-foreground font-medium text-sm">Start building your fleet to maximize lead conversion.</p>
                            </div>
                            <Button className="rounded-2xl" onClick={() => setShowDialog(true)}>
                                Recruit Member
                            </Button>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
