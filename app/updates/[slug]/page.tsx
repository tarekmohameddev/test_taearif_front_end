import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getAdminArticleBySlug } from "@/lib/api/admin-articles";
import ArticleDetailPage from "@/components/ArticleDetailPage";
import { Metadata } from "next";
import type { AdminArticle } from "@/lib/api/admin-articles";

export const dynamic = "force-dynamic";

const isDevelopment = process.env.NODE_ENV === "development";

// Dummy data for development
const DUMMY_ARTICLES: Record<string, AdminArticle> = {
  "advanced-property-management": {
    id: 1,
    title: "إطلاق ميزة إدارة العقارات المتقدمة",
    slug: "advanced-property-management",
    excerpt: "نفخر بإطلاق ميزة جديدة لإدارة العقارات بشكل أكثر احترافية وكفاءة",
    body: `
      <h2>مقدمة</h2>
      <p>نفخر بإطلاق ميزة جديدة لإدارة العقارات بشكل أكثر احترافية وكفاءة. هذه الميزة تتيح لك إدارة جميع عملياتك العقارية من مكان واحد.</p>
      
      <h2>المميزات الرئيسية</h2>
      <ul>
        <li>إدارة شاملة للعقارات</li>
        <li>تتبع العملاء والصفقات</li>
        <li>تقارير مفصلة وإحصائيات</li>
        <li>واجهة مستخدم سهلة ومريحة</li>
      </ul>
      
      <h2>كيفية الاستخدام</h2>
      <p>يمكنك الوصول إلى هذه الميزة من القائمة الرئيسية في لوحة التحكم. ستجد جميع الأدوات التي تحتاجها لإدارة عملك العقاري بكفاءة عالية.</p>
      
      <h2>الخلاصة</h2>
      <p>نواصل تطوير منصة تعاريف لتقديم أفضل الحلول لعملائنا في القطاع العقاري.</p>
    `,
    main_image: null,
    status: "published",
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: {
      id: 1,
      name: "مميزات جديدة",
      slug: "new-features",
    },
    author: {
      id: 1,
      name: "فريق تعاريف",
    },
    meta: {
      title: "إطلاق ميزة إدارة العقارات المتقدمة",
      description: "نفخر بإطلاق ميزة جديدة لإدارة العقارات بشكل أكثر احترافية وكفاءة",
      og_image: null,
    },
    cta: {
      enabled: true,
      text: "جرّب الآن",
      url: "/register",
      target_blank: false,
    },
  },
  "crm-improvements": {
    id: 2,
    title: "تحسينات على نظام CRM",
    slug: "crm-improvements",
    excerpt: "تم تحسين نظام إدارة العملاء ليكون أسرع وأكثر سهولة في الاستخدام",
    body: `
      <h2>التحسينات الجديدة</h2>
      <p>تم تحسين نظام إدارة العملاء (CRM) ليكون أسرع وأكثر سهولة في الاستخدام. هذه التحسينات تجعل من السهل عليك تتبع وإدارة علاقاتك مع العملاء.</p>
      
      <h2>ما الجديد؟</h2>
      <ul>
        <li>واجهة مستخدم محسّنة</li>
        <li>سرعة أكبر في التحميل</li>
        <li>ميزات بحث متقدمة</li>
        <li>تقارير أكثر تفصيلاً</li>
      </ul>
      
      <h2>الفوائد</h2>
      <p>هذه التحسينات ستساعدك على إدارة عملائك بشكل أفضل وتحسين خدمة العملاء لديك.</p>
    `,
    main_image: null,
    status: "published",
    published_at: new Date(Date.now() - 86400000).toISOString(),
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    category: {
      id: 2,
      name: "تحسينات",
      slug: "improvements",
    },
    author: {
      id: 1,
      name: "فريق تعاريف",
    },
    meta: {
      title: "تحسينات على نظام CRM",
      description: "تم تحسين نظام إدارة العملاء ليكون أسرع وأكثر سهولة في الاستخدام",
      og_image: null,
    },
    cta: null,
  },
  "reports-fix": {
    id: 3,
    title: "إصلاح مشكلة في نظام التقارير",
    slug: "reports-fix",
    excerpt: "تم إصلاح مشكلة في عرض التقارير الإحصائية",
    body: `
      <h2>المشكلة</h2>
      <p>كانت هناك مشكلة في عرض التقارير الإحصائية في بعض الحالات.</p>
      
      <h2>الحل</h2>
      <p>تم إصلاح المشكلة وتحسين أداء نظام التقارير. الآن يمكنك عرض جميع التقارير بشكل صحيح وسريع.</p>
      
      <h2>ما تم إصلاحه</h2>
      <ul>
        <li>إصلاح مشكلة عرض البيانات</li>
        <li>تحسين سرعة التحميل</li>
        <li>إصلاح مشاكل التصدير</li>
      </ul>
    `,
    main_image: null,
    status: "published",
    published_at: new Date(Date.now() - 172800000).toISOString(),
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
    category: {
      id: 3,
      name: "إصلاحات",
      slug: "fixes",
    },
    author: {
      id: 1,
      name: "فريق تعاريف",
    },
    meta: {
      title: "إصلاح مشكلة في نظام التقارير",
      description: "تم إصلاح مشكلة في عرض التقارير الإحصائية",
      og_image: null,
    },
    cta: null,
  },
  "whatsapp-notifications": {
    id: 4,
    title: "ميزة جديدة: إشعارات واتساب",
    slug: "whatsapp-notifications",
    excerpt: "أضفنا ميزة إرسال إشعارات تلقائية عبر واتساب للعملاء",
    body: `
      <h2>الميزة الجديدة</h2>
      <p>أضفنا ميزة إرسال إشعارات تلقائية عبر واتساب للعملاء. هذه الميزة تتيح لك التواصل مع عملائك بشكل مباشر وسريع.</p>
      
      <h2>كيف تعمل؟</h2>
      <ul>
        <li>إرسال إشعارات تلقائية للعملاء</li>
        <li>إشعارات عند تحديث الصفقات</li>
        <li>إشعارات عند إضافة عقار جديد</li>
        <li>إشعارات مخصصة حسب احتياجاتك</li>
      </ul>
      
      <h2>الفوائد</h2>
      <p>هذه الميزة تساعدك على تحسين التواصل مع عملائك وزيادة رضاهم.</p>
    `,
    main_image: null,
    status: "published",
    published_at: new Date(Date.now() - 259200000).toISOString(),
    created_at: new Date(Date.now() - 259200000).toISOString(),
    updated_at: new Date(Date.now() - 259200000).toISOString(),
    category: {
      id: 1,
      name: "مميزات جديدة",
      slug: "new-features",
    },
    author: {
      id: 1,
      name: "فريق تعاريف",
    },
    meta: {
      title: "ميزة جديدة: إشعارات واتساب",
      description: "أضفنا ميزة إرسال إشعارات تلقائية عبر واتساب للعملاء",
      og_image: null,
    },
    cta: {
      enabled: true,
      text: "تفعيل الميزة",
      url: "/dashboard/settings",
      target_blank: false,
    },
  },
  "ui-improvements": {
    id: 5,
    title: "تحسين واجهة المستخدم",
    slug: "ui-improvements",
    excerpt: "تم تحديث واجهة المستخدم لتكون أكثر جمالاً وسهولة",
    body: `
      <h2>التحديثات الجديدة</h2>
      <p>تم تحديث واجهة المستخدم لتكون أكثر جمالاً وسهولة في الاستخدام. هذه التحسينات تجعل تجربتك مع المنصة أفضل.</p>
      
      <h2>ما الجديد؟</h2>
      <ul>
        <li>تصميم جديد وأكثر حداثة</li>
        <li>ألوان محسّنة</li>
        <li>خطوط أوضح وأسهل في القراءة</li>
        <li>تحسينات في التخطيط</li>
      </ul>
      
      <h2>النتائج</h2>
      <p>هذه التحسينات تجعل منصة تعاريف أسهل وأكثر متعة في الاستخدام.</p>
    `,
    main_image: null,
    status: "published",
    published_at: new Date(Date.now() - 345600000).toISOString(),
    created_at: new Date(Date.now() - 345600000).toISOString(),
    updated_at: new Date(Date.now() - 345600000).toISOString(),
    category: {
      id: 2,
      name: "تحسينات",
      slug: "improvements",
    },
    author: {
      id: 1,
      name: "فريق تعاريف",
    },
    meta: {
      title: "تحسين واجهة المستخدم",
      description: "تم تحديث واجهة المستخدم لتكون أكثر جمالاً وسهولة",
      og_image: null,
    },
    cta: null,
  },
  "export-fix": {
    id: 6,
    title: "إصلاح مشكلة في التصدير",
    slug: "export-fix",
    excerpt: "تم إصلاح مشكلة في تصدير البيانات إلى Excel",
    body: `
      <h2>المشكلة</h2>
      <p>كانت هناك مشكلة في تصدير البيانات إلى Excel في بعض الحالات.</p>
      
      <h2>الحل</h2>
      <p>تم إصلاح المشكلة وتحسين عملية التصدير. الآن يمكنك تصدير جميع البيانات بشكل صحيح.</p>
      
      <h2>ما تم إصلاحه</h2>
      <ul>
        <li>إصلاح مشكلة التصدير إلى Excel</li>
        <li>تحسين تنسيق البيانات</li>
        <li>إصلاح مشاكل الترميز</li>
        <li>تحسين سرعة التصدير</li>
      </ul>
    `,
    main_image: null,
    status: "published",
    published_at: new Date(Date.now() - 432000000).toISOString(),
    created_at: new Date(Date.now() - 432000000).toISOString(),
    updated_at: new Date(Date.now() - 432000000).toISOString(),
    category: {
      id: 3,
      name: "إصلاحات",
      slug: "fixes",
    },
    author: {
      id: 1,
      name: "فريق تعاريف",
    },
    meta: {
      title: "إصلاح مشكلة في التصدير",
      description: "تم إصلاح مشكلة في تصدير البيانات إلى Excel",
      og_image: null,
    },
    cta: null,
  },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  // Use dummy data in development
  if (isDevelopment && DUMMY_ARTICLES[slug]) {
    const article = DUMMY_ARTICLES[slug];
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
  }

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

  // Use dummy data in development
  if (isDevelopment && DUMMY_ARTICLES[slug]) {
    const article = DUMMY_ARTICLES[slug];
    return <ArticleDetailPage article={article} />;
  }

  try {
    const article = await getAdminArticleBySlug(slug);
    return <ArticleDetailPage article={article} />;
  } catch (error: any) {
    console.error("Error fetching article:", error);
    notFound();
  }
}
