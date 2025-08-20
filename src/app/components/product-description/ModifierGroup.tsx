import React from "react";
import clsx from "clsx";
import { Element } from "react-scroll";
import { Modifier, SelectedModifierTypes } from "@/types/menu-types";
import ModifierGroupItem from "./ModifierGroupItem";

const ModifierGroup = ({
  modifiers,
  selectedModifiers,
  handleModifierOptionSelection,
  handleModifierOptionQuantityChange,
  errorModifierGroupId,
}: {
  modifiers: Modifier[];
  selectedModifiers: SelectedModifierTypes[];
  handleModifierOptionSelection: (
    isSelected: boolean,
    groupId: string,
    optionId: string,
    isSingleSelect: boolean,
  ) => void;
  handleModifierOptionQuantityChange: (
    groupId: string,
    optionId: string,
    newQuantity: number,
  ) => void;
  errorModifierGroupId: string;
}) => {
  return (
    <div>
      {modifiers.map((modifier) => {
        const currentSelectedModifier = selectedModifiers.find(
          (selectedModifier) => selectedModifier.groupId == modifier.id,
        );

        const isError = errorModifierGroupId === modifier.id;

        return (
          <Element name={modifier.id} key={modifier.id}>
            <div
              className='flex h-[40px] items-center justify-between p-3'
              style={{ backgroundColor: "#F5F6F8" }}
            >
              <p
                className={clsx(
                  "text-xs leading-[15px] font-semibold",
                  isError && "text-red-600",
                )}
              >
                {modifier.name}
              </p>
              <p
                className={clsx(
                  "text-xs leading-[15.84px] font-medium",
                  isError && "text-red-600",
                )}
              >{`${modifier.required ? "Required" : "Optional"} · Select ${modifier.quantity}`}</p>
            </div>
            <ModifierGroupItem
              groupId={modifier.id}
              items={modifier.items}
              isMultipleSelection={modifier.quantity > 1}
              currentSelectedModifier={currentSelectedModifier}
              handleModifierOptionSelection={handleModifierOptionSelection}
              handleModifierOptionQuantityChange={
                handleModifierOptionQuantityChange
              }
            />
          </Element>
        );
      })}
    </div>
  );
};

export default ModifierGroup;
