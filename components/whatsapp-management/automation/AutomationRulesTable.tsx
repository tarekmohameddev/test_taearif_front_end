"use client";

import { Edit, Trash2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AutomationRule } from "./types";
import { formatDelayDisplay, getTriggerText } from "./constants";

interface AutomationRulesTableProps {
  rules: AutomationRule[];
  onEdit: (rule: AutomationRule) => void;
  onDelete: (ruleId: string) => void;
  onToggleActive: (ruleId: string, isActive: boolean) => void;
}

export function AutomationRulesTable({
  rules,
  onEdit,
  onDelete,
  onToggleActive,
}: AutomationRulesTableProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">القاعدة</TableHead>
              <TableHead className="text-right">المحفز</TableHead>
              <TableHead className="text-right">التأخير</TableHead>
              <TableHead className="text-right">عدد المرات</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <Zap className="h-12 w-12 text-muted-foreground/50" />
                    <p className="text-muted-foreground">
                      لا توجد قواعد أتمتة
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              rules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{rule.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {rule.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getTriggerText(rule.trigger)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatDelayDisplay(rule.delayMinutes)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{rule.triggeredCount}</Badge>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={rule.isActive}
                      onCheckedChange={(checked) =>
                        onToggleActive(rule.id, checked)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(rule)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(rule.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
