import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

export default function CreateAdmin({}) {
  const API_URL = "http://localhost:5500";
  const navigate = useNavigate();
  const [newUser, setNewUser] = useState({
    name: "",
    address: "",
    password: "",
    email: "",
    user_type: "City", // Always set user_type to "City"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
    setError(null); // Clear error on change
    setSuccess(""); // Clear success on change
  };

  const validateForm = () => {
    if (newUser.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess("");
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const payload = { ...newUser };
      console.log("Creating City User with payload:", payload); // Debug log

      const response = await axios.post(`${API_URL}/create_user`, payload);
      console.log("Create user response:", response.data); // Debug log

      setSuccess("City User created successfully!");
      setNewUser({
        name: "",
        address: "",
        password: "",
        email: "",
        user_type: "City",
      });
    } catch (error) {
      console.error("Error creating City User:", error);
      setError(error.response?.data?.message || "Failed to create City User");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-md p-6 max-w-md mx-auto">
        <h3 className="text-2xl font-semibold text-gray-900 mb-6">
          Create City User
        </h3>

        {error && (
          <div
            className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 mb-4"
            role="alert"
          >
            <svg
              className="h-5 w-5 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div
            className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 mb-4"
            role="status"
          >
            <svg
              className="h-5 w-5 text-green-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-green-600">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={newUser.name}
              onChange={handleInputChange}
              placeholder="Enter full name"
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              aria-label="City User Name"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={newUser.email}
              onChange={handleInputChange}
              placeholder="Enter email"
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              aria-label="City User Email"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={newUser.password}
              onChange={handleInputChange}
              placeholder="Enter password"
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              aria-label="City User Password"
            />
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Address
            </label>
            <input
              id="address"
              type="text"
              name="address"
              value={newUser.address}
              onChange={handleInputChange}
              placeholder="Enter address"
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              aria-label="City User Address"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg transition duration-200 ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
              }`}
            >
              {loading ? "Creating..." : "Create User"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 transition duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
