let userConfig = undefined;
try {
  userConfig = await import("./v0-user-next.config");
} catch (e) {
  // ignore error
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    // في Next.js 16، Turbopack هو الافتراضي
    // تحسينات للأداء
    // optimizeCss: true, // DISABLED - causes 45min+ build times with critters on large projects
    scrollRestoration: true,
    // تحسين package imports - تقليل حجم bundle للمكتبات الكبيرة
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      'recharts',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs',
      '@radix-ui/react-tooltip',
      'date-fns',
    ],
  },
  // تحسينات للأداء
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // ملاحظة: SWC minification مفعّل افتراضياً في Next.js 16+ (لا حاجة لـ swcMinify)
  // تحسين cache - تقليل استهلاك الذاكرة في التطوير
  onDemandEntries: {
    maxInactiveAge: 60 * 1000, // زيادة الوقت إلى 60 ثانية لتحسين الـ caching
    pagesBufferLength: 2, // زيادة إلى 2 لتحسين الأداء
  },
  // تحسين البناء للصفحات الثابتة - معالجة مشكلة symlink على Windows
  output: process.platform === "win32" ? undefined : "standalone",
  // استبعاد مجلدات trash و docs من البناء
  webpack: (config, { isServer, dev }) => {
    // استبعاد مجلدات trash و docs من المراقبة أثناء التطوير فقط
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: /node_modules|\.git|trash|docs|\.next|\.cache/,
        // تقليل استهلاك الذاكرة في وضع المراقبة
        aggregateTimeout: 300,
        poll: false, // تعطيل polling لتوفير الذاكرة
      };
      // تحسين optimization مع code splitting للترجمة
      config.optimization = {
        ...config.optimization,
        removeAvailableModules: true,
        removeEmptyChunks: true,
        mergeDuplicateChunks: true,
        // تحسين splitChunks لتحميل الترجمة بشكل منفصل
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: 25, // زيادة عدد الطلبات الأولية المسموح بها
          cacheGroups: {
            default: false,
            vendors: false,
            // فصل ملفات الترجمة الكبيرة في chunk منفصل
            translations: {
              test: /[\\/]lib[\\/]i18n[\\/]locales[\\/]/,
              name: 'translations',
              chunks: 'async',
              priority: 20,
              reuseExistingChunk: true,
            },
            // فصل المكونات الكبيرة (property-form وغيرها)
            largeComponents: {
              test: /[\\/]components[\\/](property|property-form|edit-property)[\\/]/,
              name: 'large-components',
              chunks: 'async',
              priority: 18,
              reuseExistingChunk: true,
            },
            // فصل مكتبات UI الكبيرة
            ui: {
              test: /[\\/]node_modules[\\/](@radix-ui|lucide-react|framer-motion)[\\/]/,
              name: 'ui-libs',
              chunks: 'async',
              priority: 15,
              reuseExistingChunk: true,
            },
            // فصل مكتبات charts
            charts: {
              test: /[\\/]node_modules[\\/](recharts)[\\/]/,
              name: 'charts',
              chunks: 'async',
              priority: 15,
              reuseExistingChunk: true,
            },
            // مكتبات مشتركة
            commons: {
              name: 'commons',
              minChunks: 2,
              chunks: 'async',
              priority: 10,
              reuseExistingChunk: true,
            },
          },
        },
      };
      
      // تحسين resolve لسرعة البحث عن الملفات
      config.resolve = {
        ...config.resolve,
        // تقليل الوقت المستغرق في البحث عن الملفات
        symlinks: false,
        // تحسين cache للملفات
        cache: true,
      };
      
      // تحسين module resolution
      config.module = {
        ...config.module,
        // تحسين parsing
        unknownContextCritical: false,
        unknownContextRegExp: /$^/,
        unknownContextRequest: '.',
      };
    }

    return config;
  },
  // إعدادات Turbopack (Next.js 16)
  // إضافة turbopack: {} لإسكات الخطأ - Turbopack هو الافتراضي في Next.js 16
  // يعمل فقط في وضع التطوير
  // ملاحظة: حد الذاكرة يتم التحكم فيه من خلال NODE_OPTIONS في package.json
  ...(process.env.NODE_ENV === "development" && { turbopack: {} }),
};

mergeConfig(nextConfig, userConfig);

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) {
    return;
  }

  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === "object" &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      };
    } else {
      nextConfig[key] = userConfig[key];
    }
  }
}

export default nextConfig;
