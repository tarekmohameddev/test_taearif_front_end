import { z } from "zod";

export const identifierSchema = z.object({
  identifier: z.string().min(1, "البريد الإلكتروني أو رقم الجوال مطلوب"),
});

export const resetPasswordSchema = z
  .object({
    code: z
      .string()
      .length(5, "رمز التحقق يجب أن يتكون من 5 أرقام")
      .regex(/^\d{5}$/, "رمز التحقق يجب أن يحتوي على أرقام فقط"),
    newPassword: z
      .string()
      .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "كلمة المرور غير متطابقة",
    path: ["confirmPassword"],
  });

export type IdentifierSchemaType = z.infer<typeof identifierSchema>;
export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;
