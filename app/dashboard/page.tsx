import { WelcomeDashboard } from "@/components/homepage/welcome-dashboard";
import { GuidedTour } from "@/components/mainCOMP/sidebarComponents/guided-tour";

export const metadata = {
  title: "لوحة تحكم تعاريف",
};

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
        <main className="flex-1 p-4 md:p-6">
          <WelcomeDashboard />
        </main>
      <GuidedTour />
    </div>
  );
}
