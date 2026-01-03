/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/react-in-jsx-scope */
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { MapPin } from "lucide-react";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { getDefaultFooter2Data } from "@/context/editorStoreFunctions/footerFunctions";

// ═══════════════════════════════════════════════════════════
// PROPS INTERFACE
// ═══════════════════════════════════════════════════════════
interface Footer2Props {
  // Component-specific props
  visible?: boolean;
  ThemeTwo?: string;
  background?: {
    type?: string;
    image?: string;
    alt?: string;
    color?: string;
    ThemeTwo?: string;
    gradient?: {
      enabled?: boolean;
      direction?: string;
      startColor?: string;
      endColor?: string;
      middleColor?: string;
      ThemeTwo?: string;
    };
    overlay?: {
      enabled?: boolean;
      opacity?: string;
      color?: string;
      blendMode?: string;
      ThemeTwo?: string;
    };
  };
  layout?: {
    columns?: string;
    spacing?: string;
    padding?: string;
    maxWidth?: string;
    ThemeTwo?: string;
  };
  content?: {
    ThemeTwo?: string;
    companyInfo?: {
      enabled?: boolean;
      name?: string;
      description?: string;
      tagline?: string;
      logo?: string;
      ThemeTwo?: string;
    };
    newsletter?: {
      enabled?: boolean;
      title?: string;
      description?: string;
      placeholder?: string;
      buttonText?: string;
      ThemeTwo?: string;
    };
    contactInfo?: {
      enabled?: boolean;
      address?: string;
      email?: string;
      whatsapp?: string;
      whatsappUrl?: string;
      ThemeTwo?: string;
    };
    socialMedia?: {
      enabled?: boolean;
      platforms?: Array<{
        name?: string;
        url?: string;
        ThemeTwo?: string;
      }>;
      ThemeTwo?: string;
    };
  };
  footerBottom?: {
    enabled?: boolean;
    copyright?: string;
    companyUrl?: string;
    designerUrl?: string;
    legalLinks?: Array<{
      text?: string;
      url?: string;
      ThemeTwo?: string;
    }>;
    ThemeTwo?: string;
  };
  floatingWhatsApp?: {
    enabled?: boolean;
    url?: string;
    ThemeTwo?: string;
  };
  styling?: {
    ThemeTwo?: string;
    colors?: {
      textPrimary?: string;
      textSecondary?: string;
      textMuted?: string;
      accent?: string;
      border?: string;
      ThemeTwo?: string;
    };
    typography?: {
      titleSize?: string;
      titleWeight?: string;
      bodySize?: string;
      bodyWeight?: string;
      ThemeTwo?: string;
    };
    spacing?: {
      sectionPadding?: string;
      columnGap?: string;
      itemGap?: string;
      ThemeTwo?: string;
    };
    effects?: {
      hoverTransition?: string;
      shadow?: string;
      borderRadius?: string;
      ThemeTwo?: string;
    };
  };

