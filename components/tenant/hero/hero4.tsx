"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Mail } from "lucide-react";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { getDefaultHero4Data } from "@/context/editorStoreFunctions/heroFunctions";
import PropertyFilter2 from "@/components/tenant/propertyFilter/propertyFilter2";

interface Hero4Props {
  title?: string;
  backgroundImage?: string;
  contact?: boolean;
  // Editor props
  variant?: string;
  useStore?: boolean;
  id?: string;
}

export default function Hero4(props: Hero4Props = {}) {
  // ─────────────────────────────────────────────────────────
  // 1. EXTRACT UNIQUE ID
  // ─────────────────────────────────────────────────────────
  const variantId = props.variant || "hero4";
  const uniqueId = props.id || variantId;

  // ─────────────────────────────────────────────────────────
  // 2. CONNECT TO STORES
  // ─────────────────────────────────────────────────────────
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const heroStates = useEditorStore((s) => s.heroStates);

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

  // Extract component data from tenantData (BEFORE useEffect)
  const getTenantComponentData = () => {
    if (!tenantData) return {};

    // Check new structure (tenantData.components)
    if (tenantData.components && Array.isArray(tenantData.components)) {
      for (const component of tenantData.components) {
        if (
          component.type === "hero" &&
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
              (component as any).type === "hero" &&
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

  const tenantComponentData = getTenantComponentData();

  useEffect(() => {
    if (props.useStore) {
      // ✅ Use database data if available
      const initialData =
        tenantComponentData && Object.keys(tenantComponentData).length > 0
          ? {
              ...getDefaultHero4Data(),
              ...tenantComponentData, // Database data takes priority
              ...props,
            }
          : {
              ...getDefaultHero4Data(),
              ...props,
            };

      // Initialize in store
      ensureComponentVariant("hero", uniqueId, initialData);
    }
  }, [uniqueId, props.useStore, ensureComponentVariant, tenantComponentData]);

  // ─────────────────────────────────────────────────────────
  // 4. RETRIEVE DATA FROM STORE
  // ─────────────────────────────────────────────────────────
  const storeData = heroStates[uniqueId];
  const currentStoreData = getComponentData("hero", uniqueId);

  // ─────────────────────────────────────────────────────────
  // 5. MERGE DATA (PRIORITY ORDER)
  // ─────────────────────────────────────────────────────────
  const mergedData = {
    ...getDefaultHero4Data(), // 1. Defaults (lowest priority)
    ...storeData, // 2. Store state
    ...currentStoreData, // 3. Current store data
    ...props, // 4. Props (highest priority)
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
    <div
      className={`relative w-full flex items-center justify-center pb-20  ${
        mergedData.barType === "contact" || mergedData.contact
          ? "sm:pb-[400px]"
          : mergedData.barType === "propertyFilter"
            ? "sm:pb-[50px]"
            : "sm:pb-[50px] "
      }`}
    >
      {/* Hero Section - Image with max height 200px */}
      <section className="relative w-full h-[300px] overflow-visible">
        {/* Background Image */}
        <Image
          src={
            mergedData.backgroundImage ||
            mergedData.background?.image ||
            "https://dalel-lovat.vercel.app/images/hero.webp"
          }
          alt="صورة خلفية"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30 z-[1]" />

        {/* Title */}
        <div className="absolute inset-0 z-[2] flex items-center justify-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
            {mergedData.title ||
              mergedData.content?.title ||
              "عن تعاريف العقارية"}
          </h2>
        </div>
      </section>

      {/* Floating Contact Form Bar - طائرة بين القسمين */}
      <div
        className={`absolute top-0   ${
          mergedData.barType === "contact" || mergedData.contact
            ? "max-w-6xl mt-[13rem]"
            : mergedData.barType === "propertyFilter"
              ? "max-w-[1000px] mt-[15rem]"
              : "max-w-7xl mt-[16rem]"
        }  z-[10] w-full  px-4 sm:px-6 lg:px-8`}
      >
        {mergedData.barType === "propertyFilter" ? (
          // Property Filter
          <div className="bg-white rounded-2xl shadow-2xl  py-1">
            <PropertyFilter2
              useStore={props.useStore}
              id={`${uniqueId}-propertyFilter`}
              variant="propertyFilter2"
              content={mergedData.propertyFilterConfig}
            />
          </div>
        ) : mergedData.barType === "contact" || mergedData.contact ? (
          // Contact Form
          <div className="bg-white rounded-2xl shadow-2xl p-5">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Right Side - Contact Form */}
              <div className="w-full lg:w-[60%]">
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="md:col-span-1">
                      <label
                        htmlFor="fullName"
                        className="block text-sm font-medium text-[#8b5f46] mb-2 text-right"
                      >
                        الاسم الكامل
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        placeholder="الاسم الكامل"
                        required
                        className="w-full px-4 py-3 rounded-lg bg-[#f5f0e8] border border-transparent focus:border-[#8b5f46] focus:outline-none text-right text-[#8b5f46] placeholder:text-[#8b5f46]/60"
                      />
                    </div>

                    {/* WhatsApp Number */}
                    <div className="md:col-span-1">
                      <label
                        htmlFor="whatsapp"
                        className="block text-sm font-medium text-[#8b5f46] mb-2 text-right"
                      >
                        رقم الواتساب
                      </label>
                      <input
                        type="tel"
                        id="whatsapp"
                        name="whatsapp"
                        placeholder="رقم الواتساب"
                        required
                        pattern="[0-9()#&+*-=.]+"
                        className="w-full px-4 py-3 rounded-lg bg-[#f5f0e8] border border-transparent focus:border-[#8b5f46] focus:outline-none text-right text-[#8b5f46] placeholder:text-[#8b5f46]/60"
                      />
                    </div>

                    {/* Email */}
                    <div className="md:col-span-1">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-[#8b5f46] mb-2 text-right"
                      >
                        البريد الالكتروني
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="البريد الالكتروني"
                        required
                        className="w-full px-4 py-3 rounded-lg bg-[#f5f0e8] border border-transparent focus:border-[#8b5f46] focus:outline-none text-right text-[#8b5f46] placeholder:text-[#8b5f46]/60"
                      />
                    </div>

                    {/* Subject */}
                    <div className="md:col-span-1">
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-[#8b5f46] mb-2 text-right"
                      >
                        الموضوع
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        placeholder="موضوع الرسالة"
                        required
                        className="w-full px-4 py-3 rounded-lg bg-[#f5f0e8] border border-transparent focus:border-[#8b5f46] focus:outline-none text-right text-[#8b5f46] placeholder:text-[#8b5f46]/60"
                      />
                    </div>
                  </div>

                  {/* Message Content */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-[#8b5f46] mb-2 text-right"
                    >
                      محتوى الرسالة
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      placeholder="محتوى الرسالة"
                      required
                      className="w-full px-4 py-3 rounded-lg bg-[#f5f0e8] border border-transparent focus:border-[#8b5f46] focus:outline-none text-right text-[#8b5f46] placeholder:text-[#8b5f46]/60 resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-8 py-1 bg-[#8b5f46] text-white rounded-lg hover:bg-[#6b4630] transition-colors font-medium"
                    >
                      إرسال
                    </button>
                  </div>
                </form>
              </div>

              {/* Left Side - Contact Information */}
              <div className="w-full lg:w-[40%] space-y-6">
                <p className="text-black font-medium text-right">
                  أو تواصل معنا مباشرة عبر:
                </p>

                <ul className="space-y-4">
                  {/* WhatsApp 1 */}
                  <li>
                    <a
                      href="https://api.whatsapp.com/send?phone=966542120011"
                      target="_blank"
                      rel="noopener"
                      className="flex items-center gap-3 text-right hover:text-[#6b4630] transition-colors"
                    >
                      <span className="text-[#8b5f46]">
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5 fill-current"
                          viewBox="0 0 448 512"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path>
                        </svg>
                      </span>
                      <span className="text-[#8b5f46]">0542120011</span>
                    </a>
                  </li>

                  {/* WhatsApp 2 */}
                  <li>
                    <a
                      href="https://api.whatsapp.com/send/?phone=966543332538&text&type=phone_number&app_absent=0"
                      target="_blank"
                      rel="noopener"
                      className="flex items-center gap-3 text-right hover:text-[#6b4630] transition-colors"
                    >
                      <span className="text-[#8b5f46]">
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5 fill-current"
                          viewBox="0 0 448 512"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path>
                        </svg>
                      </span>
                      <span className="text-[#8b5f46]">0543332538</span>
                    </a>
                  </li>

                  {/* Email */}
                  <li>
                    <a
                      href="mailto:contact@baheya.co"
                      className="flex items-center gap-3 text-right hover:text-[#6b4630] transition-colors"
                    >
                      <span className="text-[#8b5f46]">
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5 fill-current"
                          viewBox="0 0 512 512"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M494.586 164.516c-4.697-3.883-111.723-89.95-135.251-108.657C337.231 38.191 299.437 0 256 0c-43.205 0-80.636 37.717-103.335 55.859-24.463 19.45-131.07 105.195-135.15 108.549A48.004 48.004 0 0 0 0 201.485V464c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V201.509a48 48 0 0 0-17.414-36.993zM464 458a6 6 0 0 1-6 6H54a6 6 0 0 1-6-6V204.347c0-1.813.816-3.526 2.226-4.665 15.87-12.814 108.793-87.554 132.364-106.293C200.755 78.88 232.398 48 256 48c23.693 0 55.857 31.369 73.41 45.389 23.573 18.741 116.503 93.493 132.366 106.316a5.99 5.99 0 0 1 2.224 4.663V458zm-31.991-187.704c4.249 5.159 3.465 12.795-1.745 16.981-28.975 23.283-59.274 47.597-70.929 56.863C336.636 362.283 299.205 400 256 400c-43.452 0-81.287-38.237-103.335-55.86-11.279-8.967-41.744-33.413-70.927-56.865-5.21-4.187-5.993-11.822-1.745-16.981l15.258-18.528c4.178-5.073 11.657-5.843 16.779-1.726 28.618 23.001 58.566 47.035 70.56 56.571C200.143 320.631 232.307 352 256 352c23.602 0 55.246-30.88 73.41-45.389 11.994-9.535 41.944-33.57 70.563-56.568 5.122-4.116 12.601-3.346 16.778 1.727l15.258 18.526z"></path>
                        </svg>
                      </span>
                      <span className="text-[#8b5f46]">contact@baheya.co</span>
                    </a>
                  </li>

                  {/* Location */}
                  <li>
                    <a
                      href="#"
                      className="flex items-center gap-3 text-right hover:text-[#6b4630] transition-colors"
                    >
                      <span className="text-[#8b5f46]">
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5 fill-current"
                          viewBox="0 0 576 512"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M560.02 32c-1.96 0-3.98.37-5.96 1.16L384.01 96H384L212 35.28A64.252 64.252 0 0 0 191.76 32c-6.69 0-13.37 1.05-19.81 3.14L20.12 87.95A32.006 32.006 0 0 0 0 117.66v346.32C0 473.17 7.53 480 15.99 480c1.96 0 3.97-.37 5.96-1.16L192 416l172 60.71a63.98 63.98 0 0 0 40.05.15l151.83-52.81A31.996 31.996 0 0 0 576 394.34V48.02c0-9.19-7.53-16.02-15.98-16.02zM224 90.42l128 45.19v285.97l-128-45.19V90.42zM48 418.05V129.07l128-44.53v286.2l-.64.23L48 418.05zm480-35.13l-128 44.53V141.26l.64-.24L528 93.95v288.97z"></path>
                        </svg>
                      </span>
                      <span className="text-[#8b5f46]">
                        المملكة العربية السعودية - الرياض
                      </span>
                    </a>
                  </li>
                </ul>

                {/* Divider */}
                <div className="h-px bg-gray-300 my-6"></div>

                {/* Social Media */}
                <div>
                  <p className="text-black text-right mb-4 text-base md:text-lg font-medium">
                    لا تنسى متابعتنا على مواقع التواصل الاجتماعي
                  </p>
                  <div className="flex gap-3 justify-start flex-wrap">
                    {/* Snapchat */}
                    <a
                      href="https://www.snapchat.com/add/baheyarealstate?share_id=CH-Am1w1NlU&locale=ar-AE"
                      target="_blank"
                      rel="noopener"
                      className="flex items-center justify-center hover:opacity-70 transition-opacity"
                    >
                      <svg
                        aria-hidden="true"
                        className="w-6 h-6 fill-[#8b5f46]"
                        viewBox="0 0 496 512"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm169.5 338.9c-3.5 8.1-18.1 14-44.8 18.2-1.4 1.9-2.5 9.8-4.3 15.9-1.1 3.7-3.7 5.9-8.1 5.9h-.2c-6.2 0-12.8-2.9-25.8-2.9-17.6 0-23.7 4-37.4 13.7-14.5 10.3-28.4 19.1-49.2 18.2-21 1.6-38.6-11.2-48.5-18.2-13.8-9.7-19.8-13.7-37.4-13.7-12.5 0-20.4 3.1-25.8 3.1-5.4 0-7.5-3.3-8.3-6-1.8-6.1-2.9-14.1-4.3-16-13.8-2.1-44.8-7.5-45.5-21.4-.2-3.6 2.3-6.8 5.9-7.4 46.3-7.6 67.1-55.1 68-57.1 0-.1.1-.2.2-.3 2.5-5 3-9.2 1.6-12.5-3.4-7.9-17.9-10.7-24-13.2-15.8-6.2-18-13.4-17-18.3 1.6-8.5 14.4-13.8 21.9-10.3 5.9 2.8 11.2 4.2 15.7 4.2 3.3 0 5.5-.8 6.6-1.4-1.4-23.9-4.7-58 3.8-77.1C183.1 100 230.7 96 244.7 96c.6 0 6.1-.1 6.7-.1 34.7 0 68 17.8 84.3 54.3 8.5 19.1 5.2 53.1 3.8 77.1 1.1.6 2.9 1.3 5.7 1.4 4.3-.2 9.2-1.6 14.7-4.2 4-1.9 9.6-1.6 13.6 0 6.3 2.3 10.3 6.8 10.4 11.9.1 6.5-5.7 12.1-17.2 16.6-1.4.6-3.1 1.1-4.9 1.7-6.5 2.1-16.4 5.2-19 11.5-1.4 3.3-.8 7.5 1.6 12.5.1.1.1.2.2.3.9 2 21.7 49.5 68 57.1 4 1 7.1 5.5 4.9 10.8z"></path>
                      </svg>
                    </a>

                    {/* X/Twitter */}
                    <a
                      href="https://x.com/bahiarealstate?t=U_Fm4pDkJj73HPkY_mHDWQ&s=08"
                      target="_blank"
                      rel="noopener"
                      className="flex items-center justify-center hover:opacity-70 transition-opacity"
                    >
                      <svg
                        aria-hidden="true"
                        className="w-6 h-6 fill-[#8b5f46]"
                        viewBox="0 0 512 512"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path>
                      </svg>
                    </a>

                    {/* Instagram */}
                    <a
                      href="https://www.instagram.com/baheyarealestat?igsh=enA3cW1tbjRjbHU4"
                      target="_blank"
                      rel="noopener"
                      className="flex items-center justify-center hover:opacity-70 transition-opacity"
                    >
                      <svg
                        aria-hidden="true"
                        className="w-6 h-6 fill-[#8b5f46]"
                        viewBox="0 0 448 512"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path>
                      </svg>
                    </a>

                    {/* YouTube */}
                    <a
                      href="https://youtube.com/channel/UCVru6ldyQvpyuxl1lkd_oUQ?si=v6LprF-hXxagAhrp"
                      target="_blank"
                      rel="noopener"
                      className="flex items-center justify-center hover:opacity-70 transition-opacity"
                    >
                      <svg
                        aria-hidden="true"
                        className="w-6 h-6 fill-[#8b5f46]"
                        viewBox="0 0 576 512"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"></path>
                      </svg>
                    </a>

                    {/* Facebook */}
                    <a
                      href="https://www.facebook.com/share/1C974jrjRc/"
                      target="_blank"
                      rel="noopener"
                      className="flex items-center justify-center hover:opacity-70 transition-opacity"
                    >
                      <svg
                        aria-hidden="true"
                        className="w-6 h-6 fill-[#8b5f46]"
                        viewBox="0 0 512 512"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Default Bar
          <div className="bg-white rounded-2xl shadow-2xl py-5 px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Right side - Question (في RTL يكون على اليمين) */}
              <div className="order-2 sm:order-1 text-right sm:text-right">
                <h5 className="text-base md:text-lg font-medium text-gray-700">
                  هل لديك استفسار؟
                </h5>
              </div>

              {/* Left side - Buttons (في RTL يكون على اليسار) */}
              <div className="order-1 sm:order-2 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
                {/* WhatsApp Button */}
                <a
                  href="https://wa.link/0ysvug"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8b5f46] text-white hover:bg-[#6b4630] transition-colors w-full sm:w-auto justify-center sm:justify-start"
                >
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5 fill-current"
                    viewBox="0 0 448 512"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path>
                  </svg>
                  <span className="text-sm md:text-base font-medium whitespace-nowrap">
                    0542120011
                  </span>
                </a>

                {/* Email Button */}
                <a
                  href="mailto:contact@baheya.co"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8b5f46] text-white hover:bg-[#6b4630] transition-colors w-full sm:w-auto justify-center sm:justify-start"
                >
                  <Mail className="w-5 h-5" />
                  <span className="text-sm md:text-base font-medium whitespace-nowrap">
                    contact@baheya.co
                  </span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
