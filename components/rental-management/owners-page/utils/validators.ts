import { CreateFormData, PasswordData, EditFormData } from "../types/owners.types";
import { MIN_PASSWORD_LENGTH } from "../constants/owners.constants";

export const validateCreateForm = (formData: CreateFormData): string | null => {
  if (!formData.name || !formData.email || !formData.phone || !formData.password) {
    return "الرجاء ملء جميع الحقول المطلوبة";
  }

  if (formData.password !== formData.confirmPassword) {
    return "كلمتا المرور غير متطابقتين";
  }

  if (formData.password.length < MIN_PASSWORD_LENGTH) {
    return "يجب أن تكون كلمة المرور 8 أحرف على الأقل";
  }

  return null;
};

export const validateEditForm = (formData: EditFormData): string | null => {
  if (!formData.name || !formData.email || !formData.phone) {
    return "الرجاء ملء جميع الحقول المطلوبة";
  }
  return null;
};

export const validatePassword = (passwordData: PasswordData): string | null => {
  if (!passwordData.password) {
    return "الرجاء إدخال كلمة المرور الجديدة";
  }

  if (passwordData.password !== passwordData.confirmPassword) {
    return "كلمتا المرور غير متطابقتين";
  }

  if (passwordData.password.length < MIN_PASSWORD_LENGTH) {
    return "يجب أن تكون كلمة المرور 8 أحرف على الأقل";
  }

  return null;
};
