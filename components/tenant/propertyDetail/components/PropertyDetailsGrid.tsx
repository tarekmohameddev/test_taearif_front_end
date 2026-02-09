"use client";

import {
  HomeIcon,
  BuildingIcon,
  CreditCardIcon,
  CalendarDaysIcon,
  LayersIcon,
  ArrowUpDownIcon,
  BedIcon,
  BathIcon,
  ChefHatIcon,
  SofaIcon,
  UsersIcon,
  UtensilsIcon,
  UserIcon,
  CarIcon,
  PackageIcon,
  Layers,
  WavesIcon,
  SquareIcon,
  TreePineIcon,
  ArrowUpDown,
  ParkingCircleIcon,
  RulerIcon,
  MapPinIcon,
} from "lucide-react";
import { Property } from "../types/types";
import { PropertyDetailItem } from "./PropertyDetailItem";

interface PropertyDetailsGridProps {
  property: Property;
  transactionTypeLabel: string;
  primaryColor: string;
  primaryColorFilter: string;
}

export function PropertyDetailsGrid({
  property,
  transactionTypeLabel,
  primaryColor,
  primaryColorFilter,
}: PropertyDetailsGridProps) {
  const getPaymentMethodLabel = (method?: string) => {
    if (method === "quarterly") return "ربعي";
    if (method === "monthly") return "شهري";
    if (method === "yearly") return "سنوي";
    return method;
  };

  return (
    <div className="grid grid-cols-2 gap-y-6 lg:gap-y-10">
      <PropertyDetailItem
        icon={<HomeIcon className="w-4 h-4" />}
        label="نوع العرض"
        value={transactionTypeLabel}
        primaryColor={primaryColor}
      />

      {property.area && parseFloat(property.area) > 0 && (
        <PropertyDetailItem
          icon={<RulerIcon className="w-4 h-4" />}
          label="المساحة"
          value={`${property.area} م²`}
          primaryColor={primaryColor}
        />
      )}

      <PropertyDetailItem
        icon={<BuildingIcon className="w-4 h-4" />}
        label="نوع العقار"
        value={property.type}
        primaryColor={primaryColor}
      />

      {property.payment_method && (
        <PropertyDetailItem
          icon={<CreditCardIcon className="w-4 h-4" />}
          label="طريقة الدفع"
          value={getPaymentMethodLabel(property.payment_method)}
          primaryColor={primaryColor}
        />
      )}

      {property.pricePerMeter && (
        <PropertyDetailItem
          icon={
            <img
              src="/Saudi_Riyal_Symbol.svg"
              alt="ريال سعودي"
              className="w-4 h-4"
              style={{ filter: primaryColorFilter }}
            />
          }
          label="السعر للمتر"
          value={property.pricePerMeter}
          primaryColor={primaryColor}
        />
      )}

      {property.building_age && (
        <PropertyDetailItem
          icon={<CalendarDaysIcon className="w-4 h-4" />}
          label="عمر العمارة"
          value={`${property.building_age} سنة`}
          primaryColor={primaryColor}
        />
      )}

      {property.floors && (
        <PropertyDetailItem
          icon={<LayersIcon className="w-4 h-4" />}
          label="عدد الطوابق"
          value={`${property.floors} طابق`}
          primaryColor={primaryColor}
        />
      )}

      {property.floor_number && (
        <PropertyDetailItem
          icon={<ArrowUpDownIcon className="w-4 h-4" />}
          label="رقم الطابق"
          value={`الطابق ${property.floor_number}`}
          primaryColor={primaryColor}
        />
      )}

      {property.bedrooms > 0 && (
        <PropertyDetailItem
          icon={<BedIcon className="w-4 h-4" />}
          label="عدد الغرف"
          value={`${property.bedrooms} غرفة`}
          primaryColor={primaryColor}
        />
      )}

      {property.bathrooms && property.bathrooms > 0 && (
        <PropertyDetailItem
          icon={<BathIcon className="w-4 h-4" />}
          label="الحمامات"
          value={`${property.bathrooms} حمام`}
          primaryColor={primaryColor}
        />
      )}

      {property.kitchen && property.kitchen > 0 && (
        <PropertyDetailItem
          icon={<ChefHatIcon className="w-4 h-4" />}
          label="المطابخ"
          value={`${property.kitchen} مطبخ`}
          primaryColor={primaryColor}
        />
      )}

      {property.living_room && property.living_room > 0 && (
        <PropertyDetailItem
          icon={<SofaIcon className="w-4 h-4" />}
          label="الصالات"
          value={`${property.living_room} صالة`}
          primaryColor={primaryColor}
        />
      )}

      {property.majlis && property.majlis > 0 && (
        <PropertyDetailItem
          icon={<UsersIcon className="w-4 h-4" />}
          label="المجالس"
          value={`${property.majlis} مجلس`}
          primaryColor={primaryColor}
        />
      )}

      {property.dining_room && property.dining_room > 0 && (
        <PropertyDetailItem
          icon={<UtensilsIcon className="w-4 h-4" />}
          label="غرف الطعام"
          value={`${property.dining_room} غرفة طعام`}
          primaryColor={primaryColor}
        />
      )}

      {property.maid_room && property.maid_room > 0 && (
        <PropertyDetailItem
          icon={<UserIcon className="w-4 h-4" />}
          label="غرف الخدم"
          value={`${property.maid_room} غرفة خادمة`}
          primaryColor={primaryColor}
        />
      )}

      {property.driver_room && property.driver_room > 0 && (
        <PropertyDetailItem
          icon={<CarIcon className="w-4 h-4" />}
          label="غرف السائق"
          value={`${property.driver_room} غرفة سائق`}
          primaryColor={primaryColor}
        />
      )}

      {property.storage_room && property.storage_room > 0 && (
        <PropertyDetailItem
          icon={<PackageIcon className="w-4 h-4" />}
          label="المخازن"
          value={`${property.storage_room} مخزن`}
          primaryColor={primaryColor}
        />
      )}

      {property.basement && property.basement > 0 && (
        <PropertyDetailItem
          icon={<Layers className="w-4 h-4" />}
          label="القبو"
          value={`${property.basement} قبو`}
          primaryColor={primaryColor}
        />
      )}

      {property.swimming_pool && property.swimming_pool > 0 && (
        <PropertyDetailItem
          icon={<WavesIcon className="w-4 h-4" />}
          label="المسبح"
          value={`${property.swimming_pool} مسبح`}
          primaryColor={primaryColor}
        />
      )}

      {property.balcony && property.balcony > 0 && (
        <PropertyDetailItem
          icon={<SquareIcon className="w-4 h-4" />}
          label="الشرفات"
          value={`${property.balcony} شرفة`}
          primaryColor={primaryColor}
        />
      )}

      {property.garden && property.garden > 0 && (
        <PropertyDetailItem
          icon={<TreePineIcon className="w-4 h-4" />}
          label="الحدائق"
          value={`${property.garden} حديقة`}
          primaryColor={primaryColor}
        />
      )}

      {property.elevator && property.elevator > 0 && (
        <PropertyDetailItem
          icon={<ArrowUpDown className="w-4 h-4" />}
          label="المصاعد"
          value={`${property.elevator} مصعد`}
          primaryColor={primaryColor}
        />
      )}

      {property.private_parking && property.private_parking > 0 && (
        <PropertyDetailItem
          icon={<ParkingCircleIcon className="w-4 h-4" />}
          label="مواقف السيارات"
          value={`${property.private_parking} موقف`}
          primaryColor={primaryColor}
        />
      )}

      {property.length && property.width && (
        <PropertyDetailItem
          icon={<RulerIcon className="w-4 h-4" />}
          label="الأبعاد"
          value={`${property.length} × ${property.width} م`}
          primaryColor={primaryColor}
        />
      )}

      {property.location &&
        ((property.location.lat && property.location.lng) ||
          property.location.address) && (
          <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
            <div className="flex flex-row gap-x-2">
              <MapPinIcon className="w-4 h-4" style={{ color: primaryColor }} />
            </div>
            {property.location.lat && property.location.lng ? (
              <a
                href={`https://maps.google.com/?q=${property.location.lat},${property.location.lng}&entry=gps`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold leading-4 text-xs xs:text-sm md:text-base underline"
                style={{ color: primaryColor }}
              >
                عرض العنوان
              </a>
            ) : (
              <span className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
                {property.location.address}
              </span>
            )}
          </div>
        )}
    </div>
  );
}
