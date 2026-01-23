"use client";

import { useState } from "react";
import { GradientHeading } from "@/components/ui/gradient-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    ArrowUpRight,
    ArrowDownLeft,
    Wallet,
    Calendar as CalendarIcon
} from "lucide-react";

export default function ExpensesPage() {
    const [transactions, setTransactions] = useState([
        { id: 1, type: "Expense", amount: 120.50, category: "Software", desc: "Adobe Sub", date: "2024-01-15" },
        { id: 2, type: "Income", amount: 2500.00, category: "Project", desc: "Website Payment", date: "2024-01-18" },
        { id: 3, type: "Expense", amount: 45.00, category: "Hosting", desc: "Vercel", date: "2024-01-20" },
    ]);

    const totalIncome = transactions.filter(t => t.type === 'Income').reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'Expense').reduce((acc, curr) => acc + curr.amount, 0);
    const profit = totalIncome - totalExpense;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <GradientHeading size="sm">Finance Tracker</GradientHeading>
                <div className="flex gap-2">
                    <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50"><ArrowUpRight className="h-4 w-4 mr-2" /> Add Expense</Button>
                    <Button className="bg-green-600 hover:bg-green-700 text-white"><ArrowDownLeft className="h-4 w-4 mr-2" /> Add Income</Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white dark:bg-zinc-900 border rounded-xl shadow-sm">
                    <div className="text-zinc-500 text-sm mb-1 font-medium">Net Profit</div>
                    <div className="text-3xl font-bold font-mono">${profit.toFixed(2)}</div>
                </div>
                <div className="p-6 bg-white dark:bg-zinc-900 border rounded-xl shadow-sm">
                    <div className="text-green-600 text-sm mb-1 font-medium flex items-center gap-1"><ArrowDownLeft className="h-3 w-3" /> Total Income</div>
                    <div className="text-2xl font-bold font-mono text-zinc-800 dark:text-zinc-200">${totalIncome.toFixed(2)}</div>
                </div>
                <div className="p-6 bg-white dark:bg-zinc-900 border rounded-xl shadow-sm">
                    <div className="text-red-500 text-sm mb-1 font-medium flex items-center gap-1"><ArrowUpRight className="h-3 w-3" /> Total Expenses</div>
                    <div className="text-2xl font-bold font-mono text-zinc-800 dark:text-zinc-200">${totalExpense.toFixed(2)}</div>
                </div>
            </div>

            {/* Transactions List */}
            <div className="bg-white dark:bg-zinc-900 border rounded-xl overflow-hidden">
                <div className="p-4 border-b bg-zinc-50 dark:bg-zinc-800 font-semibold text-sm text-zinc-500 flex justify-between">
                    <span>Recent Transactions</span>
                    <CalendarIcon className="h-4 w-4" />
                </div>
                <div className="divide-y dark:divide-zinc-800">
                    {transactions.map((t) => (
                        <div key={t.id} className="p-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${t.type === 'Income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                    {t.type === 'Income' ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                                </div>
                                <div>
                                    <div className="font-medium">{t.desc}</div>
                                    <div className="text-xs text-zinc-500">{t.category} • {t.date}</div>
                                </div>
                            </div>
                            <div className={`font-mono font-bold ${t.type === 'Income' ? 'text-green-600' : 'text-red-600'}`}>
                                {t.type === 'Income' ? '+' : '-'}${t.amount.toFixed(2)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
