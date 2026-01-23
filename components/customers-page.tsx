"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  UserPlus,
  Filter,
  MoreHorizontal,
  Mail,
  Phone,
  Tag,
  Download,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Sample customer data
const customers = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex@example.com",
    phone: "+1 (555) 123-4567",
    status: "Active",
    lastPurchase: "2023-10-15",
    totalSpent: "$1,245.00",
    tags: ["Premium", "Loyal"],
  },
  {
    id: 2,
    name: "Sarah Williams",
    email: "sarah@example.com",
    phone: "+1 (555) 987-6543",
    status: "Active",
    lastPurchase: "2023-11-02",
    totalSpent: "$876.50",
    tags: ["New"],
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael@example.com",
    phone: "+1 (555) 456-7890",
    status: "Inactive",
    lastPurchase: "2023-08-20",
    totalSpent: "$2,340.75",
    tags: ["Premium"],
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily@example.com",
    phone: "+1 (555) 234-5678",
    status: "Active",
    lastPurchase: "2023-11-10",
    totalSpent: "$567.25",
    tags: ["Subscriber"],
  },
  {
    id: 5,
    name: "David Wilson",
    email: "david@example.com",
    phone: "+1 (555) 876-5432",
    status: "Active",
    lastPurchase: "2023-10-28",
    totalSpent: "$1,890.00",
    tags: ["Premium", "Subscriber"],
  },
];

export default function CustomersPage() {
  const [activeTab, setActiveTab] = useState("customers");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm),
  );

  return (
    <div className="flex min-h-screen flex-col">
        <main className="flex-1 p-4 md:p-6">
          <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">العملاء</h1>
                <p className="text-muted-foreground">
                  إدارة علاقات العملاء والبيانات
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  تصدير
                </Button>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  إضافة عميل
                </Button>
              </div>
            </div>

            <div className="grid gap-6 mb-8 grid-cols-1 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    إجمالي العملاء
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,248</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500">↑ 12%</span> من الشهر
                    الماضي
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    العملاء النشطون
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">964</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500">↑ 8%</span> من الشهر الماضي
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    متوسط الإنفاق
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$842.38</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500">↑ 5%</span> من الشهر الماضي
                  </p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="all" className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="all">جميع العملاء</TabsTrigger>
                  <TabsTrigger value="active">نشط</TabsTrigger>
                  <TabsTrigger value="inactive">غير نشط</TabsTrigger>
                  <TabsTrigger value="premium">مميز</TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="البحث عن العملاء..."
                      className="pl-8 w-[250px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <TabsContent value="all" className="m-0">
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>الاسم</TableHead>
                          <TableHead>الاتصال</TableHead>
                          <TableHead>الحالة</TableHead>
                          <TableHead>آخر عملية شراء</TableHead>
                          <TableHead>إجمالي الإنفاق</TableHead>
                          <TableHead>العلامات</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCustomers.map((customer) => (
                          <TableRow key={customer.id}>
                            <TableCell className="font-medium">
                              {customer.name}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <div className="flex items-center text-sm">
                                  <Mail className="mr-2 h-3 w-3" />
                                  {customer.email}
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Phone className="mr-2 h-3 w-3" />
                                  {customer.phone}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  customer.status === "Active"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {customer.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{customer.lastPurchase}</TableCell>
                            <TableCell>{customer.totalSpent}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {customer.tags.map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="outline"
                                    className="flex items-center"
                                  >
                                    <Tag className="mr-1 h-3 w-3" />
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    عرض التفاصيل
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    تعديل العميل
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    إرسال بريد إلكتروني
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-destructive">
                                    حذف
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
    </div>
  );
}
