export interface Category {
  productIds: string[];
  name: string;
  id: string;
}

export interface Menu {
  id: string;
  name: string;
  isActive: boolean;
  time: string;
  categories: Category[];
}

export interface Product {
  id: string;
  description: string;
  availability: string;
  images: string[];
  name: string;
  price: string;
  modifiers: Modifier[];
}

// Production description

export interface ModifierItem {
  id: string;
  name: string;
  price: string;
  maxQuantity: number;
}

export interface Modifier {
  id: string;
  name: string;
  description?: string;
  isFixed: boolean;
  required: boolean;
  quantity: number;
  items: ModifierItem[];
}

export interface ProductDescription {
  id: string;
  description: string;
  availability: string;
  images: string[];
  name: string;
  price: string;
  modifiers: Modifier[];
}

export interface SelectedModifierTypes {
  groupId: string;
  selectedOptions: { id: string; quantity: number }[];
}
