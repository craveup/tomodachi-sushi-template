"use client";

import * as React from "react";
import { Copy } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/cjs/styles/prism";

import { cn } from "../../lib/utils";
import { Button } from "@/components/ui/button";

interface CodeBlockProps {
  code: string;
  language: string;
  filename?: string;
  highlightLines?: number[];
  showLineNumbers?: boolean;
  theme?:
    | "github-dark"
    | "github-light"
    | "dracula"
    | "nord"
    | "slack-dark"
    | "slack-ochin"
    | "material-theme";
}

export function CodeBlock({
  code,
  language,
  filename,
  highlightLines = [],
  showLineNumbers = false,
  theme = "github-dark",
}: CodeBlockProps) {
  // Ensure code is a string
  const codeString =
    typeof code === "string" ? code : JSON.stringify(code, null, 2);
  const [isCopied, setIsCopied] = React.useState(false);

  const copyToClipboard = React.useCallback(async () => {
    if (!codeString) return;

    try {
      await navigator.clipboard.writeText(codeString);
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy code", err);
    }
  }, [codeString]);

  // Map our language prop to languages that Prism supports
  const getLanguage = (lang: string): string => {
    const langMap: Record<string, string> = {
      js: "javascript",
      ts: "typescript",
      jsx: "javascript",
      tsx: "typescript",
      sh: "bash",
      zsh: "bash",
      // Add more mappings as needed
    };

    return langMap[lang] || lang;
  };

  // Detect if it's a shell command
  let detectedLanguage = getLanguage(language);
  if (language === "text" || language === "bash" || language === "sh") {
    if (
      codeString.trim().startsWith("$") ||
      codeString.trim().startsWith("npm") ||
      codeString.trim().startsWith("npx") ||
      codeString.trim().startsWith("yarn") ||
      codeString.trim().startsWith("pnpm") ||
      codeString.trim().match(/^[a-z]+\s+/)
    ) {
      detectedLanguage = "bash";
    }
  }

  return (
    <div className="relative group">
      {filename && (
        <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800 rounded-t-lg">
          <p className="font-mono text-xs text-zinc-400">{filename}</p>
          <div className="text-xs font-mono uppercase text-zinc-400">
            {language}
          </div>
        </div>
      )}

      <div
        className={cn(
          "relative font-mono text-sm rounded-lg overflow-hidden",
          filename && "rounded-t-none"
        )}
      >
        <Button
          size="icon"
          variant="ghost"
          onClick={copyToClipboard}
          className="absolute right-3 top-3 z-10 h-6 w-6 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Copy className="h-3.5 w-3.5" />
          <span className="sr-only">{isCopied ? "Copied" : "Copy code"}</span>
        </Button>

        <SyntaxHighlighter
          language={detectedLanguage}
          style={nightOwl}
          showLineNumbers={showLineNumbers}
          wrapLines={true}
          lineProps={(lineNumber: number) => {
            const style = { display: "block" };
            if (highlightLines.includes(lineNumber)) {
              return {
                style: {
                  ...style,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              };
            }
            return { style };
          }}
          PreTag="div"
          customStyle={{
            backgroundColor: "#011627",
            borderRadius: "0.375rem",
            margin: "0",
            padding: "0",
            fontSize: "0.875rem",
            lineHeight: 1.5,
            maxHeight: "350px",
            overflow: "auto",
          }}
          codeTagProps={{
            style: {
              display: "block",
              fontFamily:
                "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
              padding: "1rem",
            },
          }}
        >
          {codeString}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
