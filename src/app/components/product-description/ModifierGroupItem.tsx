import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ModifierItem, SelectedModifierTypes } from "@/types/menu-types";
import ItemCounterButton from "./ItemCounterButton";

interface ModifierGroupItemProps {
  items: ModifierItem[];
  currentSelectedModifier?: SelectedModifierTypes;
  isMultipleSelection: boolean;
  handleModifierOptionSelection: (
    isSelected: boolean,
    groupId: string,
    optionId: string,
    isSingleSelection: boolean
  ) => void;
  handleModifierOptionQuantityChange: (
    groupId: string,
    optionId: string,
    newQuantity: number
  ) => void;
  groupId: string;
}

const ModifierGroupItem = ({
  items,
  currentSelectedModifier,
  handleModifierOptionSelection,
  handleModifierOptionQuantityChange,
  groupId,
  isMultipleSelection,
}: ModifierGroupItemProps) => {
  return (
    <div>
      {items.map((modifierItem) => {
        const selectedItem = currentSelectedModifier?.selectedOptions.find(
          (option) => option.id == modifierItem.id
        );

        const isSelected = Boolean(selectedItem);

        return (
          <div className="cursor-pointer" key={modifierItem.id}>
            <div
              onClick={() =>
                handleModifierOptionSelection(
                  isSelected,
                  groupId,
                  modifierItem.id,
                  !isMultipleSelection
                )
              }
            >
              <div className="flex min-h-[40px] flex-col items-end justify-center space-y-2 border-b px-3 py-2">
                <div className="flex h-[23px] w-full items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox id={modifierItem.id} checked={isSelected} />
                    <Label>{modifierItem.name}</Label>
                  </div>
                  <Label
                    style={{ color: "#626262" }}
                    className="text-xs text-[12px] font-medium"
                  >
                    + {modifierItem.price}
                  </Label>
                </div>

                {isSelected && modifierItem.maxQuantity > 1 && (
                  <ItemCounterButton
                    small={true}
                    value={selectedItem!.quantity}
                    onIncrease={(e) => {
                      e.stopPropagation();

                      handleModifierOptionQuantityChange(
                        groupId,
                        modifierItem.id,
                        selectedItem!.quantity + 1
                      );
                    }}
                    onDecrease={(e) => {
                      e.stopPropagation();
                      handleModifierOptionQuantityChange(
                        groupId,
                        modifierItem.id,
                        selectedItem!.quantity - 1
                      );
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ModifierGroupItem;
