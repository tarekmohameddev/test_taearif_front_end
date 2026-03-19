import { z } from "zod";

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "البريد الإلكتروني أو رقم الجوال مطلوب"),
  password: z
    .string()
    .min(1, "كلمة المرور مطلوبة"),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
