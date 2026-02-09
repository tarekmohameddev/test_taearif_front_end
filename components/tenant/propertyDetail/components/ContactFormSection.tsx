import type { Property } from "../types/types";

interface ContactFormSectionProps {
  property: Property | null;
  formData: {
    name: string;
    phone: string;
    email: string;
    message: string;
  };
  formLoading: boolean;
  formError: string | null;
  formSuccess: boolean;
  formBackgroundColor: string;
  formTextColor: string;
  formButtonBackgroundColor: string;
  formButtonTextColor: string;
  primaryColorHover: string;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  handleSubmit: (e: React.FormEvent) => void;
  title?: string;
  description?: string;
  submitButtonText?: string;
  showForm?: boolean;
}

export const ContactFormSection = ({
  formData,
  formLoading,
  formError,
  formSuccess,
  formBackgroundColor,
  formTextColor,
  formButtonBackgroundColor,
  formButtonTextColor,
  primaryColorHover,
  handleChange,
  handleSubmit,
  title = "تواصل معنا",
  description,
  submitButtonText = "إرسال",
  showForm = true,
}: ContactFormSectionProps) => {
  if (!showForm) {
    return null;
  }

  return (
    <section className="bg-transparent" data-purpose="contact-form">
      <h2 className="text-3xl font-bold mb-6 text-right" style={{ color: formTextColor }}>
        {title}
      </h2>
      {description && (
        <p className="text-lg mb-6 text-right" style={{ color: formTextColor }}>
          {description}
        </p>
      )}
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        style={{
          backgroundColor: formBackgroundColor,
          padding: "24px",
          borderRadius: "8px",
        }}
      >
        <div>
          <label
            htmlFor="name"
            className="block text-right mb-2 font-semibold"
            style={{ color: formTextColor }}
          >
            الاسم
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md text-right"
            style={{
              backgroundColor: "#ffffff",
              color: formTextColor,
              borderColor: "#e0e0e0",
            }}
          />
        </div>
        <div>
          <label
            htmlFor="phone"
            className="block text-right mb-2 font-semibold"
            style={{ color: formTextColor }}
          >
            الهاتف
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md text-right"
            style={{
              backgroundColor: "#ffffff",
              color: formTextColor,
              borderColor: "#e0e0e0",
            }}
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-right mb-2 font-semibold"
            style={{ color: formTextColor }}
          >
            البريد الإلكتروني
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md text-right"
            style={{
              backgroundColor: "#ffffff",
              color: formTextColor,
              borderColor: "#e0e0e0",
            }}
          />
        </div>
        <div>
          <label
            htmlFor="message"
            className="block text-right mb-2 font-semibold"
            style={{ color: formTextColor }}
          >
            الرسالة
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            required
            className="w-full px-4 py-2 border rounded-md text-right"
            style={{
              backgroundColor: "#ffffff",
              color: formTextColor,
              borderColor: "#e0e0e0",
            }}
          />
        </div>
        {formError && (
          <div className="text-red-600 text-right">{formError}</div>
        )}
        {formSuccess && (
          <div className="text-green-600 text-right">
            تم إرسال الرسالة بنجاح!
          </div>
        )}
        <button
          type="submit"
          disabled={formLoading}
          className="w-full py-3 px-6 rounded-md font-semibold text-white transition-all duration-300 hover:shadow-lg"
          style={{
            backgroundColor: formButtonBackgroundColor,
            color: formButtonTextColor,
            opacity: formLoading ? 0.6 : 1,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = primaryColorHover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = formButtonBackgroundColor;
          }}
        >
          {formLoading ? "جاري الإرسال..." : submitButtonText}
        </button>
      </form>
    </section>
  );
};
