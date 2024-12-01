import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import Card from "../components/Card";
import { apiGet, apiPut } from "../utils/apiKey";

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [venues, setVenues] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [editing, setEditing] = useState(false);
  const [newBio, setNewBio] = useState("");
  const [newAvatar, setNewAvatar] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loggedInUserName = localStorage.getItem("user");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await apiGet(
          `/profiles/${id}?_venues=true&_bookings=true`
        );
        setProfile(profileData.data);
        setNewBio(profileData.data.bio || "");
        setNewAvatar(profileData.data.avatar?.url || "");

        if (profileData.data.venueManager) {
          const venuesData = await apiGet(
            `/profiles/${id}/venues?_bookings=true`
          );
          setVenues(venuesData.data || []);
        } else {
          const bookingsData = await apiGet(`/profiles/${id}?_bookings=true`);
          setBookings(bookingsData.data.bookings || []);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const handleProfileUpdate = async () => {
    try {
      const payload = {
        avatar: {
          url: newAvatar || profile.avatar?.url || "",
          alt: "User avatar",
        },
        bio: newBio || profile.bio || "",
      };

      const response = await apiPut(
        `/holidaze/profiles/${profile.name}`,
        payload
      );
      setProfile((prevProfile) => ({ ...prevProfile, ...response.data }));
      setEditing(false);
      alert("Profile updated successfully.");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <div className="spinner"></div>
      </div>
    );
  if (error || !profile)
    return <p>Failed to load profile. Please try again later.</p>;

  const isOwnProfile = profile.name === loggedInUserName;

  return (
    <div className="max-w-7xl mx-auto p-6 pt-12">
      <div className="flex items-start mb-10 space-x-8">
        <img
          src={profile.avatar?.url || "https://picsum.photos/200/300"}
          alt={profile.name || "User"}
          className="w-32 h-32 object-cover rounded-full"
        />

        <div>
          <h1 className="text-lg font-semibold">
            {profile.name || "Unknown User"}
          </h1>
          {editing ? (
            <>
              <textarea
                value={newBio}
                onChange={(e) => setNewBio(e.target.value)}
                className="border rounded w-full p-2 mt-2"
              />
              <input
                type="text"
                value={newAvatar}
                onChange={(e) => setNewAvatar(e.target.value)}
                placeholder="Avatar URL"
                className="border rounded w-full p-2 mt-2"
              />
              <button
                onClick={handleProfileUpdate}
                className="bg-main-red text-background py-2 px-4 rounded mt-4"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditing(false)}
                className="bg-gray-300 text-text py-2 px-4 rounded mt-4 ml-2"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <p className="text-text mt-2">
                {profile.bio || "No bio available."}
              </p>
              {isOwnProfile && (
                <button
                  onClick={() => setEditing(true)}
                  className="bg-main-red text-background py-2 px-4 rounded mt-4"
                >
                  Edit Profile
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {profile.venueManager ? (
        <>
          {isOwnProfile && (
            <button
              onClick={() => navigate("/create")}
              className="bg-main-red text-background py-2 px-4 rounded mb-6"
            >
              Create Venue
            </button>
          )}

          <h2 className="text-xl mb-4">{profile.name}'s Venues</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
            {venues.length > 0 ? (
              venues.map((venue) => {
                const now = new Date();
                const upcomingBookingsCount = venue.bookings?.filter(
                  (booking) => new Date(booking.dateFrom) > now
                ).length;

                return (
                  <div key={venue.id} className="relative w-fit">
                    <Card
                      id={venue.id}
                      media={
                        venue.media[0]?.url || "https://picsum.photos/200/300"
                      }
                      title={venue.name}
                      location={venue.location?.city}
                      address={venue.location?.address}
                      rating={venue.rating}
                      price={venue.price}
                      bookingsCount={upcomingBookingsCount}
                    />
                    {isOwnProfile && (
                      <button
                        onClick={() => navigate(`/update/${venue.id}`)}
                        className="absolute top-2 right-2 bg-main-red text-background p-2 rounded-full shadow-lg hover:bg-red-700 transition"
                        title="Edit Venue"
                      >
                        <AiOutlineEdit size={20} />
                      </button>
                    )}
                  </div>
                );
              })
            ) : (
              <p>This user has no venues.</p>
            )}
          </div>
        </>
      ) : (
        <>
          <h2 className="text-xl mb-4">Your Bookings</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
            {bookings.length > 0 ? (
              bookings.map((booking) => {
                if (!booking?.venue) return null;

                return (
                  <Card
                    key={booking.id}
                    id={booking.venue.id}
                    media={
                      booking.venue.media?.[0]?.url ||
                      "https://picsum.photos/200/300"
                    }
                    title={booking.venue.name}
                    location={booking.venue.location?.city}
                    address={booking.venue.location?.address}
                    rating={booking.venue.rating}
                    price={booking.venue.price}
                  />
                );
              })
            ) : (
              <p>You have no bookings.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
