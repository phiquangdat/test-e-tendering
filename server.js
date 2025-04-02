import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import User from "./models/user.js"; // Import User model
import Category from "./models/category.js"; // Import Category model
import Tender from "./models/tender.js"; // Import Tender model
import Bid from "./models/bid.js"; // Import Bid model
import UserType from "./models/userType.js"; // Import UserType model
import UserCategory from "./models/user_category.js"; // Import UserCategory model
import Feedback from "./models/feedback.js"; // Import Feedback model

/**
 * Initialize the Express application and define the server port
 */
const app = express();
const port = 5500;

/**
 * Apply middleware to handle CORS (Cross-Origin Resource Sharing) and JSON parsing
 */
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON bodies

/**
 * MongoDB connection string.
 * Replace with the appropriate URI for your MongoDB instance.
 */
const uri =
  "mongodb+srv://storeDataUser:g1MfHieubCImPSXV@cluster0.noqzo.mongodb.net/e-Tendering?retryWrites=true&w=majority";

/**
 * Connect to MongoDB using Mongoose.
 */
mongoose
  .connect(uri)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => {
    console.error("Failed to connect to MongoDB Atlas:", err.message);
    console.error(err.stack); // Optional: Log stack trace for debugging
  });

/**
 * Error logging middleware to handle unhandled errors in the application.
 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

/**
 * Endpoint to save a tender.
 * @route POST /save_tender
 * @param {Object} req - Request object containing tender details in the body.
 * @param {Object} res - Response object to send status and messages.
 */
app.post("/save_tender", (req, res) => {
  const tender = new Tender({ ...req.body, tender_id: "TND-" + Date.now() });
  tender
    .save()
    .then(() => res.json({ message: "Tender saved successfully" }))
    .catch((err) => {
      console.error("Error saving tender:", err);
      res.status(500).json({ error: "Error saving tender", details: err });
    });
});

/**
 * Endpoint to retrieve all tenders.
 * @route GET /find
 * @param {Object} req - Request object.
 * @param {Object} res - Response object containing the list of tenders.
 */
app.get("/find", async (req, res) => {
  try {
    const tenders = await Tender.find()
      .populate("bids") // Populate related bids
      .populate("winner", "name"); // Populate winner's name
    res.json(tenders);
  } catch (err) {
    console.error("Error fetching tenders:", err);
    res
      .status(500)
      .json({ error: "Error fetching tenders", details: err.message });
  }
});

/**
 * Endpoint to create a new user.
 * @route POST /create_user
 * @param {Object} req - Request object containing user details in the body.
 * @param {Object} res - Response object with status and messages.
 */
app.post("/create_user", async (req, res) => {
  try {
    const { name, address, user_type, password, email, categories } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }
    const user_id = "USR-" + Date.now();
    const user = new User({
      user_id,
      name,
      address,
      user_type,
      password,
      email,
      categories,
    });
    await user.save();
    res.json({ message: "User created successfully", user });
  } catch (err) {
    console.error("Error creating user:", err);
    res
      .status(500)
      .json({ error: "Error creating user", details: err.message });
  }
});

/**
 * Endpoint to retrieve all users.
 * @route GET /users
 * @param {Object} req - Request object.
 * @param {Object} res - Response object containing the list of users.
 */
app.get("/users", async (req, res) => {
  try {
    const users = await User.find()
      .populate("categories")
      .populate("user_type");
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res
      .status(500)
      .json({ error: "Error fetching users", details: err.message });
  }
});

/**
 * Endpoint to retrieve a user by their user_id.
 * @route GET /users/:user_id
 * @param {Object} req - Request object containing user_id in the parameters.
 * @param {Object} res - Response object containing the user data.
 */
app.get("/users/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const user = await User.findOne({ user_id })
      .populate("categories")
      .populate("user_type");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res
      .status(500)
      .json({ error: "Error fetching user", details: err.message });
  }
});

