import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Check, CheckCircle2, ChevronRight, Mic, RotateCcw, Send, Square, Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/assessment")({
  head: () => ({ meta: [
    { title: "Take the Assessment — PAXOS" },
    { name: "description", content: "Timed written sections and a recorded video response for the PAXOS Accounting Manager assessment." },
    { property: "og:title", content: "Take the Assessment — PAXOS" },
    { property: "og:description", content: "Four sections: three timed written sections and one recorded video response." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: AssessmentPage,
});

type RecordingState = "idle" | "preview" | "recording" | "review";
type Stage = "sections" | "complete";

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

function AssessmentPage() {
  const [stage, setStage] = useState<Stage>("sections");
  const [section, setSection] = useState(0);
  const [seconds, setSeconds] = useState(300);
  const [submitted, setSubmitted] = useState<number[]>([]);

  useEffect(() => {
    if (stage !== "sections" || seconds <= 0) return;
    const timer = window.setInterval(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearInterval(timer);
  }, [stage, section, seconds]);

  const submitSection = () => {
    setSubmitted((items) => [...items, section]);
    setSection((value) => value + 1);
    setSeconds(2400);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return <div className="assessment-backdrop min-h-screen overflow-x-hidden text-foreground">
    <SiteHeader />
    {stage === "sections" && <Assessment section={section} seconds={seconds} submitted={submitted} onSubmit={submitSection} onFinish={() => setStage("complete")} />}
    {stage === "complete" && <Complete />}
  </div>;
}

function Assessment({ section, seconds, submitted, onSubmit, onFinish }: { section: number; seconds: number; submitted: number[]; onSubmit: () => void; onFinish: () => void }) {
  return <main className="mx-auto max-w-4xl px-5 pb-16 pt-3">
    <div>
      <Progress current={section} completed={submitted} />
      {section < 3 ? <WrittenSection section={section} seconds={seconds} onSubmit={onSubmit} /> : <VideoSection seconds={seconds} onFinish={onFinish} />}
    </div>
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

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="grid gap-2 text-sm font-medium">{label}{children}</label>; }

function Complete() { return <main className="mx-auto grid min-h-[calc(100vh-110px)] max-w-2xl place-items-center px-5 pb-16"><div className="glass-panel w-full rounded-3xl p-8 text-center sm:p-12"><span className="mx-auto grid size-16 place-items-center rounded-full bg-brand-soft text-success"><Check className="size-8" /></span><h1 className="mt-6 font-display text-4xl font-bold">Assessment submitted</h1><p className="mx-auto mt-4 max-w-md leading-7 text-muted-foreground">Thank you for completing the Accounting Manager Assessment. The hiring team will review your responses and contact you with next steps.</p><Button variant="soft" className="mt-8" asChild><Link to="/">Back to home</Link></Button></div></main>; }
