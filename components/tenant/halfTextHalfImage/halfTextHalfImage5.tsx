"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { getDefaultHalfTextHalfImage5Data } from "@/context/editorStoreFunctions/halfTextHalfImageFunctions";

// ═══════════════════════════════════════════════════════════
// PROPS INTERFACE
// ═══════════════════════════════════════════════════════════
interface HalfTextHalfImage5Props {
  visible?: boolean;
  ThemeTwo?: string;
  layout?: {
    direction?: string;
    maxWidth?: string;
    gap?: string;
  };
  spacing?: {
    padding?: {
      top?: string;
      bottom?: string;
      left?: string;
      right?: string;
    };
  };
  content?: {
    description?: string;
    items?: Array<{
      id?: string;
      text?: string;
    }>;
  };
  styling?: {
    backgroundColor?: string;
    textColor?: string;
    dividerColor?: string;
    iconColor?: string;
  };
  image?: {
    src?: string;
    alt?: string;
    visible?: boolean;
  };
  // Editor props
  variant?: string;
  useStore?: boolean;
  id?: string;
}

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════
export default function HalfTextHalfImage5(props: HalfTextHalfImage5Props) {
  // ─────────────────────────────────────────────────────────
  // 1. EXTRACT UNIQUE ID
  // ─────────────────────────────────────────────────────────
  const variantId = props.variant || "halfTextHalfImage5";
  const uniqueId = props.id || variantId;

  // ─────────────────────────────────────────────────────────
  // 2. CONNECT TO STORES
  // ─────────────────────────────────────────────────────────
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const halfTextHalfImageStates = useEditorStore(
    (s) => s.halfTextHalfImageStates,
  );

  const tenantData = useTenantStore((s) => s.tenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  // ─────────────────────────────────────────────────────────
  // 3. INITIALIZE IN STORE (on mount)
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (tenantId) {
      fetchTenantData(tenantId);
    }
  }, [tenantId, fetchTenantData]);

  // Get tenant data for this specific component variant
  const getTenantComponentData = () => {
    if (!tenantData) return {};

    // Check new structure (tenantData.components)
    if (tenantData.components && Array.isArray(tenantData.components)) {
      for (const component of tenantData.components) {
        if (
          component.type === "halfTextHalfImage" &&
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
              (component as any).type === "halfTextHalfImage" &&
              (component as any).componentName === variantId &&
              componentId === props.id
            ) {
              return (component as any).data;
            }
          }
        }
      }
    }

    return {};
  };

  useEffect(() => {
    if (props.useStore) {
      // Get tenant component data inside useEffect to avoid infinite loops
      const tenantComponentData = getTenantComponentData();

      // ✅ Use database data if available
      const initialData =
        tenantComponentData && Object.keys(tenantComponentData).length > 0
          ? {
              ...getDefaultHalfTextHalfImage5Data(),
              ...tenantComponentData, // Database data takes priority
              ...props,
            }
          : {
              ...getDefaultHalfTextHalfImage5Data(),
              ...props,
            };

      // Initialize in store
      ensureComponentVariant("halfTextHalfImage", uniqueId, initialData);
    }
  }, [
    uniqueId,
    props.useStore,
    ensureComponentVariant,
    variantId,
    props.id,
    tenantData,
  ]);

  // ─────────────────────────────────────────────────────────
  // 4. RETRIEVE DATA FROM STORE
  // ─────────────────────────────────────────────────────────
  const storeData = halfTextHalfImageStates[uniqueId];
  const currentStoreData = getComponentData("halfTextHalfImage", uniqueId);
  const tenantComponentData = getTenantComponentData();

  // ─────────────────────────────────────────────────────────
  // 5. MERGE DATA (PRIORITY ORDER)
  // ─────────────────────────────────────────────────────────
  const mergedData = {
    ...getDefaultHalfTextHalfImage5Data(), // 1. Defaults (lowest priority)
    ...tenantComponentData, // 2. Tenant data from database
    ...storeData, // 3. Store state
    ...currentStoreData, // 4. Current store data
    ...props, // 5. Props (highest priority)
  };

  // ─────────────────────────────────────────────────────────
  // 6. EARLY RETURN IF NOT VISIBLE
  // ─────────────────────────────────────────────────────────
  if (!mergedData.visible) {
    return null;
  }

  // ─────────────────────────────────────────────────────────
  // 7. RENDER
  // ─────────────────────────────────────────────────────────
  return (
    <section
      className="w-full flex items-center justify-center py-12 md:py-16"
      style={{
        backgroundColor: mergedData.styling?.backgroundColor || "#f5f0e8",
        paddingTop: mergedData.spacing?.padding?.top || "3rem",
        paddingBottom: mergedData.spacing?.padding?.bottom || "4rem",
        paddingLeft: mergedData.spacing?.padding?.left || "1rem",
        paddingRight: mergedData.spacing?.padding?.right || "1rem",
      }}
    >
      <div
        className="w-full mx-auto px-4 md:px-6 lg:px-8"
        style={{
          maxWidth: mergedData.layout?.maxWidth || "1152px",
        }}
      >
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Left Side - Text Content */}
          <div className="w-full md:w-[50%] order-2 md:order-2 flex flex-col justify-center text-right">
            {/* Main Paragraph */}
            <div className="mb-6">
              <p
                className="text-base md:text-lg leading-relaxed"
                style={{
                  color: mergedData.styling?.textColor || "#5c3e2a",
                }}
              >
                {mergedData.content?.description ||
                  "ندير عنك كل شيء… من الإعلان حتى التوقيع. في باهية، نوفّر لك مستأجرًا موثوقًا ونتولى إدارة عملية التأجير بالكامل، من التسويق والتواصل، حتى إعداد العقود واستلام الدفعات. كل ذلك باحترافية، شفافية، وتجربة تُبقيك مطمئنًا دائمًا"}
              </p>
            </div>

            {/* Divider */}
            <div
              className="w-24 h-[2px] mb-6"
              style={{
                backgroundColor: mergedData.styling?.dividerColor || "#5c3e2a",
              }}
            ></div>

            {/* Bulleted List with Checkmarks */}
            <ul className="space-y-4">
              {(mergedData.content?.items || []).map((item, index) => (
                <li
                  key={item.id || index}
                  className="flex items-start gap-3 text-right"
                >
                  <span className="flex-shrink-0 mt-1">
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5"
                      style={{
                        color: mergedData.styling?.iconColor || "#5c3e2a",
                      }}
                      viewBox="0 0 512 512"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill="currentColor"
                        d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"
                      ></path>
                    </svg>
                  </span>
                  <span
                    className="text-base md:text-lg"
                    style={{
                      color: mergedData.styling?.textColor || "#5c3e2a",
                    }}
                  >
                    {item.text || ""}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Side - Image (Cityscape) */}
          {(mergedData.image?.visible ?? true) && (
            <div className="w-full md:w-[50%] order-1 md:order-1 relative h-[300px] md:h-[500px] rounded-xl overflow-hidden">
              <Image
                src={
                  mergedData.image?.src ||
                  "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2000"
                }
                alt={mergedData.image?.alt || "منظر المدينة"}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
