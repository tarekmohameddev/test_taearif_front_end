"use client";

import { Globe, Lock, Clock, RefreshCw, CheckCircle2, AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Domain } from "@/components/settings/types";
import { DOMAIN_STATUS } from "@/components/settings/constants";

interface DomainCardProps {
  domain: Domain;
  onVerify: (domainId: string) => void;
  onSetPrimary: (domainId: string) => void;
  onDelete: (domainId: string) => void;
  isVerifying: boolean;
}

export function DomainCard({
  domain,
  onVerify,
  onSetPrimary,
  onDelete,
  isVerifying,
}: DomainCardProps) {
  const isPending = domain.status === DOMAIN_STATUS.PENDING;

  return (
    <Card
      className={isPending ? "border-dashed opacity-80" : ""}
    >
      <CardHeader className="flex flex-row items-start justify-between p-6">
        <div className="flex flex-col gap-1">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Globe className="h-5 w-5 text-muted-foreground" />
            {domain.custom_name}
            {domain.primary && (
              <Badge
                variant="outline"
                className="bg-gray-100 text-gray-700 border-gray-300 ml-2"
              >
                رئيسي
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            {domain.status === DOMAIN_STATUS.ACTIVE
              ? "نطاق نشط"
              : "في انتظار التحقق"}
          </CardDescription>
        </div>
        <div>
          {domain.status === DOMAIN_STATUS.ACTIVE ? (
            <Badge
              variant="outline"
              className="bg-gray-100 text-gray-700 border-gray-300"
            >
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                نشط
              </span>
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="bg-gray-100 text-gray-700 border-gray-300"
            >
              <span className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                معلق
              </span>
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">SSL:</span>
            {domain.ssl ? (
              <Badge
                variant="outline"
                className="bg-gray-100 text-gray-700 border-gray-300"
              >
                <span className="flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  مفعل
                </span>
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="bg-gray-100 text-gray-700 border-gray-300"
              >
                غير مفعل
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>تمت الإضافة: {domain.addedDate ?? "—"}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-6 pb-6 pt-2 flex justify-between">
        {isPending ? (
          <Button
            variant="default"
            size="sm"
            onClick={() => onVerify(domain.id)}
            disabled={isVerifying}
          >
            {isVerifying ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 ml-1 animate-spin" />
                جاري التحقق...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 ml-1" />
                التحقق من النطاق
              </>
            )}
          </Button>
        ) : !domain.primary ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSetPrimary(domain.id)}
          >
            تعيين كنطاق رئيسي
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            النطاق الرئيسي
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={() => onDelete(domain.id)}
          disabled={domain.primary}
        >
          <Trash2 className="h-3.5 w-3.5 ml-1" />
          حذف
        </Button>
      </CardFooter>
    </Card>
  );
}
