import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import {
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
      SelectValue,
} from "@/components/ui/select";

interface PaginationProps {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      onPageChange: (page: number) => void;
      onLimitChange?: (limit: number) => void;
      isLoading?: boolean;
}

export function PaginationControls({
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage,
      onPageChange,
      onLimitChange,
      isLoading = false,
}: PaginationProps) {
      return (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground order-2 sm:order-1">
                        <span>
                              Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} to{" "}
                              {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
                        </span>
                        {onLimitChange && (
                              <div className="flex items-center space-x-2 ml-4">
                                    <span>Rows per page</span>
                                    <Select
                                          value={itemsPerPage.toString()}
                                          onValueChange={(value) => onLimitChange(Number(value))}
                                          disabled={isLoading}
                                    >
                                          <SelectTrigger className="h-8 w-[70px]">
                                                <SelectValue placeholder={itemsPerPage.toString()} />
                                          </SelectTrigger>
                                          <SelectContent side="top">
                                                {[10, 20, 30, 50, 100].map((pageSize) => (
                                                      <SelectItem key={pageSize} value={pageSize.toString()}>
                                                            {pageSize}
                                                      </SelectItem>
                                                ))}
                                          </SelectContent>
                                    </Select>
                              </div>
                        )}
                  </div>

                  <div className="flex items-center space-x-2 order-1 sm:order-2">
                        <Button
                              variant="outline"
                              className="h-8 w-8 p-0 lg:flex"
                              onClick={() => onPageChange(1)}
                              disabled={currentPage === 1 || isLoading}
                        >
                              <span className="sr-only">Go to first page</span>
                              <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                              variant="outline"
                              className="h-8 w-8 p-0"
                              onClick={() => onPageChange(currentPage - 1)}
                              disabled={currentPage === 1 || isLoading}
                        >
                              <span className="sr-only">Go to previous page</span>
                              <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center justify-center text-sm font-medium w-[100px]">
                              Page {currentPage} of {totalPages}
                        </div>
                        <Button
                              variant="outline"
                              className="h-8 w-8 p-0"
                              onClick={() => onPageChange(currentPage + 1)}
                              disabled={currentPage === totalPages || isLoading}
                        >
                              <span className="sr-only">Go to next page</span>
                              <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                              variant="outline"
                              className="h-8 w-8 p-0 lg:flex"
                              onClick={() => onPageChange(totalPages)}
                              disabled={currentPage === totalPages || isLoading}
                        >
                              <span className="sr-only">Go to last page</span>
                              <ChevronsRight className="h-4 w-4" />
                        </Button>
                  </div>
            </div>
      );
}
