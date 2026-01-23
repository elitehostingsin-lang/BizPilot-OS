"use client";

import { useState } from "react";
import { GradientHeading } from "@/components/ui/gradient-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox"; // Assuming shadcn checkbox
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Calendar } from "lucide-react";

// Need to create checkbox if not exists, but I'll use standard input type checkbox for speed if needed, 
// or I'll implement a simple Checkbox component inline or import if I trust my previous install command installed it.
// I did NOT install checkbox specifically in the long command (I missed it? I checked: '@radix-ui/react-checkbox' was NOT in the command).
// So I will use native checkbox or create a simple one.

function SimpleCheckbox({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: (c: boolean) => void }) {
    return (
        <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onCheckedChange(e.target.checked)}
            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
    );
}

export default function TasksPage() {
    const [tasks, setTasks] = useState([
        { id: 1, title: "Call client about invoice #001", priority: "High", completed: false },
        { id: 2, title: "Update website landing page copy", priority: "Medium", completed: true },
        { id: 3, title: "Prepare Q3 financial report", priority: "Low", completed: false },
    ]);
    const [newTask, setNewTask] = useState("");

    const addTask = () => {
        if (!newTask) return;
        setTasks([...tasks, { id: Date.now(), title: newTask, priority: "Medium", completed: false }]);
        setNewTask("");
    };

    const toggleTask = (id: number) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const deleteTask = (id: number) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <GradientHeading size="sm">Task Planner</GradientHeading>

            <div className="flex gap-2">
                <Input
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Add a new task..."
                    onKeyDown={(e) => e.key === 'Enter' && addTask()}
                />
                <Button onClick={addTask} className="bg-blue-600 text-white">
                    <Plus className="h-4 w-4" />
                </Button>
            </div>

            <div className="bg-white dark:bg-zinc-900 border rounded-xl shadow-sm divide-y dark:divide-zinc-800">
                {tasks.map((task) => (
                    <div key={task.id} className="p-4 flex items-center gap-4 group hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                        <SimpleCheckbox checked={task.completed} onCheckedChange={() => toggleTask(task.id)} />
                        <div className={`flex-1 ${task.completed ? 'line-through text-zinc-400' : ''}`}>
                            {task.title}
                        </div>
                        <Badge variant={task.priority === 'High' ? 'destructive' : 'secondary'} className="text-xs">
                            {task.priority}
                        </Badge>
                        <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-red-500">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
                {tasks.length === 0 && (
                    <div className="p-8 text-center text-zinc-500">No tasks yet. Add one above!</div>
                )}
            </div>
        </div>
    );
}
