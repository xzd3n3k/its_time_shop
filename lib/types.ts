export type Category = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  category_id: string | null;
  image_url: string | null;
  stock: number;
  active: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
  categories?: Category;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type ShopSettings = {
  id: number;
  company_name: string;
  email: string;
  address: string;
  phone: string;
  bank_account: string;
};

export type Order = {
  id: string;
  order_number: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  customer_street: string;
  customer_city: string;
  customer_zip: string;
  payment_method: 'cash' | 'bank_transfer';
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: CartItem[];
  notes: string | null;
  created_at: string;
};
