import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Product name must be at least 2 characters"),
    sku: z.string().min(5, "SKU must be at least 5 characters"),
    price_cents: z.number().int().positive("Price must be a positive integer"),
    stock: z.number().int().min(0, "Stock cannot be negative"),
    supplier_id: z.string().uuid("Invalid Supplier ID format"),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid Product ID in URL"),
  }),
  body: z.object({
    name: z.string().min(2).optional(),
    price_cents: z.number().int().positive().optional(),
    stock: z.number().int().min(0).optional(),
  }),
});

export const deleteProductSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid Product ID in URL"),
  }),
});