import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Check, CheckCircle2, ChevronRight, Mic, RotateCcw, Send, Square, Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SiteHeader } from "@/components/site-header";
import { AssessmentNotFound } from "@/components/assessment-not-found";
import { getAssessment, scoreAssessment, type Assessment as AssessmentData, type VideoSection as VideoData, type WrittenSection as WrittenData } from "@/lib/assessments";

export const Route = createFileRoute("/apply/$assessmentId/session")({
  loader: ({ params }) => {
    const assessment = getAssessment(params.assessmentId);
    if (!assessment) throw notFound();
    return { assessment };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Assessment not found — PAXOS" }, { name: "robots", content: "noindex" }] };
    const a = loaderData.assessment;
    return { meta: [
      { title: `Take the ${a.title} — PAXOS` },
      { name: "description", content: `Timed sections for the PAXOS ${a.role} assessment.` },
      { property: "og:title", content: `Take the ${a.title} — PAXOS` },
      { property: "og:description", content: `${a.sections.length} sections for the ${a.role} role.` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ]};
  },
  notFoundComponent: AssessmentNotFound,
  component: AssessmentPage,
});

type RecordingState = "idle" | "preview" | "recording" | "review";
type Stage = "sections" | "complete";

function AssessmentPage() {
  const { assessment } = Route.useLoaderData();
  const [stage, setStage] = useState<Stage>("sections");
  const [section, setSection] = useState(0);
  const [seconds, setSeconds] = useState((assessment.sections[0]?.minutes ?? 5) * 60);
  const [submitted, setSubmitted] = useState<number[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  useEffect(() => {
    if (stage !== "sections" || seconds <= 0) return;
    const timer = window.setInterval(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearInterval(timer);
  }, [stage, section, seconds]);

  const submitSection = (choiceIndex?: number) => {
    if (choiceIndex !== undefined) setAnswers((a) => ({ ...a, [section]: choiceIndex }));
    setSubmitted((items) => [...items, section]);
    const next = section + 1;
    if (next >= assessment.sections.length) { setStage("complete"); return; }
    setSection(next);
    setSeconds((assessment.sections[next]?.minutes ?? 5) * 60);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return <div className="assessment-backdrop min-h-screen overflow-x-hidden text-foreground">
    <SiteHeader />
    {stage === "sections" && <Assessment assessment={assessment} section={section} seconds={seconds} submitted={submitted} onSubmit={submitSection} />}
    {stage === "complete" && <Complete assessment={assessment} answers={answers} />}
  </div>;
}

function Assessment({ assessment, section, seconds, submitted, onSubmit }: { assessment: AssessmentData; section: number; seconds: number; submitted: number[]; onSubmit: (choice?: number) => void }) {
  const current = assessment.sections[section];
  return <main className="mx-auto max-w-4xl px-5 pb-16 pt-3">
    <div>
      <Progress assessment={assessment} current={section} completed={submitted} />
      {current?.kind === "written" && <WrittenSection key={section} content={current} index={section} seconds={seconds} onSubmit={onSubmit} />}
      {current?.kind === "video" && <VideoSection key={section} content={current} isFinal={section === assessment.sections.length - 1} seconds={seconds} onFinish={() => onSubmit()} />}
    </div>
  </main>;
}

function Progress({ assessment, current, completed }: { assessment: AssessmentData; current: number; completed: number[] }) {
  const total = assessment.sections.length;
  return <section className="glass-panel rounded-3xl p-5"><div className="mb-4 flex items-center justify-between"><h2 className="font-display text-lg font-semibold">Your progress</h2><span className="text-sm text-muted-foreground">Section {current + 1} of {total}</span></div><div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}>{assessment.sections.map((s, index) => <div key={s.title} className={`min-w-0 rounded-xl border p-2.5 ${index === current ? "border-primary/30 bg-brand-soft" : "border-border/70 bg-surface-strong"}`}><span className={`mb-2 grid size-6 place-items-center rounded-full text-xs font-bold ${completed.includes(index) ? "bg-success text-primary-foreground" : index === current ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{completed.includes(index) ? <Check className="size-3.5" /> : index + 1}</span><p className="hidden truncate text-xs font-semibold sm:block">{s.title.replace(" Management", "")}</p></div>)}</div></section>;
}

function Timer({ seconds }: { seconds: number }) { const m = Math.floor(seconds / 60).toString().padStart(2, "0"); const s = (seconds % 60).toString().padStart(2, "0"); return <div className="flex items-center gap-2 rounded-full border border-border bg-surface-strong px-3 py-2"><span className="size-2 rounded-full bg-primary recording-dot" /><span className="font-semibold tabular-nums">{m}:{s}</span></div>; }

function WrittenSection({ content, index, seconds, onSubmit }: { content: WrittenData; index: number; seconds: number; onSubmit: (choice: number) => void }) {
  const [choice, setChoice] = useState<number | null>(null);
  return <form className="glass-panel mt-6 rounded-3xl p-6 sm:p-8" onSubmit={(e) => { e.preventDefault(); if (choice !== null) onSubmit(choice); }}>
    <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase text-primary">Section {index + 1}</p><h1 className="mt-1 font-display text-2xl font-bold sm:text-3xl">{content.title}</h1></div><Timer seconds={seconds} /></div>
    <div className="mt-8 space-y-7">{content.open.map((question, i) => <Field key={question} label={`Q${i + 1} · Open-ended`}><span className="font-normal leading-6 text-muted-foreground">{question}</span><Textarea required maxLength={800} placeholder="Type your response…" className="mt-1 min-h-32 resize-none rounded-2xl bg-surface-strong p-4" /></Field>)}
      <fieldset><legend className="text-sm font-medium">Q{content.open.length + 1} · Multiple choice</legend><p className="mt-2 text-sm leading-6 text-muted-foreground">{content.choice.question}</p><div className="mt-3 grid gap-2">{content.choice.options.map((option, i) => <label key={option} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm ${choice === i ? "border-primary bg-brand-soft" : "border-border bg-surface-strong"}`}><input required type="radio" name="answer" value={i} checked={choice === i} onChange={() => setChoice(i)} className="size-4 accent-primary" />{option}</label>)}</div></fieldset>
    </div>
    <div className="mt-8 flex items-center justify-between gap-4"><p className="text-xs text-muted-foreground">Answers save while you work</p><Button variant="pill" size="lg" type="submit">Submit Section <ChevronRight /></Button></div>
  </form>;
}

function VideoSection({ content, isFinal, seconds, onFinish }: { content: VideoData; isFinal: boolean; seconds: number; onFinish: () => void }) {
  const [state, setState] = useState<RecordingState>("idle"); const [error, setError] = useState(false); const videoRef = useRef<HTMLVideoElement>(null); const streamRef = useRef<MediaStream | null>(null);
  const requestCamera = async () => { try { const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true }); streamRef.current = stream; if (videoRef.current) videoRef.current.srcObject = stream; setState("preview"); } catch { setError(true); } };
  const startRecording = () => setState("recording");
  const stopRecording = () => { setState("review"); streamRef.current?.getTracks().forEach((track) => track.stop()); };
  useEffect(() => () => streamRef.current?.getTracks().forEach((track) => track.stop()), []);
  return <section className="glass-panel mt-6 rounded-3xl p-6 sm:p-8">
    <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase text-primary">{isFinal ? "Final section" : "Video section"}</p><h1 className="mt-1 font-display text-2xl font-bold sm:text-3xl">{content.title}</h1></div><Timer seconds={seconds} /></div>
    <div className="mt-7 rounded-2xl bg-brand-soft p-5"><p className="text-sm font-semibold text-accent-foreground">Your prompt</p><p className="mt-2 text-lg font-medium leading-7">{content.prompt}</p></div>
    <div className="relative mt-5 aspect-video overflow-hidden rounded-2xl bg-foreground">
      <video ref={videoRef} autoPlay muted playsInline className={`size-full object-cover ${state === "idle" || state === "review" ? "hidden" : "block"}`} />
      {state === "idle" && <div className="grid size-full place-items-center text-center text-primary-foreground"><div><Video className="mx-auto size-10 opacity-70" /><p className="mt-3 text-sm font-medium">Camera preview will appear here</p></div></div>}
      {state === "recording" && <span className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-destructive px-3 py-1.5 text-xs font-semibold text-destructive-foreground"><span className="size-2 rounded-full bg-destructive-foreground recording-dot" /> Recording</span>}
      {state === "review" && <div className="grid size-full place-items-center text-center text-primary-foreground"><div><CheckCircle2 className="mx-auto size-10 text-success" /><p className="mt-3 font-semibold">Recording ready to review</p><p className="mt-1 text-xs opacity-70">Mock preview complete</p></div></div>}
    </div>
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3"><span className="flex items-center gap-2 text-sm text-muted-foreground"><Mic className="size-4" /> Camera and microphone required</span><div className="flex gap-2">{state === "idle" && <Button variant="pill" onClick={requestCamera}>Enable camera</Button>}{state === "preview" && <Button variant="pill" onClick={startRecording}><Video /> Start Recording</Button>}{state === "recording" && <Button variant="pill" onClick={stopRecording}><Square /> Stop Recording</Button>}{state === "review" && <><Button variant="soft" onClick={() => setState("idle")}><RotateCcw /> Re-record</Button><Button variant="pill" onClick={onFinish}>{isFinal ? "Final Submit" : "Submit Section"} <Send /></Button></>}</div></div>
    <Dialog open={error} onOpenChange={setError}><DialogContent className="rounded-3xl"><DialogHeader><DialogTitle>Camera or microphone blocked</DialogTitle><DialogDescription>Allow camera and microphone access in your browser settings, then try again.</DialogDescription></DialogHeader><ol className="space-y-2 rounded-2xl bg-muted p-4 text-sm text-muted-foreground"><li>1. Select the lock icon beside the web address.</li><li>2. Set Camera and Microphone to Allow.</li><li>3. Refresh the page and retry the device check.</li></ol><DialogFooter><Button variant="pill" onClick={() => setError(false)}>Got it</Button></DialogFooter></DialogContent></Dialog>
  </section>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="grid gap-2 text-sm font-medium">{label}{children}</label>; }

function Complete({ assessment, answers }: { assessment: AssessmentData; answers: Record<number, number> }) {
  const result = scoreAssessment(assessment, answers);
  return <main className="mx-auto grid min-h-[calc(100vh-110px)] max-w-2xl place-items-center px-5 pb-16"><div className="glass-panel w-full rounded-3xl p-8 text-center sm:p-12"><span className="mx-auto grid size-16 place-items-center rounded-full bg-brand-soft text-success"><Check className="size-8" /></span><h1 className="mt-6 font-display text-4xl font-bold">Assessment submitted</h1><p className="mx-auto mt-4 max-w-md leading-7 text-muted-foreground">Thank you for completing the {assessment.title}. The hiring team will review your responses and contact you with next steps.</p><p className="mt-4 text-sm text-muted-foreground">Multiple choice: {result.correct} of {result.total} correct</p><Button variant="soft" className="mt-8" asChild><Link to="/apply/$assessmentId" params={{ assessmentId: assessment.id }}>Back to overview</Link></Button></div></main>;
}
