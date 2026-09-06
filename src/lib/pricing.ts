export const DELIVERY_FEE = 6.99;
export const SERVICE_RATE = 0.08;
export const TIP_OPTIONS = [0, 3, 5, 8];

export function formatMoney(amount: number, { free = false }: { free?: boolean } = {}) {
  if (free && amount === 0) return "Free";
  return `$${amount.toFixed(2)}`;
}

export function serviceFee(subtotal: number) {
  return subtotal * SERVICE_RATE;
}

export function orderTotal(subtotal: number, tip: number) {
  return subtotal + DELIVERY_FEE + serviceFee(subtotal) + tip;
}
