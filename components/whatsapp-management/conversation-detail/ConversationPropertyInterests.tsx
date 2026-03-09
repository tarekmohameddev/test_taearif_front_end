"use client";

import { Home } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PropertyInterest } from "./types";
import { PROPERTY_STATUS_LABELS } from "./constants";

interface ConversationPropertyInterestsProps {
  propertyInterests: PropertyInterest[];
}

export function ConversationPropertyInterests({
  propertyInterests,
}: ConversationPropertyInterestsProps) {
  return (
    <div className="mt-3 space-y-2">
      {propertyInterests.map((property) => (
        <Card key={property.id} className="bg-muted/50">
          <CardContent className="p-3">
            <div className="flex items-start gap-2">
              <Home className="h-4 w-4 text-primary mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{property.propertyName}</p>
                <p className="text-xs text-muted-foreground">
                  {property.location} • {property.price.toLocaleString()} ريال
                </p>
                <Badge variant="secondary" className="text-xs mt-1">
                  {PROPERTY_STATUS_LABELS[property.status] ?? property.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
