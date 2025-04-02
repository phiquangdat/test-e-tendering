import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ManageUserCategories() {
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedUserAdd, setSelectedUserAdd] = useState("");
  const [selectedCategoryAdd, setSelectedCategoryAdd] = useState("");
  const [selectedUserRemove, setSelectedUserRemove] = useState("");
  const [selectedCategoryRemove, setSelectedCategoryRemove] = useState("");
  const [validSelectionAdd, setValidSelectionAdd] = useState(true);
  const [validSelectionRemove, setValidSelectionRemove] = useState(true);
  const [errorMessageAdd, setErrorMessageAdd] = useState("");
  const [errorMessageRemove, setErrorMessageRemove] = useState("");
  const [successMessageAdd, setSuccessMessageAdd] = useState("");
  const [successMessageRemove, setSuccessMessageRemove] = useState(""); // Added
  const [loading, setLoading] = useState(true);
  const [loadingAdd, setLoadingAdd] = useState(false); // Added
  const [loadingRemove, setLoadingRemove] = useState(false); // Added
  const [error, setError] = useState(null);

  const API_URL = "http://localhost:5500"; 

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersResponse, categoriesResponse] = await Promise.all([
        axios.get(`${API_URL}/users`),
        axios.get(`${API_URL}/categories`),
      ]);
      setUsers(usersResponse.data);
      setCategories(categoriesResponse.data);
      setError(null);
    } catch (error) {
      setError("Failed to load users and categories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddUserToCategory = async (e) => {
    e.preventDefault();
    if (!selectedUserAdd || !selectedCategoryAdd) {
      setValidSelectionAdd(false);
      setErrorMessageAdd("Please select both a user and a category.");
      setSuccessMessageAdd("");
      return;
    }

    setLoadingAdd(true); // Disable button
    try {
      const payload = {
        user_id: selectedUserAdd,
        category_id: selectedCategoryAdd,
      };
      const response = await axios.post(
        `${API_URL}/add_user_to_specific_category`,
        payload
      );
      setSuccessMessageAdd(
        response.data.message || "User added to category successfully!"
      );
      setErrorMessageAdd("");
      setValidSelectionAdd(true);
      await fetchData();
      setSelectedUserAdd("");
      setSelectedCategoryAdd("");
    } catch (error) {
      setErrorMessageAdd(
        error.response?.data?.message ||
          "Failed to add user to category. Please try again."
      );
      setSuccessMessageAdd("");
      setValidSelectionAdd(false);
    } finally {
      setLoadingAdd(false);
    }
  };

  const handleRemoveUserFromCategory = async (e) => {
    e.preventDefault();
    if (!selectedUserRemove || !selectedCategoryRemove) {
      setValidSelectionRemove(false);
      setErrorMessageRemove("Please select both a user and a category.");
      setSuccessMessageRemove(""); // Clear success
      return;
    }

    setLoadingRemove(true); // Disable button
    try {
      const response = await axios.post(
        `${API_URL}/remove_user_from_category`,
        {
          user_id: selectedUserRemove,
          category_id: selectedCategoryRemove,
        }
      );
      setSuccessMessageRemove(
        response.data.message || "User removed from category successfully!"
      );
      setErrorMessageRemove(""); // Clear error on success
      await fetchData();
      setSelectedUserRemove("");
      setSelectedCategoryRemove("");
      setValidSelectionRemove(true);
    } catch (error) {
      setErrorMessageRemove(
        error.response?.data?.message ||
          "Failed to remove user from category. Please try again."
      );
      setSuccessMessageRemove("");
    } finally {
      setLoadingRemove(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <div
          className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"
          role="status"
          aria-label="Loading data"
        ></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2"
        role="alert"
      >
        <svg
          className="h-5 w-5 text-red-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  const userCategoryRelationships = users
    .filter((user) => Array.isArray(user.categories)) // Remove >= 2 if all relationships are needed
    .flatMap((user) =>
      user.categories.map((categoryId) => ({
        user_id: user.user_id,
        user_name: user.name,
        category_id:
          typeof categoryId === "string"
            ? categoryId
            : categoryId?.category_id || "unknown",
        category_name:
          categories.find(
            (c) =>
              c.category_id ===
              (typeof categoryId === "string"
                ? categoryId
                : categoryId?.category_id)
          )?.category_name || "Unknown Category",
      }))
    );

  return (
    <div className="container mx-auto px-6 py-8 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Manage User-Category Relationships
        </h2>

        {/* Add User to Category Form */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Add User to Category
          </h3>
          <form onSubmit={handleAddUserToCategory} className="flex gap-4">
            <select
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={selectedUserAdd}
              onChange={(e) => {
                setSelectedUserAdd(e.target.value);
                setValidSelectionAdd(true);
                setErrorMessageAdd("");
                setSuccessMessageAdd("");
              }}
              required
              aria-label="Select User to Add"
              disabled={loadingAdd}
            >
              <option value="" disabled>
                Select User to Add
              </option>
              {users.map((user) => (
                <option key={user.user_id} value={user.user_id}>
                  {user.name}
                </option>
              ))}
            </select>
            <select
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={selectedCategoryAdd}
              onChange={(e) => {
                setSelectedCategoryAdd(e.target.value);
                setValidSelectionAdd(true);
                setErrorMessageAdd("");
                setSuccessMessageAdd("");
              }}
              required
              aria-label="Select Category to Add"
              disabled={loadingAdd}
            >
              <option value="" disabled>
                Select Category to Add
              </option>
              {categories.map((category) => (
                <option key={category.category_id} value={category.category_id}>
                  {category.category_name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition duration-200 disabled:bg-gray-400"
              disabled={loadingAdd}
            >
              {loadingAdd ? "Adding..." : "Add"}
            </button>
          </form>
          {!validSelectionAdd && (
            <div className="text-red-500 text-sm mt-2" role="alert">
              {errorMessageAdd}
            </div>
          )}
          {successMessageAdd && (
            <div className="text-green-500 text-sm mt-2" role="alert">
              {successMessageAdd}
            </div>
          )}
        </div>

        {/* Remove User from Category Form */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Remove User from Category
          </h3>
          <form onSubmit={handleRemoveUserFromCategory} className="flex gap-4">
            <select
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={selectedUserRemove}
              onChange={(e) => {
                setSelectedUserRemove(e.target.value);
                setValidSelectionRemove(true);
                setErrorMessageRemove("");
                setSuccessMessageRemove("");
              }}
              required
              aria-label="Select User to Remove"
              disabled={loadingRemove}
            >
              <option value="" disabled>
                Select User to Remove
              </option>
              {users.map((user) => (
                <option key={user.user_id} value={user.user_id}>
                  {user.name}
                </option>
              ))}
            </select>
            <select
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={selectedCategoryRemove}
              onChange={(e) => {
                setSelectedCategoryRemove(e.target.value);
                setValidSelectionRemove(true);
                setErrorMessageRemove("");
                setSuccessMessageRemove("");
              }}
              required
              aria-label="Select Category to Remove"
              disabled={loadingRemove}
            >
              <option value="" disabled>
                Select Category to Remove
              </option>
              {categories.map((category) => (
                <option key={category.category_id} value={category.category_id}>
                  {category.category_name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-300 transition duration-200 disabled:bg-gray-400"
              disabled={loadingRemove}
            >
              {loadingRemove ? "Removing..." : "Remove"}
            </button>
          </form>
          {!validSelectionRemove && (
            <div className="text-red-500 text-sm mt-2" role="alert">
              {errorMessageRemove}
            </div>
          )}
          {successMessageRemove && (
            <div className="text-green-500 text-sm mt-2" role="alert">
              {successMessageRemove}
            </div>
          )}
        </div>

        <h3 className="text-lg font-semibold text-gray-700 mt-6">
          User-Category Relationships
        </h3>
        {userCategoryRelationships.length === 0 ? (
          <div className="text-center py-6">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197"
              />
            </svg>
            <p className="mt-2 text-gray-600">
              No user-category relationships found.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg" role="table">
              <thead className="bg-gray-100 text-gray-700">
                <tr role="row">
                  <th className="px-6 py-3 text-left" role="columnheader">
                    User Name
                  </th>
                  <th className="px-6 py-3 text-left" role="columnheader">
                    Category Name
                  </th>
                </tr>
              </thead>
              <tbody role="rowgroup">
                {userCategoryRelationships.map((relationship) => (
                  <tr
                    key={`${relationship.user_id}-${relationship.category_id}`}
                    className="border-b border-gray-200 hover:bg-gray-50"
                    role="row"
                  >
                    <td className="px-6 py-4" role="cell">
                      {relationship.user_name}
                    </td>
                    <td className="px-6 py-4" role="cell">
                      {relationship.category_name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
