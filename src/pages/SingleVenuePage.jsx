import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaStar,
  FaWifi,
  FaParking,
  FaPaw,
  FaUtensils,
  FaUser,
} from "react-icons/fa";

const SingleVenuePage = () => {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const response = await fetch(
          `https://v2.api.noroff.dev/holidaze/venues/${id}?_owner=true&_bookings=true`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch venue details");
        }
        const venueData = await response.json();
        console.log("Fetched venue data:", venueData);
        setVenue(venueData.data);
      } catch (error) {
        console.error("Error fetching venue:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchVenue();
  }, [id]);

  if (loading) return <p>Loading venue...</p>;
  if (error || !venue)
    return <p>Failed to load venue. Please try again later.</p>;

  return (
    <div className="max-w-5xl mx-auto mt-6 p-6 grid grid-cols-1 lg:grid-cols-3 gap-14">
      <div className="lg:col-span-2">
        <img
          src={venue.media?.[0]?.url || "https://picsum.photos/200/300"}
          alt={venue.name || "Venue"}
          className="w-full h-64 object-cover rounded-lg"
        />

        <div className="mt-4 flex-col">
          <h1 className="text-2xl font-bold text-text">
            {venue.name || "Unnamed Venue"}
          </h1>
          <p className="text-text-light">
            {venue.location?.address || "No Address Provided"}
          </p>

          <hr className="my-6 border-gray-300" />

          <div className="flex items-center space-x-6 mt-4 text-text">
            <div className="flex items-center space-x-1">
              <FaUser />
              <span>{venue.maxGuests || "N/A"}</span>
            </div>
            <div className="flex items-center space-x-1">
              <FaStar />
              <span>{venue.rating?.toFixed(1) || "Unrated"}</span>
            </div>
            <p>
              ${venue.price || "N/A"} <span className="text-text">/ night</span>
            </p>
          </div>

          <hr className="my-6 border-gray-300" />

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-text">
              Amenities this place offers
            </h2>
            <ul className="mt-2 space-y-2">
              {venue.meta?.wifi && (
                <li className="flex items-center space-x-2">
                  <FaWifi className="text-text" />
                  <span>Wifi</span>
                </li>
              )}
              {venue.meta?.parking && (
                <li className="flex items-center space-x-2">
                  <FaParking className="text-text" />
                  <span>Parking</span>
                </li>
              )}
              {venue.meta?.pets && (
                <li className="flex items-center space-x-2">
                  <FaPaw className="text-text" />
                  <span>Pet friendly</span>
                </li>
              )}
              {venue.meta?.breakfast && (
                <li className="flex items-center space-x-2">
                  <FaUtensils className="text-text" />
                  <span>Breakfast</span>
                </li>
              )}
            </ul>
            <hr className="my-6 border-gray-300" />
            <button className="px-3 bg-main-red text-background py-2 rounded font-semibold hover:bg-red-800 transition">
              Book venue
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center space-x-4">
          <Link to={`/profiles/${venue.owner?.name}`}>
            <img
              src={venue.owner?.avatar.url || "https://picsum.photos/200/300"}
              alt={venue.owner?.name || "Host"}
              className="w-16 h-16 object-cover rounded-full"
            />
          </Link>
          <div>
            <Link to={`/profiles/${venue.owner?.name}`}>
              <h3 className="text-lg font-semibold text-text">
                {venue.owner?.name || "Unknown Host"}
              </h3>
            </Link>
          </div>
        </div>

        <hr className="my-6 border-gray-300t" />

        <p className="text-text">
          {venue.description || "No description available."}
        </p>
      </div>
    </div>
  );
};

export default SingleVenuePage;
