"use client";

import { useState } from "react";
import { GradientHeading } from "@/components/ui/gradient-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
    Download,
    Plus,
    Trash2,
    Printer
} from "lucide-react";

interface LineItem {
    id: number;
    description: string;
    qty: number;
    price: number;
}

export default function InvoicesPage() {
    const [items, setItems] = useState<LineItem[]>([
        { id: 1, description: "Web Development Services", qty: 1, price: 1500 }
    ]);
    const [gstEnabled, setGstEnabled] = useState(false);

    const addItem = () => {
        setItems([...items, { id: Date.now(), description: "", qty: 1, price: 0 }]);
    };

    const removeItem = (id: number) => {
        setItems(items.filter(i => i.id !== id));
    };

    const updateItem = (id: number, field: keyof LineItem, value: any) => {
        setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
    };

    const subtotal = items.reduce((sum, item) => sum + (item.qty * item.price), 0);
    const tax = gstEnabled ? subtotal * 0.18 : 0;
    const total = subtotal + tax;

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <GradientHeading size="sm">Invoice Generator</GradientHeading>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2" onClick={() => window.print()}>
                        <Printer className="h-4 w-4" /> Print
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                        <Download className="h-4 w-4" /> Download PDF
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Invoice Form */}
                <div className="md:col-span-2 bg-white dark:bg-zinc-900 border rounded-xl shadow-sm p-8" id="invoice-preview">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-12">
                        <div>
                            <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">INVOICE</h1>
                            <p className="text-zinc-500">#INV-2024-001</p>
                        </div>
                        <div className="text-right">
                            <Input type="file" className="hidden" id="logo-upload" />
                            <div className="w-32 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center text-xs text-zinc-500 border border-dashed border-zinc-300">
                                Upload Logo
                            </div>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-8 mb-12">
                        <div className="space-y-4">
                            <div>
                                <Label className="text-xs text-zinc-500 uppercase">From</Label>
                                <Input className="mt-1 font-medium" placeholder="Your Business Name" />
                                <Textarea className="mt-1 h-20 text-sm resize-none" placeholder="Your Address..." />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <Label className="text-xs text-zinc-500 uppercase">Bill To</Label>
                                <Input className="mt-1 font-medium" placeholder="Client Name" />
                                <Textarea className="mt-1 h-20 text-sm resize-none" placeholder="Client Address..." />
                            </div>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="mb-12">
                        <div className="grid grid-cols-12 gap-4 mb-2 text-xs font-semibold text-zinc-500 uppercase">
                            <div className="col-span-6">Description</div>
                            <div className="col-span-2 text-right">Qty</div>
                            <div className="col-span-2 text-right">Price</div>
                            <div className="col-span-2 text-right">Total</div>
                        </div>
                        <div className="space-y-2">
                            {items.map((item) => (
                                <div key={item.id} className="grid grid-cols-12 gap-4 items-center group">
                                    <div className="col-span-6">
                                        <Input
                                            value={item.description}
                                            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                            placeholder="Item description"
                                            className="border-transparent hover:border-input focus:border-input px-2"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <Input
                                            type="number"
                                            value={item.qty}
                                            onChange={(e) => updateItem(item.id, 'qty', Number(e.target.value))}
                                            className="text-right border-transparent hover:border-input focus:border-input px-2"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <Input
                                            type="number"
                                            value={item.price}
                                            onChange={(e) => updateItem(item.id, 'price', Number(e.target.value))}
                                            className="text-right border-transparent hover:border-input focus:border-input px-2"
                                        />
                                    </div>
                                    <div className="col-span-2 flex items-center justify-end gap-2">
                                        <span className="font-mono">${(item.qty * item.price).toFixed(2)}</span>
                                        <button onClick={() => removeItem(item.id)} className="opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-50 p-1 rounded">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button variant="ghost" size="sm" onClick={addItem} className="mt-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                            <Plus className="h-4 w-4 mr-2" /> Add Line Item
                        </Button>
                    </div>

                    {/* Totals */}
                    <div className="flex justify-end">
                        <div className="w-1/2 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-500">Subtotal</span>
                                <span className="font-mono">${subtotal.toFixed(2)}</span>
                            </div>
                            {gstEnabled && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-500">GST (18%)</span>
                                    <span className="font-mono">${tax.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="border-t pt-3 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Settings */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-zinc-900 border rounded-xl p-6 shadow-sm">
                        <h3 className="font-semibold mb-4">Settings</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Enable GST</Label>
                                    <p className="text-xs text-zinc-500">Add 18% tax calculation</p>
                                </div>
                                <Switch checked={gstEnabled} onCheckedChange={setGstEnabled} />
                            </div>

                            <div className="space-y-2">
                                <Label>Currency</Label>
                                <Input value="USD ($)" disabled className="bg-zinc-50" />
                            </div>

                            <div className="space-y-2">
                                <Label>Due Date</Label>
                                <Input type="date" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
