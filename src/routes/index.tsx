import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ArrowDown, ArrowRight, Check, CheckCircle2, ChevronRight, CircleHelp,
  Clock3, FileCheck2, LockKeyhole, Mic, RotateCcw, Send, Sparkles,
  Square, Users, Video, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

type Screen = "welcome" | "overview" | "candidate" | "assessment" | "complete";
type RecordingState = "idle" | "preview" | "recording" | "review";

const sections = ["Financial Management", "Compliance & Controls", "Leadership & Team Management", "Video Question"];
const prompts = [
  {
    open: [
      "Walk us through how you would close the books for a quarter with a 12-person team.",
      "Describe how you would investigate and explain a material budget variance to senior leadership.",
    ],
    choice: "Which control most effectively prevents duplicate vendor payments?",
    options: ["Three-way match with PO, receipt, and invoice", "Manual approval by a single manager", "Weekly batch reconciliation only"],
  },
  {
    open: [
      "How would you prepare the organization for a first-year external audit?",
      "Describe your approach to identifying and remediating a control deficiency.",
    ],
    choice: "Who should approve changes to vendor banking details?",
    options: ["An independent authorized reviewer", "The employee entering the change", "The vendor without internal review"],
  },
  {
    open: [
      "Tell us how you coach a high-performing team member who is struggling with deadlines.",
      "How would you organize responsibilities across a growing accounting team?",
    ],
    choice: "Which practice best supports a resilient accounting team?",
    options: ["Documented processes and cross-training", "Keeping specialized knowledge with one person", "Changing ownership every week"],
  },
];

function Brand() {
  return <Link to="/" className="flex items-center gap-3 focus-ring rounded-xl" aria-label="PAXOS home">
    <span className="grid size-11 place-items-center rounded-2xl bg-primary font-display text-lg font-bold text-primary-foreground shadow-lg">P</span>
    <span><span className="block font-display text-lg font-bold leading-none">PAXOS</span><span className="mt-1 block text-[10px] font-semibold uppercase text-muted-foreground">Assessment Suite</span></span>
  </Link>;
}

function Header({ onSupport }: { onSupport: () => void }) {
  return <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6 lg:py-8">
    <Brand />
    <nav className="flex items-center gap-2" aria-label="Account navigation">
      <Button variant="ghost" className="hidden rounded-full sm:inline-flex" asChild><Link to="/login">Sign in</Link></Button>
      <Button variant="soft" size="icon" className="lg:hidden" onClick={onSupport} aria-label="Open assessment support"><CircleHelp /></Button>
      <Button variant="pill" asChild><Link to="/create-account">Create account</Link></Button>
    </nav>
  </header>;
}

