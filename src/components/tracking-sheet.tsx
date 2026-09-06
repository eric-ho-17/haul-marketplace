"use client";

import { useEffect, useRef, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ListingIcon } from "@/lib/icons";
import { getSupabaseClient } from "@/lib/supabase";
import type { CartLine, OrderStatus, Runner } from "@/lib/types";
import { cn } from "@/lib/utils";

const STEPS: { status: OrderStatus; title: string; detail: string }[] = [
  { status: "placed", title: "Order confirmed", detail: "Your Haul runner has been assigned." },
  { status: "heading_to_seller", title: "Heading to seller", detail: "Runner is on the way to pick up your item(s)." },
  { status: "picked_up", title: "Picked up", detail: "Item confirmed and loaded up." },
  { status: "on_the_way", title: "On the way to you", detail: "Runner is en route to your address." },
  { status: "delivered", title: "Delivered", detail: "Left at your door, as requested." },
];

const STEP_INTERVAL_MS = 4200;
const START_ETA_MIN = 42;

export type ActiveOrder = {
  id: string;
  lines: CartLine[];
};

export function TrackingSheet({
  open,
  onOpenChange,
  order,
  runners,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: ActiveOrder | null;
  runners: Runner[];
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [runner, setRunner] = useState<Runner | null>(null);
  const orderIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!order || !open) return;
    if (orderIdRef.current === order.id) return;
    orderIdRef.current = order.id;
    setStepIndex(0);
    setRunner(null);

    const supabase = getSupabaseClient();
    const chosenRunner = runners.length
      ? runners[Math.floor(Math.random() * runners.length)]
      : null;

    const timer = setInterval(() => {
      setStepIndex((prev) => {
        const next = Math.min(prev + 1, STEPS.length - 1);
        const step = STEPS[next];

        supabase.from("orders").update({ status: step.status }).eq("id", order.id).then();
        supabase.from("order_status_events").insert({ order_id: order.id, status: step.status }).then();
        if (step.status === "heading_to_seller" && chosenRunner) {
          setRunner(chosenRunner);
          supabase.from("orders").update({ runner_id: chosenRunner.id }).eq("id", order.id).then();
        }

        if (next === STEPS.length - 1) clearInterval(timer);
        return next;
      });
    }, STEP_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [order, open, runners]);

  if (!order) return null;

  const progress = stepIndex / (STEPS.length - 1);
  const pathX = 30 + progress * 240;
  const pathY = 90 - Math.sin(progress * Math.PI) * 40;
  const done = stepIndex === STEPS.length - 1;
  const etaMin = Math.max(0, Math.round(START_ETA_MIN * (1 - progress)));
  const itemNames = order.lines.map((l) => l.listing.title).join(", ");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-heading text-2xl">Order status</SheetTitle>
        </SheetHeader>

        <div className="flex-1 space-y-5 overflow-y-auto px-4 pb-6">
          <div className="overflow-hidden rounded-xl border">
            <svg viewBox="0 0 300 180" className="h-44 w-full bg-secondary">
              <g stroke="var(--border)" strokeWidth={1}>
                <line x1="0" y1="45" x2="300" y2="45" />
                <line x1="0" y1="90" x2="300" y2="90" />
                <line x1="0" y1="135" x2="300" y2="135" />
                <line x1="60" y1="0" x2="60" y2="180" />
                <line x1="150" y1="0" x2="150" y2="180" />
                <line x1="240" y1="0" x2="240" y2="180" />
              </g>
              <path
                d="M30 90 Q150 20 270 90"
                fill="none"
                stroke="var(--accent)"
                strokeWidth={2.5}
                strokeDasharray="6 5"
              />
              <circle cx={30} cy={90} r={5} fill="var(--destructive)" />
              <circle cx={270} cy={90} r={6} fill="var(--primary)" />
              <circle cx={pathX} cy={pathY} r={7} fill="var(--accent)" stroke="var(--card)" strokeWidth={2.5} />
            </svg>
          </div>

          <div className="text-center">
            <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              {done ? "Delivered" : "Estimated arrival"}
            </div>
            <div className="font-mono text-4xl font-bold tabular-nums text-accent">
              {done ? "🎉" : `${etaMin} min`}
            </div>
          </div>

          <div className="flex flex-col">
            {STEPS.map((step, i) => {
              const state = i < stepIndex ? "done" : i === stepIndex ? "active" : "upcoming";
              return (
                <div key={step.status} className="flex gap-3 pb-5 last:pb-0">
                  <div className="flex flex-col items-center">
                    <span
                      className={cn(
                        "h-3.5 w-3.5 rounded-full",
                        state === "upcoming" ? "bg-border" : "bg-accent",
                        state === "active" && "ring-4 ring-primary/25 bg-primary"
                      )}
                    />
                    {i < STEPS.length - 1 && (
                      <span className={cn("mt-1 w-0.5 flex-1", state === "done" ? "bg-accent" : "bg-border")} />
                    )}
                  </div>
                  <div>
                    <div className={cn("text-sm font-bold", state === "upcoming" && "text-muted-foreground")}>
                      {step.title}
                    </div>
                    <div className="text-xs text-muted-foreground">{step.detail}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {runner && (
            <div className="flex items-center gap-3 rounded-xl border bg-secondary p-3.5">
              <Avatar className="h-11 w-11">
                <AvatarFallback className="bg-accent font-bold text-accent-foreground">
                  {runner.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="text-sm font-bold">
                  {runner.name} · {runner.vehicle}
                </div>
                <div className="truncate text-xs text-muted-foreground">
                  {runner.rating.toFixed(2)} ★ · Carrying: {itemNames}
                </div>
              </div>
            </div>
          )}

          {done && (
            <p className="text-center text-xs leading-relaxed text-muted-foreground">
              Order delivered. Thanks for Hauling local — you kept a good find out of a
              landfill and skipped the drive.
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
