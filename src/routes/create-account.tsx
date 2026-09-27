import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/create-account")({
  head: () => ({ meta: [
    { title: "Create account — PAXOS Assessments" }, { name: "description", content: "Create your PAXOS candidate assessment account." },
    { property: "og:title", content: "Create account — PAXOS Assessments" }, { property: "og:description", content: "Set up your candidate assessment account." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ]}), component: CreateAccountPage,
});

function CreateAccountPage() { return <main className="assessment-backdrop grid min-h-screen place-items-center px-5 py-12"><section className="glass-panel w-full max-w-md rounded-3xl p-7 sm:p-9"><Link to="/" className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-2xl bg-primary font-display font-bold text-primary-foreground">P</span><span className="font-display text-lg font-bold">PAXOS</span></Link><h1 className="mt-10 font-display text-3xl font-bold">Create your account</h1><p className="mt-2 text-sm text-muted-foreground">Keep your assessment progress in one place.</p><form className="mt-7 space-y-5" onSubmit={(e) => e.preventDefault()}><div className="grid grid-cols-2 gap-3"><label className="grid gap-2 text-sm font-medium">First name<Input required className="h-12 rounded-xl bg-surface-strong" /></label><label className="grid gap-2 text-sm font-medium">Last name<Input required className="h-12 rounded-xl bg-surface-strong" /></label></div><label className="grid gap-2 text-sm font-medium">Email address<Input required type="email" placeholder="you@example.com" className="h-12 rounded-xl bg-surface-strong" /></label><label className="grid gap-2 text-sm font-medium">Password<Input required type="password" placeholder="At least 8 characters" minLength={8} className="h-12 rounded-xl bg-surface-strong" /></label><Button variant="pill" size="lg" className="w-full">Create account <ArrowRight /></Button></form><p className="mt-7 text-center text-sm text-muted-foreground">Already registered? <Link to="/login" className="font-semibold text-primary">Sign in</Link></p></section></main>; }