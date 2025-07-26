export const INVOICE_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  PAID: 'paid',
  CANCELLED: 'cancelled',
} as const;

export const CURRENCY_OPTIONS = {
  USD: 'USD',
  EUR: 'EUR',
} as const;

export const DISCOUNT_TYPES = {
  FIXED: 'fixed',
  PERCENTAGE: 'percentage',
} as const;

export const DEFAULT_TAX_RATE = 0;
export const DEFAULT_DISCOUNT = 0;