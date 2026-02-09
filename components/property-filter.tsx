"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePropertiesStore } from "@/context/propertiesStore";

const propertyTypes = [
  "مزرعة",
  "دور",
  "ارض سكن",
  "بيت",
  "شقة ارضيه",
  "شقة علويه",
  "أرض زراعية",
  "أرض استراحة",
  "استراحة",
  "فلة غير مكتملة",
  "أرض تجارية",
];

interface PropertyFilterProps {
  transactionType: "rent" | "sale";
}

export default function PropertyFilter({
  transactionType,
}: PropertyFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get store actions to update filters
  const {
    setSearch: setStoreSearch,
    setPropertyType: setStorePropertyType,
    setPrice: setStorePrice,
    fetchProperties,
  } = usePropertiesStore();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [propertyType, setPropertyType] = useState(
    searchParams.get("type_id") || "",
  );
  const [price, setPrice] = useState(
    searchParams.get("max_price") || searchParams.get("price") || "",
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredTypes, setFilteredTypes] = useState(propertyTypes);

  // تحديث الفلتر عند تغيير البحث
  useEffect(() => {
    if (propertyType) {
      setFilteredTypes(
        propertyTypes.filter((type) =>
          type.toLowerCase().includes(propertyType.toLowerCase()),
        ),
      );
    } else {
      setFilteredTypes(propertyTypes);
    }
  }, [propertyType]);

  // إغلاق الـ dropdown عند النقر خارجه
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // إغلاق الـ dropdown عند تغيير الصفحة
  useEffect(() => {
    setIsDropdownOpen(false);
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Update store with filter values
    if (search) setStoreSearch(search);
    if (propertyType) setStorePropertyType(propertyType);
    if (price) setStorePrice(price);

    const params = new URLSearchParams();

    if (search) params.set("search", search);
    if (propertyType) params.set("type_id", propertyType);
    if (price) params.set("max_price", price);

    const queryString = params.toString();
    const url = queryString ? `?${queryString}` : "";

    // Update URL
    router.push(
      `/${transactionType === "rent" ? "for-rent" : "for-sale"}${url}`,
    );

    // Trigger property fetch with new filters
    fetchProperties(1);
  };

  const handleTypeSelect = (type: string) => {
    setPropertyType(type);
    setIsDropdownOpen(false);
  };

  return (
    <div className="mb-6 md:mb-18">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 xs:grid-cols-2 md:flex flex-col md:flex-row mt-4 bg-white rounded-[10px] gap-x-5 md:gap-x-5 gap-y-4 p-4 "
      >
        {/* البحث عن المدينة */}
        <div className="py-2 w-full md:w-[32.32%] relative flex items-center justify-center border border-gray-200 h-12 md:h-14 rounded-[10px]">
          <Input
            placeholder={"الرياض"}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-full outline-none pr-2 placeholder:text-gray-500 placeholder:text-xs xs:placeholder:text-base md:placeholder:text-lg placeholder:font-normal border-0 focus-visible:ring-0"
            name="search"
          />
        </div>

        {/* نوع العقار */}
        <div className="h-full relative w-full md:w-[23.86%]" ref={dropdownRef}>
          <div className="w-full h-full relative">
            <div className="relative">
              <Input
                placeholder="نوع العقار"
                value={propertyType}
                onChange={(e) => {
                  setPropertyType(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                className="w-full h-12 md:h-14 outline-none pr-10 placeholder:text-gray-500 placeholder:text-xs xs:placeholder:text-base md:placeholder:text-lg placeholder:font-normal border border-gray-200 rounded-[10px] focus-visible:ring-0"
                name="propertyType"
              />
              <div className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Dropdown */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-[10px] mt-1 max-h-60 overflow-y-auto shadow-lg">
                {filteredTypes.length > 0 ? (
                  filteredTypes.map((type, index) => (
                    <div
                      key={index}
                      className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-sm md:text-base"
                      onClick={() => handleTypeSelect(type)}
                    >
                      {type}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-gray-500 text-sm md:text-base">
                    لم يتم العثور على نتائج.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* السعر */}
        <div className="w-full md:w-[23.86%] h-12 relative flex items-center justify-center py-2 border border-gray-200 md:h-14 rounded-[10px]">
          <Input
            placeholder={"10000"}
            value={price}
            onChange={(e) => {
              const v = e.target.value;
              if (v === "") {
                setPrice(v);
                return;
              }
              const n = Number(v);
              if (Number.isNaN(n)) return;
              setPrice(String(n >= 0 ? n : 0));
            }}
            className="w-full h-full outline-none pr-2 placeholder:text-gray-500 placeholder:text-xs xs:placeholder:text-base md:placeholder:text-lg placeholder:font-normal border-0 focus-visible:ring-0"
            type="number"
            min={0}
            inputMode="numeric"
            name="price"
          />
        </div>

        {/* زر البحث */}
        <div className="w-full md:w-[15.18%] h-full relative">
          <Button
            type="submit"
            className="text-xs xs:text-base md:text-lg flex items-center justify-center w-full h-12 md:h-14 text-white bg-emerald-600 hover:bg-emerald-700 rounded-[10px]"
          >
            بحث
          </Button>
        </div>
      </form>
    </div>
  );
}
