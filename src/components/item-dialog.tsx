import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ListingIcon } from "@/lib/icons";
import { CONDITION_LABEL, type Listing } from "@/lib/types";
import { formatMoney } from "@/lib/pricing";

export function ItemDialog({
  listing,
  open,
  onOpenChange,
  onAddToHaul,
}: {
  listing: Listing | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddToHaul: (listing: Listing) => void;
}) {
  if (!listing) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton className="max-w-lg gap-0 overflow-hidden p-0">
        <div
          className="flex h-48 items-center justify-center text-white"
          style={{ backgroundColor: listing.accent_hex }}
        >
          <ListingIcon iconKey={listing.icon_key} className="h-16 w-16" />
        </div>
        <div className="p-6">
          <DialogHeader className="items-start gap-2 text-left">
            <DialogTitle className="font-heading text-2xl">{listing.title}</DialogTitle>
            <DialogDescription className="sr-only">
              Listing detail for {listing.title}
            </DialogDescription>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="rounded border px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                {listing.category.name}
              </span>
              <span className="rounded border px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                {CONDITION_LABEL[listing.condition]}
              </span>
              <span className="rounded border px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                {listing.distance_mi} mi away
              </span>
            </div>
          </DialogHeader>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {listing.description}
          </p>

          <div className="my-4 flex items-center gap-3 border-y border-dashed py-3">
            <Avatar>
              <AvatarFallback className="bg-accent font-bold text-accent-foreground">
                {listing.seller.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm font-semibold">{listing.seller.name}</div>
              <div className="text-xs text-muted-foreground">
                Selling · {listing.seller.rating.toFixed(1)} ★ ({listing.seller.review_count})
              </div>
            </div>
          </div>

          <div className="mb-4 flex items-baseline justify-between">
            <span className="text-xs text-muted-foreground">Item price</span>
            <span className="font-mono text-2xl font-bold text-accent">
              {formatMoney(listing.price, { free: true })}
            </span>
          </div>

          {listing.same_day_eligible ? (
            <Button
              size="lg"
              className="w-full font-bold"
              onClick={() => onAddToHaul(listing)}
            >
              Add to Haul — get it today
            </Button>
          ) : (
            <div>
              <Button size="lg" className="w-full font-bold" disabled>
                Outside today&rsquo;s delivery radius
              </Button>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                This seller is a bit far for same-day pickup today. Check back — the radius
                grows as more runners come online nearby.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
