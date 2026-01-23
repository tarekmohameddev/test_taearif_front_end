"use client";

import { useState } from "react";
import {
  Copy,
  Edit,
  ExternalLink,
  MoreHorizontal,
  Plus,
  Settings,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function WebsitesPage() {
  const [websites, setWebsites] = useState([
    {
      id: "1",
      name: "My Portfolio",
      domain: "portfolio.taearif.com",
      status: "published",
      lastUpdated: "2 days ago",
      visitors: 1245,
      thumbnail: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "2",
      name: "Business Website",
      domain: "business.taearif.com",
      status: "published",
      lastUpdated: "1 week ago",
      visitors: 3456,
      thumbnail: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "3",
      name: "Blog",
      domain: "blog.taearif.com",
      status: "draft",
      lastUpdated: "3 days ago",
      visitors: 0,
      thumbnail: "/placeholder.svg?height=200&width=300",
    },
  ]);

  return (
    <div className="flex min-h-screen flex-col">
        <main className="flex-1 p-4 md:p-6">
          <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Websites</h1>
                <p className="text-muted-foreground">
                  Manage and edit your websites
                </p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-1">
                    <Plus className="h-4 w-4" />
                    New Website
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create a new website</DialogTitle>
                    <DialogDescription>
                      Enter the details for your new website
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Website name</Label>
                      <Input id="name" placeholder="My Awesome Website" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="domain">Domain</Label>
                      <Input id="domain" placeholder="mywebsite.taearif.com" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button>Create Website</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All Websites</TabsTrigger>
                <TabsTrigger value="published">Published</TabsTrigger>
                <TabsTrigger value="drafts">Drafts</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-4">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {websites.map((website) => (
                    <WebsiteCard key={website.id} website={website} />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="published" className="mt-4">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {websites
                    .filter((website) => website.status === "published")
                    .map((website) => (
                      <WebsiteCard key={website.id} website={website} />
                    ))}
                </div>
              </TabsContent>
              <TabsContent value="drafts" className="mt-4">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {websites
                    .filter((website) => website.status === "draft")
                    .map((website) => (
                      <WebsiteCard key={website.id} website={website} />
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
    </div>
  );
}

function WebsiteCard({ website }: { website: any }) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={website.thumbnail || "/placeholder.svg"}
          alt={website.name}
          className="h-full w-full object-cover transition-all hover:scale-105"
        />
      </div>
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="line-clamp-1">{website.name}</CardTitle>
            <CardDescription className="line-clamp-1">
              {website.domain}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="-mr-2">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <span
              className={`h-2 w-2 rounded-full ${website.status === "published" ? "bg-green-500" : "bg-amber-500"}`}
            />
            <span className="capitalize">{website.status}</span>
          </div>
          <div>Updated {website.lastUpdated}</div>
        </div>
        {website.status === "published" && (
          <div className="mt-2 text-sm">
            <span className="font-medium">
              {website.visitors.toLocaleString()}
            </span>{" "}
            <span className="text-muted-foreground">visitors</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2 p-4 pt-0">
        <Button variant="outline" size="sm" className="w-full gap-1">
          <Edit className="h-3.5 w-3.5" />
          Edit
        </Button>
        {website.status === "published" && (
          <Button size="sm" variant="secondary" className="w-full gap-1">
            <ExternalLink className="h-3.5 w-3.5" />
            Visit
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
