-- Illustrative catalog data. Not real Facebook Marketplace listings.

insert into public.categories (name, slug) values
  ('Furniture', 'furniture'),
  ('Electronics', 'electronics'),
  ('Home & Decor', 'home-decor'),
  ('Outdoor', 'outdoor'),
  ('Sporting Goods', 'sporting-goods'),
  ('Music & Hobbies', 'music-hobbies'),
  ('Free', 'free');

insert into public.sellers (name, rating, review_count) values
  ('Dana R.', 4.8, 32),
  ('Priya K.', 4.9, 58),
  ('Tom W.', 4.7, 19),
  ('Grace L.', 5.0, 11),
  ('Marcus F.', 4.8, 27),
  ('Aisha B.', 4.9, 14),
  ('The Ortiz Family', 4.6, 8),
  ('Nora S.', 4.9, 41),
  ('Wendell P.', 4.5, 6),
  ('Jalen T.', 4.8, 23),
  ('El Vargas', 4.7, 15),
  ('Sam & Kit', 4.9, 9);

insert into public.runners (name, vehicle, rating) values
  ('Marcus D.', 'Silver Honda CR-V', 4.9),
  ('Renee A.', 'Black Toyota Sienna', 4.95),
  ('Deshawn O.', 'White Ford Transit Connect', 4.8),
  ('Lily C.', 'Blue Subaru Outback', 4.9);

insert into public.listings
  (title, description, price, condition, category_id, seller_id, distance_mi, same_day_eligible, icon_key, accent_hex, status)
