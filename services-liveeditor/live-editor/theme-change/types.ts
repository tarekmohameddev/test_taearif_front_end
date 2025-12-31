/**
 * ============================================================================
 * Theme Change Service - Types & Interfaces
 * ============================================================================
 *
 * هذا الملف يحتوي على جميع الأنواع والواجهات المستخدمة في نظام تغيير الثيمات.
 * All types and interfaces used in the theme change system.
 *
 * ============================================================================
 */

/**
 * نوع رقم الثيم - Theme Number Type
 *
 * يمثل رقم الثيم المتاح في النظام.
 * Currently supports theme 1 and theme 2.
 *
 * @example
 * const theme: ThemeNumber = 1;
 */
export type ThemeNumber = 1 | 2;

/**
 * واجهة بيانات الثيم - Theme Data Interface
 *
 * تمثل البيانات الكاملة للثيم بما في ذلك:
 * - componentSettings: إعدادات المكونات لكل صفحة (تنسيق قديم)
 * - pages: صفحات الثيم مع مكوناتها (تنسيق جديد)
 * - globalComponentsData: بيانات المكونات العامة (Header, Footer)
 * - staticPages: الصفحات الثابتة (مثل project, property)
 *
 * Represents the complete theme data including:
 * - componentSettings: Component settings for each page (legacy format)
 * - pages: Theme pages with their components (new format)
 * - globalComponentsData: Global components data (Header, Footer)
 * - staticPages: Static pages (e.g., project, property)
 */
export interface ThemeData {
  /**
   * إعدادات المكونات لكل صفحة (تنسيق قديم - Theme 1)
   * Component settings for each page (legacy format - Theme 1)
   *
   * يمكن أن يكون Array أو Object حسب التنسيق الأصلي
   * Can be Array or Object depending on original format
   */
  componentSettings?: Record<string, any[]>;

  /**
   * صفحات الثيم مع مكوناتها (تنسيق جديد - Theme 2)
   * Theme pages with their components (new format - Theme 2)
   */
  pages?: Record<string, any[]>;

  /**
   * بيانات المكونات العامة (Header و Footer)
   * Global components data (Header and Footer)
   */
  globalComponentsData?: {
    /**
     * بيانات Header
     * Header data
     */
    header?: any;

    /**
     * بيانات Footer
     * Footer data
     */
    footer?: any;

    /**
     * نوع Header الافتراضي
     * Default Header variant
     */
    globalHeaderVariant?: string;

    /**
     * نوع Footer الافتراضي
     * Default Footer variant
     */
    globalFooterVariant?: string;
  };

  /**
   * الصفحات الثابتة (مثل project, property)
   * Static pages (e.g., project, property)
   */
  staticPages?: Record<
    string,
    {
      /**
       * معرف الصفحة (slug)
       * Page identifier (slug)
       */
      slug: string;

      /**
       * مكونات الصفحة
       * Page components
       */
      components: any[];

      /**
       * نقاط نهاية API للصفحة
       * API endpoints for the page
       */
      apiEndpoints: Record<string, string>;
    }
  >;
}

/**
 * واجهة بيانات النسخ الاحتياطي - Backup Data Interface
 *
 * تمثل بيانات النسخ الاحتياطي الكاملة للثيم
 * Represents complete backup data for a theme
 */
export interface BackupData {
  /**
   * إعدادات المكونات لكل صفحة
   * Component settings for each page
   */
  [page: string]: any;

  /**
   * بيانات المكونات العامة
   * Global components data
   */
  _globalComponentsData?: {
    header?: any;
    footer?: any;
    globalHeaderVariant?: string;
    globalFooterVariant?: string;
  };

  /**
   * بيانات الصفحات الثابتة
   * Static pages data
   */
  _staticPagesData?: Record<string, any>;
}

/**
 * واجهة نتيجة النسخ الاحتياطي - Backup Result Interface
 *
 * تمثل نتيجة عملية النسخ الاحتياطي
 * Represents the result of a backup operation
 */
export interface BackupResult {
  /**
   * بيانات النسخ الاحتياطي
   * Backup data
   */
  backup: Record<string, any>;

  /**
   * مفتاح النسخ الاحتياطي (مثل "Theme1Backup")
   * Backup key (e.g., "Theme1Backup")
   */
  backupKey: string | null;
}

/**
 * واجهة بيانات مكون الصفحة - Page Component Data Interface
 *
 * تمثل بيانات مكون في صفحة معينة
 * Represents component data in a specific page
 */
export interface PageComponentData {
  /**
   * معرف المكون الفريد
   * Unique component identifier
   */
  id: string;

  /**
   * نوع المكون (hero, header, footer, etc.)
   * Component type (hero, header, footer, etc.)
   */
  type: string;

  /**
   * اسم المكون (hero1, header1, etc.)
   * Component name (hero1, header1, etc.)
   */
  componentName: string;

  /**
   * بيانات المكون
   * Component data
   */
  data: any;

  /**
   * موضع المكون في الصفحة
   * Component position in the page
   */
  position: number;

  /**
   * تخطيط المكون (row, col, span)
   * Component layout (row, col, span)
   */
  layout: {
    row: number;
    col: number;
    span: number;
  };

  /**
   * اسم المكون للعرض
   * Component display name
   */
  name?: string;
}
