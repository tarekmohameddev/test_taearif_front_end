import { Button } from "@/components/ui/button";
import { Move, UserPlus, Loader2 } from "lucide-react";
import Link from "next/link";
import axiosInstance from "@/lib/axiosInstance";
import { useState, useEffect } from "react";
import useAuthStore from "@/context/AuthContext";
import { selectUserData } from "@/context/auth/selectors";
import { z } from "zod";
import toast from "react-hot-toast";
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogHeader,
  CustomDialogTitle,
  CustomDialogClose,
} from "@/components/customComponents/CustomDialog";
import { CustomerForm } from "./CustomerForm";

// Zod validation schema
const customerSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
  email: z
    .string()
    .email("البريد الإلكتروني غير صحيح")
    .optional()
    .or(z.literal("")),
  phone_number: z.string().min(1, "رقم الهاتف مطلوب"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
  city_id: z.number().nullable(),
  district_id: z.union([z.number(), z.string()]).nullable(),
  note: z.string().optional(),
  type_id: z.number().min(1, "نوع العميل مطلوب"),
  // الأولوية مخفية حالياً - جعلتها اختيارية
  priority_id: z.number().nullable().optional(),
  stage_id: z.union([z.number(), z.null(), z.literal("")]).optional(),
  // الإجراء مخفي حالياً - جعلته اختيارياً
  procedure_id: z.number().nullable().optional(),
});

// Error message translation mapping
const errorTranslations: Record<string, string> = {
  "The phone number has already been taken.":
    "رقم الهاتف مُستخدم بالفعل، يرجى استخدام رقم آخر",
  "The email has already been taken.":
    "البريد الإلكتروني مُستخدم بالفعل، يرجى استخدام بريد آخر",
  "The name field is required.": "حقل الاسم مطلوب",
  "The phone number field is required.": "حقل رقم الهاتف مطلوب",
  "The password field is required.": "حقل كلمة المرور مطلوب",
  "The email must be a valid email address.":
    "يجب أن يكون البريد الإلكتروني صحيحاً",
  "The phone number format is invalid.": "تنسيق رقم الهاتف غير صحيح",
  "The password must be at least 6 characters.":
    "كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل",
  "The priority id field is required.": "حقل الأولوية مطلوب",
  "The selected type id is invalid.": "نوع العميل المحدد غير صحيح",
  "The selected procedure id is invalid.": "نوع الإجراء المحدد غير صحيح",
};

// Function to translate error messages
const translateErrorMessage = (message: string): string => {
  return errorTranslations[message] || message;
};

