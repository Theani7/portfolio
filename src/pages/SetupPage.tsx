import PageWrapper from "../components/PageWrapper";
import Seo from "../components/Seo";
import CodeBlock from "../components/CodeBlock";
import { ExternalLink, Terminal, ChevronDown, Monitor, Cpu, Fingerprint, Type, Palette, Box } from "lucide-react";
import { motion } from "framer-motion";

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

const SetupPage = () => {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };
    
    const item = {
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
                className="mb-16 pt-8 md:pt-16"
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
                animate="show"
                className="mb-20"
            >
                <div className="border-b border-md-outline/20 pb-4 mb-6">
                    <h2 className="text-2xl font-bold text-md-on-background">Terminal Environment</h2>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 mb-8">
                    <motion.div variants={item} className="flex flex-col">
                        <h3 className="text-sm text-md-on-surface-variant mb-1">Operating System</h3>
                        <p className="font-medium text-lg text-md-on-surface">macOS</p>
                    </motion.div>
                    
                    <motion.div variants={item} className="flex flex-col">
                        <h3 className="text-sm text-md-on-surface-variant mb-1">Terminal Emulator</h3>
                        <a href="https://ghostty.org/" target="_blank" rel="noopener noreferrer" className="font-medium text-lg text-md-on-background hover:text-accent transition-colors underline underline-offset-4 decoration-md-outline/50 hover:decoration-accent inline-flex items-center gap-1.5 w-fit">
                            Ghostty <ExternalLink size={14} />
                        </a>
                    </motion.div>
                    
                    <motion.div variants={item} className="flex flex-col">
                        <h3 className="text-sm text-md-on-surface-variant mb-1">Shell</h3>
                        <a href="https://fishshell.com/" target="_blank" rel="noopener noreferrer" className="font-medium text-lg text-md-on-background hover:text-accent transition-colors underline underline-offset-4 decoration-md-outline/50 hover:decoration-accent inline-flex items-center gap-1.5 w-fit">
                            Fish <ExternalLink size={14} />
                        </a>
                    </motion.div>
                    
                    <motion.div variants={item} className="flex flex-col">
                        <h3 className="text-sm text-md-on-surface-variant mb-1">Prompt</h3>
                        <a href="https://starship.rs/" target="_blank" rel="noopener noreferrer" className="font-medium text-lg text-md-on-background hover:text-accent transition-colors underline underline-offset-4 decoration-md-outline/50 hover:decoration-accent inline-flex items-center gap-1.5 w-fit">
                            Starship <ExternalLink size={14} />
                        </a>
                    </motion.div>
                    
                    <motion.div variants={item} className="flex flex-col">
                        <h3 className="text-sm text-md-on-surface-variant mb-1">Theme</h3>
                        <p className="font-medium text-lg text-md-on-surface">Tokyo Night Storm</p>
                    </motion.div>
                    
                    <motion.div variants={item} className="flex flex-col">
                        <h3 className="text-sm text-md-on-surface-variant mb-1">Font</h3>
                        <a href="https://www.nerdfonts.com/" target="_blank" rel="noopener noreferrer" className="font-medium text-lg text-md-on-background hover:text-accent transition-colors underline underline-offset-4 decoration-md-outline/50 hover:decoration-accent inline-flex items-center gap-1.5 w-fit">
                            JetBrainsMono Nerd <ExternalLink size={14} />
                        </a>
                    </motion.div>
                    
                    <motion.div variants={item} className="flex flex-col">
                        <h3 className="text-sm text-md-on-surface-variant mb-1">Multiplexer</h3>
                        <a href="https://github.com/tmux/tmux" target="_blank" rel="noopener noreferrer" className="font-medium text-lg text-md-on-background hover:text-accent transition-colors underline underline-offset-4 decoration-md-outline/50 hover:decoration-accent inline-flex items-center gap-1.5 w-fit">
                            tmux <ExternalLink size={14} />
                        </a>
                    </motion.div>

                    <motion.div variants={item} className="flex flex-col">
                        <h3 className="text-sm text-md-on-surface-variant mb-1">Package Manager</h3>
                        <a href="https://brew.sh/" target="_blank" rel="noopener noreferrer" className="font-medium text-lg text-md-on-background hover:text-accent transition-colors underline underline-offset-4 decoration-md-outline/50 hover:decoration-accent inline-flex items-center gap-1.5 w-fit">
                            Homebrew <ExternalLink size={14} />
                        </a>
                    </motion.div>
                </div>
            </motion.section>

            <motion.section 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className="mb-20"
            >
                <div className="border-b border-md-outline/20 pb-4 mb-6">
                    <h2 className="text-2xl font-bold text-md-on-background">CLI Utilities</h2>
                </div>
                <CodeBlock code={cliUtilities} language="bash" filename="CLI Tools" />
            </motion.section>

            <motion.section 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className="mb-20"
            >
                <div className="border-b border-md-outline/20 pb-4 mb-6">
                    <h2 className="text-2xl font-bold text-md-on-background">Configurations</h2>
                </div>

                <div className="flex flex-col">
                    {[
                        { title: "Ghostty", code: ghosttyConfig, lang: "properties", file: "~/.config/ghostty/config" },
                        { title: "Fish Shell", code: fishConfig, lang: "fish", file: "~/.config/fish/config.fish" },
                        { title: "Starship Prompt", code: starshipConfig, lang: "toml", file: "~/.config/starship.toml" },
                        { title: "Git", code: gitConfig, lang: "bash", file: "~/.gitconfig" },
                        { title: "tmux", code: "set -g mouse on", lang: "bash", file: "~/.tmux.conf" }
                    ].map((config, i) => (
                        <details key={i} className="group border-b border-md-outline/20 last:border-b-0 py-4">
                            <summary className="flex cursor-pointer items-center justify-between list-none [&::-webkit-details-marker]:hidden font-bold text-[17px] text-md-on-surface hover:text-accent transition-colors">
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
