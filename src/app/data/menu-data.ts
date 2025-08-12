import { MenuItem } from "../types";

export const menuData: Record<string, MenuItem[]> = {
  "nigiri-sashimi": [
    {
      id: "bluefin-tuna-hon-maguro",
      name: "Bluefin Tuna (Hon-Maguro)",
      description:
        "Chutoro & Otoro cuts, line-caught from Oma or sustainable Pacific source. Served with freshly grated wasabi.",
      price: 18.0,
      image: "/images/sushi/menu-items/chutoro-otoro.png",
      category: "nigiri-sashimi",
      calories: 180,
      isPopular: true,
    },
    {
      id: "golden-eye-snapper-kinmedai",
      name: "Golden Eye Snapper (Kinmedai)",
      description: "Lightly seared skin, brushed with soy, touch of yuzu zest.",
      price: 12.0,
      image:
        "/images/sushi/menu-items/applemango182_httpss.mj.runhAEyh8YnRl4_httpss.mj.runNocQSx9Jv_010c50db-72b1-4146-825f-0cb14adf4ef7_1.png",
      category: "nigiri-sashimi",
      calories: 150,
    },
    {
      id: "santa-barbara-uni",
      name: "Santa Barbara Uni",
      description: "Local sea urchin over warm shari, wrapped in crisp nori.",
      price: 16.0,
      image:
        "/images/sushi/menu-items/20250811_2320_Cinematic Uni Nigiri_simple_compose_01k2eextaqeqwsz2n3wyk11hxx.png",
      category: "nigiri-sashimi",
      calories: 110,
    },
    {
      id: "japanese-mackerel-aji",
      name: "Japanese Mackerel (Aji)",
      description:
        "Marinated in rice vinegar, topped with ginger and scallion.",
      price: 10.0,
      image: "/images/sushi/menu-items/image.png",
      category: "nigiri-sashimi",
      calories: 130,
    },
  ],
  "seasonal-rolls-handrolls": [
    {
      id: "malibu-sunset-roll",
      name: "Malibu Sunset Roll",
      description: "Salmon, avocado, mango, chili-lime ponzu.",
      price: 19.0,
      image:
        "/images/sushi/menu-items/20250811_2324_Sushi Perfection Delight_simple_compose_01k2ef54b0e04te4ych7f0tknh.png",
      category: "seasonal-rolls-handrolls",
      calories: 240,
    },
    {
      id: "pacific-rock-crab-handroll",
      name: "Pacific Rock Crab Handroll",
      description: "Local Dungeness crab, cucumber, touch of yuzu mayo.",
      price: 14.0,
      image:
        "/images/sushi/menu-items/20250811_2328_Temaki Delight_simple_compose_01k2efcy6ges3v6hka3fhnmgz3.png",
      category: "seasonal-rolls-handrolls",
      calories: 180,
    },
    {
      id: "summer-shiso-roll",
      name: "Summer Shiso Roll",
      description: "Yellowtail, shiso leaf, cucumber, umeboshi paste.",
      price: 17.0,
      image:
        "/images/sushi/menu-items/20250811_2330_Sushi Roll Close-Up_simple_compose_01k2efgrn6e8daarkjvt4rmw34.png",
      category: "seasonal-rolls-handrolls",
      calories: 200,
    },
    {
      id: "grilled-eel-avocado-roll",
      name: "Grilled Eel & Avocado Roll",
      description: "Sweet unagi glaze, sesame seeds.",
      price: 21.0,
      image:
        "/images/sushi/menu-items/20250811_2332_Grilled Eel Uramaki_simple_compose_01k2efk0xgf4as419t8qr0fc46.png",
      category: "seasonal-rolls-handrolls",
      calories: 260,
    },
    {
      id: "santa-monica-veggie-handroll",
      name: "Santa Monica Veggie Handroll",
      description: "Farmer's market vegetables, miso sesame sauce.",
      price: 15.0,
      image:
        "/images/sushi/menu-items/20250811_2332_Vegetable Temaki Delight_simple_compose_01k2efk8jvenns9h1ma6ywn5av.png",
      category: "seasonal-rolls-handrolls",
      calories: 160,
      isGlutenFree: true,
    },
    {
      id: "spicy-tuna-crispy-roll",
      name: "Spicy Tuna Crispy Roll",
      description: "Tuna tartare with jalapeño, on tempura rice base.",
      price: 22.0,
      image:
        "/images/sushi/menu-items/20250811_2337_Spicy Tuna Delight_simple_compose_01k2efvzyef7s91brvh0cky75p.png",
      category: "seasonal-rolls-handrolls",
      calories: 280,
    },
  ],
  "chefs-creations-warm-dishes": [
    {
      id: "wagyu-tataki-truffle-ponzu",
      name: "Wagyu Tataki with Truffle Ponzu",
      description: "Lightly seared A5 Wagyu, served chilled.",
      price: 42.0,
      image:
        "/images/sushi/menu-items/20250811_2338_Wagyu Tataki Delicacy_simple_compose_01k2efybzner7rvs0r8atwwxg3.png",
      category: "chefs-creations-warm-dishes",
      calories: 320,
      isPopular: true,
    },
    {
      id: "grilled-black-cod-miso",
      name: "Grilled Black Cod with Miso",
      description: "Classic Saikyo miso marinade, 48 hours.",
      price: 26.0,
      image: "/images/sushi/menu-items/20250811_2343_Miso Black Cod Elegance_simple_compose_01k2eg7azgezw8hat23jtkes06.png",
      category: "chefs-creations-warm-dishes",
      calories: 280,
    },
    {
      id: "pacific-abalone-sashimi",
      name: "Pacific Abalone Sashimi & Liver Sauce",
      description: "Served fresh with ponzu.",
      price: 34.0,
      image: "/images/sushi/menu-items/pacific-abalone-sashimi.jpg",
      category: "chefs-creations-warm-dishes",
      calories: 160,
    },
    {
      id: "lobster-tempura-yuzu-aioli",
      name: "Lobster Tempura with Yuzu Aioli",
      description: "Maine lobster tail in a crisp tempura batter.",
      price: 38.0,
      image: "/images/sushi/menu-items/lobster-tempura-yuzu-aioli.jpg",
      category: "chefs-creations-warm-dishes",
      calories: 340,
    },
    {
      id: "chawanmushi-uni-crab",
      name: "Chawanmushi with Uni & Crab",
      description:
        "Steamed egg custard topped with Santa Barbara uni and snow crab.",
      price: 24.0,
      image: "/images/sushi/menu-items/chawanmushi-uni-crab.jpg",
      category: "chefs-creations-warm-dishes",
      calories: 180,
    },
    {
      id: "seasonal-ankimo",
      name: "Seasonal Ankimo (Monkfish Liver)",
      description: "Served chilled with ponzu jelly.",
      price: 18.0,
      image: "/images/sushi/menu-items/seasonal-ankimo.jpg",
      category: "chefs-creations-warm-dishes",
      calories: 200,
      isNew: true,
    },
  ],
};
