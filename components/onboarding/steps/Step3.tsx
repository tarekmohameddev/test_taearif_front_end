"use client";

import React from "react";

export default function OnboardingStep3({
  activeTab,
}: {
  activeTab: "sites" | "new";
}) {

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Step content container (placeholder) */}
      <div className="bg-white/90 rounded-full border border-white/60 p-4">
        {activeTab === "sites" ? (
          <div className="text-[14px] text-[#0B5B3A]/80 font-semibold text-right">
            سيتم عرض نموذج إضافة عقار من مواقع أخرى هنا.
          </div>
        ) : (
          <div className="text-[14px] text-[#0B5B3A]/80 font-semibold text-right">
            سيتم عرض نموذج إنشاء عقار جديد هنا.
          </div>
        )}
      </div>
    </div>
  );
}

