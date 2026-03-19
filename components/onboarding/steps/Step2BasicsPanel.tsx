"use client";

import React, { useMemo, useRef } from "react";
import Image from "next/image";

export type Step2BasicsPanelProps = {
  phone: string;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  address: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  valLicense: string;
  setValLicense: React.Dispatch<React.SetStateAction<string>>;
  faviconPreviewUrl: string | null;
  setFaviconPreviewUrl: React.Dispatch<React.SetStateAction<string | null>>;
  setFaviconFile: React.Dispatch<React.SetStateAction<File | null>>;
};

export default function Step2BasicsPanel({
  phone,
  setPhone,
  email,
  setEmail,
  address,
  setAddress,
  valLicense,
  setValLicense,
  faviconPreviewUrl,
  setFaviconPreviewUrl,
  setFaviconFile,
}: Step2BasicsPanelProps) {
  const faviconInputRef = useRef<HTMLInputElement | null>(null);
  const fileAccept = useMemo(
    () => "image/png,image/jpeg,image/jpg,image/webp,image/x-icon,image/vnd.microsoft.icon,.ico",
    [],
  );

  const openFaviconPicker = () => faviconInputRef.current?.click();

  const onFaviconChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFaviconFile(file);
    setFaviconPreviewUrl((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    e.target.value = "";
  };

  return (
    <div className="w-full md:w-1/2 md:flex-none">
      <div className="flex flex-col gap-1">
        <div className="text-[20px] font-bold">
          رقم الجوال <span className="text-red-500">*</span>
        </div>

        <div className="text-[16px] text-white/80">
          الرقم اللي يتواصل معك فيه عملاؤك — تأكد أنه صحيح
        </div>

        <div className="flex flex-row gap-1">
          <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-white border border-white/30 px-4 py-3 text-[13px] text-gray-500">
            <Image
              src="/SAUDI_FLAG.svg"
              alt="علم السعودية"
              width={30}
              height={16}
              className="h-[16px] w-[30px] rounded-[4px]"
            />
            <span>966+</span>
          </div>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="05xxxxxxxx"
            className="mt-2 w-full rounded-full bg-white border border-white/30 px-4 py-3 text-[16px] text-black placeholder:black outline-none focus:ring-2 focus:ring-white/60"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1 mt-6">
        <div className="text-[20px] font-bold">البريد الإلكتروني</div>

        <div className="text-[16px] text-white/80">
          بريدك المهني إن وجد — اختياري
        </div>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="info@yourcompany.sa"
          className="mt-2 w-full rounded-full bg-white border border-white/30 px-4 py-3 text-[16px] text-black placeholder:black outline-none focus:ring-2 focus:ring-white/60"
        />
      </div>

      <div className="flex flex-col gap-1 mt-6">
        <div className="text-[20px] font-bold">العنوان</div>

        <div className="text-[16px] text-white/80">
          حي ومدينة مكتبك — يساعد عملاءك يلقونك بسهولة
        </div>
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="مثال: حي العليا، شارع الملك فهد، الرياض"
          className="mt-2 w-full rounded-full bg-white border border-white/30 px-4 py-3 text-[16px] text-black placeholder:black outline-none focus:ring-2 focus:ring-white/60"
        />
      </div>

      {/* لا تزيلهم , اريدهم موجودين بشكل مؤقت حتى نحتاجهم */}
      {/* <div className="flex flex-col gap-1 mt-6">
        <div className="text-[20px] font-bold">رقم رخصة فال</div>
        <div className="text-[16px] text-white/80">اختياري — إن وُجد</div>
        <input
          value={valLicense}
          onChange={(e) => setValLicense(e.target.value)}
          placeholder="مثال: 1234567890"
          className="mt-2 w-full rounded-full bg-white border border-white/30 px-4 py-3 text-[16px] text-black placeholder:black outline-none focus:ring-2 focus:ring-white/60"
        />
      </div>

      <div className="flex flex-col gap-1 mt-6">
        <div className="flex flex-row items-baseline gap-3">
          <div className="text-[20px] font-bold">أيقونة الموقع (favicon)</div>
          <div className="text-[16px] text-white/70 font-normal">(اختياري)</div>
        </div>
        <div className="text-[16px] text-white/80">صورة صغيرة تظهر في تبويب المتصفح</div>

        <div
          role="button"
          tabIndex={0}
          onClick={openFaviconPicker}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") openFaviconPicker();
          }}
          className="mt-1 cursor-pointer select-none bg-white rounded-2xl p-4 text-gray-500 max-w-sm"
        >
          <input
            ref={faviconInputRef}
            type="file"
            accept={fileAccept}
            className="hidden"
            onChange={onFaviconChange}
          />
          {!faviconPreviewUrl && (
            <div className="text-center text-[14px]">انقر لرفع الأيقونة (PNG أو ICO)</div>
          )}
          {faviconPreviewUrl && (
            <div className="flex items-center justify-center">
              <img
                src={faviconPreviewUrl}
                alt="أيقونة الموقع"
                className="max-h-12 w-auto rounded object-contain"
              />
            </div>
          )}
        </div>
      </div> */}
    </div>
  );
}
