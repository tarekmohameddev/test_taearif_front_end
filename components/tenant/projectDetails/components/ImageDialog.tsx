import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { Project } from "../types";

interface ImageDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedImage: string;
  selectedImageIndex: number;
  allImages: string[];
  project: Project | null;
  onPrevious: () => void;
  onNext: () => void;
}

export const ImageDialog = ({
  isOpen,
  onOpenChange,
  selectedImage,
  selectedImageIndex,
  allImages,
  project,
  onPrevious,
  onNext,
}: ImageDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0">
        <DialogTitle className="sr-only">عرض صورة المشروع</DialogTitle>
        {selectedImage && selectedImage.trim() !== "" && project && (
          <div className="relative w-full h-[80vh] group">
            <Image
              src={selectedImage}
              alt={project?.title || "صورة المشروع"}
              fill
              className="object-contain rounded-lg"
            />

            {/* أسهم التنقل - تظهر فقط إذا كان هناك أكثر من صورة واحدة */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={onPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                  aria-label="الصورة السابقة"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <button
                  onClick={onNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                  aria-label="الصورة التالية"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </>
            )}

            {/* عداد الصور */}
            {allImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {selectedImageIndex + 1} / {allImages.length}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
