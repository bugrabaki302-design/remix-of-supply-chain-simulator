import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [
    { title: "Sign in — PAXOS Assessments" }, { name: "description", content: "Sign in to your PAXOS candidate assessment account." },
    { property: "og:title", content: "Sign in — PAXOS Assessments" }, { property: "og:description", content: "Access your candidate assessments." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ]}), component: LoginPage,
});

function LoginPage() { return <main className="assessment-backdrop grid min-h-screen place-items-center px-5 py-12"><section className="glass-panel w-full max-w-md rounded-3xl p-7 sm:p-9"><Link to="/" className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-2xl bg-primary font-display font-bold text-primary-foreground">P</span><span className="font-display text-lg font-bold">PAXOS</span></Link><h1 className="mt-10 font-display text-3xl font-bold">Welcome back</h1><p className="mt-2 text-sm text-muted-foreground">Sign in to continue your assessment.</p><form className="mt-7 space-y-5" onSubmit={(e) => e.preventDefault()}><label className="grid gap-2 text-sm font-medium">Email address<Input required type="email" placeholder="you@example.com" className="h-12 rounded-xl bg-surface-strong" /></label><label className="grid gap-2 text-sm font-medium">Password<Input required type="password" placeholder="Enter your password" className="h-12 rounded-xl bg-surface-strong" /></label><Button variant="pill" size="lg" className="w-full">Sign in <ArrowRight /></Button></form><p className="mt-7 text-center text-sm text-muted-foreground">New to PAXOS? <Link to="/create-account" className="font-semibold text-primary">Create an account</Link></p></section></main>; }