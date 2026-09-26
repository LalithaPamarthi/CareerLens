import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  Github,
  Link2,
  Loader2,
  ScanSearch,
  Sparkles,
  Target,
  UploadCloud,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Logo } from "@/components/careerlens/Logo";
import { buildAnalysis } from "@/lib/analysis-engine";
import { emptyInputs, useAnalysisStore } from "@/lib/analysis-store";
import type { AnalysisInputs } from "@/lib/types";

export const Route = createFileRoute("/analyze")({
  head: () => ({
    meta: [
      { title: "New Analysis — CareerLens" },
      {
        name: "description",
        content:
          "Create a new CareerLens analysis from your resume, portfolio, GitHub and target job.",
      },
      { property: "og:title", content: "New Analysis — CareerLens" },
      {
        property: "og:description",
        content: "Build an evidence-based career readiness analysis.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AnalyzePage,
});

async function extractPdfText(file: File): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");

  const workerSrc = new URL(
    "pdfjs-dist/legacy/build/pdf.worker.mjs",
    import.meta.url,
  ).toString();

  pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pageTexts: string[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();

    const pageText = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    if (pageText) pageTexts.push(pageText);
  }

  return pageTexts.join("\n\n");
}

function AnalyzePage() {
  const [inputs, setInputs] = useState<AnalysisInputs>(emptyInputs);
  const [busy, setBusy] = useState(false);
  const [readingFile, setReadingFile] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const { setAnalysis, loadDemo } = useAnalysisStore();
  const navigate = useNavigate();

  const set = <K extends keyof AnalysisInputs>(
    key: K,
    value: AnalysisInputs[K],
  ) => setInputs((prev) => ({ ...prev, [key]: value }));

  const hasSomething =
    inputs.resumeText.trim().length > 0 ||
    inputs.portfolioUrl.trim().length > 0 ||
    inputs.portfolioText.trim().length > 0 ||
    inputs.githubUrl.trim().length > 0 ||
    inputs.jobDescription.trim().length > 0;

  async function onFile(file: File | null) {
    if (!file) return;

    const isPdf = file.name.toLowerCase().endsWith(".pdf");
    const isTextFile = /\.(txt|md)$/i.test(file.name);

    if (!isPdf && !isTextFile) {
      toast.error("Unsupported file type", {
        description: "Please upload a PDF, TXT, or MD file.",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File is too large", {
        description: "Please upload a file smaller than 10 MB.",
      });
      return;
    }

    setReadingFile(true);

    try {
      let text = "";

      if (isPdf) {
        text = await extractPdfText(file);

        if (!text.trim()) {
          toast.error("No readable text found", {
            description:
              "This PDF may be scanned or image-based. Please upload a text-based PDF or paste your resume text.",
          });
          return;
        }
      } else {
        text = await file.text();

        if (!text.trim()) {
          toast.error("The file is empty", {
            description: "Please upload a file containing your resume text.",
          });
          return;
        }
      }

      setInputs((prev) => ({
        ...prev,
        resumeText: text,
        resumeFileName: file.name,
      }));

      toast.success("Resume loaded", {
        description: `${file.name} is ready for analysis.`,
      });
    } catch (error) {
      console.error("Resume file processing failed:", error);
      toast.error("Couldn't read this file", {
        description:
          "Please make sure the file is a valid PDF, TXT, or MD file and try again.",
      });
    } finally {
      setReadingFile(false);
    }
  }

  function submit() {
    if (!hasSomething) {
      toast.error("Add at least one source", {
        description:
          "Add a resume, portfolio, GitHub profile, or target job before starting.",
      });
      return;
    }

    setBusy(true);

    setTimeout(() => {
      setAnalysis(buildAnalysis(inputs));
      setBusy(false);
      navigate({ to: "/app" });
    }, 500);
  }

  return (
    <div className="min-h-dvh bg-[#f7f8fc]">
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link to="/" aria-label="CareerLens home">
            <Logo />
          </Link>

          <Button asChild variant="ghost" size="sm" className="gap-2 text-slate-600">
            <Link to="/">
              <ArrowLeft className="size-4" />
              Home
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:py-14">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <Sparkles className="size-6" />
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
            New analysis
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            See what your profile is really saying.
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
            Bring together your resume, portfolio, GitHub and target role.
            CareerLens will connect the evidence and show you what to improve
            first.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-5xl">
          <div className="mb-4 flex items-center gap-3 text-sm text-slate-500">
            <span className="flex size-7 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white">
              1
            </span>
            <span className="font-medium text-slate-700">Build your profile</span>
            <span className="h-px flex-1 bg-slate-200" />
            <span className="hidden sm:block">Everything is optional</span>
          </div>

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_60px_-35px_rgba(15,23,42,0.25)]">
            <div className="border-b border-slate-100 bg-gradient-to-r from-indigo-50/80 via-white to-blue-50/50 px-6 py-6 sm:px-8">
              <div className="flex items-start gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
                  <FileText className="size-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-950">
                    Resume
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Start here for the strongest analysis. Upload your resume
                    or paste its text.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.05fr_0.95fr]">
              <label
                className={`group relative flex min-h-[250px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 text-center transition ${
                  dragActive
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-slate-200 bg-slate-50/70 hover:border-indigo-300 hover:bg-indigo-50/40"
                }`}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setDragActive(false);
                  void onFile(event.dataTransfer.files?.[0] ?? null);
                }}
              >
                <input
                  type="file"
                  className="sr-only"
                  accept=".pdf,.txt,.md,application/pdf,text/plain,text/markdown"
                  disabled={readingFile}
                  onChange={(event) => {
                    void onFile(event.target.files?.[0] ?? null);
                    event.currentTarget.value = "";
                  }}
                />

                <div className="flex size-14 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200 transition group-hover:scale-105">
                  {readingFile ? (
                    <Loader2 className="size-6 animate-spin" />
                  ) : (
                    <UploadCloud className="size-6" />
                  )}
                </div>

                <h3 className="mt-5 font-semibold text-slate-900">
                  {readingFile ? "Reading your resume…" : "Drop your resume here"}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  or <span className="font-semibold text-indigo-600">browse files</span>
                </p>

                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {["PDF", "TXT", "MD", "Up to 10 MB"].map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500 ring-1 ring-slate-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </label>

              <div className="flex flex-col">
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="resume-text"
                    className="text-sm font-semibold text-slate-800"
                  >
                    Or paste your resume
                  </label>
                  <span className="text-xs text-slate-400">Plain text</span>
                </div>

                <Textarea
                  id="resume-text"
                  value={inputs.resumeText}
                  onChange={(e) => set("resumeText", e.target.value)}
                  className="min-h-[250px] resize-none rounded-2xl border-slate-200 bg-slate-50/50 p-4 text-sm leading-6 shadow-none focus-visible:ring-indigo-500"
                  placeholder="Paste your experience, projects, skills, education and achievements here…"
                  aria-label="Resume text"
                />

                {inputs.resumeFileName && (
                  <div className="mt-3 flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2.5">
                    <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-emerald-800">
                      {inputs.resumeFileName}
                    </span>
                    <span className="text-xs text-emerald-600">Ready</span>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-slate-100 px-6 py-4 sm:px-8">
              <p className="text-xs leading-5 text-slate-400">
                Your resume is parsed in the browser before analysis. Scanned
                image-only PDFs may not contain readable text.
              </p>
            </div>
          </section>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <BriefcaseBusiness className="size-5" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-950">Portfolio</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Give CareerLens the context behind your projects.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-5">
                <div>
                  <label htmlFor="portfolio-url" className="mb-2 block text-sm font-medium text-slate-700">
                    Portfolio URL <span className="font-normal text-slate-400">optional</span>
                  </label>
                  <div className="relative">
                    <Link2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="portfolio-url"
                      value={inputs.portfolioUrl}
                      onChange={(e) => set("portfolioUrl", e.target.value)}
                      className="h-11 rounded-xl border-slate-200 pl-10"
                      placeholder="https://yourportfolio.dev"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="portfolio-text" className="mb-2 block text-sm font-medium text-slate-700">
                    Project descriptions
                  </label>
                  <Textarea
                    id="portfolio-text"
                    value={inputs.portfolioText}
                    onChange={(e) => set("portfolioText", e.target.value)}
                    rows={5}
                    className="resize-none rounded-xl border-slate-200"
                    placeholder="Describe your projects: problem, your role, technology and outcome…"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                  <Github className="size-5" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-950">GitHub</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Add developer evidence from your public profile.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-5">
                <div>
                  <label htmlFor="github-url" className="mb-2 block text-sm font-medium text-slate-700">
                    GitHub profile
                  </label>
                  <div className="relative">
                    <Github className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="github-url"
                      value={inputs.githubUrl}
                      onChange={(e) => set("githubUrl", e.target.value)}
                      className="h-11 rounded-xl border-slate-200 pl-10"
                      placeholder="https://github.com/yourname"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="repo-url" className="mb-2 block text-sm font-medium text-slate-700">
                    Best repository <span className="font-normal text-slate-400">optional</span>
                  </label>
                  <div className="relative">
                    <Link2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="repo-url"
                      value={inputs.repoUrl}
                      onChange={(e) => set("repoUrl", e.target.value)}
                      className="h-11 rounded-xl border-slate-200 pl-10"
                      placeholder="https://github.com/yourname/project"
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>

          <section className="mt-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-start gap-4 border-b border-slate-100 p-6 sm:p-7">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Target className="size-5" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-950">Target job</h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Add a role to unlock job matching and role-specific skill gaps.
                </p>
              </div>
            </div>

            <div className="grid gap-5 p-6 sm:p-7 lg:grid-cols-[0.7fr_1.3fr]">
              <div>
                <label htmlFor="job-url" className="mb-2 block text-sm font-medium text-slate-700">
                  Job posting URL <span className="font-normal text-slate-400">optional</span>
                </label>
                <Input
                  id="job-url"
                  value={inputs.jobUrl}
                  onChange={(e) => set("jobUrl", e.target.value)}
                  className="h-11 rounded-xl border-slate-200"
                  placeholder="https://company.com/careers/role"
                />
              </div>

              <div>
                <label htmlFor="job-description" className="mb-2 block text-sm font-medium text-slate-700">
                  Job description
                </label>
                <Textarea
                  id="job-description"
                  value={inputs.jobDescription}
                  onChange={(e) => set("jobDescription", e.target.value)}
                  rows={6}
                  className="resize-none rounded-xl border-slate-200"
                  placeholder="Paste responsibilities, required skills, experience and education…"
                  aria-label="Job description"
                />
              </div>
            </div>
          </section>

          <div className="mt-8 rounded-3xl border border-indigo-100 bg-indigo-50/70 p-5 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-slate-900">
                  Ready to see what recruiters might notice?
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  You can start with only your resume and add the other sources later.
                </p>
              </div>

              <Button
                onClick={submit}
                disabled={busy || readingFile}
                size="lg"
                className="h-12 shrink-0 rounded-xl bg-indigo-600 px-6 shadow-lg shadow-indigo-200 hover:bg-indigo-700"
              >
                {busy ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <ScanSearch className="size-4" />
                )}
                {busy ? "Analyzing…" : "Analyze My Profile"}
              </Button>
            </div>
          </div>

          <div className="mt-5 flex justify-center">
            <Button
              variant="ghost"
              disabled={busy || readingFile}
              className="text-slate-500 hover:text-indigo-600"
              onClick={() => {
                loadDemo();
                navigate({ to: "/app" });
              }}
            >
              Explore the demo instead
            </Button>
          </div>

          <p className="mt-6 text-center text-xs leading-5 text-slate-400">
            No section is mandatory. CareerLens clearly distinguishes between
            what is available and what cannot be determined from your profile.
          </p>
        </div>
      </main>
    </div>
  );
}
