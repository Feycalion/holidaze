import React, { useState, useEffect } from "react";
import Card from "../components/Card";
import FilterButton from "../components/FilterBtn";
import FilterOverlay from "../components/FilterOverlay";

const HomePage = () => {
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    location: "",
    rating: "",
    guests: "",
    price: "",
  });
  const [status, setStatus] = useState("idle");

  const openFilter = () => setIsFilterOpen(true);
  const closeFilter = () => setIsFilterOpen(false);

  useEffect(() => {
    const fetchVenues = async () => {
      setStatus("loading");
      try {
        const response = await fetch(
          "https://v2.api.noroff.dev/holidaze/venues?sort=created"
        );
        if (!response.ok) throw new Error("Failed to fetch venues");
        const data = await response.json();
        const sortedVenues = data.data.sort(
          (a, b) => new Date(b.created) - new Date(a.created)
        );

        setVenues(sortedVenues);
        setFilteredVenues(sortedVenues);
        setStatus("success");
      } catch (error) {
        console.error(error);
        setStatus("error");
      }
    };

    fetchVenues();
  }, []);

  const applyFilters = () => {
    const filtered = venues.filter((venue) => {
      const matchesLocation = filters.location
        ? venue.location?.city
            ?.toLowerCase()
            .includes(filters.location.toLowerCase())
        : true;
      const matchesRating = filters.rating
        ? venue.rating >= filters.rating
        : true;
      const matchesGuests = filters.guests
        ? venue.maxGuests >= parseInt(filters.guests)
        : true;
      const matchesPrice = filters.price
        ? venue.price <= parseInt(filters.price)
        : true;

      return matchesLocation && matchesRating && matchesGuests && matchesPrice;
    });
    setFilteredVenues(filtered);
  };

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

            <FilterOverlay
              isOpen={isFilterOpen}
              onClose={closeFilter}
              filters={filters}
              setFilters={setFilters}
              onFilterApply={applyFilters}
            />
            <div className="mt-6 flex justify-center">
              <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 gap-6">
                {filteredVenues.map((venue) => (
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
