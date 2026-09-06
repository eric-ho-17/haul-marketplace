export type ListingCondition = "like_new" | "good" | "fair";
export type ListingStatus = "available" | "pending" | "sold";
export type OrderStatus =
  | "placed"
  | "heading_to_seller"
  | "picked_up"
  | "on_the_way"
  | "delivered"
  | "cancelled";

export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type Seller = {
  id: string;
  name: string;
  rating: number;
  review_count: number;
};

export type Runner = {
  id: string;
  name: string;
  vehicle: string;
  rating: number;
};

export type Listing = {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: ListingCondition;
  distance_mi: number;
  same_day_eligible: boolean;
  icon_key: string;
  accent_hex: string;
  status: ListingStatus;
  category: Category;
  seller: Seller;
};

export type CartLine = {
  listing: Listing;
  quantity: number;
};

export const CONDITION_LABEL: Record<ListingCondition, string> = {
  like_new: "Like New",
  good: "Good",
  fair: "Fair",
};
