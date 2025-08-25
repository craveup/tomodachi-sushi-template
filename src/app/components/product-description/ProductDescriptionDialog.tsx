import * as React from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ProductDescriptionProps } from "@/types/common";
import { ProductDescriptionScreen } from "./ProductDescriptionScreen";

function ProductDescriptionDialog(props: ProductDescriptionProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={!!props.productId} onOpenChange={props.onClose}>
        <DialogContent className="h-[90vh] overflow-hidden border-none p-0 z-[1050] [&>div:first-child]:z-[1050]">
          <VisuallyHidden>
            <DialogTitle />
          </VisuallyHidden>
          {props.productId && <ProductDescriptionScreen {...props} />}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer
      open={Boolean(props.productId)}
      onOpenChange={() => props.onClose()}
    >
      <DrawerContent className="h-[90vh] overflow-hidden border-none p-0 z-[1050] [&>div:first-child]:z-[1050]">
        {props.productId && <ProductDescriptionScreen {...props} />}
      </DrawerContent>
    </Drawer>
  );
}

export default ProductDescriptionDialog;
