import { headers } from "next/headers";
import { notFound } from "next/navigation";
import SupportCenterCategoryPage from "@/components/SupportCenterCategoryPage";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const headersList = await headers();
  const tenantId = headersList.get("x-tenant-id");

  // إذا كان هناك tenantId، لا نعرض صفحة مركز المساعدة
  if (tenantId) {
    notFound();
  }

  return <SupportCenterCategoryPage categorySlug={slug} />;
}
