"use client";

import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { STATUS_LABELS } from "./constants";
import { canSend, canPause, canResume, canDelete } from "./utils";
import type { ApiWaCampaign, WhatsAppNumberDTO } from "./types";

export interface WaCampaignsTableProps {
  campaigns: ApiWaCampaign[];
  numbers: WhatsAppNumberDTO[];
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  loading: boolean;
  onSend: (campaign: ApiWaCampaign) => void;
  onPause: (campaign: ApiWaCampaign) => void;
  onResume: (campaign: ApiWaCampaign) => void;
  onDelete: (campaign: ApiWaCampaign) => void;
  pauseLoadingId: number | null;
}

export function WaCampaignsTable({
  campaigns,
  numbers,
  statusFilter,
  onStatusFilterChange,
  loading,
  onSend,
  onPause,
  onResume,
  onDelete,
  pauseLoadingId,
}: WaCampaignsTableProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>قائمة الحملات</CardTitle>
        <Select
          value={statusFilter || "all"}
          onValueChange={(v) => onStatusFilterChange(v === "all" ? "" : v)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            {Object.entries(STATUS_LABELS).map(([k, v]) => (
              <SelectItem key={k} value={k}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : campaigns.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">لا توجد حملات.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الاسم</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الرقم</TableHead>
                <TableHead>المستلمون / المرسل</TableHead>
                <TableHead className="text-left">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{STATUS_LABELS[c.status] ?? c.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {numbers.find((n) => n.id === c.wa_number_id)?.phoneNumber ?? c.wa_number_id}
                  </TableCell>
                  <TableCell>
                    {c.recipient_count != null &&
                      `${c.recipient_count} / ${c.sent_count ?? 0}`}
                  </TableCell>
                  <TableCell className="text-left">
                    <div className="flex items-center gap-1 flex-wrap">
                      {canSend(c.status) && (
                        <Button size="sm" onClick={() => onSend(c)}>
                          إرسال
                        </Button>
                      )}
                      {canPause(c.status) && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onPause(c)}
                          disabled={pauseLoadingId === c.id}
                        >
                          {pauseLoadingId === c.id ? "جاري..." : "إيقاف مؤقت"}
                        </Button>
                      )}
                      {canResume(c.status) && (
                        <Button size="sm" variant="outline" onClick={() => onResume(c)}>
                          استئناف
                        </Button>
                      )}
                      {canDelete(c.status) && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onDelete(c)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
