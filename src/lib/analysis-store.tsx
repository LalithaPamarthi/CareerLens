import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Analysis, AnalysisInputs, CoachMessage } from "./types";
import { demoAnalysis } from "@/data/demo-analysis";

const ANALYSES_KEY = "careerlens.analyses.v2";
const ACTIVE_KEY = "careerlens.active-analysis.v2";
const CHAT_PREFIX = "careerlens.coach.v2.";

type NamedAnalysis = Analysis & { name?: string };

type Store = {
  analysis: Analysis | null;
  analyses: NamedAnalysis[];
  activeAnalysisId: string | null;
  isDemo: boolean;
  messages: CoachMessage[];
  setAnalysis: (a: Analysis) => void;
  selectAnalysis: (id: string) => void;
  loadDemo: () => void;
  clear: () => void;
  removeAnalysis: (id: string) => void;
  renameAnalysis: (id: string, name: string) => void;
  setMessages: (m: CoachMessage[]) => void;
  ready: boolean;
};

const AnalysisContext = createContext<Store | null>(null);

function readAnalyses(): NamedAnalysis[] {
  try {
    const raw = window.localStorage.getItem(ANALYSES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is Analysis =>
        Boolean(item) &&
        typeof item === "object" &&
        "id" in item &&
        typeof (item as { id?: unknown }).id === "string" &&
        !(item as { isDemo?: boolean }).isDemo,
    );
  } catch {
    return [];
  }
}

function writeAnalyses(analyses: Analysis[]) {
  try {
    window.localStorage.setItem(ANALYSES_KEY, JSON.stringify(analyses));
  } catch {
    /* storage unavailable — state still works for this session */
  }
}

function chatKey(id: string) {
  return `${CHAT_PREFIX}${id}`;
}

function readChat(id: string): CoachMessage[] {
  try {
    const raw = window.localStorage.getItem(chatKey(id));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as CoachMessage[]) : [];
  } catch {
    return [];
  }
}

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [analyses, setAnalysesState] = useState<NamedAnalysis[]>([]);
  const [activeAnalysisId, setActiveAnalysisIdState] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [messages, setMessagesState] = useState<CoachMessage[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const storedAnalyses = readAnalyses();
    let storedActiveId: string | null = null;

    try {
      storedActiveId = window.localStorage.getItem(ACTIVE_KEY);
    } catch {
      /* ignore */
    }

    const validActiveId = storedAnalyses.some((a) => a.id === storedActiveId)
      ? storedActiveId
      : storedAnalyses[0]?.id ?? null;

    setAnalysesState(storedAnalyses);
    setActiveAnalysisIdState(validActiveId);
    setMessagesState(validActiveId ? readChat(validActiveId) : []);
    setReady(true);
  }, []);

  const activeAnalysis = useMemo(
    () => analyses.find((item) => item.id === activeAnalysisId) ?? null,
    [analyses, activeAnalysisId],
  );

  const analysis = isDemo ? demoAnalysis : activeAnalysis;

  const setAnalysis = useCallback((incoming: Analysis) => {
    const id = `analysis-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const next: NamedAnalysis = {
      ...incoming,
      id,
      name: `Analysis — ${new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`,
      isDemo: false,
      createdAt: new Date().toISOString(),
    };

    setAnalysesState((previous) => {
      const updated = [next, ...previous.filter((item) => item.id !== next.id)];
      writeAnalyses(updated);
      return updated;
    });
    setActiveAnalysisIdState(id);
    setIsDemo(false);
    setMessagesState([]);

    try {
      window.localStorage.setItem(ACTIVE_KEY, id);
      window.localStorage.removeItem(chatKey(id));
    } catch {
      /* ignore */
    }
  }, []);

  const selectAnalysis = useCallback((id: string) => {
    setActiveAnalysisIdState(id);
    setIsDemo(false);
    setMessagesState(readChat(id));

    try {
      window.localStorage.setItem(ACTIVE_KEY, id);
    } catch {
      /* ignore */
    }
  }, []);

  const renameAnalysis = useCallback((id: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    setAnalysesState((current) => {
      const updated = current.map((item) =>
        item.id === id ? { ...item, name: trimmed } : item,
      );
      writeAnalyses(updated);
      return updated;
    });
  }, []);

  const loadDemo = useCallback(() => {
    setIsDemo(true);
    setMessagesState([]);
  }, []);

  const clear = useCallback(() => {
    if (isDemo) {
      setIsDemo(false);
      setMessagesState([]);
      return;
    }

    setAnalysesState((current) => {
      const remaining = current.filter((item) => item.id !== activeAnalysisId);
      writeAnalyses(remaining);
      return remaining;
    });

    const nextId = analyses.find((item) => item.id !== activeAnalysisId)?.id ?? null;
    setActiveAnalysisIdState(nextId);
    setMessagesState(nextId ? readChat(nextId) : []);

    try {
      if (nextId) window.localStorage.setItem(ACTIVE_KEY, nextId);
      else window.localStorage.removeItem(ACTIVE_KEY);
      if (activeAnalysisId) window.localStorage.removeItem(chatKey(activeAnalysisId));
    } catch {
      /* ignore */
    }
  }, [activeAnalysisId, analyses, isDemo]);

  const removeAnalysis = useCallback(
    (id: string) => {
      setAnalysesState((current) => {
        const remaining = current.filter((item) => item.id !== id);
        writeAnalyses(remaining);
        return remaining;
      });

      if (id === activeAnalysisId) {
        const nextId = analyses.find((item) => item.id !== id)?.id ?? null;
        setActiveAnalysisIdState(nextId);
        setMessagesState(nextId ? readChat(nextId) : []);

        try {
          if (nextId) window.localStorage.setItem(ACTIVE_KEY, nextId);
          else window.localStorage.removeItem(ACTIVE_KEY);
        } catch {
          /* ignore */
        }
      }

      try {
        window.localStorage.removeItem(chatKey(id));
      } catch {
        /* ignore */
      }
    },
    [activeAnalysisId, analyses],
  );

  const setMessages = useCallback(
    (nextMessages: CoachMessage[]) => {
      setMessagesState(nextMessages);
      if (isDemo || !activeAnalysisId) return;

      try {
        window.localStorage.setItem(chatKey(activeAnalysisId), JSON.stringify(nextMessages));
      } catch {
        /* ignore */
      }
    },
    [activeAnalysisId, isDemo],
  );

  const value = useMemo(
    () => ({
      analysis,
      analyses,
      activeAnalysisId,
      isDemo,
      messages,
      setAnalysis,
      selectAnalysis,
      loadDemo,
      clear,
      removeAnalysis,
      renameAnalysis,
      setMessages,
      ready,
    }),
    [
      analysis,
      analyses,
      activeAnalysisId,
      isDemo,
      messages,
      setAnalysis,
      selectAnalysis,
      loadDemo,
      clear,
      removeAnalysis,
      renameAnalysis,
      setMessages,
      ready,
    ],
  );

  return <AnalysisContext.Provider value={value}>{children}</AnalysisContext.Provider>;
}

export function useAnalysisStore(): Store {
  const ctx = useContext(AnalysisContext);
  if (!ctx) throw new Error("useAnalysisStore must be used inside AnalysisProvider");
  return ctx;
}

export const emptyInputs: AnalysisInputs = {
  resumeText: "",
  resumeFileName: null,
  portfolioUrl: "",
  portfolioText: "",
  githubUrl: "",
  repoUrl: "",
  jobDescription: "",
  jobUrl: "",
};
