"use client";

import { ExternalLink, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function TemplatesPage() {
  const templateCategories = [
    {
      id: "all",
      label: "All Templates",
    },
    {
      id: "business",
      label: "Business",
    },
    {
      id: "portfolio",
      label: "Portfolio",
    },
    {
      id: "blog",
      label: "Blog",
    },
    {
      id: "ecommerce",
      label: "E-commerce",
    },
  ];

  const templates = [
    {
      id: "1",
      name: "Business Pro",
      category: "business",
      description: "Professional template for businesses",
      thumbnail: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "2",
      name: "Creative Portfolio",
      category: "portfolio",
      description: "Showcase your creative work",
      thumbnail: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "3",
      name: "Blog Standard",
      category: "blog",
      description: "Clean and minimal blog template",
      thumbnail: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "4",
      name: "E-commerce Shop",
      category: "ecommerce",
      description: "Complete online store template",
      thumbnail: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "5",
      name: "Corporate",
      category: "business",
      description: "For large organizations and enterprises",
      thumbnail: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "6",
      name: "Photographer",
      category: "portfolio",
      description: "Ideal for photographers and visual artists",
      thumbnail: "/placeholder.svg?height=200&width=300",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
        <main className="flex-1 p-4 md:p-6">
          <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Templates</h1>
                <p className="text-muted-foreground">
                  Choose from our collection of professional templates
                </p>
              </div>
              <div className="flex w-full gap-2 sm:w-auto">
                <Input
                  placeholder="Search templates..."
                  className="sm:w-[250px]"
                />
                <Button variant="outline" className="gap-1">
                  <Plus className="h-4 w-4" />
                  Custom
                </Button>
              </div>
            </div>

            <Tabs defaultValue="all">
              <TabsList className="flex w-full overflow-auto">
                {templateCategories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id}>
                    {category.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {templateCategories.map((category) => (
                <TabsContent
                  key={category.id}
                  value={category.id}
                  className="mt-4"
                >
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {templates
                      .filter(
                        (template) =>
                          category.id === "all" ||
                          template.category === category.id,
                      )
                      .map((template) => (
                        <TemplateCard key={template.id} template={template} />
                      ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </main>
    </div>
  );
}

function TemplateCard({ template }: { template: any }) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={template.thumbnail || "/placeholder.svg"}
          alt={template.name}
          className="h-full w-full object-cover transition-all hover:scale-105"
        />
      </div>
      <CardHeader className="p-4">
        <CardTitle className="line-clamp-1">{template.name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {template.description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex gap-2 p-4 pt-0">
        <Button variant="outline" size="sm" className="w-full gap-1">
          <ExternalLink className="h-3.5 w-3.5" />
          Preview
        </Button>
        <Button size="sm" className="w-full">
          Use Template
        </Button>
      </CardFooter>
    </Card>
  );
}
