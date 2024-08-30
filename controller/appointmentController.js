const APIFeatures = require("../helper/apifeature");
const Agents = require("../model/agents");
const User = require("../model/userModel");
const Appointment = require("../model/appointment");
const DiagnosticLab = require("../model/diagnosticLabs");
const Location = require("../model/location");
const DiagnosticTest = require("../model/diagnosticTest");
const {
  analyzeSalesAndCommissions,
  categorizeFranchiseSales,
} = require("../helper/salesAnalysisServices");
const Franchise = require("../model/franchise");
const SalesRange = require("../model/saleRange");

// const createAppointment = async (req, res) => {
//   try {
//     const {
//       type,
//       age,
//       gender,
//       problem,
//       problemDescription,
//       referral,
//       lab,
//       appointmentDate,
//       tests,
//       commission,
//     } = req.body;

//     let agentId = null;

//     // If referral is provided, find the agent
//     if (referral) {
//       const agent = await Agents.findOne({ contact: referral });
//       if (agent) {
//         agentId = agent._id;
//       } else {
//         console.log("No agent found with contact:", referral);
//       }
//     }

//     // Set createdByModel based on role
//     const createdByModel =
//       req.role === "superAdmin"
//         ? "User"
//         : req.role.charAt(0).toUpperCase() + req.role.slice(1);

//     const newAppointment = new Appointment({
//       type,
//       age,
//       gender,
//       problem,
//       problemDescription,
//       referral: agentId,
//       lab,
//       appointmentDate,
//       tests,
//       commission,
//       createdBy: req.account,
//       createdByModel,
//     });

//     await newAppointment.save();
//     res.status(201).json(newAppointment);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const createAppointment = async (req, res) => {
//   try {
//     const {
//       type,
//       age,
//       gender,
//       problem,
//       problemDescription,
//       referral,
//       lab: labContact,
//       appointmentDate,
//       tests: testContacts,
//       commission,
//       labs,
//     } = req.body;

//     let referralId = null;
//     let labId = null;
//     let testIds = [];

//     // If referral is provided, find the agent
//     if (referral) {
//       const agent = await Agents.findOne({ contact: referral });
//       if (agent) {
//         referralId = agent._id;
//       } else {
//         console.log("No agent found with contact:", referral);
//       }
//     }

//     // If lab is provided, find the lab
//     if (labContact) {
//       const lab = await DiagnosticLab.findOne({ contact: labContact });
//       if (lab) {
//         labId = lab._id;
//       } else {
//         console.log("No lab found with contact:", labContact);
//       }
//     }

//     // If tests are provided, find the tests
//     if (testContacts && testContacts.length > 0) {
//       testIds = await Promise.all(
//         testContacts.map(async (testContact) => {
//           const test = await DiagnosticTest.findOne({
//             contact: testContact,
//           }).populate("labCategory");
//           console.log(test);

//           return test ? test._id : null;
//         })
//       );
//       testIds = testIds.filter((testId) => testId !== null); // Remove null values
//     }

//     // Set createdByModel based on role
//     const createdByModel =
//       req.role === "superAdmin" || "councilor"
//         ? "User"
//         : req.role.charAt(0).toUpperCase() + req.role.slice(1);

//     const newAppointment = new Appointment({
//       type,
//       age,
//       gender,
//       problem,
//       problemDescription,
//       referral: referralId,
//       lab: labId,
//       appointmentDate,
//       tests: testIds,
//       commission,
//       createdBy: req.account,
//       createdByModel,
//       labs,
//     });

