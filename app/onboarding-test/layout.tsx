import Image from "next/image";
import type { ReactNode } from "react";

export default function OnboardingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div
      className="min-h-screen bg-background text-foreground flex flex-col"
      dir="rtl"
    >
      <div className="absolute top-10 right-10 z-20">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={120}
          height={40}
          priority
          className="h-10 w-auto object-contain invert "
        />
      </div>

      {children}
    </div>
  );
}

