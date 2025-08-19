export interface ApiError {
  response?: {
    data?: {
      message?: string;
      code?: string;
    };
    status?: number;
  };
  message?: string;
}

export interface ProductDescriptionProps {
  productId: string;
  locationId: string;
  cartId: string;
  onClose: () => void;
  isAddToCartBlocked?: boolean;
}
