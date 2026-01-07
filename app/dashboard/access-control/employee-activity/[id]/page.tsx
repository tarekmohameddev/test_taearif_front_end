import EmployeeActivityPage from "@/components/access-control/EmployeeActivityPage";

export const metadata = {
  title: "سجل الموظف",
  description: "مراقبة وتتبع جميع الأنشطة والتفاعلات التي قام بها الموظف",
};

export default function Page() {
  return <EmployeeActivityPage />;
}

