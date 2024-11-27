import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const isLoggedIn = !!localStorage.getItem("token");
  const userName = localStorage.getItem("user");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <header className="bg-main-red p-6 flex justify-between items-center font-Poppins">
      <Link to="/" className="text-2xl px-4 font-semibold text-background">
        Holidaze
      </Link>

      <div className="flex items-center px-4">
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
                  to={`/profiles/${userName}`}
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                  onClick={() => setMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/create"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                  onClick={() => setMenuOpen(false)}
                >
                  Create Venue
                </Link>
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
              to="/signupchoice"
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
