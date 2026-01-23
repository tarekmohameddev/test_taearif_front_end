"use client";

import { useState, useEffect } from "react";
import { X, ChevronRight, ChevronLeft, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface TourStep {
  id: string;
  title: string;
  description: string;
  targetElement: string;
  position: "top" | "right" | "bottom" | "left";
}

export function GuidedTour() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<TourStep[]>([]);

  useEffect(() => {
    // Check if user has completed the tour before
    const tourCompleted = localStorage.getItem("guided_tour_completed");

    if (!tourCompleted) {
      // Define tour steps based on available elements
      const availableSteps: TourStep[] = [];

      if (document.querySelector(".sidebar")) {
        availableSteps.push({
          id: "sidebar",
          title: "قائمة التنقل",
          description:
            "استخدم هذه القائمة للتنقل بين الأقسام المختلفة في منشئ تعاريف.",
          targetElement: ".sidebar",
          position: "left",
        });
      }

      if (document.querySelector(".websites-grid")) {
        availableSteps.push({
          id: "websites",
          title: "مواقعك",
          description:
            "هنا يمكنك رؤية جميع مواقعك. انقر على أي موقع لتعديله أو إنشاء موقع جديد.",
          targetElement: ".websites-grid",
          position: "bottom",
        });
      }

      if (document.querySelector(".help-center-button")) {
        availableSteps.push({
          id: "help",
          title: "المساعدة والدعم",
          description:
            "هل تحتاج إلى مساعدة؟ انقر هنا للوصول إلى البرامج التعليمية والأدلة والاتصال بفريق الدعم لدينا.",
          targetElement: ".help-center-button",
          position: "right",
        });
      }

      if (availableSteps.length > 0) {
        setSteps(availableSteps);
        setIsVisible(true);
      }
    }
  }, []);

  const handleComplete = () => {
    localStorage.setItem("guided_tour_completed", "true");
    setIsVisible(false);
  };

  const handleSkip = () => {
    localStorage.setItem("guided_tour_completed", "true");
    setIsVisible(false);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isVisible || steps.length === 0) {
    return null;
  }

  const currentTourStep = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-[350px] max-w-[90vw]">
        <CardContent className="pt-6">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-2 h-7 w-7"
            onClick={handleSkip}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">تخطي الجولة</span>
          </Button>
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-primary/20 p-2 mt-0.5">
              <Lightbulb className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-sm">{currentTourStep.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {currentTourStep.description}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t">
          <div className="flex items-center text-xs text-muted-foreground">
            الخطوة {currentStep + 1} من {steps.length}
          </div>
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                className="gap-1"
              >
                <ChevronRight className="h-4 w-4" />
                السابق
              </Button>
            )}
            <Button size="sm" onClick={handleNext} className="gap-1">
              {currentStep < steps.length - 1 ? (
                <>
                  التالي
                  <ChevronLeft className="h-4 w-4" />
                </>
              ) : (
                "إنهاء الجولة"
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
