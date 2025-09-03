import React, { useState } from "react";
import Image from "next/image";
import { ArrowLeft, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useMediaQuery } from "@/hooks/use-media-query";
import { imagePlaceholder } from "@/constants";
import {
  ProductDescription as ProductDescriptionType,
  SelectedModifierTypes,
} from "@/types/menu-types";
import ModifierGroup from "./ModifierGroup";
import ItemUnavailableAction from "./ItemUnavailableAction";
import SpecialInstructions from "./SpecialInstructions";
import ProductDescriptionActionButton from "./ProductDescriptionActionButton";
import ShowMoreText from "../ShowMoreText";

interface AddToCartScreenProps {
  product: ProductDescriptionType;
  closeBottomSheet?: () => void;
  cartId: string;
  isAddToCartBlocked?: boolean;
}

export enum ItemUnavailableActions {
  REMOVE_ITEM = "remove_item",
  CANCEL_ENTIRE_ORDER = "cancel_entire_order",
}

const ProductDescription = ({
  product,
  closeBottomSheet,
  cartId,
  isAddToCartBlocked = false,
}: AddToCartScreenProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedModifiers, setSelectedModifiers] = useState<
    SelectedModifierTypes[]
  >([]);
  const [itemUnavailableAction, setItemUnavailableAction] = useState(
    ItemUnavailableActions.REMOVE_ITEM
  );

  const [errorModifierGroupId, setErrorModifierGroupId] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState<string>("");
  const { images, name, description, modifiers } = product;
  const imageURL = images[0];

  function handleModifierOptionSelection(
    isAlreadySelected: boolean,
    groupId: string,
    optionId: string,
    isSingleSelection: boolean
  ) {
    setErrorModifierGroupId("");

    if (isAlreadySelected) {
      const updatedSelectedModifiers = selectedModifiers.reduce(
        (
          allSelectedModifiers: SelectedModifierTypes[],
          currentSelectedModifier
        ) => {
          if (currentSelectedModifier.groupId === groupId) {
            const updatedSelectedOptions =
              currentSelectedModifier.selectedOptions.filter(
                (selectedOption) => selectedOption.id !== optionId
              );

            if (updatedSelectedOptions.length > 0) {
              allSelectedModifiers.push({
                ...currentSelectedModifier,
                selectedOptions: updatedSelectedOptions,
              });
            }
          } else {
            allSelectedModifiers.push(currentSelectedModifier);
          }

          return allSelectedModifiers;
        },
        []
      );

      setSelectedModifiers(updatedSelectedModifiers);
      return;
    }

    const selectedModifierCopy = [...selectedModifiers];

    const matchedItemIndex = selectedModifierCopy.findIndex((modifierGroup) => {
      return modifierGroup.groupId === groupId;
    });

    if (matchedItemIndex == -1) {
      const createdGroupEntry: SelectedModifierTypes = {
        groupId,
        selectedOptions: [{ id: optionId, quantity: 1 }],
      };
      selectedModifierCopy.push(createdGroupEntry);
    } else {
      const currentGroup = selectedModifierCopy[matchedItemIndex]!;
      const updatedSelectedOptions = isSingleSelection
        ? [
            {
              id: optionId,
              quantity: 1,
            },
          ]
        : [...currentGroup.selectedOptions, { id: optionId, quantity: 1 }];

      selectedModifierCopy[matchedItemIndex] = {
        ...currentGroup,
        selectedOptions: updatedSelectedOptions,
      };
    }

    setSelectedModifiers(selectedModifierCopy);
  }

  function handleModifierOptionQuantityChange(
    groupId: string,
    optionId: string,
    newQuantity: number
  ) {
    setErrorModifierGroupId("");

    if (newQuantity === 0) {
      handleModifierOptionSelection(true, groupId, optionId, false);

      return;
    }

    const selectedModifierCopy = [...selectedModifiers];

    const matchedItemIndex = selectedModifierCopy.findIndex((modifierGroup) => {
      return modifierGroup.groupId === groupId;
    });

    const currentGroup = selectedModifierCopy[matchedItemIndex]!;
    const updatedSelectedOptions = currentGroup.selectedOptions.map(
      (option) => {
        if (option.id == optionId) {
          return {
            ...option,
            quantity: newQuantity,
          };
        }

        return option;
      }
    );

    selectedModifierCopy[matchedItemIndex] = {
      ...currentGroup,
      selectedOptions: updatedSelectedOptions,
    };

    setSelectedModifiers(selectedModifierCopy);
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <div
        className="flex-1 overflow-auto scrollbar-hide"
        id="product-description-section"
      >
        <div className="relative min-h-10 w-full">
          {imageURL && (
            <div className="relative h-[400px]">
              <Image
                src={imageURL}
                className="object-cover"
                alt="product image"
                placeholder="blur"
                fill
                blurDataURL={imagePlaceholder}
              />
            </div>
          )}
          {!isDesktop && (
            <Button
              onClick={closeBottomSheet}
              className="absolute top-2.5 left-3 rounded-full"
              size="icon"
              variant="outline"
            >
              <ArrowLeft />
            </Button>
          )}
        </div>
        <div className={`px-4 ${imageURL ? "py-4" : "pt-8"} mb-3`}>
          <p className="text-3xl font-semibold">{name}</p>
          {description && <ShowMoreText text={description as string} />}
        </div>
        <Separator />

        <ModifierGroup
          modifiers={modifiers}
          selectedModifiers={selectedModifiers}
          handleModifierOptionSelection={handleModifierOptionSelection}
          handleModifierOptionQuantityChange={
            handleModifierOptionQuantityChange
          }
          errorModifierGroupId={errorModifierGroupId}
        />

        <ItemUnavailableAction
          itemUnavailableAction={itemUnavailableAction}
          setItemUnavailableAction={setItemUnavailableAction}
          disabled={isAddToCartBlocked}
        />

        <SpecialInstructions
          specialInstructions={specialInstructions}
          setSpecialInstructions={setSpecialInstructions}
          disabled={isAddToCartBlocked}
        />
      </div>
      <div className="px-4 py-6">
        {isAddToCartBlocked ? (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Info aria-hidden="true" className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  This product is currently not available
                </h3>
              </div>
            </div>
          </div>
        ) : (
          <ProductDescriptionActionButton
            cartItem={product}
            closeBottomSheet={closeBottomSheet}
            selectedModifiers={selectedModifiers}
            setErrorModifierGroupId={setErrorModifierGroupId}
            specialInstructions={specialInstructions}
            itemUnavailableAction={itemUnavailableAction}
            cartId={cartId}
          />
        )}
      </div>
    </div>
  );
};

export default ProductDescription;
