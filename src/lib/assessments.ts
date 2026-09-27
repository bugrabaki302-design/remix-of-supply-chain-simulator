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
