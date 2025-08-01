"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../tabs";
import { Label } from "../label";
import { RadioGroup, RadioGroupItem } from "../radio-group";
import { Checkbox } from "../checkbox";
import { AlertTriangle, Check } from "lucide-react";
import { Badge } from "../badge";
import { Card } from "../card";
import { ModifierSelector } from "@/components/crave-ui/form-components/modifier-selector";
import { cn } from "@/lib/utils";

interface ModifierOption {
  id: string;
  name: string;
  price?: number | ((context: PricingContext) => number);
  isDefault?: boolean;
  description?: string;
  available?: boolean;
  maxQuantity?: number;
  popular?: boolean;
  calories?: number;
  supportsSplit?: boolean;
  splitOptions?: SplitOption[];
}

interface SplitOption {
  id: string;
  name: string;
  label: string;
}

interface ModifierGroup {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  type?: "radio" | "checkbox" | "counter";
  required?: boolean;
  minSelections?: number;
  maxSelections?: number;
  minSelect?: number;
  maxSelect?: number;
  options: ModifierOption[];
  allowsSplit?: boolean;
  splitType?: "half" | "quarter" | "custom";
}

interface ModifierSelection {
  optionId: string;
  quantity?: number;
  splitApplication?: "left" | "right" | "whole";
}

interface PricingContext {
  baseItemPrice: number;
  baseItemSize: string;
  selectedModifiers: Record<string, ModifierSelection[]>;
  itemQuantity: number;
}

// Helper function to get the actual price from a modifier option
const getModifierPrice = (
  option: ModifierOption,
  context?: PricingContext
): number => {
  if (typeof option.price === "function" && context) {
    return option.price(context);
  }
  return typeof option.price === "number" ? option.price : 0;
};

