import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Calendar from "react-calendar";
import { apiPost, apiGet } from "../utils/apiKey";
import {
  FaStar,
  FaWifi,
  FaParking,
  FaPaw,
  FaUtensils,
  FaUser,
  FaCalendarAlt,
} from "react-icons/fa";

const SingleVenuePage = () => {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedDates, setSelectedDates] = useState([null, null]);
  const [guestCount, setGuestCount] = useState(1);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isVenueManager, setIsVenueManager] = useState(false);

  const loggedInUserName = localStorage.getItem("user");

  const openCalendar = () => setIsCalendarOpen(true);
  const closeCalendar = () => setIsCalendarOpen(false);

  const calculateTotalPrice = () => {
    if (!selectedDates[0] || !selectedDates[1] || !venue?.price) return 0;
    const nights =
      Math.ceil(
        (new Date(selectedDates[1]).getTime() -
          new Date(selectedDates[0]).getTime()) /
          (1000 * 60 * 60 * 24)
      ) || 0;
    return nights * venue.price;
  };

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

        setVenue(venueData.data);
      } catch (error) {
        console.error("Error fetching venue:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserProfile = async () => {
      try {
        const userProfile = await apiGet(`/profiles/${loggedInUserName}`);
        setIsVenueManager(userProfile.data.venueManager);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchVenue();
    fetchUserProfile();
  }, [id, loggedInUserName]);

  const handleBooking = async () => {
    if (!selectedDates[0] || !selectedDates[1]) {
      alert("Please select a valid date range.");
      return;
    }

    const payload = {
      dateFrom: selectedDates[0].toISOString(),
      dateTo: selectedDates[1].toISOString(),
      guests: parseInt(guestCount, 10),
      venueId: id,
    };

    try {
      await apiPost(`/holidaze/bookings`, payload);
      alert("Booking successful!");
    } catch (error) {
      console.error("Error booking venue:", error);
      alert("Failed to book venue. Please try again.");
    }
  };

  if (loading) return <p>Loading venue...</p>;
  if (error || !venue)
    return <p>Failed to load venue. Please try again later.</p>;

  return (
    <div className="max-w-5xl mx-auto pt-12 p-6 grid grid-cols-1 lg:grid-cols-3 gap-14">
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
            {!venue.meta?.wifi &&
              !venue.meta?.parking &&
              !venue.meta?.pets &&
              !venue.meta?.breakfast && (
                <p className="mt-2 text-text-light">
                  This place offers no extra amenities.
                </p>
              )}

            <hr className="my-6 border-gray-300" />

            {!isVenueManager && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-text">
                  Book this Venue
                </h2>
                <button
                  onClick={openCalendar}
                  className="flex items-center px-4 py-2 bg-main-red text-background rounded font-semibold hover:bg-red-800 transition mt-4"
                >
                  <FaCalendarAlt className="mr-2" />
                  {selectedDates[0] && selectedDates[1]
                    ? `${selectedDates[0].toLocaleDateString()} - ${selectedDates[1].toLocaleDateString()}`
                    : "No date selected"}
                </button>

                {isCalendarOpen && (
                  <div className="mt-4 bg-white p-4 rounded shadow-lg">
                    <Calendar
                      selectRange
                      onChange={(dates) => {
                        setSelectedDates(dates);
                      }}
                      value={selectedDates}
                      tileClassName={({ date }) => {
                        if (
                          selectedDates[0] &&
                          selectedDates[1] &&
                          date >= new Date(selectedDates[0]) &&
                          date <= new Date(selectedDates[1])
                        ) {
                          return "highlighted-date";
                        }
                        return null;
                      }}
                    />
                    <div className="mt-4 flex justify-between items-center">
                      <p>
                        {selectedDates[0] && selectedDates[1]
                          ? `${Math.ceil(
                              (new Date(selectedDates[1]).getTime() -
                                new Date(selectedDates[0]).getTime()) /
                                (1000 * 60 * 60 * 24)
                            )} night(s) x $${
                              venue.price
                            } total: $${calculateTotalPrice()}`
                          : "No dates selected."}
                      </p>
                      <div className="flex space-x-4">
                        <button
                          onClick={() => setSelectedDates([null, null])}
                          className="bg-gray-300 text-gray-800 py-1 px-4 text-sm rounded"
                        >
                          Clear
                        </button>
                        <button
                          onClick={closeCalendar}
                          className="bg-main-red text-background text-sm py-1 px-4 rounded hover:bg-red-700"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                <div className="mt-4">
                  <label className="block text-sm font-medium">
                    Number of Guests
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={venue?.maxGuests || 1}
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                <button
                  onClick={handleBooking}
                  className="mt-4 px-3 bg-main-red text-background py-2 rounded font-semibold hover:bg-red-800 transition"
                >
                  Book Venue
                </button>
              </div>
            )}
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
