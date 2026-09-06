import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ListingIcon } from "@/lib/icons";
import type { CartLine } from "@/lib/types";
import { formatMoney, DELIVERY_FEE, serviceFee } from "@/lib/pricing";

export function CartSheet({
  open,
  onOpenChange,
  lines,
  onRemove,
  onCheckout,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lines: CartLine[];
  onRemove: (listingId: string) => void;
  onCheckout: () => void;
}) {
  const subtotal = lines.reduce((s, l) => s + l.listing.price * l.quantity, 0);
  const service = serviceFee(subtotal);
  const total = subtotal + DELIVERY_FEE + service;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-heading text-2xl">Your Haul</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4">
          {lines.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center text-sm text-muted-foreground">
              <ListingIcon iconKey="box" className="h-10 w-10 opacity-50" />
              Your Haul is empty. Add a listing to get it delivered today.
            </div>
          ) : (
            <div className="flex flex-col">
              {lines.map((line) => (
                <div key={line.listing.id} className="flex gap-3 border-b py-3">
                  <div
                    className="flex h-13 w-13 shrink-0 items-center justify-center rounded-md text-white"
                    style={{ backgroundColor: line.listing.accent_hex, width: 52, height: 52 }}
                  >
                    <ListingIcon iconKey={line.listing.icon_key} className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold">{line.listing.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {line.listing.category.name} · {line.listing.condition.replace("_", " ")}
                    </div>
                    <button
                      className="mt-1 text-[11px] font-bold text-destructive underline"
                      onClick={() => onRemove(line.listing.id)}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="self-center font-mono text-sm font-bold">
                    {formatMoney(line.listing.price * line.quantity, { free: true })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {lines.length > 0 && (
          <SheetFooter className="border-t pt-4">
            <div className="w-full space-y-1.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-mono">{formatMoney(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Same-day delivery</span>
                <span className="font-mono">{formatMoney(DELIVERY_FEE)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Service fee</span>
                <span className="font-mono">{formatMoney(service)}</span>
              </div>
              <div className="flex justify-between border-t pt-2 text-base font-bold">
                <span>Total</span>
                <span className="font-mono">{formatMoney(total)}</span>
              </div>
            </div>
            <Button size="lg" className="w-full font-bold" onClick={onCheckout}>
              Go to checkout
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
