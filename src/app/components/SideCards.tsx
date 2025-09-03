"use client"
import SideCard from "@/app/components/side-card";
import {useCartStore} from "@/store/cart-store";

export default function SideCards() {
  const {cartId} = useCartStore();

  return (
    <div>
      <aside className="flex flex-col lg:w-[420px] lg:h-full lg:max-h-full lg:overflow-y-auto lg:pr-1 gap-3 lg:gap-[15px] overscroll-contain">
        {/* Mobile: Show as horizontal scroll on very small screens */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3 lg:gap-[15px] overflow-x-auto lg:overflow-x-visible pb-1">

          <div className="min-w-0 sm:min-w-[200px] lg:min-w-0">
            <SideCard
                backgroundImage="bg-[url(/images/sushi/menu-card.jpg)]"
                label="MENU"
                href={`/menu?cartId=${cartId}`}
            />
          </div>

          <div className="min-w-0 sm:min-w-[200px] lg:min-w-0">
            <SideCard
                backgroundImage="bg-[url(/images/sushi/reservation-card.jpg)]"
                label="RESERVATION"
                href="/reservation"
            />
          </div>

          <div className="min-w-0 sm:min-w-[200px] lg:min-w-0">
            <SideCard
                backgroundImage="bg-[url(/images/sushi/restaurant-card.jpg)]"
                label="OUR RESTAURANT"
                href="/about"
            />
          </div>
        </div>
      </aside>
    </div>
  );
}
