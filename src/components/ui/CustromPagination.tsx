"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

import { cn } from "@/lib/utils";

interface CustomPaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  visiblePages?: number;
}

export default function CustomPagination({
  totalPages,
  currentPage,
  onPageChange,
  visiblePages = 3,
}: CustomPaginationProps) {
  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= visiblePages + 2) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always show first pages
    for (let i = 1; i <= visiblePages; i++) {
      pages.push(i);
    }

    // Add ellipsis if needed
    if (currentPage > visiblePages + 1) {
      pages.push("...");
    }

    // Add current page if not already shown
    if (currentPage > visiblePages && currentPage < totalPages - 1) {
      pages.push(currentPage);
    }

    // Add ellipsis before last pages if needed
    if (currentPage < totalPages - visiblePages) {
      pages.push("...");
    }

    // Always show last pages
    for (let i = Math.max(visiblePages + 1, totalPages - visiblePages + 1); i <= totalPages; i++) {
      pages.push(i);
    }

    return pages.filter((p, i, arr) => i === 0 || i === arr.length - 1 || p !== arr[i - 1]);
  };

  const pageNumbers = generatePageNumbers();

  return (
    <Pagination>
      <PaginationContent className="flex items-center justify-center gap-3">
        {/* Previous */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            className={cn(
              "rounded-full bg-[#B95E82] text-white hover:bg-[#B95E82] transition-all size-9 md:size-10",
              currentPage === 1 && "opacity-50 pointer-events-none cursor-not-allowed"
            )}
          />
        </PaginationItem>

        {/* Pages */}
        {pageNumbers.map((page, idx) => (
          <PaginationItem key={idx}>
            {page === "..." ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href="#"
                onClick={() => onPageChange(page as number)}
                className={cn(
                  "rounded-full size-9 md:size-10 flex items-center justify-center text-base lg:text-lg transition-all border-none text-[#494949] font-satoshi-500",
                  currentPage === page
                    ? "bg-[#B95E82] text-white"
                    : "hover:bg-[#fbe6e6]"
                )}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        {/* Next */}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
            className={cn(
              "rounded-full bg-[#B95E82] text-white hover:bg-[#B95E82] transition-all size-9 md:size-10 [&_>svg]:size-5.5!",
              currentPage === totalPages && "opacity-50 pointer-events-none cursor-not-allowed"
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}