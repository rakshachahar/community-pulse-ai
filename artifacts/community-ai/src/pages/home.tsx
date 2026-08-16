import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Camera,
  Brain,
  MapPin,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-[100dvh] bg-background">
      {/* HERO */}
      <section className="relative overflow-hidden border-b">
        {/* subtle technical grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(99,102,241,0.07) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(99,102,241,0.07) 1px, transparent 1px)
            `,
            backgroundSize: "32px 32px",
          }}
        />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(99,102,241,0.10),transparent_35%)]" />

        <div className="container relative z-10 mx-auto px-4 py-12 md:py-16 lg:py-20">
          <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
            
            {/* LEFT */}
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
                <span className="h-2 w-2 rounded-full bg-primary" />
                AI-Powered Civic Reporting
              </div>

              <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-[4.25rem]">
                Report problems.
                <br />
                <span className="text-primary">
                  Improve your community.
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                Report civic issues with location, photos, and descriptions.
                AI analyzes each report, assesses severity, and helps
                prioritize action.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link href="/report">
                  <Button
                    size="lg"
                    className="h-12 w-full rounded-lg px-6 sm:w-auto"
                  >
                    Report an Issue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>

                <Link href="/dashboard">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 w-full rounded-lg px-6 sm:w-auto"
                  >
                    View Community Reports
                  </Button>
                </Link>
              </div>

              <div className="mt-7 grid grid-cols-1 gap-3 text-sm text-muted-foreground sm:grid-cols-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Location based
                </div>

                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-primary" />
                  AI analyzed
                </div>

                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Anonymous
                </div>
              </div>
            </div>

            {/* AI CARD */}
            <div className="relative mx-auto w-full max-w-lg">
              <div className="absolute -inset-4 rounded-3xl bg-primary/10 blur-2xl" />

              <div className="relative rounded-2xl border bg-card/95 p-5 shadow-xl backdrop-blur-sm md:p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">AI Issue Analysis</p>
                    <p className="text-sm text-muted-foreground">
                      Example community report
                    </p>
                  </div>

                  <div className="rounded-xl bg-primary/10 p-3 text-primary">
                    <Brain className="h-5 w-5" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-xl bg-muted/50 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Report
                    </p>
                    <p className="mt-1 font-medium">
                      Flooding after heavy rainfall
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border bg-background/60 p-4">
                      <p className="text-xs text-muted-foreground">
                        Category
                      </p>
                      <p className="mt-1 font-semibold">Drainage</p>
                    </div>

                    <div className="rounded-xl border bg-background/60 p-4">
                      <p className="text-xs text-muted-foreground">
                        Priority
                      </p>
                      <p className="mt-1 font-semibold text-orange-500">
                        High
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-primary">
                      <BarChart3 className="h-4 w-4" />
                      AI Assessment
                    </div>

                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      Drainage inspection and immediate water removal are
                      recommended.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 border-t pt-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      Severity assessed
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Camera className="h-4 w-4 text-primary" />
                      Photo supported
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-b bg-muted/20">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
              Simple workflow
            </p>

            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              From report to action
            </h2>

            <p className="mt-3 text-muted-foreground">
              A simple path from reporting a problem to understanding what
              needs attention.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                icon: Camera,
                number: "01",
                title: "Report",
                text: "Describe the issue, add a photo, and provide its location.",
              },
              {
                icon: Brain,
                number: "02",
                title: "Analyze",
                text: "AI classifies the issue and evaluates severity and urgency.",
              },
              {
                icon: BarChart3,
                number: "03",
                title: "Prioritize",
                text: "Structured reports help authorities focus on important issues.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group rounded-xl border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <item.icon className="h-5 w-5" />
                  </div>

                  <span className="font-mono text-xs text-muted-foreground">
                    {item.number}
                  </span>
                </div>

                <h3 className="text-lg font-semibold">{item.title}</h3>

                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-8 py-10 md:py-12">
        <div className="relative overflow-hidden rounded-2xl bg-primary px-6 py-12 text-center text-primary-foreground md:px-12">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(to right, white 1px, transparent 1px),
                linear-gradient(to bottom, white 1px, transparent 1px)
              `,
              backgroundSize: "28px 28px",
            }}
          />

          <div className="relative z-10">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary-foreground/70">
              Make your neighborhood visible
            </p>

            <h2 className="text-3xl font-bold md:text-4xl">
              See a problem? Report it.
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">
              Turn a local issue into a structured report that can be
              understood, analyzed, and acted upon.
            </p>

            <Link href="/report">
              <Button
                size="lg"
                variant="secondary"
                className="mt-7 h-12 rounded-lg px-6"
              >
                Make a Report
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}