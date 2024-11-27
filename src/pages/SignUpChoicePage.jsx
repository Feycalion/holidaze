import React from "react";
import { Link, useNavigate } from "react-router-dom";

const SignUpChoicePage = () => {
  const navigate = useNavigate();

  const handleChoice = (isVenueManager) => {
    navigate("/signup", { state: { venueManager: isVenueManager } });
  };
  return (
    <div className="flex flex-col items-center min-h-screen mt-36">
      <h1 className="text-3xl text-text mb-8">Sign up</h1>

      <p className="text-lg mb-4 text-text">Sign up as</p>

      <Link
        onClick={() => handleChoice(true)}
        to="/signup/?role=venueManager"
        className="w-64 py-6 mb-4 bg-main-red text-background rounded font-semibold text-center"
      >
        Venue Manager
      </Link>

      <p className="text-lg mb-4 text-text">or</p>

      <button
        onClick={() => handleChoice(false)}
        to="/signup/?role=guest"
        className="w-64 py-6 mb-4 bg-main-red text-background rounded font-semibold text-center"
      >
        Guest
      </button>

      <p className="text-text">
        Already have an account?{" "}
        <Link to="/login" className="text-red-700 underline hover:text-red-800">
          Log in here!
        </Link>
      </p>
    </div>
  );
};

export default SignUpChoicePage;
