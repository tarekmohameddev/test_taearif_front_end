import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

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
    tsconfigPath: './tsconfig.json',
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    scrollRestoration: true,
    // تحسين package imports - تقليل حجم bundle وتسريع الـ compile
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      'recharts',
      '@radix-ui/react-accordion',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-popover',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs',
      '@radix-ui/react-tooltip',
      'date-fns',
      'react-hot-toast',
      'sonner',
      'zustand',
    ],
  },
  // تحسينات للأداء
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // تحسين cache للـ dev: الاحتفاظ بعدد أكبر من الصفحات المترجمة في الذاكرة لتقليل إعادة الـ compile
  onDemandEntries: {
    maxInactiveAge: 90 * 1000,
    pagesBufferLength: process.env.NODE_ENV === "development" ? 6 : 2,
  },
  output: process.platform === "win32" ? undefined : "standalone",
  
  // Turbopack: يُستخدم عند تشغيل `npm run dev` (next dev --turbopack). الإنتاج يستخدم webpack.
  turbopack: {},
  
  // ⬅️ Webpack configuration - فقط في PRODUCTION
  webpack: (config, { isServer, dev, webpack }) => {
    // منع حل fs/promises و path في bundle العميل (lib/debug يستخدمها فقط في السيرفر)
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        "fs/promises": false,
        path: false,
      };
    }

    // ⬅️ Webpack في PRODUCTION فقط
    if (!dev) {
      // تحسينات الذاكرة - تقليل استهلاك الذاكرة أثناء البناء
      config.optimization = {
        ...config.optimization,
        removeAvailableModules: true,
        removeEmptyChunks: true,
        mergeDuplicateChunks: true,
        // تقليل maxInitialRequests لتقليل استهلاك الذاكرة
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: 25, // تقليل من 30 إلى 25
          maxAsyncRequests: 30,
          minSize: 20000, // زيادة الحد الأدنى لتقليل عدد chunks
          cacheGroups: {
            default: false,
            vendors: false,
            // فصل ملفات الترجمة الكبيرة
            translations: {
              test: /[\\/]lib[\\/]i18n[\\/]locales[\\/]/,
              name: 'translations',
              chunks: 'async',
              priority: 20,
              reuseExistingChunk: true,
              minSize: 20000,
            },
            // فصل المكونات الكبيرة
            largeComponents: {
              test: /[\\/]components[\\/](property|property-form|edit-property|crm|rental-management|marketing)[\\/]/,
              name: 'large-components',
              chunks: 'async',
              priority: 18,
              reuseExistingChunk: true,
              minSize: 20000,
            },
            // فصل مكتبات UI الكبيرة
            ui: {
              test: /[\\/]node_modules[\\/](@radix-ui|lucide-react|framer-motion)[\\/]/,
              name: 'ui-libs',
              chunks: 'async',
              priority: 15,
              reuseExistingChunk: true,
              minSize: 20000,
            },
            // فصل مكتبات charts
            charts: {
              test: /[\\/]node_modules[\\/](recharts)[\\/]/,
              name: 'charts',
              chunks: 'async',
              priority: 15,
              reuseExistingChunk: true,
              minSize: 20000,
            },
            // مكتبات مشتركة
            commons: {
              name: 'commons',
              minChunks: 2,
              chunks: 'async',
              priority: 10,
              reuseExistingChunk: true,
              minSize: 20000,
            },
          },
        },
      };
      
      // تحسين resolve لسرعة البحث عن الملفات
      config.resolve = {
        ...config.resolve,
        symlinks: false,
        cache: false, // في production لا نحتاج cache
        // تحسين extension resolution
        extensionAlias: {
          '.js': ['.ts', '.tsx', '.js', '.jsx'],
          '.jsx': ['.tsx', '.jsx'],
        },
      };
      
      // تحسين module resolution
      config.module = {
        ...config.module,
        unknownContextCritical: false,
        unknownContextRegExp: /$^/,
        unknownContextRequest: '.',
      };

      // تقليل استهلاك الذاكرة في webpack
      config.performance = {
        ...config.performance,
        hints: false, // تعطيل warnings لتقليل استهلاك الذاكرة
        maxEntrypointSize: 512000, // 500KB
        maxAssetSize: 512000, // 500KB
      };

      // تحسينات إضافية للذاكرة
      config.cache = false; // تعطيل cache في production build لتقليل الذاكرة
    }

    return config;
  },
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

export default withBundleAnalyzer(nextConfig);
