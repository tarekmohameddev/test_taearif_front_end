import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { PropertyRequestStageAssignmentDialog } from "./PropertyRequestStageAssignmentDialog";
import {
  MoreHorizontal,
  Mail,
  Phone,
  Tag,
  Download,
  Eye,
  Edit,
  Trash2,
  MessageSquare,
  Clock,
  SortAsc,
  SortDesc,
  CheckSquare,
  X,
  ArrowRight,
} from "lucide-react";
import { Pagination } from "@/components/customers/page-components/Pagination";

// Import PropertyRequest interface from parent
interface PropertyRequest {
  id: number;
  user_id: number;
  region: string;
  property_type: string;
  category_id: number;
  city_id: number;
  districts_id: number;
  category: string | null;
  neighborhoods: string[] | null;
  area_from: number | null;
  area_to: number | null;
  purchase_method: string;
  budget_from: number;
  budget_to: number;
  seriousness: string;
  purchase_goal: string;
  wants_similar_offers: boolean;
  full_name: string;
  phone: string;
  contact_on_whatsapp: boolean;
  notes: string;
  is_read: number;
  is_active: number;
  created_at: string;
  updated_at: string;
}

interface PropertyRequestsTableProps {
  filteredAndSortedPropertyRequests: PropertyRequest[];
  selectedPropertyRequests: number[];
  handleSelectAll: () => void;
  handleSelectPropertyRequest: (id: number) => void;
  sortField: string;
  sortDirection: string;
  handleSort: (field: keyof PropertyRequest) => void;
  setSelectedPropertyRequest: (request: PropertyRequest) => void;
  setShowPropertyRequestDialog: (show: boolean) => void;
  openEditDialog: (request: PropertyRequest) => void;
  handleDelete: (id: number) => void;
  formData: any;
  open: boolean;
  setOpen: (open: boolean) => void;
  handleChange: (field: keyof PropertyRequest) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleUpdatePropertyRequest: () => void;
  showBulkActionsDialog: boolean;
  setShowBulkActionsDialog: (show: boolean) => void;
  setSelectedPropertyRequests: (ids: number[]) => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  totalItems?: number;
  perPage?: number;
}

