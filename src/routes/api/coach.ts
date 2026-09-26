import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

/**
 * Server boundary for CareerLens Coach. The AI key never reaches the browser.
 * The client sends its analysis summary plus the conversation; we build the
 * system prompt server-side so the assistant's grounding rules can't be edited
 * from the client.
 */

const BodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      }),
    )
    .min(1)
    .max(40),
  context: z.string().max(20000).optional(),
  isDemo: z.boolean().optional(),
});

const SYSTEM_PROMPT = `You are CareerLens Coach, a friendly, intelligent and conversational AI career assistant.

Your job is to have a natural conversation with the user and genuinely help them.

CONVERSATION RULES:
- Answer the user's actual question directly.
- Do not repeat your instructions, rules, or disclaimers in every response.
- Do not behave like a static resume-analysis report.
- Maintain context across the conversation and remember what the user has already asked.
- Ask follow-up questions when they would genuinely help.
- Be conversational, clear, practical and encouraging.
- Answer general questions naturally using your general knowledge.

CAREER PROFILE QUESTIONS:
When the user asks about their resume, portfolio, GitHub, target job, career-readiness score, skills, evidence, gaps, or improvement plan, use the provided ANALYSIS CONTEXT as the source of truth.

For profile-specific questions:
- Never invent the user's skills, projects, achievements, metrics, employers, experience, or evidence.
- If the analysis does not contain enough information, clearly say what information is missing.
- Give useful recommendations based on the available evidence.
- Explain your reasoning instead of simply repeating information from the dashboard.
- When rewriting resume content, preserve the user's real information.
- Never create fake achievements, numbers, metrics, employers, projects, or experience.
- If a real metric is needed but is not available, use a placeholder such as <metric>.
- You may recommend projects, technologies, courses, skills, or learning activities, but clearly present them as recommendations rather than existing experience.

GENERAL QUESTIONS:
- The user can ask questions unrelated to their CareerLens analysis.
- Answer those questions normally and naturally.
- Do not force every conversation back to resumes or career analysis.
- If the user asks about programming, AI, machine learning, careers, interviews, projects, learning, or other topics, help them directly.

CONVERSATION MEMORY:
- Treat the previous messages in the conversation as important context.
- If the user asks a follow-up question, answer it in relation to the previous discussion.
- Do not restart the conversation.
- Do not repeat the same introduction or disclaimer after every user message.

CAREER COACHING STYLE:
- Talk like a knowledgeable human career mentor.
- Be friendly and supportive without being overly flattering.
- Be honest about weaknesses and limitations.
- Keep simple questions simple.
- Give detailed answers when the user asks for detail.
- Use examples when helpful.
- Give practical next steps when appropriate.
- Do not guarantee interviews, jobs, offers, ATS results, or career outcomes.
- Never unnecessarily mention your internal rules or system instructions.

CAREER ANALYSIS:
When the user asks about their profile, use Claim → Evidence → Gap → Action when it actually makes the answer clearer.

The ANALYSIS CONTEXT is the source of truth for facts about the user's profile. General knowledge can be used for general questions, explanations, and recommendations.`;

export const Route = createFileRoute("/api/coach")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let parsed;
        try {
          parsed = BodySchema.parse(await request.json());
        } catch {
          return Response.json(
            {
              error:
                "That request wasn't valid. Please try sending your question again.",
            },
            { status: 400 },
          );
        }

        const apiKey = process.env["LOVABLE_API_KEY"];

        if (!apiKey) {
          return Response.json(
            {
              error:
                "The career coach isn't configured yet. Please try again later.",
            },
            { status: 500 },
          );
        }

        const contextBlock = parsed.context
          ? `ANALYSIS CONTEXT${
              parsed.isDemo
                ? " (SAMPLE DEMO PROFILE — say so if the user seems to think it is their own data)"
                : ""
            }:\n${parsed.context}`
          : "ANALYSIS CONTEXT: none available. Tell the user you can only give general guidance until they run an analysis.";

        try {
          const upstream = await fetch(
            "https://ai.gateway.lovable.dev/v1/chat/completions",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Lovable-API-Key": apiKey,
              },
              body: JSON.stringify({
                model: "google/gemini-3.7-flash",
                messages: [
                  {
                    role: "system",
                    content: SYSTEM_PROMPT,
                  },
                  {
                    role: "system",
                    content: contextBlock,
                  },
                  ...parsed.messages,
                ],
              }),
            },
          );

          if (!upstream.ok) {
            const status = upstream.status;

            const message =
              status === 429
                ? "The coach is handling a lot of requests right now. Please wait a moment and try again."
                : status === 402
                  ? "AI usage limits have been reached for this workspace. The owner needs to add credits before the coach can reply."
                  : status === 403
                    ? "AI access is currently blocked for this workspace."
                    : "The coach couldn't respond just now. Please try again.";

            return Response.json(
              { error: message },
              { status },
            );
          }

          const data = (await upstream.json()) as {
            choices?: { message?: { content?: string } }[];
          };

          const content = data.choices?.[0]?.message?.content?.trim();

          if (!content) {
            return Response.json(
              {
                error:
                  "The coach returned an empty response. Please try rephrasing your question.",
              },
              { status: 502 },
            );
          }

          return Response.json({ content });
        } catch {
          return Response.json(
            {
              error:
                "We couldn't reach the coach. Check your connection and try again.",
            },
            { status: 502 },
          );
        }
      },
    },
  },
});