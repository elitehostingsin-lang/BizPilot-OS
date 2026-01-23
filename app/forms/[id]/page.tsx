"use client";

export const runtime = "edge";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, CheckCircle2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface Question {
    id: string;
    text: string;
    type: string;
}

interface Form {
    id: string;
    title: string;
    questions: Question[];
    responses?: any[];
}

export default function FormPage() {
    const params = useParams();
    const [form, setForm] = useState<Form | null>(null);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchForm = async () => {
            if (!params.id) return;
            // Fetch form from Supabase
            // Note: This relies on "Public can read forms" policy
            // If table doesn't exist or RLS fails, this might fail.
            // For demo/localhost without running migrations, we fallback to a mock if specific ID used?
            // But let's try real fetch first.
            const { data, error } = await supabase.from('forms').select('*').eq('id', params.id).single();

            if (data) {
                setForm(data);
            } else if (localStorage.getItem('bizpilot_forms')) {
                // Fallback for demo if using localStorage in dashboard (not recommended but good for "localhost" resilience)
                const localForms = JSON.parse(localStorage.getItem('bizpilot_forms') || '[]');
                const found = localForms.find((f: any) => f.id === params.id);
                if (found) setForm(found);
            }
            setLoading(false);
        };
        fetchForm();
    }, [params.id]);

    const handleSubmit = async () => {
        if (!form) return;

        const response = {
            id: Date.now().toString(),
            data: answers,
            timestamp: new Date().toISOString(),
            clientId: 'anonymous'
        };

        // Optimistic update if valid
        setSubmitted(true);

        // Save to Supabase
        const updatedResponses = [...(form.responses || []), response];
        await supabase.from('forms').update({ responses: updatedResponses }).eq('id', form.id);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (submitted) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="max-w-md w-full border-0 shadow-lg text-center p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h1>
                <p className="text-gray-600">Your response has been recorded.</p>
            </Card>
        </div>
    );
    if (!form) return <div className="min-h-screen flex items-center justify-center">Form not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <Card className="border-0 shadow-lg">
                    <CardHeader className="bg-primary/5 pb-8 border-b border-border/40">
                        <CardTitle className="text-2xl font-bold">{form.title}</CardTitle>
                        <CardDescription>Please fill out the details below</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        {form.questions.map((q) => (
                            <div key={q.id} className="space-y-3">
                                <Label className="text-base font-medium">{q.text}</Label>
                                {q.type === 'text' && (
                                    <Input
                                        className="rounded-xl border-gray-200"
                                        onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                                    />
                                )}
                                {q.type === 'dropdown' && (
                                    <Select onValueChange={(val) => setAnswers({ ...answers, [q.id]: val })}>
                                        <SelectTrigger className="rounded-xl border-gray-200">
                                            <SelectValue placeholder="Select an option" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="option1">Option 1</SelectItem>
                                            <SelectItem value="option2">Option 2</SelectItem>
                                            <SelectItem value="option3">Option 3</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                                {q.type === 'checkbox' && (
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id={q.id}
                                            onCheckedChange={(checked) => setAnswers({ ...answers, [q.id]: checked })}
                                        />
                                        <Label htmlFor={q.id} className="font-normal text-gray-500">Yes, I agree</Label>
                                    </div>
                                )}
                            </div>
                        ))}

                        <Button className="w-full rounded-xl mt-8" size="lg" onClick={handleSubmit}>
                            Submit Response
                        </Button>
                    </CardContent>
                </Card>
                <div className="text-center mt-8 text-sm text-gray-400">
                    Powered by BizPilot OS
                </div>
            </div>
        </div>
    );
}
