interface PaginationProps {
    page: number;
    totalPages: number;
    setPage: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ page, totalPages, setPage }) => {
    return (
        <div className="pagination mt-8 flex justify-center items-center space-x-4">
            {page > 0 && (
                <button
                    onClick={() => setPage(page - 1)}
                    className="btn-primary"
                >
                    Anterior
                </button>
            )}
            {Array.from({ length: totalPages }, (_, index) => (
                <button
                    key={index}
                    onClick={() => setPage(index)}
                    className={`btn-primary ${index === page ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                    {index + 1}
                </button>
            ))}
            {page < totalPages - 1 && (
                <button
                    onClick={() => setPage(page + 1)}
                    className="btn-primary"
                >
                    Próximo
                </button>
            )}
        </div>
    );
};

export default Pagination;