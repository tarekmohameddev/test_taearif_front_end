import { PropertyReservationsPage } from "@/components/property-reservations-page";

export default function ReservationsPage() {
  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
        <main className="flex-1 p-4 md:p-6">
          <PropertyReservationsPage />
        </main>
    </div>
  );
}
