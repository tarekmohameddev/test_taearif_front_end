import { headers } from "next/headers";
import TaearifUpdatesPage from "../../components/TaearifUpdatesPage";
import HomePageWrapper from "../HomePageWrapper";

// إبقاء الصفحة dynamic لتتمكن من التحقق من tenantId
export const dynamic = "force-dynamic";

export default async function Page() {
  const headersList = await headers();
  const tenantId = headersList.get("x-tenant-id");

  // إذا لم يكن هناك subdomain (tenantId)، اعرض صفحة التحديثات الرسمية
  if (!tenantId) {
    return <TaearifUpdatesPage />;
  }

  // إذا كان هناك tenantId، فهذا موقع خاص بـ tenant (مثل Shopify)
  return <HomePageWrapper tenantId={tenantId} />;
}
