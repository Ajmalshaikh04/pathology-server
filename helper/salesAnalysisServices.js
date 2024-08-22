// services/salesAnalysisService.js

const Appointment = require("../model/appointment");
const Franchise = require("../model/franchise");
const Agent = require("../model/agents");
const SalesRange = require("../model/saleRange");

// async function analyzeSalesAndCommissions(franchiseId, startDate, endDate) {
//   // If no dates are provided, default to the last 28 days
//   if (!startDate || !endDate) {
//     endDate = new Date();
//     startDate = new Date(endDate.getTime() - 28 * 24 * 60 * 60 * 1000);
//   }

//   // Get all agents belonging to the franchise
//   const agents = await Agent.find({ franchise: franchiseId });
//   const agentIds = agents.map((agent) => agent._id);

//   // Get all appointments for these agents within the date range
//   // Only consider appointments where all tests are "Closed" or "Completed"
//   const appointments = await Appointment.find({
//     referral: { $in: agentIds },
//     createdAt: { $gte: startDate, $lte: endDate },
//     "labs.tests": {
//       $not: {
//         $elemMatch: {
//           status: { $nin: ["Closed", "Completed"] },
//         },
//       },
//     },
//   }).populate("referral");

//   // Fetch sales ranges
//   const salesRanges = await SalesRange.find().sort("minAmount");

//   // Initialize results
//   const agentResults = {};
//   let franchiseTotalCommission = 0;

//   // Process appointments
//   appointments.forEach((appointment) => {
//     const saleAmount = appointment.totalAmount || 0;
//     const agentId = appointment.referral._id.toString();

//     if (!agentResults[agentId]) {
//       agentResults[agentId] = {
//         agentName: appointment.referral.name,
//         totalSales: 0,
//         totalCommission: 0,
//         salesByRange: salesRanges.map((range) => ({
//           rangeName: range.name,
//           sales: 0,
//           agentCommission: 0,
//           franchiseCommission: 0,
//         })),
//       };
//     }

//     agentResults[agentId].totalSales += saleAmount;

//     // Categorize sale into ranges
//     let remainingSale = saleAmount;
//     for (const range of salesRanges) {
//       if (remainingSale > 0) {
//         const saleInRange = Math.min(
//           remainingSale,
//           range.maxAmount - range.minAmount
//         );
//         const rangeIndex = agentResults[agentId].salesByRange.findIndex(
//           (r) => r.rangeName === range.name
//         );

//         // Calculate commissions
//         const agentCommission =
//           saleInRange * (range.agentCommissionPercentage / 100);
//         const franchiseCommission =
//           saleInRange * (range.franchiseCommissionPercentage / 100);

//         // Update agent result
//         agentResults[agentId].salesByRange[rangeIndex].sales += saleInRange;
//         agentResults[agentId].salesByRange[rangeIndex].agentCommission +=
//           agentCommission;
//         agentResults[agentId].salesByRange[rangeIndex].franchiseCommission +=
//           franchiseCommission;

//         agentResults[agentId].totalCommission += agentCommission;
//         franchiseTotalCommission += franchiseCommission;

//         remainingSale -= saleInRange;
//       } else {
//         break;
//       }
//     }
//   });

//   return {
//     franchiseTotalCommission,
//     agentResults: Object.values(agentResults),
//   };
// }

// module.exports = { analyzeSalesAndCommissions };
//===================================================
// const Appointment = require("../model/appointment");
// const Franchise = require("../model/franchise");
// const Agent = require("../model/agents");
// const SalesRange = require("../model/saleRange");

// async function categorizeFranchiseSales(startDate, endDate) {
//   // Default to the last 28 days if dates are not provided
//   // if (!startDate || !endDate) {
//   //   endDate = new Date();
//   //   startDate = new Date(endDate.getTime() - 28 * 24 * 60 * 60 * 1000);
//   // }
//   if (!startDate || !endDate) {
//     endDate = new Date();
//     startDate = new Date(endDate.getTime() - 28 * 24 * 60 * 60 * 1000); // 180 days
//   }

