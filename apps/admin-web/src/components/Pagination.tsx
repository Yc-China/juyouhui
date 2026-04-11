import React from 'react'

interface PaginationProps {
  current: number
  total: number
  pageSize: number
  onChange: (page: number) => void
}

const Pagination: React.FC<PaginationProps> = ({ current, total, pageSize, onChange }) => {
  const totalPages = Math.ceil(total / pageSize)
  
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  
  // 显示有限的页码，两边加省略号
  const showPages = () => {
    if (totalPages <= 7) return pages
    
    if (current <= 3) {
      return [...pages.slice(0, 5), '...', totalPages]
    }
    
    if (current >= totalPages - 3) {
      return [1, '...', ...pages.slice(totalPages - 5)]
    }
    
    return [1, '...', current - 1, current, current + 1, '...', totalPages]
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        className={`px-3 py-1 rounded border ${
          current === 1 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'border-gray-300 hover:bg-gray-50'
        }`}
        disabled={current === 1}
        onClick={() => onChange(current - 1)}
      >
        上一页
      </button>
      
      {showPages().map((page, index) => (
        typeof page === 'number' ? (
          <button
            key={index}
            className={`px-3 py-1 rounded ${
              page === current
                ? 'bg-primary text-white'
                : 'border border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => onChange(page)}
          >
            {page}
          </button>
        ) : (
          <span key={index} className="px-2 text-gray-400">
            {page}
          </span>
        )
      ))}
      
      <button
        className={`px-3 py-1 rounded border ${
          current === totalPages 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'border-gray-300 hover:bg-gray-50'
        }`}
        disabled={current === totalPages}
        onClick={() => onChange(current + 1)}
      >
        下一页
      </button>
      
      <span className="text-sm text-gray-600 ml-4">
        共 {total} 条
      </span>
    </div>
  )
}

export default Pagination
