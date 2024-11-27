import React from "react";
import { NavLink } from "react-router-dom";
import { FaStar } from "react-icons/fa";

const Card = ({ id, media, title, location, address, rating, price }) => {
  console.log(media);
  return (
    <NavLink
      to={`/venue/${id}`}
      className="flex flex-col items-center py-2 px-4"
    >
      <div className="rounded-lg p-4 shadow-lg bg-white w-[384px] transform transition-transform duration-200 hover:scale-105">
        <img
          src={media || "https://via.placeholder.com/300"}
          alt={title || "Venue"}
          className="w-full h-56 object-cover rounded-lg overflow-hidden"
        />

        <div className="mt-4">
          <h3 className="text-lg text-text font-semibold">
            {title || "Unnamed Venue"}
            {location ? `, ${location}` : ""}
          </h3>
          <p className="text-text-light">{address || "No Address Provided"}</p>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center text-text">
              <FaStar className="text-yellow-500 mr-1" />
              <span>{rating ? rating.toFixed(1) : "Unrated"}</span>
            </div>

            <p className="text-text font-semibold">
              {price ? `$${price}` : "Price not available"}{" "}
              <span className="text-gray-600">/ night</span>
            </p>
          </div>
        </div>
      </div>
    </NavLink>
  );
};

export default Card;
