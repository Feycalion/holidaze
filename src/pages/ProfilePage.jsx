import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

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
  const [newAvatar, setNewAvatar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loggedInUserName = localStorage.getItem("user");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await apiGet(
          `/profiles/${id}?_venues=true&_bookings=true`
        );
        console.log("Fetched profile data:", profileData.data);
        setProfile(profileData.data);
        setNewBio(profileData.data.bio || "");
        setNewAvatar(profileData.data.avatar?.url || "");
        // console.log(profileData.data);

        if (profileData.data.venueManager) {
          const venuesData = await apiGet(`/profiles/${id}/venues`);
          setVenues(venuesData.data || []);
        } else {
          const bookingsData = await apiGet(`/profiles/${id}/bookings`);
          setBookings(bookingsData.data || []);
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

      console.log(payload);

      const response = await apiPut(
        `/holidaze/profiles/${profile.name}`,
        payload,
        true
      );

      setProfile((prevProfile) => ({ ...prevProfile, ...response.data }));
      setEditing(false);
      alert("Profile updated successfully.");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (error || !profile)
    return <p>Failed to load profile. Please try again later.</p>;

  const isOwnProfile = profile.name === loggedInUserName;

  return (
    <div className="max-w-7xl mx-auto p-6">
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

      {isOwnProfile && profile.venueManager && (
        <button
          onClick={() => navigate("/create")}
          className="bg-main-red text-background py-2 px-4 rounded mb-6"
        >
          Create Venue
        </button>
      )}

      {profile.venueManager ? (
        <>
          <h2 className="text-xl mb-4">{profile.name}'s Venues</h2>
          <div className="flex justify-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 gap-6">
              {venues.length > 0 ? (
                venues.map((venue) => (
                  <Card
                    key={venue.id}
                    media={
                      venue.media[0]?.url || "https://picsum.photos/200/300"
                    }
                    title={venue.name}
                    location={venue.location?.city}
                    address={venue.location?.address}
                    rating={venue.rating}
                    price={venue.price}
                  />
                ))
              ) : (
                <p>This user has no venues.</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-xl mb-4">{profile.name}'s Bookings</h2>
          {bookings.length > 0 ? (
            <ul>
              {bookings.map((booking) => (
                <li key={booking.id}>
                  <p>
                    Booking at {booking.venue?.name || "Unknown Venue"} from{" "}
                    {new Date(booking.dateFrom).toLocaleDateString()} to{" "}
                    {new Date(booking.dateTo).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>This user has no bookings.</p>
          )}
        </>
      )}
    </div>
  );
};

export default ProfilePage;
