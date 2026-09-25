# CareerLens

### AI Career Profile Analyzer & Career Coach

CareerLens is an AI-powered career profile analysis platform that helps students, developers, and job seekers understand how their professional profile appears from a recruiter’s perspective.

It analyzes multiple career assets — including resumes, portfolios, GitHub profiles, and target job descriptions — and turns them into a unified readiness analysis with actionable recommendations.

> **Don't just tell recruiters what you can do. Prove it.**

---

## 🚀 What CareerLens Does

CareerLens follows a simple approach:

**CLAIM → EVIDENCE → GAP → ACTION**

Instead of looking at a resume in isolation, CareerLens connects information across multiple career assets to identify strengths, missing evidence, and areas that need improvement.

### Core Features

- **Career Readiness Score** — A unified 0–100 profile readiness score.
- **Resume Analysis** — Identifies weak bullets, missing impact, keyword gaps, and structural issues.
- **Portfolio Analysis** — Evaluates project presentation, technical depth, evidence, and recruiter readability.
- **GitHub Insights** — Analyzes available repository and project information.
- **Job Matching** — Compares a candidate's profile with a target job description.
- **Skill Gap Analysis** — Identifies required skills that are missing or insufficiently demonstrated.
- **Improvement Plan** — Provides prioritized actions for this week, next 30 days, and next 60–90 days.
- **AI Career Coach** — A context-aware assistant that answers questions based on the candidate's analysis.
- **PDF Resume Support** — Extracts text directly from uploaded PDF resumes.
- **Demo Mode** — Allows users to explore the platform without uploading personal information.

---

## 🎯 The Problem

Job seekers often have information scattered across their resume, portfolio, GitHub repositories, and job applications.

A candidate may claim a skill on their resume, but their portfolio or GitHub may not provide enough evidence to support that claim.

CareerLens helps identify these gaps before the candidate applies.

For example:

> Resume: "Microservices & Docker"

CareerLens can compare that claim against available project and repository evidence and identify whether the skill is strongly demonstrated, partially demonstrated, or missing evidence.

---

## 🔍 Evidence-Based Analysis

One of CareerLens' core concepts is **Cross-Asset Evidence Triangulation**.

The platform connects evidence across:

- Resume
- Portfolio
- GitHub
- Target Job Description

This allows CareerLens to identify:

- Skills that are clearly demonstrated
- Skills that are mentioned but weakly supported
- Skills required by the target role but not demonstrated
- Areas where additional project evidence could strengthen the profile

The goal is not to generate meaningless scores, but to explain **why** an area needs improvement and what the user can do next.

---

## 🧭 Improvement Roadmap

CareerLens organizes recommendations into three practical timeframes:

### This Week

Small, high-impact improvements that can be completed quickly.

### Next 30 Days

Skill development and portfolio improvements.

### Next 60–90 Days

Longer-term projects and career development actions.

Each recommendation can include priority, estimated effort, expected impact, reason, and suggested action.

---

## 🤖 CareerLens Coach

The CareerLens Coach is an interactive AI assistant that uses the available career analysis context to answer questions such as:

- Why is my score low?
- What are the biggest problems in my resume?
- Which skills should I learn first?
- Am I ready for this job?
- How can I improve my portfolio?
- Which project should I highlight?
- Can you rewrite this resume bullet?

The assistant is designed to distinguish between **facts, inferences, and recommendations** and avoid inventing achievements, skills, experience, or metrics that are not supported by the available information.

---

## 🛠️ Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- TanStack Router
- Lucide Icons
- Recharts

### AI & Analysis

- AI-powered career analysis
- Structured analysis data
- Context-aware AI Career Coach
- PDF text extraction using PDF.js

### Development

- Node.js
- npm
- Git
- GitHub

---

## 📁 Project Structure

```text
CareerLens/
├── public/
├── src/
│   ├── components/
│   │   ├── ai-elements/
│   │   ├── careerlens/
│   │   └── ui/
│   ├── data/
│   ├── hooks/
│   ├── lib/
│   ├── routes/
│   │   ├── api/
│   │   ├── analyze.tsx
│   │   ├── app.tsx
│   │   ├── app.coach.tsx
│   │   ├── app.github.tsx
│   │   ├── app.job-match.tsx
│   │   ├── app.portfolio.tsx
│   │   ├── app.resume.tsx
│   │   ├── app.skill-gaps.tsx
│   │   └── app.plan.tsx
│   ├── router.tsx
│   ├── server.ts
│   ├── start.ts
│   └── styles.css
├── package.json
├── package-lock.json
├── tsconfig.json
└── vite.config.ts
```

---

## 💻 Running Locally

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd CareerLens
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The application will be available at the local development URL shown in the terminal.

---

## 📄 Resume Upload

CareerLens supports:

- PDF
- TXT
- Markdown
- Pasted resume text

PDF resumes are processed to extract readable text for analysis.

Image-only or scanned PDFs may not contain extractable text.

---

## 🔐 Environment Variables

AI functionality may require server-side environment variables.

**Never commit API keys, secrets, or private credentials to GitHub.**

Use a local environment file when required:

```text
.env.local
```

Keep sensitive values outside source code and version control.

---

## 🧪 Demo Mode

CareerLens includes sample analysis data so users can explore the platform without uploading personal career information.

Demo information is clearly separated from actual user-generated analysis.

---

## ⚠️ Important Notes

CareerLens provides career analysis, signals, and recommendations. It does not guarantee ATS approval, interview selection, employment, job offers, or specific hiring outcomes.

Recommendations should be treated as guidance rather than guaranteed results.

---

## 🎯 Product Philosophy

CareerLens is built around one simple idea:

> **See your career profile the way recruiters do.**

Instead of simply asking whether a profile is "good enough", CareerLens focuses on:

**What you claim → What you can prove → What's missing → What to do next**

---

## 👩‍💻 Author

Built as an AI/ML-focused career intelligence project.

**CareerLens — AI Career Profile Analyzer & Career Coach**