//   // Fetch all franchises
//   const franchises = await Franchise.find();
//   const salesRanges = await SalesRange.find().sort("minAmount");

//   // Initialize result
//   const franchiseResults = salesRanges.map((range) => ({
//     rangeName: range.name,
//     franchises: [],
//   }));

//   // Loop through each franchise
//   for (const franchise of franchises) {
//     const agents = await Agent.find({ franchise: franchise._id });
//     const agentIds = agents.map((agent) => agent._id);

//     const appointments = await Appointment.find({
//       referral: { $in: agentIds },
//       createdAt: { $gte: startDate, $lte: endDate },
//       "labs.tests": {
//         $not: {
//           $elemMatch: {
//             status: { $nin: ["Closed", "Completed"] },
//           },
//         },
//       },
//     });

//     const totalFranchiseSales = appointments.reduce(
//       (sum, appointment) => sum + (appointment.totalAmount || 0),
//       0
//     );

//     // Categorize based on sales range
//     for (const range of salesRanges) {
//       if (
//         totalFranchiseSales >= range.minAmount &&
//         totalFranchiseSales <= range.maxAmount
//       ) {
//         const rangeIndex = franchiseResults.findIndex(
//           (r) => r.rangeName === range.name
//         );
//         franchiseResults[rangeIndex].franchises.push({
//           franchiseName: franchise.name,
//           totalSales: totalFranchiseSales,
//         });
//         break;
//       }
//     }
//   }

//   return franchiseResults;
// }

// module.exports = { categorizeFranchiseSales };
//====================================================
// const Appointment = require("../model/appointment");
// const Franchise = require("../model/franchise");
// const Agent = require("../model/agents");
// const SalesRange = require("../model/saleRange");

// async function categorizeFranchiseSales(startDate, endDate) {
//   // Default to the last 28 days if dates are not provided
//   if (!startDate || !endDate) {
//     endDate = new Date();
//     startDate = new Date(endDate.getTime() - 28 * 24 * 60 * 60 * 1000); // 28 days
//   }

//   // Fetch all franchises and sales ranges
//   const [franchises, salesRanges] = await Promise.all([
//     Franchise.find(),
//     SalesRange.find().sort("minAmount"),
//   ]);

//   // Initialize result object by months
//   const salesByMonth = {};

//   // Loop through each franchise
//   for (const franchise of franchises) {
//     const agents = await Agent.find({ franchise: franchise._id });
//     const agentIds = agents.map((agent) => agent._id);

//     const appointments = await Appointment.find({
//       referral: { $in: agentIds },
//       createdAt: { $gte: startDate, $lte: endDate },
//       "labs.tests": {
//         $not: {
//           $elemMatch: {
//             status: { $nin: ["Closed", "Completed"] },
//           },
//         },
//       },
//     });

//     const monthlySales = {};

//     // Calculate total sales for each month
//     for (const appointment of appointments) {
//       const appointmentMonth = appointment.createdAt.getMonth() + 1; // Month is 0-indexed
//       const appointmentYear = appointment.createdAt.getFullYear();
//       const monthYear = `${appointmentMonth}-${appointmentYear}`;

//       if (!monthlySales[monthYear]) {
//         monthlySales[monthYear] = 0;
//       }

//       monthlySales[monthYear] += appointment.totalAmount || 0;
//     }

//     // Categorize the total sales for each month based on the sales range
//     for (const [monthYear, totalSales] of Object.entries(monthlySales)) {
//       if (!salesByMonth[monthYear]) {
//         salesByMonth[monthYear] = salesRanges.map((range) => ({
//           rangeName: range.name,
//           franchises: [],
//         }));
//       }

//       for (const range of salesRanges) {
//         if (totalSales >= range.minAmount && totalSales <= range.maxAmount) {
//           const rangeIndex = salesByMonth[monthYear].findIndex(
//             (r) => r.rangeName === range.name
//           );
//           salesByMonth[monthYear][rangeIndex].franchises.push({
//             franchiseName: franchise.name,
//             totalSales: totalSales,
//           });
//           break;
//         }
//       }
//     }
//   }

//   return salesByMonth;
// }

