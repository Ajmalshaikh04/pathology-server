const DiagnosticTest = require("../model/diagnosticTest");
const DiagnosticLab = require("../model/diagnosticLabs");

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
    const labs = await DiagnosticLab.find({})
      .populate({
        path: "testsOffered",
        select: "name price",
      })
      .exec();
    return res.status(201).json({
      success: true,
      message: "list of all labs",
      data: labs,
    });
  } catch (error) {
    console.error("Error fetching diagnostic labs", error);
    res.status(500).json({ message: "Server error" });
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
  const { name, description, price } = req.body;

  try {
    const newTest = new DiagnosticTest({
      name,
      description,
      price,
    });

    const savedTest = await newTest.save();
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