function AssessmentApp() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [supportOpen, setSupportOpen] = useState(false);
  const [section, setSection] = useState(0);
  const [seconds, setSeconds] = useState(300);
  const [submitted, setSubmitted] = useState<number[]>([]);

  useEffect(() => {
    if (screen !== "assessment" || seconds <= 0) return;
    const timer = window.setInterval(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearInterval(timer);
  }, [screen, section, seconds]);

  const goTo = (next: Screen) => { setScreen(next); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const submitSection = () => {
    setSubmitted((items) => [...items, section]);
    setSection((value) => value + 1);
    setSeconds(2400);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return <div className="assessment-backdrop min-h-screen overflow-x-hidden text-foreground">
    <Header onSupport={() => setSupportOpen(true)} />
    {screen === "welcome" && <Welcome onBegin={() => goTo("overview")} />}
    {screen === "overview" && <Overview onContinue={() => goTo("candidate")} />}
    {screen === "candidate" && <CandidateForm onStart={() => goTo("assessment")} />}
    {screen === "assessment" && <Assessment section={section} seconds={seconds} submitted={submitted} onSubmit={submitSection} onFinish={() => goTo("complete")} onSupport={() => setSupportOpen(true)} />}
    {screen === "complete" && <Complete />}
    <SupportPanel open={supportOpen} onClose={() => setSupportOpen(false)} />
  </div>;
}

function Welcome({ onBegin }: { onBegin: () => void }) {
  return <main className="mx-auto grid min-h-[calc(100vh-108px)] max-w-6xl items-center gap-10 px-5 pb-16 lg:grid-cols-12">
    <section className="lg:col-span-7">
      <span className="inline-flex rounded-full border border-primary/20 bg-brand-soft px-3 py-1.5 text-xs font-semibold uppercase text-accent-foreground">Accounting Manager · 55 minutes</span>
      <h1 className="mt-6 max-w-3xl font-display text-5xl font-bold leading-[1.04] sm:text-6xl lg:text-7xl">Accounting Manager Assessment</h1>
      <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">Show us how you approach financial operations, safeguards, and people leadership. You’ll complete three short written sections and one recorded response.</p>
      <Button variant="pill" size="lg" className="mt-8" onClick={onBegin}>Scroll to Begin <ArrowDown /></Button>
      <div className="mt-10 flex flex-wrap gap-6 text-sm text-muted-foreground"><span className="flex items-center gap-2"><Clock3 className="text-primary" /> About 55 minutes</span><span className="flex items-center gap-2"><LockKeyhole className="text-primary" /> Private and secure</span></div>
    </section>
    <section className="glass-panel rounded-3xl p-6 lg:col-span-5" aria-label="Assessment sections">
      <div className="flex items-center justify-between"><h2 className="font-display text-xl font-semibold">Your assessment</h2><span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-accent-foreground">4 sections</span></div>
      <div className="mt-5 space-y-3">{sections.map((item, index) => <div key={item} className="flex items-center gap-3 rounded-2xl border border-border/70 bg-surface-strong p-4"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-soft font-display font-bold text-accent-foreground">{index + 1}</span><div><p className="text-sm font-semibold">{item}</p><p className="mt-0.5 text-xs text-muted-foreground">{index === 3 ? "40 min · recorded response" : "5 min · 3 questions"}</p></div></div>)}</div>
    </section>
  </main>;
}

function Overview({ onContinue }: { onContinue: () => void }) {
  return <main className="mx-auto max-w-6xl px-5 pb-16 pt-6">
    <div className="max-w-3xl"><p className="text-sm font-semibold text-primary">Before you begin</p><h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Assessment overview</h1><p className="mt-4 text-lg text-muted-foreground">A quick look at the role and what this assessment covers.</p></div>
    <div className="mt-10 grid gap-5 md:grid-cols-3">
      <OverviewCard icon={<FileCheck2 />} title="Responsibilities" items={["Own monthly and quarterly close", "Deliver accurate reporting", "Improve accounting operations"]} />
      <OverviewCard icon={<CheckCircle2 />} title="Key requirements" items={["7+ years of accounting experience", "Strong GAAP knowledge", "Audit and controls expertise"]} />
      <OverviewCard icon={<Users />} title="Assessment summary" items={["3 written sections", "1 recorded video response", "Answers save while you work"]} />
    </div>
    <div className="glass-panel mt-6 flex flex-col gap-5 rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold">Find a quiet place and close other tabs.</p><p className="mt-1 text-sm text-muted-foreground">Once a timed section begins, the timer cannot be paused.</p></div><Button variant="pill" size="lg" onClick={onContinue}>Continue <ArrowRight /></Button></div>
  </main>;
}

function OverviewCard({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return <article className="glass-panel rounded-3xl p-6"><span className="grid size-11 place-items-center rounded-2xl bg-brand-soft text-primary">{icon}</span><h2 className="mt-5 font-display text-xl font-semibold">{title}</h2><ul className="mt-4 space-y-3">{items.map((item) => <li key={item} className="flex gap-2 text-sm leading-6 text-muted-foreground"><Check className="mt-1 size-4 shrink-0 text-primary" />{item}</li>)}</ul></article>;
}

function CandidateForm({ onStart }: { onStart: () => void }) {
  const [agreed, setAgreed] = useState(false);
  return <main className="mx-auto max-w-3xl px-5 pb-16 pt-6">
    <div><p className="text-sm font-semibold text-primary">Step 2 of 2</p><h1 className="mt-2 font-display text-4xl font-bold">Candidate information</h1><p className="mt-3 text-muted-foreground">Confirm your details before the timer starts.</p></div>
    <form className="glass-panel mt-8 rounded-3xl p-6 sm:p-8" onSubmit={(event) => { event.preventDefault(); if (agreed) onStart(); }}>
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
  </main>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="grid gap-2 text-sm font-medium">{label}{children}</label>; }

function Assessment({ section, seconds, submitted, onSubmit, onFinish, onSupport }: { section: number; seconds: number; submitted: number[]; onSubmit: () => void; onFinish: () => void; onSupport: () => void }) {
  return <main className="mx-auto grid max-w-6xl gap-6 px-5 pb-16 pt-3 lg:grid-cols-12">
    <div className="lg:col-span-8">
      <Progress current={section} completed={submitted} />
      {section < 3 ? <WrittenSection section={section} seconds={seconds} onSubmit={onSubmit} /> : <VideoSection seconds={seconds} onFinish={onFinish} />}
    </div>
    <div className="hidden lg:col-span-4 lg:block"><SupportCard onOpen={onSupport} /></div>
  </main>;
}

function Progress({ current, completed }: { current: number; completed: number[] }) {
  return <section className="glass-panel rounded-3xl p-5"><div className="mb-4 flex items-center justify-between"><h2 className="font-display text-lg font-semibold">Your progress</h2><span className="text-sm text-muted-foreground">Section {current + 1} of 4</span></div><div className="grid grid-cols-4 gap-2">{sections.map((item, index) => <div key={item} className={`min-w-0 rounded-xl border p-2.5 ${index === current ? "border-primary/30 bg-brand-soft" : "border-border/70 bg-surface-strong"}`}><span className={`mb-2 grid size-6 place-items-center rounded-full text-xs font-bold ${completed.includes(index) ? "bg-success text-primary-foreground" : index === current ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{completed.includes(index) ? <Check className="size-3.5" /> : index + 1}</span><p className="hidden truncate text-xs font-semibold sm:block">{item.replace(" Management", "")}</p></div>)}</div></section>;
}

function Timer({ seconds }: { seconds: number }) { const m = Math.floor(seconds / 60).toString().padStart(2, "0"); const s = (seconds % 60).toString().padStart(2, "0"); return <div className="flex items-center gap-2 rounded-full border border-border bg-surface-strong px-3 py-2"><span className="size-2 rounded-full bg-primary recording-dot" /><span className="font-semibold tabular-nums">{m}:{s}</span></div>; }

function WrittenSection({ section, seconds, onSubmit }: { section: number; seconds: number; onSubmit: () => void }) {
  const content = prompts[section]; const [choice, setChoice] = useState("");
  if (!content) return null;
  return <form className="glass-panel mt-6 rounded-3xl p-6 sm:p-8" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
    <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase text-primary">Section {section + 1}</p><h1 className="mt-1 font-display text-2xl font-bold sm:text-3xl">{sections[section]}</h1></div><Timer seconds={seconds} /></div>
    <div className="mt-8 space-y-7">{content.open.map((question, index) => <Field key={question} label={`Q${index + 1} · Open-ended`}><span className="font-normal leading-6 text-muted-foreground">{question}</span><Textarea required maxLength={800} placeholder="Type your response…" className="mt-1 min-h-32 resize-none rounded-2xl bg-surface-strong p-4" /></Field>)}
      <fieldset><legend className="text-sm font-medium">Q3 · Multiple choice</legend><p className="mt-2 text-sm leading-6 text-muted-foreground">{content.choice}</p><div className="mt-3 grid gap-2">{content.options.map((option) => <label key={option} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm ${choice === option ? "border-primary bg-brand-soft" : "border-border bg-surface-strong"}`}><input required type="radio" name="answer" value={option} checked={choice === option} onChange={() => setChoice(option)} className="size-4 accent-primary" />{option}</label>)}</div></fieldset>
    </div>
    <div className="mt-8 flex items-center justify-between gap-4"><p className="text-xs text-muted-foreground">Answers save while you work</p><Button variant="pill" size="lg" type="submit">Submit Section <ChevronRight /></Button></div>
  </form>;
}

function VideoSection({ seconds, onFinish }: { seconds: number; onFinish: () => void }) {
  const [state, setState] = useState<RecordingState>("idle"); const [error, setError] = useState(false); const videoRef = useRef<HTMLVideoElement>(null); const streamRef = useRef<MediaStream | null>(null);
  const requestCamera = async () => { try { const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true }); streamRef.current = stream; if (videoRef.current) videoRef.current.srcObject = stream; setState("preview"); } catch { setError(true); } };
  const startRecording = () => setState("recording");
  const stopRecording = () => { setState("review"); streamRef.current?.getTracks().forEach((track) => track.stop()); };
  useEffect(() => () => streamRef.current?.getTracks().forEach((track) => track.stop()), []);
  return <section className="glass-panel mt-6 rounded-3xl p-6 sm:p-8">
    <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase text-primary">Final section</p><h1 className="mt-1 font-display text-2xl font-bold sm:text-3xl">Video Question</h1></div><Timer seconds={seconds} /></div>
    <div className="mt-7 rounded-2xl bg-brand-soft p-5"><p className="text-sm font-semibold text-accent-foreground">Your prompt</p><p className="mt-2 text-lg font-medium leading-7">Tell us about a time you led a finance team through a difficult audit. What did you do, and what was the outcome?</p></div>
    <div className="relative mt-5 aspect-video overflow-hidden rounded-2xl bg-foreground">
      <video ref={videoRef} autoPlay muted playsInline className={`size-full object-cover ${state === "idle" || state === "review" ? "hidden" : "block"}`} />
      {state === "idle" && <div className="grid size-full place-items-center text-center text-primary-foreground"><div><Video className="mx-auto size-10 opacity-70" /><p className="mt-3 text-sm font-medium">Camera preview will appear here</p></div></div>}
      {state === "recording" && <span className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-destructive px-3 py-1.5 text-xs font-semibold text-destructive-foreground"><span className="size-2 rounded-full bg-destructive-foreground recording-dot" /> Recording</span>}
      {state === "review" && <div className="grid size-full place-items-center text-center text-primary-foreground"><div><CheckCircle2 className="mx-auto size-10 text-success" /><p className="mt-3 font-semibold">Recording ready to review</p><p className="mt-1 text-xs opacity-70">Mock preview complete</p></div></div>}
    </div>
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3"><span className="flex items-center gap-2 text-sm text-muted-foreground"><Mic className="size-4" /> Camera and microphone required</span><div className="flex gap-2">{state === "idle" && <Button variant="pill" onClick={requestCamera}>Enable camera</Button>}{state === "preview" && <Button variant="pill" onClick={startRecording}><Video /> Start Recording</Button>}{state === "recording" && <Button variant="pill" onClick={stopRecording}><Square /> Stop Recording</Button>}{state === "review" && <><Button variant="soft" onClick={() => setState("idle")}><RotateCcw /> Re-record</Button><Button variant="pill" onClick={onFinish}>Final Submit <Send /></Button></>}</div></div>
    <Dialog open={error} onOpenChange={setError}><DialogContent className="rounded-3xl"><DialogHeader><DialogTitle>Camera or microphone blocked</DialogTitle><DialogDescription>Allow camera and microphone access in your browser settings, then try again.</DialogDescription></DialogHeader><ol className="space-y-2 rounded-2xl bg-muted p-4 text-sm text-muted-foreground"><li>1. Select the lock icon beside the web address.</li><li>2. Set Camera and Microphone to Allow.</li><li>3. Refresh the page and retry the device check.</li></ol><DialogFooter><Button variant="pill" onClick={() => setError(false)}>Got it</Button></DialogFooter></DialogContent></Dialog>
  </section>;
}

function SupportCard({ onOpen }: { onOpen: () => void }) { return <aside className="glass-panel sticky top-6 rounded-3xl p-6"><div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-xl bg-brand-soft text-primary"><Sparkles /></span><div><h2 className="font-display font-semibold">Assessment Support</h2><p className="text-xs text-muted-foreground">AI-style help · Always available</p></div></div><div className="mt-5 space-y-3">{[["Can I pause a section?", "Timers run continuously once started."], ["Can I change an answer?", "You can edit until you submit that section."], ["Can I re-record?", "Yes, before your final submission."]].map(([q, a]) => <div key={q} className="rounded-2xl border border-border/70 bg-surface-strong p-4"><p className="text-sm font-semibold">{q}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{a}</p></div>)}</div><Button variant="soft" className="mt-5 w-full" onClick={onOpen}>Ask a question <ArrowRight /></Button></aside>; }

function SupportPanel({ open, onClose }: { open: boolean; onClose: () => void }) { const [question, setQuestion] = useState(""); const [messages, setMessages] = useState<string[]>([]); const send = () => { if (!question.trim()) return; setMessages((m) => [...m, question]); setQuestion(""); }; return <div className={`fixed inset-0 z-50 ${open ? "pointer-events-auto" : "pointer-events-none"}`} aria-hidden={!open}><div onClick={onClose} className={`absolute inset-0 bg-foreground/20 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} /><aside className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-background p-6 shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}><div className="flex items-center justify-between"><div><h2 className="font-display text-xl font-bold">Assessment Support</h2><p className="text-sm text-muted-foreground">Ask about format or technical issues.</p></div><Button variant="ghost" size="icon" onClick={onClose} aria-label="Close support"><X /></Button></div><div className="mt-8 flex-1 space-y-4 overflow-y-auto"><div className="max-w-[88%] rounded-2xl rounded-tl-sm bg-brand-soft p-4 text-sm leading-6">Hi! I can help with timing, submitting answers, or your camera and microphone.</div>{messages.map((message, i) => <div key={`${message}-${i}`} className="space-y-3"><div className="ml-auto max-w-[88%] rounded-2xl rounded-tr-sm bg-primary p-4 text-sm text-primary-foreground">{message}</div><div className="max-w-[88%] rounded-2xl rounded-tl-sm bg-brand-soft p-4 text-sm leading-6">You can keep working without losing your current answers. For device issues, check browser permissions and retry the camera preview.</div></div>)}</div><div className="flex gap-2 border-t border-border pt-4"><Input value={question} onChange={(e) => setQuestion(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") send(); }} placeholder="Ask a question…" className="h-11 rounded-full bg-surface-strong px-4" /><Button variant="pill" size="icon" onClick={send} aria-label="Send question"><Send /></Button></div></aside></div>; }

function Complete() { return <main className="mx-auto grid min-h-[calc(100vh-110px)] max-w-2xl place-items-center px-5 pb-16"><div className="glass-panel w-full rounded-3xl p-8 text-center sm:p-12"><span className="mx-auto grid size-16 place-items-center rounded-full bg-brand-soft text-success"><Check className="size-8" /></span><h1 className="mt-6 font-display text-4xl font-bold">Assessment submitted</h1><p className="mx-auto mt-4 max-w-md leading-7 text-muted-foreground">Thank you for completing the Accounting Manager Assessment. The hiring team will review your responses and contact you with next steps.</p><Button variant="soft" className="mt-8" asChild><Link to="/login">Return to account</Link></Button></div></main>; }