  // Editor props (always include these)
  overrideData?: any; // ⭐ NEW: Accept override data directly
  variant?: string;
  useStore?: boolean;
  id?: string;
}

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════
export default function Footer2(props: Footer2Props) {
  // ─────────────────────────────────────────────────────────
  // 1. EXTRACT UNIQUE ID
  // ─────────────────────────────────────────────────────────
  const variantId = props.variant || "footer2";
  const uniqueId = props.id || variantId;

  // ─────────────────────────────────────────────────────────
  // 2. CONNECT TO STORES
  // ─────────────────────────────────────────────────────────
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const footerStates = useEditorStore((s) => s.footerStates);
  const globalFooterData = useEditorStore((s) => s.globalFooterData); // ⭐ NEW: For global footer support
  const [forceUpdate, setForceUpdate] = useState(0);

  const tenantData = useTenantStore((s) => s.tenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  // Check if this is a global footer
  const isGlobalFooter = uniqueId === "global-footer";

  // ─────────────────────────────────────────────────────────
  // 3. INITIALIZE IN STORE (on mount)
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (tenantId) {
      fetchTenantData(tenantId);
    }
  }, [tenantId, fetchTenantData]);

  // Extract component data from tenantData
  const getTenantComponentData = () => {
    if (!tenantData) return {};

    // Check new structure (tenantData.components)
    if (tenantData.components && Array.isArray(tenantData.components)) {
      for (const component of tenantData.components) {
        if (
          component.type === "footer" &&
          component.componentName === variantId
        ) {
          return component.data;
        }
      }
    }

    // Check old structure (tenantData.componentSettings)
    if (tenantData?.componentSettings) {
      for (const [pageSlug, pageComponents] of Object.entries(
        tenantData.componentSettings,
      )) {
        if (
          typeof pageComponents === "object" &&
          !Array.isArray(pageComponents)
        ) {
          for (const [componentId, component] of Object.entries(
            pageComponents as any,
          )) {
            if (
              (component as any).type === "footer" &&
              (component as any).componentName === variantId
            ) {
              return (component as any).data;
            }
          }
        }
      }
    }

    return {};
  };

  const tenantComponentData = getTenantComponentData();

  useEffect(() => {
    if (props.useStore) {
      // Use database data if available
      const initialData =
        tenantComponentData && Object.keys(tenantComponentData).length > 0
          ? {
              ...getDefaultFooter2Data(),
              ...tenantComponentData,
              ...props,
            }
          : {
              ...getDefaultFooter2Data(),
              ...props,
            };

      // Initialize in store
      ensureComponentVariant("footer", uniqueId, initialData);
    }
  }, [uniqueId, props.useStore, ensureComponentVariant, tenantComponentData]);

  // ─────────────────────────────────────────────────────────
  // 4. RETRIEVE DATA FROM STORE
  // ─────────────────────────────────────────────────────────
  const storeData = footerStates[uniqueId];
  const currentStoreData = getComponentData("footer", uniqueId);

  // ─────────────────────────────────────────────────────────
  // 5. MERGE DATA (PRIORITY ORDER)
  // ─────────────────────────────────────────────────────────
  const mergedData = useMemo(() => {
    return isGlobalFooter
      ? {
          ...getDefaultFooter2Data(), // 1. Defaults (lowest priority)
          ...globalFooterData, // 2. Global footer data
          ...props, // 3. Props
          ...(props.overrideData || {}), // ⭐ NEW: overrideData (highest priority)
        }
      : {
          ...getDefaultFooter2Data(), // 1. Defaults (lowest priority)
          ...storeData, // 2. Store state
          ...currentStoreData, // 3. Current store data
          ...props, // 4. Props
          ...(props.overrideData || {}), // ⭐ NEW: overrideData (highest priority)
        };
  }, [
    isGlobalFooter,
    globalFooterData,
    props,
    storeData,
    currentStoreData,
    forceUpdate,
  ]);

  // Force re-render when globalFooterData changes (for global footers)
  useEffect(() => {
    if (
      isGlobalFooter &&
      globalFooterData &&
      Object.keys(globalFooterData).length > 0
    ) {
      setForceUpdate((prev) => prev + 1);
    }
  }, [isGlobalFooter, globalFooterData]);

  // ─────────────────────────────────────────────────────────
  // 6. EARLY RETURN IF NOT VISIBLE
  // ─────────────────────────────────────────────────────────
  if (!mergedData.visible) {
    return null;
  }

  // ─────────────────────────────────────────────────────────
  // 7. RENDER
  // ─────────────────────────────────────────────────────────
  const pathname = usePathname();
  const isDashboardPage = pathname?.startsWith("/dashboard");
  const [whatsappNumber, setWhatsappNumber] = useState("");

  if (isDashboardPage) {
    return null;
  }

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (whatsappNumber) {
      console.log("Subscribing:", whatsappNumber);
      setWhatsappNumber("");
    }
  };

  // دالة لاستبدال "باهية" بـ "تعاريف" و "Baheya" بـ "taearif" تلقائياً
  const replaceBaheya = (text: string | undefined): string => {
    if (!text) return "";
    return text.replace(/باهية/g, "تعاريف").replace(/Baheya/gi, "taearif"); // case-insensitive للغة الإنجليزية
  };

  return (
    <>
      <footer
        className="relative z-10 bg-[#8b5f46] pt-16 md:pt-20 lg:pt-24 pb-8"
        style={{ backgroundColor: mergedData.background?.color || "#8b5f46" }}
      >
        <div className="container mx-auto px-4 text-white max-w-6xl">
          {/* Main Content Section */}
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-8 mb-12">
            {/* Right Section - Company Info */}
            <div className="w-full lg:w-1/2 xl:w-2/5">
              <div className="flex items-center gap-3 mb-6">
                {mergedData.content?.companyInfo?.logo ? (
                  <div className="flex">
                    <Image
                      src={mergedData.content.companyInfo.logo}
                      alt={replaceBaheya(
                        mergedData.content?.companyInfo?.name ||
                          "Baheya Real Estate",
                      )}
                      width={100}
                      height={100}
                      className="rounded-full object-contain"
                    />
                  </div>
                ) : (
                  <Link href="/" className="block">
                    <div className="relative w-48 h-32">
                      <Image
                        src="/images/main/logo.png"
                        alt="تعاريف العقارية"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </Link>
                )}
                {mergedData.content?.companyInfo?.name && (
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {replaceBaheya(mergedData.content.companyInfo.name)}
                    </h3>
                    {mergedData.content?.companyInfo?.tagline && (
                      <p className="text-sm text-white/80">
                        {replaceBaheya(mergedData.content.companyInfo.tagline)}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Contact Information */}
              <ul className="space-y-4 mb-6">
                <li className="flex items-center gap-3">
                  <span className="flex-shrink-0">
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 fill-current"
                      viewBox="0 0 384 512"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"></path>
                    </svg>
                  </span>
                  <span className="text-base">
                    {replaceBaheya(mergedData.content?.contactInfo?.address)}
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <a
                    href={`mailto:${mergedData.content?.contactInfo?.email}`}
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                  >
                    <span className="flex-shrink-0">
                      <svg
                        aria-hidden="true"
                        className="w-5 h-5 fill-current"
                        viewBox="0 0 512 512"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M464 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm0 48v40.805c-22.422 18.259-58.168 46.651-134.587 106.49-16.841 13.247-50.201 45.072-73.413 44.701-23.208.375-56.579-31.459-73.413-44.701C106.18 199.465 70.425 171.067 48 152.805V112h416zM48 400V214.398c22.914 18.251 55.409 43.862 104.938 82.646 21.857 17.205 60.134 55.186 103.062 54.955 42.717.231 80.509-37.199 103.053-54.947 49.528-38.783 82.032-64.401 104.947-82.653V400H48z"></path>
                      </svg>
                    </span>
                    <span className="text-base">
                      {replaceBaheya(mergedData.content?.contactInfo?.email)}
                    </span>
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <a
                    href={mergedData.content?.contactInfo?.whatsappUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                  >
                    <span className="flex-shrink-0">
                      <svg
                        aria-hidden="true"
                        className="w-5 h-5 fill-current"
                        viewBox="0 0 512 512"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z"></path>
                      </svg>
                    </span>
                    <span className="text-base">
                      {replaceBaheya(mergedData.content?.contactInfo?.whatsapp)}
                    </span>
                  </a>
                </li>
              </ul>

              {/* Company Description */}
              <p className="text-base leading-relaxed text-white/90">
                {replaceBaheya(
                  mergedData.content?.companyInfo?.description ||
                    "نحن هنا لمساعدتك في كل خطوة — من البحث عن العقار المناسب، إلى إتمام المعاملة بكل احترافية وشفافية.",
                )}
              </p>
            </div>

            {/* Left Section - Newsletter */}
            <div className="w-full lg:w-1/2 xl:w-3/5 ">
              <h5 className="text-xl font-bold text-white mb-4">
                {replaceBaheya(
                  mergedData.content?.newsletter?.title ||
                    "اشترك في النشرة البريدية",
                )}
              </h5>
              <p className="text-base leading-relaxed text-white/90 mb-6">
                {replaceBaheya(
                  mergedData.content?.newsletter?.description ||
                    "كن أول من يتلقى آخر العروض، والأخبار العقارية، ونصائح الاستثمار من فريق تعاريف العقارية. املأ خانة رقم الواتساب وسنوافيك بكل جديد",
                )}
              </p>

              {/* Newsletter Form */}
              <form
                onSubmit={handleNewsletterSubmit}
                className="flex flex-col sm:flex-row gap-3 mb-8"
              >
                <input
                  type="tel"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder={replaceBaheya(
                    mergedData.content?.newsletter?.placeholder ||
                      "رقم الواتساب",
                  )}
                  required
                  pattern="[0-9()#&+*-=.]+"
                  title="يتم قبول الأرقام وأحرف الهاتف فقط (#، - ، *، إلخ)."
                  className="flex-1 px-4 py-3 rounded-lg bg-[#a67c5a] text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-lg bg-[#a67c5a] text-white font-semibold hover:bg-[#9a6f4f] transition-colors whitespace-nowrap"
                >
                  {replaceBaheya(
                    mergedData.content?.newsletter?.buttonText || "اشترك الآن",
                  )}
                </button>
              </form>

              {/* Social Media Icons */}
              <div className="flex items-center gap-4">
                {mergedData.content?.socialMedia?.platforms?.map(
                  (platform: any, index: number) => (
                    <a
                      key={index}
                      href={platform.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center hover:opacity-80 transition-opacity"
                      aria-label={platform.name}
                    >
                      {platform.name === "Facebook" && (
                        <svg
                          aria-hidden="true"
                          className="w-6 h-6 fill-current"
                          viewBox="0 0 512 512"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"></path>
                        </svg>
                      )}
                      {platform.name === "YouTube" && (
                        <svg
                          aria-hidden="true"
                          className="w-6 h-6 fill-current"
                          viewBox="0 0 576 512"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"></path>
                        </svg>
                      )}
                      {platform.name === "Instagram" && (
                        <svg
                          aria-hidden="true"
                          className="w-6 h-6 fill-current"
                          viewBox="0 0 448 512"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path>
                        </svg>
                      )}
                      {platform.name === "X (Twitter)" && (
                        <svg
                          aria-hidden="true"
                          className="w-6 h-6 fill-current"
                          viewBox="0 0 512 512"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path>
                        </svg>
                      )}
                      {platform.name === "Snapchat" && (
                        <svg
                          aria-hidden="true"
                          className="w-6 h-6 fill-current"
                          viewBox="0 0 496 512"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm169.5 338.9c-3.5 8.1-18.1 14-44.8 18.2-1.4 1.9-2.5 9.8-4.3 15.9-1.1 3.7-3.7 5.9-8.1 5.9h-.2c-6.2 0-12.8-2.9-25.8-2.9-17.6 0-23.7 4-37.4 13.7-14.5 10.3-28.4 19.1-49.2 18.2-21 1.6-38.6-11.2-48.5-18.2-13.8-9.7-19.8-13.7-37.4-13.7-12.5 0-20.4 3.1-25.8 3.1-5.4 0-7.5-3.3-8.3-6-1.8-6.1-2.9-14.1-4.3-16-13.8-2.1-44.8-7.5-45.5-21.4-.2-3.6 2.3-6.8 5.9-7.4 46.3-7.6 67.1-55.1 68-57.1 0-.1.1-.2.2-.3 2.5-5 3-9.2 1.6-12.5-3.4-7.9-17.9-10.7-24-13.2-15.8-6.2-18-13.4-17-18.3 1.6-8.5 14.4-13.8 21.9-10.3 5.9 2.8 11.2 4.2 15.7 4.2 3.3 0 5.5-.8 6.6-1.4-1.4-23.9-4.7-58 3.8-77.1C183.1 100 230.7 96 244.7 96c.6 0 6.1-.1 6.7-.1 34.7 0 68 17.8 84.3 54.3 8.5 19.1 5.2 53.1 3.8 77.1 1.1.6 2.9 1.3 5.7 1.4 4.3-.2 9.2-1.6 14.7-4.2 4-1.9 9.6-1.6 13.6 0 6.3 2.3 10.3 6.8 10.4 11.9.1 6.5-5.7 12.1-17.2 16.6-1.4.6-3.1 1.1-4.9 1.7-6.5 2.1-16.4 5.2-19 11.5-1.4 3.3-.8 7.5 1.6 12.5.1.1.1.2.2.3.9 2 21.7 49.5 68 57.1 4 1 7.1 5.5 4.9 10.8z"></path>
                        </svg>
                      )}
                    </a>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* Bottom Section - Copyright and Links */}
          <div className="border-t border-white/20 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-base text-white/90 text-center md:text-right">
                {(() => {
                  const copyright =
                    mergedData.footerBottom?.copyright ||
                    `جميع الحقوق محفوظة لشركة تعاريف العقارية 2025© | صمم من طرف وكالة سهيل`;
                  // إزالة " | صمم من طرف وكالة سهيل" تلقائياً إذا كان موجوداً
                  let cleaned = copyright.replace(
                    /\s*\|\s*صمم من طرف وكالة سهيل\s*/g,
                    "",
                  );
                  // استبدال "باهية" بـ "تعاريف" تلقائياً
                  return replaceBaheya(cleaned);
                })()}
              </p>
              <div className="flex items-center gap-6">
                {mergedData.footerBottom?.legalLinks?.map(
                  (link: any, index: number) => (
                    <Link
                      key={index}
                      href={link.url || "#"}
                      className="text-base text-white hover:underline"
                    >
                      {replaceBaheya(link.text)}
                    </Link>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      {/* <a
        href={mergedData.floatingWhatsApp?.url || "https://wa.link/0ysvug"}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        aria-label="Contact us on WhatsApp"
      >
        <svg
          className="w-8 h-8 fill-white"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.98 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </a> */}
    </>
  );
}
