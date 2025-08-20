// app/components/cart-drawer.tsx
"use client";
import { useCart } from "@/app/providers/cart-provider";
import { Dialog, DialogContent } from "@/components/ui/dialog";
// or your Sheet/Drawer component

export default function CartDrawer() {
  const { isCartOpen, closeCart, items, subtotal, tax, total } = useCart();

  return (
    <Dialog open={isCartOpen} onOpenChange={(open) => !open && closeCart()}>
      <DialogContent className="max-w-lg">
        <h2 className="text-lg font-semibold">Your Cart</h2>
        <div className="mt-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-sm text-muted-foreground">Empty</div>
          ) : (
            items.map((it) => (
              <div key={it.cartId} className="flex justify-between text-sm">
                <span>
                  {it.name} × {it.quantity}
                </span>
                <span>${(it.price * it.quantity).toFixed(2)}</span>
              </div>
            ))
          )}
        </div>
        <div className="mt-4 border-t pt-3 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
