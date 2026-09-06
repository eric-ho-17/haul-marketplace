import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ListingIcon } from "@/lib/icons";
import { CONDITION_LABEL, type Listing } from "@/lib/types";
import { formatMoney } from "@/lib/pricing";
import { cn } from "@/lib/utils";

export function ListingCard({
  listing,
  onSelect,
}: {
  listing: Listing;
  onSelect: (listing: Listing) => void;
}) {
  const disabled = !listing.same_day_eligible;

  return (
    <Card
      role="button"
      tabIndex={0}
      aria-disabled={disabled}
      onClick={() => onSelect(listing)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect(listing);
      }}
      className={cn(
        "group cursor-pointer overflow-hidden py-0 gap-0 transition-transform hover:-translate-y-0.5",
        disabled && "opacity-55 cursor-not-allowed hover:translate-y-0"
      )}
    >
      <div
        className="relative flex h-32 items-center justify-center text-white"
        style={{ backgroundColor: listing.accent_hex }}
      >
        <div className="absolute inset-x-2 top-2 flex items-start justify-between">
          <Badge
            className={cn(
              "font-mono text-[10px] uppercase tracking-wide border-0",
              listing.same_day_eligible
                ? "bg-primary text-primary-foreground"
                : "bg-black/45 text-white"
            )}
          >
            {listing.same_day_eligible ? "Same-day" : "Not eligible"}
          </Badge>
          <Badge className="border-0 bg-black/30 font-mono text-[10px] text-white">
            {listing.distance_mi} mi
          </Badge>
        </div>
        <ListingIcon iconKey={listing.icon_key} className="h-11 w-11" />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        <div className="text-[15px] font-semibold leading-tight">{listing.title}</div>
        <div className="flex justify-between gap-2 text-xs text-muted-foreground">
          <span>{listing.category.name}</span>
          <span>
            {listing.seller.name} · {listing.seller.rating.toFixed(1)}★
          </span>
        </div>
        <div className="mt-auto flex items-center justify-between pt-1.5">
          <span className="font-mono text-base font-bold text-accent">
            {formatMoney(listing.price, { free: true })}
          </span>
          <span className="rounded border px-1.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
            {CONDITION_LABEL[listing.condition]}
          </span>
        </div>
      </div>
    </Card>
  );
}
