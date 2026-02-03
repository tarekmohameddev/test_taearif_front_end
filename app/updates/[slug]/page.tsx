import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getAdminArticleBySlug } from "@/lib/api/admin-articles";
import ArticleDetailPage from "@/components/ArticleDetailPage";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const article = await getAdminArticleBySlug(slug);

    return {
      title: article.meta?.title || article.title,
      description: article.meta?.description || article.excerpt || undefined,
      openGraph: {
        title: article.meta?.title || article.title,
        description: article.meta?.description || article.excerpt || undefined,
        images: article.meta?.og_image
          ? [{ url: article.meta.og_image }]
          : article.main_image
            ? [{ url: article.main_image }]
            : [],
      },
    };
  } catch (error) {
    return {
      title: "مقال غير موجود",
      description: "المقال المطلوب غير موجود",
    };
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const headersList = await headers();
  const tenantId = headersList.get("x-tenant-id");

  // إذا كان هناك tenantId، لا نعرض صفحة التحديثات
  if (tenantId) {
    notFound();
  }

  try {
    const article = await getAdminArticleBySlug(slug);
    return <ArticleDetailPage article={article} />;
  } catch (error: any) {
    console.error("Error fetching article:", error);
    notFound();
  }
}
