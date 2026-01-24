"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, HelpCircle, Eye, EyeOff, Trash2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface FAQsCardProps {
  faqs: any[];
  newQuestion: string;
  newAnswer: string;
  suggestedFaqsList: any[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  setNewQuestion: (q: string) => void;
  setNewAnswer: (a: string) => void;
  onAddFaq: () => void;
  onRemoveFaq: (id: number) => void;
  onToggleFaqDisplay: (id: number) => void;
  onSelectSuggestedFaq: (faq: any) => void;
}

export default function FAQsCard({
  faqs,
  newQuestion,
  newAnswer,
  suggestedFaqsList,
  isOpen,
  setIsOpen,
  setNewQuestion,
  setNewAnswer,
  onAddFaq,
  onRemoveFaq,
  onToggleFaqDisplay,
  onSelectSuggestedFaq,
}: FAQsCardProps) {
  return (
    <Card className="xl:col-span-2">
      <CardHeader
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl">
                الأسئلة الشائعة الخاصة بالوحدة
              </CardTitle>
            </div>
            <CardDescription>
              أضف أسئلة وأجوبة شائعة حول هذه الوحدة لمساعدة المشترين
              المحتملين.
            </CardDescription>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </div>
      </CardHeader>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <CardContent className="space-y-6">
              {/* Add New FAQ Form */}
              <div className="space-y-4 p-4 border rounded-md">
                <h3 className="text-lg font-medium">إضافة سؤال جديد</h3>
                <div className="space-y-2">
                  <Label htmlFor="newQuestion">السؤال</Label>
                  <Input
                    id="newQuestion"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="مثال: هل مسموح بالحيوانات الأليفة؟"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newAnswer">الإجابة</Label>
                  <Textarea
                    id="newAnswer"
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    placeholder="مثال: نعم، مسموح بالحيوانات الأليفة الصغيرة."
                    rows={3}
                  />
                </div>
                <Button onClick={onAddFaq} className="w-full lg:w-auto">
                  <Plus className="ml-2 h-4 w-4" />
                  إضافة سؤال
                </Button>
              </div>

              {/* Suggested FAQs */}
              {suggestedFaqsList?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-md font-medium">أسئلة مقترحة:</h4>
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    {suggestedFaqsList.map((sq, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => onSelectSuggestedFaq(sq)}
                      >
                        <HelpCircle className="ml-2 h-4 w-4" />
                        {sq.question}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* List of Added FAQs */}
              {faqs.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    الأسئلة المضافة ({faqs.length})
                  </h3>
                  <div className="space-y-3">
                    {faqs.map((faq) => (
                      <div
                        key={faq.id}
                        className="p-4 border rounded-md bg-muted/30"
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-primary break-words">
                              {faq.question}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1 break-words">
                              {faq.answer}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 rtl:mr-auto ltr:ml-auto flex-shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onToggleFaqDisplay(faq.id)}
                              title={
                                faq.displayOnPage
                                  ? "إخفاء من صفحة الوحدة"
                                  : "عرض في صفحة الوحدة"
                              }
                            >
                              {faq.displayOnPage ? (
                                <Eye className="h-4 w-4" />
                              ) : (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onRemoveFaq(faq.id)}
                              className="text-red-500 hover:text-red-600"
                              title="حذف السؤال"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        {faq.displayOnPage ? (
                          <Badge variant="default" className="mt-2">
                            معروض في الصفحة
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="mt-2">
                            مخفي من الصفحة
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {faqs.length === 0 && (
                <p className="text-sm text-center text-muted-foreground py-4">
                  لم تتم إضافة أي أسئلة شائعة بعد.
                </p>
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
