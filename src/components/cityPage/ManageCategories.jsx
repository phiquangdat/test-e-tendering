/**
 * ManageCategories Component
 * Provides a user interface to manage categories, including creating and deleting categories.
 * Utilizes Axios for API requests to interact with the backend server.
 */

import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ManageCategories() {
  // State to store the list of categories
  const [categories, setCategories] = useState([]);

  // State to track the input for creating a new category
  const [newCategory, setNewCategory] = useState({ category_name: "" });

  // State to handle error messages
  const [error, setError] = useState(null);

  // Base URL for API interactions
  const API_URL = "http://localhost:5500";

  // Fetch categories when the component mounts
  useEffect(() => {
    fetchCategories();
  }, []);

  /**
   * Fetches the list of categories from the server.
   */
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      setCategories(response.data); // Populate categories state
    } catch (error) {
      console.error("Error fetching categories:", error); // Log the error
    }
  };

  /**
   * Updates the new category state based on user input.
   * @param {Object} e - The event object from the input field.
   */
  const handleInputChange = (e) => {
    setNewCategory({ category_name: e.target.value });
  };

  /**
   * Handles the submission of the form to create a new category.
   * Sends a POST request to the server and refreshes the categories list.
   * @param {Object} e - The event object from the form submission.
   */
  const handleAddCategory = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      setError(null); // Clear any existing errors
      const categoryData = {
        category_id: "CAT-" + Date.now(), // Generate a unique category ID
        category_name: newCategory.category_name,
      };
      await axios.post(`${API_URL}/create_category`, categoryData); // API call to create category
      setNewCategory({ category_name: "" }); // Reset input field
      fetchCategories(); // Refresh the categories list
    } catch (error) {
      console.error("Error adding category:", error); // Log the error
      setError("Failed to add category. Please try again."); // Set error message
    }
  };

  /**
   * Handles the deletion of a category by its ID.
   * Sends a DELETE request to the server and updates the local categories state.
   * @param {string} categoryId - The ID of the category to delete.
   */
  const handleDeleteCategory = async (categoryId) => {
    try {
      await axios.delete(`${API_URL}/delete_category/${categoryId}`); // API call to delete category
      console.log(`Deleted ${categoryId} successfully`);
      setCategories((prev) =>
        prev.filter((category) => category.category_id !== categoryId)
      ); // Remove deleted category from state
    } catch (error) {
      console.error(
        "Error deleting category:",
        error.response?.data || error.message // Log detailed error
      );
    }
  };

  return (
    // Main container for the ManageCategories component
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Page title */}
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Manage Categories
      </h2>

      {/* Display error message, if any */}
      {error && (
        <p className="text-red-500 text-sm bg-red-100 p-2 rounded mb-4">
          {error}
        </p>
      )}

      {/* Add Category Form */}
      <form onSubmit={handleAddCategory} className="mb-6 flex gap-4">
        <input
          type="text"
          name="category_name"
          value={newCategory.category_name}
          onChange={handleInputChange}
          placeholder="Enter category name"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Add Category
        </button>
      </form>

      {/* Categories Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 shadow-md rounded-lg">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Category ID</th>
              <th className="px-4 py-2 text-left">Category Name</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              // Render each category as a table row
              <tr
                key={category.category_id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="px-4 py-2">{category.category_id}</td>
                <td className="px-4 py-2">{category.category_name}</td>
                <td className="px-4 py-2 flex gap-2">
                  {/* Delete Category Button */}
                  <button
                    onClick={() => handleDeleteCategory(category.category_id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
