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
      'react-hot-toast',
      'zustand',
    ],
    // ⬅️ Turbopack settings - فقط في development
    ...(process.env.NODE_ENV === "development" && {
      turbo: {
        rules: {
          '*.svg': {
            loaders: ['@svgr/webpack'],
            as: '*.js',
          },
        },
      },
    }),
  },
  // تحسينات للأداء
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // تحسين cache
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: process.env.NODE_ENV === "development" ? 3 : 2,
  },
  output: process.platform === "win32" ? undefined : "standalone",
  
  // ⬅️ Webpack configuration - فقط في PRODUCTION
  webpack: (config, { isServer, dev, webpack }) => {
    // ⬅️ Webpack في PRODUCTION فقط
    if (!dev) {
      // Production webpack optimizations
      config.optimization = {
        ...config.optimization,
        removeAvailableModules: true,
        removeEmptyChunks: true,
        mergeDuplicateChunks: true,
        // تحسين splitChunks لتحميل الترجمة والمكونات الكبيرة بشكل منفصل
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: 30,
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
            },
            // فصل المكونات الكبيرة
            largeComponents: {
              test: /[\\/]components[\\/](property|property-form|edit-property|crm|rental-management|marketing)[\\/]/,
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
    }

    return config;
  },
  
  // ⬅️ Turbopack - فقط في DEVELOPMENT
  ...(process.env.NODE_ENV === "development" && { 
    turbopack: {} 
  }),
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
