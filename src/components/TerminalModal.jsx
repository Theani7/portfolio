import { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { CONTENT, PROJECTS, SKILLS } from "../constants";

const STORAGE_KEY = "portfolio_terminal_v2_state";

const DEFAULT_ALIASES = {
  ll: "ls -la",
  gs: "projects list",
  projects: "projects list",
  contact: "cat contact.info",
};

const DEFAULT_PROFILE = "builder";

const THEMES = {
  retro: {
    shell: "bg-[#111111] border-[#3f3f46]",
    title: "bg-[#1f1f1f] border-[#3f3f46]",
    body: "text-[#e4e4e7]",
    promptArrow: "text-[#22c55e]",
    promptPath: "text-[#60a5fa]",
    command: "text-[#fafafa]",
    hint: "text-[#a1a1aa]",
  },
  cyber: {
    shell: "bg-[#071018] border-[#164e63]",
    title: "bg-[#0b1621] border-[#164e63]",
    body: "text-[#cffafe]",
    promptArrow: "text-[#22d3ee]",
    promptPath: "text-[#38bdf8]",
    command: "text-[#ecfeff]",
    hint: "text-[#67e8f9]",
  },
  minimal: {
    shell: "bg-[#18181b] border-[#27272a]",
    title: "bg-[#27272a] border-[#3f3f46]",
    body: "text-[#e5e7eb]",
    promptArrow: "text-[#34d399]",
    promptPath: "text-[#93c5fd]",
    command: "text-[#ffffff]",
    hint: "text-[#9ca3af]",
  },
};

const COMMAND_SPECS = [
  "help",
  "ls",
  "cd",
  "cat",
  "pwd",
  "mkdir",
  "touch",
  "echo",
  "rm",
  "tree",
  "find",
  "grep",
  "history",
  "alias",
  "unalias",
  "whoami",
  "date",
  "clear",
  "exit",
  "open",
  "projects",
  "ask",
  "gen",
  "theme",
  "profile",
  "config",
];

const BLOCKED_PATTERNS = [
  { pattern: /rm\s+-rf\s+\//i, message: "Blocked dangerous command pattern." },
  { pattern: /:\(\)\s*\{\s*:\|:&\s*\};:/, message: "Blocked fork bomb pattern." },
  { pattern: /curl\s+[^|]+\|\s*(sh|bash|zsh)/i, message: "Blocked unsafe remote pipe execution." },
  { pattern: /sudo\s+/i, message: "sudo is disabled in this virtual environment." },
];

const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const toPromptPath = (segments) => (segments.length ? `~/${segments.join("/")}` : "~");

const cloneFs = (fs) => JSON.parse(JSON.stringify(fs));

const resolvePathSegments = (rawPath, cwdSegments) => {
  if (!rawPath || rawPath === ".") return [...cwdSegments];

  const startsFromRoot = rawPath.startsWith("/") || rawPath.startsWith("~");
  const base = startsFromRoot ? [] : [...cwdSegments];
  const cleaned = rawPath.replace(/^~\/?/, "").replace(/^\//, "");

  cleaned.split("/").forEach((part) => {
    if (!part || part === ".") return;
    if (part === "..") {
      base.pop();
      return;
    }
    base.push(part);
  });

  return base;
};

const getNode = (fs, segments) => {
  let current = fs["~"];
  for (const segment of segments) {
    if (!current || current.type !== "dir") return null;
    current = current.children?.[segment];
    if (!current) return null;
  }
  return current;
};

const ensureDir = (fs, segments) => {
  let current = fs["~"];
  for (const segment of segments) {
    if (current.type !== "dir") return null;
    if (!current.children[segment]) {
      current.children[segment] = { type: "dir", children: {} };
    }
    current = current.children[segment];
  }
  return current;
};

const writeFile = (fs, segments, content, append = false) => {
  if (!segments.length) return { ok: false, error: "Cannot write to root path." };
  const parentSegments = segments.slice(0, -1);
  const fileName = segments[segments.length - 1];
  const parent = getNode(fs, parentSegments);
  if (!parent || parent.type !== "dir") {
    return { ok: false, error: "Parent directory does not exist." };
  }

  const existing = parent.children[fileName];
  if (existing && existing.type === "dir") {
    return { ok: false, error: "Cannot overwrite a directory." };
  }

  const previous = existing?.content || "";
  parent.children[fileName] = {
    type: "file",
    content: append ? `${previous}${content}` : content,
  };
  return { ok: true };
};

const readFile = (fs, segments) => {
  const node = getNode(fs, segments);
  if (!node) return { ok: false, error: "No such file or directory." };
  if (node.type !== "file") return { ok: false, error: "Path is a directory." };
  return { ok: true, content: node.content };
};

const removePath = (fs, segments, recursive) => {
  if (!segments.length) return { ok: false, error: "Refusing to remove root." };
  const parent = getNode(fs, segments.slice(0, -1));
  const name = segments[segments.length - 1];
  const node = parent?.children?.[name];

  if (!parent || !node) return { ok: false, error: "No such file or directory." };
  if (node.type === "dir" && Object.keys(node.children).length > 0 && !recursive) {
    return { ok: false, error: "Directory not empty. Use rm -r." };
  }

  delete parent.children[name];
  return { ok: true };
};

const listTree = (node, prefix = "") => {
  if (!node || node.type !== "dir") return [];
  const names = Object.keys(node.children).sort();
  const lines = [];

  names.forEach((name, index) => {
    const child = node.children[name];
    const isLast = index === names.length - 1;
    const branch = isLast ? "└── " : "├── ";
    const nextPrefix = `${prefix}${isLast ? "    " : "│   "}`;
    lines.push(`${prefix}${branch}${name}${child.type === "dir" ? "/" : ""}`);
    if (child.type === "dir") {
      lines.push(...listTree(child, nextPrefix));
    }
  });

  return lines;
};

const findPaths = (node, basePath, matcher, results) => {
  if (!node || node.type !== "dir") return;
  Object.keys(node.children).forEach((name) => {
    const child = node.children[name];
    const fullPath = `${basePath}/${name}`;
    if (matcher(name, fullPath)) {
      results.push(`${fullPath}${child.type === "dir" ? "/" : ""}`);
    }
    if (child.type === "dir") {
      findPaths(child, fullPath, matcher, results);
    }
  });
};

const parseFlags = (args) => {
  const flags = new Set();
  const rest = [];

  args.forEach((arg) => {
    if (arg.startsWith("-") && arg.length > 1) {
      arg.slice(1).split("").forEach((flag) => flags.add(flag));
    } else {
      rest.push(arg);
    }
  });

  return { flags, rest };
};

const tokenize = (segment) => {
  const tokens = [];
  const pattern = /"([^"]*)"|'([^']*)'|([^\s]+)/g;
  let match = pattern.exec(segment);
  while (match) {
    tokens.push(match[1] ?? match[2] ?? match[3]);
    match = pattern.exec(segment);
  }
  return tokens;
};

const splitOutsideQuotes = (value, splitter) => {
  const parts = [];
  let current = "";
  let quote = "";

  for (let i = 0; i < value.length; i += 1) {
    const char = value[i];

    if ((char === "'" || char === '"') && value[i - 1] !== "\\") {
      if (!quote) quote = char;
      else if (quote === char) quote = "";
      current += char;
      continue;
    }

    if (!quote && char === splitter) {
      parts.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  if (current.trim()) parts.push(current.trim());
  return parts;
};

const parseRedirection = (segment) => {
  let quote = "";
  for (let i = 0; i < segment.length; i += 1) {
    const char = segment[i];

    if ((char === "'" || char === '"') && segment[i - 1] !== "\\") {
      if (!quote) quote = char;
      else if (quote === char) quote = "";
      continue;
    }

    if (!quote && char === ">") {
      const append = segment[i + 1] === ">";
      const operatorLength = append ? 2 : 1;
      const commandPart = segment.slice(0, i).trim();
      const targetPart = segment.slice(i + operatorLength).trim();
      return {
        command: commandPart,
        redirect: targetPart ? { append, path: targetPart } : null,
      };
    }
  }

  return { command: segment.trim(), redirect: null };
};

const defaultHistory = () => [
  { type: "output", text: `Welcome to ${CONTENT.name}'s Terminal v2.0` },
  { type: "output", text: "Shell profile: builder" },
  { type: "output", text: "Type 'help' to explore advanced commands." },
];

const generateFileSystem = () => {
  const projectsDir = {};
  PROJECTS.forEach((project) => {
    const slug = slugify(project.title) || `project-${project.id}`;
    projectsDir[`${slug}.md`] = {
      type: "file",
      content: [
        `Title: ${project.title}`,
        `Description: ${project.description || ""}`,
        `Tags: ${(project.tags || []).join(", ")}`,
        `Demo: ${project.demo || "N/A"}`,
        `GitHub: ${project.github || "N/A"}`,
      ].join("\n"),
    };
  });

  return {
    "~": {
      type: "dir",
      children: {
        projects: { type: "dir", children: projectsDir },
        notes: { type: "dir", children: {} },
        "about.txt": {
          type: "file",
          content: `${CONTENT.name}\n${CONTENT.role}\n\n${CONTENT.bio}`,
        },
        "skills.md": {
          type: "file",
          content: SKILLS.map((skill) => `- ${skill.name} (${skill.level})`).join("\n"),
        },
        "contact.info": {
          type: "file",
          content: CONTENT.social.map((item) => `${item.name}: ${item.link}`).join("\n"),
        },
        ".shellrc": {
          type: "file",
          content: "",
        },
      },
    },
  };
};

const shellRcContent = (aliases, profile) => {
  const lines = ["# Portfolio Shell RC", `profile=${profile}`, "", "# Aliases"];
  Object.keys(aliases)
    .sort()
    .forEach((name) => {
      lines.push(`alias ${name}='${aliases[name]}'`);
    });
  return lines.join("\n");
};

const buildInitialState = () => {
  const fs = generateFileSystem();
  const initial = {
    fs,
    cwd: [],
    aliases: { ...DEFAULT_ALIASES },
    theme: "minimal",
    profile: DEFAULT_PROFILE,
    commandHistory: [],
  };

  fs["~"].children[".shellrc"].content = shellRcContent(initial.aliases, initial.profile);
  return initial;
};

const loadTerminalState = () => {
  const base = buildInitialState();
  if (typeof window === "undefined") return base;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return base;

    return {
      fs: parsed.fs || base.fs,
      cwd: Array.isArray(parsed.cwd) ? parsed.cwd : base.cwd,
      aliases:
        parsed.aliases && typeof parsed.aliases === "object"
          ? { ...DEFAULT_ALIASES, ...parsed.aliases }
          : base.aliases,
      theme: parsed.theme && THEMES[parsed.theme] ? parsed.theme : base.theme,
      profile: typeof parsed.profile === "string" ? parsed.profile : base.profile,
      commandHistory: Array.isArray(parsed.commandHistory)
        ? parsed.commandHistory
        : base.commandHistory,
    };
  } catch {
    return base;
  }
};

const applyAlias = (line, aliases) => {
  const tokens = tokenize(line);
  if (!tokens.length) return line;
  const [head, ...rest] = tokens;
  if (!aliases[head]) return line;
  return `${aliases[head]}${rest.length ? ` ${rest.join(" ")}` : ""}`;
};

const commandHelp = () =>
  [
    "Advanced Terminal v2 Commands",
    "",
    "Core: help, pwd, whoami, date, clear, exit, history",
    "FS: ls [-la], cd <path>, cat <file>, mkdir <dir>, touch <file>, echo <text> > <file>, rm [-r] <path>",
    "Search: tree [path], find [path] [pattern], grep <pattern> [file]",
    "Projects: projects list | show <id|slug> | open <id|slug>, open <id|slug>",
    "Shell: alias [name='cmd'], unalias <name>, profile [show|set], config show",
    "Theme: theme list | theme set <retro|cyber|minimal>",
    "AI: ask \"question\", gen bio --tone <recruiter|technical|concise>",
    "",
    "Keyboard: Tab autocomplete, Shift+Enter newline, Ctrl+L clear, Ctrl+R reverse search",
  ].join("\n");

const renderProjectsList = () =>
  PROJECTS.map((project) => {
    const slug = slugify(project.title) || String(project.id);
    const tags = (project.tags || []).slice(0, 3).join(", ");
    return `${project.id}. ${project.title} [${slug}]${tags ? ` - ${tags}` : ""}`;
  }).join("\n");

const resolveProject = (input) => {
  const key = String(input || "").trim().toLowerCase();
  if (!key) return null;

  return (
    PROJECTS.find((project) => String(project.id) === key) ||
    PROJECTS.find((project) => slugify(project.title) === key)
  );
};

const aiAsk = (question) => {
  const q = (question || "").toLowerCase();
  if (!q) return "ask: provide a question.";
  if (q.includes("project")) {
    return `Top projects: ${PROJECTS.slice(0, 3).map((p) => p.title).join(", ")}. Use 'projects show <id>' for details.`;
  }
  if (q.includes("skill")) {
    return `Core skills: ${SKILLS.slice(0, 6).map((s) => s.name).join(", ")}.`;
  }
  if (q.includes("contact")) {
    return CONTENT.social.map((item) => `${item.name}: ${item.link}`).join("\n");
  }
  return "AI mode: ask about projects, skills, or contact information.";
};

const generateBio = (tone) => {
  const cleanTone = (tone || "concise").toLowerCase();
  if (cleanTone === "recruiter") {
    return `${CONTENT.name} is an AI & Data Science engineer focused on shipping production-ready ML systems, from model design to deployment.`;
  }
  if (cleanTone === "technical") {
    return `${CONTENT.name} designs end-to-end ML platforms using Python ecosystems, deep learning frameworks, and scalable inference pipelines.`;
  }
  return `${CONTENT.name}: ${CONTENT.role}. Builds intelligent systems that solve real-world problems.`;
};

const getPathSuggestions = (fs, cwd, inputToken) => {
  const raw = inputToken || "";
  const slash = raw.lastIndexOf("/");
  const basePart = slash >= 0 ? raw.slice(0, slash + 1) : "";
  const partial = slash >= 0 ? raw.slice(slash + 1) : raw;
  const targetSegments = resolvePathSegments(basePart || ".", cwd);
  const targetNode = getNode(fs, targetSegments);
  if (!targetNode || targetNode.type !== "dir") return [];

  return Object.keys(targetNode.children)
    .filter((name) => name.startsWith(partial))
    .sort()
    .map((name) => {
      const suffix = targetNode.children[name].type === "dir" ? "/" : "";
      return `${basePart}${name}${suffix}`;
    });
};

const TerminalModal = ({ isOpen, onClose }) => {
  const initialState = useMemo(() => loadTerminalState(), []);

  const [fs, setFs] = useState(() => initialState.fs);
  const [cwd, setCwd] = useState(() => initialState.cwd);
  const [aliases, setAliases] = useState(() => initialState.aliases);
  const [shellTheme, setShellTheme] = useState(() => initialState.theme);
  const [profile, setProfile] = useState(() => initialState.profile);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState(defaultHistory());
  const [commandHistory, setCommandHistory] = useState(() => initialState.commandHistory);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [reverseHint, setReverseHint] = useState("");

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const theme = THEMES[shellTheme] || THEMES.minimal;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const payload = {
      fs,
      cwd,
      aliases,
      theme: shellTheme,
      profile,
      commandHistory,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [fs, cwd, aliases, shellTheme, profile, commandHistory]);

  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, reverseHint]);

  const suggestions = useMemo(() => {
    const trimmed = input.trimStart();
    if (!trimmed) {
      return [...Object.keys(aliases), ...COMMAND_SPECS].slice(0, 8);
    }

    const tokens = tokenize(trimmed);
    if (!tokens.length) return [];

    if (tokens.length === 1 && !trimmed.endsWith(" ")) {
      const pool = [...Object.keys(aliases), ...COMMAND_SPECS];
      return pool.filter((name) => name.startsWith(tokens[0])).slice(0, 8);
    }

    const lastToken = trimmed.endsWith(" ") ? "" : tokens[tokens.length - 1];
    return getPathSuggestions(fs, cwd, lastToken).slice(0, 8);
  }, [input, aliases, fs, cwd]);

  if (!isOpen) return null;

  const syncShellRc = (nextFs, nextAliases, nextProfile) => {
    const shellRcPath = [".shellrc"];
    writeFile(nextFs, shellRcPath, shellRcContent(nextAliases, nextProfile));
  };

  const appendEntry = (entries, text, type = "output") => {
    if (!text) return;
    entries.push({ type, text: String(text) });
  };

  const executeSegment = (context, segment, stdin) => {
    const { command, redirect } = parseRedirection(segment);
    if (!command) return { stdout: stdin || "", stderr: "", code: 0, redirect };

    const aliased = applyAlias(command, context.aliases);
    const tokens = tokenize(aliased);
    if (!tokens.length) return { stdout: "", stderr: "", code: 0, redirect };

    const [cmd, ...args] = tokens;
    const normalized = cmd.toLowerCase();
    const output = { stdout: "", stderr: "", code: 0, redirect };

    switch (normalized) {
      case "help": {
        output.stdout = commandHelp();
        return output;
      }
      case "pwd": {
        output.stdout = `/Users/guest/${context.cwd.join("/")}`.replace(/\/$/, "");
        return output;
      }
      case "whoami": {
        output.stdout = "guest";
        return output;
      }
      case "date": {
        output.stdout = new Date().toString();
        return output;
      }
      case "clear": {
        context.clear = true;
        return output;
      }
      case "exit": {
        context.exit = true;
        return output;
      }
      case "ls": {
        const { flags, rest } = parseFlags(args);
        const showAll = flags.has("a");
        const longView = flags.has("l");
        const targets = rest.length ? rest : ["."];
        const blocks = [];

        targets.forEach((target, index) => {
          const segments = resolvePathSegments(target, context.cwd);
          const node = getNode(context.fs, segments);

          if (!node) {
            blocks.push(`ls: cannot access '${target}': No such file or directory`);
            return;
          }

          if (node.type === "file") {
            blocks.push(target);
            return;
          }

          const names = Object.keys(node.children)
            .filter((name) => showAll || !name.startsWith("."))
            .sort();

          if (targets.length > 1) {
            blocks.push(`${target}:`);
          }

          if (longView) {
            blocks.push(
              ...names.map((name) => {
                const child = node.children[name];
                const typeFlag = child.type === "dir" ? "d" : "-";
                const size = child.type === "file" ? String((child.content || "").length).padStart(6, " ") : "   dir";
                return `${typeFlag}rw-r--r-- 1 guest guest ${size} ${name}${child.type === "dir" ? "/" : ""}`;
              })
            );
          } else {
            blocks.push(
              names
                .map((name) => `${name}${node.children[name].type === "dir" ? "/" : ""}`)
                .join("  ")
            );
          }

          if (index < targets.length - 1) blocks.push("");
        });

        output.stdout = blocks.filter((line) => line !== undefined).join("\n");
        return output;
      }
      case "cd": {
        const target = args[0] || "~";
        const nextSegments = resolvePathSegments(target, context.cwd);
        const node = getNode(context.fs, nextSegments);
        if (!node || node.type !== "dir") {
          output.stderr = `cd: no such directory: ${target}`;
          output.code = 1;
          return output;
        }
        context.cwd = nextSegments;
        return output;
      }
      case "cat": {
        if (!args.length) {
          output.stderr = "usage: cat <file> [file...]";
          output.code = 1;
          return output;
        }
        const chunks = [];
        for (const fileArg of args) {
          const fileSegments = resolvePathSegments(fileArg, context.cwd);
          const result = readFile(context.fs, fileSegments);
          if (!result.ok) {
            output.stderr = `cat: ${fileArg}: ${result.error}`;
            output.code = 1;
            return output;
          }
          chunks.push(result.content);
        }
        output.stdout = chunks.join("\n");
        return output;
      }
      case "mkdir": {
        if (!args.length) {
          output.stderr = "usage: mkdir <dir> [dir...]";
          output.code = 1;
          return output;
        }
        for (const dirArg of args) {
          const segments = resolvePathSegments(dirArg, context.cwd);
          const existing = getNode(context.fs, segments);
          if (existing) {
            output.stderr = `mkdir: cannot create directory '${dirArg}': File exists`;
            output.code = 1;
            return output;
          }
          ensureDir(context.fs, segments);
        }
        return output;
      }
      case "touch": {
        if (!args.length) {
          output.stderr = "usage: touch <file> [file...]";
          output.code = 1;
          return output;
        }
        for (const fileArg of args) {
          const segments = resolvePathSegments(fileArg, context.cwd);
          const result = writeFile(context.fs, segments, "", true);
          if (!result.ok) {
            output.stderr = `touch: ${fileArg}: ${result.error}`;
            output.code = 1;
            return output;
          }
        }
        return output;
      }
      case "echo": {
        output.stdout = args.join(" ");
        return output;
      }
      case "rm": {
        const { flags, rest } = parseFlags(args);
        const recursive = flags.has("r");
        if (!rest.length) {
          output.stderr = "usage: rm [-r] <path> [path...]";
          output.code = 1;
          return output;
        }
        for (const target of rest) {
          const segments = resolvePathSegments(target, context.cwd);
          const result = removePath(context.fs, segments, recursive);
          if (!result.ok) {
            output.stderr = `rm: ${target}: ${result.error}`;
            output.code = 1;
            return output;
          }
        }
        return output;
      }
      case "tree": {
        const target = args[0] || ".";
        const segments = resolvePathSegments(target, context.cwd);
        const node = getNode(context.fs, segments);
        if (!node || node.type !== "dir") {
          output.stderr = `tree: ${target}: No such directory`;
          output.code = 1;
          return output;
        }
        const base = target === "." ? toPromptPath(segments) : target;
        output.stdout = [base, ...listTree(node)].join("\n");
        return output;
      }
      case "find": {
        const searchBaseArg = args[0] && !args[0].startsWith("-") ? args[0] : ".";
        const needle = args.length > 1 ? args[1].toLowerCase() : "";
        const segments = resolvePathSegments(searchBaseArg, context.cwd);
        const node = getNode(context.fs, segments);

        if (!node || node.type !== "dir") {
          output.stderr = `find: ${searchBaseArg}: No such directory`;
          output.code = 1;
          return output;
        }

        const results = [];
        const basePath = `~/${segments.join("/")}`.replace(/\/$/, "");
        findPaths(node, basePath === "~" ? "~" : basePath, (name, fullPath) => {
          if (!needle) return true;
          return name.toLowerCase().includes(needle) || fullPath.toLowerCase().includes(needle);
        }, results);

        output.stdout = results.join("\n");
        return output;
      }
      case "grep": {
        if (!args.length) {
          output.stderr = "usage: grep <pattern> [file ...]";
          output.code = 1;
          return output;
        }

        const pattern = args[0];
        const regex = new RegExp(pattern, "i");

        const scanText = (text) =>
          text
            .split("\n")
            .filter((line) => regex.test(line))
            .join("\n");

        if (args.length === 1) {
          output.stdout = scanText(stdin || "");
          return output;
        }

        const lines = [];
        for (const fileArg of args.slice(1)) {
          const segments = resolvePathSegments(fileArg, context.cwd);
          const result = readFile(context.fs, segments);
          if (!result.ok) {
            output.stderr = `grep: ${fileArg}: ${result.error}`;
            output.code = 1;
            return output;
          }

          result.content.split("\n").forEach((line) => {
            if (regex.test(line)) {
              lines.push(`${fileArg}:${line}`);
            }
          });
        }

        output.stdout = lines.join("\n");
        return output;
      }
      case "history": {
        output.stdout = context.commandHistory
          .map((line, idx) => `${String(idx + 1).padStart(3, " ")}  ${line}`)
          .join("\n");
        return output;
      }
      case "alias": {
        if (!args.length) {
          output.stdout = Object.keys(context.aliases)
            .sort()
            .map((name) => `alias ${name}='${context.aliases[name]}'`)
            .join("\n");
          return output;
        }

        const raw = args.join(" ");
        const eqIndex = raw.indexOf("=");
        if (eqIndex === -1) {
          output.stderr = "usage: alias name='command'";
          output.code = 1;
          return output;
        }

        const name = raw.slice(0, eqIndex).trim();
        const value = raw.slice(eqIndex + 1).trim().replace(/^['"]|['"]$/g, "");

        if (!name || !/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(name)) {
          output.stderr = "alias: invalid alias name.";
          output.code = 1;
          return output;
        }

        context.aliases[name] = value;
        syncShellRc(context.fs, context.aliases, context.profile);
        output.stdout = `alias ${name}='${value}'`;
        return output;
      }
      case "unalias": {
        const name = args[0];
        if (!name) {
          output.stderr = "usage: unalias <name>";
          output.code = 1;
          return output;
        }
        if (!context.aliases[name]) {
          output.stderr = `unalias: ${name}: not found`;
          output.code = 1;
          return output;
        }
        delete context.aliases[name];
        syncShellRc(context.fs, context.aliases, context.profile);
        return output;
      }
      case "theme": {
        const sub = (args[0] || "list").toLowerCase();
        if (sub === "list") {
          output.stdout = Object.keys(THEMES).join("\n");
          return output;
        }
        if (sub === "set") {
          const next = (args[1] || "").toLowerCase();
          if (!THEMES[next]) {
            output.stderr = `theme: unknown theme '${next}'`;
            output.code = 1;
            return output;
          }
          context.theme = next;
          output.stdout = `theme set to ${next}`;
          return output;
        }
        output.stderr = "usage: theme list | theme set <name>";
        output.code = 1;
        return output;
      }
      case "profile": {
        const sub = (args[0] || "show").toLowerCase();
        if (sub === "show") {
          output.stdout = `profile: ${context.profile}`;
          return output;
        }
        if (sub === "set") {
          const next = (args[1] || "").toLowerCase();
          const allowed = ["builder", "research", "minimal"];
          if (!allowed.includes(next)) {
            output.stderr = `profile: choose one of ${allowed.join(", ")}`;
            output.code = 1;
            return output;
          }
          context.profile = next;
          syncShellRc(context.fs, context.aliases, context.profile);
          output.stdout = `profile set to ${next}`;
          return output;
        }
        output.stderr = "usage: profile show | profile set <name>";
        output.code = 1;
        return output;
      }
      case "config": {
        if ((args[0] || "show") !== "show") {
          output.stderr = "usage: config show";
          output.code = 1;
          return output;
        }
        output.stdout = [
          `profile=${context.profile}`,
          `theme=${context.theme}`,
          `cwd=${toPromptPath(context.cwd)}`,
          `aliases=${Object.keys(context.aliases).length}`,
        ].join("\n");
        return output;
      }
      case "projects": {
        const sub = (args[0] || "list").toLowerCase();
        if (sub === "list") {
          output.stdout = renderProjectsList();
          return output;
        }

        if (sub === "show" || sub === "open") {
          const key = args[1];
          const project = resolveProject(key);
          if (!project) {
            output.stderr = `projects ${sub}: project not found`;
            output.code = 1;
            return output;
          }

          if (sub === "open") {
            output.stdout = project.demo || project.github || "No link available.";
            return output;
          }

          output.stdout = [
            `id: ${project.id}`,
            `title: ${project.title}`,
            `tags: ${(project.tags || []).join(", ")}`,
            `description: ${project.description || ""}`,
            `demo: ${project.demo || "N/A"}`,
            `github: ${project.github || "N/A"}`,
          ].join("\n");
          return output;
        }

        output.stderr = "usage: projects list | projects show <id|slug> | projects open <id|slug>";
        output.code = 1;
        return output;
      }
      case "open": {
        const project = resolveProject(args[0]);
        if (!project) {
          output.stderr = "open: project not found";
          output.code = 1;
          return output;
        }
        output.stdout = project.demo || project.github || "No link available.";
        return output;
      }
      case "ask": {
        output.stdout = aiAsk(args.join(" "));
        return output;
      }
      case "gen": {
        const sub = (args[0] || "").toLowerCase();
        if (sub !== "bio") {
          output.stderr = "usage: gen bio --tone <recruiter|technical|concise>";
          output.code = 1;
          return output;
        }

        const toneFlagIndex = args.indexOf("--tone");
        const tone = toneFlagIndex >= 0 ? args[toneFlagIndex + 1] : "concise";
        output.stdout = generateBio(tone);
        return output;
      }
      default: {
        output.stderr = `zsh: command not found: ${normalized}`;
        output.code = 127;
        return output;
      }
    }
  };

  const executeLine = (rawLine) => {
    const line = rawLine.trim();
    if (!line) return;

    const guard = BLOCKED_PATTERNS.find((item) => item.pattern.test(line));
    const nextEntries = [...history, { type: "command", path: toPromptPath(cwd), text: rawLine }];

    if (guard) {
      appendEntry(nextEntries, `security: ${guard.message}`, "error");
      setHistory(nextEntries);
      return;
    }

    if (!commandHistory.length || commandHistory[commandHistory.length - 1] !== rawLine) {
      setCommandHistory((prev) => [...prev, rawLine]);
    }
    setHistoryIndex(-1);

    const context = {
      fs: cloneFs(fs),
      cwd: [...cwd],
      aliases: { ...aliases },
      theme: shellTheme,
      profile,
      commandHistory: [...commandHistory, rawLine],
      clear: false,
      exit: false,
    };

    const pipeline = splitOutsideQuotes(line, "|").filter(Boolean);
    let stdin = "";
    let lastResult = { stdout: "", stderr: "", code: 0 };

    for (const segment of pipeline) {
      const result = executeSegment(context, segment, stdin);
      lastResult = result;

      if (result.stderr) {
        appendEntry(nextEntries, result.stderr, "error");
      }

      if (result.redirect) {
        if (!result.redirect.path) {
          appendEntry(nextEntries, "redirection: missing target file", "error");
          lastResult.code = 1;
          break;
        }

        const targetSegments = resolvePathSegments(result.redirect.path, context.cwd);
        const write = writeFile(context.fs, targetSegments, result.stdout || "", result.redirect.append);
        if (!write.ok) {
          appendEntry(nextEntries, `redirection error: ${write.error}`, "error");
          lastResult.code = 1;
          break;
        }
        stdin = "";
      } else {
        stdin = result.stdout || "";
      }

      if (result.code !== 0) break;
    }

    if (stdin) {
      appendEntry(nextEntries, stdin, lastResult.code === 0 ? "output" : "error");
    }

    if (context.clear) {
      setHistory([]);
    } else {
      setHistory(nextEntries);
    }

    setFs(context.fs);
    setCwd(context.cwd);
    setAliases(context.aliases);
    setShellTheme(context.theme);
    setProfile(context.profile);

    if (context.exit) {
      onClose();
    }
  };

  const applyFirstSuggestion = () => {
    if (!suggestions.length) return;
    const chosen = suggestions[0];
    const trimmed = input.trimStart();
    const leadingSpaces = input.slice(0, input.length - trimmed.length);

    const tokens = tokenize(trimmed);
    if (!tokens.length) {
      setInput(`${leadingSpaces}${chosen}`);
      return;
    }

    if (tokens.length === 1 && !trimmed.endsWith(" ")) {
      setInput(`${leadingSpaces}${chosen} `);
      return;
    }

    const parts = trimmed.split(/\s+/);
    if (!trimmed.endsWith(" ")) {
      parts[parts.length - 1] = chosen;
    } else {
      parts.push(chosen);
    }
    setInput(`${leadingSpaces}${parts.join(" ")}`);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      executeLine(input);
      setInput("");
      return;
    }

    if (event.key === "Tab") {
      event.preventDefault();
      applyFirstSuggestion();
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!commandHistory.length) return;
      const next = Math.min(historyIndex + 1, commandHistory.length - 1);
      setHistoryIndex(next);
      setInput(commandHistory[commandHistory.length - 1 - next]);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (historyIndex <= 0) {
        setHistoryIndex(-1);
        setInput("");
        return;
      }
      const next = historyIndex - 1;
      setHistoryIndex(next);
      setInput(commandHistory[commandHistory.length - 1 - next]);
      return;
    }

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "l") {
      event.preventDefault();
      setHistory([]);
      return;
    }

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "r") {
      event.preventDefault();
      const query = input.trim();
      const match = [...commandHistory].reverse().find((line) =>
        query ? line.toLowerCase().includes(query.toLowerCase()) : true
      );
      if (match) {
        setInput(match);
        setReverseHint(`reverse-i-search: ${match}`);
      } else {
        setReverseHint("reverse-i-search: no match");
      }
      window.setTimeout(() => setReverseHint(""), 1600);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className={`w-full max-w-4xl overflow-hidden border-2 border-[#111111] font-mono text-sm ${theme.shell}`} style={{ borderRadius: 0 }}>
        <div className={`px-4 py-2 flex items-center gap-2 border-b ${theme.title}`}>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="w-3 h-3 bg-red-500 hover:bg-red-600 transition-colors"
              aria-label="Close terminal"
            />
            <span className="w-3 h-3 bg-yellow-500" />
            <span className="w-3 h-3 bg-green-500" />
          </div>
          <span className={`flex-1 text-center text-xs ${theme.hint}`}>
            guest@portfolio: {toPromptPath(cwd)} ({shellTheme})
          </span>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-200 border border-zinc-600 hover:border-zinc-400 p-0.5" aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <div
          className={`p-4 h-[560px] overflow-y-auto ${theme.body}`}
          onClick={() => inputRef.current?.focus()}
        >
          {history.map((entry, index) => (
            <div key={`${entry.type}-${index}`} className="mb-2">
              {entry.type === "command" ? (
                <div className="flex gap-2 whitespace-pre-wrap break-words">
                  <span className={theme.promptArrow}>➜</span>
                  <span className={theme.promptPath}>{entry.path}</span>
                  <span className={theme.command}>{entry.text}</span>
                </div>
              ) : (
                <pre
                  className={`ml-4 whitespace-pre-wrap break-words ${
                    entry.type === "error" ? "text-rose-400" : ""
                  }`}
                >
                  {entry.text}
                </pre>
              )}
            </div>
          ))}

          {reverseHint && <div className="ml-4 text-amber-300 mb-2">{reverseHint}</div>}

          <div className="flex gap-2 items-start mt-2">
            <span className={`mt-1 ${theme.promptArrow}`}>➜</span>
            <span className={`mt-1 ${theme.promptPath}`}>{toPromptPath(cwd)}</span>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none text-zinc-100 caret-zinc-100 resize-none min-h-[24px] max-h-40"
              rows={1}
              spellCheck="false"
              autoComplete="off"
              placeholder="Type a command (help)"
            />
          </div>

          {!!suggestions.length && (
            <div className="ml-11 mt-2 text-xs text-zinc-400 flex flex-wrap gap-2">
              {suggestions.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setInput((prev) => {
                      const trimmed = prev.trimStart();
                      if (!trimmed || tokenize(trimmed).length <= 1) return `${item} `;
                      const parts = trimmed.split(/\s+/);
                      parts[parts.length - 1] = item;
                      return parts.join(" ");
                    });
                    inputRef.current?.focus();
                  }}
                  className="px-2 py-1 bg-zinc-800/60 hover:bg-zinc-700/80 border border-zinc-700"
                >
                  {item}
                </button>
              ))}
            </div>
          )}

          <div className="ml-11 mt-3 text-[11px] text-zinc-500">
            Shift+Enter newline | Tab autocomplete | Ctrl+L clear | Ctrl+R reverse search
          </div>

          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
};

export default TerminalModal;
