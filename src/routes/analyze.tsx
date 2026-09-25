import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Loader2, ScanSearch } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Logo } from "@/components/careerlens/Logo";
import { buildAnalysis } from "@/lib/analysis-engine";
import { emptyInputs, useAnalysisStore } from "@/lib/analysis-store";
import type { AnalysisInputs } from "@/lib/types";

export const Route = createFileRoute("/analyze")({
  head: () => ({
    meta: [
      { title: "Analyze your career profile — CareerLens" },
      {
        name: "description",
        content:
          "Paste your resume, portfolio, GitHub and a target job description to get an honest, evidence-based career readiness analysis.",
      },
      { property: "og:title", content: "Analyze your career profile — CareerLens" },
      {
        property: "og:description",
        content: "Get an honest, evidence-based read on how recruiters see your profile.",
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

  const pdf = await pdfjsLib.getDocument({
    data: arrayBuffer,
  }).promise;

  const pageTexts: string[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();

    const pageText = content.items
      .map((item) => {
        if ("str" in item) {
          return item.str;
        }
        return "";
      })
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    if (pageText) {
      pageTexts.push(pageText);
    }
  }

  return pageTexts.join("\n\n");
}

function AnalyzePage() {
  const [inputs, setInputs] = useState<AnalysisInputs>(emptyInputs);
  const [busy, setBusy] = useState(false);
  const [readingFile, setReadingFile] = useState(false);

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

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
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
              "This PDF may be scanned or image-based. Please upload a text-based PDF or paste your resume text below.",
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

      toast.success("Resume loaded successfully", {
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
      toast.error("Add at least one source so there is something to analyze.");
      return;
    }

    setBusy(true);

    // Local heuristic analysis — nothing leaves the browser.
    setTimeout(() => {
      setAnalysis(buildAnalysis(inputs));
      setBusy(false);
      navigate({ to: "/app" });
    }, 500);
  }

  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <Link to="/">
            <Logo />
          </Link>

          <Button asChild variant="ghost" size="sm">
            <Link to="/">
              <ArrowLeft className="size-4" />
              Home
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Analyze your career profile
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Add whatever you have — every section is optional, and CareerLens is
          explicit about what it cannot judge. Your information stays in this
          browser.
        </p>

        <div className="mt-8 space-y-6">
          <section className="surface-card space-y-3 p-5">
            <div>
              <h2 className="text-sm font-semibold">Resume</h2>

              <p className="text-xs text-muted-foreground">
                Paste the full text, or upload a PDF, .txt, or .md file.
              </p>
            </div>

            <Textarea
              value={inputs.resumeText}
              onChange={(e) => set("resumeText", e.target.value)}
              rows={10}
              placeholder="Paste your resume text here, including experience bullets, skills and education."
              aria-label="Resume text"
            />

            <div className="flex flex-wrap items-center gap-3">
              <Input
                type="file"
                accept=".pdf,.txt,.md,application/pdf,text/plain,text/markdown"
                className="max-w-xs"
                aria-label="Upload resume file"
                disabled={readingFile}
                onChange={(e) => {
                  void onFile(e.target.files?.[0] ?? null);
                  e.currentTarget.value = "";
                }}
              />

              {readingFile ? (
                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="size-3.5 animate-spin" />
                  Reading resume…
                </span>
              ) : inputs.resumeFileName ? (
                <span className="text-xs text-muted-foreground">
                  {inputs.resumeFileName}
                </span>
              ) : null}
            </div>

            <p className="text-xs text-muted-foreground">
              PDF files up to 10 MB are supported. Text is extracted in your
              browser before analysis.
            </p>
          </section>

          <section className="surface-card space-y-3 p-5">
            <div>
              <h2 className="text-sm font-semibold">Portfolio</h2>

              <p className="text-xs text-muted-foreground">
                CareerLens does not crawl your site — paste your project
                descriptions for a real review.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="portfolio-url">Portfolio URL</Label>

              <Input
                id="portfolio-url"
                value={inputs.portfolioUrl}
                onChange={(e) => set("portfolioUrl", e.target.value)}
                placeholder="https://yourname.dev"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="portfolio-text">Project descriptions</Label>

              <Textarea
                id="portfolio-text"
                value={inputs.portfolioText}
                onChange={(e) => set("portfolioText", e.target.value)}
                rows={6}
                placeholder="One project per paragraph: what it does, your role, the stack, the outcome."
              />
            </div>
          </section>

          <section className="surface-card space-y-3 p-5">
            <div>
              <h2 className="text-sm font-semibold">GitHub</h2>

              <p className="text-xs text-muted-foreground">
                Used as an evidence signal only, never as a code audit.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="github-url">Profile URL</Label>

                <Input
                  id="github-url"
                  value={inputs.githubUrl}
                  onChange={(e) => set("githubUrl", e.target.value)}
                  placeholder="https://github.com/yourname"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="repo-url">
                  Best repository (optional)
                </Label>

                <Input
                  id="repo-url"
                  value={inputs.repoUrl}
                  onChange={(e) => set("repoUrl", e.target.value)}
                  placeholder="https://github.com/yourname/project"
                />
              </div>
            </div>
          </section>

          <section className="surface-card space-y-3 p-5">
            <div>
              <h2 className="text-sm font-semibold">Target job</h2>

              <p className="text-xs text-muted-foreground">
                Paste the job description to unlock job match and skill gaps.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="job-url">Job posting URL (optional)</Label>

              <Input
                id="job-url"
                value={inputs.jobUrl}
                onChange={(e) => set("jobUrl", e.target.value)}
                placeholder="https://company.com/careers/frontend-engineer"
              />
            </div>

            <Textarea
              value={inputs.jobDescription}
              onChange={(e) => set("jobDescription", e.target.value)}
              rows={8}
              placeholder="Paste the full job description: responsibilities, required skills, experience and education."
              aria-label="Job description"
            />
          </section>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button onClick={submit} disabled={busy || readingFile}>
            {busy ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ScanSearch className="size-4" />
            )}

            {busy ? "Analyzing…" : "Run analysis"}
          </Button>

          <Button
            variant="ghost"
            disabled={busy || readingFile}
            onClick={() => {
              loadDemo();
              navigate({ to: "/app" });
            }}
          >
            Explore the demo instead
          </Button>
        </div>
      </main>
    </div>
  );
}