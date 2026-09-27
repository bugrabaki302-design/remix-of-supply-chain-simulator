import { createFileRoute, redirect } from "@tanstack/react-router";
import { DEFAULT_ASSESSMENT_ID } from "@/lib/assessments";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "PAXOS Assessments" },
    { name: "description", content: "PAXOS candidate assessment platform." },
    { property: "og:title", content: "PAXOS Assessments" },
    { property: "og:description", content: "Role-based candidate assessments from PAXOS." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  beforeLoad: () => { throw redirect({ to: "/apply/$assessmentId", params: { assessmentId: DEFAULT_ASSESSMENT_ID } }); },
});