/**
 * Endpoint to retrieve all distinct user types.
 * @route GET /user_types
 * @param {Object} req - Request object.
 * @param {Object} res - Response object containing the list of user types.
 */
app.get("/user_types", async (req, res) => {
  try {
    const userTypes = await UserType.find();
    res.json(userTypes);
  } catch (err) {
    console.error("Error fetching user types:", err);
    res
      .status(500)
      .json({ error: "Error fetching user types", details: err.message });
  }
});

/**
 * Endpoint to create a new user type.
 * @route POST /create_user_type
 * @param {Object} req - Request object containing user type details in the body.
 * @param {Object} res - Response object with status and messages.
 */
app.post("/create_user_type", async (req, res) => {
  try {
    const { type_id, type_name } = req.body;
    const userType = new UserType({ type_id, type_name });
    await userType.save();
    res.json({ message: "User type created successfully", userType });
  } catch (err) {
    console.error("Error creating user type:", err);
    res
      .status(500)
      .json({ error: "Error creating user type", details: err.message });
  }
});

/**
 * Endpoint to delete a user by ID.
 * @route DELETE /delete_user/:user_id
 * @param {Object} req - Request object containing user_id in the parameters.
 * @param {Object} res - Response object with status and messages.
 */
app.delete("/delete_user/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    await User.findOneAndDelete({ user_id });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res
      .status(500)
      .json({ error: "Error deleting user", details: err.message });
  }
});

/**
 * Endpoint to delete a tender by ID.
 * @route DELETE /delete_tender/:tender_id
 * @param {Object} req - Request object containing tender_id in the parameters.
 * @param {Object} res - Response object with status and messages.
 */
app.delete("/delete_tender/:tender_id", async (req, res) => {
  try {
    const { tender_id } = req.params;
    await Tender.findOneAndDelete({ tender_id });
    res.json({ message: "Tender deleted successfully" });
  } catch (err) {
    console.error("Error deleting tender:", err);
    res
      .status(500)
      .json({ error: "Error deleting tender", details: err.message });
  }
});

/**
 * Endpoint to delete a bid by ID.
 * @route DELETE /delete_bid/:bid_id
 * @param {Object} req - Request object containing bid_id in the parameters.
 * @param {Object} res - Response object with status and messages.
 */
app.delete("/delete_bid/:bid_id", async (req, res) => {
  try {
    const { bid_id } = req.params;
    await Bid.findOneAndDelete({ bid_id });
    res.json({ message: "Bid deleted successfully" });
  } catch (err) {
    console.error("Error deleting bid:", err);
    res.status(500).json({ error: "Error deleting bid", details: err.message });
  }
});

/**
 * Endpoint to delete a category by ID.
 * @route DELETE /delete_category/:category_id
 * @param {Object} req - Request object containing category_id in the parameters.
 * @param {Object} res - Response object with status and messages.
 */
app.delete("/delete_category/:category_id", async (req, res) => {
  try {
    const { category_id } = req.params;
    console.log("Attempting to delete category with ID:", category_id); // Debugging log
    const deletedCategory = await Category.findOneAndDelete({ category_id });
    if (!deletedCategory) {
      console.error("Category not found:", category_id); // Debugging log
      return res.status(404).json({ error: "Category not found" });
    }
    console.log("Category deleted successfully:", deletedCategory); // Debugging log
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error("Error deleting category:", err);
    res
      .status(500)
      .json({ error: "Error deleting category", details: err.message });
  }
});

/**
 * Endpoint to create a bid.
 * @route POST /create_bid
 * @param {Object} req - Request object containing bid details in the body.
 * @param {Object} res - Response object with status and messages.
 */
