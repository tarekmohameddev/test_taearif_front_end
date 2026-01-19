// components/property/edit-property-page.tsx
"use client";
import { useSearchParams } from "next/navigation";
import PropertyForm from "./property-form";

export default function EditPropertyPage() {
  const searchParams = useSearchParams();
  const isDraft = searchParams?.get("draft") === "true";
  
  return <PropertyForm mode="edit" isDraft={isDraft} />;
}
