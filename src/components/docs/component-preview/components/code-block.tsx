"use client";

import * as React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { CopyButton } from "./copy-button";

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language = "tsx" }: CodeBlockProps) {
  return (
    <div className="relative">
      <CopyButton
        value={code}
        className="absolute right-4 top-4 text-zinc-50 hover:bg-zinc-700 hover:text-zinc-50"
      />
      <SyntaxHighlighter
        language={language}
        style={nightOwl}
        showLineNumbers={false}
        customStyle={{
          margin: 0,
          borderRadius: "0.375rem",
          background: "#011627",
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
        {code}
      </SyntaxHighlighter>
    </div>
  );
}