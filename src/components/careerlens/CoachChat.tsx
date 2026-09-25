import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { useAnalysisStore } from "@/lib/analysis-store";
import { buildCoachContext } from "@/lib/coach-context";
import type { CoachMessage } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageActions,
  MessageAction,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";

const SUGGESTED = [
  "Why is my score this?",
  "What is my biggest evidence gap?",
  "What should I fix this week?",
  "How well do I match this job?",
  "Which skill should I prove next?",
  "How should I improve my weakest area?",
];

const uid = () => `m-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export function CoachChat({ variant = "page" }: { variant?: "page" | "panel" }) {
  const { analysis, messages, setMessages } = useAnalysisStore();
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!busy) inputRef.current?.focus();
  }, [busy]);

  const send = useCallback(
    async (text: string, history?: CoachMessage[]) => {
      const trimmed = text.trim();
      if (!trimmed || busy) return;
      const base = history ?? messages;
      const userMessage: CoachMessage = {
        id: uid(),
        role: "user",
        content: trimmed,
        createdAt: new Date().toISOString(),
      };
      const next = [...base, userMessage];
      setMessages(next);
      setInput("");
      setBusy(true);
      try {
        const res = await fetch("/api/coach", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: next.slice(-20).map((m) => ({ role: m.role, content: m.content })),
            context: buildCoachContext(analysis),
            isDemo: analysis?.isDemo ?? false,
          }),
        });
        const data = (await res.json()) as { content?: string; error?: string };
        if (!res.ok || !data.content) {
          toast.error(data.error ?? "The coach couldn't respond. Please try again.");
          setMessages(base);
          setInput(trimmed);
          return;
        }
        setMessages([
          ...next,
          {
            id: uid(),
            role: "assistant",
            content: data.content,
            createdAt: new Date().toISOString(),
          },
        ]);
      } catch {
        toast.error("Network problem — your message wasn't sent. Please try again.");
        setMessages(base);
        setInput(trimmed);
      } finally {
        setBusy(false);
      }
    },
    [analysis, busy, messages, setMessages],
  );

  const regenerate = useCallback(() => {
    const lastUserIndex = [...messages].reverse().findIndex((m) => m.role === "user");
    if (lastUserIndex === -1) return;
    const idx = messages.length - 1 - lastUserIndex;
    const target = messages[idx];
    if (!target) return;
    void send(target.content, messages.slice(0, idx));
  }, [messages, send]);

  const copy = useCallback(async (message: CoachMessage) => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopiedId(message.id);
      toast.success("Response copied");
      window.setTimeout(() => setCopiedId(null), 1500);
    } catch {
      toast.error("Couldn't copy to clipboard");
    }
  }, []);

  return (
    <div
      className={cn(
        "flex min-h-0 flex-col",
        variant === "panel" ? "h-full" : "h-[calc(100dvh-11rem)] min-h-[520px]",
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <Logo withWordmark={false} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">CareerLens Coach</p>
            <p className="truncate text-xs text-muted-foreground">
              {analysis
                ? analysis.isDemo
                  ? "Answering from the sample analysis"
                  : "Answering from your analysis"
                : "No analysis loaded yet"}
            </p>
          </div>
        </div>
        {messages.length > 0 ? (
          <Button variant="ghost" size="sm" onClick={() => setMessages([])} disabled={busy}>
            New chat
          </Button>
        ) : null}
      </div>

      <Conversation className="min-h-0">
        <ConversationContent className="gap-5 px-4 py-4">
          {messages.length === 0 ? (
            <div className="space-y-4">
              <div className="border-l-2 border-primary pl-4">
                <p className="text-sm font-medium">Hi — I'm your CareerLens Coach.</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  I use only your profile and target-job analysis. If the evidence is not there, I
                  will say so rather than inventing it.
                </p>
              </div>
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Suggested prompts
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED.map((prompt) => (
                    <Button
                      key={prompt}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => void send(prompt)}
                      className="h-auto whitespace-normal rounded-full py-1.5 text-left"
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            messages.map((message) =>
              message.role === "user" ? (
                <Message key={message.id} from="user">
                  <MessageContent className="bg-primary text-primary-foreground">
                    {message.content}
                  </MessageContent>
                </Message>
              ) : (
                <Message key={message.id} from="assistant">
                  <MessageContent>
                    <MessageResponse>{message.content}</MessageResponse>
                  </MessageContent>
                  <MessageActions>
                    <MessageAction tooltip="Copy response" onClick={() => void copy(message)}>
                      {copiedId === message.id ? (
                        <Check className="size-3.5" />
                      ) : (
                        <Copy className="size-3.5" />
                      )}
                    </MessageAction>
                    <MessageAction
                      tooltip="Regenerate response"
                      onClick={regenerate}
                      disabled={busy}
                    >
                      <RefreshCw className="size-3.5" />
                    </MessageAction>
                  </MessageActions>
                </Message>
              ),
            )
          )}

          {busy ? (
            <Shimmer className="text-sm" aria-live="polite">
              Checking your evidence…
            </Shimmer>
          ) : null}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-t border-border p-3">
        <PromptInput
          onSubmit={({ text }) => {
            void send(text);
          }}
        >
          <PromptInputTextarea
            id="coach-input"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your score, evidence gaps, or next action…"
            className="min-h-20"
          />
          <PromptInputFooter className="justify-end">
            <PromptInputSubmit
              status={busy ? "submitted" : "ready"}
              disabled={busy || !input.trim()}
              aria-label="Send message"
            />
          </PromptInputFooter>
        </PromptInput>
        <p className="mt-2 text-[11px] text-muted-foreground">
          Grounded in your analysis. No invented skills, projects, achievements, metrics, or
          experience.
        </p>
      </div>
    </div>
  );
}
