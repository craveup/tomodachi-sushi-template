"use client";

import * as React from "react";
import { Copy } from "lucide-react";

import { cn } from "../../lib/utils";
import { Button } from "@/components/ui/button";

interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  expandButtonTitle?: string;
  language?: string;
  copyable?: boolean;
  code?: string;
}

export function CodeBlockWrapper({
  expandButtonTitle = "View Code",
  language,
  copyable = true,
  code,
  className,
  children,
  ...props
}: CodeBlockProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isCopied, setIsCopied] = React.useState(false);

  const copyToClipboard = React.useCallback(async () => {
    if (!code) return;

    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy code", err);
    }
  }, [code]);

  const contentToDisplay = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      if (child.type === "pre") {
        const childProps = child.props as { className?: string } || {};
        return React.cloneElement(child as React.ReactElement<any>, {
          ...childProps,
          className: cn(
            "rounded-md font-mono text-sm my-0",
            childProps.className
          ),
        });
      }
    }
    return child;
  });

  return (
    <div className="relative">
      <div
        className={cn(
          "relative overflow-hidden rounded-md bg-black text-white",
          !isExpanded && "max-h-[350px]",
          className
        )}
        {...props}
      >
        {copyable && (
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-4 top-3 z-10 h-6 w-6 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
            onClick={copyToClipboard}
          >
            <Copy className="h-3.5 w-3.5" />
            <span className="sr-only">Copy code</span>
          </Button>
        )}

        {language && (
          <div className="absolute right-12 top-3 z-10 text-xs font-mono uppercase text-zinc-500">
            {language}
          </div>
        )}

        <div
          className={cn(
            "overflow-auto p-4 [&_pre]:my-0 [&_pre]:max-h-[650px] [&_code]:text-sm",
            !isExpanded && "mask-bottom"
          )}
        >
          {contentToDisplay}
        </div>
      </div>

      {!isExpanded && (
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-center bg-gradient-to-t from-black/90 to-transparent pt-12 pb-4">
          <Button
            variant="secondary"
            className="h-8 text-xs"
            onClick={() => setIsExpanded(true)}
          >
            {expandButtonTitle}
          </Button>
        </div>
      )}

      {isExpanded && (
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-center bg-gradient-to-t from-black/10 pt-4 pb-4">
          <Button
            variant="secondary"
            className="h-8 text-xs"
            onClick={() => setIsExpanded(false)}
          >
            Collapse
          </Button>
        </div>
      )}
    </div>
  );
}
