import { z } from "zod";

// Zod Schema for Asset Registration Form
export const assetRegistrationSchema = z.object({
  brand: z.string().min(1, "Brand is required").max(100, "Brand name is too long"),
  model: z.string().min(1, "Model is required").max(200, "Model name is too long"),
  refNumber: z.string().min(1, "Reference number is required").max(50, "Reference number is too long"),
  serialNumber: z.string().min(1, "Serial number is required").max(50, "Serial number is too long"),
  productionYear: z.number()
    .min(1900, "Production year must be after 1900")
    .max(new Date().getFullYear(), `Production year cannot be in the future`),
  conditionRating: z.enum(["Excellent", "Good", "Fair", "Poor"]),
  hasBox: z.boolean(),
  hasPapers: z.boolean(),
  description: z.string().optional(),
  estimatedValue: z.string().optional(),
  purchaseDate: z.string().optional(),
  purchasePrice: z.string().optional(),
});

// Type inference from schema
export type AssetFormData = z.infer<typeof assetRegistrationSchema>;
