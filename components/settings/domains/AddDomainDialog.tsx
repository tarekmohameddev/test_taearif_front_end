"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface AddDomainDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  hasFormatError: boolean;
  errorMessage: string;
  onFormatErrorChange: (hasError: boolean, message: string) => void;
  trigger?: React.ReactNode;
}

export function AddDomainDialog({
  open,
  onOpenChange,
  value,
  onChange,
  onSubmit,
  hasFormatError,
  errorMessage,
  onFormatErrorChange,
  trigger,
}: AddDomainDialogProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    onChange(v);
    onFormatErrorChange(false, "");
    if (
      v.startsWith("www.") ||
      v.startsWith("http://") ||
      v.startsWith("https://")
    ) {
      onFormatErrorChange(true, "لا تستخدم www أو http://");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            <Plus className="h-4 w-4 ml-1" />
            إضافة نطاق
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>إضافة نطاق مخصص</DialogTitle>
          <DialogDescription>
            ربط نطاقك الخاص بموقعك. ستحتاج إلى تحديث إعدادات DNS الخاصة بك.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="domain-name">اسم النطاق</Label>
            <Input
              id="domain-name"
              placeholder="example.com"
              value={value}
              onChange={handleInputChange}
            />
            <p
              className={`text-sm ${hasFormatError ? "text-destructive" : "text-muted-foreground"}`}
            >
              أدخل نطاقك بدون www أو http://
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button onClick={onSubmit}>إضافة نطاق</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
