import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useOutsideClick } from "../hooks/useOutsideClick";
import { apiGet } from "../utils/apiKey";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isVenueManager, setIsVenueManager] = useState(false);

  const isLoggedIn = !!localStorage.getItem("token");
  const loggedInUserName = localStorage.getItem("user");
  const ref = useOutsideClick(() => {
    setMenuOpen(false);
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isLoggedIn && loggedInUserName) {
        try {
          const response = await apiGet(`/profiles/${loggedInUserName}`);
          setIsVenueManager(response.data.venueManager || false);
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };

    fetchUserProfile();
  }, [isLoggedIn, loggedInUserName]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleLogoClick = (e) => {
    if (location.pathname === "/") {
      e.preventDefault();
      window.location.reload();
    }
  };

  return (
    <header className="bg-main-red p-6 flex justify-between items-center font-Poppins">
      <Link
        to="/"
        className="text-2xl px-4 font-semibold text-background"
        onClick={handleLogoClick}
      >
        Holidaze
      </Link>

      <div ref={ref} className="flex items-center px-4">
        {isLoggedIn ? (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 rounded-ful flex items-center justify-center"
            >
              <FaUserCircle className="text-background text-3xl" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 bg-background rounded shadow-lg w-48">
                <Link
                  to={`/profiles/${loggedInUserName}`}
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                  onClick={() => setMenuOpen(false)}
                >
                  Profile
                </Link>
                {isVenueManager && (
                  <Link
                    to="/create"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                    onClick={() => setMenuOpen(false)}
                  >
                    Create Venue
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link
              to="/login"
              className="text-background px-4 relative hover-underline"
            >
              Log in
            </Link>

            <Link
              to="/signup"
              className="bg-background py-[6px] px-2 text-main-red font-medium rounded-lg hover:bg-main-red hover:text-background transition-colors duration-200"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
