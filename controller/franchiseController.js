// controller/franchiseController.js

const APIFeatures = require("../helper/apifeature");
const Franchise = require("../model/franchise");
const Location = require("../model/location");

// Create Franchise
exports.createFranchise = async (req, res) => {
  try {
    const { name, contactNumber, email, password } = req.body;
    const { address, city, state, pinCode } = req.body.location;
    const createdBy = req.account;

    // Create location
    const location = new Location({
      address,
      city,
      state,
      pinCode,
    });
    await location.save();
    console.log(location);
    const franchise = new Franchise({
      name,
      location: location._id,
      contactNumber,
      email,
      password,
      createdBy,
    });

    await franchise.save();

    res.status(201).json({
      success: true,
      message: "Franchise created successfully",
      data: franchise,
    });
  } catch (error) {
    console.error("Error creating franchise:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllFranchises = async (req, res) => {
  try {
    // Create a new APIFeatures instance
    const features = new APIFeatures(Franchise.find(), req.query)
      .search()
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Execute the query
    const franchises = await features.query.populate("location");

    // Get total count for pagination info
    const totalFranchises = await Franchise.countDocuments(
      features.query._conditions
    );

    res.status(200).json({
      success: true,
      results: franchises.length,
      totalFranchises,
      data: franchises,
      pagination: {
        currentPage: features.queryString.page * 1 || 1,
        limit: features.queryString.limit * 1 || 20,
        totalPages: Math.ceil(
          totalFranchises / (features.queryString.limit * 1 || 20)
        ),
      },
    });
  } catch (error) {
    console.error("Error fetching franchises:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get Franchise by ID
exports.getFranchiseById = async (req, res) => {
  try {
    const franchise = await Franchise.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );
    if (!franchise) {
      return res.status(404).json({ message: "Franchise not found" });
    }
    res.status(200).json({ success: true, data: franchise });
  } catch (error) {
    console.error("Error fetching franchise:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Franchise by ID
exports.updateFranchiseById = async (req, res) => {
  try {
    const { name, address, city, state, pinCode, contactNumber } = req.body;
    const franchise = await Franchise.findById(req.params.id);

    if (!franchise) {
      return res.status(404).json({ message: "Franchise not found" });
    }

    // Update location
    await Location.findByIdAndUpdate(franchise.location, {
      address,
      city,
      state,
      pinCode,
    });

    // Update franchise
    franchise.name = name;
    franchise.contactNumber = contactNumber;
    await franchise.save();

    res.status(200).json({
      success: true,
      message: "Franchise updated successfully",
      data: franchise,
    });
  } catch (error) {
    console.error("Error updating franchise:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Franchise by ID
exports.deleteFranchiseById = async (req, res) => {
  try {
    const franchise = await Franchise.findById(req.params.id);
    if (!franchise) {
      return res.status(404).json({ message: "Franchise not found" });
    }

    // Delete the associated location
    await Location.findByIdAndDelete(franchise.location);

    // Delete the franchise
    await Franchise.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({ success: true, message: "Franchise deleted successfully" });
  } catch (error) {
    console.error("Error deleting franchise:", error);
    res.status(500).json({ message: "Server error" });
  }
};
