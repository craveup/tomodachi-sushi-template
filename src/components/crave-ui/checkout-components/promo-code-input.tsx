"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

import { TagIcon, XIcon, LoaderIcon, CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PromoCode {
  id: string;
  code: string;
  type: "percentage" | "fixed" | "free-shipping" | "bogo" | "item-discount";
  value: number;
  description: string;
  discount: number;
  expiresAt?: Date;
  minOrderValue?: number;
  maxDiscount?: number;
  usageCount: number;
  maxUsage?: number;
  isFirstTimeOnly?: boolean;
  applicableItems?: string[];
}

export interface PromoCodeInputProps
  extends React.HTMLAttributes<HTMLDivElement> {
  onSubmit: (code: string) => Promise<void>;
  onRemove: () => void;
  appliedCode?: PromoCode | null;
  isValidating?: boolean;
  placeholder?: string;
  maxLength?: number;
  autoApply?: boolean;
  showSuggestions?: boolean;
  availableCodes?: string[];
  error?: string;
  variant?: "default" | "inline" | "auto-apply";
  debounceMs?: number;
  disabled?: boolean;
}

export function PromoCodeInput({
  onSubmit,
  onRemove,
  appliedCode,
  isValidating = false,
  placeholder = "Enter promo code",
  maxLength = 50,
  autoApply = false,
  showSuggestions = false,
  availableCodes = [],
  error,
  variant = "default",
  debounceMs = 300,
  disabled = false,
  className,
  ...props
}: PromoCodeInputProps) {
  const [code, setCode] = React.useState("");
  const [isApplying, setIsApplying] = React.useState(false);
  const [localError, setLocalError] = React.useState<string | null>(null);
  const [showSuggestionsDropdown, setShowSuggestionsDropdown] =
    React.useState(false);

  const debounceRef = React.useRef<NodeJS.Timeout>();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const currentError = error || localError;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || isApplying || disabled) return;

    setIsApplying(true);
    setLocalError(null);

    try {
      await onSubmit(code.trim().toUpperCase());
      setCode("");
      setShowSuggestionsDropdown(false);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Invalid promo code");
    } finally {
      setIsApplying(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCode = e.target.value.slice(0, maxLength);
    setCode(newCode);
    setLocalError(null);

    if (autoApply && newCode.length > 2) {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        handleAutoApply(newCode);
      }, debounceMs);
    }

    if (showSuggestions && newCode.length > 0) {
      setShowSuggestionsDropdown(true);
    } else {
      setShowSuggestionsDropdown(false);
    }
  };

  const handleAutoApply = async (codeToApply: string) => {
    if (!codeToApply.trim() || isApplying) return;

    setIsApplying(true);
    setLocalError(null);

    try {
      await onSubmit(codeToApply.trim().toUpperCase());
      setCode("");
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Invalid promo code");
    } finally {
      setIsApplying(false);
    }
  };

  const handleSuggestionSelect = (suggestedCode: string) => {
    setCode(suggestedCode);
    setShowSuggestionsDropdown(false);
    inputRef.current?.focus();
  };

  const handleRemove = () => {
    onRemove();
    setCode("");
    setLocalError(null);
  };

  const filteredSuggestions = React.useMemo(() => {
    if (!code || !showSuggestions) return [];
    return availableCodes.filter(
      (availableCode) =>
        availableCode.toLowerCase().includes(code.toLowerCase()) &&
        availableCode.toLowerCase() !== code.toLowerCase()
    );
  }, [code, availableCodes, showSuggestions]);

  React.useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  if (appliedCode) {
    return (
      <div className={cn("space-y-2", className)} {...props}>
        <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950">
          <div className="flex items-center gap-2">
            <CheckIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-green-900 dark:text-green-100">
                  {appliedCode.code}
                </span>
                <span className="text-sm text-green-700 dark:text-green-300">
                  -
                  {appliedCode.discount < 1
                    ? `${(appliedCode.discount * 100).toFixed(0)}%`
                    : `$${appliedCode.discount.toFixed(2)}`}
                </span>
              </div>
              <div className="text-sm text-green-700 dark:text-green-300">
                {appliedCode.description}
              </div>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="h-8 w-8 p-0 text-green-700 hover:bg-green-100 hover:text-green-900 dark:text-green-300 dark:hover:bg-green-900 dark:hover:text-green-100"
            disabled={disabled}
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)} {...props}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <div className="absolute left-2 top-0 bottom-0 flex items-center">
            <TagIcon className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={code}
            onChange={handleCodeChange}
            placeholder={placeholder}
            maxLength={maxLength}
            disabled={disabled || isApplying}
            className={cn(
              "w-full rounded-md border border-input bg-background py-2 pl-12 pr-20 px-8 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              currentError &&
                "border-destructive focus-visible:ring-destructive",
              variant === "inline" && "py-1.5"
            )}
          />
          <div className="absolute mt-2 right-0 top-1/2 -translate-y-1/2">
            <Button
              type="submit"
              size="sm"
              disabled={!code.trim() || isApplying || disabled}
              className="h-8 px-3"
            >
              {isApplying ? (
                <LoaderIcon className="h-3 w-3 animate-spin" />
              ) : (
                "Apply"
              )}
            </Button>
          </div>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestionsDropdown && filteredSuggestions.length > 0 && (
          <div className="absolute top-full z-10 mt-1 w-full rounded-md border bg-background shadow-lg">
            <div className="max-h-40 overflow-y-auto">
              {filteredSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleSuggestionSelect(suggestion)}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-accent focus:bg-accent focus:outline-none"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </form>

      {currentError && (
        <div className="text-sm text-destructive">{currentError}</div>
      )}

      {variant === "auto-apply" && (
        <div className="text-xs text-muted-foreground pt-10 text-center">
          Codes will be applied automatically as you type
        </div>
      )}
    </div>
  );
}
