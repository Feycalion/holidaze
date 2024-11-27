import React, { useState, useEffect } from "react";
import Card from "../components/Card";
import FilterButton from "../components/FilterBtn";
import FilterOverlay from "../components/FilterOverlay";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [venues, setVenues] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [status, setStatus] = useState("idle");

  const openFilter = () => setIsFilterOpen(true);
  const closeFilter = () => setIsFilterOpen(false);

  useEffect(() => {
    const fetchVenues = async () => {
      setStatus("loading");
      try {
        const response = await fetch(
          "https://v2.api.noroff.dev/holidaze/venues"
        );
        if (!response.ok) throw new Error("Failed to fetch venues");
        const data = await response.json();
        console.log("Fetched venues:", data);
        setVenues(data.data);
        setStatus("success");
      } catch (error) {
        console.error(error);
        setStatus("error");
      }
    };

    fetchVenues();
  }, []);

  return (
    <div className="p-6">
      <div className="mt-6">
        {status === "loading" && <p>Loading venues...</p>}
        {status === "error" && (
          <p>Failed to load venues. Please try again later.</p>
        )}
        {status === "success" && venues.length === 0 && (
          <p>No venues available.</p>
        )}
        {status === "success" && venues.length > 0 && (
          <div className="flex flex-col items-center">
            <div className="mb-6 w-full max-w-7xl">
              <FilterButton onClick={openFilter} />
            </div>

            <FilterOverlay isOpen={isFilterOpen} onClose={closeFilter} />
            <div className="mt-6 flex justify-center">
              <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 gap-6">
                {console.log("Venues to render:", venues)}
                {venues.map((venue) => (
                  <Card
                    key={venue.id}
                    id={venue.id}
                    media={
                      venue.media && venue.media.length > 0
                        ? venue.media[0].url
                        : "https://picsum.photos/200/300"
                    }
                    title={venue.name}
                    location={venue.location?.city}
                    address={venue.location?.address}
                    rating={venue.rating}
                    price={venue.price}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
