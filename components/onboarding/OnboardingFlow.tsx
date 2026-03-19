"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/context/AuthContext";
import { ONBOARDING_STEPS, ONBOARDING_STEPS_COUNT } from "@/lib/onboarding/steps";
import { clampStepIndex } from "@/utils/onboarding/stepNavigation";
import { OnboardingNavigation } from "./OnboardingNavigation";
import { OnboardingStepPanel } from "./OnboardingStepPanel";
import { OnboardingStepsHeader } from "./OnboardingStepsHeader";
import OnboardingStep5 from "./steps/Step5";
import { OnboardingHelpOfferDialog } from "./OnboardingHelpOfferDialog";
import { OnboardingSocialLinksRow } from "./OnboardingSocialLinksRow";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axiosInstance";
import { uploadSingleFile } from "@/utils/uploadSingle";
import { usePropertyFormStore } from "@/context/store/dashboard/properties/propertyForm";
import { validateForm as validatePropertyForm } from "@/components/property/property-form/utils/validation";
import { formatPropertyData } from "@/components/property/property-form/utils/formatters";
import { createProperty } from "@/components/property/property-form/services/propertyApi";
import { setPropertyReferenceDataToastsSuppressed } from "@/components/property/property-form/services/dataService";
import { buildOnboardingPostBody } from "@/lib/onboarding/onboardingPayload";
import {
  clearOnboardingStep1Cache,
  dataUrlToFile,
  readFileAsDataUrl,
  readOnboardingStep1Cache,
  writeOnboardingStep1Cache,
} from "@/lib/onboarding/step1SessionCache";

const ONBOARDING_HELP_SOCIAL_LINKS = {
  instagram:
    process.env.NEXT_PUBLIC_ONBOARDING_INSTAGRAM_URL?.trim() || undefined,
  facebook:
    process.env.NEXT_PUBLIC_ONBOARDING_FACEBOOK_URL?.trim() || undefined,
  linkedin:
    process.env.NEXT_PUBLIC_ONBOARDING_LINKEDIN_URL?.trim() || undefined,
};