app.post("/create_bid", async (req, res) => {
  try {
    const { amount, user_id, tender_id } = req.body;
    const user = await User.findOne({ user_id });
    const tender = await Tender.findOne({ tender_id });
    if (!user || !tender) {
      return res.status(400).json({ error: "Invalid user or tender ID" });
    }
    const bid_id = "BID-" + Date.now();
    const bid = new Bid({
      bid_id,
      amount,
      user: user._id,
      tender: tender._id,
    });
    await bid.save();
    res.json({ message: "Bid created successfully", bid });
  } catch (err) {
    console.error("Error creating bid:", err);
    res.status(500).json({ error: "Error creating bid", details: err.message });
  }
});

// Endpoint to get all bids
/**
 * Fetches all bids from the database, including populated user and tender data.
 * @route GET /bids
 * @param {Object} req - The request object.
 * @param {Object} res - The response object containing the bids.
 */
app.get("/bids", async (req, res) => {
  try {
    const bids = await Bid.find().populate("user").populate("tender");
    res.json(bids);
  } catch (err) {
    console.error("Error fetching bids:", err);
    res
      .status(500)
      .json({ error: "Error fetching bids", details: err.message });
  }
});

// Endpoint to check connection to collections
/**
 * Checks the connection to the database and counts documents in the User and Category collections.
 * @route GET /check_connection
 * @param {Object} req - The request object.
 * @param {Object} res - The response object containing the connection status and counts.
 */
app.get("/check_connection", async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const categoryCount = await Category.countDocuments();
    res.json({ message: "Connection successful", userCount, categoryCount });
  } catch (err) {
    console.error("Error checking connection:", err);
    res
      .status(500)
      .json({ error: "Error checking connection", details: err.message });
  }
});

// Endpoint to check all collections in the database and their document counts
/**
 * Endpoint to check all collections in the database and their document counts.
 * @route GET /check_all_collections
 * @param {Object} req - The request object.
 * @param {Object} res - The response object containing the collections and their counts.
 */
app.get("/check_all_collections", async (req, res) => {
  try {
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    const collectionCounts = {};

    for (const collection of collections) {
      const count = await mongoose.connection.db
        .collection(collection.name)
        .countDocuments();
      collectionCounts[collection.name] = count;
    }

    res.json({
      message: "Collections and their counts retrieved successfully",
      collectionCounts,
    });
  } catch (err) {
    console.error("Error checking collections:", err);
    res
      .status(500)
      .json({ error: "Error checking collections", details: err.message });
  }
});

// Endpoint to create collections
/**
 * Creates database collections for User, Category, Tender, Bid, and UserType models.
 * @route GET /create_collections
 * @param {Object} req - The request object.
 * @param {Object} res - The response object with the status of collection creation.
 */
app.get("/create_collections", async (req, res) => {
  try {
    await User.createCollection();
    await Category.createCollection();
    await Tender.createCollection();
    await Bid.createCollection();
    await UserType.createCollection();
    await UserCategory.createCollection(); // Assuming you have a UserCategory model
    res.json({ message: "Collections created successfully" });
  } catch (err) {
    console.error("Error creating collections:", err);
    res
      .status(500)
      .json({ error: "Error creating collections", details: err.message });
  }
});

// Endpoint to create a new category
/**
 * Creates a new category in the database.
 * @route POST /create_category
 * @param {Object} req - The request object containing category details in the body.
 * @param {Object} res - The response object containing the created category.
 */
app.post("/create_category", async (req, res) => {
  try {
    const { category_id, category_name } = req.body;
    const category = new Category({ category_id, category_name });
    await category.save();
    res.json({ message: "Category created successfully", category });
  } catch (err) {
    console.error("Error creating category:", err);
    res
      .status(500)
      .json({ error: "Error creating category", details: err.message });
  }
});

// Endpoint to get all categories
/**
 * Fetches all categories from the database, including associated users.
 * @route GET /categories
 * @param {Object} req - The request object.
 * @param {Object} res - The response object containing the categories.
 */
app.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find().populate("users");
    res.json(categories);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res
      .status(500)
      .json({ error: "Error fetching categories", details: err.message });
  }
});