values
  ('Mid-century record cabinet',
   'Walnut-veneer console, holds a turntable plus roughly 120 LPs. Minor surface scuffing on top, hinges are solid.',
   145, 'good', (select id from public.categories where slug = 'furniture'), (select id from public.sellers where name = 'Dana R.'),
   2.4, true, 'chair', '#26415B', 'available'),

  ('Boucle swivel accent chair',
   'Cream boucle, barely sat in — bought for a room that got repainted a different color. Smoke-free home.',
   180, 'like_new', (select id from public.categories where slug = 'furniture'), (select id from public.sellers where name = 'Grace L.'),
   4.6, true, 'chair', '#6E4B8A', 'available'),

  ('Solid oak bookshelf, 5-shelf',
   'Heavy, real wood, one shelf has a hairline crack near the edge but holds weight fine.',
   85, 'fair', (select id from public.categories where slug = 'furniture'), (select id from public.sellers where name = 'Wendell P.'),
   5.2, false, 'shelf', '#5C7A52', 'available'),

  ('Queen platform bed frame',
   'Low-profile wood frame, no box spring needed. Disassembles into four pieces for pickup.',
   120, 'good', (select id from public.categories where slug = 'furniture'), (select id from public.sellers where name = 'El Vargas'),
   3.3, true, 'bed', '#8A5A2C', 'available'),

  ('Walnut writing desk',
   'Compact desk with one drawer, great for a small home office. A few pen marks on the surface.',
   95, 'good', (select id from public.categories where slug = 'furniture'), (select id from public.sellers where name = 'Sam & Kit'),
   1.9, true, 'desk', '#3E5C7A', 'available'),

  ('Three-seat linen sofa',
   'Neutral linen sofa from a smoke-free, pet-free home. Cushions still hold their shape.',
   260, 'good', (select id from public.categories where slug = 'furniture'), (select id from public.sellers where name = 'Nora S.'),
   6.1, false, 'sofa', '#26415B', 'available'),

  ('iPad Air, 2nd gen, 64GB',
   'Wi-Fi only. Battery holds a workday charge. Small chip on the back corner, screen is clean. Comes with a case.',
   95, 'fair', (select id from public.categories where slug = 'electronics'), (select id from public.sellers where name = 'Priya K.'),
   1.1, true, 'tablet', '#B8402A', 'available'),

  ('PS5 with two controllers',
   'Disc edition, includes two DualSense controllers and three games. Selling to fund a PC build.',
   340, 'good', (select id from public.categories where slug = 'electronics'), (select id from public.sellers where name = 'Jalen T.'),
   1.4, true, 'console', '#6E4B8A', 'available'),

  ('27" 4K monitor',
   'IPS panel, barely used, includes original box and cables. No dead pixels.',
   150, 'like_new', (select id from public.categories where slug = 'electronics'), (select id from public.sellers where name = 'The Ortiz Family'),
   2.7, true, 'monitor', '#3E5C7A', 'available'),

  ('Bluetooth speaker pair',
   'Matched stereo pair, great for a small apartment. Original charging cables included.',
   55, 'good', (select id from public.categories where slug = 'electronics'), (select id from public.sellers where name = 'Aisha B.'),
   0.9, true, 'speaker', '#5C7A52', 'available'),

  ('Weber kettle grill, 22"',
   'One summer of use, ash catcher included, grates freshly scrubbed. Lid latch works fine.',
   60, 'good', (select id from public.categories where slug = 'outdoor'), (select id from public.sellers where name = 'Tom W.'),
   3.8, true, 'grill', '#B8402A', 'available'),

  ('Cast iron patio table set',
   'Table plus two chairs, built for weather. Small rust spot on one leg, doesn''t affect stability.',
   210, 'fair', (select id from public.categories where slug = 'outdoor'), (select id from public.sellers where name = 'Marcus F.'),
   4.0, true, 'patio', '#8A5A2C', 'available'),

  ('Two-person kayak',
   'Sit-on-top kayak, includes two paddles and life vests. A couple of surface scratches on the hull.',
   175, 'good', (select id from public.categories where slug = 'outdoor'), (select id from public.sellers where name = 'El Vargas'),
   5.8, false, 'kayak', '#3E5C7A', 'available'),

  ('Ceramic table lamp, set of 2',
   'Matching pair, linen shades, one small dent in a base you''d never notice once it''s plugged in.',
   40, 'like_new', (select id from public.categories where slug = 'home-decor'), (select id from public.sellers where name = 'Aisha B.'),
   0.8, true, 'lamp', '#6E4B8A', 'available'),

  ('KitchenAid stand mixer',
   'Classic tilt-head, includes whisk, paddle, and dough hook. Works great, a little flour dust in the base vents.',
   130, 'good', (select id from public.categories where slug = 'home-decor'), (select id from public.sellers where name = 'Nora S.'),
   3.1, true, 'mixer', '#B8402A', 'available'),

  ('Wool area rug, 8x10',
   'Hand-knotted, neutral pattern, professionally cleaned last month. No pet odor.',
   90, 'good', (select id from public.categories where slug = 'home-decor'), (select id from public.sellers where name = 'Grace L.'),
   2.2, true, 'rug', '#5C7A52', 'available'),

  ('Mid-century dresser, 6-drawer',
   'Solid construction, drawers glide smoothly after a recent wax. One handle was swapped and doesn''t quite match.',
   165, 'good', (select id from public.categories where slug = 'home-decor'), (select id from public.sellers where name = 'Dana R.'),
   3.6, true, 'dresser', '#26415B', 'available'),

  ('Trek FX2 hybrid bike, 54cm',
   'Recently tuned, new tires this spring. Great commuter bike, front rack included.',
   210, 'good', (select id from public.categories where slug = 'sporting-goods'), (select id from public.sellers where name = 'Marcus F.'),
   2.0, true, 'bike', '#3E5C7A', 'available'),

  ('Yamaha acoustic guitar',
   'Solid top, comes with a gig bag and a spare set of strings. Great first guitar.',
   110, 'like_new', (select id from public.categories where slug = 'music-hobbies'), (select id from public.sellers where name = 'Sam & Kit'),
   1.5, true, 'guitar', '#8A5A2C', 'available'),

  ('Moving box bundle, ~20 boxes',
   'Mixed sizes, flattened, some tape residue. Just finished our move and don''t want to toss them.',
   0, 'fair', (select id from public.categories where slug = 'free'), (select id from public.sellers where name = 'The Ortiz Family'),
   1.6, true, 'box', '#5C7A52', 'available'),

  ('Free toddler stroller, lightly used',
   'Outgrown, still folds and rolls smoothly. One small tear in the canopy fabric.',
   0, 'good', (select id from public.categories where slug = 'free'), (select id from public.sellers where name = 'Priya K.'),
   2.3, true, 'stroller', '#26415B', 'available');
