"use client";

import { useState } from "react";
import { GradientHeading } from "@/components/ui/gradient-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Pin, Search } from "lucide-react";

export default function NotesPage() {
    const [notes, setNotes] = useState([
        { id: 1, title: "Meeting with Acme Corp", preview: "Discussed new timelines...", date: "2h ago", tags: ["Client", "Meeting"] },
        { id: 2, title: "Q4 Marketing Ideas", preview: "1. Social media campaign...", date: "Yesterday", tags: ["Ideas"] },
    ]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <GradientHeading size="sm">Notes Vault</GradientHeading>
                <Button className="bg-blue-600 text-white"><Plus className="h-4 w-4 mr-2" /> New Note</Button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <Input placeholder="Search notes..." className="pl-10" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {notes.map((note) => (
                    <div key={note.id} className="bg-white dark:bg-zinc-900 border rounded-xl p-6 shadow-sm hover:border-blue-500/50 transition-all cursor-pointer group">
                        <div className="flex justify-between items-start mb-3 animate-in fade-in">
                            <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">{note.title}</h3>
                            <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 text-zinc-400 hover:text-blue-500">
                                <Pin className="h-3 w-3" />
                            </Button>
                        </div>
                        <p className="text-zinc-500 text-sm mb-4 line-clamp-3">{note.preview}</p>
                        <div className="flex items-center justify-between mt-auto">
                            <div className="flex gap-1">
                                {note.tags.map(tag => (
                                    <Badge key={tag} variant="secondary" className="text-xs font-normal">{tag}</Badge>
                                ))}
                            </div>
                            <span className="text-xs text-zinc-400">{note.date}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
