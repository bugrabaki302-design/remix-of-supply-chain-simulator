// Assessment registry. Add a new role by adding one entry — no new routes needed.
// IDs: 8 chars, uppercase letters + digits (A-Z0-9), unique, non-descriptive.

export type WrittenSection = {
  kind: "written";
  title: string;
  minutes: number;
  open: string[];
  choice: { question: string; options: string[]; correctIndex: number };
};

export type VideoSection = {
  kind: "video";
  title: string;
  minutes: number;
  prompt: string;
};

export type AssessmentSection = WrittenSection | VideoSection;

export type Assessment = {
  id: string;
  role: string;
  title: string;
  tagline: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  summary: string[];
  sections: AssessmentSection[];
  scoring: { passThreshold: number }; // fraction of multiple-choice answers correct
};

export const ASSESSMENT_ID_PATTERN = /^[A-Z0-9]{8}$/;

/** Generates a new unique ID for adding assessments (collision-checked against the registry). */
export function generateAssessmentId(existing: Iterable<string> = Object.keys(assessments)): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const taken = new Set(existing);
  for (;;) {
    const bytes = crypto.getRandomValues(new Uint8Array(8));
    const id = Array.from(bytes, (b) => chars[b % chars.length]).join("");
    if (!taken.has(id)) return id;
  }
}

