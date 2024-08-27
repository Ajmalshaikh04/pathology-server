const DiagnosticLab = require("../model/diagnosticLabs");
const LabBoy = require("../model/labBoy");
const bcrypt = require("bcrypt");

// Get all LabBoys
exports.getAllLabs = async (req, res) => {
  try {
    const labBoys = await DiagnosticLab.find().select("_id name contactNumber");
    res.status(200).json(labBoys);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// // Get all LabBoys
// exports.getAllLabBoys = async (req, res) => {
//   try {
//     const labBoys = await LabBoy.find().populate("assignedLab");
//     res.status(200).json(labBoys);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// Get all LabBoys with pagination
exports.getAllLabBoys = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10

    const labBoys = await LabBoy.find()
      .populate("assignedLab")
      .limit(limit * 1) // Convert limit to a number
      .skip((page - 1) * limit)
      .exec();

    const count = await LabBoy.countDocuments();

    res.status(200).json({
      labBoys,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all LabBoys
exports.getAllLabBoysByLabId = async (req, res) => {
  try {
    const { labId } = req.body;
    const labBoys = await LabBoy.find({ assignedLab: labId }).populate(
      "assignedLab"
    );
    res.status(200).json(labBoys);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a LabBoy by ID
exports.getLabBoyById = async (req, res) => {
  try {
    const labBoy = await LabBoy.findById(req.params.id).populate("assignedLab");
    if (!labBoy) {
      return res.status(404).json({ message: "LabBoy not found" });
    }
    res.status(200).json(labBoy);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new LabBoy
exports.createLabBoy = async (req, res) => {
  try {
    const { name, email, password, contactNumber, assignedLab } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newLabBoy = new LabBoy({
      name,
      email,
      password: hashedPassword, // Store the hashed password
      contactNumber,
      assignedLab,
    });

    const savedLabBoy = await newLabBoy.save();
    res.status(201).json(savedLabBoy);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a LabBoy by ID
exports.updateLabBoy = async (req, res) => {
  try {
    const { name, email, password, contactNumber, assignedLab } = req.body;

    // If a new password is provided, hash it
    let updateData = { name, email, contactNumber, assignedLab };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const labBoy = await LabBoy.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!labBoy) {
      return res.status(404).json({ message: "LabBoy not found" });
    }

    res.status(200).json(labBoy);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a LabBoy by ID
exports.deleteLabBoy = async (req, res) => {
  try {
    const labBoy = await LabBoy.findByIdAndDelete(req.params.id);
    if (!labBoy) {
      return res.status(404).json({ message: "LabBoy not found" });
    }
    res.status(200).json({ message: "LabBoy deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
