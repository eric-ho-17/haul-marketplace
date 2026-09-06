import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function SiteHeader({
  cartCount,
  onCartClick,
}: {
  cartCount: number;
  onCartClick: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-3.5">
        <a href="#" className="font-heading text-2xl font-black tracking-tight">
          Haul<span className="text-primary">.</span>
        </a>

        <div className="flex min-w-0 items-center gap-2 rounded-full border bg-card px-3.5 py-1.5 text-sm font-semibold text-muted-foreground">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
            <path d="M12 21s-7-6.2-7-11.2A7 7 0 0 1 19 9.8C19 14.8 12 21 12 21z" />
            <circle cx="12" cy="9.5" r="2.4" />
          </svg>
          <span className="hidden sm:inline">
            Delivering to <strong className="text-foreground">Austin, TX</strong>
          </span>
        </div>

        <div className="flex-1" />

        <Button
          variant="outline"
          size="icon"
          className="relative h-11 w-11 rounded-xl"
          onClick={onCartClick}
          aria-label="Open cart"
        >
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M3 4h2l2.4 12.4a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.6L21 8H6" />
            <circle cx="10" cy="21" r="1.4" fill="currentColor" stroke="none" />
            <circle cx="17" cy="21" r="1.4" fill="currentColor" stroke="none" />
          </svg>
          {cartCount > 0 && (
            <Badge className="absolute -right-1.5 -top-1.5 h-[18px] min-w-[18px] justify-center rounded-full border-0 bg-destructive p-0 font-mono text-[11px] text-white">
              {cartCount}
            </Badge>
          )}
        </Button>
      </div>
    </header>
  );
}
