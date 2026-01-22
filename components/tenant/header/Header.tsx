"use client";

import React from "react";
import { Menu, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface MenuItem {
  label: string;
  href?: string;
  children?: MenuItem[];
}

interface HeaderProps {
  className?: string;
  title?: string;
  logo?: string;
  showMenu?: boolean;
  menuItems?: MenuItem[];
}

export default function Header({
  className,
  title = "Header",
  logo,
  showMenu = true,
  menuItems,
}: HeaderProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Default menu items with nested submenus
  const defaultMenuItems: MenuItem[] = menuItems || [
    {
      label: "الرئيسية",
      href: "#home",
    },
    {
      label: "من نحن",
      href: "#about",
    },
    {
      label: "الخدمات",
      children: [
        {
          label: "خدمة 1",
          href: "#service1",
        },
        {
          label: "خدمة 2",
          children: [
            {
              label: "خدمة فرعية 2-1",
              href: "#service2-1",
            },
            {
              label: "خدمة فرعية 2-2",
              href: "#service2-2",
            },
            {
              label: "خدمة فرعية 2-3",
              children: [
                {
                  label: "خدمة متداخلة 2-3-1",
                  href: "#service2-3-1",
                },
                {
                  label: "خدمة متداخلة 2-3-2",
                  href: "#service2-3-2",
                },
              ],
            },
          ],
        },
        {
          label: "خدمة 3",
          href: "#service3",
        },
      ],
    },
    {
      label: "اتصل بنا",
      href: "#contact",
    },
  ];

  // Render nested menu items recursively
  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    if (item.children && item.children.length > 0) {
      return (
        <DropdownMenuSub key={item.label}>
          <DropdownMenuSubTrigger className="cursor-pointer [&>svg]:ms-0 [&>svg]:me-auto [&>svg]:rotate-180">
            {item.label}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent 
            side="right" 
            align="start" 
            dir="rtl"
            sideOffset={-1}
          >
            {item.children.map((child) => renderMenuItem(child, level + 1))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      );
    }

    return (
      <DropdownMenuItem key={item.label} asChild>
        <a href={item.href || "#"} className="cursor-pointer">
          {item.label}
        </a>
      </DropdownMenuItem>
    );
  };

  // Mobile menu item component with state
  const MobileMenuItem = ({ item, level = 0 }: { item: MenuItem; level?: number }) => {
    const [isSubOpen, setIsSubOpen] = React.useState(false);

    if (item.children && item.children.length > 0) {
      return (
        <div className="space-y-2">
          <button
            onClick={() => setIsSubOpen(!isSubOpen)}
            className="flex items-center justify-between w-full text-sm font-medium transition-colors hover:text-primary"
          >
            <span>{item.label}</span>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                isSubOpen && "rotate-180"
              )}
            />
          </button>
          {isSubOpen && (
            <div className="me-4 space-y-2 border-e pe-4">
              {item.children.map((child) => (
                <MobileMenuItem key={child.label} item={child} level={level + 1} />
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <a
        href={item.href || "#"}
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary block",
          level > 0 && "me-4"
        )}
        onClick={() => setIsOpen(false)}
      >
        {item.label}
      </a>
    );
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo/Title Section */}
        <div className="flex items-center gap-4">
          {logo ? (
            <img src={logo} alt="Logo" className="h-8 w-auto" />
          ) : (
            <h1 className="text-xl font-bold">{title}</h1>
          )}
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {defaultMenuItems.map((item) => {
            if (item.children && item.children.length > 0) {
              return (
                <DropdownMenu key={item.label}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="text-sm font-medium hover:text-primary"
                    >
                      {item.label}
                      <ChevronDown className="me-1 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" side="bottom" dir="rtl">
                    {item.children.map((child) => renderMenuItem(child))}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }

            return (
              <a
                key={item.label}
                href={item.href || "#"}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Mobile Menu Button */}
        {showMenu && (
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">فتح القائمة</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px]">
                <SheetTitle className="sr-only">قائمة التنقل</SheetTitle>
                <nav className="flex flex-col gap-4 mt-6">
                  {defaultMenuItems.map((item) => (
                    <MobileMenuItem key={item.label} item={item} />
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        )}
      </div>
    </header>
  );
}
