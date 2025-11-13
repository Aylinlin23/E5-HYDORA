import { useTheme } from '../store/ThemeContext';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  totalItems, 
  itemsPerPage,
  onPageChange,
  showInfo = true,
  className = '' 
}) => {
  const { isDarkMode } = useTheme();

  if (totalPages <= 1) {
    return null;
  }

  const getPageNumbers: React.FC = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Mostrar todas las pÃ¡ginas si hay pocas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Mostrar pÃ¡ginas con elipsis
      if (currentPage <= 3) {
        // Al inicio
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Al final
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // En el medio
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {/* InformaciÃ³n de elementos */}
      {showInfo && (
        <div className="flex-1 flex justify-start">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Mostrando <span className="font-medium">{startItem}</span> a{' '}
            <span className="font-medium">{endItem}</span> de{' '}
            <span className="font-medium">{totalItems}</span> resultados
          </p>
        </div>
      )}

      {/* NavegaciÃ³n de pÃ¡ginas */}
      <div className="flex items-center space-x-1">
        {/* BotÃ³n anterior */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center px-2 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed ${
            currentPage === 1
              ? 'text-gray-400 dark:text-gray-500'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <span className="sr-only">Anterior</span>
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>

        {/* NÃºmeros de pÃ¡gina */}
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' ? handlePageChange(page) : null}
            disabled={page === '...'}
            className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              page === currentPage
                ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600 dark:bg-indigo-900 dark:border-indigo-400 dark:text-indigo-300'
                : page === '...'
                ? 'text-gray-400 dark:text-gray-500 cursor-default'
                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            {page}
          </button>
        ))}

        {/* BotÃ³n siguiente */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`relative inline-flex items-center px-2 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed ${
            currentPage === totalPages
              ? 'text-gray-400 dark:text-gray-500'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <span className="sr-only">Siguiente</span>
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Selector de elementos por pÃ¡gina */}
      <div className="flex-1 flex justify-end">
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-700 dark:text-gray-300">
            Por pÃ¡gina:
          </label>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              const newItemsPerPage = parseInt(e.target.value);
              const newTotalPages = Math.ceil(totalItems / newItemsPerPage);
              const newCurrentPage = Math.min(currentPage, newTotalPages);
              onPageChange(newCurrentPage, newItemsPerPage);
            }}
            className="border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Pagination; 