// Endpoint to add a user to a category
/**
 * Adds a user to specific categories by their IDs.
 * @route POST /add_user_to_category
 * @param {Object} req - The request object containing user_id and categories array in the body.
 * @param {Object} res - The response object with the status of the addition.
 */
app.post("/add_user_to_category", async (req, res) => {
  try {
    const { user_id, categories } = req.body;
    if (!user_id || !categories || !Array.isArray(categories)) {
      return res
        .status(400)
        .json({ error: "User ID and categories array are required" });
    }

    const user = await User.findOne({ user_id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    for (const category_id of categories) {
      const category = await Category.findOne({ category_id });
      if (!category) {
        return res
          .status(404)
          .json({ error: `Category with ID ${category_id} not found` });
      }
      if (!user.categories.includes(category._id)) {
        user.categories.push(category._id);
      }
      if (!category.users.includes(user._id)) {
        category.users.push(user._id);
      }
      await category.save();
    }

    await user.save();
    res.json({ message: "User added to categories successfully" });
  } catch (err) {
    console.error("Error adding user to categories:", err);
    res
      .status(500)
      .json({ error: "Error adding user to categories", details: err.message });
  }
});

// Endpoint to add a user to a specific category
/**
 * Adds a user to a specific category by their IDs.
 * @route POST /add_user_to_specific_category
 * @param {Object} req - The request object containing user_id and category_id in the body.
 * @param {Object} res - The response object with the status of the addition.
 */
app.post("/add_user_to_specific_category", async (req, res) => {
  try {
    const { user_id, category_id } = req.body;
    if (!user_id || !category_id) {
      return res
        .status(400)
        .json({ error: "User ID and Category ID are required" });
    }

    const user = await User.findOne({ user_id });
    const category = await Category.findOne({ category_id });

    if (!user || !category) {
      return res.status(400).json({ error: "Invalid user or category ID" });
    }

    // Save the relationship in the UserCategory collection
    const userCategory = new UserCategory({
      user_id: user._id,
      category_id: category._id,
    });
    await userCategory.save();

    // Update the user's categories field
    if (!user.categories.includes(category._id)) {
      user.categories.push(category._id);
      await user.save();
    }

    console.log("UserCategory relationship saved:", userCategory); // Add logging for debugging

    res.json({ message: "User added to category successfully", userCategory });
  } catch (err) {
    console.error("Error adding user to category:", err);
    res
      .status(500)
      .json({ error: "Error adding user to category", details: err.message });
  }
});

// Endpoint to remove a user from a category
/**
 * Removes a user from a specific category by their IDs.
 * @route POST /remove_user_from_category
 * @param {Object} req - The request object containing user_id and category_id in the body.
 * @param {Object} res - The response object with the status of the removal.
 */
app.post("/remove_user_from_category", async (req, res) => {
  try {
    const { user_id, category_id } = req.body;
    if (!user_id || !category_id) {
      return res
        .status(400)
        .json({ error: "User ID and Category ID are required" });
    }
    const user = await User.findOne({ user_id });
    const category = await Category.findOne({ category_id });
    if (!user || !category) {
      return res.status(400).json({ error: "Invalid user or category ID" });
    }
    user.categories.pull(category._id);
    category.users.pull(user._id);
    await user.save();
    await category.save();

    res.json({ message: "User removed from category successfully" });
  } catch (err) {
    console.error("Error removing user from category:", err);
    res
      .status(500)
      .json({
        error: "Error removing user from category",
        details: err.message,
      });
  }
});

// Endpoint to update tender
/**
 * Updates an existing tender by its ID.
 * @route PUT /update_tender/:tender_id
 * @param {Object} req - The request object containing updated tender data.
 * @param {Object} res - The response object with the updated tender.
 */

app.put("/update_tender/:tender_id", async (req, res) => {
  try {
    const { tender_id } = req.params;
    const updatedTender = await Tender.findOneAndUpdate(
      { tender_id },
      req.body,
      { new: true }
    );
    if (!updatedTender) {
      return res.status(404).json({ error: "Tender not found" });
    }
    res.json({ message: "Tender updated successfully", updatedTender });
  } catch (err) {
    console.error("Error updating tender:", err);
    res
      .status(500)
      .json({ error: "Error updating tender", details: err.message });
  }
});
// Endpoint to update user
/**
 * Updates an existing user by their ID.
 * @route PUT /update_user/:user_id
 * @param {Object} req - The request object containing updated user data.
 * @param {Object} res - The response object with the updated user.
 */
app.put("/update_user/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const updatedUser = await User.findOneAndUpdate({ user_id }, req.body, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User updated successfully", updatedUser });
  } catch (err) {
    console.error("Error updating user:", err);
    res
      .status(500)
      .json({ error: "Error updating user", details: err.message });
  }
});

