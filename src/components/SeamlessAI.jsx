import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Mic, MicOff, Volume2, VolumeX, ThumbsUp, ThumbsDown } from "lucide-react";
import { CONTENT, PROJECTS, SKILLS } from "../constants";

const DEFAULT_SUGGESTIONS = [
  "Show my top projects",
  "What are my strongest skills?",
  "Recommend a project for recruiters",
  "How can someone contact me?",
];

const PLACEHOLDERS = [
  "Ask about projects, skills, or contact...",
  "Try: recommend project for ML role",
  "Try: create resume bullets for backend AI",
  "Try: /faq",
  "Try: /analytics",
];

const ANALYTICS_KEY = "portfolio_chatbot_analytics_v1";
const SUMMARY_KEY = "portfolio_chatbot_summary_v1";

const INTENT_KEYWORDS = {
  projects: ["project", "work", "build", "portfolio", "demo", "case study", "show"],
  skills: ["skill", "stack", "tech", "expert", "tool", "framework"],
  contact: ["contact", "email", "reach", "hire", "linkedin", "github", "connect"],
  background: ["about", "background", "intro", "who", "experience", "education"],
  recommend: ["recommend", "best", "suitable", "fit", "for role", "for recruiter"],
  resume: ["resume", "cv", "bullet", "ats", "job description", "tailor"],
  faq: ["faq", "questions", "common questions"],
  analytics: ["analytics", "stats", "insights", "usage"],
  greeting: ["hello", "hi", "hey", "hola", "namaste"],
};

const tokenize = (text) =>
  String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

const normalizeForMatch = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .trim();

const detectLanguage = (text) => {
  if (/[\u0900-\u097F]/.test(text)) return "hi";
  const lower = String(text || "").toLowerCase();
  if (/(hola|gracias|buenos|como estas)/.test(lower)) return "es";
  return "en";
};

const l10n = {
  en: {
    unsure: "I might be missing exact context. Based on available site data:",
    askMore: "Ask me to expand any one item.",
    hi: "Hi. I can help with projects, skills, resume bullets, and contact.",
  },
  hi: {
    unsure: "हो सकता है पूरी जानकारी न हो, लेकिन वेबसाइट डेटा के आधार पर:",
    askMore: "किसी भी एक बिंदु पर और विस्तार मांग सकते हैं।",
    hi: "नमस्ते। मैं projects, skills, resume bullets और contact में मदद कर सकता हूँ।",
  },
  es: {
    unsure: "Puede que falte contexto exacto; según los datos del sitio:",
    askMore: "Pídeme ampliar cualquiera de estos puntos.",
    hi: "Hola. Puedo ayudar con proyectos, habilidades, CV y contacto.",
  },
};

const defaultAnalytics = {
  totalQuestions: 0,
  helpfulYes: 0,
  helpfulNo: 0,
  lowConfidenceAnswers: 0,
};

const loadAnalyticsState = () => {
  if (typeof window === "undefined") return defaultAnalytics;
  try {
    const raw = window.localStorage.getItem(ANALYTICS_KEY);
    if (!raw) return defaultAnalytics;
    return { ...defaultAnalytics, ...JSON.parse(raw) };
  } catch {
    return defaultAnalytics;
  }
};

const loadSummaryState = () => {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(SUMMARY_KEY) || "";
};

const buildKnowledgeDocs = () => {
  const projectDocs = PROJECTS.map((project) => ({
    id: `project:${project.id}`,
    type: "project",
    title: project.title,
    text: [
      project.title,
      project.description || "",
      ...(project.tags || []),
      project.demo || "",
      project.github || "",
    ].join(" "),
    data: project,
  }));

  const skillDocs = SKILLS.map((skill) => ({
    id: `skill:${skill.name.toLowerCase()}`,
    type: "skill",
    title: skill.name,
    text: `${skill.name} ${skill.level} skill technology stack`,
    data: skill,
  }));

  const bioDoc = {
    id: "bio:core",
    type: "bio",
    title: CONTENT.name,
    text: `${CONTENT.name} ${CONTENT.role} ${CONTENT.bio}`,
    data: CONTENT,
  };

  const contactDoc = {
    id: "contact:core",
    type: "contact",
    title: "Contact",
    text: CONTENT.social.map((item) => `${item.name} ${item.link}`).join(" "),
    data: CONTENT.social,
  };

  return [...projectDocs, ...skillDocs, bioDoc, contactDoc];
};