export const CustomerPageHeader = ({
  showAddCustomerDialog,
  setShowAddCustomerDialog,
  newCustomer,
  handleNewCustomerChange,
  handleNewCustomerInputChange,
  validationErrors,
  clientErrors,
  isSubmitting,
  setValidationErrors,
  setClientErrors,
  setIsSubmitting,
  setNewCustomer,
  onCustomerAdded,
}: any) => {
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Get filter data from store
  const userData = useAuthStore(selectUserData);

  // تعيين كلمة المرور تلقائياً عند فتح النموذج
  useEffect(() => {
    if (showAddCustomerDialog && (!newCustomer.password || newCustomer.password === "")) {
      setNewCustomer((prev: typeof newCustomer) => ({
        ...prev,
        password: "123456",
      }));
    }
  }, [showAddCustomerDialog, newCustomer.password, setNewCustomer]);

  // Client-side validation function
  const validateForm = () => {
    try {
      // استخدام البيانات المحدثة للتحقق - تعيين password تلقائياً
      const dataToValidate = {
        ...newCustomer,
        password: newCustomer.password || "123456",
      };
      customerSchema.parse(dataToValidate);
      setFormErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as string] = err.message;
          }
        });
        setFormErrors(errors);
        return false;
      }
      return false;
    }
  };

  // Enhanced add customer function with validation
  const handleAddCustomerWithValidation = async () => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    if (!userData?.token) {
      alert("Authentication required. Please login.");
      return;
    }

    // Clear previous errors
    setFormErrors({});
    setValidationErrors({});
    setClientErrors({});

    // تعيين كلمة المرور الافتراضية قبل التحقق
    // التأكد من أن password موجود دائماً
    const passwordToUse = 
      newCustomer.password && 
      newCustomer.password.trim() !== "" 
        ? newCustomer.password 
        : "123456";

    // تحديث الـ state إذا كان password فارغاً
    if (!newCustomer.password || newCustomer.password.trim() === "") {
      setNewCustomer((prev: typeof newCustomer) => ({
        ...prev,
        password: "123456",
      }));
    }

    // Client-side validation
    // استخدام البيانات المحدثة مع password الافتراضي
    // تحويل null إلى undefined للحقول الاختيارية
    const customerDataForValidation = {
      ...newCustomer,
      password: passwordToUse,
      priority_id: newCustomer.priority_id ?? undefined,
      procedure_id: newCustomer.procedure_id ?? undefined,
    };

    try {
      customerSchema.parse(customerDataForValidation);
      setFormErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as string] = err.message;
          }
        });
        setFormErrors(errors);
        
        // عرض رسالة خطأ مفصلة
        const firstError = Object.values(errors)[0];
        const errorMessage = firstError || "يرجى تصحيح الأخطاء في النموذج";
        
        toast.error(errorMessage, {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#EF4444",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "16px",
            padding: "12px 20px",
            borderRadius: "8px",
          },
        });
        return;
      }
      return;
    }

    // إذا وصلنا هنا، التحقق نجح - المتابعة لإرسال البيانات
    setIsSubmitting(true);
    try {
      // معالجة stage_id قبل الإرسال
      // التأكد من أن password موجود (إذا كان فارغاً، استخدم القيمة الافتراضية)
      const customerDataToSend: any = {
        ...newCustomer,
        password: newCustomer.password || "123456",
        stage_id: newCustomer.stage_id === null ? "" : newCustomer.stage_id,
        procedure_id: newCustomer.procedure_id ?? undefined,
      };

      // إزالة priority_id من البيانات المرسلة
      delete customerDataToSend.priority_id;

      // إزالة stage_id إذا كان فارغاً لتجنب مشاكل الـ API
      if (customerDataToSend.stage_id === "") {
        delete customerDataToSend.stage_id;
      }

      const response = await axiosInstance.post(
        "/customers",
        customerDataToSend,
      );

      // Add the new customer to the list
      if (onCustomerAdded && response.data.data) {
        onCustomerAdded(response.data.data);
      }

      // Show success toast
      toast.success("تم إضافة العميل بنجاح! 🎉", {
        duration: 4000,
        position: "top-center",
        style: {
          background: "#10B981",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "16px",
          padding: "12px 20px",
          borderRadius: "8px",
        },
      });

      setShowAddCustomerDialog(false);
      // Reset form - clear all inputs
      setNewCustomer({
        name: "",
        email: "",
        phone_number: "",
        password: "123456",
        city_id: null,
        district_id: null,
        note: "",
        type_id: 1,
        priority_id: 1,
        stage_id: null,
        procedure_id: null,
      });
      // Clear any existing errors
      setFormErrors({});
      setClientErrors({});
      setValidationErrors({});
    } catch (error: any) {
      console.error("Error adding customer:", error);

      if (error?.response && error?.response?.status === 422) {
        const serverErrors = error?.response?.data?.errors || {};
        // Translate server error messages to Arabic
        const translatedErrors: Record<string, string[]> = {};
        Object.keys(serverErrors).forEach((field) => {
          translatedErrors[field] = serverErrors[field].map((msg: string) =>
            translateErrorMessage(msg),
          );
        });
        setValidationErrors(translatedErrors);

        // Show error toast with first error message
        const firstError = Object.values(translatedErrors)[0]?.[0];
        if (firstError) {
          toast.error(firstError, {
            duration: 4000,
            position: "top-center",
            style: {
              background: "#EF4444",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "16px",
              padding: "12px 20px",
              borderRadius: "8px",
            },
          });
        }
      } else {
        // Handle other types of errors
        toast.error("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى", {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#EF4444",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "16px",
            padding: "12px 20px",
            borderRadius: "8px",
          },
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to check if field has error
  const hasError = (fieldName: string): boolean => {
    return !!(
      formErrors[fieldName] ||
      validationErrors[fieldName] ||
      clientErrors[fieldName]
    );
  };

  // Helper function to get error message
  const getErrorMessage = (fieldName: string): string => {
    return (
      formErrors[fieldName] ||
      validationErrors[fieldName]?.[0] ||
      clientErrors[fieldName] ||
      ""
    );
  };

  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">إدارة العملاء</h1>
        <p className="text-muted-foreground">
          عرض وإدارة بيانات العملاء في جدول منظم
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          onClick={() => {
            // تعيين كلمة المرور الافتراضية عند فتح النموذج
            setNewCustomer((prev: typeof newCustomer) => ({
              ...prev,
              password: "123456",
            }));
            setShowAddCustomerDialog(true);
          }}
        >
          <UserPlus className="ml-2 h-4 w-4" />
          إضافة عميل جديد
        </Button>

        {/* Add Customer Dialog using CustomDialog */}
        <CustomDialog
          open={showAddCustomerDialog}
          onOpenChange={(isOpen) => {
            setShowAddCustomerDialog(isOpen);
            if (!isOpen) {
              setValidationErrors({});
              setClientErrors({});
              setFormErrors({});
              setIsSubmitting(false);
              setNewCustomer({
                name: "",
                email: "",
                phone_number: "",
                password: "123456",
                city_id: null,
                district_id: null,
                note: "",
                type_id: 1,
                priority_id: 1,
                stage_id: null,
                procedure_id: null,
              });
            }
          }}
          maxWidth="max-w-4xl"
        >
          <CustomDialogContent className="p-6">
            <CustomDialogHeader>
              <CustomDialogTitle>إضافة عميل جديد</CustomDialogTitle>
              <CustomDialogClose
                onClose={() => {
                  setShowAddCustomerDialog(false);
                  setValidationErrors({});
                  setClientErrors({});
                  setFormErrors({});
                  setIsSubmitting(false);
                  setNewCustomer({
                    name: "",
                    email: "",
                    phone_number: "",
                    password: "123456",
                    city_id: null,
                    district_id: null,
                    note: "",
                    type_id: 1,
                    priority_id: 1,
                    stage_id: null,
                    procedure_id: null,
                  });
                }}
              />
            </CustomDialogHeader>
            <div className="py-4">
              <CustomerForm
                formData={newCustomer}
                onChange={(field, value) => {
                  if (
                    field === "type_id" ||
                    field === "priority_id" ||
                    field === "procedure_id" ||
                    field === "stage_id" ||
                    field === "city_id" ||
                    field === "district_id"
                  ) {
                    handleNewCustomerChange(field)(value);
                  } else {
                    handleNewCustomerInputChange(field)({
                      target: { value },
                    } as any);
                  }
                }}
                errors={{
                  ...formErrors,
                  ...validationErrors,
                  ...clientErrors,
                }}
                isEditMode={false}
              />
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowAddCustomerDialog(false)}
                  disabled={isSubmitting}
                >
                  إلغاء
                </Button>
                <Button
                  onClick={handleAddCustomerWithValidation}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      جاري الإضافة...
                    </>
                  ) : (
                    "إضافة العميل"
                  )}
                </Button>
              </div>
            </div>
          </CustomDialogContent>
        </CustomDialog>
      </div>
    </div>
  );
};
