import { createClient } from "@supabase/supabase-js";
import type { Listing } from "@/lib/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function getSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}

const LISTING_SELECT = `
  id, title, description, price, condition, distance_mi, same_day_eligible,
  icon_key, accent_hex, status,
  category:categories ( id, name, slug ),
  seller:sellers ( id, name, rating, review_count )
`;

export async function fetchListings(): Promise<Listing[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("listings")
    .select(LISTING_SELECT)
    .order("distance_mi", { ascending: true });

  if (error) throw error;
  return (data ?? []) as unknown as Listing[];
}

export async function fetchCategories() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name");

  if (error) throw error;
  return data ?? [];
}

export async function fetchRunners() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from("runners").select("id, name, vehicle, rating");

  if (error) throw error;
  return data ?? [];
}
