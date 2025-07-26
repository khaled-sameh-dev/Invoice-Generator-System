export const Tabs = {
  GENERAL: "General",
  SERVICES: "Services",
  PAYMENT: "Payment",
} as const;
export type Tabs = (typeof Tabs)[keyof typeof Tabs];
