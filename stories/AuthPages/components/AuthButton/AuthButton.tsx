import type { AuthButtonProps } from "./AuthButton.types";

export default function AuthButton({
  children,
  onClick,
  type = "button",
  isLoading = false,
  disabled = false,
  variant = "primary",
  className = "",
}: AuthButtonProps) {
  if (variant === "link") {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled || isLoading}
        className={`text-[#49A093] font-medium hover:underline disabled:opacity-60 ${className}`}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`h-10 min-w-[208px] px-6 flex items-center justify-center bg-[#49A093] hover:bg-[#3d8a7f] disabled:bg-[#49A093]/60 text-white font-medium rounded-full transition-colors ${className}`}
    >
      {isLoading ? "..." : children}
    </button>
  );
}
