import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-2 mt-6">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>

            {getPageNumbers().map(page => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`min-w-[32px] h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors border ${
                        currentPage === page
                            ? "bg-blue-600 border-blue-500 text-white"
                            : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                    }`}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
};

export default Pagination;
