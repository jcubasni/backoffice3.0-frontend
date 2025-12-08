import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Props = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onNext: () => void
  onPrev: () => void
}

function getVisiblePages(
  currentPage: number,
  totalPages: number,
): (number | 0)[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  if (currentPage <= 2) {
    return [1, 2, 3]
  }

  if (currentPage >= totalPages - 1) {
    return [totalPages - 2, totalPages - 1, totalPages]
  }

  return [currentPage - 1, currentPage, currentPage + 1]
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  onNext,
  onPrev,
}: Props) {
  if (totalPages < 2) return null

  const visiblePages = getVisiblePages(currentPage, totalPages)

  return (
    <footer className="mx-auto flex w-fit items-center gap-2">
      <Button
        className="size-8"
        variant="outline"
        onClick={onPrev}
        disabled={currentPage === 1}
      >
        <ChevronLeft />
      </Button>

      {visiblePages.map((page, index) =>
        page === 0 ? (
          <span
            key={`ellipsis-${index}`}
            className="px-2 text-muted-foreground"
          >
            ...
          </span>
        ) : (
          <Button
            key={page}
            className={cn("size-8", currentPage === page && "bg-gray-200")}
            variant="outline"
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ),
      )}

      <Button
        className="size-8"
        variant="outline"
        onClick={onNext}
        disabled={currentPage === totalPages}
      >
        <ChevronRight />
      </Button>
    </footer>
  )
}
