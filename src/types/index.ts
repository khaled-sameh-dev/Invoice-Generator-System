import { z } from 'zod';
import { INVOICE_STATUS, CURRENCY_OPTIONS, DISCOUNT_TYPES } from '../constants';

// Common API State type
export interface ApiState<T> {
  data: T;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Re-export existing types
export * from './clientSelection';
export * from './navigationTabs';

// Common validation schemas
export const currencySchema = z.enum(Object.values(CURRENCY_OPTIONS) as [string, ...string[]]);
export const statusSchema = z.enum(Object.values(INVOICE_STATUS) as [string, ...string[]]);
export const discountTypeSchema = z.enum(Object.values(DISCOUNT_TYPES) as [string, ...string[]]);