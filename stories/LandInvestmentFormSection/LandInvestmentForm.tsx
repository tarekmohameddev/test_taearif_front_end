"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const inputBase =
  "flex h-9 w-full min-w-0 rounded-sm border-[0.6px] border-white bg-black px-2 py-1 text-base shadow-[var(--shadow-xs)] transition-[color,box-shadow] outline-none placeholder:opacity-50 lg:text-sm focus-visible:border-[var(--ring)] focus-visible:ring-[var(--ring)]/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50";
const inputText = "text-[var(--accent)]";

const ROLE_OPTIONS = [
  { value: "owner", label: "مالك الأرض" },
  { value: "agent", label: "وكيل" },
  { value: "broker", label: "وسيط" },
] as const;

const LAND_TYPE_OPTIONS = [
  { value: "residential", label: "سكنية" },
  { value: "commercial", label: "تجارية" },
] as const;

export function LandInvestmentForm({
  onSubmit,
  className,
}: {
  onSubmit?: (data: Record<string, string>) => void;
  className?: string;
}) {
  const [role, setRole] = React.useState<string>("");
  const [landType, setLandType] = React.useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const data: Record<string, string> = {};
    fd.forEach((v, k) => {
      if (typeof v === "string") data[k] = v;
    });
    data.role = role;
    data.landType = landType;
    onSubmit?.(data);
  };

  return (
    <form
      id="land-investment-form"
      className={cn("flex flex-1 flex-col gap-6", className)}
      onSubmit={handleSubmit}
      dir="rtl"
    >
      <div className="grid gap-6 xl:grid-cols-2 xl:gap-2.5">
        <div className="grid gap-2">
          <Input
            name="firstName"
            placeholder="الاسم الأول"
            className={cn(inputBase, inputText, "border-white")}
          />
        </div>
        <div className="grid gap-2">
          <Input
            name="lastName"
            placeholder="اسم العائلة"
            className={cn(inputBase, inputText, "border-white")}
          />
        </div>
      </div>
      <div className="grid gap-6 xl:grid-cols-2 xl:gap-2.5">
        <div className="grid gap-2">
          <Input
            name="phone"
            placeholder="رقم الجوال"
            className={cn(inputBase, inputText, "border-white")}
          />
        </div>
        <div className="grid gap-2">
          <Select value={role} onValueChange={setRole} dir="rtl">
            <SelectTrigger
              aria-label="الصفة"
              className={cn(
                inputBase,
                inputText,
                "border-white h-9 data-[placeholder]:opacity-50",
              )}
            >
              <SelectValue placeholder="الصفة" />
            </SelectTrigger>
            <SelectContent>
              {ROLE_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-6 xl:grid-cols-2 xl:gap-2.5">
        <div className="grid gap-2">
          <Select value={landType} onValueChange={setLandType} dir="rtl">
            <SelectTrigger
              aria-label="نوع الأرض"
              className={cn(
                inputBase,
                inputText,
                "border-white h-9 data-[placeholder]:opacity-50",
              )}
            >
              <SelectValue placeholder="نوع الأرض" />
            </SelectTrigger>
            <SelectContent>
              {LAND_TYPE_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Input
            name="area"
            placeholder="المساحة بالمتر المربع"
            className={cn(inputBase, inputText, "border-white")}
          />
        </div>
      </div>
      <div className="grid gap-6 xl:grid-cols-2 xl:gap-2.5">
        <div className="grid gap-2">
          <Input
            name="city"
            placeholder="المدينة"
            className={cn(inputBase, inputText, "border-white")}
          />
        </div>
        <div className="grid gap-2">
          <Input
            name="neighborhood"
            placeholder="الحي"
            className={cn(inputBase, inputText, "border-white")}
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Input
          name="googleMap"
          placeholder="رابط موقع الأرض (اختياري)"
          className={cn(inputBase, inputText, "border-white")}
        />
      </div>
      <div className="grid gap-2">
        <Textarea
          name="message"
          placeholder="نبذة عن اهتمامك الاستثماري أو تفاصيل الأرض (اختياري)"
          className={cn(
            inputBase,
            inputText,
            "border-white min-h-32 field-sizing-content rounded-md",
          )}
        />
      </div>
      <div className="flex gap-1.5">
        <ShieldCheck
          className="h-6 w-6 shrink-0 text-[#7F7F7F]"
          strokeWidth={2}
          aria-hidden
        />
        <span className="text-[#414141]">
          بياناتك في سرية تامة ولا يتم مشاركتها. &nbsp;
          <a
            target="_blank"
            href="/terms-and-conditions"
            rel="noopener noreferrer"
            className="text-[#414141] underline"
          >
            الشروط والأحكام*
          </a>
        </span>
      </div>
      <button
        type="submit"
        className="inline-flex min-h-9 w-full items-center justify-center gap-2 rounded-sm bg-[#B06D37] px-10 py-2 mt-3 font-bold text-white transition-all outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--ring)]/50 disabled:pointer-events-none disabled:opacity-50"
      >
        إرسال
      </button>
    </form>
  );
}
