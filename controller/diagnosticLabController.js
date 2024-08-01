const DiagnosticTest = require("../model/diagnosticTest");
const DiagnosticLab = require("../model/diagnosticLabs");
const Location = require("../model/location");
const APIFeatures = require("../helper/apifeature");

const createDiagnosticLab = async (req, res) => {
  const { name, address, contactNumber, image } = req.body;

  try {
    const newLocation = new Location({
      address: address.address,
      city: address.city,
      state: address.state,
      pinCode: address.pinCode,
    });

    const savedLocation = await newLocation.save();

    const newLab = new DiagnosticLab({
      name,
      address: savedLocation._id,
      contactNumber,
      image,
    });

    const savedLab = await newLab.save();
    res.status(201).json({
      success: true,
      message: "Diagnostic lab created successfully",
      data: savedLab,
    });
  } catch (error) {
    console.error("Error creating diagnostic lab", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllDiagnosticLabs = async (req, res) => {
  try {
    // Create a new instance of APIFeatures
    const features = new APIFeatures(DiagnosticLab.find(), req.query)
      .search()
      .filter();
    // .sort()
    // .limitFields();
    console.log(req.query);
    // Apply pagination after other operations
    const paginatedFeatures = features.paginate();

    // Execute the query with population
    const labs = await paginatedFeatures.query
      .populate("testsOffered")
      .populate("address");

    // Get total count for pagination info
    const totalLabs = await DiagnosticLab.countDocuments(
      features.query._conditions
    );

    res.status(200).json({
      success: true,
      message: "List of all labs",
      results: labs.length,
      totalLabs,
      data: labs,
      pagination: {
        currentPage: paginatedFeatures.queryString.page * 1 || 1,
        limit: paginatedFeatures.queryString.limit * 1 || 20,
        totalPages: Math.ceil(
          totalLabs / (paginatedFeatures.queryString.limit * 1 || 20)
        ),
      },
    });
  } catch (error) {
    console.error("Error fetching diagnostic labs:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getDiagnosticLabById = async (req, res) => {
  const { id } = req.params;
  try {
    const lab = await DiagnosticLab.findById(id).populate("testsOffered");
    if (!lab) {
      return res.status(404).json({ message: "Diagnostic lab not found" });
    }
    res.json(lab);
  } catch (error) {
    console.error("Error fetching diagnostic lab", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateDiagnosticLabById = async (req, res) => {
  const { id } = req.params;
  const { name, address, contactNumber, image } = req.body;

  try {
    const updatedLab = await DiagnosticLab.findByIdAndUpdate(
      id,
      {
        name,
        address,
        contactNumber,
        image,
      },
      { new: true }
    );

    if (!updatedLab) {
      return res.status(404).json({ message: "Diagnostic lab not found" });
    }

    res.status(200).json({
      success: true,
      message: "Diagnostic lab updated successfully",
      data: updatedLab,
    });
  } catch (error) {
    console.error("Error updating diagnostic lab", error);
    res.status(500).json({ message: "Server error" });
  }
};
const deleteDiagnosticLabById = async (req, res) => {
  const { id } = req.params;
  console.log("Lab ID", id);

  try {
    // Find the lab first to get the location ID
    const lab = await DiagnosticLab.findById(id);

    if (!lab) {
      return res.status(404).json({ message: "Diagnostic lab not found" });
    }

    // Delete the associated location
    if (lab.address) {
      await Location.findByIdAndDelete(lab.address);
    }

    // Now delete the lab
    const deletedLab = await DiagnosticLab.findByIdAndDelete(id);
    console.log("Deleted Lab", deletedLab);

    res.status(200).json({
      success: true,
      message: "Diagnostic lab and associated location deleted successfully",
      data: deletedLab,
    });
  } catch (error) {
    console.error("Error deleting diagnostic lab", error);
    res.status(500).json({ message: "Server error" });
  }
};

const createDiagnosticTest = async (req, res) => {
  const { name, description, price, image, diagnosticLabId } = req.body;

  try {
    // Create a new diagnostic test
    const newTest = new DiagnosticTest({
      name,
      description,
      price,
      image,
    });

    const savedTest = await newTest.save();

    // Find the diagnostic lab by ID and update its testsOffered
    const lab = await DiagnosticLab.findById(diagnosticLabId);
    if (!lab) {
      return res.status(404).json({ message: "Diagnostic lab not found" });
    }

    lab.testsOffered.push(savedTest._id);
    await lab.save();

    res.status(201).json({
      success: true,
      message: "Diagnostic test created successfully",
      data: savedTest,
    });
  } catch (error) {
    console.error("Error creating diagnostic test", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteDiagnosticTestById = async (req, res) => {
  const { id } = req.params;

  try {
    const test = await DiagnosticTest.findByIdAndDelete(id);

    if (!test) {
      return res.status(404).json({ message: "Diagnostic test not found" });
    }

    // Find the diagnostic lab and remove the test from its testsOffered
    const lab = await DiagnosticLab.findOne({ testsOffered: id });
    if (lab) {
      lab.testsOffered.pull(id);
      await lab.save();
    }

    res.status(200).json({
      success: true,
      message: "Diagnostic test deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting diagnostic test", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateDiagnosticTestById = async (req, res) => {
  const { name, description, price, image, id } = req.body;

  try {
    const updatedTest = await DiagnosticTest.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        image,
      },
      { new: true }
    );

    if (!updatedTest) {
      return res.status(404).json({ message: "Diagnostic test not found" });
    }

    res.status(200).json({
      success: true,
      message: "Diagnostic test updated successfully",
      data: updatedTest,
    });
  } catch (error) {
    console.error("Error updating diagnostic test", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllDiagnosticLabs,
  getDiagnosticLabById,
  createDiagnosticLab,
  updateDiagnosticLabById,
  createDiagnosticTest,
  deleteDiagnosticTestById,
  updateDiagnosticTestById,
  deleteDiagnosticLabById,
};