export function OnboardingFlow({
  disableCompletionRedirect = false,
  hideSkipOnSecondStep = false,
}: {
  disableCompletionRedirect?: boolean;
  /** e.g. onboarding-test: require completing step 2 (contact) without skip. */
  hideSkipOnSecondStep?: boolean;
}) {
  const router = useRouter();
  const setOnboardingCompleted = useAuthStore((s) => s.setOnboardingCompleted);
  const onboardingCompleted = useAuthStore((s) => s.onboarding_completed);

  const [stepIndex, setStepIndex] = useState(0);
  const currentStepIndex = clampStepIndex(stepIndex, ONBOARDING_STEPS_COUNT);
  // الافتراضي: إنشاء عقار جديد (واجهة التبديل بين المواقع/جديد معلّقة أدناه)
  const [step3ActiveTab, setStep3ActiveTab] = useState<"sites" | "new">("new");
  const isCompletionStep = currentStepIndex === ONBOARDING_STEPS_COUNT - 1;
  const completionSteps = ONBOARDING_STEPS.filter((s) => s.id !== "step-5");

  // Step 1 state (name + logo + colors)
  const [siteName, setSiteName] = useState("");
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [manualColorsVisible, setManualColorsVisible] = useState(false);
  const [manualHexes, setManualHexes] = useState<string[]>([
    "#5BC4C0",
    "#4CAF82",
    "#1A3C34",
  ]);
  const [selectedPaletteName, setSelectedPaletteName] = useState<string>("");
  const [savingStep1, setSavingStep1] = useState(false);
  const [savingStep3, setSavingStep3] = useState(false);
  const [helpOfferDialogOpen, setHelpOfferDialogOpen] = useState(false);

  // Step 2 (بيانات التواصل) — merged into POST /onboarding
  const [step2Phone, setStep2Phone] = useState("");
  const [step2PhoneHasError, setStep2PhoneHasError] = useState(false);
  const setStep2PhoneClearingError = useCallback(
    (value: React.SetStateAction<string>) => {
      setStep2PhoneHasError(false);
      setStep2Phone(value);
    },
    [],
  );
  const [step2Email, setStep2Email] = useState("");
  const [step2Address, setStep2Address] = useState("");
  const [step2WorkingHours, setStep2WorkingHours] = useState("");
  const [step2ValLicense, setStep2ValLicense] = useState("");
  const [step2FaviconFile, setStep2FaviconFile] = useState<File | null>(null);
  const [step2FaviconPreview, setStep2FaviconPreview] = useState<string | null>(null);

  // Step 3 (new property) state from property form store
  const step3FormData = usePropertyFormStore((s) => s.formData);
  const step3Images = usePropertyFormStore((s) => s.images);
  const step3Previews = usePropertyFormStore((s) => s.previews);
  const step3Video = usePropertyFormStore((s) => s.video);
  const step3VideoPreview = usePropertyFormStore((s) => s.videoPreview);
  const step3Faqs = usePropertyFormStore((s) => s.faqs);
  const setStep3Errors = usePropertyFormStore((s) => s.setErrors);

  /** Synchronous in-flight guards — blocks double-submit before React re-renders (PREVENT_DUPLICATE_API_PROMPT). */
  const persistStep1InFlightRef = useRef(false);
  const postOnboardingInFlightRef = useRef(false);
  const saveStep3InFlightRef = useRef(false);

  const normalizeHexForPreview = (hex: string, fallback: string) => {
    const raw = hex.trim().toUpperCase();
    const withHash = raw.startsWith("#") ? raw : `#${raw}`;
    return /^#[0-9A-F]{6}$/.test(withHash) ? withHash : fallback;
  };

  /** Step 1 (هوية الموقع): cache only — no API. */
  const persistStep1ToSession = async () => {
    if (persistStep1InFlightRef.current) return false;
    if (!siteName.trim()) {
      toast.error("يرجى إدخال اسم الموقع");
      return false;
    }

    persistStep1InFlightRef.current = true;
    setSavingStep1(true);
    try {
      let logoDataUrl: string | null = null;
      if (logoFile) {
        logoDataUrl = await readFileAsDataUrl(logoFile);
        if (logoPreviewUrl?.startsWith("blob:")) {
          URL.revokeObjectURL(logoPreviewUrl);
        }
      } else if (logoPreviewUrl?.startsWith("data:")) {
        logoDataUrl = logoPreviewUrl;
      }

      const primary = normalizeHexForPreview(manualHexes[0] ?? "", "#5BC4C0");
      const secondary = normalizeHexForPreview(manualHexes[1] ?? "", "#4CAF82");
      const accent = normalizeHexForPreview(manualHexes[2] ?? "", "#1A3C34");

      const written = writeOnboardingStep1Cache({
        siteName: siteName.trim(),
        colors: { primary, secondary, accent },
        logoDataUrl,
        manualHexes: [...manualHexes],
        selectedPaletteName,
        manualColorsVisible,
      });
      if (!written) {
        toast.error(
          "تعذر حفظ البيانات مؤقتاً (قد يكون الشعار كبيراً جداً). جرّب صورة أصغر أو تخطّ الشعار.",
        );
        return false;
      }

      setLogoFile(null);
      setLogoPreviewUrl(logoDataUrl);
      return true;
    } catch (err: any) {
      toast.error(err?.message || "تعذر حفظ بيانات الموقع مؤقتاً");
      return false;
    } finally {
      persistStep1InFlightRef.current = false;
      setSavingStep1(false);
    }
  };

  /** Step 2 (بيانات التواصل): POST /onboarding — يتضمن دائماً `category: "realestate"`. */
  const postOnboardingFromCachedStep1 = async () => {
    if (postOnboardingInFlightRef.current) return false;
    const cached = readOnboardingStep1Cache();
    if (!cached?.siteName?.trim()) {
      toast.error("يرجى إكمال خطوة هوية الموقع أولاً");
      return false;
    }

    if (!step2Phone.trim()) {
      setStep2PhoneHasError(true);
      toast.error("يرجى إدخال رقم الجوال");
      return false;
    }

    postOnboardingInFlightRef.current = true;
    setSavingStep1(true);
    try {
      let logoUrl: string | null = null;
      if (cached.logoDataUrl) {
        const file = await dataUrlToFile(cached.logoDataUrl);
        const uploaded = await uploadSingleFile(file, "logo");
        logoUrl = uploaded?.url ?? null;
      }

      let faviconUrl: string | null = null;
      if (step2FaviconFile) {
        const uploaded = await uploadSingleFile(step2FaviconFile, "logo");
        faviconUrl = uploaded?.url ?? null;
      }

      const primary = normalizeHexForPreview(cached.colors.primary, "#5BC4C0");
      const secondary = normalizeHexForPreview(cached.colors.secondary, "#4CAF82");
      const accent = normalizeHexForPreview(cached.colors.accent, "#1A3C34");

      const body = buildOnboardingPostBody({
        title: cached.siteName.trim(),
        colors: { primary, secondary, accent },
        logoUrl,
        faviconUrl,
        address: step2Address,
        email: step2Email,
        workingHours: step2WorkingHours,
        valLicense: step2ValLicense,
        allowUpdate: true,
      });

      await axiosInstance.post("/onboarding", body);

      clearOnboardingStep1Cache();
      setStep2PhoneHasError(false);
      toast.success("تم حفظ بيانات الموقع");
      return true;
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "حدث خطأ أثناء حفظ بيانات الموقع";
      toast.error(message);
      return false;
    } finally {
      postOnboardingInFlightRef.current = false;
      setSavingStep1(false);
    }
  };

  const saveStep3NewPropertyToBackend = async () => {
    if (saveStep3InFlightRef.current) return false;
    saveStep3InFlightRef.current = true;
    setSavingStep3(true);
    try {
      const newErrors = validatePropertyForm(
        step3FormData,
        step3Images,
        step3Previews,
        "add",
      );
      setStep3Errors(newErrors as any);

      if (Object.keys(newErrors).length > 0) {
        toast.error("يرجى التحقق من الحقول المطلوبة وإصلاح الأخطاء.");
        return false;
      }

      const propertyData = await formatPropertyData(
        step3FormData as any,
        step3Images as any,
        step3Previews as any,
        step3Video,
        step3VideoPreview,
        step3Faqs as any,
        "add",
      );

      // Publish by default in onboarding flow.
      propertyData.status = 1;

      await createProperty(propertyData);
      return true;
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "حدث خطأ أثناء حفظ العقار";
      toast.error(message);
      return false;
    } finally {
      saveStep3InFlightRef.current = false;
      setSavingStep3(false);
    }
  };

  const handleContactUs = () => {
    const phoneNumber = "966592960339";
    const message = "مرحباً، أريد المساعدة في التسجيل";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  // Hydrate step 1 fields from session (refresh / return to flow).
  useEffect(() => {
    const c = readOnboardingStep1Cache();
    if (!c) return;
    setSiteName(c.siteName);
    setLogoPreviewUrl(c.logoDataUrl);
    setManualHexes(c.manualHexes);
    setSelectedPaletteName(c.selectedPaletteName);
    setManualColorsVisible(c.manualColorsVisible);
    setLogoFile(null);
  }, []);

  // Step 3 loads property reference GETs; suppress their toast.error (dashboard form still toasts).
  useEffect(() => {
    const isPropertyStep = currentStepIndex === 2;
    if (isPropertyStep) {
      setPropertyReferenceDataToastsSuppressed(true);
      return () => setPropertyReferenceDataToastsSuppressed(false);
    }
    setPropertyReferenceDataToastsSuppressed(false);
  }, [currentStepIndex]);

  // Prevent onboarding-test from redirecting if onboarding is already completed.
  useEffect(() => {
    if (!disableCompletionRedirect && onboardingCompleted) {
      router.push("/dashboard");
    }
  }, [disableCompletionRedirect, onboardingCompleted, router]);

  const finishOnboarding = () => {
    setOnboardingCompleted(true);
    router.push("/dashboard");
  };

  const handleSkip = () => {
    setStepIndex((prev) => clampStepIndex(prev + 1, ONBOARDING_STEPS_COUNT));
  };

  const handleBack = () => {
    setStepIndex((prev) => clampStepIndex(prev - 1, ONBOARDING_STEPS_COUNT));
  };

  const handleNext = () => {
    // Step 1 (هوية الموقع): write to sessionStorage only.
    if (currentStepIndex === 0) {
      void (async () => {
        const ok = await persistStep1ToSession();
        if (!ok) return;
        setStepIndex((prev) => clampStepIndex(prev + 1, ONBOARDING_STEPS_COUNT));
      })();
      return;
    }

    // Step 2 (بيانات التواصل): upload logo + POST /onboarding from cache.
    if (currentStepIndex === 1) {
      void (async () => {
        const ok = await postOnboardingFromCachedStep1();
        if (!ok) return;
        setStepIndex((prev) => clampStepIndex(prev + 1, ONBOARDING_STEPS_COUNT));
      })();
      return;
    }

    // Step 3 (new property tab): upload media then create property.
    if (currentStepIndex === 2 && step3ActiveTab === "new") {
      void (async () => {
        const ok = await saveStep3NewPropertyToBackend();
        if (!ok) return;
        setStepIndex((prev) => clampStepIndex(prev + 1, ONBOARDING_STEPS_COUNT));
      })();
      return;
    }

    setStepIndex((prev) => clampStepIndex(prev + 1, ONBOARDING_STEPS_COUNT));
  };

  return (
    <main className="relative min-h-screen flex flex-1 items-center justify-center p-4 bg-[#4F9E8E] overflow-hidden">
      <div className="pointer-events-none absolute  z-0 max-w-[70%]  bottom-0" aria-hidden="true">
        <img
          src="/onboardingBackground.svg"
          alt=""
          className="h-full w-full object-contain"
        />
      </div>
      

      <div className="absolute top-10 left-10 z-20 flex items-center gap-2">
        <span className="text-[14px] leading-none font-medium text-white whitespace-nowrap">
          هل تحتاج مساعدة؟
        </span>

        <button
          type="button"
          onClick={handleContactUs}
          className="rounded-full bg-white px-2.5 py-2 flex items-center gap-1.5 border border-transparent hover:shadow-sm"
        >
          {/* WhatsApp logo (small) */}
          <svg
            className="w-3 h-3"
            viewBox="0 0 24 24"
            fill="#4F9E8E"
            style={{ color: "#4F9E8E" }}
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
          </svg>
          <span
            className="text-[14px] leading-none font-medium"
            style={{ color: "#4F9E8E" }}
          >
            تواصل معنا
          </span>
        </button>
      </div>

      <div className="relative z-10 w-full max-w-[75%]">
        {!isCompletionStep && (
          <div className="text-center mb-6">
            <h1 className="text-[48px] font-bold text-white">
              موقعك الاحترافي جاهز خلال دقائق
            </h1>
            <p className="text-[24px] text-white mt-2">
              سنوجّهك لإعداد موقعك خطوة بخطوة بطريقة سهلة وسريعة
            </p>
          </div>
        )}

        {!isCompletionStep && (
          <OnboardingStepsHeader
            steps={ONBOARDING_STEPS}
            currentStepIndex={currentStepIndex}
          />
        )}

        {/* مبدل خطوة 3 (مخفي مؤقتاً): إضافة عقار من مواقع أخري | إنشاء عقار جديد
        {currentStepIndex === 2 && !isCompletionStep && (
          <div className="bg-white rounded-full p-1 max-w-[500px] justify-start mt-8">
            <div className="flex gap-2 rounded-full">
              <button
                type="button"
                onClick={() => setStep3ActiveTab("sites")}
                className={[
                  "flex-1 rounded-full px-4 py-1 text-[15px] font-semibold transition-colors",
                  step3ActiveTab === "sites"
                    ? "bg-[#4F9E8E] text-white"
                    : "bg-white text-[#4F9E8E] ",
                ].join(" ")}
              >
                إضافة عقار من مواقع أخري
              </button>

              <button
                type="button"
                onClick={() => setStep3ActiveTab("new")}
                className={[
                  "flex-1 rounded-full px-4 py-1 text-[15px] font-semibold transition-colors",
                  step3ActiveTab === "new"
                    ? "bg-[#4F9E8E] text-white"
                    : "bg-white text-[#4F9E8E] ",
                ].join(" ")}
              >
                إنشاء عقار جديد
              </button>
            </div>
          </div>
        )}
        */}

        <section
          className={[
            "mt-5 flex flex-col rounded-[2rem] border border-white bg-white/20 py-3 w-full",
            currentStepIndex === 2 ? "px-6" : "",
          ].join(" ")}
        >
          {isCompletionStep ? (
            <OnboardingStep5
              onExploreDashboard={finishOnboarding}
              steps={completionSteps}
            />
          ) : (
            <OnboardingStepPanel
              stepIndex={currentStepIndex}
              step3ActiveTab={step3ActiveTab}
              step1Props={{
                siteName,
                setSiteName,
                logoPreviewUrl,
                setLogoPreviewUrl,
                setLogoFile,
                manualColorsVisible,
                setManualColorsVisible,
                manualHexes,
                setManualHexes,
                selectedPaletteName,
                setSelectedPaletteName,
                normalizeHexForPreview,
              }}
              step2Props={{
                phone: step2Phone,
                setPhone: setStep2PhoneClearingError,
                phoneHasError: step2PhoneHasError,
                email: step2Email,
                setEmail: setStep2Email,
                address: step2Address,
                setAddress: setStep2Address,
                valLicense: step2ValLicense,
                setValLicense: setStep2ValLicense,
                faviconPreviewUrl: step2FaviconPreview,
                setFaviconPreviewUrl: setStep2FaviconPreview,
                setFaviconFile: setStep2FaviconFile,
                workingHours: step2WorkingHours,
                setWorkingHours: setStep2WorkingHours,
              }}
            >
              <OnboardingNavigation
                stepIndex={currentStepIndex}
                stepsLength={ONBOARDING_STEPS_COUNT}
                onBack={handleBack}
                onNext={handleNext}
                onFinish={finishOnboarding}
                onSkip={handleSkip}
                hideSkipOnSecondStep={hideSkipOnSecondStep}
                nextDisabled={
                  ((currentStepIndex === 0 || currentStepIndex === 1) && savingStep1) ||
                  (currentStepIndex === 2 && step3ActiveTab === "new" && savingStep3)
                }
                nextLoading={
                  ((currentStepIndex === 0 || currentStepIndex === 1) && savingStep1) ||
                  (currentStepIndex === 2 && step3ActiveTab === "new" && savingStep3)
                }
              />
            </OnboardingStepPanel>
          )}
        </section>
      </div>
      <OnboardingHelpOfferDialog
        open={helpOfferDialogOpen}
        onOpenChange={setHelpOfferDialogOpen}
        onContactWhatsApp={handleContactUs}
      />

      <div
        className="absolute bottom-5  z-20 left-6"
        dir="ltr"
      >
        <OnboardingSocialLinksRow links={ONBOARDING_HELP_SOCIAL_LINKS} />
      </div>
    </main>
  );
}

