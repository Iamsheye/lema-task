import { ArrowLeft, ArrowRight } from "lucide-react";
import { NavigationButton } from "./NavigationButton";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const generatePageNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    // Calculate the range of pages to show
    const start = Math.max(1, currentPage - delta);
    const end = Math.min(totalPages, currentPage + delta);

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    // Add first page and dots if necessary
    if (start > 1) {
      rangeWithDots.push(1);
      if (start > 2) {
        rangeWithDots.push("...");
      }
    }

    // Add the calculated range
    rangeWithDots.push(...range);

    // Add last page and dots if necessary
    if (end < totalPages) {
      if (end < totalPages - 1) {
        rangeWithDots.push("...");
      }
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div
      className={cn(
        "flex items-center justify-center md:justify-end md:gap-10",
        className,
      )}
    >
      <NavigationButton
        disabled={!canGoPrevious}
        onClick={() => onPageChange(currentPage - 1)}
        icon={ArrowLeft}
        iconPosition="left"
      >
        <span className="hidden sm:block">Previous</span>
      </NavigationButton>

      {/* Page Numbers */}
      <div className="flex items-center gap-0.5">
        {pageNumbers.map((pageNumber, index) => {
          if (pageNumber === "...") {
            return (
              <div
                key={`ellipsis-${index}`}
                className="flex size-10 items-center justify-center text-sm font-medium text-[#717680]"
              >
                ...
              </div>
            );
          }

          const isActive = pageNumber === currentPage;
          return (
            <button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber as number)}
              className={cn(
                "flex size-10 cursor-pointer items-center justify-center rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#F9F5FF] text-[#7F56D9]"
                  : "text-[#717680] hover:bg-gray-50",
              )}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>

      <NavigationButton
        disabled={!canGoNext}
        onClick={() => onPageChange(currentPage + 1)}
        icon={ArrowRight}
        iconPosition="right"
      >
        <span className="hidden sm:block">Next</span>
      </NavigationButton>
    </div>
  );
}
