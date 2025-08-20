import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";

interface SimpleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  text?: any;
  actionButtonText?: any;
  actionButtonFormId?: string;
  actionButtonType?: string;
  onClick?: () => void;
  onGoBack?: () => void;
  isLoading?: boolean;
  className?: string;
}

function SimpleDialog({
  isOpen,
  onClose,
  children,
  title,
  text,
  actionButtonText,
  actionButtonFormId,
  onClick,
  isLoading = false,
  onGoBack,
  className,
}: SimpleDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const isTextHeader = Boolean(title || text);

  const actionButton = actionButtonText ? (
    <div className='w-full'>
      <LoadingButton
        loading={isLoading}
        type={onClick ? "button" : "submit"}
        form={actionButtonFormId}
        className='w-full'
      >
        {actionButtonText}
      </LoadingButton>
    </div>
  ) : undefined;

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className={cn("h-[90vh] overflow-hidden border-none", className)}
        >
          {(isTextHeader || onGoBack) && (
            <DialogHeader>
              {onGoBack && (
                <Button
                  className='mb-4'
                  onClick={onGoBack}
                  size='icon'
                  variant='ghost'
                >
                  <ArrowLeft />
                </Button>
              )}

              {title && <DialogTitle>{title}</DialogTitle>}
              {text && <DialogDescription>{text}</DialogDescription>}
            </DialogHeader>
          )}
          <div className='flex-1 overflow-auto'>{children}</div>
          <DialogFooter>{actionButton}</DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent
        className={cn("h-[90vh] overflow-hidden border-none p-0", className)}
      >
        {isTextHeader && (
          <DrawerHeader className='text-left'>
            {title && <DrawerTitle>{title}</DrawerTitle>}
            {text && <DrawerDescription>{text}</DrawerDescription>}
          </DrawerHeader>
        )}
        <div className='flex-1 overflow-auto px-4'>{children}</div>

        <DrawerFooter className='pt-2'>{actionButton}</DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default SimpleDialog;