// Endpoint to update bid
/**
 * Updates an existing bid by its ID.
 * @route PUT /update_bid/:bid_id
 * @param {Object} req - The request object containing updated bid data.
 * @param {Object} res - The response object with the updated bid.
 */
app.put("/update_bid/:bid_id", async (req, res) => {
  try {
    const { bid_id } = req.params;
    const updatedBid = await Bid.findOneAndUpdate({ bid_id }, req.body, {
      new: true,
    });
    if (!updatedBid) {
      return res.status(404).json({ error: "Bid not found" });
    }
    res.json({ message: "Bid updated successfully", updatedBid });
  } catch (err) {
    console.error("Error updating bid:", err);
    res.status(500).json({ error: "Error updating bid", details: err.message });
  }
});

/**
 * Endpoint to retrieve all user-category relationships.
 * @route GET /users_categories
 * @param {Object} req - Request object.
 * @param {Object} res - Response object containing the user-category relationships.
 */
app.get("/users_categories", async (req, res) => {
  try {
    const usersCategories = await UserCategory.find()
      .populate("user_id", "user_id name") // Populate user details
      .populate("category_id", "category_id category_name"); // Populate category details
    res.json(usersCategories);
  } catch (err) {
    console.error("Error fetching user-category relationships:", err);
    res
      .status(500)
      .json({
        error: "Error fetching user-category relationships",
        details: err.message,
      });
  }
});

// Endpoint to fetch feedback
/**
 * Fetches feedback for a specific user or all feedbacks if no user_id is provided.
 * @route GET /feedback
 * @param {Object} req - The request object containing user_id in the query.
 * @param {Object} res - The response object containing the feedback.
 */
app.get("/feedback", async (req, res) => {
  try {
    const { user_id } = req.query;
    const feedback = user_id
      ? await Feedback.find({ user_id })
      : await Feedback.find();
    res.json(feedback);
  } catch (err) {
    console.error("Error fetching feedback:", err);
    res
      .status(500)
      .json({ error: "Error fetching feedback", details: err.message });
  }
});

// Endpoint to submit feedback
/**
 * Submits feedback for a specific user and tender.
 * @route POST /submit_feedback
 * @param {Object} req - The request object containing user_id, tender_id, and feedback in the body.
 * @param {Object} res - The response object with the status of the submission.
 */
app.post("/submit_feedback", async (req, res) => {
  try {
    const { user_id, tender_id, feedback } = req.body;

    // Validate required fields
    if (!user_id || !feedback) {
      return res
        .status(400)
        .json({ error: "User ID and feedback are required." });
    }

    // Log the request body for debugging
    console.log("Submitting feedback:", { user_id, tender_id, feedback });

    // Create and save the feedback
    const newFeedback = new Feedback({ user_id, tender_id, message: feedback });
    await newFeedback.save();

    res.json({ message: "Feedback submitted successfully" });
  } catch (err) {
    console.error("Error submitting feedback:", err);
    res
      .status(500)
      .json({ error: "Error submitting feedback", details: err.message });
  }
});

// Start the server
/**
 * Starts the Express server on the specified port.
 */
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
