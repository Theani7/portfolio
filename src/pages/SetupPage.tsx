import PageWrapper from "../components/PageWrapper";
import Seo from "../components/Seo";
import CodeBlock from "../components/CodeBlock";
import GridSectionHeader from "../components/GridSectionHeader";
import { ExternalLink, ChevronDown, Monitor, Terminal, Cpu, Fingerprint, Type, Palette, Box, Package } from "lucide-react";
import { motion, type Variants } from "framer-motion";

const ghosttyConfig = `theme = Tokyo Night Storm

font-family = JetBrainsMono Nerd Font
font-size = 15

background-opacity = 0.95
background-blur-radius = 20

window-padding-x = 8
window-padding-y = 8

scrollback-limit = 10000000

cursor-style = block

macos-option-as-alt = true

shell-integration = detect

copy-on-select = false

confirm-close-surface = false

window-save-state = always

clipboard-read = allow
clipboard-write = allow`;

const fishConfig = `starship init fish | source
zoxide init fish | source

set -gx EDITOR nvim
set -gx VISUAL nvim

fish_vi_key_bindings

alias ls="eza --icons"
alias ll="eza -lah --icons"
alias la="eza -a --icons"
alias lt="eza --tree --level=2 --icons"

alias cat="bat"
alias grep="rg"
alias find="fd"

alias vim="nvim"

alias gs="git status"
alias ga="git add"
alias gc="git commit"
alias gp="git push"
alias gl="git log --oneline --graph --decorate"

alias c="clear"
alias ..="cd .."
alias ...="cd ../.."`;

const starshipConfig = `add_newline = true

format = """
$directory\\
$git_branch\\
$git_status\\
$nodejs\\
$python\\
$golang\\
$rust\\
$docker_context\\
$cmd_duration\\
$character
"""

[directory]
truncate_to_repo = false
style = "blue"

[git_branch]
symbol = " "

[character]
success_symbol = "[❯](green)"
error_symbol = "[❯](red)"

[cmd_duration]
min_time = 500`;

const gitConfig = `git config --global core.pager delta
git config --global interactive.diffFilter "delta --color-only"
git config --global delta.navigate true
git config --global merge.conflictstyle zdiff3`;

const cliUtilities = `eza          # Modern ls
bat          # Better cat
ripgrep (rg) # Fast text search
fd           # Fast file search
fzf          # Fuzzy finder
zoxide       # Smart directory navigation
lazygit      # Terminal Git UI
git-delta    # Enhanced git diff
btop         # System monitor
jq           # JSON processor
curl         # HTTP client
wget         # File downloader`;

const environment = [
    { label: "Operating System", value: "macOS", Icon: Monitor },
    { label: "Terminal Emulator", value: "Ghostty", href: "https://ghostty.org/", Icon: Terminal },
    { label: "Shell", value: "Fish", href: "https://fishshell.com/", Icon: Cpu },
    { label: "Prompt", value: "Starship", href: "https://starship.rs/", Icon: Fingerprint },
    { label: "Theme", value: "Tokyo Night Storm", Icon: Palette },
    { label: "Font", value: "JetBrainsMono Nerd", href: "https://www.nerdfonts.com/", Icon: Type },
    { label: "Multiplexer", value: "tmux", href: "https://github.com/tmux/tmux", Icon: Box },
    { label: "Package Manager", value: "Homebrew", href: "https://brew.sh/", Icon: Package },
];

const SetupPage = () => {
    const container: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };
    
    const item: Variants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    return (
        <PageWrapper>
            <Seo
                title="My Setup | Anil Paneru"
                description="A detailed overview of my development environment, terminal configuration, and CLI tools."
                path="/setup"
            />
            
            <motion.div 
                className="mb-12 sm:mb-14 pt-8 md:pt-16"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
            >
                <div className="border-b border-md-outline/20 pb-6 mb-8">
                    <h1 className="text-3xl md:text-4xl font-display font-bold text-md-on-background tracking-tight mb-4">
                        My Setup
                    </h1>
                    <p className="text-[15px] sm:text-base text-md-on-surface-variant leading-relaxed">
                        A comprehensive look at my development environment. I spend a lot of time in the terminal, so I've optimized it for speed, aesthetics, and efficiency.
                    </p>
                </div>
            </motion.div>

            <motion.section
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                className="mb-12 sm:mb-14"
            >
                <GridSectionHeader title="Terminal Environment" />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {environment.map(({ label, value, href, Icon }) => (
                        <motion.div
                            key={label}
                            variants={item}
                            className="flex items-start gap-3 rounded-xl border border-md-outline/20 bg-md-surface-variant/15 p-4"
                        >
                            <Icon size={16} className="text-accent shrink-0 mt-0.5" aria-hidden="true" />
                            <div className="min-w-0">
                                <p className="mono text-md-on-surface-variant">{label}</p>
                                {href ? (
                                    <a
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-medium text-md-on-background hover:text-accent transition-colors underline underline-offset-4 decoration-md-outline/50 hover:decoration-accent"
                                    >
                                        {value} <ExternalLink size={12} className="shrink-0" />
                                    </a>
                                ) : (
                                    <p className="mt-1.5 text-sm font-medium text-md-on-background">{value}</p>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            <motion.section 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className="mb-12 sm:mb-14"
            >
                <GridSectionHeader title="CLI Utilities" />
                <CodeBlock code={cliUtilities} language="bash" filename="CLI Tools" />
            </motion.section>

            <motion.section 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className="mb-12 sm:mb-14"
            >
                <GridSectionHeader title="Configurations" />

                <div className="flex flex-col">
                    {[
                        { title: "Ghostty", code: ghosttyConfig, lang: "properties", file: "~/.config/ghostty/config" },
                        { title: "Fish Shell", code: fishConfig, lang: "fish", file: "~/.config/fish/config.fish" },
                        { title: "Starship Prompt", code: starshipConfig, lang: "toml", file: "~/.config/starship.toml" },
                        { title: "Git", code: gitConfig, lang: "bash", file: "~/.gitconfig" },
                        { title: "tmux", code: "set -g mouse on", lang: "bash", file: "~/.tmux.conf" }
                    ].map((config, i) => (
                        <details key={i} className="group border-b border-md-outline/20 last:border-b-0 py-4">
                            <summary className="flex cursor-pointer items-center justify-between list-none [&::-webkit-details-marker]:hidden [&::-moz-details-marker]:hidden font-bold text-[17px] text-md-on-surface-variant hover:text-accent transition-colors">
                                {config.title}
                                <ChevronDown size={20} className="text-md-on-surface-variant transition-transform duration-300 group-open:rotate-180" />
                            </summary>
                            <div className="pt-4">
                                <CodeBlock code={config.code} language={config.lang} filename={config.file} />
                            </div>
                        </details>
                    ))}
                </div>
            </motion.section>
        </PageWrapper>
    );
};

export default SetupPage;
