import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
    code: string;
    language?: string;
    filename?: string;
}

const CodeBlock = ({ code, language = "text", filename }: CodeBlockProps) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code.trim());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    return (
        <div className="my-6 overflow-hidden rounded-[14px] border border-md-outline/20 bg-md-surface-variant/20">
            <div className="flex items-center justify-between border-b border-md-outline/20 bg-transparent px-4 py-2.5">
                <span className="text-[13px] font-medium text-md-on-surface-variant font-mono">
                    {filename || language || 'text'}
                </span>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 rounded-md p-1.5 text-[12px] font-medium text-md-on-surface-variant hover:text-md-on-background transition-colors uppercase tracking-wide"
                    aria-label="Copy code"
                >
                    {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                    {copied ? "Copied" : "Copy"}
                </button>
            </div>
            
            <div className="overflow-x-auto p-4 pt-3 bg-transparent">
                <pre className="text-[14px] text-md-on-background font-mono leading-relaxed">
                    <code>{code.trim()}</code>
                </pre>
            </div>
        </div>
    );
};

export default CodeBlock;