// module.exports = { categorizeFranchiseSales };
//===============================================================
// const categorizeFranchiseSales = async (startDate, endDate) => {
//   // Parse dates if they are in string format
//   if (typeof startDate === "string") {
//     startDate = new Date(startDate);
//   }
//   if (typeof endDate === "string") {
//     endDate = new Date(endDate);
//   }

//   // Default to the last 28 days if dates are not provided
//   if (!startDate || !endDate) {
//     endDate = new Date();
//     startDate = new Date(endDate.getTime() - 28 * 24 * 60 * 60 * 1000); // 28 days
//   }

//   // Fetch all franchises
//   const franchises = await Franchise.find();
//   const salesRanges = await SalesRange.find().sort("minAmount");

//   // Initialize result
//   const franchiseResults = salesRanges.map((range) => ({
//     rangeName: range.name,
//     franchises: [],
//   }));

//   // Loop through each franchise
//   for (const franchise of franchises) {
//     const agents = await Agent.find({ franchise: franchise._id });
//     const agentIds = agents.map((agent) => agent._id);

//     const appointments = await Appointment.find({
//       referral: { $in: agentIds },
//       createdAt: { $gte: startDate, $lte: endDate },
//       "labs.tests": {
//         $not: {
//           $elemMatch: {
//             status: { $nin: ["Closed", "Completed"] },
//           },
//         },
//       },
//     });

//     const totalFranchiseSales = appointments.reduce(
//       (sum, appointment) => sum + (appointment.totalAmount || 0),
//       0
//     );

//     // Categorize based on sales range
//     for (const range of salesRanges) {
//       if (
//         totalFranchiseSales >= range.minAmount &&
//         totalFranchiseSales <= range.maxAmount
//       ) {
//         const rangeIndex = franchiseResults.findIndex(
//           (r) => r.rangeName === range.name
//         );
//         franchiseResults[rangeIndex].franchises.push({
//           franchiseName: franchise.name,
//           totalSales: totalFranchiseSales,
//         });
//         break;
//       }
//     }
//   }

//   return franchiseResults;
// };

// const categorizeFranchiseSales = async (startDate, endDate) => {
//   // Parse dates if they are in string format
//   if (typeof startDate === "string") {
//     startDate = new Date(startDate);
//   }
//   if (typeof endDate === "string") {
//     endDate = new Date(endDate);
//   }

//   // Default to the last 28 days if dates are not provided
//   if (!startDate || !endDate) {
//     endDate = new Date();
//     startDate = new Date(endDate.getTime() - 28 * 24 * 60 * 60 * 1000); // 28 days
//   }

//   // Fetch all franchises
//   const franchises = await Franchise.find();
//   const salesRanges = await SalesRange.find().sort("minAmount");

//   // Initialize result
//   const franchiseResults = salesRanges.map((range) => ({
//     rangeName: range.name,
//     franchises: [],
//   }));

//   // Loop through each franchise
//   for (const franchise of franchises) {
//     const agents = await Agent.find({ franchise: franchise._id });
//     const agentIds = agents.map((agent) => agent._id);

//     const appointments = await Appointment.find({
//       referral: { $in: agentIds },
//       appointmentDate: { $gte: startDate, $lte: endDate },
//       "labs.tests": {
//         $not: {
//           $elemMatch: {
//             status: { $nin: ["Closed", "Completed"] },
//           },
//         },
//       },
//     });

//     const totalFranchiseSales = appointments.reduce(
//       (sum, appointment) => sum + (appointment.totalAmount || 0),
//       0
//     );

//     // Categorize based on sales range
//     for (const range of salesRanges) {
//       if (
//         totalFranchiseSales >= range.minAmount &&
//         totalFranchiseSales <= range.maxAmount
//       ) {
//         const rangeIndex = franchiseResults.findIndex(
//           (r) => r.rangeName === range.name
//         );
//         franchiseResults[rangeIndex].franchises.push({
//           franchiseName: franchise.name,
//           totalSales: totalFranchiseSales,
//         });
//         break;
//       }
//     }
//   }

//   return franchiseResults;
// };

// module.exports = { categorizeFranchiseSales };

