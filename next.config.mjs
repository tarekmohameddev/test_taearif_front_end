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
  // تحسين cache
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // تحسين البناء للصفحات الثابتة - معالجة مشكلة symlink على Windows
  output: process.platform === "win32" ? undefined : "standalone",
  // استبعاد مجلدات trash و docs من البناء
  webpack: (config, { isServer, dev }) => {
    // استبعاد مجلدات trash و docs من المراقبة أثناء التطوير فقط
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: /node_modules|\.git|trash|docs/,
      };
    }

    return config;
  },
  // إعدادات Turbopack (Next.js 16)
  // تم إزالة turbopack: {} الفارغة لتجنب مشاكل البناء
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