//     await newAppointment.save();
//     res.status(201).json(newAppointment);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const createAppointment = async (req, res) => {
  try {
    const {
      type,
      age,
      gender,
      problem,
      problemDescription,
      referral,
      labs,
      appointmentDate,
      commission,
    } = req.body;

    let referralId = null;
    let totalAmount = 0;

    // If referral is provided, find the agent
    if (referral) {
      const agent = await Agents.findOne({ contact: referral });
      console.log(agent);

      if (agent) {
        referralId = agent._id;
      } else {
        console.log("No agent found with ID:", referral);
      }
    }
    console.log("Referral ID:", referralId);

    // Verify lab exists
    if (!labs || !labs.lab) {
      return res.status(400).json({ message: "Lab ID is required" });
    }
    const lab = await DiagnosticLab.findById(labs.lab);
    if (!lab) {
      return res.status(404).json({ message: "Lab not found" });
    }

    // Verify tests and calculate total amount
    let tests = [];
    if (labs.tests && labs.tests.length > 0) {
      const testPromises = labs.tests.map(async ({ test: testId }) => {
        const test = await DiagnosticTest.findById(testId);
        if (test) {
          totalAmount += test.price;
          return {
            test: test._id,
            status: "Pending",
          };
        }
        return null;
      });

      tests = (await Promise.all(testPromises)).filter((test) => test !== null);
    }

    // Set createdByModel based on role
    const createdByModel =
      req.role === "superAdmin" || req.role === "councilor"
        ? "User"
        : req.role.charAt(0).toUpperCase() + req.role.slice(1);

    const newAppointment = new Appointment({
      type,
      age,
      gender,
      problem,
      problemDescription,
      referral: referralId,
      labs: {
        lab: labs.lab,
        tests: tests,
      },
      appointmentDate,
      commission,
      createdBy: req.account,
      createdByModel,
      totalAmount,
      paymentStatus: "PENDING",
    });

    await newAppointment.save();

    // PhonePe integration details
    const merchantId = process.env.MERCHANT_ID;
    const saltKey = process.env.SALT_KEY;
    const saltIndex = process.env.SALT_INDEX;
    const merchantTransactionId = newAppointment._id.toString();
    const user = await User.findOne({ _id: req.account });
    // Create base64 encoded payload
    const payload = {
      merchantId: merchantId,
      merchantTransactionId: merchantTransactionId,
      merchantUserId: req.account,
      amount: totalAmount * 100, // Convert to paise
      callbackUrl: `${process.env.SERVER_URL}/api/payment-callback`,
      mobileNumber: user.mobile,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString(
      "base64"
    );

    res.status(201).json({
      appointment: newAppointment,
      phonepeDetails: { payload, base64Payload, saltKey, saltIndex },
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ message: error.message });
  }
};

