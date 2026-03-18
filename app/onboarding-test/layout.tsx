import React from "react";
import Image from "next/image";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen bg-background text-foreground flex flex-col"
      dir="rtl"
    >
      <div className="w-full flex justify-end px-4 pt-6">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={160}
          height={56}
          priority
          className="h-14 w-auto object-contain dark:invert"
        />
      </div>

      {children}
    </div>
  );
}

