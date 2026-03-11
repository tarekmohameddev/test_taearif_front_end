import BuildingsPageClient from "./BuildingsPageClient";

export const metadata = {
  title: "إدارة العمارات",
  description: "إدارة جميع العمارات والعقارات التابعة لها",
};

export default function Page() {
  return <BuildingsPageClient />;
}
