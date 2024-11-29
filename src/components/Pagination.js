import React from "react";

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="flex justify-center mt-4">
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          onClick={() => onPageChange(i + 1)}
          className={`px-4 py-2 mx-1 ${
            currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
          } rounded`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
