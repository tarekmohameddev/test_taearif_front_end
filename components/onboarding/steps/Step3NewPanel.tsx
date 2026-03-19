"use client";

import React, { useState } from "react";
import Step3PropertyEditorPanel from "./Step3PropertyEditorPanel";

export default function Step3NewPanel() {
  const [commonTimesOpen, setCommonTimesOpen] = useState(false);
  const [workTimes, setWorkTimes] = useState("");

  return (
    <div className="w-full md:w-1/2">
      <style jsx global>{`
        .step3-scroll-thin {
          scrollbar-width: thin;
          scrollbar-color: rgba(79, 158, 142, 0.7) transparent;
        }
        .step3-scroll-thin::-webkit-scrollbar {
          width: 2px;
          height: 2px;
        }
        .step3-scroll-thin::-webkit-scrollbar-thumb {
          background-color: rgba(79, 158, 142, 0.75);
          border-radius: 9999px;
        }
        .step3-scroll-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .step3-scroll-thin::-webkit-scrollbar-button {
          display: none;
          width: 0;
          height: 0;
        }
      `}</style>
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
          className="w-full rounded-full px-5 text-right text-[14px] text-black  transition-colors "
        >
          تفاصيل إنشاء عقار جديد
        </button>

        {commonTimesOpen && (
          <div className="mt-3 p-5 space-y-5 max-h-[30vh] overflow-y-auto step3-scroll-thin">
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

          <div className="grid grid-cols-2 gap-4">
            {/* row 1 */}
            <div className="flex flex-col gap-2">
              <div className="text-[14px] text-black font-semibold text-right">
                العنوان
              </div>
              <input
                placeholder="مثال: شقة"
                className="w-full rounded-full bg-white border border-gray-300 py-2 px-4 text-[16px] text-black placeholder:gray-500 outline-none focus:ring-2 focus:ring-[#4F9E8E]/60"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-[14px] text-black font-semibold text-right">
                العمارة
              </div>
              <input
                placeholder="مثال: عمارة 3"
                className="w-full rounded-full bg-white border border-gray-300 py-2 px-4 text-[16px] text-black placeholder:gray-500 outline-none focus:ring-2 focus:ring-[#4F9E8E]/60"
              />
            </div>

            {/* row 2 */}
            <div className="flex flex-col gap-2">
              <div className="text-[14px] text-black font-semibold text-right">
                المبلغ
              </div>
              <input
                type="number"
                placeholder="مثال: 250000"
                className="w-full rounded-full bg-white border border-gray-300 py-2 px-4 text-[16px] text-black placeholder:gray-500 outline-none focus:ring-2 focus:ring-[#4F9E8E]/60"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-[14px] text-black font-semibold text-right">
                طريقة الدفع
              </div>
              <select
                defaultValue=""
                className="w-full rounded-full bg-white border border-gray-300 py-2 px-4 text-[16px] text-black placeholder:gray-500 outline-none focus:ring-2 focus:ring-[#4F9E8E]/60"
              >
                <option value="" disabled>
                  اختر طريقة الدفع
                </option>
                <option value="cash">كاش</option>
                <option value="installments">تقسيط</option>
              </select>
            </div>

            {/* row 3 */}
            <div className="flex flex-col gap-2">
              <div className="text-[14px] text-black font-semibold text-right">
                سعر المتر
              </div>
              <input
                type="number"
                placeholder="مثال: 8000"
                className="w-full rounded-full bg-white border border-gray-300 py-2 px-4 text-[16px] text-black placeholder:gray-500 outline-none focus:ring-2 focus:ring-[#4F9E8E]/60"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-[14px] text-black font-semibold text-right">
                نوع القائمة
              </div>
              <select
                defaultValue=""
                className="w-full rounded-full bg-white border border-gray-300 py-2 px-4 text-[16px] text-black outline-none focus:ring-2 focus:ring-[#4F9E8E]/60"
              >
                <option value="" disabled>
                  اختر نوع القائمة
                </option>
                <option value="sale">للبيع</option>
                <option value="rent">للايجار</option>
              </select>
            </div>

            {/* row 4 */}
            <div className="flex flex-col gap-2">
              <div className="text-[14px] text-black font-semibold text-right">
                فئة الوحدة
              </div>
              <input
                placeholder="مثال: فئة A"
                className="w-full rounded-full bg-white border border-gray-300 py-2 px-4 text-[16px] text-black placeholder:gray-500 outline-none focus:ring-2 focus:ring-[#4F9E8E]/60"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-[14px] text-black font-semibold text-right">
                المشروع
              </div>
              <input
                placeholder="مثال: مشروع الرفاعي"
                className="w-full rounded-full bg-white border border-gray-300 py-2 px-4 text-[16px] text-black placeholder:gray-500 outline-none focus:ring-2 focus:ring-[#4F9E8E]/60"
              />
            </div>

            {/* row 5 */}
            <div className="flex flex-col gap-2">
              <div className="text-[14px] text-black font-semibold text-right">
                اختر المدينة
              </div>
              <select
                defaultValue=""
                className="w-full rounded-full bg-white border border-gray-300 py-2 px-4 text-[16px] text-black outline-none focus:ring-2 focus:ring-[#4F9E8E]/60"
              >
                <option value="" disabled>
                  اختر المدينة
                </option>
                <option value="riyadh">الرياض</option>
                <option value="jeddah">جدة</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-[14px] text-black font-semibold text-right">
                اختر الحي
              </div>
              <select
                defaultValue=""
                className="w-full rounded-full bg-white border border-gray-300 py-2 px-4 text-[16px] text-black outline-none focus:ring-2 focus:ring-[#4F9E8E]/60"
              >
                <option value="" disabled>
                  اختر الحي
                </option>
                <option value="north">الشمالية</option>
                <option value="east">الشرقية</option>
              </select>
            </div>

            {/* row 6 */}
            <div className="flex flex-col gap-2">
              <div className="text-[14px] text-black font-semibold text-right">
                نوع الوحدة
              </div>
              <select
                defaultValue=""
                className="w-full rounded-full bg-white border border-gray-300 py-2 px-4 text-[16px] text-black outline-none focus:ring-2 focus:ring-[#4F9E8E]/60"
              >
                <option value="" disabled>
                  اختر نوع الوحدة
                </option>
                <option value="apartment">شقة</option>
                <option value="villa">فيلا</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-[14px] text-black font-semibold text-right">
                ترخيص اعلاني
              </div>
              <select
                defaultValue=""
                className="w-full rounded-full bg-white border border-gray-300 py-2 px-4 text-[16px] text-black outline-none focus:ring-2 focus:ring-[#4F9E8E]/60"
              >
                <option value="" disabled>
                  اختر الترخيص
                </option>
                <option value="available">متوفر</option>
                <option value="not_available">غير متوفر</option>
              </select>
            </div>
          </div>
          </div>
        )}
      </div>

      {/* Property editor (features/properties/facilities/location) */}
      <Step3PropertyEditorPanel />
    </div>
  );
}
