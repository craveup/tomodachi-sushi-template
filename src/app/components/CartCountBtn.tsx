import {ShoppingCart} from "lucide-react";
import {Button} from "@/components/ui/button";
import React from "react";

function CartCountBtn({openCart, isCartOpen, itemCount}: {openCart: any, isCartOpen: any, itemCount: number}) {
    return(
        <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={openCart}
            aria-haspopup="dialog"
            aria-expanded={isCartOpen}
            aria-controls="cart-sidebar"
            className="flex items-center justify-center w-[44px] h-[44px] bg-backgroundmuted rounded-lg border border-borderdefault hover:bg-backgroundmuted flex-shrink-0"
        >
            <div className="relative">
                <ShoppingCart className="w-5 h-5 text-icondefault" />
                {itemCount > 0 && (
                    <span
                        className="absolute -top-2 -right-2 bg-backgroundprimary text-textinverse text-[10px] font-bold rounded-full min-w-[1.1rem] h-[1.1rem] px-1 flex items-center justify-center leading-none"
                        aria-label={`${itemCount} items in cart`}
                    >
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
                )}
            </div>
            <span className="sr-only">Open cart</span>
        </Button>
    );
}

export default CartCountBtn;