// module.exports = { categorizeFranchiseSales };

// const categorizeFranchiseSales = async (startDate, endDate) => {
//   // Parse dates if they are in string format
//   if (typeof startDate === "string") {
//     startDate = new Date(startDate);
//   }
//   if (typeof endDate === "string") {
//     endDate = new Date(endDate);
//   }

//   // Default to the last 28 days if dates are not provided
//   if (!startDate || !endDate) {
//     endDate = new Date();
//     startDate = new Date(endDate.getTime() - 28 * 24 * 60 * 60 * 1000); // 28 days
//   }

//   console.log("Date Range:", startDate, endDate); // Debugging date range

//   // Fetch all franchises
//   const franchises = await Franchise.find();
//   const salesRanges = await SalesRange.find().sort("minAmount");

//   // Initialize result
//   const franchiseResults = salesRanges.map((range) => ({
//     rangeName: range.name,
//     franchises: [],
//   }));

//   // Loop through each franchise
//   for (const franchise of franchises) {
//     const agents = await Agent.find({ franchise: franchise._id });
//     const agentIds = agents.map((agent) => agent._id);

//     const appointments = await Appointment.find({
//       referral: { $in: agentIds },
//       appointmentDate: { $gte: startDate, $lte: endDate },
//       "labs.tests": {
//         $not: {
//           $elemMatch: {
//             status: { $nin: ["Closed", "Completed"] },
//           },
//         },
//       },
//     });

//     console.log(`Franchise: ${franchise.name}, Appointments:`, appointments); // Debugging appointments

//     const totalFranchiseSales = appointments.reduce(
//       (sum, appointment) => sum + (appointment.totalAmount || 0),
//       0
//     );

//     console.log(
//       `Franchise: ${franchise.name}, Total Sales: ${totalFranchiseSales}`
//     ); // Debugging total sales

//     // Categorize based on sales range
//     for (const range of salesRanges) {
//       if (
//         totalFranchiseSales >= range.minAmount &&
//         totalFranchiseSales <= range.maxAmount
//       ) {
//         const rangeIndex = franchiseResults.findIndex(
//           (r) => r.rangeName === range.name
//         );
//         franchiseResults[rangeIndex].franchises.push({
//           franchiseName: franchise.name,
//           totalSales: totalFranchiseSales,
//         });
//         break;
//       }
//     }
//   }

//   console.log("Franchise Results:", franchiseResults); // Debugging final results

//   return franchiseResults;
// };

const categorizeFranchiseSales = async (startDate, endDate) => {
  const franchises = await Franchise.find();

  const salesRanges = await SalesRange.find().sort("minAmount");

  const totalAppointments = await Appointment.countDocuments();

  const sampleAppointment = await Appointment.findOne().populate("referral");

  const franchiseResults = salesRanges.map((range) => ({
    rangeName: range.name,
    franchises: [],
  }));

  for (const franchise of franchises) {
    const agents = await Agent.find({ franchise: franchise._id });

    const agentIds = agents.map((agent) => agent._id);

    const appointments = await Appointment.find({
      referral: { $in: agentIds },
      appointmentDate: { $gte: startDate, $lte: endDate },
      "labs.tests": {
        $not: {
          $elemMatch: {
            status: { $nin: ["Closed", "Completed", "Approve"] },
          },
        },
      },
    });

    const allAppointments = await Appointment.find({
      referral: { $in: agentIds },
    });

    const totalFranchiseSales = appointments.reduce((sum, appointment) => {
      return sum + (appointment.totalAmount || 0);
    }, 0);

    // Categorize based on sales range
    for (const range of salesRanges) {
      if (
        totalFranchiseSales >= range.minAmount &&
        totalFranchiseSales <= range.maxAmount
      ) {
        const rangeIndex = franchiseResults.findIndex(
          (r) => r.rangeName === range.name
        );
        franchiseResults[rangeIndex].franchises.push({
          franchiseName: franchise.name,
          totalSales: totalFranchiseSales,
        });
        break;
      }
    }
  }

  return franchiseResults;
};

module.exports = { categorizeFranchiseSales };
