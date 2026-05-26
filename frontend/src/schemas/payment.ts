import { z } from "zod";
const currentYear = new Date().getFullYear(); // e.g., 2026
const maxYear = currentYear + 100;

export const addCardSchema = z.object({
    name_on_card: z.string().min(2, "Name is required"),
    card_number: z.string()
        .min(12, "Card number is too short")
        .max(16, "Card number is too long")
        .regex(/^\d+$/, "Card number must contain only digits"),
    expiry_month: z.string()
        .regex(/^(0[1-9]|1[0-2])$/, "Month must be between 01 and 12"),
    expiry_year: z.string()
        .regex(/^\d{4}$/, "Year must be a 4-digit number")
        .refine((val) => {
            const year = parseInt(val, 10);
            return year >= currentYear && year <= maxYear;
        }, {
            message: `Year must be between ${currentYear} and ${maxYear}`,
        }),
}).refine((data) => {
    const year = parseInt(data.expiry_year, 10);
    const month = parseInt(data.expiry_month, 10);
    const currentMonth = new Date().getMonth() + 1;

    if (year === currentYear && month < currentMonth) {
        return false;
    }
    return true;
}, {
    message: "The expiration date has already passed",
    path: ["expiry_month"],
});

export type AddCardSchemaType = z.infer<typeof addCardSchema>;

export const addAmountSchema = z.object({
    amount: z.coerce.number<number>()
        .min(1, "Amount must be greater than 0"),
});
export type AddAmountSchemaType = z.infer<typeof addAmountSchema>;