const getUserAppointments = async (req, res) => {
  try {
    const userId = req.account;
    const appointments = await Appointment.find({ createdBy: userId })
      .populate({
        path: "createdBy",
        select: "-password -otp -role -lastLogin -lastLogout",
      })
      .populate({
        path: "labs.lab",
        model: "DiagnosticLab",
        select: "-testsOffered -password -role",
      })
      .populate({
        path: "labs.tests.test",
        model: "DiagnosticTest",
        populate: {
          path: "labCategory",
          model: "LabCategories",
        },
      })
      .populate({
        path: "labs.tests.updatedBy",
        model: "User",
      });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    // Update commission if provided
    if (updateData.commission) {
      appointment.commission = {
        ...appointment.commission,
        ...updateData.commission,
      };
      delete updateData.commission;
    }
    Object.assign(appointment, updateData);
    await appointment.save();

    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const updateLabTestStatus = async (req, res) => {
//   try {
//     const userId = req.account;
//     const { id, testId } = req.params;
//     const { status } = req.body;
//     console.log("<<<<<<<<<<<<<<", id, testId);
//     const appointment = await Appointment.findById(id);
//     if (!appointment) {
//       return res.status(404).json({ message: "Appointment not found" });
//     }

//     const lab = appointment.labs;
//     if (!lab) {
//       return res
//         .status(404)
//         .json({ message: "Lab not found in the appointment" });
//     }
//     // console.log("LAB>>>>", lab);

//     const test = lab.tests.find((test) => test._id.toString() === testId);
//     if (!test) {
//       return res.status(404).json({ message: "Test not found in the lab" });
//     }

//     test.status = status;
//     test.updatedBy = userId;
//     test.updatedAt = new Date();
//     console.log(">>.>>>>", test?.updatedBy);

//     await appointment.save();
//     res.status(200).json(appointment);
//   } catch (error) {
//     // Handle errors and respond with an error message
//     res.status(500).json({ message: error.message });
//   }
// };

// const updateLabTestStatus = async (req, res) => {
//   try {
//     const userId = req.account;
//     const userRole = req.role;
//     const { id, testId } = req.params;
//     const { status } = req.body;
//     console.log("UPDATETESTSTATUS", userRole);
//     console.log("STATUS", status);

//     console.log(req.body);

//     const appointment = await Appointment.findById(id);
//     if (!appointment) {
//       return res.status(404).json({ message: "Appointment not found" });
//     }

//     const lab = appointment.labs;
//     if (!lab) {
//       return res
//         .status(404)
//         .json({ message: "Lab not found in the appointment" });
//     }

//     const test = lab.tests.find((test) => test._id.toString() === testId);
//     if (!test) {
//       return res.status(404).json({ message: "Test not found in the lab" });
//     }
//     console.log("Find Test 1", test);

//     // Set the updatedByModel based on the role
//     let updatedByModel;
//     switch (userRole) {
//       case "admin":
//       case "superAdmin":
//       case "councilor":
//         updatedByModel = "User";
//         break;
//       case "lab":
//         updatedByModel = "DiagnosticLab";
//         break;
//       default:
//         return res.status(400).json({ message: "Invalid user role" });
//     }

//     test.status = status;
//     test.updatedBy = userId;
//     test.updatedByModel = updatedByModel; // Set the model type based on user role
//     test.updatedAt = new Date();
//     console.log("Updated Test 2", test);

//     await appointment.save();
//     res.status(200).json(appointment);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const updateLabTestStatus = async (req, res) => {
  try {
    const userId = req.account;
    const userRole = req.role;
    const { id, testId } = req.params;
    const { status } = req.body;

    // Valid statuses for the test
    const validStatuses = [
      "Pending",
      "In Progress",
      "Interact with Client",
      "Collected Sample",
      "Completed",
      "Closed",
    ];

    // Validate status value
    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ message: `Invalid status value: ${status}` });
    }

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Check if the appointment status is "Approve"
    if (appointment.status !== "Approve") {
      return res.status(400).json({
        success: false,
        message:
          "Test status can only be updated when appointment status is 'Approve'",
      });
    }

    const lab = appointment.labs;
    if (!lab) {
      return res
        .status(404)
        .json({ message: "Lab not found in the appointment" });
    }

    const test = lab.tests.find((test) => test._id.toString() === testId);
    if (!test) {
      return res.status(404).json({ message: "Test not found in the lab" });
    }

    // Set the updatedByModel based on the role
    let updatedByModel;
    switch (userRole) {
      case "admin":
      case "superAdmin":
      case "councilor":
        updatedByModel = "User";
        break;
      case "lab":
        updatedByModel = "DiagnosticLab";
        break;
      case "labBoy":
        updatedByModel = "LabBoy";
        break;
      default:
        return res.status(400).json({ message: "Invalid user role" });
    }

    test.status = status;
    test.updatedBy = userId;
    test.updatedByModel = updatedByModel; // Set the model type based on user role
    test.updatedAt = new Date();

    await appointment.save();
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    await appointment.remove();

    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllAppointmentsByFranchise = async (req, res) => {
  try {
    const { franchiseId } = req.params;
    const appointments = await Appointment.find({
      createdBy: franchiseId,
      createdByModel: "Franchise",
    })
      .populate("user")
      .populate("lab")
      .populate("tests");
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllAppointmentsBySuperAdmin = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      createdByModel: "SuperAdmin",
    })
      .populate("user")
      .populate("lab")
      .populate("tests");
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const getAllAppointments = async (req, res) => {
//   try {
//     // Create a new instance of APIFeatures
//     const features = new APIFeatures(Appointment.find(), req.query)
//       .search()
//       .filter()
//       .sort()
//       .limitFields();

//     // Apply pagination after other operations
//     const paginatedFeatures = features.paginate();

//     // Execute the query with population
//     const appointments = await paginatedFeatures.query
//       .populate({
//         path: "referral",
//         model: "Agent",
//       })
//       .populate({
//         path: "labs.lab",
//         model: "DiagnosticLab",
//       })
//       .populate({
//         path: "labs.tests.test",
//         model: "DiagnosticTest",
//         populate: {
//           path: "labCategory",
//           model: "LabCategories",
//         },
//       })
//       .populate({
//         path: "labs.tests.updatedBy",
//         model: "User",
//       })
//       .populate({
//         path: "createdBy",
//       });

//     // Get total count for pagination info
//     const totalAppointments = await Appointment.countDocuments(
//       features.query._conditions
//     );

//     res.status(200).json({
//       success: true,
//       results: appointments.length,
//       totalAppointments,
//       data: appointments,
//       pagination: {
//         currentPage: paginatedFeatures.queryString.page * 1 || 1,
//         limit: paginatedFeatures.queryString.limit * 1 || 20,
//         totalPages: Math.ceil(
//           totalAppointments / (paginatedFeatures.queryString.limit * 1 || 20)
//         ),
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching appointments:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const getAllAppointments = async (req, res) => {
//   try {
//     // Create a new instance of APIFeatures
//     const features = new APIFeatures(Appointment.find(), req.query)
//       .search()
//       .filter()
//       .sort()
//       .limitFields();

//     // Apply pagination after other operations
//     const paginatedFeatures = features.paginate();

//     // Execute the query with initial population
//     const appointments = await paginatedFeatures.query
//       .populate({
//         path: "referral",
//         model: "Agent",
//       })
//       .populate({
//         path: "labs.lab",
//         model: "DiagnosticLab",
//       })
//       .populate({
//         path: "labs.tests.test",
//         model: "DiagnosticTest",
//         populate: {
//           path: "labCategory",
//           model: "LabCategories",
//         },
//       })
//       .populate({
//         path: "createdBy",
//       })
//       .exec();
//     // Manually populate the updatedBy field
//     const populatedAppointments = await Promise.all(
//       appointments.map(async (appointment) => {
//         const testsWithUpdatedBy = await Promise.all(
//           appointment.labs.tests.map(async (test) => {
//             let updatedByModel = null;
//             if (test.updatedByModel === "User") {
//               updatedByModel = await User.findById(test.updatedBy);
//             } else if (test.updatedByModel === "DiagnosticLab") {
//               updatedByModel = await DiagnosticLab.findById(test.updatedBy);
//             } else if (test.updatedByModel === "SuperAdmin") {
//               updatedByModel = await User.findById(test.updatedBy);
//             }
//             return { ...test.toObject(), updatedBy: updatedByModel };
//           })
//         );

//         return {
//           ...appointment.toObject(),
//           labs: {
//             ...appointment.labs.toObject(),
//             tests: testsWithUpdatedBy,
//           },
//         };
//       })
//     );

//     // Get total count for pagination info
//     const totalAppointments = await Appointment.countDocuments(
//       features.query._conditions
//     );

//     res.status(200).json({
//       success: true,
//       results: populatedAppointments.length,
//       totalAppointments,
//       data: populatedAppointments,
//       pagination: {
//         currentPage: paginatedFeatures.queryString.page * 1 || 1,
//         limit: paginatedFeatures.queryString.limit * 1 || 10,
//         totalPages: Math.ceil(
//           totalAppointments / (paginatedFeatures.queryString.limit * 1 || 10)
//         ),
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching appointments:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

const getAllAppointments = async (req, res) => {
  try {
    // Create a new instance of APIFeatures
    const features = new APIFeatures(Appointment.find(), req.query)
      .search()
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Execute the query with initial population
    const appointments = await features.query
      .populate({
        path: "referral",
        model: "Agent",
      })
      .populate({
        path: "labs.lab",
        model: "DiagnosticLab",
      })
      .populate({
        path: "labs.tests.test",
        model: "DiagnosticTest",
        populate: {
          path: "labCategory",
          model: "LabCategories",
        },
      })
      .populate({
        path: "createdBy",
      })
      .populate({
        path: "franchise",
      })
      .exec();

    // Manually populate the updatedBy field
    const populatedAppointments = await Promise.all(
      appointments.map(async (appointment) => {
        const testsWithUpdatedBy = await Promise.all(
          appointment.labs.tests.map(async (test) => {
            let updatedByModel = null;
            if (test.updatedByModel === "User") {
              updatedByModel = await User.findById(test.updatedBy);
            } else if (test.updatedByModel === "DiagnosticLab") {
              updatedByModel = await DiagnosticLab.findById(test.updatedBy);
            } else if (test.updatedByModel === "SuperAdmin") {
              updatedByModel = await User.findById(test.updatedBy);
            }
            return { ...test.toObject(), updatedBy: updatedByModel };
          })
        );

        return {
          ...appointment.toObject(),
          labs: {
            ...appointment.labs.toObject(),
            tests: testsWithUpdatedBy,
          },
        };
      })
    );

    // Get total count for pagination info
    const totalAppointments = await Appointment.countDocuments(
      features.query._conditions
    );

    res.status(200).json({
      success: true,
      results: populatedAppointments.length,
      totalAppointments,
      data: populatedAppointments,
      pagination: {
        currentPage: features.queryString.page * 1 || 1,
        limit: features.queryString.limit * 1 || 10,
        totalPages: Math.ceil(
          totalAppointments / (features.queryString.limit * 1 || 10)
        ),
      },
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAppointmentsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const appointments = await Appointment.find({ createdBy: userId })
      .populate("createdBy")
      .populate({
        path: "labs.lab",
        model: "DiagnosticLab",
      })
      .populate({
        path: "labs.tests.test",
        model: "DiagnosticTest",
        populate: {
          path: "labCategory",
          model: "LabCategories",
        },
      })
      .populate({
        path: "labs.tests.updatedBy",
        model: "User",
      });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllAppointmentsByLabBoyId = async (req, res) => {
  try {
    const { labBoyId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Ensure labId is converted to ObjectId if needed
    const appointments = await Appointment.find({
      labBoy: labBoyId,
      "labs.tests.status": {
        $in: [
          "In Progress",
          "Interact with Client",
          "Collected Sample",
          "Completed",
          "Closed",
        ],
      },
    })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate({
        path: "referral",
        model: "Agent",
      })
      .populate({
        path: "labs.lab",
        model: "DiagnosticLab",
      })
      .populate({
        path: "labs.tests.test",
        model: "DiagnosticTest",
        populate: {
          path: "labCategory",
          model: "LabCategories",
        },
      })
      .populate({
        path: "createdBy",
      })
      .populate({
        path: "labBoy",
        model: "LabBoy",
        select: "-password",
      })
      .exec();

    // Get total number of appointments to calculate total pages
    const totalAppointments = await Appointment.countDocuments({
      labBoy: labBoyId,
      "labs.tests.status": { $in: ["In Progress", "Completed", "Closed"] },
    });

    // Manually populate the updatedBy field
    const populatedAppointments = await Promise.all(
      appointments.map(async (appointment) => {
        const testsWithUpdatedBy = await Promise.all(
          appointment.labs.tests.map(async (test) => {
            let updatedByModel = null;
            if (test.updatedByModel === "User") {
              updatedByModel = await User.findById(test.updatedBy);
            } else if (test.updatedByModel === "DiagnosticLab") {
              updatedByModel = await DiagnosticLab.findById(test.updatedBy);
            } else if (test.updatedByModel === "SuperAdmin") {
              updatedByModel = await User.findById(test.updatedBy);
            }
            return { ...test.toObject(), updatedBy: updatedByModel };
          })
        );

        return {
          ...appointment.toObject(),
          labs: {
            ...appointment.labs.toObject(),
            tests: testsWithUpdatedBy,
          },
        };
      })
    );

    res.status(200).json({
      data: populatedAppointments,
      totalAppointments: totalAppointments,
      currentPage: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(totalAppointments / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Error fetching appointments",
      details: err.message,
    });
  }
};

const approveAppointment = async (req, res) => {
  const { appointmentId } = req.params;

  try {
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { $set: { status: "Approve" } },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    return res
      .status(200)
      .json({ message: "Appointment approved", appointment });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const rejectAppointment = async (req, res) => {
  const { appointmentId } = req.params;

  try {
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { $set: { status: "Reject" } },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    return res
      .status(200)
      .json({ message: "Appointment rejected", appointment });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const updateCommission = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { superAdminToFranchise, superAdminToAgent } = req.body.commission;
    console.log(appointmentId, superAdminToAgent, superAdminToFranchise);
    // Fetch the appointment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    let updated = false;

    // Check and update superAdminToFranchise
    if (superAdminToFranchise !== undefined) {
      const franchiseValue = parseFloat(superAdminToFranchise);
      if (franchiseValue < 0 || franchiseValue > 100) {
        return res.status(400).json({
          message: "superAdminToFranchise value must be between 0 and 100.",
        });
      }
      appointment.commission.superAdminToFranchise = franchiseValue;
      updated = true;
    }

    // Check and update superAdminToAgent
    if (superAdminToAgent !== undefined) {
      const agentValue = parseFloat(superAdminToAgent);
      if (agentValue < 0 || agentValue > 100) {
        return res.status(400).json({
          message: "superAdminToAgent value must be between 0 and 100.",
        });
      }
      appointment.commission.superAdminToAgent = agentValue;
      updated = true;
    }

    // Save the updated appointment only if changes were made
    if (updated) {
      await appointment.save();
    }

    // Fetch the updated document to return
    const updatedAppointment = await Appointment.findById(appointmentId);

    res.status(200).json({
      message: "Commission updated successfully",
      appointment: updatedAppointment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLabsByLocation = async (req, res) => {
  try {
    const { search } = req.query; // Assuming a search query parameter

    if (!search) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Build query using $or to search across multiple fields
    const locationQuery = {
      $or: [
        { city: { $regex: search, $options: "i" } },
        { state: { $regex: search, $options: "i" } },
        { pinCode: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
      ],
    };

    // Find locations matching the query
    const locations = await Location.find(locationQuery);

    if (!locations.length) {
      return res
        .status(404)
        .json({ message: "No labs found at the specified location" });
    }

    // Get location IDs
    const locationIds = locations.map((location) => location._id);

    // Find labs matching the location IDs
    const labs = await DiagnosticLab.find({ address: { $in: locationIds } })
      .populate("address")
      .populate("testsOffered");

    if (!labs.length) {
      return res
        .status(404)
        .json({ message: "No labs found at the specified location" });
    }

    res.status(200).json(labs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLabsWithTestsInProgress = async (req, res) => {
  try {
    console.log("Fetching labs with tests in progress...");
    const appointments = await Appointment.find({
      "labs.tests": { $elemMatch: { status: "In Progress" } },
    }).exec();

    res.status(200).json({
      data: appointments,
      totalAppointments: appointments.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const findAppointmentsByLabAndTestStatus = async (req, res) => {
//   try {
//     const { labId } = req.params;

//     // Ensure labId is converted to ObjectId if needed
//     const appointments = await Appointment.find({
//       "labs.lab": labId,
//       "labs.tests.status": { $in: ["In Progress", "Completed", "Closed"] },
//     })
//       .populate({
//         path: "referral",
//         model: "Agent",
//       })
//       .populate({
//         path: "labs.lab",
//         model: "DiagnosticLab",
//       })
//       .populate({
//         path: "labs.tests.test",
//         model: "DiagnosticTest",
//         populate: {
//           path: "labCategory",
//           model: "LabCategories",
//         },
//       })
//       .populate({
//         path: "labs.tests.updatedBy",
//         // Dynamically reference the correct model using the updatedByModel field
//         populate: {
//           path: "updatedBy",
//           model: { path: "labs.tests.updatedByModel" },
//         },
//       })
//       .populate({
//         path: "createdBy",
//       })
//       .exec();

//     res.status(200).json({
//       data: appointments,
//       totalAppointments: appointments.length,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       error: "Error fetching appointments",
//       details: err.message,
//     });
//   }
// };

// const findAppointmentsByLabAndTestStatus = async (req, res) => {
//   try {
//     const { labId } = req.params;
//     const { page = 1, limit = 10 } = req.query;
//     const skip = (page - 1) * limit;
//     // Ensure labId is converted to ObjectId if needed
//     const appointments = await Appointment.find({
//       "labs.lab": labId,
//       "labs.tests.status": { $in: ["In Progress", "Completed", "Closed"] },
//     })
//       .populate({
//         path: "referral",
//         model: "Agent",
//       })
//       .populate({
//         path: "labs.lab",
//         model: "DiagnosticLab",
//       })
//       .populate({
//         path: "labs.tests.test",
//         model: "DiagnosticTest",
//         populate: {
//           path: "labCategory",
//           model: "LabCategories",
//         },
//       })
//       .populate({
//         path: "createdBy",
//       })
//       .exec();

//     // Manually populate the updatedBy field
//     const populatedAppointments = await Promise.all(
//       appointments.map(async (appointment) => {
//         const testsWithUpdatedBy = await Promise.all(
//           appointment.labs.tests.map(async (test) => {
//             let updatedByModel = null;
//             if (test.updatedByModel === "User") {
//               updatedByModel = await User.findById(test.updatedBy);
//             } else if (test.updatedByModel === "DiagnosticLab") {
//               updatedByModel = await DiagnosticLab.findById(test.updatedBy);
//             } else if (test.updatedByModel === "SuperAdmin") {
//               updatedByModel = await User.findById(test.updatedBy);
//             }
//             return { ...test.toObject(), updatedBy: updatedByModel };
//           })
//         );

//         return {
//           ...appointment.toObject(),
//           labs: {
//             ...appointment.labs.toObject(),
//             tests: testsWithUpdatedBy,
//           },
//         };
//       })
//     );

//     res.status(200).json({
//       data: populatedAppointments,
//       totalAppointments: populatedAppointments.length,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       error: "Error fetching appointments",
//       details: err.message,
//     });
//   }
// };

const findAppointmentsByLabAndTestStatus = async (req, res) => {
  try {
    const { labId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Ensure labId is converted to ObjectId if needed
    const appointments = await Appointment.find({
      "labs.lab": labId,
      "labs.tests.status": {
        $in: [
          "In Progress",
          "Interact with Client",
          "Collected Sample",
          "Completed",
          "Closed",
        ],
      },
    })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate({
        path: "referral",
        model: "Agent",
      })
      .populate({
        path: "labs.lab",
        model: "DiagnosticLab",
      })
      .populate({
        path: "labs.tests.test",
        model: "DiagnosticTest",
        populate: {
          path: "labCategory",
          model: "LabCategories",
        },
      })
      .populate({
        path: "createdBy",
      })
      .populate({
        path: "labBoy",
        model: "LabBoy",
        select: "-password",
      })
      .exec();

    // Get total number of appointments to calculate total pages
    const totalAppointments = await Appointment.countDocuments({
      "labs.lab": labId,
      "labs.tests.status": { $in: ["In Progress", "Completed", "Closed"] },
    });

    // Manually populate the updatedBy field
    const populatedAppointments = await Promise.all(
      appointments.map(async (appointment) => {
        const testsWithUpdatedBy = await Promise.all(
          appointment.labs.tests.map(async (test) => {
            let updatedByModel = null;
            if (test.updatedByModel === "User") {
              updatedByModel = await User.findById(test.updatedBy);
            } else if (test.updatedByModel === "DiagnosticLab") {
              updatedByModel = await DiagnosticLab.findById(test.updatedBy);
            } else if (test.updatedByModel === "SuperAdmin") {
              updatedByModel = await User.findById(test.updatedBy);
            }
            return { ...test.toObject(), updatedBy: updatedByModel };
          })
        );

        return {
          ...appointment.toObject(),
          labs: {
            ...appointment.labs.toObject(),
            tests: testsWithUpdatedBy,
          },
        };
      })
    );

    res.status(200).json({
      data: populatedAppointments,
      totalAppointments: totalAppointments,
      currentPage: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(totalAppointments / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Error fetching appointments",
      details: err.message,
    });
  }
};

// const getAllAppointmentsByAgentId = async (req, res) => {
//   try {
//     const { agentId } = req.params;

//     // Fetch appointments where the referral matches the agentId
//     const appointments = await Appointment.find({ referral: agentId })
//       // Populate the referral field with Agent documents
//       .populate({
//         path: "referral",
//         model: "Agent",
//       })
//       // Populate the labs.lab field with DiagnosticLab documents
//       .populate({
//         path: "labs.lab",
//         model: "DiagnosticLab",
//       })
//       // Populate the labs.tests.test field with DiagnosticTest documents
//       .populate({
//         path: "labs.tests.test",
//         model: "DiagnosticTest",
//         populate: {
//           path: "labCategory",
//           model: "LabCategories",
//         },
//       })
//       // // Populate the labs.tests.updatedBy field with User documents
//       // .populate({
//       //   path: "labs.tests.updatedBy",
//       //   model: "User",
//       // })
//       // // Populate the createdBy field with User documents (assuming it's a user reference)
//       // .populate({
//       //   path: "createdBy",
//       //   model: "User",
//       // })
//       // .populate({
//       //   path: "labs.tests.updatedBy",
//       //   model: "User",
//       // })
//       .exec();

//     // Respond with the found appointments
//     res.status(200).json(appointments);
//   } catch (error) {
//     // Handle any errors that occurred during the query
//     res.status(500).json({ message: error.message });
//   }
// };

// const analyzeAppointments = async (req, res) => {
//   try {
//     const { franchiseId } = req.params;
//     const { startDate, endDate } = req.query;

//     // Convert string dates to Date objects if provided
//     const start = startDate ? new Date(startDate) : undefined;
//     const end = endDate ? new Date(endDate) : undefined;

//     const analysisResult = await analyzeSalesAndCommissions(
//       franchiseId,
//       start,
//       end
//     );

//     res.json({
//       success: true,
//       data: {
//         franchiseTotalCommission: analysisResult.franchiseTotalCommission,
//         agentResults: analysisResult.agentResults.map((agent) => ({
//           agentName: agent.agentName,
//           totalSales: agent.totalSales,
//           totalCommission: agent.totalCommission,
//           salesByRange: agent.salesByRange,
//         })),
//       },
//     });
//   } catch (error) {
//     console.error("Error in analyzeAppointments:", error);
//     res.status(500).json({
//       success: false,
//       message: "An error occurred while analyzing appointments",
//       error: error.message,
//     });
//   }
// };

const getFranchiseSalesCategories = async (req, res) => {
  try {
    let { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      endDate = new Date();
      startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
    } else {
      startDate = new Date(startDate);
      endDate = new Date(endDate);
    }

    console.log("Start Date:", startDate, "End Date:", endDate);

    const categorizedResults = await categorizeFranchiseSales(
      startDate,
      endDate
    );

    res.status(200).json({
      success: true,
      data: categorizedResults,
    });
  } catch (error) {
    console.error("Error fetching franchise sales categories:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const calculateAndDistributeCommissions = async (req, res) => {
  const getLast30DaysRange = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);
    return { startDate, endDate };
  };
  try {
    const { startDate, endDate } =
      req.query.startDate && req.query.endDate
        ? {
            startDate: new Date(req.query.startDate),
            endDate: new Date(req.query.endDate),
          }
        : getLast30DaysRange();

    const franchises = await Franchise.find();
    const salesRanges = await SalesRange.find().sort("minAmount");

    const commissionResults = [];

    for (const franchise of franchises) {
      const agents = await Agents.find({ franchise: franchise._id });
      const agentIds = agents.map((agent) => agent._id);

      const appointments = await Appointment.find({
        referral: { $in: agentIds },
        appointmentDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
        "labs.tests.status": { $in: ["Closed", "Completed", "Approve"] },
      });

      const totalFranchiseSales = appointments.reduce(
        (sum, appointment) => sum + (appointment.totalAmount || 0),
        0
      );

      let franchiseCommission = 0;
      let agentCommission = 0;

      // Determine commission based on sales range
      for (const range of salesRanges) {
        if (
          totalFranchiseSales >= range.minAmount &&
          totalFranchiseSales <= range.maxAmount
        ) {
          franchiseCommission =
            (totalFranchiseSales * range.franchiseCommissionPercentage) / 100;

          agentCommission =
            (totalFranchiseSales * range.agentCommissionPercentage) / 100;

          // Update appointments with commission
          for (const appointment of appointments) {
            appointment.commission.superAdminToFranchise =
              range.franchiseCommissionPercentage;
            appointment.commission.superAdminToAgent =
              range.agentCommissionPercentage;
            await appointment.save();
          }

          break;
        }
      }

      // Store commission details
      commissionResults.push({
        franchiseName: franchise.name,
        totalSales: totalFranchiseSales,
        franchiseCommission,
        agentCommission,
      });
    }

    return res.json(commissionResults);
  } catch (err) {
    console.error("Error calculating commissions:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const distributeCommissions = async (req, res) => {
  try {
    const { startDate, endDate, commissionRates } = req.body;

    // Validate input dates
    const start = startDate
      ? new Date(startDate)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const categorizedResults = await categorizeFranchiseSales(start, end);

    const commissions = categorizedResults.map((range) => {
      const commissionRate = commissionRates[range.rangeName] || 0; // Default to 0% if not provided
      const totalSales = range.franchises.reduce(
        (sum, franchise) => sum + franchise.totalSales,
        0
      );
      const commissionAmount = totalSales * (commissionRate / 100);

      return {
        rangeName: range.rangeName,
        commissionRate,
        totalSales,
        commissionAmount,
      };
    });

    res.status(200).json({
      success: true,
      data: commissions,
    });
  } catch (error) {
    console.error("Error distributing commissions:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createAppointment,
  updateAppointment,
  updateLabTestStatus,
  deleteAppointment,
  // getAllAppointmentsByAgentId,
  getAllAppointmentsByFranchise,
  getAllAppointmentsBySuperAdmin,
  getAllAppointments,
  getAllAppointmentsByLabBoyId,
  getAppointmentsByUserId,
  approveAppointment,
  rejectAppointment,
  updateCommission,
  getLabsByLocation,
  getLabsWithTestsInProgress,
  findAppointmentsByLabAndTestStatus,
  // analyzeAppointments,
  getFranchiseSalesCategories,
  calculateAndDistributeCommissions,
  distributeCommissions,
  getUserAppointments,
};
