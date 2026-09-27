import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowDown, ArrowRight, Check, CheckCircle2,
  Clock3, FileCheck2, LockKeyhole, Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Accounting Manager Assessment — PAXOS" },
    { name: "description", content: "Complete the PAXOS Accounting Manager candidate assessment." },
    { property: "og:title", content: "Accounting Manager Assessment — PAXOS" },
    { property: "og:description", content: "A focused assessment of financial management, controls, and team leadership." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: AssessmentApp,
});

const sections = ["Financial Management", "Compliance & Controls", "Leadership & Team Management", "Video Question"];

function AssessmentApp() {
  return <div className="assessment-backdrop min-h-screen overflow-x-hidden text-foreground">
    <SiteHeader />
    <Introduction />
  </div>;
}

function Introduction() {
  const scrollToOverview = () => document.getElementById("assessment-overview")?.scrollIntoView({ behavior: "smooth", block: "start" });
  return <main>
    <section className="mx-auto grid min-h-[calc(100vh-108px)] max-w-6xl items-center gap-10 px-5 pb-16 lg:grid-cols-12">
      <div className="lg:col-span-7">
      <span className="inline-flex rounded-full border border-primary/20 bg-brand-soft px-3 py-1.5 text-xs font-semibold uppercase text-accent-foreground">Accounting Manager · 55 minutes</span>
      <h1 className="mt-6 max-w-3xl font-display text-5xl font-bold leading-[1.04] sm:text-6xl lg:text-7xl">Accounting Manager Assessment</h1>
      <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">Show us how you approach financial operations, safeguards, and people leadership. You’ll complete three short written sections and one recorded response.</p>
      <Button variant="pill" size="lg" className="mt-8" onClick={scrollToOverview}>Scroll to Begin <ArrowDown /></Button>
      <div className="mt-10 flex flex-wrap gap-6 text-sm text-muted-foreground"><span className="flex items-center gap-2"><Clock3 className="text-primary" /> About 55 minutes</span><span className="flex items-center gap-2"><LockKeyhole className="text-primary" /> Private and secure</span></div>
      </div>
      <div className="glass-panel rounded-3xl p-6 lg:col-span-5" aria-label="Assessment sections">
      <div className="flex items-center justify-between"><h2 className="font-display text-xl font-semibold">Your assessment</h2><span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-accent-foreground">4 sections</span></div>
      <div className="mt-5 space-y-3">{sections.map((item, index) => <div key={item} className="flex items-center gap-3 rounded-2xl border border-border/70 bg-surface-strong p-4"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-soft font-display font-bold text-accent-foreground">{index + 1}</span><div><p className="text-sm font-semibold">{item}</p><p className="mt-0.5 text-xs text-muted-foreground">{index === 3 ? "40 min · recorded response" : "5 min · 3 questions"}</p></div></div>)}</div>
      </div>
    </section>
    <section id="assessment-overview" className="mx-auto max-w-6xl scroll-mt-6 px-5 py-20">
    <div className="max-w-3xl"><p className="text-sm font-semibold text-primary">Before you begin</p><h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Assessment overview</h1><p className="mt-4 text-lg text-muted-foreground">A quick look at the role and what this assessment covers.</p></div>
    <div className="mt-10 grid gap-5 md:grid-cols-3">
      <OverviewCard icon={<FileCheck2 />} title="Responsibilities" items={["Own monthly and quarterly close", "Deliver accurate reporting", "Improve accounting operations"]} />
      <OverviewCard icon={<CheckCircle2 />} title="Key requirements" items={["7+ years of accounting experience", "Strong GAAP knowledge", "Audit and controls expertise"]} />
      <OverviewCard icon={<Users />} title="Assessment summary" items={["3 written sections", "1 recorded video response", "Answers save while you work"]} />
    </div>
    <div className="glass-panel mt-6 rounded-3xl p-6"><p className="font-semibold">Find a quiet place and close other tabs.</p><p className="mt-1 text-sm text-muted-foreground">Once a timed section begins, the timer cannot be paused.</p></div>
    </section>
    <CandidateForm />
  </main>;
}

function OverviewCard({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return <article className="glass-panel rounded-3xl p-6"><span className="grid size-11 place-items-center rounded-2xl bg-brand-soft text-primary">{icon}</span><h2 className="mt-5 font-display text-xl font-semibold">{title}</h2><ul className="mt-4 space-y-3">{items.map((item) => <li key={item} className="flex gap-2 text-sm leading-6 text-muted-foreground"><Check className="mt-1 size-4 shrink-0 text-primary" />{item}</li>)}</ul></article>;
}

function CandidateForm() {
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();
  return <section className="mx-auto max-w-3xl px-5 pb-24 pt-12">
    <div><p className="text-sm font-semibold text-primary">Final step</p><h1 className="mt-2 font-display text-4xl font-bold">Candidate information</h1><p className="mt-3 text-muted-foreground">Confirm your details before the timer starts.</p></div>
    <form className="glass-panel mt-8 rounded-3xl p-6 sm:p-8" onSubmit={(event) => { event.preventDefault(); if (agreed) navigate({ to: "/assessment" }); }}>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="First name"><Input required placeholder="Jordan" className="h-12 rounded-xl bg-surface-strong" /></Field>
        <Field label="Last name"><Input required placeholder="Lee" className="h-12 rounded-xl bg-surface-strong" /></Field>
        <Field label="Email address"><Input required type="email" placeholder="jordan@example.com" className="h-12 rounded-xl bg-surface-strong" /></Field>
        <Field label="Phone"><Input required type="tel" placeholder="+1 (555) 000-0000" className="h-12 rounded-xl bg-surface-strong" /></Field>
        <Field label="Gender"><Select required><SelectTrigger className="h-12 rounded-xl bg-surface-strong"><SelectValue placeholder="Select an option" /></SelectTrigger><SelectContent><SelectItem value="woman">Woman</SelectItem><SelectItem value="man">Man</SelectItem><SelectItem value="nonbinary">Non-binary</SelectItem><SelectItem value="self-describe">Prefer to self-describe</SelectItem><SelectItem value="not-say">Prefer not to say</SelectItem></SelectContent></Select></Field>
        <Field label="Years of experience"><Select required><SelectTrigger className="h-12 rounded-xl bg-surface-strong"><SelectValue placeholder="Select a range" /></SelectTrigger><SelectContent>{["0–2 years", "3–5 years", "6–9 years", "10+ years"].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></Field>
        <Field label="LinkedIn URL"><Input type="url" placeholder="https://linkedin.com/in/..." className="h-12 rounded-xl bg-surface-strong" /></Field>
        <Field label="Referral source"><Select><SelectTrigger className="h-12 rounded-xl bg-surface-strong"><SelectValue placeholder="How did you hear about us?" /></SelectTrigger><SelectContent>{["LinkedIn", "Employee referral", "Job board", "Recruiter", "Other"].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></Field>
      </div>
      <label className="mt-7 flex cursor-pointer items-start gap-3 rounded-2xl bg-brand-soft p-4 text-sm leading-6"><Checkbox checked={agreed} onCheckedChange={(value) => setAgreed(value === true)} className="mt-1" /><span>I confirm these details are accurate and agree to complete this assessment independently.</span></label>
      <div className="mt-7 flex justify-end"><Button variant="pill" size="lg" type="submit" disabled={!agreed}>Start Assessment <ArrowRight /></Button></div>
    </form>
  </section>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="grid gap-2 text-sm font-medium">{label}{children}</label>; }
