"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { BundleMenu } from "@/types/menus";
import { Check, ChevronDown, Clock, UtensilsCrossed } from "lucide-react";

type MenuSwitcherProps = {
  menus: BundleMenu[];
  activeMenuId?: string;
  onChange?: (menuId: string) => void;
};

const FALLBACK_IMAGE = "/images/sushi/menu-card.jpg";

function resolveMenuLabel(menu: BundleMenu, index: number) {
  const label = menu?.name?.trim();
  if (label && label.length > 0) return label;
  return `Menu ${index + 1}`;
}

function resolveMenuHours(menu: BundleMenu) {
  const time = menu?.time?.trim();
  const timeRange = menu?.timeRange?.trim?.();
  return time || timeRange || "Hours unavailable";
}

function resolveMenuImage(menu: BundleMenu) {
  return menu?.imageUrl || menu?.image || menu?.thumbnailUrl || FALLBACK_IMAGE;
}

export function MenuSwitcher({ menus, activeMenuId, onChange }: MenuSwitcherProps) {
  const items = useMemo(() => menus ?? [], [menus]);
  const [open, setOpen] = useState(false);

  if (!items.length) {
    return null;
  }

  const defaultMenuId = items[0]?.id ?? "";
  const selectedId = items.some((menu) => menu.id === activeMenuId)
    ? activeMenuId!
    : defaultMenuId;
  const selectedMenu = items.find((menu) => menu.id === selectedId) ?? items[0];

  const menuLabel = resolveMenuLabel(selectedMenu, 0);
  const menuHours = resolveMenuHours(selectedMenu);
  const menuImage = resolveMenuImage(selectedMenu);

  const handleSelect = (menuId: string) => {
    if (menuId === selectedId) {
      setOpen(false);
      return;
    }
    onChange?.(menuId);
    setOpen(false);
  };

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-xs font-medium uppercase tracking-[0.3em] text-textmuted">
        <span className="flex items-center gap-2">
          <UtensilsCrossed className="h-4 w-4" />
          Menus
        </span>
        <span className="text-[10px] tracking-[0.25em] text-textmuted/70">
          {items.length} {items.length === 1 ? "option" : "options"}
        </span>
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="flex h-auto w-full items-center justify-between gap-3 rounded-xl border-borderdefault bg-backgrounddefault px-4 py-3 text-left shadow-sm hover:bg-backgroundmuted"
          >
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="relative hidden h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-backgroundmuted sm:block">
                <Image
                  src={menuImage}
                  alt={menuLabel}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold tracking-wide text-textdefault">
                  {menuLabel}
                </p>
                <p className="mt-1 flex items-center gap-2 text-xs text-textmuted">
                  <Clock className="h-3.5 w-3.5" />
                  <span className="truncate">{menuHours}</span>
                </p>
              </div>
            </div>

            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`}
            />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className="w-[var(--radix-popover-trigger-width)] min-w-[280px] max-w-[340px] overflow-hidden rounded-xl border border-borderdefault bg-backgrounddefault p-0 shadow-xl"
        >
          <Command>
            <CommandList className="max-h-[60vh]">
              <CommandEmpty>No menus available.</CommandEmpty>
              <CommandGroup>
                {items.map((menu, index) => {
                  const label = resolveMenuLabel(menu, index);
                  const timeWindow = resolveMenuHours(menu);
                  const imageSrc = resolveMenuImage(menu);
                  const isSelected = menu.id === selectedId;

                  return (
                    <CommandItem
                      key={menu.id}
                      value={menu.id}
                      onSelect={() => handleSelect(menu.id)}
                      className="flex items-start gap-3 px-3 py-3 text-sm"
                    >
                      <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-backgroundmuted">
                        <Image
                          src={imageSrc}
                          alt={label}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>

                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <span className="truncate font-medium text-textdefault">{label}</span>
                          {isSelected && <Check className="mt-0.5 h-4 w-4 text-backgroundprimary" />}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-textmuted">
                          <Clock className="h-3 w-3" />
                          <span className="truncate">{timeWindow}</span>
                        </div>

                        {menu.description && (
                          <p className="line-clamp-2 text-xs text-textmuted/80">
                            {menu.description}
                          </p>
                        )}
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