const KNOWLEDGE_DOCS = buildKnowledgeDocs();

const scoreIntent = (text, intent) => {
  const lower = text.toLowerCase();
  return INTENT_KEYWORDS[intent].reduce((score, keyword) => (lower.includes(keyword) ? score + 1 : score), 0);
};

const detectIntent = (question, lastIntent) => {
  const ranked = Object.keys(INTENT_KEYWORDS)
    .map((intent) => ({ intent, score: scoreIntent(question, intent) }))
    .sort((a, b) => b.score - a.score);

  if (ranked[0].score > 0) return ranked[0].intent;
  return lastIntent || "fallback";
};

const scoreDoc = (question, doc, intent) => {
  const qTokens = tokenize(question);
  const hay = doc.text.toLowerCase();
  let score = 0;

  qTokens.forEach((token) => {
    if (hay.includes(token)) score += 1;
  });

  if (question.toLowerCase().includes((doc.title || "").toLowerCase())) score += 3;
  if (intent && (doc.type === intent || (intent === "background" && doc.type === "bio"))) score += 2;

  return score;
};

const retrieveKnowledge = (question, intent, limit = 5) =>
  KNOWLEDGE_DOCS
    .map((doc) => ({ doc, score: scoreDoc(question, doc, intent) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

const confidenceFromRetrieved = (retrieved, tokenCount) => {
  if (!retrieved.length) return 0.08;
  const top = retrieved[0].score;
  const denom = Math.max(3, tokenCount + 1);
  return Math.max(0.08, Math.min(0.98, top / denom));
};

const formatProject = (project) => {
  const tags = (project.tags || []).slice(0, 5).join(", ");
  return [
    `**${project.title}**`,
    project.description || "No description available.",
    tags ? `Tech: ${tags}` : "",
    project.demo ? `Demo: ${project.demo}` : "",
    project.github ? `GitHub: ${project.github}` : "",
  ]
    .filter(Boolean)
    .join("\n");
};

const getSocialLink = (name) => CONTENT.social.find((item) => item.name.toLowerCase() === name.toLowerCase())?.link || "";

const findProjectByQuery = (query) => {
  const q = normalizeForMatch(query);
  if (!q) return null;

  return (
    PROJECTS.find((project) => {
      const title = normalizeForMatch(project.title);
      return title.includes(q) || q.includes(title);
    }) || null
  );
};

const compareProjectsFromQuestion = (question) => {
  if (!question.toLowerCase().includes("compare")) return null;

  const hits = PROJECTS.filter((project) => question.toLowerCase().includes(normalizeForMatch(project.title)));
  if (hits.length >= 2) return hits.slice(0, 2);
  if (hits.length === 1) {
    const second = PROJECTS.find((project) => project.id !== hits[0].id);
    return second ? [hits[0], second] : null;
  }
  return PROJECTS.length >= 2 ? [PROJECTS[0], PROJECTS[1]] : null;
};

const buildFaq = () => {
  const firstProject = PROJECTS[0];
  const topSkills = SKILLS.slice(0, 4).map((skill) => skill.name).join(", ");
  const email = getSocialLink("Email").replace("mailto:", "");

  return [
    { q: "What does this portfolio focus on?", a: `${CONTENT.role}. ${CONTENT.bio}` },
    { q: "What are top skills?", a: topSkills || "Skills section has detailed list." },
    { q: "What is a featured project?", a: firstProject ? `${firstProject.title}: ${firstProject.description}` : "No projects yet." },
    { q: "How can someone contact?", a: email || "Use social links in contact section." },
  ];
};

const recommendProjects = (question) => {
  const lower = question.toLowerCase();
  const weighted = PROJECTS.map((project) => {
    let score = 0;
    const tags = (project.tags || []).join(" ").toLowerCase();

    if (lower.includes("recruiter") || lower.includes("interview")) {
      if (tags.includes("next") || tags.includes("api") || tags.includes("tailwind")) score += 3;
      if (project.demo) score += 2;
    }

    if (lower.includes("ml") || lower.includes("ai") || lower.includes("data")) {
      if (tags.includes("tensorflow") || tags.includes("pytorch") || tags.includes("llama") || tags.includes("scikit")) score += 4;
    }

    if (lower.includes("backend") || lower.includes("system")) {
      if (tags.includes("fastapi") || tags.includes("api") || tags.includes("mongo") || tags.includes("sql")) score += 3;
    }

    score += Math.min(2, (project.tags || []).length / 2);

    return { project, score };
  })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.project);

  return weighted;
};

const resumeBullets = (question) => {
  const focus = question.replace(/.*(?:for|role|jd|job description)\s*/i, "").trim();
  const picks = recommendProjects(question).slice(0, 2);

  const lines = [
    "Here are ATS-friendly bullets:",
    ...picks.map((project) => `- Built **${project.title}** using ${(project.tags || []).slice(0, 4).join(", ")}; delivered ${project.description || "impactful solution"}.`),
  ];

  if (focus) {
    lines.push(`- Tailored for role focus: **${focus}**.`);
  }

  return lines.join("\n");
};

const parseActionCommand = (question) => {
  const lower = question.toLowerCase().trim();
  const openMatch = lower.match(/^\/(?:open|project)\s+(.+)$/) || lower.match(/^open\s+(.+)$/);

  if (openMatch) {
    const project = findProjectByQuery(openMatch[1]);
    if (project) {
      return {
        type: "open_url",
        label: `Opened ${project.title}`,
        url: project.demo || project.github,
        projectId: project.id,
        intent: "projects",
      };
    }
  }

  if (lower.includes("open github")) {
    return { type: "open_url", label: "Opened GitHub profile", url: getSocialLink("GitHub"), intent: "contact" };
  }

  if (lower.includes("open linkedin")) {
    return { type: "open_url", label: "Opened LinkedIn profile", url: getSocialLink("LinkedIn"), intent: "contact" };
  }

  if (lower === "/copy email" || lower.includes("copy email")) {
    return {
      type: "copy_text",
      label: "Copied email to clipboard",
      value: getSocialLink("Email").replace("mailto:", ""),
      intent: "contact",
    };
  }

  if (lower === "/go projects" || lower.includes("go to projects") || lower.includes("take me to projects")) {
    return { type: "navigate", label: "Navigating to Projects page", path: "/projects", intent: "projects" };
  }

  if (lower === "/go home" || lower.includes("go to home")) {
    return { type: "navigate", label: "Navigating to Home page", path: "/", intent: "background" };
  }

  if (lower === "/scroll top" || lower.includes("scroll to top")) {
    return { type: "scroll_top", label: "Scrolled to top", intent: "navigation" };
  }

  return null;
};

const performAction = async (action) => {
  if (!action) return { ok: false, message: "" };

  if (action.type === "open_url") {
    if (!action.url) return { ok: false, message: "Could not find a valid link for that action." };
    window.open(action.url, "_blank", "noopener,noreferrer");
    return { ok: true, message: action.label };
  }

  if (action.type === "copy_text") {
    try {
      await navigator.clipboard.writeText(action.value || "");
      return { ok: true, message: action.label };
    } catch {
      return { ok: false, message: "Clipboard access failed." };
    }
  }

  if (action.type === "navigate") {
    if (window.location.pathname !== action.path) {
      window.location.assign(action.path);
    }
    return { ok: true, message: action.label };
  }

  if (action.type === "scroll_top") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return { ok: true, message: action.label };
  }

  return { ok: false, message: "Unknown action." };
};

const suggestionsForIntent = (intent) => {
  const first = PROJECTS[0]?.title || "my top project";
  const second = PROJECTS[1]?.title || "another project";

  if (intent === "projects") {
    return [`details on ${first}`, `compare ${first} and ${second}`, `/open ${first}`, "/go projects"];
  }
  if (intent === "skills") {
    return ["map skills to projects", "show top skills", "skills for backend AI", "recommend project for ML"];
  }
  if (intent === "contact") {
    return ["/copy email", "open linkedin", "open github", "best way to contact"];
  }
  if (intent === "background") {
    return ["summarize profile in 2 lines", "education background", "show projects", "top skills"];
  }
  if (intent === "resume") {
    return ["resume bullets for ML engineer", "resume bullets for backend ai", "recommend project for recruiter", "show top projects"];
  }
  if (intent === "faq") {
    return ["/faq", "show top projects", "top skills", "contact details"];
  }
  return [...DEFAULT_SUGGESTIONS];
};

const summarizeConversation = (history) => {
  const recent = history.slice(-4);
  if (!recent.length) return "";

  const items = recent.map((item) => {
    const q = String(item.question || "").slice(0, 40);
    const i = item.intent || "general";
    return `[${i}] ${q}`;
  });

  return `Recent focus: ${items.join(" | ")}`;
};

const plainTextFromMarkdown = (text) => String(text || "").replace(/\*\*(.*?)\*\*/g, "$1");

const buildAnswer = (question, context, analytics) => {
  const language = detectLanguage(question);
  const langPack = l10n[language] || l10n.en;
  const intent = detectIntent(question, context.lastIntent);
  const action = parseActionCommand(question);

  if (action) {
    return {
      answer: `Running action: **${action.label}**`,
      intent: action.intent || intent,
      projectId: action.projectId || context.lastProjectId,
      confidence: 0.95,
      suggestions: suggestionsForIntent(action.intent || intent),
      sources: [],
      action,
    };
  }

  const lower = question.toLowerCase().trim();
  const retrieved = retrieveKnowledge(question, intent);
  const confidence = confidenceFromRetrieved(retrieved, tokenize(question).length);

  if (lower === "/faq" || intent === "faq") {
    const faqText = buildFaq()
      .map((item, idx) => `${idx + 1}. **${item.q}**\n   ${item.a}`)
      .join("\n\n");

    return {
      answer: `Auto-generated FAQ from current website data:\n\n${faqText}`,
      intent: "faq",
      projectId: context.lastProjectId,
      confidence: 0.92,
      suggestions: suggestionsForIntent("faq"),
      sources: ["projects.json", "skills", "content"],
    };
  }

  if (lower === "/analytics" || intent === "analytics") {
    return {
      answer: [
        "Chatbot analytics (local browser):",
        `- Total questions: ${analytics.totalQuestions}`,
        `- Helpful votes: ${analytics.helpfulYes}`,
        `- Needs improvement votes: ${analytics.helpfulNo}`,
        `- Low-confidence answers: ${analytics.lowConfidenceAnswers}`,
      ].join("\n"),
      intent: "analytics",
      projectId: context.lastProjectId,
      confidence: 1,
      suggestions: DEFAULT_SUGGESTIONS,
      sources: ["local analytics"],
    };
  }

  if (intent === "recommend" || lower.includes("recommend")) {
    const picks = recommendProjects(question);
    const list = picks.map((project, idx) => `${idx + 1}. **${project.title}** - ${(project.tags || []).slice(0, 3).join(", ")}`).join("\n");
    return {
      answer: `Recommended projects based on your query:\n${list}\n\nAsk me to open any one with: /open <project name>.`,
      intent: "projects",
      projectId: picks[0]?.id || context.lastProjectId,
      confidence: 0.88,
      suggestions: suggestionsForIntent("projects"),
      sources: picks.map((project) => project.title),
    };
  }

  if (intent === "resume" || lower.includes("resume") || lower.includes("ats")) {
    return {
      answer: resumeBullets(question),
      intent: "resume",
      projectId: context.lastProjectId,
      confidence: 0.9,
      suggestions: suggestionsForIntent("resume"),
      sources: ["projects", "skills"],
    };
  }

  const compare = compareProjectsFromQuestion(question);
  if (compare) {
    const [a, b] = compare;
    return {
      answer: [
        `**${a.title}** vs **${b.title}**`,
        `- ${a.title}: ${(a.tags || []).slice(0, 3).join(", ") || "General stack"}`,
        `- ${b.title}: ${(b.tags || []).slice(0, 3).join(", ") || "General stack"}`,
        "Ask me to compare by impact, technical depth, or production readiness.",
      ].join("\n"),
      intent: "projects",
      projectId: a.id,
      confidence: 0.86,
      suggestions: suggestionsForIntent("projects"),
      sources: [a.title, b.title],
    };
  }

  if (intent === "greeting") {
    return {
      answer: langPack.hi,
      intent: "greeting",
      projectId: context.lastProjectId,
      confidence: 0.99,
      suggestions: DEFAULT_SUGGESTIONS,
      sources: [],
    };
  }

  if (intent === "contact") {
    const contact = CONTENT.social.map((item) => `- ${item.name}: ${item.link}`).join("\n");
    return {
      answer: `You can reach out here:\n${contact}`,
      intent: "contact",
      projectId: context.lastProjectId,
      confidence: 0.96,
      suggestions: suggestionsForIntent("contact"),
      sources: ["content.social"],
    };
  }

  if (intent === "background") {
    return {
      answer: `${CONTENT.name} — ${CONTENT.role}\n\n${CONTENT.bio}`,
      intent: "background",
      projectId: context.lastProjectId,
      confidence: 0.95,
      suggestions: suggestionsForIntent("background"),
      sources: ["content.bio"],
    };
  }

  if (intent === "skills") {
    const top = retrieved
      .filter((item) => item.doc.type === "skill")
      .slice(0, 6)
      .map((item) => item.doc.data.name)
      .join(", ") || SKILLS.slice(0, 6).map((skill) => skill.name).join(", ");

    return {
      answer: `Strong areas: **${top}**.\nI can map these to specific projects too.`,
      intent: "skills",
      projectId: context.lastProjectId,
      confidence,
      suggestions: suggestionsForIntent("skills"),
      sources: ["skills"],
    };
  }

  if (intent === "projects") {
    const best = retrieved.find((item) => item.doc.type === "project")?.doc?.data || PROJECTS[0];
    if (best) {
      return {
        answer: formatProject(best),
        intent: "projects",
        projectId: best.id,
        confidence,
        suggestions: suggestionsForIntent("projects"),
        sources: [best.title],
      };
    }
  }

  const fallbackList = retrieved.slice(0, 3).map((item) => `- **${item.doc.type}**: ${item.doc.title}`).join("\n");

  return {
    answer: fallbackList
      ? `${confidence < 0.3 ? `${langPack.unsure}\n` : ""}${fallbackList}\n\n${langPack.askMore}`
      : "I can help with projects, skills, background, and contact. Try: show projects, top skills, or /faq.",
    intent: "fallback",
    projectId: context.lastProjectId,
    confidence,
    suggestions: fallbackList ? ["tell me more about the first one", "show projects", "top skills", "contact details"] : DEFAULT_SUGGESTIONS,
    sources: retrieved.map((item) => item.doc.title),
  };
};

const renderStrong = (text) => {
  const parts = String(text || "").split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    const match = part.match(/^\*\*(.*)\*\*$/);
    if (match) return <strong key={`${part}-${index}`}>{match[1]}</strong>;
    return <span key={`${part}-${index}`}>{part}</span>;
  });
};

