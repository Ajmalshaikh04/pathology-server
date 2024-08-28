const HealthProblem = require("../model/HealthProblem");

// Create a new health problem
const createHealthProblem = async (req, res) => {
  try {
    const { name, image } = req.body;

    // Create a new instance of the HealthProblem model
    const newHealthProblem = new HealthProblem({ name, image });

    // Save the new health problem to the database
    const savedHealthProblem = await newHealthProblem.save();

    res.status(201).json(savedHealthProblem);
  } catch (error) {
    res.status(500).json({ message: "Error creating health problem", error });
  }
};

// Get all health problems with pagination
const getAllHealthProblems = async (req, res) => {
  // Extract page and limit from query parameters, with default values
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 24;

  try {
    const healthProblems = await HealthProblem.find()
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const totalCount = await HealthProblem.countDocuments();
    res.status(200).json({ healthProblems, totalCount });
  } catch (error) {
    res.status(500).json({ message: "Error fetching health problems", error });
  }
};

// Get a health problem by ID
const getHealthProblemById = async (req, res) => {
  try {
    const { id } = req.params;
    const healthProblem = await HealthProblem.findById(id);

    if (!healthProblem) {
      return res.status(404).json({ message: "Health problem not found" });
    }

    res.status(200).json(healthProblem);
  } catch (error) {
    res.status(500).json({ message: "Error fetching health problem", error });
  }
};

// Update a health problem
const updateHealthProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image } = req.body;

    const updatedHealthProblem = await HealthProblem.findByIdAndUpdate(
      id,
      { name, image },
      { new: true, runValidators: true }
    );

    if (!updatedHealthProblem) {
      return res.status(404).json({ message: "Health problem not found" });
    }

    res.status(200).json(updatedHealthProblem);
  } catch (error) {
    res.status(500).json({ message: "Error updating health problem", error });
  }
};

// Delete a health problem
const deleteHealthProblem = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedHealthProblem = await HealthProblem.findByIdAndDelete(id);

    if (!deletedHealthProblem) {
      return res.status(404).json({ message: "Health problem not found" });
    }

    res.status(200).json({ message: "Health problem deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting health problem", error });
  }
};

module.exports = {
  createHealthProblem,
  getAllHealthProblems,
  getHealthProblemById,
  updateHealthProblem,
  deleteHealthProblem,
};
