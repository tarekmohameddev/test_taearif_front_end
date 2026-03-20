import { z } from "zod";

export const phoneSchema = z.object({
  phone: z
    .string()
    .min(1, "رقم الجوال مطلوب")
    .regex(/^5\d{8}$/, "رقم الجوال غير صالح يجب أن يبدأ بـ 5 ويتكون من 9 أرقام"),
});

export const otpSchema = z.object({
  otp: z
    .string()
    .length(5, "رمز التحقق يجب أن يتكون من 5 أرقام")
    .regex(/^\d{5}$/, "رمز التحقق يجب أن يتكون من أرقام فقط"),
});

const usernameRegex = /^[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/;
const arabicInUsernameRegex = /[\u0600-\u06FF]/;

export const profileSchema = z.object({
  username: z
    .string()
    .min(1, "اسم المستخدم مطلوب")
    .refine((s) => !arabicInUsernameRegex.test(s), {
      message: "لا يمكن استخدام الأحرف العربية في اسم المستخدم",
    })
    .refine((s) => usernameRegex.test(s), {
      message:
        "اسم المستخدم يجب أن يحتوي على أحرف إنجليزية وأرقام وشرطات فقط (بدون مسافات)",
    }),
  email: z
    .string()
    .min(1, "البريد الإلكتروني مطلوب")
    .email("البريد الإلكتروني غير صالح"),
  password: z
    .string()
    .min(8, "كلمة المرور يجب أن تتكون من 8 أحرف على الأقل"),
});

export type PhoneSchemaType = z.infer<typeof phoneSchema>;
export type OtpSchemaType = z.infer<typeof otpSchema>;
export type ProfileSchemaType = z.infer<typeof profileSchema>;
