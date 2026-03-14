"use client";

import React, { useState, useEffect, useMemo } from 'react';
// import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
    LayoutDashboard, FileText, Receipt, Users, CheckSquare, FileCheck, DollarSign, ClipboardList, Globe, Code, Lock,
    Plus, Copy, Download, MoreVertical, TrendingUp, TrendingDown, Wallet, Clock, AlertCircle, Check, X, Edit, Trash2, ChevronRight,
    LogOut, User, Settings, Bell, HelpCircle, MessageSquare, Mail, Shield, CreditCard, Calendar, Link as LinkIcon, Image as ImageIcon,
    BookOpen, MessageCircle, Search, ArrowUpRight, Loader2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { motion, AnimatePresence } from 'framer-motion';

interface Employee {
    id: string;
    name: string;
    role: string;
    email?: string;
    password?: string;
}

interface Activity { id: string; type: string; description: string; time: string; timestamp: number; user?: string; }
interface Lead { id: string; name: string; contact: string; source: string; status: 'New' | 'Follow-up' | 'Closed'; notes: string; followUpDate: string; priority: 'Low' | 'Medium' | 'High'; quality: 'Hot' | 'Warm' | 'Cold'; assignedTo?: string; history: { action: string; time: string }[]; }
interface Task { id: string; title: string; status: 'To-Do' | 'In Progress' | 'Done'; priority: 'Low' | 'Medium' | 'High'; dueDate: string; subtasks: { id: string; title: string; status: 'To-Do' | 'Done' }[]; dependencyId?: string; assignedTo?: string; history: string[]; }
interface Invoice { id: string; clientName: string; clientEmail?: string; amount: number; currency: string; status: 'Draft' | 'Sent' | 'Paid' | 'Overdue'; date: string; description: string; items: { description: string; qty: number; price: number; }[]; tax: { cgst: number; sgst: number; igst: number; }; followUps: { type: 'Call' | 'Message' | 'WhatsApp'; date: string }[]; }
interface FinanceEntry { id: string; type: 'income' | 'expense'; amount: number; category: string; date: string; description: string; month: string; year: string; }
interface Note { id: string; title: string; content: string; tags: string[]; date: string; version: number; variations?: string[]; images?: string[]; status: 'Draft' | 'Final'; isSensitive?: boolean; isLocked?: boolean; }
interface SupportTicket { id: string; subject: string; message: string; status: 'Open' | 'In Progress' | 'Resolved'; priority: 'Low' | 'Medium' | 'High'; date: string; }
interface UserProfile { name: string; email: string; company: string; role: string; plan: 'Free' | 'Paid'; joinDate: string; avatar: string; businessLogo?: string; address: string; taxId: string; website: string; employees: Employee[]; subscription_status?: string; last_payment_date?: string; }
interface UserSettings { currency: string; gstEnabled: boolean; dateFormat: string; invoicePrefix: string; autoReminder: boolean; taxRate: number; }
interface Proposal { id: string; title: string; clientName: string; status: 'Draft' | 'Sent' | 'Approved'; introduction: string; scope: string; pricing: string; timeline: string; terms: string; date: string; version: number; }
interface Form { id: string; title: string; questions: { id: string; text: string; type: string }[]; responses: { id: string; data: any; timestamp: string; clientId?: string }[]; }

const currencies = [
    { code: 'USD', symbol: '$', flag: '🇺🇸', label: 'US Dollar' },
    { code: 'INR', symbol: '₹', flag: '🇮🇳', label: 'Indian Rupee' },
    { code: 'EUR', symbol: '€', flag: '🇪🇺', label: 'Euro' },
    { code: 'GBP', symbol: '£', flag: '🇬🇧', label: 'British Pound' },
    { code: 'AED', symbol: 'د.إ', flag: '🇦🇪', label: 'UAE Dirham' },
];

