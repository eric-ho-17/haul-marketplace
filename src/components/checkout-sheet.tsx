import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { CartLine } from "@/lib/types";
import { TIP_OPTIONS, formatMoney, orderTotal } from "@/lib/pricing";

export const DELIVERY_WINDOWS = [
  { id: "asap", label: "As soon as possible", eta: "Arrives in ~40–55 min" },
  { id: "afternoon", label: "Today, 2–4pm", eta: "Arrives in that window" },
  { id: "evening", label: "Today, 6–8pm", eta: "Arrives in that window" },
] as const;

export type DeliveryWindowId = (typeof DELIVERY_WINDOWS)[number]["id"];

export function CheckoutSheet({
  open,
  onOpenChange,
  lines,
  deliveryWindow,
  onDeliveryWindowChange,
  tip,
  onTipChange,
  onPlaceOrder,
  placing,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lines: CartLine[];
  deliveryWindow: DeliveryWindowId;
  onDeliveryWindowChange: (id: DeliveryWindowId) => void;
  tip: number;
  onTipChange: (tip: number) => void;
  onPlaceOrder: () => void;
  placing: boolean;
}) {
  const subtotal = lines.reduce((s, l) => s + l.listing.price * l.quantity, 0);
  const total = orderTotal(subtotal, tip);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-heading text-2xl">Checkout</SheetTitle>
        </SheetHeader>

        <div className="flex-1 space-y-6 overflow-y-auto px-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Deliver to
            </Label>
            <Input readOnly value="414 Maple Ave, Austin, TX 78702" className="bg-secondary" />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Delivery window
            </Label>
            <div className="flex flex-col gap-2">
              {DELIVERY_WINDOWS.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => onDeliveryWindowChange(w.id)}
                  className={cn(
                    "flex items-center justify-between rounded-lg border px-3.5 py-2.5 text-left transition-colors",
                    deliveryWindow === w.id ? "border-accent bg-secondary" : "border-border"
                  )}
                >
                  <div>
                    <div className="text-sm font-semibold">{w.label}</div>
                    <div className="text-xs text-muted-foreground">{w.eta}</div>
                  </div>
                  <span
                    className={cn(
                      "grid h-4 w-4 shrink-0 place-items-center rounded-full border-2",
                      deliveryWindow === w.id ? "border-accent" : "border-border"
                    )}
                  >
                    {deliveryWindow === w.id && (
                      <span className="h-2 w-2 rounded-full bg-accent" />
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Tip your runner
            </Label>
            <div className="flex gap-2">
              {TIP_OPTIONS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => onTipChange(t)}
                  className={cn(
                    "flex-1 rounded-lg border py-2.5 text-center font-mono text-sm font-bold transition-colors",
                    tip === t
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-border"
                  )}
                >
                  {t === 0 ? "No tip" : `$${t}`}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Payment
            </Label>
            <div className="flex items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-sm font-semibold">
              <svg width="22" height="15" viewBox="0 0 24 16" fill="none">
                <rect x="0.5" y="0.5" width="23" height="15" rx="2" stroke="currentColor" />
                <rect x="2" y="4" width="20" height="2.4" fill="currentColor" />
              </svg>
              Visa •••• 4242
            </div>
          </div>
        </div>

        <SheetFooter className="border-t pt-4">
          <div className="flex w-full justify-between text-base font-bold">
            <span>Total due</span>
            <span className="font-mono">{formatMoney(total)}</span>
          </div>
          <Button
            size="lg"
            className="w-full font-bold"
            disabled={lines.length === 0 || placing}
            onClick={onPlaceOrder}
          >
            {placing ? "Placing order…" : "Place order"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
