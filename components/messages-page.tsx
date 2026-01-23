"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  PenSquare,
  Star,
  Archive,
  Trash2,
  MoreVertical,
  Send,
  Paperclip,
  Smile,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Sample messages data
const messages = [
  {
    id: 1,
    sender: "Alex Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "alex@example.com",
    subject: "Website Feedback",
    preview: "I wanted to share some thoughts about the new design...",
    date: "10:23 AM",
    isRead: false,
    isStarred: true,
    labels: ["Support"],
  },
  {
    id: 2,
    sender: "Sarah Williams",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "sarah@example.com",
    subject: "Question about pricing",
    preview: "I'm interested in your premium plan but had a question about...",
    date: "Yesterday",
    isRead: true,
    isStarred: false,
    labels: ["Inquiry"],
  },
  {
    id: 3,
    sender: "Michael Brown",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "michael@example.com",
    subject: "Partnership opportunity",
    preview: "Our company is looking to partner with businesses like yours...",
    date: "Nov 10",
    isRead: true,
    isStarred: true,
    labels: ["Business"],
  },
  {
    id: 4,
    sender: "Emily Davis",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "emily@example.com",
    subject: "Technical support needed",
    preview: "I'm having trouble with my account and need assistance with...",
    date: "Nov 8",
    isRead: false,
    isStarred: false,
    labels: ["Support", "Urgent"],
  },
  {
    id: 5,
    sender: "David Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "david@example.com",
    subject: "Content collaboration",
    preview: "I'd like to discuss a potential content collaboration for...",
    date: "Nov 5",
    isRead: true,
    isStarred: false,
    labels: ["Marketing"],
  },
];

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState("messages");
  const [selectedMessage, setSelectedMessage] = useState(messages[0]);
  const [replyText, setReplyText] = useState("");

  return (
    <div className="flex min-h-screen flex-col">
        <main className="flex-1 p-4 md:p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">الرسائل</h1>
              <p className="text-muted-foreground">إدارة الاتصالات مع عملائك</p>
            </div>
            <Button>
              <PenSquare className="mr-2 h-4 w-4" />
              إنشاء
            </Button>
          </div>

          <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
            <Card className="col-span-1">
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">صندوق الوارد</CardTitle>
                  <Badge>12 جديد</Badge>
                </div>
                <div className="relative mt-2">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="البحث في الرسائل..."
                    className="pl-8"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs defaultValue="inbox" className="w-full">
                  <TabsList className="w-full justify-start px-4 pt-2">
                    <TabsTrigger value="inbox" className="flex-1">
                      الوارد
                    </TabsTrigger>
                    <TabsTrigger value="starred" className="flex-1">
                      <Star className="mr-1 h-4 w-4" />
                      المميز
                    </TabsTrigger>
                    <TabsTrigger value="sent" className="flex-1">
                      المرسل
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="inbox" className="m-0">
                    <ScrollArea className="h-[calc(100vh-300px)]">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex p-3 border-b cursor-pointer hover:bg-muted/50 ${
                            selectedMessage.id === message.id ? "bg-muted" : ""
                          } ${!message.isRead ? "font-medium" : ""}`}
                          onClick={() => setSelectedMessage(message)}
                        >
                          <div className="flex-shrink-0 mr-3">
                            <Avatar>
                              <AvatarImage
                                src={message.avatar}
                                alt={message.sender}
                              />
                              <AvatarFallback>
                                {message.sender.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1">
                              <span className="truncate">{message.sender}</span>
                              <div className="flex items-center">
                                {message.isStarred && (
                                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                )}
                                <span className="text-xs text-muted-foreground">
                                  {message.date}
                                </span>
                              </div>
                            </div>
                            <div className="text-sm font-medium truncate">
                              {message.subject}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {message.preview}
                            </div>
                            <div className="flex mt-1">
                              {message.labels.map((label) => (
                                <Badge
                                  key={label}
                                  variant="outline"
                                  className="mr-1 text-xs"
                                >
                                  {label}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="starred" className="m-0">
                    <div className="p-4 text-center text-muted-foreground">
                      الرسائل المميزة ستظهر هنا
                    </div>
                  </TabsContent>

                  <TabsContent value="sent" className="m-0">
                    <div className="p-4 text-center text-muted-foreground">
                      الرسائل المرسلة ستظهر هنا
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card className="col-span-1 lg:col-span-2">
              <CardHeader className="p-4 pb-2 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg">
                      {selectedMessage.subject}
                    </CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <span className="font-medium mr-1">
                        {selectedMessage.sender}
                      </span>
                      <span className="text-muted-foreground">
                        &lt;{selectedMessage.email}&gt;
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon">
                      <Archive className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          وضع علامة كغير مقروء
                        </DropdownMenuItem>
                        <DropdownMenuItem>إضافة نجمة</DropdownMenuItem>
                        <DropdownMenuItem>تطبيق تسمية</DropdownMenuItem>
                        <DropdownMenuItem>طباعة</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-450px)] p-4">
                  <div className="mb-4 flex">
                    <div className="flex max-w-[80%]">
                      <Avatar className="mr-3 flex-shrink-0">
                        <AvatarImage
                          src={selectedMessage.avatar}
                          alt={selectedMessage.sender}
                        />
                        <AvatarFallback>
                          {selectedMessage.sender.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center mb-1">
                          <span className="font-medium text-sm">
                            {selectedMessage.sender}
                          </span>
                          <span className="text-xs text-muted-foreground ml-2">
                            {selectedMessage.date}
                          </span>
                        </div>
                        <div className="p-3 rounded-lg bg-muted">
                          {selectedMessage.preview}
                          <p className="mt-2">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Sed do eiusmod tempor incididunt ut labore et
                            dolore magna aliqua. Ut enim ad minim veniam, quis
                            nostrud exercitation ullamco laboris nisi ut aliquip
                            ex ea commodo consequat.
                          </p>
                          <p className="mt-2">
                            Best regards,
                            <br />
                            {selectedMessage.sender}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
                <Separator />
                <div className="p-4">
                  <Textarea
                    placeholder="اكتب ردك..."
                    className="min-h-[100px] mb-3"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <div className="flex justify-between items-center">
                    <div className="flex gap-1">
                      <Button variant="outline" size="icon">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Smile className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button>
                      <Send className="mr-2 h-4 w-4" />
                      إرسال الرد
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
    </div>
  );
}