const list: Assessment[] = [
  {
    id: "X7K4P9M2",
    role: "Accounting Manager",
    title: "Accounting Manager Assessment",
    tagline: "Accounting Manager · 55 minutes",
    description:
      "Show us how you approach financial operations, safeguards, and people leadership. You’ll complete three short written sections and one recorded response.",
    responsibilities: ["Own monthly and quarterly close", "Deliver accurate reporting", "Improve accounting operations"],
    requirements: ["7+ years of accounting experience", "Strong GAAP knowledge", "Audit and controls expertise"],
    summary: ["3 written sections", "1 recorded video response", "Answers save while you work"],
    scoring: { passThreshold: 0.67 },
    sections: [
      {
        kind: "written", title: "Financial Management", minutes: 5,
        open: [
          "Walk us through how you would close the books for a quarter with a 12-person team.",
          "Describe how you would investigate and explain a material budget variance to senior leadership.",
        ],
        choice: {
          question: "Which control most effectively prevents duplicate vendor payments?",
          options: ["Three-way match with PO, receipt, and invoice", "Manual approval by a single manager", "Weekly batch reconciliation only"],
          correctIndex: 0,
        },
      },
      {
        kind: "written", title: "Compliance & Controls", minutes: 5,
        open: [
          "How would you prepare the organization for a first-year external audit?",
          "Describe your approach to identifying and remediating a control deficiency.",
        ],
        choice: {
          question: "Who should approve changes to vendor banking details?",
          options: ["An independent authorized reviewer", "The employee entering the change", "The vendor without internal review"],
          correctIndex: 0,
        },
      },
      {
        kind: "written", title: "Leadership & Team Management", minutes: 5,
        open: [
          "Tell us how you coach a high-performing team member who is struggling with deadlines.",
          "How would you organize responsibilities across a growing accounting team?",
        ],
        choice: {
          question: "Which practice best supports a resilient accounting team?",
          options: ["Documented processes and cross-training", "Keeping specialized knowledge with one person", "Changing ownership every week"],
          correctIndex: 0,
        },
      },
      {
        kind: "video", title: "Video Question", minutes: 40,
        prompt: "Tell us about a time you led a finance team through a difficult audit. What did you do, and what was the outcome?",
      },
    ],
  },
  {
    id: "Q3N8R5T1",
    role: "Product Manager",
    title: "Product Manager Assessment",
    tagline: "Product Manager · 55 minutes",
    description:
      "Show us how you discover customer needs, prioritize a roadmap, and ship products that move the business. You’ll complete three short written sections and one recorded response.",
    responsibilities: ["Own the product roadmap", "Turn customer insight into shipped features", "Align engineering, design, and go-to-market teams"],
    requirements: ["5+ years of product management experience", "Strong analytical and prioritization skills", "Experience shipping B2B or B2C software products"],
    summary: ["3 written sections", "1 recorded video response", "Answers save while you work"],
    scoring: { passThreshold: 0.67 },
    sections: [
      {
        kind: "written", title: "Product Strategy", minutes: 5,
        open: [
          "Walk us through how you would build a 12-month roadmap for a product with declining engagement.",
          "Describe how you would decide between two high-impact features when you can only build one.",
        ],
        choice: {
          question: "What is the strongest signal that a new feature is ready to scale?",
          options: ["Measured adoption and retention against a success metric", "Positive feedback from a few customers", "The sales team asking for it repeatedly"],
          correctIndex: 0,
        },
      },
      {
        kind: "written", title: "Discovery & Prioritization", minutes: 5,
        open: [
          "How do you structure customer interviews so they surface real problems rather than feature requests?",
          "Describe a prioritization framework you have used and how you applied it to a real backlog.",
        ],
        choice: {
          question: "Which prioritization approach best balances impact and effort?",
          options: ["A scoring model like RICE applied consistently", "Building whatever the loudest stakeholder wants", "Prioritizing purely by development cost"],
          correctIndex: 0,
        },
      },
      {
        kind: "written", title: "Execution & Stakeholders", minutes: 5,
        open: [
          "Tell us how you handle a launch that is behind schedule two weeks before the release date.",
          "How do you keep executives, engineers, and designers aligned when priorities conflict?",
        ],
        choice: {
          question: "What is the best way to communicate a slipped launch date?",
          options: ["Early, with the cause, revised plan, and trade-offs", "Only after a new date is fully certain", "Through the engineering team so it sounds technical"],
          correctIndex: 0,
        },
      },
      {
        kind: "video", title: "Video Question", minutes: 40,
        prompt: "Tell us about a product you took from idea to launch. What was the hardest decision you made, and what was the outcome?",
      },
    ],
  },
  {
    id: "H6V2K9W4",
    role: "Project Manager",
    title: "Project Manager Assessment",
    tagline: "Project Manager · 55 minutes",
    description:
      "Show us how you plan, de-risk, and deliver complex projects on time. You’ll complete three short written sections and one recorded response.",
    responsibilities: ["Plan and deliver cross-functional projects", "Manage timelines, budgets, and risks", "Keep stakeholders informed and aligned"],
    requirements: ["5+ years of project management experience", "Familiarity with Agile and waterfall methods", "Strong communication and risk-management skills"],
    summary: ["3 written sections", "1 recorded video response", "Answers save while you work"],
    scoring: { passThreshold: 0.67 },
    sections: [
      {
        kind: "written", title: "Planning & Scheduling", minutes: 5,
        open: [
          "Walk us through how you would plan a six-month project with five teams and a fixed deadline.",
          "Describe how you build a realistic timeline when estimates from teams vary widely.",
        ],
        choice: {
          question: "What should a project plan always make visible?",
          options: ["Dependencies, milestones, and owners", "Only the final delivery date", "A list of tasks without dates"],
          correctIndex: 0,
        },
      },
      {
        kind: "written", title: "Risk & Issue Management", minutes: 5,
        open: [
          "How do you identify and track risks before they become issues?",
          "Describe a time a project went off track and how you recovered it.",
        ],
        choice: {
          question: "When a critical risk materializes, what is the first step?",
          options: ["Assess impact and convene the right owners to decide a response", "Wait to see if it resolves itself", "Escalate to executives immediately without analysis"],
          correctIndex: 0,
        },
      },
      {
        kind: "written", title: "Communication & Delivery", minutes: 5,
        open: [
          "How do you structure status reporting so stakeholders trust the project is on track?",
          "Tell us how you run a project retrospective and turn it into lasting improvements.",
        ],
        choice: {
          question: "Which status update is most useful to stakeholders?",
          options: ["Progress against milestones, top risks, and decisions needed", "A long list of completed tasks", "Only good news until the project finishes"],
          correctIndex: 0,
        },
      },
      {
        kind: "video", title: "Video Question", minutes: 40,
        prompt: "Tell us about the most complex project you have delivered. What made it hard, and how did you get it over the line?",
      },
    ],
  },
  {
    id: "M8B4T7R2",
    role: "Sales Manager",
    title: "Sales Manager Assessment",
    tagline: "Sales Manager · 55 minutes",
    description:
      "Show us how you build pipeline, coach a team, and hit revenue targets. You’ll complete three short written sections and one recorded response.",
    responsibilities: ["Own team revenue targets", "Coach and develop account executives", "Build accurate forecasts and healthy pipeline"],
    requirements: ["6+ years in sales with 2+ years managing a team", "Proven record of hitting quota", "Strong CRM and forecasting discipline"],
    summary: ["3 written sections", "1 recorded video response", "Answers save while you work"],
    scoring: { passThreshold: 0.67 },
    sections: [
      {
        kind: "written", title: "Pipeline & Forecasting", minutes: 5,
        open: [
          "Walk us through how you build a quarterly forecast you are confident committing to.",
          "Describe how you inspect pipeline health and what red flags you look for.",
        ],
        choice: {
          question: "What makes a sales forecast reliable?",
          options: ["Consistent stage definitions and evidence-based deal inspection", "Reps’ gut feel about their deals", "Last quarter’s number plus ten percent"],
          correctIndex: 0,
        },
      },
      {
        kind: "written", title: "Coaching & Performance", minutes: 5,
        open: [
          "How do you coach a rep who is consistently missing quota?",
          "Describe your approach to running an effective one-on-one with your team members.",
        ],
        choice: {
          question: "What is the most effective first step with an underperforming rep?",
          options: ["Diagnose the specific skill or activity gap before setting a plan", "Put them on a performance plan immediately", "Reassign their accounts to top performers"],
          correctIndex: 0,
        },
      },
      {
        kind: "written", title: "Strategy & Execution", minutes: 5,
        open: [
          "How would you enter a new market segment with an existing sales team?",
          "Tell us how you balance short-term quota pressure with long-term account relationships.",
        ],
        choice: {
          question: "Which metric best indicates a healthy sales team?",
          options: ["Pipeline coverage and win rate trending together", "Total number of calls made", "Number of new logos regardless of deal size"],
          correctIndex: 0,
        },
      },
      {
        kind: "video", title: "Video Question", minutes: 40,
        prompt: "Tell us about a quarter where your team was behind target. What did you do, and how did it end?",
      },
    ],
  },
];

export const assessments: Record<string, Assessment> = Object.fromEntries(list.map((a) => [a.id, a]));

export const DEFAULT_ASSESSMENT_ID = list[0]!.id;

export function getAssessment(id: string): Assessment | undefined {
  return ASSESSMENT_ID_PATTERN.test(id) ? assessments[id] : undefined;
}

export function sectionMeta(s: AssessmentSection) {
  return s.kind === "video" ? `${s.minutes} min · recorded response` : `${s.minutes} min · ${s.open.length + 1} questions`;
}

/** answers: sectionIndex -> selected option index */
export function scoreAssessment(a: Assessment, answers: Record<number, number>) {
  const graded = a.sections.map((s, i) => ({ s, i })).filter((x) => x.s.kind === "written");
  const correct = graded.filter(({ s, i }) => s.kind === "written" && answers[i] === s.choice.correctIndex).length;
  const total = graded.length;
  const ratio = total ? correct / total : 0;
  return { correct, total, ratio, passed: ratio >= a.scoring.passThreshold };
}
