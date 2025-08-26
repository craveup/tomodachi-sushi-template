import SideCard from "@/app/components/side-card";

const sideCards = [
  {
    backgroundImage: "bg-[url(/images/sushi/menu-card.jpg)]",
    label: "MENU",
    href: "/menu",
  },
  {
    backgroundImage: "bg-[url(/images/sushi/reservation-card.jpg)]",
    label: "RESERVATION",
    href: "/reservation",
  },
  {
    backgroundImage: "bg-[url(/images/sushi/restaurant-card.jpg)]",
    label: "OUR RESTAURANT",
    href: "/about",
  },
];

export default function SideCards() {
  return (
    <div>
      <aside className="flex flex-col lg:w-[420px] lg:h-full lg:max-h-full lg:overflow-y-auto lg:pr-1 gap-3 lg:gap-[15px] overscroll-contain">
        {/* Mobile: Show as horizontal scroll on very small screens */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3 lg:gap-[15px] overflow-x-auto lg:overflow-x-visible pb-1">
          {sideCards.map((card, index) => (
            <div key={index} className="min-w-0 sm:min-w-[200px] lg:min-w-0">
              <SideCard
                backgroundImage={card.backgroundImage}
                label={card.label}
                href={card.href}
              />
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
