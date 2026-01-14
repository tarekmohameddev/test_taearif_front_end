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
}

export function LocationCard({ propertyData, hideHeader = false }: LocationCardProps & { hideHeader?: boolean }) {
  const handleInputChange = (field: keyof PropertyData, value: string) => {
    // This function is not needed here since the inputs are read-only
    // but keeping the structure for consistency
  };

  const content = (
    <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="address">العنوان</Label>
          <Input
            id="address"
            placeholder="سيتم ملء العنوان تلقائياً"
            value={propertyData.address}
            readOnly
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="latitude">خط العرض</Label>
            <Input
              id="latitude"
              placeholder="اختر الموقع على الخريطة"
              value={propertyData.latitude?.toFixed(6) || ""}
              readOnly
              className="font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="longitude">خط الطول</Label>
            <Input
              id="longitude"
              placeholder="اختر الموقع على الخريطة"
              value={propertyData.longitude?.toFixed(6) || ""}
              readOnly
              className="font-mono text-sm"
            />
          </div>
        </div>

        {propertyData.latitude && propertyData.longitude && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md dark:bg-green-900/50 dark:border-green-700">
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
