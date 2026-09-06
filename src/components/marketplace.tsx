"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { ListingCard } from "@/components/listing-card";
import { ItemDialog } from "@/components/item-dialog";
import { CartSheet } from "@/components/cart-sheet";
import { CheckoutSheet, DELIVERY_WINDOWS, type DeliveryWindowId } from "@/components/checkout-sheet";
import { TrackingSheet, type ActiveOrder } from "@/components/tracking-sheet";
import { getSupabaseClient } from "@/lib/supabase";
import type { CartLine, Category, Listing, Runner } from "@/lib/types";
import { orderTotal, serviceFee } from "@/lib/pricing";
import { cn } from "@/lib/utils";

export function Marketplace({
  listings,
  categories,
  runners,
}: {
  listings: Listing[];
  categories: Category[];
  runners: Runner[];
}) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [cart, setCart] = useState<Record<string, CartLine>>({});
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [itemOpen, setItemOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [trackingOpen, setTrackingOpen] = useState(false);
  const [deliveryWindow, setDeliveryWindow] = useState<DeliveryWindowId>("asap");
  const [tip, setTip] = useState(5);
  const [placing, setPlacing] = useState(false);
  const [activeOrder, setActiveOrder] = useState<ActiveOrder | null>(null);

  const cartLines = useMemo(() => Object.values(cart), [cart]);
  const cartCount = cartLines.reduce((s, l) => s + l.quantity, 0);
  const sameDayCount = useMemo(
    () => listings.filter((l) => l.same_day_eligible).length,
    [listings]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return listings.filter((l) => {
      const matchesCategory = activeCategory === "All" || l.category.name === activeCategory;
      const matchesQuery =
        !q || l.title.toLowerCase().includes(q) || l.category.name.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [listings, query, activeCategory]);

  function openItem(listing: Listing) {
    setSelectedListing(listing);
    setItemOpen(true);
  }

  function addToCart(listing: Listing) {
    setCart((prev) => ({
      ...prev,
      [listing.id]: { listing, quantity: (prev[listing.id]?.quantity ?? 0) + 1 },
    }));
    setItemOpen(false);
    setCartOpen(true);
    toast.success(`Added "${listing.title}" to your Haul`);
  }

  function removeFromCart(listingId: string) {
    setCart((prev) => {
      const next = { ...prev };
      delete next[listingId];
      return next;
    });
  }

  async function placeOrder() {
    if (cartLines.length === 0) return;
    setPlacing(true);
    const supabase = getSupabaseClient();
    const subtotal = cartLines.reduce((s, l) => s + l.listing.price * l.quantity, 0);
    const windowLabel = DELIVERY_WINDOWS.find((w) => w.id === deliveryWindow)?.label ?? "As soon as possible";

    try {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          buyer_name: "Guest Shopper",
          delivery_address: "414 Maple Ave, Austin, TX 78702",
          delivery_window: windowLabel,
          status: "placed",
          subtotal,
          service_fee: serviceFee(subtotal),
          tip,
          total: orderTotal(subtotal, tip),
        })
        .select("id")
        .single();

      if (orderError || !order) throw orderError;

      const { error: itemsError } = await supabase.from("order_items").insert(
        cartLines.map((l) => ({
          order_id: order.id,
          listing_id: l.listing.id,
          quantity: l.quantity,
          unit_price: l.listing.price,
        }))
      );
      if (itemsError) throw itemsError;

      await supabase.from("order_status_events").insert({ order_id: order.id, status: "placed" });

      setActiveOrder({ id: order.id, lines: cartLines });
      setCart({});
      setCheckoutOpen(false);
      setTrackingOpen(true);
    } catch (err) {
      console.error(err);
      toast.error("Couldn't place that order — please try again.");
    } finally {
      setPlacing(false);
    }
  }

  const chipCategories = ["All", ...categories.map((c) => c.name)];

  return (
    <div className="min-h-screen">
      <SiteHeader cartCount={cartCount} onCartClick={() => setCartOpen(true)} />

      <main className="mx-auto max-w-6xl px-6">
        <section className="border-b py-10 sm:py-12">
          <div className="grid gap-10 sm:grid-cols-[1.3fr_1fr] sm:items-end">
            <div>
              <h1 className="text-[2.6rem] leading-[0.95] sm:text-6xl">
                Someone&rsquo;s
                <br />
                castoff.
                <br />
                <span className="text-primary">Your porch,
                  <br />
                  by tonight.
                </span>
              </h1>
              <p className="mt-4 max-w-[46ch] text-base leading-relaxed text-muted-foreground">
                Haul runners pick up real listings from local sellers and bring them straight
                to your door — no driving to a stranger&rsquo;s garage, no &ldquo;still
                available?&rdquo; texts that go nowhere.
              </p>
            </div>
            <div className="flex flex-col gap-3.5">
              <StatRow value={String(sameDayCount)} label="Listings near you, right now" />
              <StatRow value="38 min" label="Average pickup-to-porch time" />
              <StatRow value="$0" label="Extra cost vs. picking it up yourself, first Haul" />
            </div>
          </div>

          <div className="mt-6">
            <div className="relative">
              <svg
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.3}
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search couches, bikes, mixers, monitors…"
                className="h-12 pl-10 text-[15px]"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {chipCategories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                  activeCategory === c
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border bg-card hover:border-accent/50"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </section>

        <section className="py-8">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-2xl">Nearby &amp; ready today</h2>
            <span className="font-mono text-xs text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "listing" : "listings"}
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="py-16 text-center text-sm text-muted-foreground">
              No listings match that search. Try a different category.
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-4 pb-14">
              {filtered.map((listing) => (
                <ListingCard key={listing.id} listing={listing} onSelect={openItem} />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t py-8">
        <p className="text-center text-xs text-muted-foreground">
          Haul is a concept demo — listings, runners, and prices are illustrative, not real
          marketplace data.
        </p>
      </footer>

      <ItemDialog
        listing={selectedListing}
        open={itemOpen}
        onOpenChange={setItemOpen}
        onAddToHaul={addToCart}
      />

      <CartSheet
        open={cartOpen}
        onOpenChange={setCartOpen}
        lines={cartLines}
        onRemove={removeFromCart}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />

      <CheckoutSheet
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        lines={cartLines}
        deliveryWindow={deliveryWindow}
        onDeliveryWindowChange={setDeliveryWindow}
        tip={tip}
        onTipChange={setTip}
        onPlaceOrder={placeOrder}
        placing={placing}
      />

      <TrackingSheet
        open={trackingOpen}
        onOpenChange={setTrackingOpen}
        order={activeOrder}
        runners={runners}
      />

      {cartCount > 0 && !cartOpen && !checkoutOpen && !trackingOpen && (
        <Button
          size="lg"
          className="fixed bottom-5 left-1/2 -translate-x-1/2 rounded-full font-bold shadow-lg"
          onClick={() => setCartOpen(true)}
        >
          View Haul · {cartCount} {cartCount === 1 ? "item" : "items"}
        </Button>
      )}
    </div>
  );
}

function StatRow({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-dashed pb-2.5">
      <span className="font-mono text-xl font-bold text-accent tabular-nums">{value}</span>
      <span className="text-right text-[12.5px] uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
    </div>
  );
}
