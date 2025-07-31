"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckIcon, MinusIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ModifierGroup, ModifierOption } from "@/types/restaurant";
import { formatPrice } from "@/lib/utils/price";

export interface ModifierSelectorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  groups: ModifierGroup[];
  selectedModifiers: Record<string, string[]>;
  onModifierChange: (
    groupId: string,
    selectedIds: string[],
    clear?: boolean
  ) => void;
}

export function ModifierSelector({
  groups,
  selectedModifiers,
  onModifierChange,
  className,
  ...props
}: ModifierSelectorProps) {
  const isSelected = (groupId: string, optionId: string) => {
    return (
      selectedModifiers[groupId] &&
      selectedModifiers[groupId].includes(optionId)
    );
  };

  const handleOptionToggle = (
    group: ModifierGroup,
    optionId: string,
    isSelected: boolean
  ) => {
    const currentSelected = selectedModifiers[group.id] || [];
    let newSelection: string[];

    if (group.maxSelect === 1) {
      // For radio-like selection, replace the current selection
      newSelection = isSelected ? [] : [optionId];
    } else {
      // For checkbox-like selection, toggle the selection
      if (isSelected) {
        // Remove the option if already selected
        newSelection = currentSelected.filter((id) => id !== optionId);
      } else {
        // Add the option if not selected yet
        if (group.maxSelect && currentSelected.length >= group.maxSelect) {
          // If max selection reached, replace the first item
          newSelection = [...currentSelected.slice(1), optionId];
        } else {
          // Otherwise, add to selection
          newSelection = [...currentSelected, optionId];
        }
      }
    }

    onModifierChange(group.id, newSelection);
  };

  return (
    <div className={cn("space-y-6", className)} {...props}>
      {groups.map((group) => (
        <div key={group.id} className="space-y-3">
          <div>
            <h3 className="text-base font-medium">
              {group.name}
              {group.required && (
                <span className="ml-1 text-destructive">*</span>
              )}
            </h3>
            {group.description && (
              <p className="text-sm text-muted-foreground">
                {group.description}
              </p>
            )}
            {(group.minSelect || group.maxSelect) && (
              <p className="text-xs text-muted-foreground">
                {group.minSelect && group.minSelect > 0
                  ? `Select at least ${group.minSelect}`
                  : ""}
                {group.minSelect && group.maxSelect && " and "}
                {group.maxSelect ? `up to ${group.maxSelect}` : ""}
                {group.minSelect === 1 && group.maxSelect === 1
                  ? " option"
                  : " options"}
              </p>
            )}
          </div>

          <div className="space-y-2">
            {group.options.map((option) => (
              <div
                key={option.id}
                className={cn(
                  "flex items-center justify-between rounded-md border p-3 transition-colors",
                  isSelected(group.id, option.id) &&
                    "border-primary bg-primary/5",
                  option.available === false && "opacity-50"
                )}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{option.name}</span>
                    {option.price && Number(option.price) > 0 && (
                      <span className="text-muted-foreground">
                        +{formatPrice(option.price)}
                      </span>
                    )}
                  </div>
                  {option.description && (
                    <p className="text-sm text-muted-foreground">
                      {option.description}
                    </p>
                  )}
                </div>
                <div>
                  {group.maxSelect === 1 ? (
                    <div
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-full border",
                        isSelected(group.id, option.id)
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-input"
                      )}
                      onClick={() =>
                        option.available !== false &&
                        handleOptionToggle(
                          group,
                          option.id,
                          isSelected(group.id, option.id)
                        )
                      }
                    >
                      {isSelected(group.id, option.id) && (
                        <div className="h-2.5 w-2.5 rounded-full bg-primary-foreground" />
                      )}
                    </div>
                  ) : (
                    <div
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded border",
                        isSelected(group.id, option.id)
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-input"
                      )}
                      onClick={() =>
                        option.available !== false &&
                        handleOptionToggle(
                          group,
                          option.id,
                          isSelected(group.id, option.id)
                        )
                      }
                    >
                      {isSelected(group.id, option.id) && (
                        <CheckIcon className="h-3.5 w-3.5" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
