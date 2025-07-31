"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

// Mock QuantitySelector component
function QuantitySelector({
  value,
  onChange,
  variant = "default",
  size = "md",
  showInput = true,
  min = 0,
  max = 99,
}) {
  const sizeClasses = {
    sm: "h-7 w-7 text-xs",
    md: "h-9 w-9 text-sm",
    lg: "h-11 w-11",
  };

  const buttonClass = sizeClasses[size];

  if (variant === "inline") {
    return (
      <div className="inline-flex items-center gap-1">
        <button
          onClick={() => value > min && onChange(value - 1)}
          disabled={value <= min}
          className={`${buttonClass} rounded-full border flex items-center justify-center hover:bg-gray-100 disabled:opacity-50`}
        >
          <Minus className="h-3 w-3" />
        </button>
        <span className="min-w-[2rem] text-center font-medium">{value}</span>
        <button
          onClick={() => value < max && onChange(value + 1)}
          disabled={value >= max}
          className={`${buttonClass} rounded-full border flex items-center justify-center hover:bg-gray-100 disabled:opacity-50`}
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className="inline-flex items-center border rounded-md">
        <button
          onClick={() => value > min && onChange(value - 1)}
          disabled={value <= min}
          className={`${buttonClass} border-r flex items-center justify-center hover:bg-gray-100 disabled:opacity-50`}
        >
          <Minus className="h-3 w-3" />
        </button>
        {showInput ? (
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value) || min)}
            className="w-16 text-center border-0 focus:outline-none"
            min={min}
            max={max}
          />
        ) : (
          <span className="px-3 font-medium">{value}</span>
        )}
        <button
          onClick={() => value < max && onChange(value + 1)}
          disabled={value >= max}
          className={`${buttonClass} border-l flex items-center justify-center hover:bg-gray-100 disabled:opacity-50`}
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>
    );
  }

  // Default variant
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => value > min && onChange(value - 1)}
        disabled={value <= min}
        className={`${buttonClass} border rounded flex items-center justify-center hover:bg-gray-100 disabled:opacity-50`}
      >
        <Minus className="h-4 w-4" />
      </button>

      {showInput ? (
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value) || min)}
          className="w-16 text-center border rounded px-2 py-1"
          min={min}
          max={max}
        />
      ) : (
        <div className="min-w-[3rem] text-center font-medium border rounded px-2 py-1">
          {value}
        </div>
      )}

      <button
        onClick={() => value < max && onChange(value + 1)}
        disabled={value >= max}
        className={`${buttonClass} border rounded flex items-center justify-center hover:bg-gray-100 disabled:opacity-50`}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function QuantitySelectorDemo() {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="space-y-6 w-full max-w-md mx-auto">
      <div>
        <h4 className="text-sm font-medium mb-3">Default</h4>
        <QuantitySelector
          value={quantity}
          onChange={setQuantity}
          min={1}
          max={10}
        />
      </div>

      <div>
        <h4 className="text-sm font-medium mb-3">Compact</h4>
        <QuantitySelector
          value={quantity}
          onChange={setQuantity}
          variant="compact"
          size="sm"
          min={1}
          max={10}
        />
      </div>

      <div>
        <h4 className="text-sm font-medium mb-3">Inline</h4>
        <QuantitySelector
          value={quantity}
          onChange={setQuantity}
          variant="inline"
          showInput={false}
          min={1}
          max={10}
        />
      </div>
    </div>
  );
}
