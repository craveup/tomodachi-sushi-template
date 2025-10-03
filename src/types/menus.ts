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
  time?: string;
  // Some payloads include additional metadata such as description or time ranges
  timeRange?: string;
  description?: string;
  categories: BundleCategory[];
};
export type MenusResponse = {
  menus: BundleMenu[];
  popularProducts: BundleProduct[];
};