const BizPilotDashboard = () => {
    const [activeView, setActiveView] = useState('dashboard');
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
    const [isActivatingTrial, setIsActivatingTrial] = useState(false);
    const router = useRouter();

    // Persistence and State
    const [activities, setActivities] = useState<Activity[]>([]);
    const [proposals, setProposals] = useState<any[]>([]);
    const [forms, setForms] = useState<any[]>([]);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [financeEntries, setFinanceEntries] = useState<FinanceEntry[]>([]);
    const [notes, setNotes] = useState<Note[]>([]);
    const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
    const [userProfile, setUserProfile] = useState<UserProfile>({
        name: 'Business Owner',
        email: 'user@example.com',
        company: 'Your Business',
        role: 'Founder',
        plan: 'Paid',
        joinDate: 'January 2024',
        avatar: 'JD',
        address: '123 Business Way, City, State',
        taxId: 'TAX-000000',
        website: 'www.yourbusiness.com',
        employees: [
            { id: '1', name: 'John Doe', role: 'Admin' },
            { id: '2', name: 'Jane Smith', role: 'Sales' }
        ]
    });
    const [userSettings, setUserSettings] = useState<UserSettings>({
        currency: 'USD',
        gstEnabled: false,
        dateFormat: 'MM/DD/YYYY',
        invoicePrefix: 'INV-',
        autoReminder: true,
        taxRate: 18
    });

    // Finance Calculations
    const totalRevenue = useMemo(() =>
        financeEntries.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0),
        [financeEntries]);

    const totalExpenses = useMemo(() =>
        financeEntries.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0),
        [financeEntries]);

    const profit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;
    const currencySymbol = currencies.find(c => c.code === userSettings.currency)?.symbol || '$';

    const { isPaid, isExpired, diffDays } = useMemo(() => {
        const isPaid = true; // 100% Free - All users are Pro
        const joinDate = new Date(userProfile.joinDate || 'January 2024');
        const trialEndDate = new Date(joinDate);
        trialEndDate.setMonth(trialEndDate.getMonth() + 1);
        const today = new Date();
        const diffTime = trialEndDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const isExpired = diffDays <= 0;
        return { isPaid, isExpired, diffDays };
    }, [userProfile]);

    // Load initial data from Supabase
    useEffect(() => {
        const fetchData = async () => {
            setIsLoadingData(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                // Parallel fetching for performance
                const [
                    { data: leadsData },
                    { data: tasksData },
                    { data: invoicesData },
                    { data: financeData },
                    { data: notesData },
                    { data: ticketsData },
                    { data: activitiesData },
                    { data: proposalsData },
                    { data: formsData },
                    { data: profileData },
                    { data: settingsData }
                ] = await Promise.all([
                    supabase.from('leads').select('*').order('id', { ascending: false }),
                    supabase.from('tasks').select('*').order('id', { ascending: false }),
                    supabase.from('invoices').select('*').order('id', { ascending: false }),
                    supabase.from('finance_entries').select('*').order('id', { ascending: false }),
                    supabase.from('notes').select('*').order('id', { ascending: false }),
                    supabase.from('support_tickets').select('*').order('id', { ascending: false }),
                    supabase.from('activities').select('*').order('timestamp', { ascending: false }).limit(50),
                    supabase.from('proposals').select('*').order('id', { ascending: false }),
                    supabase.from('forms').select('*').order('id', { ascending: false }),
                    supabase.from('user_profiles').select('*').single(),
                    supabase.from('user_settings').select('*').single()
                ]);

                // Role & ID from Unified Login Flow
                const savedRole = localStorage.getItem('bizpilot_role') as 'Owner' | 'Employee';
                const savedEmpId = localStorage.getItem('bizpilot_employee_id');
                if (savedRole) setActiveRole(savedRole);
                if (savedEmpId) setActiveEmployeeId(savedEmpId);

                if (leadsData) setLeads(leadsData);
                if (tasksData) setTasks(tasksData);
                if (invoicesData) setInvoices(invoicesData);
                if (financeData) setFinanceEntries(financeData);
                if (notesData) setNotes(notesData);
                if (ticketsData) setSupportTickets(ticketsData);
                if (activitiesData) setActivities(activitiesData);
                if (proposalsData) setProposals(proposalsData);
                if (formsData) setForms(formsData);
                if (profileData) {
                    const mappedProfile = {
                        ...profileData,
                        joinDate: profileData.join_date || 'January 2024'
                    };
                    setUserProfile(mappedProfile);
                    setTempProfile(mappedProfile);
                }
                if (settingsData) {
                    setUserSettings(settingsData);
                    setTempSettings(settingsData);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoadingData(false);
            }
        };

        fetchData();
    }, []);

    // Helper for real-time saving
    const syncToSupabase = async (table: string, data: any) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const schemaFields: Record<string, string[]> = {
                leads: ['id', 'user_id', 'name', 'contact', 'source', 'status', 'quality', 'assignedTo', 'notes', 'followUpDate', 'priority', 'history'],
                tasks: ['id', 'user_id', 'title', 'status', 'priority', 'dueDate', 'subtasks', 'history', 'created_at'],
                invoices: ['id', 'user_id', 'clientName', 'amount', 'currency', 'status', 'date', 'description', 'items', 'tax', 'followUps', 'created_at'],
                finance_entries: ['id', 'user_id', 'type', 'amount', 'category', 'date', 'description', 'month', 'year', 'created_at'],
                notes: ['id', 'user_id', 'title', 'content', 'date', 'tags', 'is_pinned', 'created_at'],
                support_tickets: ['id', 'user_id', 'subject', 'priority', 'status', 'date', 'message', 'created_at'],
                activities: ['id', 'user_id', 'type', 'description', 'time', 'timestamp', 'user_name', 'created_at'],
                proposals: ['id', 'user_id', 'title', 'clientName', 'status', 'introduction', 'scope', 'pricing', 'timeline', 'terms', 'date', 'version', 'created_at'],
                user_profiles: ['user_id', 'name', 'company', 'email', 'avatar', 'employees'],
                user_settings: ['user_id', 'currency', 'gstEnabled', 'taxRate', 'theme']
            };

            const prepareItem = (item: any) => {
                const base = { ...item, user_id: user.id };

                // Special mappings
                if (table === 'activities' && 'user' in base) {
                    base.user_name = base.user;
                }

                if (schemaFields[table]) {
                    const filtered: any = {};
                    schemaFields[table].forEach(field => {
                        if (field in base) {
                            filtered[field] = base[field];
                        }
                    });
                    return filtered;
                }
                return base;
            };

            const dataToSync = Array.isArray(data)
                ? data.map(prepareItem)
                : prepareItem(data);

            const { error } = await supabase.from(table).upsert(dataToSync);
            if (error) console.error(`Error syncing ${table}:`, error);
        } catch (err) {
            console.error(`Unexpected sync error for ${table}:`, err);
        }
    };

    // Form States
    const [newLead, setNewLead] = useState<Partial<Lead>>({ status: 'New', quality: 'Cold' });
    const [newTask, setNewTask] = useState<Partial<Task>>({ status: 'To-Do', priority: 'Medium' });
    const [newInvoice, setNewInvoice] = useState<Partial<Invoice>>({ status: 'Draft', items: [{ description: '', qty: 1, price: 0 }], currency: userSettings.currency });
    const [newFinance, setNewFinance] = useState<Partial<FinanceEntry>>({ type: 'income' });
    const [newNote, setNewNote] = useState<Partial<Note>>({ status: 'Draft' });
    const [newTicket, setNewTicket] = useState<Partial<SupportTicket>>({ status: 'Open', priority: 'Medium' });
    const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
    const [editingLead, setEditingLead] = useState<Lead | null>(null);
    const [newEmployee, setNewEmployee] = useState({ name: '', role: 'Telecaller', email: '', password: '' });
    const [activeRole, setActiveRole] = useState<'Owner' | 'Employee'>('Owner');
    const [activeEmployeeId, setActiveEmployeeId] = useState<string | null>(null);
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [newProposal, setNewProposal] = useState({
        title: '',
        clientName: '',
        introduction: '',
        scope: '',
        pricing: '',
        timeline: '',
        terms: '',
        status: 'Draft' as const
    });
    const [newForm, setNewForm] = useState<{ id?: string, title: string, questions: any[] }>({
        id: Date.now().toString(),
        title: '',
        questions: [{ id: '1', text: '', type: 'text' }]
    });
    const [editorContent, setEditorContent] = useState('');
    const [auditScores, setAuditScores] = useState<Record<string, boolean>>({});
    const [crmFilter, setCrmFilter] = useState('All');
    const [taskFilter, setTaskFilter] = useState('Today');
    const [tempProfile, setTempProfile] = useState<UserProfile>(userProfile);
    const [tempSettings, setTempSettings] = useState<UserSettings>(userSettings);

    // Support & Chat State
    const [showHelpCenter, setShowHelpCenter] = useState(false);
    const [showLiveChat, setShowLiveChat] = useState(false);
    const [helpSearch, setHelpSearch] = useState('');
    const [helpArticles] = useState([
        { id: '1', title: 'Getting Started with BizPilot', content: 'Welcome to BizPilot! This guide covers the basics of setting up your profile, configuring your settings, and inviting your team members.' },
        { id: '2', title: 'How to create an invoice?', content: 'Go to the Finance tab, click "New Invoice", fill in the client details and items. You can save as draft or mark as sent.' },
        { id: '3', title: 'Managing Team Members', content: 'You can add team members from the Settings > Team tab. Assign roles like Admin or Employee to control their access levels.' },
        { id: '4', title: 'Exporting Reports', content: 'You can export your financial data as CSV or generate PDF reports for your invoices and audits directly from their respective tabs.' },
    ]);
    const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'bot', text: string, time: string }[]>([
        { role: 'bot', text: 'Hello! How can I help you today?', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    const [chatInput, setChatInput] = useState('');

    // Handlers
    const handleSaveProposal = async () => {
        if (!newProposal.introduction || !newProposal.clientName) return;
        const proposal: Proposal = {
            id: Date.now().toString(),
            title: newProposal.title || `Proposal for ${newProposal.clientName}`,
            clientName: newProposal.clientName,
            status: newProposal.status as any || 'Draft',
            introduction: newProposal.introduction,
            scope: newProposal.scope,
            pricing: newProposal.pricing,
            timeline: newProposal.timeline,
            terms: newProposal.terms,
            date: new Date().toLocaleDateString(),
            version: 1
        };
        setProposals(prev => [proposal, ...prev]);
        addActivity('proposals', `Proposal saved for ${newProposal.clientName}`);
        setNewProposal({ title: '', clientName: '', introduction: '', scope: '', pricing: '', timeline: '', terms: '', status: 'Draft' });
        await syncToSupabase('proposals', proposal);
    };

    const handleGenerateFormLink = () => {
        // Fallback ID if creating new form not fully persisted yet, but usually we generate link for "newForm" or "selectedForm"
        // Here we assume we are generating link for the 'current' form being edited (newForm) but it needs an ID. 
        // If it returns a new draft ID, we use that.
        const formId = newForm.id || Date.now().toString();
        const link = `${window.location.origin}/forms/${formId}`;
        handleCopy(link);
        addActivity('forms', `Form link generated: ${link}`);
    };

    const handleSaveForm = async () => {
        if (!newForm.title) return;

        const form = {
            id: newForm.id || Date.now().toString(),
            title: newForm.title,
            questions: newForm.questions,
            responses: [], // Initialize with empty responses
            created_at: new Date().toISOString()
        };

        // Update local state
        setForms(prev => {
            const exists = prev.find(f => f.id === form.id);
            if (exists) {
                return prev.map(f => f.id === form.id ? form : f);
            }
            return [form, ...prev];
        });

        // Sync to Supabase
        await syncToSupabase('forms', form);

        addActivity('forms', `Form saved: ${form.title}`);

        // Don't clear form immediately as user might want to continue editing or share link
        // But ensure ID is set in state for future updates
        if (!newForm.id) {
            setNewForm(prev => ({ ...prev, id: form.id }));
        }
    };

    const handleSubmitTicket = async () => {
        if (!newTicket.subject || !newTicket.message) return;

        const ticket: SupportTicket = {
            id: Date.now().toString(),
            subject: newTicket.subject,
            priority: newTicket.priority || 'Medium',
            status: 'Open',
            date: new Date().toLocaleDateString(),
            message: newTicket.message
        };

        setSupportTickets(prev => [ticket, ...prev]);
        addActivity('support', `New support ticket: ${ticket.subject}`);
        setNewTicket({ status: 'Open', priority: 'Medium', subject: '', message: '' }); // Reset form

        await syncToSupabase('support_tickets', ticket);
    };

    const handleExportCSV = () => {
        addActivity('system', 'Exporting data to CSV...');
        // Simulation of export delay
        setTimeout(() => {
            addActivity('system', 'CSV Export complete');
        }, 1500);
    };
    const handleSendMessage = () => {
        if (!chatInput.trim()) return;

        const newMessage = { role: 'user' as const, text: chatInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        setChatMessages(prev => [...prev, newMessage]);
        setChatInput('');

        // Simulate bot response
        setTimeout(() => {
            const botResponses = [
                "I understand. Could you provide more details?",
                "Our team is looking into this for you.",
                "Have you tried checking our Help Center for this issue?",
                "Please hold on while I connect you to a human agent.",
                "That's a great question! Here is what I found..."
            ];
            const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
            setChatMessages(prev => [...prev, {
                role: 'bot',
                text: randomResponse,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        }, 1000);
    };

    const addActivity = async (type: string, description: string) => {
        const userName = activeRole === 'Employee'
            ? (userProfile.employees?.find(e => e.id === activeEmployeeId)?.name || 'Employee')
            : userProfile.name;

        const activity: Activity = {
            id: Date.now().toString(),
            type,
            description,
            time: 'Just now',
            timestamp: Date.now(),
            user: userName
        };
        setActivities(prev => [activity, ...prev].slice(0, 50));
        await syncToSupabase('activities', activity);
    };

    const handleAddLead = async () => {
        if (!newLead.name) return;
        const lead: Lead = {
            id: Date.now().toString(),
            name: newLead.name,
            contact: newLead.contact || '',
            source: newLead.source || '',
            status: newLead.status as 'New' | 'Follow-up' | 'Closed' || 'New',
            quality: newLead.quality as 'Hot' | 'Warm' | 'Cold' || 'Cold',
            assignedTo: newLead.assignedTo,
            notes: newLead.notes || '',
            followUpDate: newLead.followUpDate || new Date().toISOString().split('T')[0],
            priority: newLead.priority || 'Medium',
            history: [{ action: 'Lead created', time: 'Just now' }]
        };
        setLeads([...leads, lead]);
        addActivity('lead', `New lead added: ${lead.name}`);
        setNewLead({ status: 'New' });
        await syncToSupabase('leads', lead);
    };

    const handleUpdateLead = async () => {
        if (!editingLead) return;
        setLeads(leads.map(l => l.id === editingLead.id ? editingLead : l));
        addActivity('lead', `Lead updated: ${editingLead.name}`);
        const updatedLead = editingLead;
        setEditingLead(null);
        await syncToSupabase('leads', updatedLead);
    };

    const handleManualEmployeeLogin = () => {
        setLoginError('');
        const employee = userProfile.employees.find(e => e.email === loginEmail && e.password === loginPassword);
        if (employee) {
            setActiveRole('Employee');
            setActiveEmployeeId(employee.id);
            setActiveView('crm');
            setLoginEmail('');
            setLoginPassword('');
            addActivity('system', `Manual login: ${employee.name}`);
        } else {
            setLoginError('Invalid email or password');
        }
    };

    const handleAddEmployee = async () => {
        if (!newEmployee.name || !newEmployee.email || !newEmployee.password) return;
        const employee: Employee = {
            id: Date.now().toString(),
            name: newEmployee.name,
            role: newEmployee.role,
            email: newEmployee.email,
            password: newEmployee.password
        };
        const updatedProfile = {
            ...userProfile,
            employees: [...(userProfile.employees || []), employee]
        };
        setUserProfile(updatedProfile);
        setTempProfile(updatedProfile);
        setNewEmployee({ name: '', role: 'Telecaller', email: '', password: '' });
        addActivity('team', `New employee added: ${employee.name}`);
        await syncToSupabase('user_profiles', updatedProfile);
    };

    const handleDeleteEmployee = async (id: string) => {
        const updatedEmployees = (userProfile.employees || []).filter(e => e.id !== id);
        const updatedProfile = { ...userProfile, employees: updatedEmployees };
        setUserProfile(updatedProfile);
        setTempProfile(updatedProfile);
        addActivity('team', 'Employee removed');
        await syncToSupabase('user_profiles', updatedProfile);
    };

    const handleCreateTask = async () => {
        if (!newTask.title) return;
        const task: Task = {
            id: Date.now().toString(),
            title: newTask.title,
            status: newTask.status as 'To-Do' | 'In Progress' | 'Done' || 'To-Do',
            priority: newTask.priority || 'Medium',
            dueDate: newTask.dueDate || new Date().toISOString().split('T')[0],
            subtasks: [],
            history: ['Task created']
        };
        setTasks([...tasks, task]);
        addActivity('task', `New task created: ${task.title}`);
        setNewTask({ status: 'To-Do', priority: 'Medium' });
        await syncToSupabase('tasks', task);
    };

    const handleCreateInvoice = async () => {
        if (!newInvoice.clientName) return;
        const totalAmount = newInvoice.items?.reduce((acc, item) => acc + (item.qty * item.price), 0) || 0;
        const invoice: Invoice = {
            id: Date.now().toString(),
            clientName: newInvoice.clientName,
            amount: totalAmount,
            currency: newInvoice.currency || userSettings.currency,
            status: newInvoice.status as 'Draft' | 'Sent' | 'Paid' | 'Overdue' || 'Draft',
            date: newInvoice.date || new Date().toISOString().split('T')[0],
            description: newInvoice.description || '',
            items: newInvoice.items || [],
            tax: newInvoice.tax || { cgst: 0, sgst: 0, igst: 0 },
            followUps: []
        };
        setInvoices([...invoices, invoice]);
        addActivity('invoice', `Invoice created for ${invoice.clientName} - ${invoice.currency} ${totalAmount}`);
        setNewInvoice({ status: 'Draft', items: [{ description: '', qty: 1, price: 0 }] });
        await syncToSupabase('invoices', invoice);
    };

    const handleUpdateInvoice = async () => {
        if (!editingInvoice) return;
        setInvoices(invoices.map(inv => inv.id === editingInvoice.id ? editingInvoice : inv));
        addActivity('invoice', `Invoice #${editingInvoice.id?.slice(-6) || '???'} updated`);
        const updatedInvoice = editingInvoice;
        setEditingInvoice(null);
        await syncToSupabase('invoices', updatedInvoice);
    };

    const handleAddFinance = async () => {
        if (!newFinance.amount) return;
        const entry: FinanceEntry = {
            id: Date.now().toString(),
            type: newFinance.type || 'income',
            amount: Number(newFinance.amount) || 0,
            category: newFinance.category || 'Uncategorized',
            date: newFinance.date || new Date().toISOString().split('T')[0],
            description: newFinance.description || '',
            month: (newFinance.date || new Date().toISOString().split('T')[0]).split('-')[1],
            year: (newFinance.date || new Date().toISOString().split('T')[0]).split('-')[0]
        };
        setFinanceEntries([...financeEntries, entry]);
        addActivity('finance', `${entry.type === 'income' ? 'Income' : 'Expense'} recorded: ${userSettings.currency} ${entry.amount}`);
        setNewFinance({ type: 'income' });
        await syncToSupabase('finance_entries', entry);
    };

    const handleSaveNote = async () => {
        if (!newNote.title) return;
        const note: Note = {
            ...newNote as Note,
            id: Date.now().toString(),
            date: new Date().toISOString().split('T')[0],
            tags: newNote.tags || []
        };
        setNotes([...notes, note]);
        addActivity('vault', `Note saved: ${note.title}`);
        setNewNote({});
        await syncToSupabase('notes', note);
    };

    const handleImageUpload = async (file: File) => {
        try {
            addActivity('system', `Uploading ${file.name}...`);
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            // Try uploading to 'uploads' bucket first, fallback to local URL if fails
            const { error: uploadError } = await supabase.storage
                .from('uploads')
                .upload(filePath, file);

            let publicUrl = '';

            if (uploadError) {
                console.warn('Supabase upload failed (bucket might not exist), using local preview', uploadError);
                // Fallback to local Object URL for localhost demo if bucket missing
                publicUrl = URL.createObjectURL(file);
            } else {
                const { data } = supabase.storage.from('uploads').getPublicUrl(filePath);
                publicUrl = data.publicUrl;
            }

            // Append to editor content
            setEditorContent(prev => prev + `\n\n![${file.name}](${publicUrl})`);
            addActivity('content', `Image attached: ${file.name}`);

        } catch (error) {
            console.error('Upload error:', error);
            // Fallback
            const localUrl = URL.createObjectURL(file);
            setEditorContent(prev => prev + `\n\n![${file.name}](${localUrl})`);
        }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        // Simple visual feedback could be added here if needed
    };

    const handleExportPDF = (data?: any, type: 'invoice' | 'audit' | 'form' = 'invoice') => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        if (!data && type === 'invoice') {
            window.print();
            return;
        }

        let contentHtml = '';

        if (type === 'audit') {
            const score = calculateAuditScore();
            contentHtml = `
                <div class="header">
                    <div class="business-info">
                        <div class="company-name">${userProfile.company}</div>
                        <div class="address">${userProfile.website}</div>
                    </div>
                    <div class="invoice-info">
                        <div class="invoice-label">WEBSITE AUDIT</div>
                        <div class="invoice-meta">
                            <div>Date: ${new Date().toLocaleDateString()}</div>
                            <div>Score: <b>${score}%</b></div>
                        </div>
                    </div>
                </div>

                <div style="margin-bottom: 40px; padding: 20px; background: #f9fafb; border-radius: 12px; text-align: center;">
                    <div style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; font-weight: 600; margin-bottom: 8px;">Overall Health Score</div>
                    <div style="font-size: 48px; font-weight: 800; color: ${score > 80 ? '#059669' : score > 50 ? '#d97706' : '#dc2626'}">${score}/100</div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th style="width: 70%">Checklist Item</th>
                            <th style="text-align: right">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.entries(auditChecklist).map(([category, items]) => `
                            <tr style="background: #f3f4f6;"><td colspan="2" style="font-weight: 700; padding: 12px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #4b5563;">${category}</td></tr>
                            ${items.map(item => {
                const passed = auditScores[`${category}-${item}`];
                return `
                                <tr>
                                    <td>${item}</td>
                                    <td style="text-align: right; color: ${passed ? '#059669' : '#d1d5db'}; font-weight: 600;">
                                        ${passed ? 'PASSED' : 'PENDING'}
                                    </td>
                                </tr>
                                `;
            }).join('')}
                        `).join('')}
                    </tbody>
                </table>
             `;
        } else if (type === 'form') {
            const form = data || { title: 'Untitled Form', questions: [] };
            contentHtml = `
                <div class="header">
                    <div class="business-info">
                        <div class="company-name">${userProfile.company}</div>
                    </div>
                    <div class="invoice-info">
                        <div class="invoice-label">FORM PREVIEW</div>
                        <div class="invoice-meta">
                            <div>Title: <b>${form.title}</b></div>
                            <div>Date: ${new Date().toLocaleDateString()}</div>
                        </div>
                    </div>
                </div>

                <div style="margin-top: 40px;">
                    ${(form.questions || []).map((q: any, idx: number) => `
                        <div style="margin-bottom: 30px; page-break-inside: avoid;">
                            <div style="font-weight: 700; font-size: 14px; margin-bottom: 8px;">${idx + 1}. ${q.text || 'Untitled Question'}</div>
                            <div style="border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px; color: #9ca3af; font-size: 13px; background: #f9fafb;">
                                ${q.type === 'text' ? 'Text Answer Field' : q.type === 'dropdown' ? 'Dropdown Selection' : 'Checkbox Option'}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            // Invoice / Proposal Fallback
            const invoice = data || {
                clientName: 'Client',
                id: '0000',
                date: new Date().toLocaleDateString(),
                status: 'Draft',
                items: [],
                amount: 0,
                currency: userSettings.currency
            };

            contentHtml = `
                <div class="header">
                    <div class="business-info">
                        ${userProfile.businessLogo ? `<img src="${userProfile.businessLogo}" style="max-height: 50px; margin-bottom: 20px;" />` : `<div class="company-name">${userProfile.company}</div>`}
                        <div class="address">${userProfile.address}</div>
                        ${userProfile.taxId ? `<div class="tax-id">TAX ID: ${userProfile.taxId}</div>` : ''}
                        ${userProfile.website ? `<div class="address" style="margin-top: 4px;">${userProfile.website}</div>` : ''}
                    </div>
                    <div class="invoice-info">
                        <div class="invoice-label">INVOICE</div>
                        <div class="invoice-meta">
                            <div>Invoice No: <b>#${userSettings.invoicePrefix}${invoice.id?.slice(-6).toUpperCase() || 'NEW'}</b></div>
                            <div>Date: ${invoice.date}</div>
                            <div>Due Date: ${invoice.date}</div>
                        </div>
                    </div>
                </div>

                <div style="display: grid; grid-template-cols: 1fr 1fr; gap: 40px;">
                    <div>
                        <div class="section-title">Bill To</div>
                        <div class="bill-to-name">${invoice.clientName}</div>
                        <div class="address" style="margin-top: 4px;">${invoice.clientEmail || ''}</div>
                    </div>
                    <div style="text-align: right;">
                        <div class="section-title">Status</div>
                        <div style="font-weight: 600; color: ${invoice.status === 'Paid' ? '#059669' : '#d97706'}">${invoice.status?.toUpperCase() || 'DRAFT'}</div>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th style="width: 50%">Description</th>
                            <th class="qty-col">Qty</th>
                            <th class="amt-col">Rate</th>
                            <th class="amt-col">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${invoice.items?.map((item: any) => `
                            <tr>
                                <td style="font-weight: 500;">${item.description}</td>
                                <td class="qty-col">${item.qty}</td>
                                <td class="amt-col">${currencies.find(c => c.code === invoice.currency)?.symbol}${item.price.toLocaleString()}</td>
                                <td class="amt-col">${currencies.find(c => c.code === invoice.currency)?.symbol}${(item.qty * item.price).toLocaleString()}</td>
                            </tr>
                        `).join('') || ''}
                    </tbody>
                </table>

                <div class="totals-container">
                    <div class="totals-box">
                        <div class="total-line">
                            <span>Subtotal</span>
                            <span>${currencies.find(c => c.code === invoice.currency)?.symbol}${invoice.amount.toLocaleString()}</span>
                        </div>
                        ${userSettings.gstEnabled ? `
                            <div class="total-line">
                                <span>GST (${userSettings.taxRate}%)</span>
                                <span>${currencies.find(c => c.code === invoice.currency)?.symbol}${(invoice.amount * (userSettings.taxRate / 100)).toLocaleString()}</span>
                            </div>
                        ` : ''}
                        <div class="total-line grand">
                            <span>Total Amount</span>
                            <span>${currencies.find(c => c.code === invoice.currency)?.symbol}${(userSettings.gstEnabled ? invoice.amount * (1 + userSettings.taxRate / 100) : invoice.amount).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            `;
        }

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>BizPilot Export</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                    body { font-family: 'Inter', sans-serif; color: #1f2937; padding: 40px; margin: 0; line-height: 1.5; }
                    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 60px; }
                    .business-info { max-width: 300px; }
                    .invoice-info { text-align: right; }
                    .company-name { font-size: 24px; font-weight: 800; color: #111827; margin-bottom: 8px; }
                    .address { color: #6b7280; font-size: 13px; white-space: pre-line; margin-bottom: 4px; }
                    .tax-id { font-size: 13px; color: #374151; font-weight: 500; }
                    .invoice-label { font-size: 48px; font-weight: 800; color: #111827; margin-top: -10px; letter-spacing: -0.05em; }
                    .invoice-meta { margin-top: 16px; font-size: 14px; color: #6b7280; }
                    .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #9ca3af; letter-spacing: 0.1em; margin-bottom: 8px; }
                    .bill-to-name { font-size: 18px; font-weight: 700; color: #111827; }
                    table { width: 100%; border-collapse: collapse; margin-top: 40px; margin-bottom: 40px; }
                    th { text-align: left; padding: 12px 0; border-bottom: 2px solid #f3f4f6; color: #6b7280; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; }
                    td { padding: 16px 0; border-bottom: 1px solid #f3f4f6; font-size: 14px; }
                    .amt-col { text-align: right; }
                    .qty-col { text-align: center; }
                    .totals-container { display: flex; justify-content: flex-end; }
                    .totals-box { width: 280px; }
                    .total-line { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; color: #4b5563; }
                    .grand { border-top: 2px solid #111827; margin-top: 12px; padding-top: 16px; font-weight: 800; font-size: 20px; color: #111827; }
                    .footer { margin-top: 80px; padding-top: 40px; border-top: 1px solid #f3f4f6; font-size: 12px; color: #9ca3af; line-height: 1.6; }
                </style>
            </head>
            <body>
                ${contentHtml}
                <div class="footer">
                    <div style="font-weight: 600; color: #4b5563; margin-bottom: 8px;">Generated by BizPilot OS</div>
                    <div>Thank you for choosing ${userProfile.company}.</div>
                </div>
            </body>
            </html>
        `;

        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.print();
    };

    const toggleAuditItem = (id: string) => {
        setAuditScores(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const calculateAuditScore = () => {
        const totalItems = Object.keys(auditChecklist).reduce((acc, cat) => acc + auditChecklist[cat as keyof typeof auditChecklist].length, 0);
        const completedItems = Object.values(auditScores).filter(Boolean).length;
        return totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);
    };




    const handleUpdateProfile = async () => {
        setUserProfile(tempProfile);
        setUserSettings(tempSettings);
        addActivity('profile', 'Settings and profile updated successfully');
        await Promise.all([
            syncToSupabase('user_profiles', tempProfile),
            syncToSupabase('user_settings', tempSettings)
        ]);
    };

    const handleUpdatePassword = () => {
        addActivity('security', 'Password updated successfully');
        // In a real app, this would call an API
    };

    const handleManageBilling = () => {
        addActivity('system', 'Redirecting to secure billing portal...');
        setTimeout(() => {
            addActivity('system', 'Billing portal access shared via email');
        }, 1000);
    };

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
            window.location.href = '/login';
        }
    };

    const [contentTemplates] = useState({
        'LinkedIn Posts': [
            'Share your expertise...',
            'Tell a success story...',
            'Ask an engaging question...',
        ],
        'Ads': [
            'Transform your business with...',
            'Limited time offer...',
        ],
        'Cold DMs': [
            'Hi [Name], I noticed...',
            'Quick question about...',
        ],
        'Emails': [
            'Subject: Following up on...',
            'Subject: Quick update...',
        ],
    });

    const [scripts] = useState({
        'Sales': [
            'Discovery Call Script: Start with understanding their pain points...',
            'Closing Script: Let me show you how we can help...',
        ],
        'Follow-ups': [
            'Post-Meeting Follow-up: Thank you for your time today...',
            'Proposal Follow-up: I wanted to check if you had any questions...',
        ],
        'Objections': [
            'Price Objection: I understand budget is a concern...',
            'Timing Objection: I appreciate that timing is important...',
        ],
    });

    const [auditChecklist] = useState({
        'SEO': ['Meta tags present', 'Alt text on images', 'Mobile responsive', 'Fast loading speed'],
        'UI/UX': ['Clear navigation', 'Consistent design', 'Accessible forms', 'Good contrast'],
        'Performance': ['Optimized images', 'Minified code', 'CDN usage', 'Caching enabled'],
        'Content': ['Clear messaging', 'Call to actions', 'Updated information', 'Error-free'],
    });


    const totalLeads = leads.length;
    const pendingTasks = tasks.filter(t => t.status !== 'Done').length;
    const draftInvoices = invoices.filter(i => i.status === 'Draft').length;

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'content', label: 'Content Builder', icon: FileText },
        ...(activeRole === 'Owner' ? [
            { id: 'invoices', label: 'Invoices', icon: Receipt },
        ] : []),
        { id: 'leads', label: 'Leads CRM', icon: Users },
        { id: 'tasks', label: 'Task Planner', icon: CheckSquare },
        ...(activeRole === 'Owner' ? [
            { id: 'team', label: 'Team', icon: Shield },
            { id: 'proposals', label: 'Proposals', icon: FileCheck },
            { id: 'finance', label: 'Finance', icon: DollarSign },
            { id: 'forms', label: 'Forms', icon: ClipboardList },
            { id: 'audit', label: 'Website Audit', icon: Globe },
        ] : []),
        { id: 'scripts', label: 'Scripts', icon: Code },
        { id: 'vault', label: 'Vault', icon: Lock },
    ];

    const bottomNavItems = [
        // { id: 'billing', label: 'Subscription', icon: CreditCard },
        { id: 'support', label: 'Support', icon: HelpCircle },
    ];

    const handleDodoCheckout = async () => {
        setIsSubmittingPayment(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const response = await fetch('/api/payments/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: user.email,
                    userId: user.id
                })
            });

            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error(data.error || "Failed to create checkout");
            }
        } catch (err: any) {
            console.error("Checkout Error:", err);
            alert(err.message || "Something went wrong. Please try again.");
        } finally {
            setIsSubmittingPayment(false);
        }
    };

    const handleActivateTrial = async () => {
        setIsActivatingTrial(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const response = await fetch('/api/payments/activate-trial', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id })
            });

            const data = await response.json();
            if (data.success) {
                alert("30-Day Free Trial Activated!");
                setUserProfile({ ...userProfile, joinDate: data.joinDate, plan: 'Free' });
            } else {
                throw new Error(data.error || "Failed to activate trial");
            }
        } catch (err: any) {
            console.error("Trial Error:", err);
            alert(err.message || "Failed to activate trial. Please try again.");
        } finally {
            setIsActivatingTrial(false);
        }
    };

    const renderBilling = () => {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight">Access Control</h1>
                        <p className="text-muted-foreground mt-2 font-medium">Manage your lifetime platform access.</p>
                    </div>
                    <Badge variant="default" className="px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                        Lifetime Pilot Active
                    </Badge>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Card className="lg:col-span-2 border border-border/50 shadow-2xl bg-card/50 backdrop-blur-xl overflow-hidden rounded-[2.5rem] relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -z-10" />
                        <CardHeader className="pb-6 border-b border-border/10">
                            <CardTitle className="text-2xl font-black">Subscription Identity</CardTitle>
                            <CardDescription className="font-medium text-muted-foreground">
                                You are currently on the BizPilot OS Community Plan.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8 pt-8">
                            <div className="flex flex-col md:flex-row items-center justify-between p-8 bg-muted/30 rounded-3xl border border-border/50 gap-6">
                                <div className="space-y-2 text-center md:text-left">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Active Protocol</p>
                                    <h4 className="text-3xl font-black text-primary tracking-tighter">
                                        Free Lifetime Access
                                    </h4>
                                </div>
                                <div className="text-center md:text-right">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                                        Status
                                    </p>
                                    <h4 className="text-3xl font-black text-foreground tracking-tighter">
                                        Verified
                                    </h4>
                                </div>
                            </div>

                            <div className="space-y-6 p-8 rounded-[2rem] bg-foreground text-background relative overflow-hidden shadow-2xl">
                                <div className="relative z-10 space-y-6">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-background/10 rounded-full border border-background/20">
                                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Growth Referral Program</span>
                                    </div>
                                    <h4 className="text-3xl font-black tracking-tighter leading-none">Help Us Grow, <br />Stay Free Forever</h4>
                                    <p className="text-background/60 text-sm max-w-md font-medium leading-relaxed">
                                        BizPilot OS is 100% free for those who help build our community. Simply share your experience on social media to keep your lifetime access active.
                                    </p>
                                    <div className="flex flex-wrap gap-4 pt-2">
                                        <Button
                                            className="bg-background text-foreground hover:opacity-90 rounded-2xl px-10 h-14 text-lg font-black transition-all active:scale-95 shadow-xl"
                                        >
                                            Share & Update Access
                                        </Button>
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 blur-[100px] -translate-y-1/2 translate-x-1/2" />
                            </div>

                            <div className="flex items-center gap-4 p-5 bg-primary/5 text-primary rounded-2xl border border-primary/10">
                                <Shield className="h-6 w-6 shrink-0" />
                                <p className="text-sm font-bold leading-relaxed">Your data is yours. We never sell user information. The platform is supported by community growth, not user data monetization.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-border/50 shadow-2xl bg-card/50 backdrop-blur-xl overflow-hidden rounded-[2.5rem] self-start group">
                        <div className="h-1.5 w-full bg-primary" />
                        <CardHeader className="pb-6">
                            <CardTitle className="text-2xl font-black tracking-tight">Included Features</CardTitle>
                            <CardDescription className="font-medium">Everything under your command</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-5">
                                {[
                                    'Unlimited CRM Leads',
                                    'Advanced Finance Tracking',
                                    'Custom Proposal Engines',
                                    'Website Performance Audit',
                                    'Unlimited Content Assets',
                                    'Ready-to-use Sales Scripts',
                                    'Secure Vault Infrastructure'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-4 text-sm group/item">
                                        <div className="h-2 w-2 rounded-full bg-primary group-hover/item:scale-150 transition-transform shadow-[0_0_8px_var(--primary)]" />
                                        <span className="font-bold opacity-80 group-hover/item:opacity-100 transition-opacity">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-10 p-5 rounded-2xl bg-muted/50 border border-border/50 text-center">
                                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Support Protocol</p>
                                <p className="text-sm font-bold">Community-first priority support active for all verified users.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </motion.div>
        );
    };

    const renderDashboard = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-10"
        >
            <header className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_var(--primary)]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">System Engine Active</span>
                </div>
                <h1 className="text-4xl font-extrabold text-foreground tracking-tight md:text-5xl">
                    {(() => {
                        const hour = new Date().getHours();
                        if (hour < 12) return "Good morning";
                        if (hour < 17) return "Good afternoon";
                        return "Good evening";
                    })()}, {(userProfile?.name || 'User').split(' ')[0]}
                </h1>
                <p className="text-muted-foreground font-medium text-lg">
                    You have <span className="text-foreground font-bold">{pendingTasks} critical tasks</span> and <span className="text-foreground font-bold">{draftInvoices} pending invoices</span> to review.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, trend: '+12% this month', icon: TrendingUp, color: 'text-primary' },
                    { label: 'New Leads', value: totalLeads, trend: '3 new today', icon: Users, color: 'text-muted-foreground' },
                    { label: 'Pending Tasks', value: pendingTasks, trend: '5 due soon', icon: CheckSquare, color: 'text-muted-foreground' },
                    { label: 'Draft Invoices', value: draftInvoices, trend: 'Needs attention', icon: AlertCircle, color: 'text-destructive' },
                ].map((stat, i) => (
                    <Card key={i} className="border border-border/50 shadow-xl hover:shadow-2xl hover:border-primary/50 transition-all duration-500 group rounded-[2rem] bg-card/50 backdrop-blur-sm overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl -z-10 group-hover:bg-primary/10 transition-colors" />
                        <CardHeader className="pb-2">
                            <CardDescription className="text-xs font-black uppercase tracking-widest text-muted-foreground">{stat.label}</CardDescription>
                            <CardTitle className="text-4xl font-extrabold mt-1 tracking-tighter">{stat.value}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className={`flex items-center text-xs font-bold ${stat.color} bg-muted/50 w-fit px-3 py-1.5 rounded-full border border-border/50`}>
                                <stat.icon className="h-3.5 w-3.5 mr-1.5" />
                                {stat.trend}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border border-border/50 shadow-2xl rounded-[2.5rem] bg-card/40 backdrop-blur-xl overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[80px] -z-10" />
                    <CardHeader className="pb-6">
                        <CardTitle className="text-2xl font-black tracking-tight">Quick Commands</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { label: `New ${(userProfile?.company || 'Business').split(' ')[0]} Invoice`, icon: Receipt, view: 'invoices' },
                            { label: 'Manage CRM Leads', icon: Users, view: 'crm' },
                            { label: 'Optimize Workflow', icon: CheckSquare, view: 'tasks' },
                            { label: 'Build Content Assets', icon: FileText, view: 'content' },
                        ].map((action, i) => (
                            <Button
                                key={i}
                                variant="ghost"
                                className="w-full justify-start rounded-2xl h-14 px-6 hover:bg-primary hover:text-primary-foreground font-bold text-lg transition-all duration-300 shadow-sm hover:shadow-xl active:scale-95 group"
                                onClick={() => setActiveView(action.view)}
                            >
                                <action.icon className="mr-4 h-6 w-6 group-hover:scale-110 transition-transform" />
                                {action.label}
                            </Button>
                        ))}
                    </CardContent>
                </Card>

                <Card className="border border-border/50 shadow-2xl rounded-[2.5rem] bg-card/40 backdrop-blur-xl overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[80px] -z-10" />
                    <CardHeader className="pb-6">
                        <CardTitle className="text-2xl font-black tracking-tight">Recent Intelligence</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {activities.map((activity, i) => (
                                <motion.div
                                    key={activity.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-start gap-5 p-4 rounded-2xl bg-muted/30 border border-border/10 hover:border-primary/20 transition-all group"
                                >
                                    <div className="w-3 h-3 rounded-full bg-primary mt-1.5 shadow-[0_0_8px_var(--primary)] group-hover:scale-125 transition-transform" />
                                    <div className="flex-1">
                                        <p className="text-base font-bold text-foreground leading-tight">{activity.description}</p>
                                        <p className="text-xs text-muted-foreground font-black uppercase tracking-widest mt-1 opacity-70">{activity.time}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );

    const renderContentBuilder = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-semibold">Content Builder</h1>
            </div>

            <Tabs defaultValue="LinkedIn Posts" className="w-full">
                <TabsList className="grid w-full grid-cols-4 rounded-xl">
                    <TabsTrigger value="LinkedIn Posts" className="rounded-lg">LinkedIn Posts</TabsTrigger>
                    <TabsTrigger value="Ads" className="rounded-lg">Ads</TabsTrigger>
                    <TabsTrigger value="Cold DMs" className="rounded-lg">Cold DMs</TabsTrigger>
                    <TabsTrigger value="Emails" className="rounded-lg">Emails</TabsTrigger>
                </TabsList>
                {Object.entries(contentTemplates).map(([category, templates]) => (
                    <TabsContent key={category} value={category} className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="border-0 shadow-sm">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-lg">Templates</CardTitle>
                                    <div className="flex gap-2">
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {templates.map((template, idx) => (
                                        <div
                                            key={idx}
                                            className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                                            onClick={() => setEditorContent(template)}
                                        >
                                            <p className="text-sm">{template}</p>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-sm overflow-hidden flex flex-col">
                                <CardHeader className="border-b border-border/40 bg-muted/20">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg">Editor</CardTitle>
                                        <div className="flex gap-2">
                                            <Badge variant="outline" className="h-8 rounded-lg px-2">
                                                {newNote.status || 'Draft'}
                                            </Badge>
                                            <input
                                                type="file"
                                                id="content-image-upload"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) handleImageUpload(file);
                                                }}
                                            />
                                            <Button variant="ghost" size="sm" className="h-8 rounded-lg px-2" onClick={() => document.getElementById('content-image-upload')?.click()}>
                                                <ImageIcon className="h-3.5 w-3.5 mr-1" /> Add Image
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0 flex-1">
                                    <Textarea
                                        className="min-h-[300px] w-full border-0 focus-visible:ring-0 rounded-none p-6 resize-none"
                                        placeholder="Start writing..."
                                        value={editorContent}
                                        onChange={(e) => setEditorContent(e.target.value)}
                                    />
                                </CardContent>
                                <div className="p-4 bg-muted/10 border-t border-border/40 flex justify-between items-center">
                                    <span className="text-xs text-muted-foreground">{editorContent.length} characters</span>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="sm" className="rounded-lg" onClick={() => addActivity('content', 'Saved as variation')}>
                                            <Copy className="h-4 w-4 mr-2" />
                                            Variation
                                        </Button>
                                        <Button size="sm" className="rounded-lg" onClick={() => {
                                            handleCopy(editorContent);
                                            addActivity('content', 'Content copied to clipboard');
                                        }}>
                                            <Copy className="h-4 w-4 mr-2" />
                                            Copy
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );

    const renderInvoices = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-semibold">Invoices</h1>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="rounded-xl">
                            <Plus className="mr-2 h-4 w-4" />
                            New Invoice
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Create Invoice</DialogTitle>
                            <DialogDescription>Fill in the details to create a new invoice</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Client Name</Label>
                                    <Input
                                        placeholder="Enter client name"
                                        className="rounded-xl"
                                        value={newInvoice.clientName || ''}
                                        onChange={(e) => setNewInvoice({ ...newInvoice, clientName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Currency</Label>
                                    <Select
                                        value={newInvoice.currency || userSettings.currency}
                                        onValueChange={(val) => setNewInvoice({ ...newInvoice, currency: val })}
                                    >
                                        <SelectTrigger className="rounded-xl">
                                            <SelectValue placeholder="Select Currency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="USD">USD</SelectItem>
                                            <SelectItem value="INR">INR</SelectItem>
                                            <SelectItem value="EUR">EUR</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Date</Label>
                                    <Input
                                        type="date"
                                        className="rounded-xl"
                                        value={newInvoice.date || ''}
                                        onChange={(e) => setNewInvoice({ ...newInvoice, date: e.target.value })}
                                    />
                                </div>
                            </div>

                            {userSettings.gstEnabled && (
                                <div className="grid grid-cols-3 gap-4 p-4 bg-muted/20 rounded-xl border border-border/40">
                                    <div className="space-y-2">
                                        <Label className="text-xs">CGST (%)</Label>
                                        <Input
                                            type="number"
                                            className="rounded-lg h-8"
                                            value={newInvoice.tax?.cgst || 0}
                                            onChange={(e) => setNewInvoice({
                                                ...newInvoice,
                                                tax: { ...(newInvoice.tax || { cgst: 0, sgst: 0, igst: 0 }), cgst: Number(e.target.value) }
                                            })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs">SGST (%)</Label>
                                        <Input
                                            type="number"
                                            className="rounded-lg h-8"
                                            value={newInvoice.tax?.sgst || 0}
                                            onChange={(e) => setNewInvoice({
                                                ...newInvoice,
                                                tax: { ...(newInvoice.tax || { cgst: 0, sgst: 0, igst: 0 }), sgst: Number(e.target.value) }
                                            })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs">IGST (%)</Label>
                                        <Input
                                            type="number"
                                            className="rounded-lg h-8"
                                            value={newInvoice.tax?.igst || 0}
                                            onChange={(e) => setNewInvoice({
                                                ...newInvoice,
                                                tax: { ...(newInvoice.tax || { cgst: 0, sgst: 0, igst: 0 }), igst: Number(e.target.value) }
                                            })}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-3">
                                <Label>Line Items</Label>
                                <div className="space-y-2">
                                    {newInvoice.items?.map((item, idx) => (
                                        <div key={idx} className="grid grid-cols-12 gap-2">
                                            <Input
                                                placeholder="Description"
                                                className="col-span-6 rounded-xl"
                                                value={item.description}
                                                onChange={(e) => {
                                                    const newItems = [...(newInvoice.items || [])];
                                                    newItems[idx].description = e.target.value;
                                                    setNewInvoice({ ...newInvoice, items: newItems });
                                                }}
                                            />
                                            <Input
                                                type="number"
                                                placeholder="Qty"
                                                className="col-span-2 rounded-xl"
                                                value={item.qty}
                                                onChange={(e) => {
                                                    const newItems = [...(newInvoice.items || [])];
                                                    newItems[idx].qty = Number(e.target.value);
                                                    setNewInvoice({ ...newInvoice, items: newItems });
                                                }}
                                            />
                                            <Input
                                                type="number"
                                                placeholder="Price"
                                                className="col-span-3 rounded-xl"
                                                value={item.price}
                                                onChange={(e) => {
                                                    const newItems = [...(newInvoice.items || [])];
                                                    newItems[idx].price = Number(e.target.value);
                                                    setNewInvoice({ ...newInvoice, items: newItems });
                                                }}
                                            />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="col-span-1 rounded-xl text-destructive"
                                                onClick={() => {
                                                    const newItems = newInvoice.items?.filter((_, i) => i !== idx);
                                                    setNewInvoice({ ...newInvoice, items: newItems });
                                                }}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full rounded-xl border-dashed mt-2"
                                        onClick={() => setNewInvoice({
                                            ...newInvoice,
                                            items: [...(newInvoice.items || []), { description: '', qty: 1, price: 0 }]
                                        })}
                                    >
                                        <Plus className="mr-2 h-4 w-4" /> Add Item
                                    </Button>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-muted/30">
                                <div className="flex justify-between items-center font-semibold">
                                    <span>Total Amount</span>
                                    <span className="text-xl">
                                        ${newInvoice.items?.reduce((acc, item) => acc + (item.qty * item.price), 0).toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button className="rounded-xl flex-1" onClick={() => {
                                    setNewInvoice({ ...newInvoice, status: 'Draft' });
                                    handleCreateInvoice();
                                }}>Save as Draft</Button>
                                <Button variant="outline" className="rounded-xl flex-1" onClick={() => {
                                    setNewInvoice({ ...newInvoice, status: 'Sent' });
                                    handleCreateInvoice();
                                }}>Save as Sent</Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="border-0 shadow-sm">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead>Client</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoices.map((invoice) => (
                                <TableRow key={invoice.id} className="hover:bg-muted/50">
                                    <TableCell className="font-medium">{invoice.clientName}</TableCell>
                                    <TableCell className="font-medium text-foreground">
                                        <div className="flex items-center gap-2">
                                            <span className="text-base grayscale-0">{currencies.find(c => c.code === invoice.currency)?.flag || '🇺🇸'}</span>
                                            {invoice.currency} {invoice.amount.toLocaleString()}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            invoice.status === 'Paid' ? 'default' :
                                                invoice.status === 'Overdue' ? 'destructive' :
                                                    invoice.status === 'Sent' ? 'outline' : 'secondary'
                                        } className="rounded-full">
                                            {invoice.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{invoice.date}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2 justify-end">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8 hover:bg-primary/10 text-primary" onClick={() => setEditingInvoice(invoice)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-2xl">
                                                    <DialogHeader>
                                                        <DialogTitle>Edit Invoice #{invoice.id?.slice(-6).toUpperCase() || 'NEW'}</DialogTitle>
                                                    </DialogHeader>
                                                    {editingInvoice && (
                                                        <div className="space-y-4">
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div className="space-y-2">
                                                                    <Label>Client Name</Label>
                                                                    <Input
                                                                        value={editingInvoice.clientName}
                                                                        onChange={(e) => setEditingInvoice({ ...editingInvoice, clientName: e.target.value })}
                                                                        className="rounded-xl"
                                                                    />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label>Status</Label>
                                                                    <Select
                                                                        value={editingInvoice.status}
                                                                        onValueChange={(val) => setEditingInvoice({ ...editingInvoice, status: val as any })}
                                                                    >
                                                                        <SelectTrigger className="rounded-xl">
                                                                            <SelectValue />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="Draft">Draft</SelectItem>
                                                                            <SelectItem value="Sent">Sent</SelectItem>
                                                                            <SelectItem value="Paid">Paid</SelectItem>
                                                                            <SelectItem value="Overdue">Overdue</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                            </div>
                                                            <div className="space-y-4">
                                                                <Label>Items</Label>
                                                                {(editingInvoice.items || []).map((item, idx) => (
                                                                    <div key={idx} className="grid grid-cols-12 gap-2">
                                                                        <Input
                                                                            className="col-span-6 rounded-xl"
                                                                            value={item.description}
                                                                            onChange={(e) => {
                                                                                const newItems = [...editingInvoice.items];
                                                                                newItems[idx].description = e.target.value;
                                                                                setEditingInvoice({ ...editingInvoice, items: newItems });
                                                                            }}
                                                                        />
                                                                        <Input
                                                                            type="number"
                                                                            className="col-span-2 rounded-xl"
                                                                            value={item.qty}
                                                                            onChange={(e) => {
                                                                                const newItems = [...editingInvoice.items];
                                                                                newItems[idx].qty = Number(e.target.value);
                                                                                setEditingInvoice({ ...editingInvoice, items: newItems });
                                                                            }}
                                                                        />
                                                                        <Input
                                                                            type="number"
                                                                            className="col-span-3 rounded-xl"
                                                                            value={item.price}
                                                                            onChange={(e) => {
                                                                                const newItems = [...editingInvoice.items];
                                                                                newItems[idx].price = Number(e.target.value);
                                                                                setEditingInvoice({ ...editingInvoice, items: newItems });
                                                                            }}
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <Button className="w-full rounded-xl" onClick={handleUpdateInvoice}>Save Changes</Button>
                                                        </div>
                                                    )}
                                                </DialogContent>
                                            </Dialog>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8">
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleExportPDF(invoice)}>
                                                        Export as PDF
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => {
                                                        const newInvoices = invoices.map(inv =>
                                                            inv.id === invoice.id ? { ...inv, status: 'Paid' as const } : inv
                                                        );
                                                        setInvoices(newInvoices);
                                                    }}>
                                                        Mark as Paid
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );

    const renderLeads = () => {
        const [searchQuery, setSearchQuery] = useState('');
        const [statusFilter, setStatusFilter] = useState('all');
        const [viewingLead, setViewingLead] = useState<Lead | null>(null);


        const filteredLeads = leads.filter(lead => {
            const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lead.contact.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'all' || lead.status.toLowerCase() === statusFilter.toLowerCase();
            const matchesRole = activeRole === 'Owner' || lead.assignedTo === activeEmployeeId;
            return matchesSearch && matchesStatus && matchesRole;
        });

        const stats = {
            total: leads.length,
            new: leads.filter(l => l.status === 'New').length,
            converted: leads.filter(l => l.status === 'Closed').length,
            rate: leads.length > 0 ? Math.round((leads.filter(l => l.status === 'Closed').length / leads.length) * 100) : 0
        };

        return (
            <div className="space-y-8">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Lead Intelligence</span>
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight">Leads Central</h1>
                        <p className="text-muted-foreground font-medium">Capture, track, and convert leads from Meta Ads and other channels.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="rounded-2xl h-11 px-6 font-bold border-border/50 bg-background/40 backdrop-blur-md">
                            <Download className="h-4 w-4 mr-2" /> Export
                        </Button>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="rounded-2xl h-11 px-6 font-bold shadow-lg shadow-primary/20 gap-2">
                                    <Plus className="h-5 w-5" /> Manual Intel
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="rounded-[2.5rem] border-border bg-popover/90 backdrop-blur-xl max-w-lg">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-black tracking-tight">Add New Lead</DialogTitle>
                                    <DialogDescription className="font-medium">Enter lead information manually when not captured via automated triggers.</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 pt-4">
                                    <div className="space-y-2">
                                        <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Full Name</Label>
                                        <Input
                                            placeholder="Lead Name"
                                            className="rounded-xl border-border bg-muted/50 h-11"
                                            value={newLead.name || ''}
                                            onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Contact Info</Label>
                                            <Input
                                                placeholder="Email or Phone"
                                                className="rounded-xl border-border bg-muted/50 h-11"
                                                value={newLead.contact || ''}
                                                onChange={(e) => setNewLead({ ...newLead, contact: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Source</Label>
                                            <Select onValueChange={(val) => setNewLead({ ...newLead, source: val })}>
                                                <SelectTrigger className="rounded-xl border-border bg-muted/50 h-11">
                                                    <SelectValue placeholder="Social, Search, etc." />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl border-border bg-popover/90 backdrop-blur-lg">
                                                    <SelectItem value="meta">Meta Ads</SelectItem>
                                                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                                                    <SelectItem value="google">Google Ads</SelectItem>
                                                    <SelectItem value="referral">Direct Referral</SelectItem>
                                                    <SelectItem value="website">Organic Website</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Initial Intel / Notes</Label>
                                        <Textarea
                                            placeholder="Context about the lead..."
                                            className="rounded-xl border-border bg-muted/50 min-h-[100px]"
                                            value={newLead.notes || ''}
                                            onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                                        />
                                    </div>
                                    <Button className="w-full rounded-xl h-12 font-bold shadow-lg shadow-primary/20 mt-2" onClick={handleAddLead}>
                                        Commit Lead to CRM
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: 'Total Influx', value: stats.total, icon: Users, color: 'text-primary', bg: 'bg-primary/5' },
                        { label: 'New Entries', value: stats.new, icon: Clock, color: 'text-blue-500', bg: 'bg-emerald-500/5' },
                        { label: 'Closed Deals', value: stats.converted, icon: CheckSquare, color: 'text-emerald-500', bg: 'bg-success/5' },
                        { label: 'Conversion', value: `${stats.rate}%`, icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-500/5' },
                    ].map((stat, i) => (
                        <Card key={i} className="border border-border/50 shadow-xl bg-card/40 backdrop-blur-xl overflow-hidden rounded-[1.5rem] relative">
                            <CardHeader className="pb-2">
                                <CardDescription className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</CardDescription>
                                <CardTitle className="text-3xl font-extrabold mt-1 tracking-tighter">{stat.value}</CardTitle>
                            </CardHeader>
                            <div className={`absolute top-0 right-0 p-4 ${stat.color} opacity-20`}>
                                <stat.icon className="h-8 w-8" />
                            </div>
                        </Card>
                    ))}
                </div>

                <Card className="border border-border/50 shadow-2xl bg-card/40 backdrop-blur-xl overflow-hidden rounded-[2.5rem]">
                    <div className="p-6 border-b border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/10">
                        <div className="relative flex-1 max-w-md group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Search leads by name or contact..."
                                className="rounded-xl border-border bg-background/50 pl-11 h-11 focus-visible:ring-primary/20 transition-all font-medium"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            {['all', 'new', 'Follow-up', 'Closed'].map((status) => (
                                <Button
                                    key={status}
                                    variant={statusFilter === status ? "default" : "outline"}
                                    size="sm"
                                    className={`rounded-xl h-10 px-4 font-bold capitalize ${statusFilter === status ? "shadow-lg shadow-primary/20" : "border-border/50 bg-background/40"}`}
                                    onClick={() => setStatusFilter(status)}
                                >
                                    {status}
                                </Button>
                            ))}
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-border/50">
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest py-5 pl-8 text-muted-foreground">Identity</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest py-5 text-muted-foreground">Quality</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest py-5 text-muted-foreground">Contact</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest py-5 text-muted-foreground">Deployment</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest py-5 text-muted-foreground">Source</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest py-5 text-muted-foreground">Protocol</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest py-5 pr-8 text-right text-muted-foreground">Operations</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredLeads.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-64 text-center">
                                            <div className="flex flex-col items-center justify-center space-y-3 opacity-50">
                                                <Users className="h-12 w-12 text-muted-foreground" />
                                                <p className="font-bold text-lg">No leads detected in current sector</p>
                                                <p className="text-sm font-medium">Try adjusting your filters or add a new lead manually.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredLeads.map((lead) => (
                                        <TableRow key={lead.id} className="hover:bg-primary/5 transition-colors border-border/10 group">
                                            <TableCell className="py-4 pl-8">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs shadow-inner">
                                                        {lead.name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm tracking-tight group-hover:text-primary transition-colors">{lead.name}</p>
                                                        <p className="text-[10px] font-medium text-muted-foreground/70 uppercase">Acquired {new Date().toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={`rounded-full text-[10px] font-black uppercase tracking-widest py-0 px-2 border-none ${lead.quality === 'Hot' ? 'bg-red-500/10 text-red-600' :
                                                        lead.quality === 'Warm' ? 'bg-amber-500/10 text-amber-600' :
                                                            'bg-blue-500/10 text-blue-600'
                                                        }`}
                                                >
                                                    {lead.quality || 'Standard'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-medium text-xs text-muted-foreground">{lead.contact}</TableCell>
                                            <TableCell>
                                                <Select
                                                    disabled={activeRole !== 'Owner'}
                                                    value={lead.assignedTo || ''}
                                                    onValueChange={async (val) => {
                                                        const updatedLeads = leads.map(l => l.id === lead.id ? { ...l, assignedTo: val } : l);
                                                        setLeads(updatedLeads);
                                                        const empName = userProfile.employees.find(e => e.id === val)?.name;
                                                        addActivity('crm', `Lead ${lead.name} deployed to ${empName}`);

                                                        // Automated connectivity: Create a follow-up task
                                                        const newTaskObj: Task = {
                                                            id: Date.now().toString(),
                                                            title: `Follow up with ${lead.name}`,
                                                            status: 'To-Do',
                                                            priority: lead.quality === 'Hot' ? 'High' : (lead.quality === 'Warm' ? 'Medium' : 'Low'),
                                                            dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
                                                            subtasks: [],
                                                            assignedTo: val,
                                                            history: [`Auto-created via lead assignment for ${lead.name}`]
                                                        };
                                                        setTasks(prev => [newTaskObj, ...prev]);
                                                        await syncToSupabase('tasks', newTaskObj);
                                                        await syncToSupabase('leads', { ...lead, assignedTo: val });
                                                    }}
                                                >
                                                    <SelectTrigger className="h-9 w-[150px] rounded-xl text-[11px] font-bold bg-muted/30 border-none shadow-none focus:ring-0">
                                                        <SelectValue placeholder="Unassigned" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-2xl border-border bg-popover/90 backdrop-blur-lg">
                                                        {userProfile.employees.map(emp => (
                                                            <SelectItem key={emp.id} value={emp.id} className="rounded-xl font-bold py-2">
                                                                {emp.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {lead.source?.toLowerCase().includes('meta') ? <Globe className="h-3 w-3 text-blue-500" /> : <LinkIcon className="h-3 w-3 text-muted-foreground" />}
                                                    <span className="text-[11px] font-bold uppercase tracking-widest opacity-70">{lead.source || 'Direct'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="rounded-full text-[10px] font-black uppercase tracking-tight py-0.5 px-3 bg-muted/50 border border-border/50">{lead.status}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right pr-8">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-all" onClick={() => window.location.href = `mailto:${lead.contact.includes('@') ? lead.contact : ''}`}>
                                                        <Mail className="h-4 w-4" />
                                                    </Button>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-muted transition-all">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="rounded-2xl border-border bg-popover/90 backdrop-blur-lg w-48 p-2">
                                                            <DropdownMenuItem onClick={() => setViewingLead(lead)} className="rounded-xl font-bold py-3 px-4">
                                                                <Users className="h-4 w-4 mr-2 opacity-70" /> View Full Intel
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => setEditingLead(lead)} className="rounded-xl font-bold py-3 px-4">
                                                                <Edit className="h-4 w-4 mr-2 opacity-70" /> Modify Profile
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator className="bg-border/50 mx-2" />
                                                            {activeRole === 'Owner' && (
                                                                <DropdownMenuItem
                                                                    onClick={async () => {
                                                                        const updatedLeads = leads.filter(l => l.id !== lead.id);
                                                                        setLeads(updatedLeads);
                                                                        addActivity('crm', `Lead terminated: ${lead.name}`);
                                                                        // Add logic to delete from Supabase if needed
                                                                    }}
                                                                    className="rounded-xl font-bold py-3 px-4 text-destructive focus:text-destructive"
                                                                >
                                                                    <Trash2 className="h-4 w-4 mr-2 opacity-70" /> Terminate Entry
                                                                </DropdownMenuItem>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </Card>

                {/* Lead Intelligence Dialog */}
                <Dialog open={!!viewingLead} onOpenChange={(open) => !open && setViewingLead(null)}>
                    <DialogContent className="rounded-[2.5rem] border-border bg-popover/90 backdrop-blur-xl max-w-2xl">
                        {viewingLead && (
                            <>
                                <DialogHeader>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary font-black text-2xl shadow-inner">
                                            {viewingLead.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <DialogTitle className="text-3xl font-black tracking-tight">{viewingLead.name}</DialogTitle>
                                            <p className="text-muted-foreground font-medium">{viewingLead.contact}</p>
                                        </div>
                                    </div>
                                </DialogHeader>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="p-4 rounded-3xl bg-muted/30 border border-border/50">
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Status</p>
                                            <Badge className="rounded-full">{viewingLead.status}</Badge>
                                        </div>
                                        <div className="p-4 rounded-3xl bg-muted/30 border border-border/50">
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Quality</p>
                                            <p className="font-bold text-lg">{viewingLead.quality}</p>
                                        </div>
                                        <div className="p-4 rounded-3xl bg-muted/30 border border-border/50">
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Primary Source</p>
                                            <p className="font-bold text-lg capitalize">{viewingLead.source}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Activity Intel</h4>
                                        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                            {(viewingLead.history || []).length === 0 ? (
                                                <p className="text-sm opacity-50 italic">No historical data recorded yet.</p>
                                            ) : (
                                                viewingLead.history.map((h, i) => (
                                                    <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-background/40 border border-border/30">
                                                        <p className="text-xs font-bold">{h.action}</p>
                                                        <p className="text-[10px] opacity-50 font-medium">{h.time}</p>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-2">Meta Ads Metadata</h4>
                                        {viewingLead.source === 'meta' ? (
                                            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs font-medium">
                                                <span className="opacity-60">Created Time</span>
                                                <span className="text-right">{new Date().toLocaleString()}</span>
                                                <span className="opacity-60">Ad Name</span>
                                                <span className="text-right">Premium Expansion Campaign</span>
                                                <span className="opacity-60">Form Name</span>
                                                <span className="text-right">High Intent Lead Form</span>
                                            </div>
                                        ) : (
                                            <p className="text-xs opacity-50 italic">Captured via manual entry or other channel.</p>
                                        )}
                                    </div>

                                    <div className="flex gap-3">
                                        <Button className="flex-1 rounded-2xl h-12 font-bold" onClick={() => setViewingLead(null)}>Close Intel</Button>
                                        <Button variant="outline" className="rounded-2xl h-12 font-bold" onClick={() => {
                                            setEditingLead(viewingLead);
                                            setViewingLead(null);
                                        }}>Modify Entry</Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        );
    };

    const renderTasks = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-semibold">Task Planner</h1>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="rounded-xl">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Task
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create Task</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input
                                    placeholder="Task title"
                                    className="rounded-xl"
                                    value={newTask.title || ''}
                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Priority</Label>
                                <Select onValueChange={(val) => setNewTask({ ...newTask, priority: val as any })}>
                                    <SelectTrigger className="rounded-xl">
                                        <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Low">Low</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="High">High</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Due Date</Label>
                                <Input
                                    type="date"
                                    className="rounded-xl"
                                    value={newTask.dueDate || ''}
                                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Dependency</Label>
                                <Select onValueChange={(val) => setNewTask({ ...newTask, dependencyId: val })}>
                                    <SelectTrigger className="rounded-xl">
                                        <SelectValue placeholder="None" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">None</SelectItem>
                                        {tasks.map(t => (
                                            <SelectItem key={t.id} value={t.id}>{t.title.substring(0, 20)}...</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-4">
                                <Label>Sub-tasks</Label>
                                <div className="space-y-2">
                                    {(newTask.subtasks || []).map((st, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <Input
                                                className="rounded-xl h-9"
                                                value={st.title}
                                                onChange={(e) => {
                                                    const sts = [...(newTask.subtasks || [])];
                                                    sts[idx].title = e.target.value;
                                                    setNewTask({ ...newTask, subtasks: sts });
                                                }}
                                            />
                                        </div>
                                    ))}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full rounded-xl border-dashed"
                                        onClick={() => setNewTask({
                                            ...newTask,
                                            subtasks: [...(newTask.subtasks || []), { id: Date.now().toString(), title: '', status: 'To-Do' }]
                                        })}
                                    >
                                        <Plus className="mr-2 h-4 w-4" /> Add Sub-task
                                    </Button>
                                </div>
                            </div>

                            <Button className="w-full rounded-xl" onClick={handleCreateTask}>Create Task</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['To-Do', 'In Progress', 'Done'].map((status) => (
                    <Card key={status} className="border-border/50 shadow-xl shadow-primary/5 bg-background/40 backdrop-blur-md">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                                {status}
                                <Badge variant="secondary" className="rounded-full text-[10px] bg-primary/10 text-primary border-none">
                                    {tasks.filter(t => t.status === status).length}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 px-3">
                            {tasks.filter(t => t.status === status).map((task) => (
                                <motion.div
                                    key={task.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 rounded-2xl bg-background border border-border/50 shadow-sm space-y-3 cursor-pointer hover:border-primary/50 hover:shadow-md transition-all group relative"
                                    onClick={() => {
                                        const statuses: Task['status'][] = ['To-Do', 'In Progress', 'Done'];
                                        const nextStatus = statuses[(statuses.indexOf(task.status) + 1) % 3];
                                        const newHistory = [...(task.history || []), `Status changed to ${nextStatus} at ${new Date().toLocaleTimeString()}`];
                                        setTasks(tasks.map(t => t.id === task.id ? { ...t, status: nextStatus, history: newHistory } : t));
                                        addActivity('task', `Task "${task.title}" status changed to ${nextStatus}`);
                                    }}
                                >
                                    <p className="font-medium text-sm">{task.title}</p>

                                    {task.subtasks.length > 0 && (
                                        <div className="space-y-1.5 mt-2.5">
                                            {task.subtasks.map((st) => (
                                                <div
                                                    key={st.id}
                                                    className="flex items-center gap-2.5 group/st cursor-pointer"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const updatedSubtasks = task.subtasks.map(s =>
                                                            s.id === st.id ? { ...s, status: s.status === 'Done' ? 'To-Do' : 'Done' } as const : s
                                                        );
                                                        setTasks(tasks.map(t => t.id === task.id ? { ...t, subtasks: updatedSubtasks } : t));
                                                    }}
                                                >
                                                    <div className={`w-3.5 h-3.5 rounded border-2 transition-all flex items-center justify-center flex-shrink-0 ${st.status === 'Done' ? 'bg-primary border-primary' : 'border-muted-foreground/30 bg-white'}`}>
                                                        {st.status === 'Done' && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
                                                    </div>
                                                    <span className={`text-[11px] transition-colors leading-none ${st.status === 'Done' ? 'line-through text-muted-foreground' : 'text-foreground font-medium'}`}>
                                                        {st.title}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {task.dependencyId && (
                                        <div className="flex items-center gap-1 text-[10px] text-primary/70 bg-primary/5 px-2 py-0.5 rounded-md w-fit mt-1">
                                            <LinkIcon className="h-3 w-3" />
                                            <span>Depends on #{task.dependencyId.slice(-4)}</span>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/20">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className={`rounded-full text-[10px] px-2 ${task.priority === 'High' ? 'text-red-600 border-red-600' :
                                                task.priority === 'Medium' ? 'text-yellow-600 border-yellow-600' :
                                                    'text-blue-600 border-blue-600'
                                                }`}>
                                                {task.priority}
                                            </Badge>
                                            <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[8px] font-bold" title={`Assigned to ${task.assignedTo || 'Unassigned'}`}>
                                                {userProfile.employees.find(e => e.id === task.assignedTo)?.name.slice(0, 2).toUpperCase() || 'UN'}
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-muted-foreground">{task.dueDate}</span>
                                    </div>
                                    <button
                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted-foreground/10 rounded-md"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setTasks(tasks.filter(t => t.id !== task.id));
                                        }}
                                    >
                                        <X className="h-3 w-3 text-muted-foreground" />
                                    </button>
                                </motion.div>
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );

    const renderProposals = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-semibold text-foreground">Proposals</h1>
                <Button className="rounded-xl" onClick={handleSaveProposal}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Proposal
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Proposal Editor</CardTitle>
                        <CardDescription>Draft sections for your business proposal</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Proposal Title</Label>
                                <Input
                                    placeholder="e.g., Growth Strategy 2024"
                                    className="rounded-xl"
                                    value={newProposal.title}
                                    onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Client Name</Label>
                                <Input
                                    placeholder="e.g., Acme Corp"
                                    className="rounded-xl"
                                    value={newProposal.clientName}
                                    onChange={(e) => setNewProposal({ ...newProposal, clientName: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Introduction</Label>
                            <Textarea
                                placeholder="Introduce your proposal..."
                                className="rounded-xl min-h-[100px]"
                                value={newProposal.introduction}
                                onChange={(e) => setNewProposal({ ...newProposal, introduction: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Scope</Label>
                            <Textarea
                                placeholder="Define the scope of work..."
                                className="rounded-xl min-h-[100px]"
                                value={newProposal.scope}
                                onChange={(e) => setNewProposal({ ...newProposal, scope: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Pricing</Label>
                            <Textarea
                                placeholder="Outline pricing details..."
                                className="rounded-xl min-h-[80px]"
                                value={newProposal.pricing}
                                onChange={(e) => setNewProposal({ ...newProposal, pricing: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Timeline</Label>
                            <Textarea
                                placeholder="Project timeline..."
                                className="rounded-xl min-h-[80px]"
                                value={newProposal.timeline}
                                onChange={(e) => setNewProposal({ ...newProposal, timeline: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Terms</Label>
                            <Textarea
                                placeholder="Terms and conditions..."
                                className="rounded-xl min-h-[80px]"
                                value={newProposal.terms}
                                onChange={(e) => setNewProposal({ ...newProposal, terms: e.target.value })}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button className="rounded-xl flex-1" onClick={handleSaveProposal}>Save Proposal</Button>
                            <Button variant="outline" className="rounded-xl flex-1" onClick={() => handleExportPDF({ clientName: 'Proposal Preview', amount: 0, currency: userSettings.currency, items: [{ description: 'Project Scope', qty: 1, price: 0 }] } as any)}>
                                <Download className="mr-2 h-4 w-4" />
                                Export PDF
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/50 shadow-xl shadow-primary/5 bg-background/60 backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Recent Proposals</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {proposals.length === 0 ? (
                            <div className="py-12 text-center text-muted-foreground">
                                <FileCheck className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                <p className="text-sm">No proposals yet. Start drafting one to see it here.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {proposals.map((p) => (
                                    <motion.div
                                        key={p.id}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="p-5 rounded-2xl border border-border/50 bg-background/50 hover:border-primary/50 hover:shadow-lg transition-all"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="font-semibold text-sm line-clamp-1">{p.title || `Proposal for ${p.clientName}`}</h3>
                                                <div className="flex items-center gap-2 mt-1.5">
                                                    <Badge variant="secondary" className="text-[10px] bg-primary/5 text-primary border-none">v{p.version}</Badge>
                                                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                        <Clock className="h-3 w-3" /> {p.date}
                                                    </span>
                                                </div>
                                            </div>
                                            <Badge variant={p.status === 'Approved' ? 'default' : p.status === 'Sent' ? 'outline' : 'secondary'} className="text-[10px] rounded-full px-3">
                                                {p.status}
                                            </Badge>
                                        </div>
                                        <div className="flex gap-2 mt-4 pt-4 border-t border-border/20">
                                            <Button variant="ghost" size="sm" className="h-9 text-xs rounded-xl hover:bg-primary/5 transition-colors" onClick={() => handleExportPDF({ clientName: p.clientName, amount: 0, currency: userSettings.currency, items: [{ description: p.introduction.substring(0, 100) + '...', qty: 1, price: 0 }] } as any)}>
                                                <Download className="h-3.5 w-3.5 mr-2" /> PDF
                                            </Button>
                                            <Button variant="ghost" size="sm" className="h-9 text-xs rounded-xl text-primary hover:bg-primary/5 transition-colors" onClick={() => {
                                                const newVersion = { ...p, id: Date.now().toString(), date: new Date().toLocaleDateString(), version: (p.version || 1) + 1, status: 'Draft' as const };
                                                setProposals([newVersion, ...proposals]);
                                                addActivity('proposals', `New version (v${newVersion.version}) created for ${p.title}`);
                                            }}>
                                                <TrendingUp className="h-3.5 w-3.5 mr-2" /> Version
                                            </Button>
                                            <Button variant="ghost" size="sm" className="h-9 text-xs rounded-xl text-muted-foreground hover:bg-muted transition-colors ml-auto" onClick={() => {
                                                const duplicated = { ...p, id: Date.now().toString(), title: `${p.title} (Copy)`, date: new Date().toLocaleDateString(), status: 'Draft' as const, version: 1 };
                                                setProposals([duplicated, ...proposals]);
                                                addActivity('proposals', `Proposal "${p.title}" duplicated`);
                                            }}>
                                                <Copy className="h-3.5 w-3.5 mr-2" /> Copy
                                            </Button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );

    const renderFinance = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-semibold">Finance</h1>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="rounded-xl">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Entry
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Finance Entry</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Type</Label>
                                <Select onValueChange={(val) => setNewFinance({ ...newFinance, type: val as any })}>
                                    <SelectTrigger className="rounded-xl">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="income">Income</SelectItem>
                                        <SelectItem value="expense">Expense</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Amount</Label>
                                <Input
                                    type="number"
                                    placeholder="0.00"
                                    className="rounded-xl"
                                    value={newFinance.amount || ''}
                                    onChange={(e) => setNewFinance({ ...newFinance, amount: Number(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Input
                                    placeholder="e.g., Client Payment"
                                    className="rounded-xl"
                                    value={newFinance.category || ''}
                                    onChange={(e) => setNewFinance({ ...newFinance, category: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                    placeholder="Add details..."
                                    className="rounded-xl"
                                    value={newFinance.description || ''}
                                    onChange={(e) => setNewFinance({ ...newFinance, description: e.target.value })}
                                />
                            </div>
                            <Button className="w-full rounded-xl" onClick={handleAddFinance}>Add Entry</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-border/50 shadow-xl shadow-primary/5 bg-background/60 backdrop-blur-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrendingUp className="h-12 w-12 text-green-500" />
                    </div>
                    <CardHeader className="pb-3">
                        <CardDescription className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Income</CardDescription>
                        <CardTitle className="text-3xl font-bold text-green-600 mt-1">{currencySymbol}{totalRevenue.toLocaleString()}</CardTitle>
                    </CardHeader>
                </Card>

                <Card className="border-border/50 shadow-xl shadow-primary/5 bg-background/60 backdrop-blur-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrendingDown className="h-12 w-12 text-red-500" />
                    </div>
                    <CardHeader className="pb-3">
                        <CardDescription className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Expenses</CardDescription>
                        <CardTitle className="text-3xl font-bold text-red-600 mt-1">{currencySymbol}{totalExpenses.toLocaleString()}</CardTitle>
                    </CardHeader>
                </Card>

                <Card className="border-border/50 shadow-xl shadow-primary/5 bg-background/60 backdrop-blur-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Wallet className="h-12 w-12 text-primary" />
                    </div>
                    <CardHeader className="pb-3">
                        <CardDescription className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Net Profit</CardDescription>
                        <CardTitle className="text-3xl font-bold text-foreground mt-1">{currencySymbol}{profit.toLocaleString()}</CardTitle>
                    </CardHeader>
                </Card>

                <Card className="border-border/50 shadow-xl shadow-primary/5 bg-background/60 backdrop-blur-xl group">
                    <CardHeader className="pb-3">
                        <CardDescription className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Profit Margin</CardDescription>
                        <CardTitle className="text-3xl font-bold mt-1">{totalRevenue > 0 ? ((profit / totalRevenue) * 100).toFixed(1) : 0}%</CardTitle>
                        <div className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1.5 font-medium">
                            {profitMargin > 20 ?
                                <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded-full"><TrendingUp className="h-3 w-3" /> Healthy</span> :
                                <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full"><AlertCircle className="h-3 w-3" /> Monitor</span>
                            }
                        </div>
                    </CardHeader>
                </Card>
            </div>

            <Card className="border-border/50 shadow-xl shadow-primary/5 bg-background/60 backdrop-blur-xl overflow-hidden">
                <CardHeader className="border-b border-border/20 bg-muted/20">
                    <CardTitle className="text-lg font-semibold">Transaction History</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead>Type</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Description</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {financeEntries.map((entry) => (
                                <TableRow key={entry.id} className="hover:bg-muted/50">
                                    <TableCell>
                                        <Badge variant={entry.type === 'income' ? 'default' : 'secondary'} className="rounded-full">
                                            {entry.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{entry.category}</TableCell>
                                    <TableCell className={entry.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                                        {currencySymbol}{entry.amount.toLocaleString()}
                                    </TableCell>
                                    <TableCell>{entry.date}</TableCell>
                                    <TableCell>{entry.description}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );

    const renderForms = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-semibold">Forms</h1>
                <Button className="rounded-xl" onClick={() => {
                    setNewForm({ title: '', questions: [{ id: '1', text: '', type: 'text' }] });
                    addActivity('forms', 'New form initialized');
                }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Form
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="border-border/50 shadow-xl shadow-primary/5 bg-background/60 backdrop-blur-xl lg:col-span-2 overflow-hidden">
                        <CardHeader className="bg-muted/10 border-b border-border/20">
                            <CardTitle className="text-lg font-semibold">Form Builder</CardTitle>
                            <CardDescription>Create custom forms for client onboarding</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="space-y-3">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Form Title</Label>
                                <Input
                                    placeholder="e.g., Client Onboarding Form"
                                    className="rounded-2xl bg-muted/20 border-border/50 focus:bg-background transition-all h-12"
                                    value={newForm.title}
                                    onChange={(e) => setNewForm({ ...newForm, title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-4">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Questions</Label>
                                <AnimatePresence>
                                    {newForm.questions.map((q, idx) => (
                                        <motion.div
                                            key={q.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="flex gap-4 p-5 rounded-2xl border border-border/50 bg-background/40 items-start group hover:border-primary/30 hover:bg-background/60 transition-all shadow-sm"
                                        >
                                            <div className="flex-1 space-y-4">
                                                <Input
                                                    placeholder="Enter question text..."
                                                    className="rounded-xl border-none bg-transparent focus:ring-0 text-sm font-medium p-0 h-auto"
                                                    value={q.text}
                                                    onChange={(e) => {
                                                        const newQs = [...newForm.questions];
                                                        newQs[idx].text = e.target.value;
                                                        setNewForm({ ...newForm, questions: newQs });
                                                    }}
                                                />
                                                <div className="flex gap-4 items-center">
                                                    <Select
                                                        value={q.type}
                                                        onValueChange={(val) => {
                                                            const newQs = [...newForm.questions];
                                                            newQs[idx].type = val;
                                                            setNewForm({ ...newForm, questions: newQs });
                                                        }}
                                                    >
                                                        <SelectTrigger className="w-[160px] h-9 text-xs rounded-xl bg-muted/20 border-none shadow-none">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent className="rounded-xl">
                                                            <SelectItem value="text">Short Text</SelectItem>
                                                            <SelectItem value="dropdown">Dropdown</SelectItem>
                                                            <SelectItem value="checkbox">Checkbox</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <Badge variant="secondary" className="bg-primary/5 text-primary border-none text-[10px] px-2 py-0">#{idx + 1}</Badge>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="rounded-xl h-9 w-9 text-destructive opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10"
                                                onClick={() => {
                                                    const newQs = newForm.questions.filter(item => item.id !== q.id);
                                                    setNewForm({ ...newForm, questions: newQs });
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                <Button
                                    variant="outline"
                                    className="rounded-2xl w-full border-dashed border-2 py-8 hover:bg-primary/5 hover:border-primary/50 transition-all text-muted-foreground flex flex-col gap-2"
                                    onClick={() => setNewForm({
                                        ...newForm,
                                        questions: [...newForm.questions, { id: Date.now().toString(), text: '', type: 'text' }]
                                    })}
                                >
                                    <div className="p-2 bg-primary/10 rounded-full">
                                        <Plus className="h-4 w-4 text-primary" />
                                    </div>
                                    <span className="text-xs font-semibold">Add New Question</span>
                                </Button>
                            </div>
                            <div className="flex gap-3 pt-4 border-t border-border/20">
                                <Button className="rounded-2xl px-10 h-11 bg-primary shadow-lg shadow-primary/20" onClick={() => {
                                    addActivity('forms', `Form saved: ${newForm.title || 'Untitled'}`);
                                }}>Save Form</Button>
                                <Button variant="outline" className="rounded-2xl h-11 px-6 border-border/50 hover:bg-muted" onClick={handleGenerateFormLink}>
                                    <LinkIcon className="h-4 w-4 mr-2" /> Share Link
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 shadow-xl shadow-primary/5 bg-background/60 backdrop-blur-xl h-fit">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold">Form Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="p-8 text-center border-2 border-dashed border-border/30 rounded-[2rem] bg-muted/10 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="text-5xl font-bold text-primary mb-2 transition-transform group-hover:scale-110 duration-500">
                                    {forms.reduce((acc, f) => acc + (f.responses?.length || 0), 0)}
                                </div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Total Responses</p>
                                <p className="text-[10px] text-muted-foreground/60 mt-1">Across {forms.length} Published Forms</p>
                            </div>
                            <div className="space-y-3 pt-2">
                                <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                                    <HelpCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-amber-600">Pro Tip</p>
                                        <p className="text-[10px] text-amber-800/70 leading-relaxed">Share links directly via email or embed them in your website for automated lead capture.</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );

    const renderAudit = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-semibold">Website Audit</h1>
                <Button className="rounded-xl" onClick={() => handleExportPDF(null, 'audit')}>
                    <Download className="mr-2 h-4 w-4" />
                    Export Report
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(auditChecklist).map(([category, items]) => (
                    <Card key={category} className="border-border/50 shadow-xl shadow-primary/5 bg-background/60 backdrop-blur-xl overflow-hidden">
                        <CardHeader className="bg-muted/10 border-b border-border/20">
                            <CardTitle className="text-lg font-semibold">{category}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-6">
                            {items.map((item, idx) => (
                                <div key={idx} className="flex items-center space-x-3 group cursor-pointer hover:bg-muted/50 p-2 rounded-xl transition-colors" onClick={() => toggleAuditItem(`${category}-${item}`)}>
                                    <Checkbox
                                        id={`${category}-${idx}`}
                                        className="rounded-lg h-5 w-5 border-border/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all"
                                        checked={auditScores[`${category}-${item}`] || false}
                                        onCheckedChange={() => { }}
                                    />
                                    <Label htmlFor={`${category}-${idx}`} className="text-sm font-medium cursor-pointer flex-1 group-hover:text-primary transition-colors">
                                        {item}
                                    </Label>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="border-border/50 shadow-2xl shadow-primary/10 bg-background/80 backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-3xl" />
                <CardHeader>
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        Final Audit Score
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-6">
                        <div className="text-7xl font-black bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent mb-4 tracking-tighter">
                            {calculateAuditScore()}%
                        </div>
                        <p className="text-muted-foreground font-medium">Complete the checklist to maximize your score and conversion.</p>
                        <div className="w-full bg-muted/30 h-3 rounded-full mt-8 overflow-hidden border border-border/50">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${calculateAuditScore()}%` }}
                                className="h-full bg-primary shadow-[0_0_20px_rgba(var(--primary),0.5)]"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    const renderScripts = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-semibold">Scripts</h1>
            </div>

            <Tabs defaultValue="Sales" className="w-full">
                <TabsList className="flex gap-2 bg-muted/40 backdrop-blur-sm p-1.5 w-fit rounded-2xl border border-border/50 mb-6">
                    {['Sales', 'Follow-ups', 'Objections'].map((tab) => (
                        <TabsTrigger
                            key={tab}
                            value={tab}
                            className="rounded-xl px-6 py-2 text-xs font-semibold transition-all data-[state=active]:bg-background data-[state=active]:shadow-lg data-[state=active]:text-primary"
                        >
                            {tab}
                        </TabsTrigger>
                    ))}
                </TabsList>
                {Object.entries(scripts).map(([category, scriptList]) => (
                    <TabsContent key={category} value={category} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {scriptList.map((script, idx) => (
                            <Card key={idx} className="border-border/50 shadow-xl shadow-primary/5 bg-background/60 backdrop-blur-xl group hover:border-primary/50 transition-all overflow-hidden">
                                <CardContent className="p-8 relative">
                                    <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="p-1 px-2 rounded-lg bg-primary/10 text-primary text-[10px] font-bold">Template #{idx + 1}</div>
                                    </div>
                                    <div className="flex flex-col gap-6">
                                        <p className="text-sm leading-relaxed text-foreground/80 font-medium italic">"{script}"</p>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="rounded-xl self-end h-10 px-4 hover:bg-primary/10 hover:text-primary transition-all border border-border/20"
                                            onClick={() => handleCopy(script)}
                                        >
                                            <Copy className="h-4 w-4 mr-2" /> Copy Script
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );

    const renderVault = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-semibold">Vault</h1>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="rounded-xl">
                            <Plus className="mr-2 h-4 w-4" />
                            New Note
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create Note</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input
                                    placeholder="Note title"
                                    className="rounded-xl"
                                    value={newNote.title || ''}
                                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Content</Label>
                                <Textarea
                                    placeholder="Write your note..."
                                    className="rounded-xl min-h-[200px]"
                                    value={newNote.content || ''}
                                    onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Tags</Label>
                                <Input
                                    placeholder="Add tags (comma separated)"
                                    className="rounded-xl"
                                    onChange={(e) => setNewNote({ ...newNote, tags: e.target.value.split(',').map(t => t.trim()) })}
                                />
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <Label htmlFor="sensitive-note" className="cursor-pointer">Mark as Sensitive</Label>
                                <Switch
                                    id="sensitive-note"
                                    checked={newNote.isSensitive || false}
                                    onCheckedChange={(val) => setNewNote({ ...newNote, isSensitive: val })}
                                />
                            </div>
                            <Button className="w-full rounded-xl" onClick={handleSaveNote}>Save Note</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex gap-4 items-center bg-background/40 backdrop-blur-md p-3 rounded-2xl border border-border/50">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Search your secure vault..."
                        className="rounded-xl border-none bg-muted/20 pl-11 h-11 focus-visible:bg-background transition-all"
                    />
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-border/50"><Search className="h-4 w-4" /></Button>
                    <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-border/50"><MoreVertical className="h-4 w-4" /></Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {notes.map((note) => (
                        <motion.div
                            key={note.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ y: -4 }}
                            className="group cursor-pointer"
                        >
                            <Card className="h-full border-border/50 shadow-xl shadow-primary/5 bg-background/60 backdrop-blur-xl hover:border-primary/50 hover:shadow-primary/10 transition-all overflow-hidden flex flex-col">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="space-y-1">
                                            <CardTitle className="text-sm font-bold line-clamp-1 group-hover:text-primary transition-colors">{note.title}</CardTitle>
                                            <CardDescription className="text-[10px] flex items-center gap-1.5">
                                                <Calendar className="h-3 w-3" /> {note.date}
                                            </CardDescription>
                                        </div>
                                        {note.isSensitive && (
                                            <div className="p-1.5 rounded-lg bg-destructive/10 text-destructive">
                                                <Lock className="h-3.5 w-3.5" />
                                            </div>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1 pb-6">
                                    <p className="text-xs text-muted-foreground line-clamp-4 leading-relaxed font-medium mb-6">
                                        {note.isSensitive ? '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••' : note.content}
                                    </p>
                                    <div className="flex gap-2 flex-wrap mt-auto">
                                        {note.isSensitive && (
                                            <Badge variant="destructive" className="text-[10px] rounded-full px-2.5 py-0.5 bg-destructive/10 text-destructive border-none font-bold">
                                                Private
                                            </Badge>
                                        )}
                                        {note.tags.map((tag, idx) => (
                                            <Badge key={idx} variant="secondary" className="rounded-full text-[10px] px-2.5 py-0.5 bg-primary/5 text-primary border-none font-bold">
                                                #{tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
                <Button
                    variant="outline"
                    className="h-full min-h-[220px] rounded-3xl border-dashed border-2 flex flex-col gap-4 group hover:bg-primary/5 hover:border-primary/50 transition-all"
                    onClick={() => { }}
                >
                    <div className="p-4 bg-primary/10 rounded-2xl group-hover:scale-110 transition-transform">
                        <Plus className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-center">
                        <p className="font-bold text-sm">Add New Note</p>
                        <p className="text-xs text-muted-foreground mt-1">Securely store business data</p>
                    </div>
                </Button>
            </div>
        </div>
    );

    const renderTeam = () => {
        const [isAddingMember, setIsAddingMember] = useState(false);
        const [assigningTo, setAssigningTo] = useState<string | null>(null);
        const [newTeamMember, setNewTeamMember] = useState({
            fullName: '',
            email: '',
            phone: '',
            role: 'Telecaller'
        });

        const handleAddTeamMember = async () => {
            if (!newTeamMember.fullName || !newTeamMember.email) return;

            try {
                const response = await fetch('/api/team/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newTeamMember)
                });

                if (response.ok) {
                    addActivity('team', `Added new team member: ${newTeamMember.fullName}`);
                    setIsAddingMember(false);
                    setNewTeamMember({ fullName: '', email: '', phone: '', role: 'Telecaller' });
                    // Re-fetch profile to get updated employee list
                    const { data: profile } = await supabase
                        .from('user_profiles')
                        .select('*')
                        .single();
                    if (profile) setUserProfile(profile as any);
                }
            } catch (error) {
                console.error('Error adding team member:', error);
            }
        };

        const totalLeads = leads.length;
        const totalConversions = leads.filter(l => l.status === 'Closed').length;
        const efficiencyRating = totalLeads > 0 ? Math.round((totalConversions / totalLeads) * 100) : 0;
        const unassignedLeads = leads.filter(l => !l.assignedTo);

        return (
            <div className="space-y-8">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Force Management</span>
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight">Team Command</h1>
                        <p className="text-muted-foreground font-medium">Coordinate your sales force and monitor lead conversion performance.</p>
                    </div>

                    <Dialog open={isAddingMember} onOpenChange={setIsAddingMember}>
                        <DialogTrigger asChild>
                            <Button
                                disabled={activeRole !== 'Owner'}
                                className="rounded-2xl h-12 px-6 font-bold shadow-lg shadow-primary/20 gap-2 disabled:opacity-50"
                            >
                                <Plus className="h-5 w-5" /> Enlist Member
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="rounded-[2.5rem] border-border bg-popover/90 backdrop-blur-xl max-w-lg">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black tracking-tight">Add Team Member</DialogTitle>
                                <DialogDescription className="font-medium">Create a new account for your telecaller or sales representative.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Full Name</Label>
                                        <Input
                                            placeholder="John Doe"
                                            className="rounded-xl border-border bg-muted/50 h-11"
                                            value={newTeamMember.fullName}
                                            onChange={(e) => setNewTeamMember({ ...newTeamMember, fullName: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Email Address</Label>
                                        <Input
                                            type="email"
                                            placeholder="john@example.com"
                                            className="rounded-xl border-border bg-muted/50 h-11"
                                            value={newTeamMember.email}
                                            onChange={(e) => setNewTeamMember({ ...newTeamMember, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Phone Number</Label>
                                        <Input
                                            placeholder="+1 (555) 000-0000"
                                            className="rounded-xl border-border bg-muted/50 h-11"
                                            value={newTeamMember.phone}
                                            onChange={(e) => setNewTeamMember({ ...newTeamMember, phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Role</Label>
                                        <Select
                                            value={newTeamMember.role}
                                            onValueChange={(val) => setNewTeamMember({ ...newTeamMember, role: val })}
                                        >
                                            <SelectTrigger className="rounded-xl border-border bg-muted/50 h-11">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-border bg-popover/90 backdrop-blur-lg">
                                                <SelectItem value="Telecaller">Telecaller</SelectItem>
                                                <SelectItem value="Sales">Sales Professional</SelectItem>
                                                <SelectItem value="Manager">Field Manager</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <Button className="w-full rounded-xl h-12 font-bold shadow-lg shadow-primary/20 mt-2" onClick={handleAddTeamMember}>
                                    Confirm enlistment
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border border-border/50 shadow-xl bg-card/40 backdrop-blur-xl overflow-hidden rounded-[2rem] relative">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl -z-10" />
                        <CardHeader className="pb-2">
                            <CardDescription className="text-xs font-black uppercase tracking-widest text-muted-foreground">Active Force</CardDescription>
                            <CardTitle className="text-4xl font-extrabold mt-1 tracking-tighter">{(userProfile.employees || []).length}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center text-xs font-bold text-primary bg-primary/5 w-fit px-3 py-1.5 rounded-full border border-primary/10">
                                <Users className="h-3.5 w-3.5 mr-1.5" /> Ready for Action
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-border/50 shadow-xl bg-card/40 backdrop-blur-xl overflow-hidden rounded-[2rem] relative">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-3xl -z-10" />
                        <CardHeader className="pb-2">
                            <CardDescription className="text-xs font-black uppercase tracking-widest text-muted-foreground">Total Conversions</CardDescription>
                            <CardTitle className="text-4xl font-extrabold mt-1 tracking-tighter">{totalConversions}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center text-xs font-bold text-emerald-500 bg-emerald-500/5 w-fit px-3 py-1.5 rounded-full border border-emerald-500/10">
                                <TrendingUp className="h-3.5 w-3.5 mr-1.5" /> Conversion Metric
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-border/50 shadow-xl bg-card/40 backdrop-blur-xl overflow-hidden rounded-[2rem] relative">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-3xl -z-10" />
                        <CardHeader className="pb-2">
                            <CardDescription className="text-xs font-black uppercase tracking-widest text-muted-foreground">Efficiency Rating</CardDescription>
                            <CardTitle className="text-4xl font-extrabold mt-1 tracking-tighter">{efficiencyRating}%</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center text-xs font-bold text-blue-500 bg-blue-500/5 w-fit px-3 py-1.5 rounded-full border border-blue-500/10">
                                <CheckSquare className="h-3.5 w-3.5 mr-1.5" /> Performance Ops
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {(userProfile.employees || []).length === 0 ? (
                        <Card className="lg:col-span-2 border border-dashed border-border/50 bg-muted/10 rounded-[2.5rem] p-12 text-center">
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Users className="h-10 w-10 text-primary opacity-50" />
                            </div>
                            <h3 className="text-2xl font-black tracking-tight mb-2">No active personnel</h3>
                            <p className="text-muted-foreground max-w-md mx-auto mb-8 font-medium">Your sales force is empty. Enlist team members to start distributing leads and tracking performance.</p>
                            <Button onClick={() => setIsAddingMember(true)} className="rounded-xl h-11 px-8 font-bold">Enlist Your First Member</Button>
                        </Card>
                    ) : (
                        (userProfile.employees || []).map((emp) => {
                            const empLeads = leads.filter(l => l.assignedTo === emp.id);
                            const empConversions = empLeads.filter(l => l.status === 'Closed').length;
                            const empConversionRate = empLeads.length > 0 ? Math.round((empConversions / empLeads.length) * 100) : 0;

                            return (
                                <motion.div
                                    key={emp.id}
                                    whileHover={{ y: -5 }}
                                    className="group"
                                >
                                    <Card className="border border-border/50 shadow-2xl bg-card/40 backdrop-blur-xl overflow-hidden rounded-[2.5rem] transition-all hover:border-primary/50 relative">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[80px] -z-10 group-hover:bg-primary/10 transition-colors" />
                                        <CardContent className="p-8">
                                            <div className="flex justify-between items-start mb-8">
                                                <div className="flex items-center gap-5">
                                                    <Avatar className="h-16 w-16 border-2 border-primary/20 shadow-xl group-hover:scale-105 transition-transform">
                                                        <AvatarFallback className="bg-primary text-primary-foreground text-xl font-black">
                                                            {emp.name.split(' ').map(n => n[0]).join('')}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <h3 className="text-xl font-extrabold tracking-tight group-hover:text-primary transition-colors">{emp.name}</h3>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <Badge variant="outline" className="rounded-full text-[10px] font-black uppercase tracking-widest border-primary/30 text-primary py-0 px-2">{emp.role}</Badge>
                                                            <Badge variant="secondary" className="rounded-full text-[10px] font-black uppercase tracking-widest py-0 px-2 opacity-70">Active</Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/10 transition-colors">
                                                            <MoreVertical className="h-5 w-5 text-muted-foreground" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="rounded-2xl border-border bg-popover/90 backdrop-blur-lg">
                                                        <DropdownMenuItem className="rounded-xl font-bold p-3">View Detailed Intel</DropdownMenuItem>
                                                        <DropdownMenuItem className="rounded-xl font-bold p-3">Modify Permissions</DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => handleDeleteEmployee(emp.id)} className="rounded-xl font-bold p-3 text-destructive">Decommission Member</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mb-8">
                                                <div className="p-5 rounded-3xl bg-muted/30 border border-border/50 space-y-1">
                                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Leads Deployed</p>
                                                    <p className="text-2xl font-black tracking-tighter">{empLeads.length}</p>
                                                </div>
                                                <div className="p-5 rounded-3xl bg-muted/30 border border-border/50 space-y-1">
                                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Conversion Rate</p>
                                                    <p className="text-2xl font-black tracking-tighter">{empConversionRate}%</p>
                                                </div>
                                            </div>

                                            <div className="flex gap-3">
                                                <Dialog open={assigningTo === emp.id} onOpenChange={(open) => !open && setAssigningTo(null)}>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            disabled={activeRole !== 'Owner'}
                                                            onClick={() => setAssigningTo(emp.id)}
                                                            className="flex-1 rounded-2xl h-12 font-bold shadow-lg shadow-primary/10 transition-all hover:shadow-primary/20 active:scale-[0.98] disabled:opacity-50"
                                                        >
                                                            Assign New Lead
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="rounded-[2.5rem] border-border bg-popover/90 backdrop-blur-xl max-w-md">
                                                        <DialogHeader>
                                                            <DialogTitle className="text-2xl font-black tracking-tight">Deploy Lead to {emp.name}</DialogTitle>
                                                            <DialogDescription className="font-medium">Directly assign an unassigned lead to this team member.</DialogDescription>
                                                        </DialogHeader>
                                                        <div className="space-y-4 pt-4">
                                                            {unassignedLeads.length === 0 ? (
                                                                <div className="text-center py-8 opacity-50 bg-muted/20 rounded-2xl border border-dashed border-border">
                                                                    <p className="font-bold">No unassigned leads available</p>
                                                                </div>
                                                            ) : (
                                                                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                                                    {unassignedLeads.map(lead => (
                                                                        <Button
                                                                            key={lead.id}
                                                                            variant="outline"
                                                                            className="w-full justify-start rounded-xl p-6 h-auto border-border/50 hover:bg-primary/5 hover:border-primary/30 group"
                                                                            onClick={async () => {
                                                                                const updatedLeads = leads.map(l => l.id === lead.id ? { ...l, assignedTo: emp.id } : l);
                                                                                setLeads(updatedLeads);
                                                                                addActivity('team', `Lead ${lead.name} manual-deployed to ${emp.name}`);

                                                                                // Automated Task Trigger
                                                                                const newTaskObj: Task = {
                                                                                    id: Date.now().toString(),
                                                                                    title: `Process Lead: ${lead.name}`,
                                                                                    status: 'To-Do',
                                                                                    priority: lead.quality === 'Hot' ? 'High' : (lead.quality === 'Warm' ? 'Medium' : 'Low'),
                                                                                    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                                                                                    subtasks: [],
                                                                                    assignedTo: emp.id,
                                                                                    history: [`Manual-assigned via Team Command by Owner`]
                                                                                };
                                                                                setTasks(prev => [newTaskObj, ...prev]);
                                                                                await syncToSupabase('tasks', newTaskObj);
                                                                                await syncToSupabase('leads', { ...lead, assignedTo: emp.id });
                                                                                setAssigningTo(null);
                                                                            }}
                                                                        >
                                                                            <div className="text-left">
                                                                                <p className="font-bold group-hover:text-primary transition-colors">{lead.name}</p>
                                                                                <p className="text-[10px] font-black uppercase opacity-60 mt-1">{lead.source} • {lead.quality} Quality</p>
                                                                            </div>
                                                                        </Button>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            <Button variant="ghost" className="w-full rounded-xl" onClick={() => setAssigningTo(null)}>Cancel Mission</Button>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                                <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl border-border/50 hover:bg-primary/5 transition-colors" onClick={() => window.location.href = `mailto:${emp.email}`}>
                                                    <Mail className="h-5 w-5" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </div>
        );
    };

    const renderProfile = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-semibold">Profile</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="border-0 shadow-sm lg:col-span-1">
                    <CardContent className="p-6 space-y-6">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <Avatar className="w-24 h-24">
                                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">{userProfile.avatar}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h2 className="text-xl font-semibold">{userProfile.name}</h2>
                                <p className="text-sm text-muted-foreground">{userProfile.role}</p>
                            </div>
                            <Badge variant="secondary" className="rounded-full">{userProfile.plan}</Badge>
                            <Button variant="outline" className="w-full rounded-xl">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Profile
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Full Name</Label>
                                <Input
                                    value={tempProfile.name}
                                    className="rounded-xl"
                                    onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input
                                    value={tempProfile.email}
                                    type="email"
                                    className="rounded-xl"
                                    onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Company</Label>
                                <Input
                                    value={tempProfile.company}
                                    className="rounded-xl"
                                    onChange={(e) => setTempProfile({ ...tempProfile, company: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Role</Label>
                                <Input
                                    value={tempProfile.role}
                                    className="rounded-xl"
                                    onChange={(e) => setTempProfile({ ...tempProfile, role: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label>Company Address</Label>
                                <Textarea
                                    value={tempProfile.address}
                                    className="rounded-xl min-h-[80px]"
                                    onChange={(e) => setTempProfile({ ...tempProfile, address: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Tax ID / GSTIN</Label>
                                <Input
                                    value={tempProfile.taxId}
                                    className="rounded-xl"
                                    onChange={(e) => setTempProfile({ ...tempProfile, taxId: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Website</Label>
                                <Input
                                    value={tempProfile.website}
                                    placeholder="www.example.com"
                                    className="rounded-xl"
                                    onChange={(e) => setTempProfile({ ...tempProfile, website: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Member Since</Label>
                                <Input value={tempProfile.joinDate} disabled className="rounded-xl" />
                            </div>
                        </div>
                        <Button className="rounded-xl" onClick={handleUpdateProfile}>Save Changes</Button>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle>Security</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Current Password</Label>
                            <Input type="password" placeholder="••••••••" className="rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <Label>New Password</Label>
                            <Input type="password" placeholder="••••••••" className="rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <Label>Confirm New Password</Label>
                            <Input type="password" placeholder="••••••••" className="rounded-xl" />
                        </div>
                        <Button className="rounded-xl" onClick={handleUpdatePassword}>Update Password</Button>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle>Subscription</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Current Plan</span>
                                <Badge variant="default" className="rounded-full">{userProfile.plan}</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Status</span>
                                <Badge variant="outline" className="rounded-full text-green-600 border-green-600">Active</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Billing Cycle</span>
                                <span className="text-sm font-medium">Monthly</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Next Billing Date</span>
                                <span className="text-sm font-medium">Feb 15, 2024</span>
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                            <Button variant="outline" className="w-full rounded-xl" onClick={handleManageBilling}>
                                <CreditCard className="mr-2 h-4 w-4" />
                                Manage Billing
                            </Button>
                            <Button variant="outline" className="w-full rounded-xl">Upgrade Plan</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <CardTitle>Business Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Company Logo (URL)</Label>
                            <Input
                                value={tempProfile.businessLogo}
                                placeholder="https://..."
                                className="rounded-xl"
                                onChange={(e) => setTempProfile({ ...tempProfile, businessLogo: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Tax ID / GSTIN</Label>
                            <Input
                                value={tempProfile.taxId}
                                className="rounded-xl"
                                onChange={(e) => setTempProfile({ ...tempProfile, taxId: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Company Address</Label>
                        <Textarea
                            value={tempProfile.address}
                            className="rounded-xl min-h-[80px]"
                            onChange={(e) => setTempProfile({ ...tempProfile, address: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Preferred Currency</Label>
                            <Select
                                value={tempSettings.currency}
                                onValueChange={(val) => setTempSettings({ ...tempSettings, currency: val })}
                            >
                                <SelectTrigger className="rounded-xl">
                                    <SelectValue placeholder="Select Currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="USD">USD ($)</SelectItem>
                                    <SelectItem value="INR">INR (₹)</SelectItem>
                                    <SelectItem value="EUR">EUR (€)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Invoice Prefix</Label>
                            <Input
                                value={tempSettings.invoicePrefix}
                                className="rounded-xl"
                                onChange={(e) => setTempSettings({ ...tempSettings, invoicePrefix: e.target.value })}
                            />
                        </div>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">GST Support</p>
                            <p className="text-sm text-muted-foreground">Enable GST fields in invoices (CGST/SGST/IGST)</p>
                        </div>
                        <Switch
                            checked={tempSettings.gstEnabled}
                            onCheckedChange={(val) => setTempSettings({ ...tempSettings, gstEnabled: val })}
                        />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Auto-reminders</p>
                            <p className="text-sm text-muted-foreground">Send automatic follow-ups for overdue invoices</p>
                        </div>
                        <Switch
                            checked={tempSettings.autoReminder}
                            onCheckedChange={(val) => setTempSettings({ ...tempSettings, autoReminder: val })}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card className="border-0 shadow-sm overflow-hidden">
                <CardHeader className="bg-primary/5 pb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Team & Telecallers</CardTitle>
                            <CardDescription>Manage your employees and assign tasks or leads to them</CardDescription>
                        </div>
                        <Users className="h-5 w-5 text-primary opacity-50" />
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Add New Member</h3>
                            <div className="space-y-3 p-4 rounded-xl border border-dashed bg-muted/20">
                                <div className="space-y-2">
                                    <Label>Employee Name</Label>
                                    <Input
                                        placeholder="Enter name"
                                        className="rounded-xl bg-white"
                                        value={newEmployee.name}
                                        onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input
                                        placeholder="employee@example.com"
                                        className="rounded-xl bg-white"
                                        value={newEmployee.email}
                                        onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Password</Label>
                                    <Input
                                        type="password"
                                        placeholder="Set password"
                                        className="rounded-xl bg-white"
                                        value={newEmployee.password}
                                        onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Role</Label>
                                    <Select
                                        value={newEmployee.role}
                                        onValueChange={(val) => setNewEmployee({ ...newEmployee, role: val })}
                                    >
                                        <SelectTrigger className="rounded-xl bg-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Telecaller">Telecaller</SelectItem>
                                            <SelectItem value="Sales">Sales Rep</SelectItem>
                                            <SelectItem value="Manager">Manager</SelectItem>
                                            <SelectItem value="Support">Support</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button className="w-full rounded-xl" onClick={handleAddEmployee}>
                                    <Plus className="mr-2 h-4 w-4" /> Add to Team
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Active Team</h3>
                            <div className="space-y-2">
                                {(userProfile.employees || []).length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground text-sm italic">
                                        No team members added yet.
                                    </div>
                                ) : (
                                    (userProfile.employees || []).map((emp) => (
                                        <div key={emp.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/40 group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                    {emp.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">{emp.name}</p>
                                                    <p className="text-[10px] text-muted-foreground">{emp.role}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className={`rounded-lg h-8 text-[10px] uppercase font-bold tracking-tighter ${activeEmployeeId === emp.id ? 'bg-green-100 text-green-700' : 'bg-primary/5 text-primary hover:bg-primary/10'}`}
                                                    onClick={() => {
                                                        setActiveRole('Employee');
                                                        setActiveEmployeeId(emp.id);
                                                        setActiveView('crm');
                                                        addActivity('system', `Logged in as ${emp.name}`);
                                                    }}
                                                >
                                                    {activeEmployeeId === emp.id ? 'ActiveSession' : 'Login Port'}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="rounded-xl h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => handleDeleteEmployee(emp.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-destructive/5 border-destructive/20">
                <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button variant="destructive" className="rounded-xl" onClick={async () => {
                        await supabase.auth.signOut();
                        localStorage.clear();
                        window.location.href = '/login';
                    }}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout and Clear All Data
                    </Button>
                </CardContent>
            </Card>
        </div>
    );

    const renderHelpCenter = () => (
        <Dialog open={showHelpCenter} onOpenChange={setShowHelpCenter}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Help Center</DialogTitle>
                    <DialogDescription>
                        Find answers to common questions and guides.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search articles..."
                            className="pl-9 rounded-xl"
                            value={helpSearch}
                            onChange={(e) => setHelpSearch(e.target.value)}
                        />
                    </div>
                    <div className="h-[400px] overflow-y-auto space-y-4 pr-2">
                        {helpArticles
                            .filter(article => article.title.toLowerCase().includes(helpSearch.toLowerCase()) || article.content.toLowerCase().includes(helpSearch.toLowerCase()))
                            .map((article) => (
                                <Card key={article.id} className="border shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                    <div className="p-4">
                                        <h3 className="font-semibold text-lg mb-1 flex items-center">
                                            <FileText className="h-4 w-4 mr-2 text-primary" />
                                            {article.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {article.content}
                                        </p>
                                    </div>
                                </Card>
                            ))}
                        {helpArticles.filter(article => article.title.toLowerCase().includes(helpSearch.toLowerCase())).length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                <HelpCircle className="h-12 w-12 mx-auto mb-2 opacity-20" />
                                <p>No articles found matching "{helpSearch}"</p>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );

    const renderLiveChat = () => (
        <Dialog open={showLiveChat} onOpenChange={setShowLiveChat}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                        Live Support
                    </DialogTitle>
                    <DialogDescription>
                        Chat with our support team in real-time.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col h-[400px]">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30 rounded-lg mb-4">
                        {chatMessages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${msg.role === 'user'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-white border shadow-sm'
                                        }`}
                                >
                                    <p className="text-sm">{msg.text}</p>
                                    <span className="text-[10px] opacity-70 mt-1 block">
                                        {msg.time}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Type your message..."
                            className="rounded-xl"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <Button size="icon" className="rounded-xl" onClick={handleSendMessage}>
                            <ArrowUpRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );

    const renderSupport = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold">Customer Support</h1>
                    <p className="text-muted-foreground mt-1">Get help or track your support requests</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="rounded-xl" onClick={() => setShowHelpCenter(true)}>
                        <BookOpen className="mr-2 h-4 w-4" />
                        Help Center
                    </Button>
                    <Button variant="outline" className="rounded-xl" onClick={() => setShowLiveChat(true)}>
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Live Chat
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="border-0 shadow-sm lg:col-span-2">
                    <CardHeader>
                        <CardTitle>New Ticket</CardTitle>
                        <CardDescription>Submit a new support request</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Subject</Label>
                            <Input
                                placeholder="Brief summary of the issue"
                                className="rounded-xl"
                                value={newTicket.subject}
                                onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Priority</Label>
                                <Select
                                    value={newTicket.priority}
                                    onValueChange={(val: any) => setNewTicket({ ...newTicket, priority: val })}
                                >
                                    <SelectTrigger className="rounded-xl">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Low">Low</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="High">High</SelectItem>
                                        <SelectItem value="Critical">Critical</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                placeholder="Describe your issue in detail..."
                                className="rounded-xl min-h-[150px]"
                                value={newTicket.message}
                                onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                            />
                        </div>
                        <Button className="rounded-xl w-full" onClick={handleSubmitTicket}>
                            Submit Ticket
                        </Button>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6 text-center space-y-3">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                                <HelpCircle className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-semibold">Help Center</h3>
                            <p className="text-sm text-muted-foreground">Browse our documentation and guides</p>
                            <Button variant="outline" className="rounded-xl" onClick={() => setShowHelpCenter(true)}>Visit Help Center</Button>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6 text-center space-y-3">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                                <MessageSquare className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-semibold">Live Chat</h3>
                            <p className="text-sm text-muted-foreground">Chat with our support team in real-time</p>
                            <Button variant="outline" className="rounded-xl" onClick={() => setShowLiveChat(true)}>Start Chat</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <CardTitle>Your Support Tickets</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead>Subject</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {supportTickets.map((ticket) => (
                                <TableRow key={ticket.id} className="hover:bg-muted/50">
                                    <TableCell className="font-medium">{ticket.subject}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={`rounded-full ${ticket.priority === 'High' ? 'text-red-600 border-red-600' :
                                                ticket.priority === 'Medium' ? 'text-yellow-600 border-yellow-600' :
                                                    'text-green-600 border-green-600'
                                                }`}
                                        >
                                            {ticket.priority}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={ticket.status === 'Resolved' ? 'default' : 'secondary'}
                                            className="rounded-full"
                                        >
                                            {ticket.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{ticket.date}</TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="sm" className="rounded-lg">View</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <h4 className="font-medium">How do I export invoices as PDF?</h4>
                        <p className="text-sm text-muted-foreground">Click on the download icon next to any invoice in your invoices list. The PDF will be generated and downloaded automatically.</p>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                        <h4 className="font-medium">Can I upgrade or downgrade my plan?</h4>
                        <p className="text-sm text-muted-foreground">Yes! Visit your profile page and click on &quot;Manage Billing&quot; to change your subscription plan at any time.</p>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                        <h4 className="font-medium">How do I add team members?</h4>
                        <p className="text-sm text-muted-foreground">Team features are available on Pro and Enterprise plans. Contact our support team to enable team access.</p>
                    </div>
                </CardContent>
            </Card>
            {renderHelpCenter()}
            {renderLiveChat()}
        </div >
    );

    const renderContact = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-semibold">Contact Us</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle>Send us a Message</CardTitle>
                        <CardDescription>We&apos;ll get back to you within 24 hours</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Your Name</Label>
                            <Input placeholder="Enter your name" className="rounded-xl" defaultValue={userProfile.name} />
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input type="email" placeholder="your.email@example.com" className="rounded-xl" defaultValue={userProfile.email} />
                        </div>
                        <div className="space-y-2">
                            <Label>Subject</Label>
                            <Input placeholder="What's this about?" className="rounded-xl" id="contact-subject" />
                        </div>
                        <div className="space-y-2">
                            <Label>Message</Label>
                            <Textarea placeholder="Tell us more..." className="rounded-xl min-h-[150px]" id="contact-message" />
                        </div>
                        <Button className="w-full rounded-xl" onClick={() => {
                            addActivity('support', 'Contact form message sent');
                        }}>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Message
                        </Button>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <Mail className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">Email</p>
                                    <p className="text-sm text-muted-foreground">support@bizpilot-os.com</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <MessageSquare className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">Direct Support</p>
                                    <p className="text-sm text-muted-foreground">Available Mon-Fri, 9am-6pm EST via Email/Dashboard</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle>Office Hours</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Monday - Friday</span>
                                <span className="text-sm font-medium">9:00 AM - 6:00 PM</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Saturday</span>
                                <span className="text-sm font-medium">10:00 AM - 4:00 PM</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Sunday</span>
                                <span className="text-sm font-medium">Closed</span>
                            </div>
                            <Separator />
                            <p className="text-xs text-muted-foreground">All times are in Eastern Standard Time (EST)</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm bg-primary/5">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-3">
                                <Bell className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <p className="font-medium text-sm">Need urgent help?</p>
                                    <p className="text-xs text-muted-foreground mt-1">For critical issues, call our emergency hotline at +1 (555) 999-0000</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        if (isExpired && !isPaid && activeView !== 'billing' && activeView !== 'support' && activeView !== 'dashboard' && activeView !== 'leads' && activeView !== 'settings') {
            return (
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
                    <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center">
                        <Lock className="w-10 h-10 text-destructive" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold">Feature Locked</h2>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            Your 30-day evaluation has ended. Upgrade to the Paid plan to unlock Invoices, Tasks, Content Builder, and all professional tools.
                        </p>
                        <p className="text-sm font-medium text-primary">Your Dashboard, CRM, and Profile remain free for lifetime use.</p>
                    </div>
                    <Button onClick={() => setActiveView('billing')} size="lg" className="rounded-xl px-8">
                        Upgrade for Full Access
                    </Button>
                </div>
            );
        }

        switch (activeView) {
            case 'dashboard': return renderDashboard();
            case 'content': return renderContentBuilder();
            case 'invoices': return renderInvoices();
            case 'leads': return renderLeads();
            case 'team': return renderTeam();
            case 'tasks': return renderTasks();
            case 'proposals': return renderProposals();
            case 'finance': return renderFinance();
            case 'forms': return renderForms();
            case 'audit': return renderAudit();
            case 'scripts': return renderScripts();
            case 'vault': return renderVault();
            case 'profile': return renderProfile();
            case 'support': return renderSupport();
            case 'billing': return renderBilling();
            default: return renderDashboard();
        }
    };

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-card border-r border-border flex flex-col z-40 backdrop-blur-xl bg-card/80">
                <div className="p-6 border-b border-border flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                        <svg className="w-6 h-6 text-primary-foreground" viewBox="0 0 100 100" fill="none">
                            <path d="M20 80L50 20L80 50L65 50L50 35L35 65L50 65L65 80L20 80Z" fill="currentColor" />
                        </svg>
                    </div>
                    <span className="font-bold text-xl tracking-tight">BizPilot<span className="font-light opacity-70">OS</span></span>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeView === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveView(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`}
                            >
                                <Icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-primary'}`} />
                                <span className="font-semibold text-sm">{item.label}</span>
                                {isActive && (
                                    <motion.div layoutId="activeNav" className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                                )}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-border space-y-2">
                    {bottomNavItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeView === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveView(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                            >
                                <Icon className="h-5 w-5" />
                                <span className="font-semibold text-sm">{item.label}</span>
                            </button>
                        );
                    })}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-all font-semibold text-sm"
                    >
                        <LogOut className="h-5 w-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            <main className="flex-1 flex flex-col overflow-hidden relative ml-64">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] -z-10 rounded-full" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/5 blur-[100px] -z-10 rounded-full" />

                {/* Header */}
                <header className="h-20 border-b border-border flex items-center justify-between px-8 bg-background/60 backdrop-blur-md z-30">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold tracking-tight capitalize">{activeView.replace('-', ' ')}</h2>
                        {isPaid && (
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-bold px-3 py-1">
                                PRO ACCESS
                            </Badge>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        {activeRole === 'Owner' && (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="rounded-xl h-9 border-dashed mr-4 font-bold tracking-tight">
                                        <Lock className="mr-2 h-3.5 w-3.5" /> Staff Login
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-sm rounded-[2rem] border-border bg-popover/90 backdrop-blur-xl">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-bold tracking-tight">Staff Login</DialogTitle>
                                        <DialogDescription className="font-medium">Enter your employee credentials to access your dashboard</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 pt-4">
                                        <div className="space-y-2">
                                            <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Email Address</Label>
                                            <Input
                                                placeholder="email@example.com"
                                                className="rounded-xl border-border bg-muted/50 h-11"
                                                value={loginEmail}
                                                onChange={(e) => setLoginEmail(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Password</Label>
                                            <Input
                                                type="password"
                                                placeholder="••••••••"
                                                className="rounded-xl border-border bg-muted/50 h-11"
                                                value={loginPassword}
                                                onChange={(e) => setLoginPassword(e.target.value)}
                                            />
                                        </div>
                                        {loginError && <p className="text-xs text-destructive font-bold">{loginError}</p>}
                                        <Button className="w-full rounded-xl h-11 font-bold shadow-lg shadow-primary/20" onClick={handleManualEmployeeLogin}>Login to Pilot</Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        )}

                        <div className="flex items-center gap-2 border-l border-border pl-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center gap-3 hover:bg-muted/30 rounded-full px-1 py-1 transition-all border border-border bg-muted/10 group">
                                        <div className="text-right hidden sm:block pl-3">
                                            <div className="text-xs font-bold leading-none">
                                                {activeRole === 'Employee'
                                                    ? (userProfile.employees?.find(e => e.id === activeEmployeeId)?.name || 'Employee')
                                                    : userProfile.name}
                                            </div>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <Badge variant="secondary" className="rounded-full text-[8px] font-black uppercase tracking-tighter py-0 px-1.5">{userProfile.plan}</Badge>
                                                <Badge variant="outline" className="rounded-full text-[8px] font-black uppercase tracking-tighter py-0 px-1.5 border-primary/20 text-primary">Active</Badge>
                                            </div>
                                        </div>
                                        <Avatar className="h-9 w-9 border-2 border-background shadow-md group-hover:scale-105 transition-transform">
                                            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-black">
                                                {userProfile.name.split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 bg-popover/90 backdrop-blur-lg border-border shadow-2xl">
                                    <div className="px-3 py-3 border-b border-border/50 mb-1">
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Account</p>
                                        <p className="text-sm font-bold truncate">{userProfile.email}</p>
                                    </div>
                                    <DropdownMenuItem onClick={() => setActiveView('profile')} className="rounded-xl cursor-pointer py-3 font-bold group">
                                        <User className="mr-3 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" /> Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setActiveView('settings')} className="rounded-xl cursor-pointer py-3 font-bold group">
                                        <Settings className="mr-3 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" /> Settings
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-border/50 mx-2" />
                                    <DropdownMenuItem onClick={handleLogout} className="rounded-xl cursor-pointer py-3 text-destructive font-bold group">
                                        <LogOut className="mr-3 h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" /> Sign out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </header>

                <main className="p-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeView}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {renderContent()}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </main>
        </div>
    );
};

export default BizPilotDashboard;
