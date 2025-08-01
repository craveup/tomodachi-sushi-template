import RestaurantHero from "@/components/crave-ui/layout-components/restaurant-hero";

export default function RestaurantHeroDemo() {
  return (
    <div className="w-full max-w-sm mx-auto" style={{ zoom: 0.8 }}>
      <RestaurantHero
        restaurantName="Sakura Stone"
        heroImageUrl="/images/food/kaiseki-tasting.jpg"
        address="123 Cherry Blossom Street, Tokyo District"
        operatingHours="Online ordering hours: 11:00 AM - 10:00 PM"
        pickupTime="15 min"
        onChangeLocation={() => console.log("Change location clicked")}
        onDeliveryClick={() => console.log("Delivery clicked")}
        onPickupClick={() => console.log("Pickup clicked")}
      />
    </div>
  );
}
