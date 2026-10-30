export const ORDER_STATUSES = [
  "pendente",
  "confirmada",
  "enviada",
  "entregue",
  "cancelada",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const COUNTRIES = ["Portugal", "Angola"] as const;
export type Country = (typeof COUNTRIES)[number];

export const MAX_QUANTITY = 10;

/** Preço unitário em euros. Define ORDER_UNIT_PRICE no .env. */
const rawPrice = (process.env.ORDER_UNIT_PRICE ?? "0").replace(",", ".").replace(/[^0-9.]/g, "");
export const UNIT_PRICE = Number(rawPrice) || 0;

export type OrderAddress = {
  street: string;
  number: string;
  complement: string;
  city: string;
  postalCode: string;
  country: string;
};

export type Order = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  customerName: string;
  phone: string;
  email: string;
  address: OrderAddress;
  quantity: number;
  notes: string;
  unitPrice: number;
  total: number;
  createdAt: string;
  updatedAt: string;
};
