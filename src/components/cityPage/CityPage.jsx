/**
 * CityPage Component
 * A memoized component that renders a dashboard interface for managing city-related actions.
 * Includes buttons for various functionalities such as creating tenders, managing categories,
 * viewing feedbacks, deciding winners, and more.
 *
 * @param {Object} user - The user object containing user information.
 * @param {string} user.name - The name of the user displayed in the dashboard header.
 */

import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

// Configuration for buttons displayed on the dashboard.
const BUTTON_CONFIG = [
  {
    label: "Create New Tender", // Button label
    path: "/create-tender", // Navigation path
    color: "from-blue-500 to-blue-700", // Gradient color for the button background
    hover: "hover:from-blue-600 hover:to-blue-800", // Hover effect
    icon: "M12 4v16m8-8H4", // SVG icon path
  },
  {
    label: "Manage Categories",
    path: "/manage-categories",
    color: "from-green-500 to-green-700",
    hover: "hover:from-green-600 hover:to-green-800",
    icon: "M20 13V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6M4 13l8 8m0 0l8-8m-8 8V4",
  },
  {
    label: "Manage User-Category Relationships",
    path: "/manage-user-categories",
    color: "from-gray-500 to-gray-700",
    hover: "hover:from-gray-600 hover:to-gray-800",
    icon: "M5 13l4 4L19 7",
  },
  {
    label: "View Feedbacks",
    path: "/view-feedbacks",
    color: "from-yellow-500 to-yellow-700",
    hover: "hover:from-yellow-600 hover:to-yellow-800",
    icon: "M7 8h10M7 12h8m-5 4h6",
  },
  {
    label: "Manage Users",
    path: "/manage-users",
    color: "from-purple-500 to-purple-700",
    hover: "hover:from-purple-600 hover:to-purple-800",
    icon: "M17 20h5v-2a3 3 0 00-5-3m-6-7a4 4 0 110-8m5 14v-3m-10 3v-3",
  },
  {
    label: "View All Tenders",
    path: "/view-all-tenders",
    color: "from-teal-500 to-teal-700",
    hover: "hover:from-teal-600 hover:to-teal-800",
    icon: "M4 6h16M4 10h16M4 14h16M4 18h16",
  },
  {
    label: "Decide Winner",
    path: "/choice-dashboard",
    color: "from-red-500 to-red-700",
    hover: "hover:from-red-600 hover:to-red-800",
    icon: "M9 12l2 2 4-4m0 9a9 9 0 110-18 9 9 0 010 18z",
  },
  {
    label: "Create New Admin",
    path: "/create-admin",
    color: "from-indigo-500 to-indigo-700",
    hover: "hover:from-indigo-600 hover:to-indigo-800",
    icon: "M12 4v16m-4-4h8m-4-4h4m-4-4h2",
  },
];

const CityPage = memo(({ user }) => {
  const navigate = useNavigate(); // Hook for navigation between routes

  return (
    // Main container for the dashboard
    <div className="container mx-auto px-6 py-12 min-h-screen bg-gray-50">
      {/* Header section */}
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Welcome, {user.name}
        </h1>
        <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
          Manage the tenders from these actions
        </p>
      </header>

      {/* Grid layout for buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {BUTTON_CONFIG.map((button, index) => (
          <button
            key={index} // Unique key for each button
            onClick={() => navigate(button.path)} // Navigate to the corresponding route
            className={`relative flex items-center space-x-3 px-6 py-4 
              bg-gradient-to-r ${button.color} text-white font-medium rounded-xl 
              ${button.hover} focus:ring-4 focus:ring-opacity-50 
              transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg`}
          >
            {/* Icon for each button */}
            <svg
              className="w-6 h-6 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={button.icon}
              />
            </svg>
            <span className="text-center">{button.label}</span>
            {/* Hover overlay effect */}
            <span className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          </button>
        ))}
      </div>
    </div>
  );
});

// PropTypes for type-checking the user prop
CityPage.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired, // Name is required as a string
  }).isRequired,
};

// Component name for debugging
CityPage.displayName = "CityPage";

export default CityPage;