const AnswerText = ({ text }) => (
  <div className="space-y-2">
    {String(text || "").split("\n").map((line, index) => (
      <p key={`${line}-${index}`} className={index > 0 ? "mt-1" : ""}>
        {renderStrong(line)}
      </p>
    ))}
  </div>
);

const SeamlessAI = ({ className = "", isPage = false, compact = false }) => {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [isBooting, setIsBooting] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [dynamicSuggestions, setDynamicSuggestions] = useState(DEFAULT_SUGGESTIONS);
  const [analytics, setAnalytics] = useState(loadAnalyticsState);
  const [conversationContext, setConversationContext] = useState({
    lastIntent: null,
    lastProjectId: null,
    summary: loadSummaryState(),
  });

  const recognitionRef = useRef(null);
  const handleSendRef = useRef(null);

  const containerClasses = compact
    ? "max-w-none bg-transparent border-0 shadow-none p-0"
    : isPage
      ? "max-w-3xl bg-md-surface rounded-3xl p-6 md:p-12 transition-all duration-300 shadow-md"
      : "max-w-2xl transition-all duration-300";

  const inputClasses = compact
    ? "py-3 text-base bg-md-surface-variant rounded-t-lg px-4 border-b-2 border-md-outline focus:border-md-primary"
    : isPage
      ? "py-4 md:py-5 text-xl md:text-3xl bg-md-surface-variant rounded-t-lg px-4 border-b-2 border-md-outline focus:border-md-primary placeholder:text-md-on-surface-variant/50"
      : "py-4 md:py-6 text-xl md:text-3xl bg-md-surface-variant rounded-t-lg px-4 border-b-2 border-md-outline focus:border-md-primary font-medium";

  const [placeholder, setPlaceholder] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const timer = setTimeout(() => setIsBooting(false), 420);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));
  }, [analytics]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (conversationContext.summary) {
      window.localStorage.setItem(SUMMARY_KEY, conversationContext.summary);
    }
  }, [conversationContext.summary]);

  useEffect(() => {
    if (!input.trim()) return;
    // when typing, show defaults less aggressively
  }, [input]);

  useEffect(() => {
    if (isTyping) return;
    if (!history.length) return;
    const latest = history[history.length - 1];
    if (!latest.answer) return;
    if (!speechEnabled || typeof window === "undefined" || !window.speechSynthesis) return;

    const utterance = new SpeechSynthesisUtterance(plainTextFromMarkdown(latest.answer));
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, [history, isTyping, speechEnabled]);

  useEffect(() => {
    if (!input.trim()) {
      const i = loopNum % PLACEHOLDERS.length;
      const full = PLACEHOLDERS[i];
      const timer = setTimeout(() => {
        setPlaceholder((prev) => {
          const next = isDeleting ? full.slice(0, Math.max(0, prev.length - 1)) : full.slice(0, prev.length + 1);
          if (!isDeleting && next === full) {
            setTimeout(() => setIsDeleting(true), 900);
          }
          if (isDeleting && next === "") {
            setIsDeleting(false);
            setLoopNum((prevLoop) => prevLoop + 1);
          }
          return next;
        });
        setTypingSpeed(isDeleting ? 40 : 120);
      }, typingSpeed);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [input, loopNum, isDeleting, typingSpeed]);

  const showSuggestions = !input.trim();

  const appendFeedback = (index, value) => {
    setHistory((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, feedback: value } : item))
    );

    setAnalytics((prev) => ({
      ...prev,
      helpfulYes: prev.helpfulYes + (value === "up" ? 1 : 0),
      helpfulNo: prev.helpfulNo + (value === "down" ? 1 : 0),
    }));
  };

  const executeActionButton = async (action) => {
    if (!action) return;
    await performAction(action);
  };

  const handleSend = async (textOverride = null) => {
    const question = textOverride || input;
    if (!question.trim()) return;

    setInput("");
    setIsTyping(true);

    await new Promise((resolve) => setTimeout(resolve, 420));

    const result = buildAnswer(question, conversationContext, analytics);
    const actionOutcome = await performAction(result.action);
    const finalAnswer = actionOutcome.message
      ? `${result.answer}\n${actionOutcome.ok ? "✅" : "⚠️"} ${actionOutcome.message}`
      : result.answer;

    const entry = {
      question,
      answer: finalAnswer,
      intent: result.intent,
      confidence: result.confidence,
      sources: result.sources || [],
      actions: result.quickActions || [],
      feedback: null,
    };

    const nextHistory = [...history, entry];
    const nextSummary = summarizeConversation(nextHistory);

    setHistory(nextHistory);
    setDynamicSuggestions(result.suggestions?.length ? result.suggestions : DEFAULT_SUGGESTIONS);
    setConversationContext({
      lastIntent: result.intent,
      lastProjectId: result.projectId,
      summary: nextSummary,
    });
    setAnalytics((prev) => ({
      ...prev,
      totalQuestions: prev.totalQuestions + 1,
      lowConfidenceAnswers: prev.lowConfidenceAnswers + (result.confidence < 0.3 ? 1 : 0),
    }));
    setIsTyping(false);
  };

  handleSendRef.current = handleSend;

  useEffect(() => {
    const onQuickPrompt = (event) => {
      const prompt = event?.detail?.prompt;
      if (!prompt) return;
      handleSendRef.current?.(prompt);
    };
    window.addEventListener("portfolio:quick-chat", onQuickPrompt);
    return () => window.removeEventListener("portfolio:quick-chat", onQuickPrompt);
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSend();
    }
  };

  const toggleListening = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      if (transcript) setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <div className={`w-full ${containerClasses} relative ${className}`}>
      {!isPage && !compact && (
        <div
          className={`absolute -inset-10 bg-md-primary/10 rounded-full blur-3xl transition-all duration-1000 ${
            isFocused ? "opacity-100 scale-105" : "opacity-30 scale-95"
          }`}
        />
      )}

      <div className="relative z-10">
        <div className={`flex items-center justify-between opacity-60 ${compact ? "mb-4" : "mb-6 md:mb-8"}`}>
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-md-primary animate-pulse md:w-4 md:h-4" />
            <span className="text-xs font-medium text-md-on-surface-variant">
              Intelligence v4.0
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleListening}
              className={`p-2 rounded-full transition-all duration-200 active:scale-95 ${isListening ? "bg-md-primary text-md-on-primary" : "text-md-on-surface-variant hover:bg-md-primary/10"}`}
              aria-label="Toggle voice input"
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            </button>
            <button
              onClick={() => setSpeechEnabled((prev) => !prev)}
              className={`p-2 rounded-full transition-all duration-200 active:scale-95 ${speechEnabled ? "bg-md-primary text-md-on-primary" : "text-md-on-surface-variant hover:bg-md-primary/10"}`}
              aria-label="Toggle voice output"
            >
              {speechEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
          </div>
        </div>

        <div className={`space-y-6 md:space-y-8 mb-6 md:mb-8 w-full ${compact ? "min-h-[70px] max-h-56 overflow-y-auto pr-1" : "min-h-[100px]"}`}>
          {isBooting && (
            <div className="space-y-3" aria-hidden="true">
              <div className="h-3 w-32 animate-pulse bg-md-surface-variant rounded" />
              <div className="h-5 w-full animate-pulse bg-md-surface-variant rounded" />
              <div className="h-5 w-5/6 animate-pulse bg-md-surface-variant rounded" />
            </div>
          )}
          <AnimatePresence mode="popLayout">
            {!isBooting && history.slice(-4).map((pair, index) => {
              const absoluteIndex = history.length - Math.min(4, history.length) + index;
              return (
                <motion.div
                  key={`${pair.question}-${absoluteIndex}`}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="group"
                >
                  <div className="text-md-on-surface-variant text-xs font-medium mb-2 md:mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-md-primary/60" />
                    {pair.question}
                  </div>
                  <div className={`text-md-on-background leading-relaxed transition-colors duration-300 ${compact ? "text-base md:text-lg" : "text-lg md:text-2xl"}`}>
                    <AnswerText text={pair.answer} />
                  </div>

                  <div className="mt-2 flex items-center gap-2 text-xs text-md-on-surface-variant/70">
                    <span>confidence: {Math.round((pair.confidence || 0) * 100)}%</span>
                    {!!pair.sources?.length && <span>sources: {pair.sources.slice(0, 2).join(", ")}</span>}
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={() => appendFeedback(absoluteIndex, "up")}
                      className={`p-1.5 rounded-full transition-all duration-200 active:scale-95 ${pair.feedback === "up" ? "bg-md-primary text-md-on-primary" : "text-md-on-surface-variant hover:bg-md-primary/10"}`}
                      aria-label="Helpful response"
                    >
                      <ThumbsUp size={14} />
                    </button>
                    <button
                      onClick={() => appendFeedback(absoluteIndex, "down")}
                      className={`p-1.5 rounded-full transition-all duration-200 active:scale-95 ${pair.feedback === "down" ? "bg-md-primary text-md-on-primary" : "text-md-on-surface-variant hover:bg-md-primary/10"}`}
                      aria-label="Unhelpful response"
                    >
                      <ThumbsDown size={14} />
                    </button>
                  </div>

                  {!!pair.actions?.length && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {pair.actions.map((action) => (
                        <button
                          key={action.label}
                          onClick={() => executeActionButton(action)}
                          className="px-3 py-1.5 text-xs font-medium rounded-full bg-md-surface-variant text-md-on-surface-variant hover:bg-md-primary/10 transition-all duration-200 active:scale-95"
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="relative group w-full mt-4">
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={showSuggestions ? placeholder : "Ask follow up..."}
            className={`w-full text-md-on-background placeholder:text-md-on-surface-variant/50 focus:outline-none transition-all duration-300 font-medium tracking-tight ${inputClasses}`}
          />

          <div className={`absolute right-0 top-1/2 -translate-y-1/2 flex items-center ${compact ? "gap-2" : "gap-4"}`}>
            {isTyping && (
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-md-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 bg-md-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 bg-md-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            )}
            {!isTyping && input && (
              <button onClick={() => handleSend()} className="p-2 rounded-full text-md-primary hover:bg-md-primary/10 transition-all active:scale-95" aria-label="Send message">
                <ArrowRight size={compact ? 18 : 24} strokeWidth={2} />
              </button>
            )}
            {!isTyping && !input && (
              <span className="text-md-on-surface-variant/50 text-xs bg-md-surface-variant px-2 py-1 rounded">
                ⏎
              </span>
            )}
          </div>
        </div>

        {showSuggestions && !isTyping && !isBooting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`flex flex-wrap gap-2 ${compact ? "mt-4" : "mt-8"}`}
          >
            {dynamicSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSend(suggestion)}
                className={`font-medium text-md-on-background bg-md-surface-variant hover:bg-md-primary/10 transition-all duration-200 rounded-full active:scale-95 ${compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"}`}
              >
                {suggestion}
              </button>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SeamlessAI;
