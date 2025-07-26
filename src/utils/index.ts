export * from './convertCurrencies';
export * from './generateInvoceNumber';
export * from './manageDate';

export const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const calculateTotal = (subtotal: number, taxRate: number, discount: number, discountType: 'fixed' | 'percentage') => {
  const taxAmount = subtotal * (taxRate / 100);
  const discountAmount = discountType === 'fixed' ? discount : (subtotal * (discount / 100));
  return subtotal + taxAmount - discountAmount;
};