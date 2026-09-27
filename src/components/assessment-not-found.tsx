import { SiteHeader } from "@/components/site-header";

export function AssessmentNotFound() {
  return <div className="assessment-backdrop min-h-screen text-foreground">
    <SiteHeader />
    <main className="mx-auto grid min-h-[calc(100vh-110px)] max-w-2xl place-items-center px-5 pb-16">
      <div className="glass-panel w-full rounded-3xl p-8 text-center sm:p-12">
        <h1 className="font-display text-3xl font-bold">Assessment not found</h1>
        <p className="mx-auto mt-4 max-w-md leading-7 text-muted-foreground">This assessment link is invalid or no longer available. Please check the link you received from the hiring team.</p>
      </div>
    </main>
  </div>;
}
