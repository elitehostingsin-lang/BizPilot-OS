# BizPilot OS - Technical Documentation & Overview

**BizPilot OS** is a unified business operating system designed for solopreneurs and small business teams. It consolidates CRM, Invoicing, Proposals, Content Planning, and Website Auditing into a single, high-performance web application.

## 🚀 Vision
The tool has transitioned from a subscription-based model to a **100% Free Lifetime Access** model. Growth is driven by a viral "Share-to-Unlock" referral gate during the signup process.

## 🛠️ Technology Stack

### Core Framework
*   **Next.js 14+**: Utilizing the App Router for optimized routing and layout management.
*   **React**: Modern component-based architecture with Hooks for state management.
*   **TypeScript**: Ensures type safety and improves maintainability across the codebase.

### Styling & UI
*   **Tailwind CSS**: For rapid, responsive, and highly customizable styling.
*   **Framer Motion**: Powering sleek micro-animations and smooth page transitions.
*   **Lucide React**: A comprehensive icon set used throughout the dashboard and landing page.
*   **Shadcn UI**: Primitive components (Buttons, Cards, Dialogs, etc.) for a premium, accessible UI.

### Infrastructure & Data
*   **Supabase (BaaS)**: 
    *   **PostgreSQL**: Secure storage for leads, tasks, invoices, and user profiles.
    *   **Auth**: Secure email/password authentication via Supabase Auth.
    *   **Storage**: Handling logo and content image uploads.
*   **Cloudflare Pages**: High-speed, global deployment on the edge.

## 🖇️ Key API Integrations
*   **Dodo Payments**: The infrastructure for Dodo payments remains in the codebase (API keys, webhooks) but has been bypassed to allow free access.
*   **Social Webhooks**: The system integrates with standard social sharing APIs (LinkedIn, Twitter, WhatsApp) to drive the referral loop.

## 🏗️ Project Architecture
*   `/app`: Contains all routes and server/client pages (Next.js App Router).
*   `/components`: Organized into modular functional groups (Dashboard, UI, Library, Blog).
*   `/lib`: Utility functions, Supabase clients, and central data stores (e.g., `blog-data.ts`).
*   `/public`: Static assets, logos, and global images.

## 🛡️ Security Best Practices
*   **Backend-First Secrets**: All API keys and signing secrets are managed via Environment Variables or secure server-side constants.
*   **Webhook Verification**: (Active) Webhook signatures are verified using HMAC to prevent spoofing.
*   **Supabase RLS**: Row Level Security ensures users can only access their own business data.

## 🎁 Post-Implementation State
1.  **Viral Signup**: Users must share the platform to 2 social channels to unlock lifetime free access.
2.  **Universal "Pro"**: All paid features are unlocked by default for everyone.
3.  **Active SEO**: Fully optimized metadata and JSON-LD for every blog post and landing page.
