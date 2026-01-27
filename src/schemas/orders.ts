import { z } from "zod";

// Address Schema
export const AddressSchema = z.object({
  street_and_number: z.string().optional().describe("Street and house number"),
  city: z.string().optional().describe("City"),
  postal_code: z.string().optional().describe("Postal code"),
  country: z.string().optional().describe("Country")
}).strict();

// Marketplace Buyer Schema
export const MarketplaceBuyerSchema = z.object({
  email: z.string().email().describe("Buyer's email address"),
  first_name: z.string().optional().describe("Buyer's first name"),
  last_name: z.string().optional().describe("Buyer's last name"),
  phone_number: z.string().optional().describe("Buyer's phone number"),
  address: AddressSchema.optional().describe("Buyer's address")
}).strict();

// Transaction Schema
export const TransactionSchema = z.object({
  amount: z.number().positive().describe("Transaction amount (decimal, e.g., 10.00)"),
  id: z.string().optional().describe("External transaction ID (will be prefixed with portal ID)")
}).strict();

// IPN Order Payment Schema
export const IpnOrderPaymentSchema = z.object({
  marketplace_buyer: MarketplaceBuyerSchema.describe("Buyer information"),
  course_ids: z.array(z.number().int().positive()).min(1).describe("List of course IDs to unlock"),
  id: z.string().optional().describe("External order ID (will be prefixed with portal ID)"),
  transaction: TransactionSchema.optional().describe("Transaction information")
}).strict();

// Type exports
export type AddressInput = z.infer<typeof AddressSchema>;
export type MarketplaceBuyerInput = z.infer<typeof MarketplaceBuyerSchema>;
export type TransactionInput = z.infer<typeof TransactionSchema>;
export type IpnOrderPaymentInput = z.infer<typeof IpnOrderPaymentSchema>;
