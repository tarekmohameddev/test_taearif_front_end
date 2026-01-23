"use client";

export default function CreateRentalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
      <main className="flex-1 p-4 md:p-6">{children}</main>
    </div>
  );
}
