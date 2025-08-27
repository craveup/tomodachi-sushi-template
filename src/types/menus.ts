type Modifier = {
  id: string;
  name: string;
  description: string;
  isFixed: boolean;
  required: boolean;
  quantity: number;
  items: any[];
};

export type BundleProduct = {
  id: string;
  name: string;
  price: string | number;
  description?: string;
  availability?: any;
  images: string[];
  modifiers: Modifier[];
};

export type BundleCategory = {
  id: string;
  name: string;
  products: BundleProduct[];
};

export type BundleMenu = {
  id: string;
  name: string;
  isActive: boolean;
  time: string;
  categories: BundleCategory[];
};
