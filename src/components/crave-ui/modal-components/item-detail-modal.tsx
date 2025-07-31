"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X, Plus, Minus, Info } from "lucide-react";
import Image from "next/image";

import type { MenuItem } from "@/types/restaurant";
import { PriceDisplay, RatingDisplay } from "@/components/ui/common";
import { ModifierSelector } from "../form-components/modifier-selector";
import { QuantitySelector } from "@/components/ui/quantity-selector";

interface ItemDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity: number, modifiers?: any) => void;
  item: MenuItem;
}

export default function ItemDetailModal({
  isOpen,
  onClose,
  onAddToCart,
  item,
}: ItemDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedModifiers, setSelectedModifiers] = useState<
    Record<string, string[]>
  >({});
  const [showNutrition, setShowNutrition] = useState(false);

  // Calculate total price including modifiers
  const calculateTotalPrice = () => {
    let total = item.price * quantity;

    if (item.modifiers) {
      Object.entries(selectedModifiers).forEach(([groupId, optionIds]) => {
        const group = item.modifiers?.find((g) => g.id === groupId);
        if (group) {
          optionIds.forEach((optionId) => {
            const option = group.options.find((o) => o.id === optionId);
            if (option?.price) {
              total += option.price * quantity;
            }
          });
        }
      });
    }

    return total;
  };

  const handleAddToCart = () => {
    onAddToCart(item, quantity, selectedModifiers);
    onClose();
  };

  const handleModifierChange = (groupId: string, selectedIds: string[]) => {
    setSelectedModifiers((prev) => ({
      ...prev,
      [groupId]: selectedIds,
    }));
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setQuantity(1);
      setSelectedModifiers({});
      setShowNutrition(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="item-detail-title"
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative bg-background rounded-lg shadow-lg w-full max-w-2xl mx-4 h-[90vh] border flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b">
          <div className="flex items-center justify-between p-4">
            <h2
              id="item-detail-title"
              className="text-lg font-semibold text-foreground"
            >
              Item Details
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Close"
              className="h-8 w-8"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Item Image */}
            {item.imageUrl && (
              <div className="relative w-full h-64 rounded-lg overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={item.imageAlt || item.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
                {item.badge && (
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-primary text-primary-foreground">
                      {item.badge}
                    </Badge>
                  </div>
                )}
              </div>
            )}

            {/* Item Info */}
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-foreground">
                  {item.name}
                </h3>
                {item.description && (
                  <p className="text-muted-foreground mt-2">
                    {item.description}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <PriceDisplay price={item.price} size="2xl" />
                {(item.rating || item.reviewCount) && (
                  <RatingDisplay
                    rating={item.rating}
                    reviewCount={item.reviewCount}
                  />
                )}
              </div>
            </div>

            {/* Nutritional Info */}
            {item.nutritionalInfo && (
              <div className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNutrition(!showNutrition)}
                  className="flex items-center gap-2"
                >
                  <Info className="w-4 h-4" />
                  Nutritional Information
                </Button>

                {showNutrition && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {item.nutritionalInfo.calories && (
                        <div className="flex justify-between">
                          <span>Calories:</span>
                          <span className="font-medium">
                            {item.nutritionalInfo.calories}
                          </span>
                        </div>
                      )}
                      {item.nutritionalInfo.protein && (
                        <div className="flex justify-between">
                          <span>Protein:</span>
                          <span className="font-medium">
                            {item.nutritionalInfo.protein}g
                          </span>
                        </div>
                      )}
                      {item.nutritionalInfo.carbs && (
                        <div className="flex justify-between">
                          <span>Carbs:</span>
                          <span className="font-medium">
                            {item.nutritionalInfo.carbs}g
                          </span>
                        </div>
                      )}
                      {item.nutritionalInfo.fat && (
                        <div className="flex justify-between">
                          <span>Fat:</span>
                          <span className="font-medium">
                            {item.nutritionalInfo.fat}g
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Modifiers */}
            {item.modifiers && item.modifiers.length > 0 && (
              <div className="space-y-4">
                <Separator />
                <h4 className="text-lg font-semibold">Customize Your Order</h4>
                <ModifierSelector
                  groups={item.modifiers}
                  selectedModifiers={selectedModifiers}
                  onModifierChange={handleModifierChange}
                />
              </div>
            )}

            {/* Quantity Selection */}
            <div className="space-y-4">
              <Separator />
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold">Quantity</h4>
                <QuantitySelector
                  value={quantity}
                  onChange={setQuantity}
                  min={1}
                  max={10}
                />
              </div>
            </div>

            {/* Total Price Summary */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Total</h4>
                  <p className="text-sm text-muted-foreground">
                    {quantity} × {item.name}
                  </p>
                </div>
                <PriceDisplay price={calculateTotalPrice()} size="xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleAddToCart} className="flex-1">
              Add to Cart - ${calculateTotalPrice().toFixed(2)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
