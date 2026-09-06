import { Marketplace } from "@/components/marketplace";
import { fetchCategories, fetchListings, fetchRunners } from "@/lib/supabase";

export const revalidate = 0;

export default async function Home() {
  const [listings, categories, runners] = await Promise.all([
    fetchListings(),
    fetchCategories(),
    fetchRunners(),
  ]);

  return <Marketplace listings={listings} categories={categories} runners={runners} />;
}
