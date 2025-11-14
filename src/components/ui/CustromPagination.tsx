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
import { useState } from "react";

export default function CustomPagination() {
  const totalPages = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Pagination>
      <PaginationContent className="flex items-center justify-center gap-3">
        {/* Prev */}
        {/* <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
            className={cn(
              "rounded-full bg-[#B95E82] text-white hover:bg-[#B95E82] transition-all w-12 h-12",
              currentPage === 1 && "opacity-50 pointer-events-none"
            )}
          />
        </PaginationItem> */}

        {/* Pages */}
        {[1, 2, 3].map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href="#"
              onClick={() => handlePageChange(page)}
              className={cn(
                "rounded-full w-12 h-12 flex items-center justify-center lg:text-xl transition-all border-none text-[#494949] font-satoshi-500",
                currentPage === page
                  ? "bg-[#B95E82] text-white"
                  : "hover:bg-[#fbe6e6]"
              )}
              isActive={currentPage === page}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>

        <PaginationItem>
          <PaginationLink
            href="#"
            onClick={() => handlePageChange(totalPages)}
            className={cn(
              "rounded-full w-12 h-12 flex items-center justify-center lg:text-xl transition-all text-[#494949] font-satoshi-500",
              currentPage === totalPages
                ? "bg-[#B95E82] text-white"
                : "hover:bg-[#fbe6e6]"
            )}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>

        {/* Next */}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={() =>
              currentPage < totalPages && handlePageChange(currentPage + 1)
            }
            className={cn(
              "rounded-full bg-[#B95E82] text-white hover:bg-[#B95E82] transition-all w-12 h-12 [&_>svg]:size-5.5!",
              currentPage === totalPages && "opacity-50 pointer-events-none"
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
