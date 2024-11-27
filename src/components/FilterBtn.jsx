import React from "react";
import { FaSlidersH } from "react-icons/fa";

const FilterButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center border border-gray-300 rounded-full px-4 py-2 text-gray-800 hover:bg-gray-100 transition"
    >
      <span className="mr-2">Filter venues</span>
      <FaSlidersH />
    </button>
  );
};

export default FilterButton;
