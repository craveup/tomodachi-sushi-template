import * as React from "react";
import { Plus, Heart, Clock, Star, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "./card";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";
import Image from "next/image";

export interface MenuItemCardProps {
  className?: string;
  variant?: "detailed" | "compact" | "preview";
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  image?: string;
  category?: string;
  prepTime?: number;
  rating?: number;
  reviewCount?: number;
  isPopular?: boolean;
  isNew?: boolean;
  isSpicy?: boolean;
  spiceLevel?: 1 | 2 | 3;
  dietary?: string[];
  allergens?: string[];
  calories?: number;
  isAvailable?: boolean;
  onAddToCart?: (item: any) => void;
  onFavorite?: (item: any) => void;
  isFavorited?: boolean;
  showNutrition?: boolean;
  showDetailDialog?: boolean;
  badge?: string;
}

export function MenuItemCard({
  className,
  variant = "detailed",
  name,
  description,
  price,
  originalPrice,
  image,
  category,
  prepTime,
  rating,
  reviewCount,
  isPopular,
  isNew,
  isSpicy,
  spiceLevel,
  dietary = [],
  allergens = [],
  calories,
  isAvailable = true,
  onAddToCart,
  onFavorite,
  isFavorited = false,
  showNutrition = false,
  showDetailDialog = false,
  badge,
  ...props
}: MenuItemCardProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleAddToCart = () => {
    if (!isAvailable) return;

    const item = {
      name,
      description,
      price,
      image,
      category,
      dietary,
      allergens,
      calories,
    };

    onAddToCart?.(item);
  };

  const handleFavorite = () => {
    const item = { name, price, image };
    onFavorite?.(item);
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getSpiceIndicator = () => {
    if (!isSpicy || !spiceLevel) return null;
    return "🌶️".repeat(spiceLevel);
  };

  // Compact variant - minimal card for lists
  if (variant === "compact") {
    return (
      <Card
        className={cn(
          "group overflow-hidden transition-all duration-200 hover:shadow-md",
          !isAvailable && "opacity-60",
          className
        )}
        {...props}
      >
        <CardContent className="p-4">
          <div className="flex gap-4">
            {image && (
              <Image
                src={image}
                alt={name}
                width={80}
                height={80}
                className="h-20 w-20 rounded object-cover"
                loading="lazy"
              />
            )}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{name}</h3>
                  {description && (
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    {dietary.map((diet) => (
                      <Badge key={diet} variant="outline" className="text-xs">
                        {diet}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold">{formatPrice(price)}</span>
                  {originalPrice && originalPrice > price && (
                    <span className="text-sm text-muted-foreground line-through block">
                      {formatPrice(originalPrice)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={!isAvailable}
              className="self-center"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Preview variant - image-focused for carousels
  if (variant === "preview") {
    return (
      <Card
        className={cn(
          "group relative overflow-hidden transition-all duration-200 hover:shadow-lg cursor-pointer",
          !isAvailable && "opacity-60",
          className
        )}
        {...props}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover transition-transform duration-200 group-hover:scale-105"
              sizes="100vw"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}

          {badge && (
            <Badge className="absolute top-2 left-2 bg-primary hover:bg-primary/90">
              {badge}
            </Badge>
          )}

          {!isAvailable && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <Badge variant="destructive" className="text-sm">
                Sold Out
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <div className="space-y-1">
            <h3 className="font-semibold leading-tight">{name}</h3>
            <p className="font-bold text-lg">{formatPrice(price)}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Detailed variant - full information card
  const cardContent = (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-200 hover:shadow-lg flex flex-col h-full",
        !isAvailable && "opacity-60",
        className
      )}
      {...props}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden bg-muted">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-105"
            sizes="100vw"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}

        {/* Overlay Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {badge && (
            <Badge className="bg-primary hover:bg-primary/90">{badge}</Badge>
          )}
          {isNew && (
            <Badge className="bg-green-500 hover:bg-green-600">New</Badge>
          )}
          {isPopular && (
            <Badge className="bg-orange-500 hover:bg-orange-600">Popular</Badge>
          )}
          {!isAvailable && <Badge variant="destructive">Sold Out</Badge>}
        </div>

        {/* Favorite Button */}
        {onFavorite && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 bg-white/80 hover:bg-white"
            onClick={(e) => {
              e.stopPropagation();
              handleFavorite();
            }}
          >
            <Heart
              className={cn(
                "h-4 w-4",
                isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"
              )}
            />
          </Button>
        )}
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold leading-tight">{name}</h3>
            {category && (
              <p className="text-sm text-muted-foreground">{category}</p>
            )}
          </div>

          <div className="text-right">
            <div className="flex items-center gap-1">
              {originalPrice && originalPrice > price && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
              <span className="font-bold text-lg">{formatPrice(price)}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 flex-1 flex flex-col">
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {description}
          </p>
        )}

        {/* Meta Information */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          {prepTime && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{prepTime} min</span>
            </div>
          )}

          {rating && (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>{rating}</span>
              {reviewCount && <span>({reviewCount})</span>}
            </div>
          )}

          {calories && showNutrition && <span>{calories} cal</span>}

          {getSpiceIndicator() && <span>{getSpiceIndicator()}</span>}
        </div>

        {/* Dietary and Allergen Badges */}
        {(dietary.length > 0 || allergens.length > 0) && (
          <div className="flex flex-wrap gap-1 mb-3">
            {dietary.map((diet) => (
              <Badge key={diet} variant="secondary" className="text-xs">
                {diet}
              </Badge>
            ))}
            {allergens.length > 0 && (
              <Badge
                variant="outline"
                className="text-xs text-orange-600 border-orange-200"
              >
                <AlertTriangle className="h-3 w-3 mr-1" />
                Contains allergens
              </Badge>
            )}
          </div>
        )}

        {/* Spacer to push footer to bottom */}
        <div className="flex-1" />
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={!isAvailable}
          className="w-full"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          {isAvailable ? "Add to Cart" : "Unavailable"}
        </Button>
      </CardFooter>
    </Card>
  );

  if (showDetailDialog) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <div className="cursor-pointer">{cardContent}</div>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{name}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {image && (
              <Image
                src={image}
                alt={name}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                loading="lazy"
              />
            )}

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Price:</span>
                <span className="font-bold text-lg">{formatPrice(price)}</span>
              </div>

              {calories && (
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Calories:</span>
                  <span>{calories}</span>
                </div>
              )}

              {prepTime && (
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Prep Time:</span>
                  <span>{prepTime} minutes</span>
                </div>
              )}
            </div>

            {allergens.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Allergens:</h4>
                <div className="flex flex-wrap gap-1">
                  {allergens.map((allergen) => (
                    <Badge
                      key={allergen}
                      variant="outline"
                      className="text-orange-600 border-orange-200"
                    >
                      {allergen}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={handleAddToCart}
              disabled={!isAvailable}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              {isAvailable ? "Add to Cart" : "Unavailable"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return cardContent;
}
