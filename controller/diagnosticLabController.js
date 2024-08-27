const DiagnosticTest = require("../model/diagnosticTest");
const DiagnosticLab = require("../model/diagnosticLabs");
const Location = require("../model/location");
const APIFeatures = require("../helper/apifeature");
const bcrypt = require("bcrypt");
const LabBoy = require("../model/labBoy");
const Appointment = require("../model/appointment");

const createDiagnosticLab = async (req, res) => {
  const { name, email, address, contactNumber, image, profileImg, password } =
    req.body;
  console.log(password);
  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newLocation = new Location({
      address: address.address,
      city: address.city,
      state: address.state,
      pinCode: address.pinCode,
    });

    const savedLocation = await newLocation.save();

    const newLab = new DiagnosticLab({
      name,
      email,
      address: savedLocation._id,
      contactNumber,
      image,
      profileImg,
      password: hashedPassword, // Save the hashed password
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    console.log("Backend received:", { page, limit, skip });
    const totalLabs = await DiagnosticLab.countDocuments();
    const labs = await DiagnosticLab.find()
      .select("-password")
      .populate({
        path: "testsOffered",
        populate: {
          path: "labCategory",
          model: "LabCategories",
        },
      })
      .populate("address")
      .skip(skip)
      .limit(limit)
      .exec();

    console.log("Backend sending:", {
      labsCount: labs.length,
      totalLabs,
      pagination: {
        currentPage: page,
        limit: limit,
        totalPages: Math.ceil(totalLabs / limit),
      },
    });
    res.status(200).json({
      success: true,
      message: "List of all labs",
      data: labs,
      totalLabs,
      pagination: {
        currentPage: page,
        limit: limit,
        totalPages: Math.ceil(totalLabs / limit),
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
  const { name, email, address, contactNumber, image, profileImg, password } =
    req.body;
  // Debug: Log the entire request body
  console.log("Request Body:", req.body);
  try {
    // Create an update object
    let updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (contactNumber) updateData.contactNumber = contactNumber;
    if (image) updateData.image = image;
    if (profileImg) updateData.profileImg = profileImg;

    // Hash the password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }
    console.log(updateData);

    // Update address if provided
    if (address) {
      const location = await Location.findById(address._id);
      if (location) {
        location.address = address.address || location.address;
        location.city = address.city || location.city;
        location.state = address.state || location.state;
        location.pinCode = address.pinCode || location.pinCode;
        await location.save();
        updateData.address = location._id;
      }
    }

    // Find and update the diagnostic lab
    const updatedLab = await DiagnosticLab.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
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
  const { description, price, labCategory, diagnosticLabId } = req.body;

  try {
    // Create a new diagnostic test
    const newTest = new DiagnosticTest({
      description,
      price,
      labCategory,
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
    console.error("Error creating diagnostic test:", error);
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
    console.error("Error deleting diagnostic test:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateDiagnosticTestById = async (req, res) => {
  const { description, labCategory, price, id } = req.body;

  try {
    const updatedTest = await DiagnosticTest.findByIdAndUpdate(
      id,
      {
        labCategory,
        description,
        price,
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
    console.error("Error updating diagnostic test:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const toggleHandleView = async (req, res) => {
  try {
    const labId = req.params.labId;

    // Find the lab by ID
    const lab = await DiagnosticLab.findById(labId);
    if (!lab) {
      return res.status(404).json({ message: "Diagnostic lab not found" });
    }

    // Toggle the handleView status
    lab.handleView = !lab.handleView;
    await lab.save();

    return res.status(200).json({
      message: "handleView status updated successfully",
      handleView: lab.handleView,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const getHandleViewTrueLabs = async (req, res) => {
  try {
    const labs = await DiagnosticLab.find({ handleView: true })
      .select("-password")
      .populate({
        path: "testsOffered",
        populate: {
          path: "labCategory",
          model: "LabCategories",
        },
      })
      .populate("address");

    if (labs.length === 0) {
      return res
        .status(404)
        .json({ message: "No labs found with handleView true" });
    }

    res.status(200).json(labs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getLabBoyByLabId = async (req, res) => {
  try {
    const { labId } = req.params;
    const labBoy = await LabBoy.find({ assignedLab: labId });
    res.status(200).json(labBoy);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const assignLabBoy = async (req, res) => {
  try {
    const { labBoyId, appointmentId } = req.body;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    appointment.labBoy = labBoyId;

    await appointment.save();

    res.status(200).json({
      message: "Lab boy assigned to appointment successfully.",
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
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
  toggleHandleView,
  getHandleViewTrueLabs,
  getLabBoyByLabId,
  assignLabBoy,
};
