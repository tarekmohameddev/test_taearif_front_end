import { MapPin } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PropertyData {
  title: string;
  description: string;
  price: string;
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
}

interface LocationCardProps {
  propertyData: PropertyData;
  hideHeader?: boolean;
  isDetailsPage?: boolean;
  onboardingRoundedVariant?: "xl";
}

export function LocationCard({
  propertyData,
  hideHeader = false,
  isDetailsPage = false,
  onboardingRoundedVariant,
}: LocationCardProps) {
  const handleInputChange = (field: keyof PropertyData, value: string) => {
    // This function is not needed here since the inputs are read-only
    // but keeping the structure for consistency
  };

  const roundedClass = onboardingRoundedVariant === "xl" ? "rounded-xl" : "";
  const roundedPClass =
    onboardingRoundedVariant === "xl" ? "rounded-xl" : "rounded-md";
  const onboardingTextClass =
    onboardingRoundedVariant === "xl"
      ? "!text-black !placeholder:text-black opacity-100"
      : "";
  const onboardingLabelClass =
    onboardingRoundedVariant === "xl" ? "text-black" : "";

  const content = (
    <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="address" className={onboardingLabelClass}>
            العنوان
          </Label>
          {isDetailsPage ? (
            <p
              className={`text-sm font-medium py-2 px-3 bg-muted ${roundedPClass}`}
            >
              {propertyData.address || "غير محدد"}
            </p>
          ) : (
            <Input
              id="address"
              placeholder="سيتم ملء العنوان تلقائياً"
              value={propertyData.address}
              readOnly
              className={`${roundedClass} ${onboardingTextClass}`.trim()}
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="latitude" className={onboardingLabelClass}>
              خط العرض
            </Label>
            {isDetailsPage ? (
            <p
              className={`text-sm font-medium py-2 px-3 bg-muted ${roundedPClass} font-mono`}
            >
                {propertyData.latitude?.toFixed(6) || "غير محدد"}
              </p>
            ) : (
              <Input
                id="latitude"
                placeholder="اختر الموقع على الخريطة"
                value={propertyData.latitude?.toFixed(6) || ""}
                readOnly
                className={`${roundedClass} ${onboardingTextClass} font-mono text-sm`.trim()}
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="longitude" className={onboardingLabelClass}>
              خط الطول
            </Label>
            {isDetailsPage ? (
            <p
              className={`text-sm font-medium py-2 px-3 bg-muted ${roundedPClass} font-mono`}
            >
                {propertyData.longitude?.toFixed(6) || "غير محدد"}
              </p>
            ) : (
              <Input
                id="longitude"
                placeholder="اختر الموقع على الخريطة"
                value={propertyData.longitude?.toFixed(6) || ""}
                readOnly
                className={`${roundedClass} ${onboardingTextClass} font-mono text-sm`.trim()}
              />
            )}
          </div>
        </div>

        {!isDetailsPage && propertyData.latitude && propertyData.longitude && (
          <div
            className={`p-3 bg-green-50 border border-green-200 ${roundedPClass} dark:bg-green-900/50 dark:border-green-700`}
          >
            <p className="text-sm text-green-800 dark:text-green-200">
              <strong>تم اختيار الموقع:</strong>{" "}
              {propertyData.latitude.toFixed(6)},{" "}
              {propertyData.longitude.toFixed(6)}
            </p>
          </div>
        )}
    </div>
  );

  if (hideHeader) {
    return content;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          تفاصيل الموقع
        </CardTitle>
        <CardDescription>
          سيتم ملء العنوان والإحداثيات تلقائياً عند تحديد موقع على الخريطة
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {content}
      </CardContent>
    </Card>
  );
}
