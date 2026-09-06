-- Haul marketplace schema
-- Public demo app: no user accounts, so orders are written directly by the
-- anon key under RLS policies scoped to what an anonymous shopper should do.

create extension if not exists pgcrypto;

create type public.listing_condition as enum ('like_new', 'good', 'fair');
create type public.listing_status as enum ('available', 'pending', 'sold');
create type public.order_status as enum (
  'placed',
  'heading_to_seller',
  'picked_up',
  'on_the_way',
  'delivered',
  'cancelled'
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique
);

create table public.sellers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  rating numeric(2, 1) not null default 5.0,
  review_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.runners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  vehicle text not null,
  rating numeric(2, 1) not null default 5.0,
  created_at timestamptz not null default now()
);

create table public.listings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  price numeric(10, 2) not null default 0,
  condition public.listing_condition not null,
  category_id uuid not null references public.categories (id),
  seller_id uuid not null references public.sellers (id),
  distance_mi numeric(4, 1) not null,
  same_day_eligible boolean not null default true,
  icon_key text not null,
  accent_hex text not null default '#26415B',
  status public.listing_status not null default 'available',
  created_at timestamptz not null default now()
);

create index listings_category_idx on public.listings (category_id);
create index listings_status_idx on public.listings (status);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  buyer_name text not null,
  delivery_address text not null,
  delivery_window text not null,
  runner_id uuid references public.runners (id),
  status public.order_status not null default 'placed',
  subtotal numeric(10, 2) not null,
  delivery_fee numeric(10, 2) not null default 6.99,
  service_fee numeric(10, 2) not null,
  tip numeric(10, 2) not null default 0,
  total numeric(10, 2) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  listing_id uuid not null references public.listings (id),
  quantity integer not null default 1,
  unit_price numeric(10, 2) not null
);

create index order_items_order_idx on public.order_items (order_id);

create table public.order_status_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  status public.order_status not null,
  occurred_at timestamptz not null default now()
);

create index order_status_events_order_idx on public.order_status_events (order_id);

create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger orders_set_updated_at
before update on public.orders
for each row
execute function public.set_updated_at();

-- Row level security: everything is publicly readable (it's a browseable
-- catalog). Orders can be created and progressed by anyone since there is
-- no auth layer in this demo, but reference data (listings, sellers,
-- categories, runners) can only be written via the service role / migrations.
alter table public.categories enable row level security;
alter table public.sellers enable row level security;
alter table public.runners enable row level security;
alter table public.listings enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_status_events enable row level security;

create policy "categories are publicly readable" on public.categories
for select using (true);

create policy "sellers are publicly readable" on public.sellers
for select using (true);

create policy "runners are publicly readable" on public.runners
for select using (true);

create policy "listings are publicly readable" on public.listings
for select using (true);

create policy "orders are publicly readable" on public.orders
for select using (true);

create policy "anyone can place an order" on public.orders
for insert with check (true);

create policy "anyone can advance an order's status" on public.orders
for update using (true) with check (true);

create policy "order items are publicly readable" on public.order_items
for select using (true);

create policy "anyone can add items to an order" on public.order_items
for insert with check (true);

create policy "order status events are publicly readable" on public.order_status_events
for select using (true);

create policy "anyone can log an order status event" on public.order_status_events
for insert with check (true);
