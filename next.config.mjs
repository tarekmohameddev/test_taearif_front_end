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
  },
  // تحسينات للأداء
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // تحسين cache - تقليل استهلاك الذاكرة في التطوير
  onDemandEntries: {
    maxInactiveAge: 15 * 1000, // تقليل الوقت من 25 إلى 15 ثانية
    pagesBufferLength: 1, // تقليل من 2 إلى 1 لتوفير الذاكرة
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
      // تقليل استهلاك الذاكرة في webpack
      config.optimization = {
        ...config.optimization,
        removeAvailableModules: true,
        removeEmptyChunks: true,
        mergeDuplicateChunks: true,
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
