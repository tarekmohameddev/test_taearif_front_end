"use client";

import React, { useState } from "react";

export default function Step3NewPanel() {
  const [commonTimesOpen, setCommonTimesOpen] = useState(false);
  const [workTimes, setWorkTimes] = useState("");

  return (
    <div className="w-full md:w-1/2">
      {/* One collapsible card */}
      <div
        className={[
          "bg-white/95 border border-white/60 py-1",
          commonTimesOpen ? "rounded-3xl" : "rounded-full",
        ].join(" ")}
      >
        <button
          type="button"
          onClick={() => setCommonTimesOpen((v) => !v)}
          aria-expanded={commonTimesOpen}
          className="w-full rounded-full px-5 text-right text-[14px] text-black hover:bg-[#4a9485] transition-colors"
        >
          تفاصيل إنشاء عقار جديد
        </button>

        {commonTimesOpen && (
          <div className="mt-3 p-5 space-y-5">
          <div className="">
          <div className="text-[14px] text-black font-semibold text-right">
              اسم الوحدة <span className="text-red-500">*</span>
            </div>

            <input
              value={workTimes}
              onChange={(e) => setWorkTimes(e.target.value)}
              placeholder="اكتب وصف مختصر هنا"
              className="mt-3  w-full rounded-full bg-white border border-gray-300 py-2 px-4 text-[16px] text-black placeholder:gray-500 outline-none focus:ring-2 focus:ring-[#4F9E8E]/60"
            />
          </div>

          <div className="">
          <div className="text-[14px] text-black font-semibold text-right">
              وصف الوحدة <span className="text-red-500">*</span>
            </div>

            <textarea
              value={workTimes}
              onChange={(e) => setWorkTimes(e.target.value)}
              placeholder="اكتب وصف مختصر هنا"
              rows={4}
              className="mt-3 w-full rounded-3xl bg-white border border-gray-300 py-2 px-4 text-[16px] text-black placeholder:gray-500 outline-none focus:ring-2 focus:ring-[#4F9E8E]/60 resize-none"
            />
          </div>
          </div>
        )}
      </div>
    </div>
  );
}
