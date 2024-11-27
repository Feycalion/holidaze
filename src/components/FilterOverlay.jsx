import React from "react";
import { FaStar } from "react-icons/fa";

const FilterOverlay = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-background p-6 rounded-lg w-80 shadow-lg relative">
        <h2 className="text-center text-xl font-semibold mb-4">
          Filter venues
        </h2>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500"
        >
          X
        </button>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Location</label>
            <input
              type="text"
              placeholder="Norway"
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Rating</label>
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="text-gray-400" />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Guests</label>
            <input
              type="number"
              placeholder="1"
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Price</label>
            <input
              type="text"
              placeholder="$50"
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-main-red text-background py-2 rounded font-medium hover:bg-red-800 transition"
          >
            Filter
          </button>
        </form>
      </div>
    </div>
  );
};

export default FilterOverlay;
