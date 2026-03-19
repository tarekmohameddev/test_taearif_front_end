"use client";

import React, { useState } from "react";

export default function Step3SitesPanel() {
  const [workTimes, setWorkTimes] = useState("");

  return (
    <div className="w-full md:w-1/2">
      <div className="flex flex-col gap-5">
        
        
      <div>
      <div className="text-[20px] font-bold text-white">المواقع المتاحة</div> 
          <input
            value={workTimes}
            onChange={(e) => setWorkTimes(e.target.value)}
            placeholder="اختر الموقع"
            className="mt-2 w-full rounded-full bg-white border border-white/30 px-4 py-3 text-[16px] text-black placeholder:gray-500 outline-none focus:ring-2 focus:ring-white/60"
          />
      </div>
      
      <div>
        <div className="text-[20px] font-bold text-white">الصق رابط العقار</div> 
          <input
            value={workTimes}
            onChange={(e) => setWorkTimes(e.target.value)}
            placeholder="https://sa.aqar.fm/…"
            className="mt-2 w-full rounded-full bg-white border border-white/30 px-4 py-3 text-[16px] text-black placeholder:gray-500 outline-none focus:ring-2 focus:ring-white/60"
          />
          </div>

          
        </div>
    </div>
  );
}

