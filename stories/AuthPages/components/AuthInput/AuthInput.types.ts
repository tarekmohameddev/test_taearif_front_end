export interface AuthInputProps {
  type?: "text" | "email" | "password" | "tel";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  dir?: "ltr" | "rtl";
  showPasswordToggle?: boolean;
  className?: string;
  disabled?: boolean;
}
