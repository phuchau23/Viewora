"use client";

import { Button } from "@/components/ui/button";

export function CustomPagination({
  pageIndex,
  pageCount,
  onPageChange,
}: {
  pageIndex: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        disabled={pageIndex === 0}
        onClick={() => onPageChange(pageIndex - 1)}
      >
        Previous
      </Button>
      <span>
        Page {pageIndex + 1} of {pageCount}
      </span>
      <Button
        variant="outline"
        disabled={pageIndex + 1 >= pageCount}
        onClick={() => onPageChange(pageIndex + 1)}
      >
        Next
      </Button>
    </div>
  );
}
