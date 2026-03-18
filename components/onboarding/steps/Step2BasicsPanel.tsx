"use client";

import React from "react";

export default function Step2BasicsPanel() {
  return (
    <div className="w-full md:w-1/2 md:flex-none">
      <div className="flex flex-col gap-1">
        <div className="text-[20px] font-bold">
          رقم الجوال <span className="text-red-500">*</span>
        </div>{" "}
        
        <div className="text-[16px] text-white/80">
          الرقم اللي يتواصل معك فيه عملاؤك — تأكد أنه صحيح
        </div>
        <input
          placeholder="05xxxxxxxx"
          className="mt-2 w-full rounded-full bg-white border border-white/30 px-4 py-3 text-[16px] text-white placeholder:gray-500 outline-none focus:ring-2 focus:ring-white/60"
        />
      </div>

      <div className="flex flex-col gap-1">
        <div className="text-[20px] font-bold">البريد الإلكتروني</div>{" "}
        
        <div className="text-[16px] text-white/80">
          بريدك المهني إن وجد — اختياري
        </div>
        <input
          placeholder="info@yourcompany.sa"
          className="mt-2 w-full rounded-full bg-white border border-white/30 px-4 py-3 text-[16px] text-white placeholder:gray-500 outline-none focus:ring-2 focus:ring-white/60"
        />
      </div>

      <div className="flex flex-col gap-1">
        <div className="text-[20px] font-bold">العنوان</div>{" "}
        
        <div className="text-[16px] text-white/80">
          حي ومدينة مكتبك — يساعد عملاءك يلقونك بسهولة
        </div>
        <input
          placeholder="مثال: حي العليا، شارع الملك فهد، الرياض"
          className="mt-2 w-full rounded-full bg-white border border-white/30 px-4 py-3 text-[16px] text-white placeholder:gray-500 outline-none focus:ring-2 focus:ring-white/60"
        />
      </div>
    </div>
  );
}
