import { z } from "zod";

export const addCardSchema = z.object({
    name_on_card: z.string().min(2, "Name is required"),
    card_number: z.string().min(12).max(16),
    expiry_month: z.string().min(1).max(2),
    expiry_year: z.string().min(2).max(4),
});

export type AddCardSchemaType = z.infer<typeof addCardSchema>;

export const addAmountSchema = z.object({
    amount: z.coerce.number<number>()
        .min(1, "Amount must be greater than 0"),
});
export type AddAmountSchemaType = z.infer<typeof addAmountSchema>;