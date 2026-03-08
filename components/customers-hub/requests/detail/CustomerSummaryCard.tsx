"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Phone, MessageSquare, Mail, Eye } from "lucide-react";

export interface CustomerSummaryCardCustomer {
  id: string | number;
  name: string;
  phone: string;
  email?: string;
  whatsapp?: string;
}

interface CustomerSummaryCardProps {
  customer: CustomerSummaryCardCustomer;
  onViewCustomer: (customerId: string | number) => void;
}

export function CustomerSummaryCard({ customer, onViewCustomer }: CustomerSummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          معلومات العميل
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg hover:from-primary/10 hover:to-primary/20 transition-all border border-primary/20 cursor-pointer"
          onClick={() => onViewCustomer(customer.id)}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-lg font-bold text-primary">
              {customer.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{customer.name}</h3>
            </div>
            <Eye className="h-4 w-4 text-gray-400" />
          </div>

          <div className="space-y-2">
            <a
              href={`tel:${customer.phone}`}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Phone className="h-4 w-4" />
              <span dir="ltr">{customer.phone}</span>
            </a>
            {customer.whatsapp && (
              <a
                href={`https://wa.me/${customer.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <MessageSquare className="h-4 w-4" />
                <span>واتساب</span>
              </a>
            )}
            {customer.email && (
              <a
                href={`mailto:${customer.email}`}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Mail className="h-4 w-4" />
                <span className="truncate">{customer.email}</span>
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
