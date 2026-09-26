import type { Analysis } from "@/lib/types";

/**
 * CareerLens Demo
 *
 * The resume details below are based on the uploaded sample resume for Ryan Frank.
 * Portfolio, GitHub, and target-job details are intentionally fictional demo inputs.
 *
 * This file is for Demo Mode only and must never be mixed with a real user's data.
 */
export const demoAnalysis: Analysis = {
  id: "demo",
  createdAt: new Date().toISOString(),
  isDemo: true,

  candidateName: "Ryan Frank",
  targetRole: "AI / Machine Learning Engineer — NexaHealth AI",
  overallScore: 82,

  overallSummary:
    "Ryan has a strong AI/ML foundation with relevant healthcare projects, Python experience, machine learning work and REST API exposure. The fictional portfolio and GitHub add useful supporting evidence, but the target role exposes gaps in production ML deployment, cloud, Docker and measurable model performance.",

  breakdown: [
    {
      key: "resume",
      label: "Resume",
      score: 86,
      explanation:
        "Strong AI/ML positioning, relevant healthcare projects and clear technical experience. The main weakness is that several bullets describe responsibilities without measurable model or business outcomes.",
    },
    {
      key: "portfolio",
      label: "Portfolio",
      score: 84,
      explanation:
        "The fictional portfolio provides strong project evidence and makes the healthcare ML work easier to understand, but technical architecture and measurable model results could be surfaced more clearly.",
    },
    {
      key: "github",
      label: "GitHub",
      score: 79,
      explanation:
        "The fictional GitHub profile supports Python, machine learning, Java and API claims with relevant repositories. Testing, deployment automation and cloud evidence are less consistent.",
    },
    {
      key: "jobMatch",
      label: "Job Match",
      score: 78,
      explanation:
        "The profile aligns well with the core AI/ML requirements, but the target role expects stronger production ML deployment, Docker, AWS and experiment tracking evidence.",
    },
  ],

  strengths: [
    {
      id: "s1",
      title: "Healthcare AI projects create a strong story",
      detail:
        "The resume includes Preterm Birth Detection and Infusion Rate Calculation projects, giving the profile a clear applied-AI and healthcare technology direction.",
      source: "Resume",
    },
    {
      id: "s2",
      title: "AI/ML skills are supported by experience",
      detail:
        "Machine learning, deep learning, Python, Oracle AutoML and Oracle ADS SDKs appear in the resume and are reinforced by the fictional portfolio and GitHub evidence.",
      source: "Resume + Portfolio + GitHub",
    },
    {
      id: "s3",
      title: "API and software engineering evidence",
      detail:
        "Jersey for REST APIs, Java, Maven and JUnit provide software-engineering evidence beyond model development.",
      source: "Resume + GitHub",
    },
    {
      id: "s4",
      title: "Relevant professional experience",
      detail:
        "Senior Associate Software Engineer experience in a healthcare technology environment strengthens the connection between AI skills and production software.",
      source: "Resume",
    },
  ],

  weaknesses: [
    {
      id: "w1",
      severity: "critical",
      area: "resume",
      problem:
        "The strongest AI/ML bullets do not consistently show model performance, dataset scale or measurable outcomes.",
      whyItMatters:
        "For an AI/ML engineering role, recruiters need evidence of what the model achieved and what changed because of the work.",
      howToFix:
        "Add defensible metrics such as dataset size, precision/recall, F1, inference time, false-positive reduction or processing volume wherever those measurements actually exist.",
    },
    {
      id: "w2",
      severity: "high",
      area: "github",
      problem:
        "The fictional GitHub profile shows model development but limited production deployment and MLOps evidence.",
      whyItMatters:
        "The target role expects engineers who can move models beyond notebooks and prototypes into repeatable services.",
      howToFix:
        "Add one production-style ML repository showing an API, Dockerfile, tests, experiment tracking and deployment documentation.",
    },
    {
      id: "w3",
      severity: "high",
      area: "jobMatch",
      problem:
        "AWS and Docker are required or strongly preferred by the target role but are not demonstrated in the resume.",
      whyItMatters:
        "These requirements distinguish model-building experience from end-to-end ML engineering capability.",
      howToFix:
        "Build and deploy one small inference service using Docker and an AWS-managed service, then document the architecture and deployment steps.",
    },
    {
      id: "w4",
      severity: "recommended",
      area: "portfolio",
      problem:
        "The fictional portfolio explains the projects well, but model evaluation evidence is not prominent enough.",
      whyItMatters:
        "A hiring manager should be able to understand model quality and engineering decisions without opening the repository.",
      howToFix:
        "Add a compact evaluation panel to each ML project with dataset, metric, baseline, final result and one important limitation.",
    },
    {
      id: "w5",
      severity: "optional",
      area: "resume",
      problem:
        "The resume presents a broad technology set, which can dilute the strongest AI/ML positioning.",
      whyItMatters:
        "A targeted AI/ML application benefits from a clear hierarchy of the skills most relevant to the role.",
      howToFix:
        "Prioritize Python, ML/deep learning, model development, healthcare AI and production API skills near the top; keep secondary technologies concise.",
    },
  ],

  resume: {
    score: 86,
    summary:
      "The resume has a strong technical foundation and a clear AI/ML identity. Its biggest opportunity is converting responsibility-focused bullets into evidence of model quality, engineering scale and business impact.",
    signals: [
      {
        label: "Structure",
        value: 90,
        note: "Clear sections, readable hierarchy and consistent dates.",
      },
      {
        label: "AI/ML relevance",
        value: 91,
        note: "Machine learning, deep learning, Python and healthcare AI projects are prominent.",
      },
      {
        label: "Measurable impact",
        value: 61,
        note: "Most bullets explain work performed but provide limited quantified outcomes.",
      },
      {
        label: "Technical depth",
        value: 86,
        note: "Oracle ADS SDKs, AutoML, Python, Java, REST APIs and JUnit show breadth.",
      },
      {
        label: "Target-role alignment",
        value: 84,
        note: "Strong core alignment, with production ML and cloud skills less visible.",
      },
      {
        label: "ATS compatibility signals",
        value: 88,
        note: "Standard section headings and text-based content provide strong parsing signals.",
      },
    ],
    bulletReviews: [
      {
        id: "b1",
        current:
          "Developed data science skills to prototype machine learning model applications.",
        problem:
          "The statement shows activity but does not identify the model, data, evaluation method or result.",
        suggestion:
          "Developed and evaluated a [model type] for [use case] using [dataset/domain], achieving [verified metric]. Only add the metric if it can be supported.",
      },
      {
        id: "b2",
        current:
          "Created applications as per requirements to make critical predictions and decision.",
        problem:
          "The impact is promising but vague. The reader cannot see what prediction was made or how the application was used.",
        suggestion:
          "Built a prediction application for [specific decision/use case], integrating [model/technology] into the workflow. Add the verified outcome or usage scale.",
      },
      {
        id: "b3",
        current:
          "Worked with team to design and develop robust solutions to meet product requirements for functionality, scalability, and performance.",
        problem:
          "Generic software-engineering wording hides the candidate's individual contribution.",
        suggestion:
          "Specify the owned component, such as API development, model integration, testing or performance optimisation, and include a measurable result where available.",
      },
      {
        id: "b4",
        current:
          "Preterm birth detection model with EHR on person who are currently pregnant.",
        problem:
          "The project title identifies the use case but does not show the model approach, evaluation or technical contribution.",
        suggestion:
          "Built a preterm-birth risk prediction model using EHR data, describing the modelling approach, evaluation metric and the specific preprocessing or feature-engineering work performed.",
      },
    ],
    keywordGaps: [
      "Docker",
      "AWS",
      "MLOps",
      "model deployment",
      "experiment tracking",
      "SQL",
    ],
    atsNotes: [
      "The resume uses standard headings such as Summary, Experience, Projects, Skills, Certifications and Education.",
      "AI/ML, Python and healthcare-related terminology align strongly with the target role.",
      "Keyword presence is not the same as hiring qualification; evidence and role context still matter.",
    ],
  },

  portfolio: {
    score: 84,
    summary:
      "Fictional portfolio evidence makes Ryan's healthcare AI work easier to evaluate and provides a stronger project narrative than the resume alone. The main opportunity is to expose evaluation metrics and production architecture more clearly.",
    signals: [
      {
        label: "Project relevance",
        value: 94,
        note: "Projects directly support the AI/ML Engineer target role.",
      },
      {
        label: "Description clarity",
        value: 86,
        note: "Projects explain the problem, approach and technologies clearly.",
      },
      {
        label: "Technical depth shown",
        value: 82,
        note: "Architecture is described, but deployment and monitoring details are limited.",
      },
      {
        label: "Evidence quality",
        value: 80,
        note: "Live demos and repositories are provided in the fictional portfolio.",
      },
      {
        label: "Recruiter readability",
        value: 88,
        note: "Key project information can be understood quickly.",
      },
    ],
    projects: [
      {
        id: "p1",
        name: "Preterm Birth Risk Prediction",
        detected: [
          "Healthcare ML problem",
          "EHR data",
          "Python",
          "Model evaluation section",
          "GitHub repository",
        ],
        missing: [
          "Production deployment",
          "Model monitoring",
          "Clear baseline comparison",
        ],
        recommendation:
          "Add a small evaluation card showing the baseline, final metric, validation method and one model limitation.",
      },
      {
        id: "p2",
        name: "Infusion Rate Calculation",
        detected: [
          "Healthcare calculation workflow",
          "Java",
          "Testing evidence",
          "Functional explanation",
        ],
        missing: [
          "Performance evidence",
          "Architecture diagram",
          "Live technical demo",
        ],
        recommendation:
          "Show the calculation workflow and include the JUnit testing strategy to connect the project to production-quality engineering.",
      },
      {
        id: "p3",
        name: "Clinical Risk Intelligence Dashboard",
        detected: [
          "Fictional demo project",
          "Python",
          "REST API",
          "Interactive dashboard",
          "Repository link",
        ],
        missing: [
          "Cloud deployment",
          "Docker",
          "Model monitoring",
        ],
        recommendation:
          "Use this project as the portfolio centerpiece by adding Docker, an inference API, deployment documentation and model-monitoring notes.",
      },
    ],
    descriptionTemplate: [
      "Problem — explain the healthcare or business problem in one sentence.",
      "Your role — state exactly what you designed, built or evaluated.",
      "ML approach — name the model family, data preparation and evaluation method.",
      "Result — show a verified metric, usage scale or measurable engineering outcome.",
      "Production evidence — link the API, repository, deployment and technical documentation.",
    ],
  },

  github: {
    score: 79,
    summary:
      "Fictional GitHub evidence supports the AI/ML and software-engineering claims, with particularly strong Python activity. The main gaps are cloud deployment, Docker and consistent automated testing.",
    detected: [
      { label: "Public repositories", value: "12" },
      { label: "Primary languages", value: "Python, Java, SQL" },
      { label: "Recent activity", value: "Commits within the last 30 days" },
      { label: "Pinned repositories", value: "4" },
      { label: "ML repositories", value: "5" },
    ],
    notAvailable: [
      "Private repository contents",
      "Private organisation contribution history",
      "Unpublished production systems",
    ],
    languages: [
      { name: "Python", share: 48 },
      { name: "Java", share: 25 },
      { name: "SQL", share: 12 },
      { name: "JavaScript", share: 9 },
      { name: "Other", share: 6 },
    ],
    highlights: [
      {
        name: "preterm-risk-prediction",
        detail:
          "Strongest ML repository; includes preprocessing, training and evaluation notebooks.",
      },
      {
        name: "infusion-rate-calculator",
        detail:
          "Good Java engineering evidence with visible JUnit tests and structured source code.",
      },
      {
        name: "clinical-risk-api",
        detail:
          "Fictional API project that connects a trained model to a REST endpoint; deployment is not yet demonstrated.",
      },
      {
        name: "ml-experiment-lab",
        detail:
          "Shows experimentation across several model families, but documentation could better explain why models were selected.",
      },
    ],
    qualitySignals: [
      {
        label: "README present",
        status: "good",
        note: "README files exist for the main AI/ML repositories.",
      },
      {
        label: "Setup instructions",
        status: "warn",
        note: "The two largest ML repositories need clearer environment and dataset setup steps.",
      },
      {
        label: "Commit consistency",
        status: "good",
        note: "Recent activity shows ongoing development rather than a single bulk upload.",
      },
      {
        label: "Tests visible",
        status: "warn",
        note: "JUnit evidence is visible, but Python ML/API test coverage is limited.",
      },
      {
        label: "Cloud / deployment evidence",
        status: "bad",
        note: "No strong AWS deployment workflow is demonstrated in the fictional profile.",
      },
    ],
  },

  jobMatch: {
    score: 78,
    role: "AI / Machine Learning Engineer — NexaHealth AI",
    summary:
      "Ryan matches the role's core AI/ML foundation through Python, machine learning, healthcare projects and software engineering. The biggest evidence gaps are production model deployment, AWS, Docker and MLOps.",
    requiredSkills: [
      "Python",
      "Machine Learning",
      "Deep Learning",
      "SQL",
      "REST APIs",
      "Software Testing",
    ],
    preferredSkills: [
      "AWS",
      "Docker",
      "MLOps",
      "MLflow",
      "CI/CD",
      "React",
    ],
    experienceRequirements: [
      "2+ years of software engineering or equivalent applied project experience",
      "Experience building and evaluating machine learning models",
      "Ability to work with engineers and product teams to productionise ML systems",
    ],
    educationRequirements: [
      "Bachelor's or Master's degree in Computer Science, AI, ML, Data Science or a related field",
    ],
    responsibilities: [
      "Build and evaluate machine learning models for healthcare prediction products",
      "Develop Python services that expose models through REST APIs",
      "Prepare and analyse structured healthcare datasets",
      "Write automated tests and maintain reliable ML services",
      "Deploy and monitor models using cloud infrastructure",
      "Collaborate with software engineers and product stakeholders",
    ],
    evidence: [
      {
        skill: "Python",
        level: "strong",
        required: true,
        sources: ["Resume", "Portfolio", "GitHub"],
        note:
          "Python is explicitly listed on the resume and supported by the fictional ML repositories.",
      },
      {
        skill: "Machine Learning",
        level: "strong",
        required: true,
        sources: ["Resume", "Portfolio", "GitHub"],
        note:
          "Machine learning and deep learning are central to the resume and portfolio projects.",
      },
      {
        skill: "Deep Learning",
        level: "strong",
        required: true,
        sources: ["Resume", "Portfolio"],
        note:
          "Deep learning is explicitly mentioned in the resume summary and supported by the fictional project evidence.",
      },
      {
        skill: "REST APIs",
        level: "strong",
        required: true,
        sources: ["Resume", "GitHub"],
        note:
          "Jersey for REST APIs appears on the resume and the fictional clinical-risk-api repository reinforces the claim.",
      },
      {
        skill: "Software Testing",
        level: "partial",
        required: true,
        sources: ["Resume", "GitHub"],
        note:
          "JUnit is listed on the resume and visible in the fictional Java repository, but Python ML/API testing is less demonstrated.",
      },
      {
        skill: "SQL",
        level: "partial",
        required: true,
        sources: ["GitHub"],
        note:
          "SQL appears in the fictional GitHub activity, but it is not prominent in the uploaded resume.",
      },
      {
        skill: "AWS",
        level: "missing",
        required: false,
        sources: [],
        note:
          "No AWS experience is stated in the uploaded resume or demonstrated in the fictional GitHub profile.",
      },
      {
        skill: "Docker",
        level: "missing",
        required: false,
        sources: [],
        note:
          "No Docker evidence is present in the uploaded resume or fictional GitHub profile.",
      },
      {
        skill: "MLOps",
        level: "missing",
        required: false,
        sources: [],
        note:
          "The profile shows model development but not a clear production MLOps workflow.",
      },
      {
        skill: "Java",
        level: "strong",
        required: false,
        sources: ["Resume", "GitHub"],
        note:
          "Java, Maven and JUnit are explicitly listed and supported by the fictional GitHub evidence.",
      },
    ],
  },

  skillGaps: [
    {
      skill: "Production ML deployment",
      level: "developing",
      priority: "learn-first",
      why:
        "The target role expects engineers who can take models from experimentation into reliable services.",
      action:
        "Turn the clinical-risk-api project into a production-style inference service with versioned model artifacts, health checks and deployment documentation.",
    },
    {
      skill: "Docker",
      level: "missing",
      priority: "learn-first",
      why:
        "Containerisation is a preferred requirement and directly supports reproducible ML deployments.",
      action:
        "Add a Dockerfile and docker-compose setup to the clinical-risk-api project and document the local run process.",
    },
    {
      skill: "AWS",
      level: "missing",
      priority: "learn-next",
      why:
        "The target role prefers cloud deployment and the current profile provides no cloud evidence.",
      action:
        "Deploy the inference API to an AWS-managed service and document the architecture, environment variables and deployment steps.",
    },
    {
      skill: "MLOps / experiment tracking",
      level: "developing",
      priority: "learn-next",
      why:
        "Model experimentation is demonstrated, but reproducibility and experiment tracking are not clearly shown.",
      action:
        "Track model versions, datasets, hyperparameters and evaluation metrics using an experiment-tracking workflow such as MLflow.",
    },
    {
      skill: "Python testing",
      level: "developing",
      priority: "learn-next",
      why:
        "Testing is visible through JUnit, but the AI/ML and API work needs stronger Python test evidence.",
      action:
        "Add pytest tests for preprocessing, model inference and API endpoints in the strongest Python project.",
    },
    {
      skill: "Healthcare data engineering",
      level: "strong",
      priority: "optional",
      why:
        "The resume already demonstrates healthcare-focused project experience.",
      action:
        "Keep this strength visible by explaining data preparation, validation and privacy-aware handling in the portfolio.",
    },
    {
      skill: "Python + ML",
      level: "strong",
      priority: "optional",
      why:
        "This is already one of the strongest cross-source signals.",
      action:
        "Keep the evidence concentrated around one or two flagship projects rather than spreading it across too many technologies.",
    },
  ],

  improvementPlan: [
    {
      id: "r1",
      title: "Add verified outcomes to the strongest AI/ML resume bullets",
      horizon: "this-week",
      priority: "high",
      effort: "60–90 minutes",
      impact: "Makes existing AI work substantially easier to evaluate",
      reason:
        "The resume's main weakness is not relevance; it is the lack of measurable evidence around model and engineering outcomes.",
      action:
        "Add only defensible metrics such as model performance, dataset size, processing time or usage scale.",
    },
    {
      id: "r2",
      title: "Make the preterm-birth project the flagship case study",
      horizon: "this-week",
      priority: "high",
      effort: "2–3 hours",
      impact: "Creates a strong AI/healthcare narrative across resume and portfolio",
      reason:
        "It is the clearest example of applied machine learning in the uploaded resume.",
      action:
        "Show the problem, data preparation, model approach, evaluation metric, limitations and technical architecture.",
    },
    {
      id: "r3",
      title: "Add Docker and tests to the clinical-risk API",
      horizon: "30-days",
      priority: "high",
      effort: "5–8 hours",
      impact: "Closes two practical engineering evidence gaps",
      reason:
        "The target role expects reliable services around ML models.",
      action:
        "Containerise the service, add pytest coverage and document the API locally.",
    },
    {
      id: "r4",
      title: "Deploy one ML inference service on AWS",
      horizon: "30-days",
      priority: "high",
      effort: "8–12 hours",
      impact: "Adds concrete cloud and deployment evidence",
      reason:
        "AWS is a preferred skill in the fictional target job and currently has no supporting evidence.",
      action:
        "Deploy the API, document the architecture and add the live endpoint or deployment evidence to the portfolio.",
    },
    {
      id: "r5",
      title: "Add experiment tracking to an ML project",
      horizon: "60-90-days",
      priority: "medium",
      effort: "4–6 hours",
      impact: "Makes the ML workflow look more production-oriented",
      reason:
        "The current profile demonstrates model experimentation but not repeatable experiment management.",
      action:
        "Track model versions, parameters, datasets and evaluation metrics with an experiment-tracking tool.",
    },
    {
      id: "r6",
      title: "Strengthen Python testing evidence",
      horizon: "60-90-days",
      priority: "medium",
      effort: "3–5 hours",
      impact: "Connects existing JUnit experience to Python ML engineering",
      reason:
        "Testing is required by the target role but currently appears stronger in Java than in Python.",
      action:
        "Test preprocessing, model inference and API behaviour in the flagship Python project.",
    },
  ],

  provided: {
    resume: true,
    portfolio: true,
    github: true,
    job: true,
  },
};
