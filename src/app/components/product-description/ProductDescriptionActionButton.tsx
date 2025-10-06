"use client";

import React, { useState } from "react";
import { scroller } from "react-scroll";
import { toast } from "sonner";
import { formatApiError } from "@/lib/format-api-error";
import { postData } from "@/lib/handle-api";
import { useCart } from "@/hooks/useCart";
import { SelectedModifierTypes } from "@/types/menu-types";
import ItemCounterButton from "./ItemCounterButton";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { location_Id as LOCATION_ID } from "@/constants";

const ProductDescriptionActionButton = ({
  cartItem,
  selectedModifiers,
  closeBottomSheet,
  setErrorModifierGroupId,
  specialInstructions,
  itemUnavailableAction,
  cartId,
}: {
  cartItem: any;
  selectedModifiers: SelectedModifierTypes[];
  closeBottomSheet: any;
  setErrorModifierGroupId: (errorModifierGroupId: string) => void;
  specialInstructions: string;
  itemUnavailableAction: string;
  cartId: string;
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const locationId = cartItem?.locationId ?? LOCATION_ID;
  const { mutate } = useCart({ locationId, cartId });

  const handleAddItemToCart = async () => {
    const addItemData = {
      productId: cartItem.id,
      quantity,
      specialInstructions,
      itemUnavailableAction,
      selections: selectedModifiers.map((group) => ({
        groupId: group.groupId,
        selectedOptions: group.selectedOptions.map((option) => ({
          optionId: option.id,
          quantity: option.quantity,
        })),
      })),
    };
    const cart = await postData(
      `/api/v1/locations/${locationId}/carts/${cartId}/cart-item`,
      addItemData
    );
    closeBottomSheet();
    await mutate();
    return cart;
  };

  const handleCartItem = async () => {
    setIsLoading(true);

    try {
      await handleAddItemToCart();
      toast.success(`${cartItem.name} added to cart`, {
        position: "top-center",
      });
    } catch (error) {
      const formattedError = formatApiError(error);

      toast.error(formattedError.message);
      setIsLoading(false);

      // TODO -- remove any type
      if (!(formattedError as any).data) return;

      const formattedErrorData = (formattedError as any).data as any;

      if (formattedErrorData.modifierGroupId) {
        setErrorModifierGroupId(formattedErrorData.modifierGroupId);
        scroller.scrollTo(formattedErrorData.modifierGroupId, {
          containerId: "product-description-section",
          duration: 500,
          delay: 100,
          smooth: true,
          offset: -90,
        });
      }
    }
  };
  return (
    <div className="flex w-full items-center justify-between gap-4">
      <div className="flex-1">
        <ItemCounterButton
          value={quantity}
          onIncrease={() => setQuantity(quantity + 1)}
          onDecrease={() => quantity > 1 && setQuantity(quantity - 1)}
        />
      </div>
      <LoadingButton
        type="button"
        className="w-40"
        loading={isLoading}
        onClick={handleCartItem}
      >
        {`Add ${quantity} to cart`}
      </LoadingButton>
    </div>
  );
};

export default ProductDescriptionActionButton;
