const DiagnosticTest = require("../model/diagnosticTest");
const DiagnosticLab = require("../model/diagnosticLabs");
const APIFeatures = require("../helper/apifeature");

const createDiagnosticLab = async (req, res) => {
  const { name, address, contactNumber, testsOffered } = req.body;

  try {
    const newLab = new DiagnosticLab({
      name,
      address,
      contactNumber,
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
      .filter()
      .sort()
      .limitFields();

    // Apply pagination after other operations
    const paginatedFeatures = features.paginate();

    // Execute the query with population
    const labs = await paginatedFeatures.query.populate({
      path: "testsOffered",
      select: "name price",
    });

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
  const { name, address, contactNumber, testsOffered } = req.body;

  try {
    const updatedLab = await DiagnosticLab.findByIdAndUpdate(
      id,
      {
        name,
        address,
        contactNumber,
        testsOffered,
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

const createDiagnosticTest = async (req, res) => {
  const { name, description, price, diagnosticLabId } = req.body;

  try {
    // Create a new diagnostic test
    const newTest = new DiagnosticTest({
      name,
      description,
      price,
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

module.exports = {
  getAllDiagnosticLabs,
  getDiagnosticLabById,
  createDiagnosticLab,
  updateDiagnosticLabById,
  createDiagnosticTest,
};
