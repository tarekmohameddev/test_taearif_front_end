"use client";

import { AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { DnsInstructions } from "@/components/settings/types";
import {
  DEFAULT_DNS_DESCRIPTION,
  DEFAULT_DNS_NOTE,
  NAMESERVERS,
} from "@/components/settings/constants";

interface NameserversCardProps {
  dnsInstructions: DnsInstructions | null;
}

export function NameserversCard({ dnsInstructions }: NameserversCardProps) {
  const description =
    dnsInstructions?.description ?? DEFAULT_DNS_DESCRIPTION;
  const note = dnsInstructions?.note ?? DEFAULT_DNS_NOTE;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          إعدادات Nameservers
        </CardTitle>
        <CardDescription>
          تكوين Nameservers الخاصة بنطاقك لتوجيهها إلى Vercel
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion
          type="single"
          defaultValue="item-1"
          collapsible
          className="w-full"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger>
              كيفية إعداد Nameservers الخاصة بك
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {description}
                </p>
                <div className="rounded-lg border overflow-hidden">
                  <div className="grid grid-cols-12 gap-4 p-3 bg-muted/50 text-sm font-medium">
                    <div className="col-span-2">الرقم</div>
                    <div className="col-span-10">Nameserver</div>
                  </div>
                  {NAMESERVERS.map((ns, i) => (
                    <div
                      key={ns}
                      className="grid grid-cols-12 gap-4 p-3 border-t"
                    >
                      <div className="col-span-2 font-medium">{i + 1}</div>
                      <div className="col-span-10 font-mono text-sm">
                        {ns}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center p-3 rounded-lg bg-gray-100 text-gray-800">
                  <AlertCircle className="h-5 w-5 ml-2 flex-shrink-0" />
                  <p className="text-sm">{note}</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