// Radio Button Variant (Single Selection)
function RadioModifierSelector({
  group,
  value,
  onChange,
}: {
  group: ModifierGroup;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{group.title}</h3>
          {group.required && (
            <Badge
              variant="outline"
              className="text-orange-600 border-orange-200"
            >
              <AlertTriangle className="w-3 h-3 mr-1" />
              Required
            </Badge>
          )}
        </div>
        {group.description && (
          <p className="text-sm text-muted-foreground">{group.description}</p>
        )}
      </div>

      <RadioGroup value={value} onValueChange={onChange}>
        {group.options.map((option) => (
          <div
            key={option.id}
            className={cn(
              "flex items-start space-x-3 p-4 border rounded-lg transition-colors",
              option.available === false
                ? "opacity-50"
                : "hover:bg-accent cursor-pointer",
              value === option.id && "border-primary bg-primary/5"
            )}
          >
            <RadioGroupItem
              value={option.id}
              id={`${group.id}-${option.id}`}
              disabled={option.available === false}
              className="mt-0.5"
            />
            <Label
              htmlFor={`${group.id}-${option.id}`}
              className="flex-1 cursor-pointer space-y-1"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{option.name}</span>
                  {option.popular && (
                    <Badge variant="secondary" className="text-xs">
                      Popular
                    </Badge>
                  )}
                  {option.isDefault && (
                    <Badge variant="outline" className="text-xs">
                      Default
                    </Badge>
                  )}
                </div>
                {option.price !== undefined && (
                  <span className="font-medium text-sm">
                    {getModifierPrice(option) > 0
                      ? `+$${getModifierPrice(option).toFixed(2)}`
                      : "Included"}
                  </span>
                )}
              </div>
              {option.description && (
                <p className="text-sm text-muted-foreground">
                  {option.description}
                </p>
              )}
              {option.calories && (
                <p className="text-xs text-muted-foreground">
                  {option.calories} cal
                </p>
              )}
              {option.available === false && (
                <p className="text-xs text-destructive">
                  Currently unavailable
                </p>
              )}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}

// Checkbox Variant (Multiple Selection)
function CheckboxModifierSelector({
  group,
  values,
  onChange,
}: {
  group: ModifierGroup;
  values: string[];
  onChange: (values: string[]) => void;
}) {
  const handleToggle = (optionId: string, checked: boolean) => {
    if (checked) {
      if (group.maxSelections && values.length >= group.maxSelections) {
        return; // Don't add if max reached
      }
      onChange([...values, optionId]);
    } else {
      onChange(values.filter((v) => v !== optionId));
    }
  };

  const isMaxReached = group.maxSelections
    ? values.length >= group.maxSelections
    : false;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{group.title}</h3>
          <Badge variant="outline" className="text-muted-foreground">
            {group.minSelections && group.maxSelections
              ? `Select ${group.minSelections}-${group.maxSelections}`
              : group.maxSelections
              ? `Select up to ${group.maxSelections}`
              : "Select any"}
          </Badge>
        </div>
        {group.description && (
          <p className="text-sm text-muted-foreground">{group.description}</p>
        )}
        {values.length > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <Check className="w-4 h-4 text-green-600" />
            <span className="text-green-600">{values.length} selected</span>
            {isMaxReached && (
              <span className="text-muted-foreground">• Maximum reached</span>
            )}
          </div>
        )}
      </div>

      <div className="space-y-2">
        {group.options.map((option) => {
          const isChecked = values.includes(option.id);
          const isDisabled =
            option.available === false || (isMaxReached && !isChecked);

          return (
            <div
              key={option.id}
              className={cn(
                "flex items-start space-x-3 p-4 border rounded-lg transition-colors",
                isDisabled ? "opacity-50" : "hover:bg-accent cursor-pointer",
                isChecked && "border-primary bg-primary/5"
              )}
            >
              <Checkbox
                id={`${group.id}-${option.id}`}
                checked={isChecked}
                onCheckedChange={(checked: boolean) =>
                  handleToggle(option.id, checked)
                }
                disabled={isDisabled}
                className="mt-0.5"
              />
              <Label
                htmlFor={`${group.id}-${option.id}`}
                className="flex-1 cursor-pointer space-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{option.name}</span>
                    {option.popular && (
                      <Badge variant="secondary" className="text-xs">
                        Popular
                      </Badge>
                    )}
                  </div>
                  {option.price !== undefined && (
                    <span className="font-medium text-sm">
                      {Number(option.price) > 0
                        ? `+$${Number(option.price).toFixed(2)}`
                        : "Free"}
                    </span>
                  )}
                </div>
                {option.description && (
                  <p className="text-sm text-muted-foreground">
                    {option.description}
                  </p>
                )}
                {option.calories && (
                  <p className="text-xs text-muted-foreground">
                    {option.calories} cal
                  </p>
                )}
                {option.available === false && (
                  <p className="text-xs text-destructive">
                    Currently unavailable
                  </p>
                )}
              </Label>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Counter Variant (Quantity Selection)
function CounterModifierSelector({
  group,
  quantities,
  onChange,
}: {
  group: ModifierGroup;
  quantities: Record<string, number>;
  onChange: (quantities: Record<string, number>) => void;
}) {
  const handleQuantityChange = (optionId: string, delta: number) => {
    const current = quantities[optionId] || 0;
    const newValue = Math.max(
      0,
      Math.min(
        current + delta,
        group.options.find((o) => o.id === optionId)?.maxQuantity || 10
      )
    );

    const newQuantities = { ...quantities };
    if (newValue === 0) {
      delete newQuantities[optionId];
    } else {
      newQuantities[optionId] = newValue;
    }
    onChange(newQuantities);
  };

  const totalSelected = Object.values(quantities).reduce(
    (sum, qty) => sum + qty,
    0
  );
  const maxReached = group.maxSelections
    ? totalSelected >= group.maxSelections
    : false;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{group.title}</h3>
          <Badge variant="outline" className="text-muted-foreground">
            {group.maxSelections
              ? `Add up to ${group.maxSelections}`
              : "Add any amount"}
          </Badge>
        </div>
        {group.description && (
          <p className="text-sm text-muted-foreground">{group.description}</p>
        )}
        {totalSelected > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <Check className="w-4 h-4 text-green-600" />
            <span className="text-green-600">{totalSelected} added</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {group.options.map((option) => {
          const quantity = quantities[option.id] || 0;
          const canAdd = !maxReached || quantity > 0;
          const canAddMore =
            (!option.maxQuantity || quantity < option.maxQuantity) && canAdd;

          return (
            <div
              key={option.id}
              className={cn(
                "flex items-center justify-between p-4 border rounded-lg",
                quantity > 0 && "border-primary bg-primary/5"
              )}
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{option.name}</span>
                  {option.popular && (
                    <Badge variant="secondary" className="text-xs">
                      Popular
                    </Badge>
                  )}
                </div>
                {option.description && (
                  <p className="text-sm text-muted-foreground">
                    {option.description}
                  </p>
                )}
                {option.calories && (
                  <p className="text-xs text-muted-foreground">
                    {option.calories} cal each
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                {option.price !== undefined && (
                  <span className="font-medium text-sm">
                    {Number(option.price) > 0
                      ? `+$${Number(option.price).toFixed(2)}`
                      : "Free"}
                  </span>
                )}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleQuantityChange(option.id, -1)}
                    disabled={quantity === 0}
                    className={cn(
                      "w-8 h-8 rounded-full border flex items-center justify-center transition-colors",
                      quantity === 0
                        ? "border-border text-gray-400 cursor-not-allowed"
                        : "border-gray-300 hover:bg-gray-100 cursor-pointer"
                    )}
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(option.id, 1)}
                    disabled={!canAddMore}
                    className={cn(
                      "w-8 h-8 rounded-full border flex items-center justify-center transition-colors",
                      !canAddMore
                        ? "border-border text-gray-400 cursor-not-allowed"
                        : "border-gray-300 hover:bg-gray-100 cursor-pointer"
                    )}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const pizzaToppingsGroup: ModifierGroup = {
  id: "pizza-toppings",
  name: "Pizza Toppings",
  description: "Customize your pizza with delicious toppings",
  required: false,
  maxSelect: 10,
  allowsSplit: true, // Enable split application
  splitType: "half",
  options: [
    {
      id: "extra-cheese",
      name: "Extra Cheese",
      description: "Premium mozzarella cheese",
      price: (context: PricingContext) => {
        // Dynamic pricing based on pizza size
        const basePrice =
          context.baseItemSize === "large"
            ? 3.5
            : context.baseItemSize === "medium"
            ? 2.5
            : 1.5;
        return basePrice;
      },
      available: true,
      supportsSplit: true, // This topping can be applied to half
      maxQuantity: 3,
    },
    {
      id: "pepperoni",
      name: "Pepperoni",
      description: "Classic spiced pepperoni slices",
      price: 2.99,
      available: true,
      supportsSplit: true,
      maxQuantity: 2,
    },
    {
      id: "mushrooms",
      name: "Fresh Mushrooms",
      description: "Sliced portobello mushrooms",
      price: 1.99,
      available: true,
      supportsSplit: true,
    },
    {
      id: "bell-peppers",
      name: "Bell Peppers",
      description: "Colorful bell pepper mix",
      price: 1.5,
      available: true,
      supportsSplit: true,
    },
    {
      id: "olives",
      name: "Kalamata Olives",
      description: "Premium Mediterranean olives",
      price: 2.25,
      available: false, // Currently out of stock
      supportsSplit: true,
    },
    {
      id: "pineapple",
      name: "Pineapple",
      description: "Sweet tropical pineapple chunks",
      price: 1.75,
      available: true,
      supportsSplit: true,
    },
  ],
};

const pizzaSizeGroup: ModifierGroup = {
  id: "pizza-size",
  name: "Pizza Size",
  description: "Choose your pizza size",
  required: true,
  maxSelect: 1,
  allowsSplit: false, // Size doesn't support splitting
  options: [
    {
      id: "small",
      name: 'Small (10")',
      description: "Perfect for 1-2 people",
      price: 0, // Base price
      available: true,
    },
    {
      id: "medium",
      name: 'Medium (12")',
      description: "Great for 2-3 people",
      price: 4.0,
      available: true,
    },
    {
      id: "large",
      name: 'Large (14")',
      description: "Feeds 3-4 people",
      price: 8.0,
      available: true,
    },
  ],
};

const crustGroup: ModifierGroup = {
  id: "crust-type",
  name: "Crust Type",
  description: "Select your preferred crust",
  required: true,
  maxSelect: 1,
  allowsSplit: false,
  options: [
    {
      id: "thin",
      name: "Thin Crust",
      description: "Light and crispy",
      price: 0,
      available: true,
    },
    {
      id: "thick",
      name: "Thick Crust",
      description: "Hearty and filling",
      price: 2.0,
      available: true,
    },
    {
      id: "stuffed",
      name: "Stuffed Crust",
      description: "Cheese-filled crust",
      price: 4.5,
      available: true,
    },
    {
      id: "gluten-free",
      name: "Gluten-Free",
      description: "Gluten-free alternative",
      price: 3.0,
      available: true,
    },
  ],
};

// Demo data for Sakura & Stone Japanese-European fusion
const demoGroups: Record<string, ModifierGroup[]> = {
  ramen: [
    {
      id: "broth",
      title: "Broth Selection",
      type: "radio",
      required: true,
      maxSelections: 1,
      options: [
        {
          id: "tonkotsu",
          name: "Tonkotsu",
          price: 0,
          isDefault: true,
          calories: 350,
          description: "Rich pork bone broth",
        },
        {
          id: "miso",
          name: "White Miso",
          price: 1.0,
          calories: 280,
          description: "Creamy fermented soybean broth",
          popular: true,
        },
        {
          id: "shio",
          name: "Shio",
          price: 0,
          calories: 200,
          description: "Clear salt-based broth",
        },
        {
          id: "shoyu",
          name: "Shoyu",
          price: 0,
          calories: 220,
          description: "Soy sauce based broth",
        },
        {
          id: "vegan",
          name: "Kombu Dashi",
          price: 2.0,
          calories: 150,
          description: "Kelp-based vegan broth",
        },
      ],
    },
    {
      id: "noodles",
      title: "Noodle Type",
      description: "Choose your preferred noodle style",
      type: "radio",
      required: true,
      maxSelections: 1,
      options: [
        {
          id: "straight",
          name: "Straight",
          price: 0,
          isDefault: true,
          description: "Classic thin straight noodles",
        },
        {
          id: "wavy",
          name: "Wavy",
          price: 0,
          popular: true,
          description: "Curly noodles that hold broth well",
        },
        {
          id: "thick",
          name: "Extra Thick",
          price: 1.5,
          calories: 80,
          description: "Hearty udon-style noodles",
        },
        {
          id: "shirataki",
          name: "Shirataki",
          price: 2.0,
          calories: 10,
          description: "Low-carb konjac noodles",
        },
      ],
    },
    {
      id: "toppings",
      title: "Premium Toppings",
      description: "Enhance your ramen with premium ingredients",
      type: "checkbox",
      maxSelections: 4,
      options: [
        {
          id: "chashu",
          name: "Chashu Pork",
          price: 4.5,
          popular: true,
          calories: 200,
          description: "Slow-braised pork belly",
        },
        {
          id: "duck",
          name: "Duck Confit",
          price: 6.0,
          calories: 180,
          description: "French-style duck leg",
        },
        {
          id: "wagyu",
          name: "Wagyu Beef",
          price: 8.0,
          calories: 220,
          description: "Premium Japanese beef",
        },
        {
          id: "scallops",
          name: "Seared Scallops",
          price: 7.0,
          calories: 120,
          description: "Pan-seared diver scallops",
        },
        {
          id: "uni",
          name: "Sea Urchin",
          price: 12.0,
          calories: 80,
          description: "Fresh uni from Hokkaido",
        },
        {
          id: "truffle",
          name: "Black Truffle",
          price: 15.0,
          calories: 20,
          description: "Shaved European truffle",
        },
      ],
    },
    {
      id: "extras",
      title: "Traditional Additions",
      description: "Classic ramen accompaniments",
      type: "counter",
      maxSelections: 8,
      options: [
        {
          id: "ajitsuke-egg",
          name: "Ajitsuke Tamago",
          price: 2.0,
          maxQuantity: 2,
          calories: 70,
          description: "Marinated soft-boiled egg",
        },
        {
          id: "nori",
          name: "Nori Sheets",
          price: 1.0,
          maxQuantity: 3,
          calories: 5,
          description: "Roasted seaweed",
        },
        {
          id: "menma",
          name: "Menma",
          price: 1.5,
          maxQuantity: 2,
          calories: 30,
          description: "Fermented bamboo shoots",
        },
        {
          id: "green-onion",
          name: "Green Onions",
          price: 0.5,
          maxQuantity: 3,
          calories: 5,
          description: "Fresh scallions",
        },
        {
          id: "corn",
          name: "Sweet Corn",
          price: 1.0,
          maxQuantity: 2,
          calories: 60,
          description: "Hokkaido corn kernels",
        },
      ],
    },
  ],
  duck: [
    {
      id: "preparation",
      title: "Duck Preparation",
      type: "radio",
      required: true,
      maxSelections: 1,
      options: [
        {
          id: "confit",
          name: "Duck Confit",
          price: 0,
          isDefault: true,
          calories: 380,
          description: "Traditional French slow-cooked leg",
        },
        {
          id: "breast",
          name: "Seared Duck Breast",
          price: 4.0,
          calories: 320,
          description: "Pan-seared with crispy skin",
          popular: true,
        },
        {
          id: "rillettes",
          name: "Duck Rillettes",
          price: 2.0,
          calories: 280,
          description: "Pulled duck with herbs",
        },
        {
          id: "teriyaki",
          name: "Teriyaki Glazed",
          price: 1.5,
          calories: 340,
          description: "Japanese-style glazed duck",
        },
      ],
    },
    {
      id: "bun",
      title: "Bun Selection",
      description: "Choose your preferred bread",
      type: "radio",
      required: true,
      maxSelections: 1,
      options: [
        {
          id: "brioche",
          name: "Brioche Bun",
          price: 0,
          isDefault: true,
          description: "Buttery French bread",
        },
        {
          id: "bao",
          name: "Steamed Bao",
          price: 1.0,
          description: "Traditional Chinese bun",
          popular: true,
        },
        {
          id: "shokupan",
          name: "Japanese Milk Bread",
          price: 1.5,
          description: "Soft pillowy bread",
        },
        {
          id: "sourdough",
          name: "Artisan Sourdough",
          price: 2.0,
          description: "Tangy fermented bread",
        },
      ],
    },
    {
      id: "sauce",
      title: "Signature Sauces",
      type: "checkbox",
      maxSelections: 2,
      options: [
        {
          id: "miso-aioli",
          name: "Miso Aioli",
          price: 0.5,
          popular: true,
          description: "Creamy fermented soybean mayo",
        },
        {
          id: "yuzu-kosho",
          name: "Yuzu Kosho",
          price: 1.0,
          description: "Citrus and chili paste",
        },
        {
          id: "teriyaki",
          name: "House Teriyaki",
          price: 0.5,
          description: "Sweet soy glaze",
        },
        {
          id: "ponzu",
          name: "Ponzu",
          price: 0.75,
          description: "Citrus soy sauce",
        },
        {
          id: "wasabi-mayo",
          name: "Wasabi Mayo",
          price: 0.75,
          description: "Spicy horseradish mayo",
        },
        {
          id: "tonkatsu",
          name: "Tonkatsu Sauce",
          price: 0.5,
          description: "Japanese-style brown sauce",
        },
      ],
    },
    {
      id: "vegetables",
      title: "Fresh Vegetables",
      description: "Complimentary additions",
      type: "checkbox",
      options: [
        {
          id: "daikon",
          name: "Pickled Daikon",
          price: 0,
          description: "Tangy Japanese radish",
        },
        {
          id: "cucumber",
          name: "Japanese Cucumber",
          price: 0,
          description: "Crisp and refreshing",
        },
        {
          id: "arugula",
          name: "Baby Arugula",
          price: 0,
          description: "Peppery European greens",
        },
        {
          id: "sprouts",
          name: "Microgreens",
          price: 0,
          description: "Delicate baby shoots",
        },
        {
          id: "cabbage",
          name: "Napa Cabbage",
          price: 0,
          description: "Crunchy Asian cabbage",
        },
        {
          id: "tomato",
          name: "Heirloom Tomato",
          price: 0,
          description: "Seasonal varieties",
        },
      ],
    },
    {
      id: "premium",
      title: "Gourmet Enhancements",
      type: "checkbox",
      maxSelections: 3,
      options: [
        {
          id: "foie-gras",
          name: "Seared Foie Gras",
          price: 18.0,
          calories: 130,
          description: "French delicacy",
          popular: true,
        },
        {
          id: "truffle",
          name: "Shaved Truffle",
          price: 15.0,
          calories: 20,
          description: "European black truffle",
        },
        {
          id: "uni",
          name: "Sea Urchin",
          price: 12.0,
          calories: 60,
          description: "Fresh Hokkaido uni",
        },
        {
          id: "duck-egg",
          name: "Quail Egg",
          price: 3.0,
          calories: 40,
          description: "Delicate soft-boiled",
        },
        {
          id: "shiitake",
          name: "Roasted Shiitake",
          price: 4.0,
          calories: 25,
          description: "Umami-rich mushrooms",
        },
        {
          id: "wagyu",
          name: "Wagyu Beef",
          price: 22.0,
          calories: 180,
          description: "A5 grade Japanese beef",
        },
      ],
    },
  ],
  sake: [
    {
      id: "type",
      title: "Sake Grade",
      type: "radio",
      required: true,
      maxSelections: 1,
      options: [
        {
          id: "junmai",
          name: "Junmai",
          price: 0,
          description: "Pure rice sake",
          isDefault: true,
        },
        {
          id: "ginjo",
          name: "Ginjo",
          price: 3.0,
          description: "Premium milled rice",
          popular: true,
        },
        {
          id: "daiginjo",
          name: "Daiginjo",
          price: 8.0,
          description: "Super premium grade",
        },
        {
          id: "nigori",
          name: "Nigori",
          price: 2.0,
          description: "Unfiltered cloudy sake",
        },
      ],
    },
    {
      id: "temp",
      title: "Serving Temperature",
      type: "radio",
      required: true,
      maxSelections: 1,
      options: [
        {
          id: "room",
          name: "Room Temperature",
          price: 0,
          isDefault: true,
          description: "Traditional serving",
        },
        {
          id: "chilled",
          name: "Chilled",
          price: 0,
          description: "Slightly cooled",
          popular: true,
        },
        {
          id: "warmed",
          name: "Warmed",
          price: 0,
          description: "Gently heated",
        },
      ],
    },
    {
      id: "region",
      title: "Regional Origin",
      type: "radio",
      required: false,
      maxSelections: 1,
      options: [
        {
          id: "any",
          name: "Chef's Choice",
          price: 0,
          isDefault: true,
          description: "Best available",
        },
        {
          id: "junmai",
          name: "Kyoto Prefecture",
          price: 2.0,
          description: "Historic brewing region",
        },
        {
          id: "niigata",
          name: "Niigata Prefecture",
          price: 3.0,
          description: "Premium snow country sake",
          popular: true,
        },
        {
          id: "hiroshima",
          name: "Hiroshima Prefecture",
          price: 2.5,
          description: "Soft water brewing",
        },
        {
          id: "yamagata",
          name: "Yamagata Prefecture",
          price: 4.0,
          description: "Mountain spring water",
        },
      ],
    },
    {
      id: "pairing",
      title: "Food Pairings",
      description: "Enhance your sake experience",
      type: "counter",
      maxSelections: 3,
      options: [
        {
          id: "edamame",
          name: "Edamame",
          price: 4.0,
          maxQuantity: 2,
          description: "Lightly salted soybeans",
        },
        {
          id: "cheese",
          name: "Artisan Cheese Selection",
          price: 12.0,
          maxQuantity: 1,
          description: "European cheeses",
          popular: true,
        },
        {
          id: "sashimi",
          name: "Seasonal Sashimi",
          price: 18.0,
          maxQuantity: 1,
          description: "Chef's selection",
        },
      ],
    },
    {
      id: "flavors",
      title: "Flavor Enhancements",
      description: "Optional flavor infusions",
      type: "checkbox",
      maxSelections: 2,
      options: [
        {
          id: "yuzu",
          name: "Yuzu Citrus",
          price: 2.0,
          popular: true,
          description: "Japanese citrus essence",
        },
        {
          id: "plum",
          name: "Ume Plum",
          price: 1.5,
          description: "Sweet and tart umeshu blend",
        },
        {
          id: "lychee",
          name: "Lychee",
          price: 1.75,
          description: "Delicate floral notes",
        },
        {
          id: "cucumber",
          name: "Cucumber",
          price: 1.0,
          description: "Refreshing and clean",
        },
        {
          id: "shiso",
          name: "Shiso Leaf",
          price: 2.5,
          description: "Aromatic Japanese herb",
        },
      ],
    },
    {
      id: "presentation",
      title: "Presentation Style",
      type: "checkbox",
      options: [
        {
          id: "tokkuri",
          name: "Traditional Tokkuri",
          price: 3.0,
          description: "Ceramic sake flask",
        },
        {
          id: "masu",
          name: "Wooden Masu Box",
          price: 4.0,
          description: "Traditional wooden cup",
          popular: true,
        },
        {
          id: "ochoko",
          name: "Ochoko Cup Set",
          price: 2.0,
          description: "Small ceramic cups",
        },
        {
          id: "wine-glass",
          name: "Wine Glass",
          price: 1.0,
          description: "European-style presentation",
        },
      ],
    },
  ],
};

const simpleGlazeOptions = [
  {
    id: "miso-glazed",
    name: "Miso Glazed (Original)",
    isDefault: true,
  },
  {
    id: "teriyaki-style",
    name: "Teriyaki Glazed",
    price: 2.0,
  },
  {
    id: "spicy-miso",
    name: "Spicy Miso",
    price: 1.5,
  },
  {
    id: "ponzu-citrus",
    name: "Ponzu Citrus Glaze",
    price: 2.5,
  },
  {
    id: "black-garlic",
    name: "Black Garlic Miso",
    price: 3.0,
  },
  {
    id: "truffle-miso",
    name: "Truffle Miso (Premium)",
    price: 8.0,
  },
];

export default function ModifierSelectorDemo() {
  const [selectedCategory, setSelectedCategory] =
    useState<keyof typeof demoGroups>("simple");
  const [modifierState, setModifierState] = useState<Record<string, any>>({});
  const [simpleSelection, setSimpleSelection] = useState("");

  const handleRadioChange = (groupId: string, value: string) => {
    setModifierState((prev) => ({ ...prev, [groupId]: value }));
  };

  const handleCheckboxChange = (groupId: string, values: string[]) => {
    setModifierState((prev) => ({ ...prev, [groupId]: values }));
  };

  const handleCounterChange = (
    groupId: string,
    quantities: Record<string, number>
  ) => {
    setModifierState((prev) => ({ ...prev, [groupId]: quantities }));
  };

  const calculateTotal = () => {
    let total = 0;
    if (selectedCategory === "simple") {
      const option = simpleGlazeOptions.find((o) => o.id === simpleSelection);
      if (option?.price) total += getModifierPrice(option);
      return total;
    }

    const groups = demoGroups[selectedCategory];
    const pricingContext: PricingContext = {
      baseItemPrice: 12.99,
      baseItemSize: "medium",
      selectedModifiers: {},
      itemQuantity: 1
    };

    groups.forEach((group) => {
      const state = modifierState[group.id];
      if (!state) return;

      if (group.type === "radio") {
        const option = group.options.find((o) => o.id === state);
        if (option?.price) {
          total += getModifierPrice(option, pricingContext);
        }
      } else if (group.type === "checkbox" && Array.isArray(state)) {
        state.forEach((optionId) => {
          const option = group.options.find((o) => o.id === optionId);
          if (option?.price) {
            total += getModifierPrice(option, pricingContext);
          }
        });
      } else if (group.type === "counter" && typeof state === "object") {
        Object.entries(state).forEach(([optionId, quantity]) => {
          const option = group.options.find((o) => o.id === optionId);
          if (option?.price && typeof quantity === "number") {
            total += getModifierPrice(option, pricingContext) * quantity;
          }
        });
      }
    });

    return total;
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Demo Controls */}
      <Card className="p-4 bg-muted/50">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Demo Controls</h3>
          <div className="text-xs text-muted-foreground">
            <div>
              Selected:{" "}
              <span className="font-mono">
                {selectedCategory === "simple"
                  ? simpleSelection
                  : JSON.stringify(modifierState)}
              </span>
            </div>
            <div>
              Total:{" "}
              <span className="font-mono">${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
      </Card>

      <Tabs
        value={selectedCategory}
        onValueChange={(v) => {
          setSelectedCategory(v as keyof typeof demoGroups | "simple");
          setModifierState({});
          setSimpleSelection("");
        }}
      >
        <TabsList className="w-full">
          <TabsTrigger value="simple">Simple</TabsTrigger>
          <TabsTrigger value="ramen">Premium Ramen</TabsTrigger>
          <TabsTrigger value="duck">Duck Burger</TabsTrigger>
          <TabsTrigger value="sake">Sake Selection</TabsTrigger>
        </TabsList>

        <TabsContent value="simple" className="space-y-6 mt-6">
          <Card className="p-6">
            <ModifierSelector
              groups={[
                {
                  id: "glaze",
                  name: "Choose Glaze Style",
                  required: true,
                  maxSelect: 1,
                  options: simpleGlazeOptions.map((opt) => ({
                    ...opt,
                    price: opt.price || 0,
                    available: true,
                    default: opt.isDefault,
                  })),
                },
              ]}
              selectedModifiers={{
                glaze: simpleSelection ? [simpleSelection] : [],
              }}
              onModifierChange={(groupId, selectedIds) => {
                setSimpleSelection(selectedIds[0] || "");
              }}
            />
          </Card>

          {/* Usage Example */}
          <Card className="p-4">
            <h3 className="text-sm font-medium mb-3">Basic Usage</h3>
            <div className="bg-muted rounded p-3 text-xs font-mono whitespace-pre-wrap">
              {`<ModifierSelector
  title="Choose Glaze Style"
  options={[
    { id: "miso", name: "Miso Glazed", isDefault: true },
    { id: "teriyaki", name: "Teriyaki", price: 2.00 }
  ]}
  required={true}
  maxSelections={1}
  onSelectionChange={(value) => console.log(value)}
/>`}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value={selectedCategory} className="space-y-6 mt-6">
          {selectedCategory !== "simple" &&
            demoGroups[selectedCategory]?.map((group) => (
              <div key={group.id} className="pb-6 border-b last:border-0">
                {group.type === "radio" && (
                  <RadioModifierSelector
                    group={group}
                    value={modifierState[group.id] || ""}
                    onChange={(value) => handleRadioChange(group.id, value)}
                  />
                )}
                {group.type === "checkbox" && (
                  <CheckboxModifierSelector
                    group={group}
                    values={modifierState[group.id] || []}
                    onChange={(values) =>
                      handleCheckboxChange(group.id, values)
                    }
                  />
                )}
                {group.type === "counter" && (
                  <CounterModifierSelector
                    group={group}
                    quantities={modifierState[group.id] || {}}
                    onChange={(quantities) =>
                      handleCounterChange(group.id, quantities)
                    }
                  />
                )}
              </div>
            ))}

          {/* Total Price Summary */}
          {selectedCategory !== "simple" && (
            <div className="sticky bottom-0 bg-background border-t p-4 -mx-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Modifier Total:</span>
                <span className="text-xl font-bold">
                  ${calculateTotal().toFixed(2)}
                </span>
              </div>
              {calculateTotal() > 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  Additional cost for selected modifiers
                </p>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
