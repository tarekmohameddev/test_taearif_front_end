"use client";

import { useState, useEffect } from "react";
import { Check, ChevronDown, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import type { WhatsAppNumber } from "./types";
import { getWhatsAppNumbers } from "@/services/whatsapp-management-api";

interface WhatsAppNumberSelectorProps {
  selectedNumberId: number | null;
  onNumberChange: (numberId: number | null) => void;
  showAllOption?: boolean;
}

export function WhatsAppNumberSelector({
  selectedNumberId,
  onNumberChange,
  showAllOption = true,
}: WhatsAppNumberSelectorProps) {
  const [numbers, setNumbers] = useState<WhatsAppNumber[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNumbers();
  }, []);

  const loadNumbers = async () => {
    try {
      setIsLoading(true);
      const data = await getWhatsAppNumbers();
      setNumbers(data);
      
      // Set default selection if none selected
      if (selectedNumberId === null && data.length > 0) {
        onNumberChange(showAllOption ? null : data[0].id);
      }
    } catch (error) {
      console.error("Failed to load WhatsApp numbers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedNumber = numbers.find((n) => n.id === selectedNumberId);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 h-10 px-4 rounded-md border bg-muted animate-pulse">
        <div className="h-4 w-32 bg-muted-foreground/20 rounded"></div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full sm:w-auto gap-2">
          <Phone className="h-4 w-4" />
          <span className="flex-1 text-right">
            {selectedNumberId === null
              ? "جميع الأرقام"
              : selectedNumber
                ? selectedNumber.name || selectedNumber.phoneNumber
                : "اختر رقم"}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {showAllOption && (
          <DropdownMenuItem
            onClick={() => onNumberChange(null)}
            className="cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>جميع الأرقام</span>
              </div>
              {selectedNumberId === null && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </div>
          </DropdownMenuItem>
        )}
        
        {numbers.map((number) => (
          <DropdownMenuItem
            key={number.id}
            onClick={() => onNumberChange(number.id)}
            className="cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {number.name || number.phoneNumber}
                  </span>
                  {number.status === "active" && (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800 text-xs"
                    >
                      نشط
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {number.phoneNumber}
                </span>
                {number.employee && (
                  <span className="text-xs text-muted-foreground">
                    {number.employee.name}
                  </span>
                )}
              </div>
              {selectedNumberId === number.id && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
