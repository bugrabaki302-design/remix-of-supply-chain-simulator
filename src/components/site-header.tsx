import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function Brand() {
  return <Link to="/" className="flex items-center gap-3 focus-ring rounded-xl" aria-label="PAXOS home">
    <span className="grid size-11 place-items-center rounded-2xl bg-primary font-display text-lg font-bold text-primary-foreground shadow-lg">P</span>
    <span><span className="block font-display text-lg font-bold leading-none">PAXOS</span><span className="mt-1 block text-[10px] font-semibold uppercase text-muted-foreground">Assessment Suite</span></span>
  </Link>;
}

export function SiteHeader() {
  return <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6 lg:py-8">
    <Brand />
    <nav className="flex items-center gap-2" aria-label="Account navigation">
      <Button variant="ghost" className="hidden rounded-full sm:inline-flex" asChild><Link to="/login">Sign in</Link></Button>
      <Button variant="pill" asChild><Link to="/create-account">Create account</Link></Button>
    </nav>
  </header>;
}
