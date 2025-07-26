const EXCHANGE_RATES = {
  USD: 1,
  EGP: 50,
};

type CurrencyCode = keyof typeof EXCHANGE_RATES;

export default function convertCurrency(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode
): number {
  if (from === to) return amount;
  return (amount / EXCHANGE_RATES[from]) * EXCHANGE_RATES[to];
}