export const PropertyRequestsTable = ({
  filteredAndSortedPropertyRequests,
  selectedPropertyRequests,
  handleSelectAll,
  handleSelectPropertyRequest,
  sortField,
  sortDirection,
  handleSort,
  setSelectedPropertyRequest,
  setShowPropertyRequestDialog,
  openEditDialog,
  handleDelete,
  formData,
  open,
  setOpen,
  handleChange,
  handleUpdatePropertyRequest,
  showBulkActionsDialog,
  setShowBulkActionsDialog,
  setSelectedPropertyRequests,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalItems = 0,
  perPage = 20,
}: PropertyRequestsTableProps) => {
  const openWhatsApp = (raw: string) => {
    const phone = raw.replace(/\D/g, ""); // remove non-digits
    let full = "";

    // Saudi numbers
    if (phone.startsWith("05")) full = "966" + phone.slice(1);
    else if (phone.startsWith("5")) full = "966" + phone;
    // Egyptian numbers
    else if (phone.startsWith("1")) full = "20" + phone;
    // fallback: assume KSA
    else full = "966" + phone;

    window.open(`https://wa.me/${full}`, "_blank");
  };

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      {selectedPropertyRequests.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {selectedPropertyRequests.length} طلب عقار محدد
          </span>
          <Dialog
            open={showBulkActionsDialog}
            onOpenChange={setShowBulkActionsDialog}
          >
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <CheckSquare className="ml-2 h-4 w-4" />
                إجراءات جماعية
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>إجراءات جماعية لطلبات العقارات</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Button
                  className="w-full justify-start bg-transparent"
                  variant="outline"
                >
                  <Mail className="ml-2 h-4 w-4" />
                  إرسال بريد إلكتروني جماعي
                </Button>
                <Button
                  className="w-full justify-start bg-transparent"
                  variant="outline"
                >
                  <MessageSquare className="ml-2 h-4 w-4" />
                  إرسال رسالة واتساب جماعية
                </Button>
                <Button
                  className="w-full justify-start bg-transparent"
                  variant="outline"
                >
                  <Tag className="ml-2 h-4 w-4" />
                  إضافة علامات
                </Button>
                <Button
                  className="w-full justify-start bg-transparent"
                  variant="outline"
                >
                  <Download className="ml-2 h-4 w-4" />
                  تصدير البيانات المحددة
                </Button>
                <Separator />
                <Button className="w-full justify-start" variant="destructive">
                  <Trash2 className="ml-2 h-4 w-4" />
                  حذف طلبات العقارات المحددة
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedPropertyRequests([])}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Property Requests Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={
                      selectedPropertyRequests.length ===
                      filteredAndSortedPropertyRequests.length
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("full_name")}
                    className="h-auto p-0 font-semibold "
                  >
                    مقدم الطلب
                    {sortField === "full_name" &&
                      (sortDirection === "asc" ? (
                        <SortAsc className="mr-2 h-4 w-4" />
                      ) : (
                        <SortDesc className="mr-2 h-4 w-4" />
                      ))}
                  </Button>
                </TableHead>
                <TableHead className="text-right">الاتصال</TableHead>
                <TableHead className="text-right">نوع العقار</TableHead>
                <TableHead className="text-right">المنطقة</TableHead>
                <TableHead className="text-right">تاريخ الطلب</TableHead>
                <TableHead className="w-[100px] text-right">
                  الإجراءات
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedPropertyRequests.map((propertyRequest: any) => (
                <TableRow key={propertyRequest.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedPropertyRequests.includes(
                        propertyRequest.id,
                      )}
                      onCheckedChange={() =>
                        handleSelectPropertyRequest(propertyRequest.id)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="font-medium text-right">
                          {propertyRequest.full_name}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {/* Phone Number */}
                      {propertyRequest.phone ? (
                        <div className="flex items-center text-sm">
                          <Phone className="ml-2 h-3 w-3 text-green-600" />
                          <span className="font-medium">
                            {propertyRequest.phone}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Phone className="ml-2 h-3 w-3" />
                          <span className="italic">لا يوجد رقم</span>
                        </div>
                      )}

                      {/* WhatsApp */}
                      {propertyRequest.contact_on_whatsapp ? (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MessageSquare className="ml-2 h-3 w-3 text-green-500" />
                          <span className="text-xs">متاح عبر واتساب</span>
                        </div>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        propertyRequest.property_type === "سكني"
                          ? "border-blue-500 text-blue-700"
                          : propertyRequest.property_type === "تجاري"
                            ? "border-green-500 text-green-700"
                            : propertyRequest.property_type === "صناعي"
                              ? "border-purple-500 text-purple-700"
                              : propertyRequest.property_type === "أرض"
                                ? "border-orange-500 text-orange-700"
                                : "border-red-500 text-red-700"
                      }
                    >
                      {propertyRequest.property_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-right">
                        {propertyRequest.region || (
                          <span className="text-muted-foreground text-sm italic">
                            غير محددة
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Clock className="ml-2 h-3 w-3 text-blue-500" />
                      <span className="font-medium">
                        {new Date(
                          propertyRequest.created_at,
                        ).toLocaleDateString("ar-US")}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedPropertyRequest(propertyRequest);
                          setShowPropertyRequestDialog(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {/* DropdownMenu - Hidden */}
                      {/* <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onSelect={(e) => {
                              e.preventDefault();
                              openEditDialog(propertyRequest);
                            }}
                          >
                            <Edit className="ml-2 h-4 w-4" />
                            تعديل الطلب
                          </DropdownMenuItem>

                          {formData && (
                            <Dialog open={open} onOpenChange={setOpen}>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>
                                    تعديل بيانات طلب العقار
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4">
                                  <Input
                                    id="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange("full_name")}
                                  />
                                  <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={handleChange("phone")}
                                  />
                                  <Textarea
                                    id="notes"
                                    value={formData.notes}
                                    onChange={handleChange("notes")}
                                  />

                                  <div className="flex justify-end gap-2">
                                    <Button
                                      variant="outline"
                                      onClick={() => setOpen(false)}
                                    >
                                      إلغاء
                                    </Button>
                                    <Button
                                      onClick={handleUpdatePropertyRequest}
                                    >
                                      تعديل
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}

                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => openWhatsApp(propertyRequest.phone)}
                          >
                            <MessageSquare className="ml-2 h-4 w-4" />
                            إرسال واتساب
                          </DropdownMenuItem>

                          <DropdownMenuItem>
                            <Phone className="ml-2 h-4 w-4" />
                            اتصال هاتفي
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="ml-2 h-4 w-4" />
                            إرسال بريد إلكتروني
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(propertyRequest.id)}
                          >
                            <Trash2 className="ml-2 h-4 w-4" />
                            حذف
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu> */}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {onPageChange && totalPages > 0 && (
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            lastPage={totalPages}
            total={totalItems}
            perPage={perPage}
            from={(currentPage - 1) * perPage + 1}
            to={Math.min(currentPage * perPage, totalItems)}
            onPageChange={onPageChange}
            loading={false}
          />
        </div>
      )}
    </div>
  );
};
