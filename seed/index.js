const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const bcrypt = require("bcrypt");
const Location = require("../model/location");
const Franchise = require("../model/franchise");
const Agent = require("../model/agents");
const DiagnosticTest = require("../model/diagnosticTest");
const DiagnosticLab = require("../model/diagnosticLabs");
const User = require("../model/userModel");
const Appointment = require("../model/appointment");
const LabCategory = require("../model/labCategories");
const Report = require("../model/report");
const SalesRange = require("../model/saleRange");
const LabBoy = require("../model/labBoy");

mongoose.connect(
  "mongodb+srv://shahzad201415:L6drIrBh0AYy97yN@cluster0.drcxrzd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
);

//// Function to hash password
async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

const locations = [
  {
    address: "123 MG Road",
    city: "Mumbai",
    state: "Maharashtra",
    pinCode: "400001",
  },
  {
    address: "456 Anna Salai",
    city: "Chennai",
    state: "Tamil Nadu",
    pinCode: "600002",
  },
  {
    address: "789 Brigade Road",
    city: "Bengaluru",
    state: "Karnataka",
    pinCode: "560001",
  },
  {
    address: "101 Jubilee Hills",
    city: "Hyderabad",
    state: "Telangana",
    pinCode: "500033",
  },
  {
    address: "202 Civil Lines",
    city: "Delhi",
    state: "Delhi",
    pinCode: "110054",
  },
  {
    address: "303 Park Street",
    city: "Kolkata",
    state: "West Bengal",
    pinCode: "700016",
  },
  {
    address: "404 FC Road",
    city: "Pune",
    state: "Maharashtra",
    pinCode: "411005",
  },
  {
    address: "505 Sardar Patel Road",
    city: "Ahmedabad",
    state: "Gujarat",
    pinCode: "380015",
  },
  {
    address: "606 MG Marg",
    city: "Gangtok",
    state: "Sikkim",
    pinCode: "737101",
  },
  {
    address: "707 Mall Road",
    city: "Shimla",
    state: "Himachal Pradesh",
    pinCode: "171001",
  },
];

const franchises = [
  {
    name: "HealthFirst Franchise",
    contactNumber: "+91 9876543210",
    email: "healthfirst@example.com",
    password: "hashedPassword1",
    role: "franchise",
  },
  {
    name: "MediCare Franchise",
    contactNumber: "+91 9876543211",
    email: "medicare@example.com",
    password: "hashedPassword2",
    role: "franchise",
  },
  {
    name: "Wellness Hub",
    contactNumber: "+91 9876543212",
    email: "wellnesshub@example.com",
    password: "hashedPassword3",
    role: "franchise",
  },
  {
    name: "CareConnect",
    contactNumber: "+91 9876543213",
    email: "careconnect@example.com",
    password: "hashedPassword4",
    role: "franchise",
  },
  {
    name: "Health Harmony",
    contactNumber: "+91 9876543214",
    email: "healthharmony@example.com",
    password: "hashedPassword5",
    role: "franchise",
  },
  {
    name: "Vitality Ventures",
    contactNumber: "+91 9876543215",
    email: "vitalityventures@example.com",
    password: "hashedPassword6",
    role: "franchise",
  },
  {
    name: "MedLink Network",
    contactNumber: "+91 9876543216",
    email: "medlink@example.com",
    password: "hashedPassword7",
    role: "franchise",
  },
  {
    name: "Cure Consortium",
    contactNumber: "+91 9876543217",
    email: "cureconsortium@example.com",
    password: "hashedPassword8",
    role: "franchise",
  },
  {
    name: "Healing Hands",
    contactNumber: "+91 9876543218",
    email: "healinghands@example.com",
    password: "hashedPassword9",
    role: "franchise",
  },
  {
    name: "Wellness Warriors",
    contactNumber: "+91 9876543219",
    email: "wellnesswarriors@example.com",
    password: "hashedPassword10",
    role: "franchise",
  },
];

const agents = [
  {
    name: "Rajesh Kumar",
    email: "rajesh@example.com",
    password: "hashedPassword11",
    contact: "+91 9876543220",
    role: "agent",
  },
  {
    name: "Priya Sharma",
    email: "priya@example.com",
    password: "hashedPassword12",
    contact: "+91 9876543221",
    role: "agent",
  },
  {
    name: "Amit Patel",
    email: "amit@example.com",
    password: "hashedPassword13",
    contact: "+91 9876543222",
    role: "agent",
  },
  {
    name: "Sneha Reddy",
    email: "sneha@example.com",
    password: "hashedPassword14",
    contact: "+91 9876543223",
    role: "agent",
  },
  {
    name: "Vikram Singh",
    email: "vikram@example.com",
    password: "hashedPassword15",
    contact: "+91 9876543224",
    role: "agent",
  },
  {
    name: "Neha Gupta",
    email: "neha@example.com",
    password: "hashedPassword16",
    contact: "+91 9876543225",
    role: "agent",
  },
  {
    name: "Rahul Verma",
    email: "rahul@example.com",
    password: "hashedPassword17",
    contact: "+91 9876543226",
    role: "agent",
  },
  {
    name: "Anjali Desai",
    email: "anjali@example.com",
    password: "hashedPassword18",
    contact: "+91 9876543227",
    role: "agent",
  },
  {
    name: "Sanjay Joshi",
    email: "sanjay@example.com",
    password: "hashedPassword19",
    contact: "+91 9876543228",
    role: "agent",
  },
  {
    name: "Meera Kapoor",
    email: "meera@example.com",
    password: "hashedPassword20",
    contact: "+91 9876543229",
    role: "agent",
  },
];

const labCategories = [
  {
    name: "Hematology",
    image: "https://example.com/images/hematology.jpg",
  },
  {
    name: "Biochemistry",
    image: "https://example.com/images/biochemistry.jpg",
  },
  {
    name: "Microbiology",
    image: "https://example.com/images/microbiology.jpg",
  },
  {
    name: "Immunology",
    image: "https://example.com/images/immunology.jpg",
  },
  {
    name: "Pathology",
    image: "https://example.com/images/pathology.jpg",
  },
  {
    name: "Genetics",
    image: "https://example.com/images/genetics.jpg",
  },
  {
    name: "Toxicology",
    image: "https://example.com/images/toxicology.jpg",
  },
  {
    name: "Endocrinology",
    image: "https://example.com/images/endocrinology.jpg",
  },
  {
    name: "Oncology",
    image: "https://example.com/images/oncology.jpg",
  },
  {
    name: "Nephrology",
    image: "https://example.com/images/nephrology.jpg",
  },
];

const diagnosticTests = [
  {
    description:
      "Complete Blood Count (CBC) test to measure various components of blood.",
    price: 500,
    labCategory: null, // Will be updated later
  },
  {
    description:
      "Lipid profile test to measure cholesterol levels and triglycerides.",
    price: 800,
    labCategory: null, // Will be updated later
  },
  {
    description:
      "Basic Metabolic Panel (BMP) to assess blood glucose, calcium, and electrolytes.",
    price: 600,
    labCategory: null, // Will be updated later
  },
  {
    description:
      "Comprehensive Metabolic Panel (CMP) to evaluate blood glucose, calcium, electrolytes, and liver function.",
    price: 700,
    labCategory: null, // Will be updated later
  },
  {
    description:
      "Thyroid Stimulating Hormone (TSH) test to measure thyroid function.",
    price: 400,
    labCategory: null, // Will be updated later
  },
  {
    description:
      "Hemoglobin A1c test to monitor average blood glucose levels over the past 2-3 months.",
    price: 550,
    labCategory: null, // Will be updated later
  },
  {
    description:
      "Liver Function Test (LFT) to evaluate liver health and function.",
    price: 650,
    labCategory: null, // Will be updated later
  },
  {
    description:
      "Kidney Function Test (KFT) to assess kidney health and function.",
    price: 600,
    labCategory: null, // Will be updated later
  },
  {
    description:
      "Urinalysis to check for signs of urinary tract infection or other kidney issues.",
    price: 300,
    labCategory: null, // Will be updated later
  },
  {
    description: "Vitamin D test to measure vitamin D levels in the blood.",
    price: 500,
    labCategory: null, // Will be updated later
  },
  {
    description:
      "Prostate-Specific Antigen (PSA) test to screen for prostate abnormalities.",
    price: 700,
    labCategory: null, // Will be updated later
  },
  {
    description:
      "Hematocrit test to measure the proportion of red blood cells in the blood.",
    price: 350,
    labCategory: null, // Will be updated later
  },
  {
    description:
      "Erythrocyte Sedimentation Rate (ESR) test to detect inflammation in the body.",
    price: 400,
    labCategory: null, // Will be updated later
  },
  {
    description:
      "Blood Culture test to detect bacterial infections in the blood.",
    price: 800,
    labCategory: null, // Will be updated later
  },
  {
    description:
      "Pregnancy test to detect the presence of human chorionic gonadotropin (hCG) hormone.",
    price: 250,
    labCategory: null, // Will be updated later
  },
  {
    description:
      "Lactate Dehydrogenase (LDH) test to measure levels of LDH enzyme in the blood.",
    price: 450,
    labCategory: null, // Will be updated later
  },
  {
    description:
      "C-Reactive Protein (CRP) test to detect inflammation or infection.",
    price: 500,
    labCategory: null, // Will be updated later
  },
  {
    description:
      "B-type Natriuretic Peptide (BNP) test to assess heart failure.",
    price: 750,
    labCategory: null, // Will be updated later
  },
  {
    description: "Ferritin test to measure iron stores in the body.",
    price: 550,
    labCategory: null, // Will be updated later
  },
  {
    description:
      "Antibody Panel test to detect specific antibodies in the blood.",
    price: 600,
    labCategory: null, // Will be updated later
  },
];

const diagnosticLabs = [
  {
    name: "City Health Lab",
    email: "cityhealthlab@example.com",
    contactNumber: "+91 9876543230",
    password: "hashedPassword21",
    role: "lab",
  },
  {
    name: "Metro Diagnostics",
    email: "metrodiagnostics@example.com",
    contactNumber: "+91 9876543231",
    password: "hashedPassword22",
    role: "lab",
  },
  {
    name: "LifeCare Labs",
    email: "lifecarelabs@example.com",
    contactNumber: "+91 9876543232",
    password: "hashedPassword23",
    role: "lab",
  },
  {
    name: "Wellness Diagnostics",
    email: "wellnessdiag@example.com",
    contactNumber: "+91 9876543233",
    password: "hashedPassword24",
    role: "lab",
  },
  {
    name: "Prime Path Lab",
    email: "primepath@example.com",
    contactNumber: "+91 9876543234",
    password: "hashedPassword25",
    role: "lab",
  },
  {
    name: "Healthway Diagnostics",
    email: "healthwaydiag@example.com",
    contactNumber: "+91 9876543235",
    password: "hashedPassword26",
    role: "lab",
  },
  {
    name: "Medlife Labs",
    email: "medlifelabs@example.com",
    contactNumber: "+91 9876543236",
    password: "hashedPassword27",
    role: "lab",
  },
  {
    name: "Accurate Diagnostics",
    email: "accuratediag@example.com",
    contactNumber: "+91 9876543237",
    password: "hashedPassword28",
    role: "lab",
  },
  {
    name: "QuickTest Labs",
    email: "quicktest@example.com",
    contactNumber: "+91 9876543238",
    password: "hashedPassword29",
    role: "lab",
  },
  {
    name: "Care & Cure Diagnostics",
    email: "carecurediag@example.com",
    contactNumber: "+91 9876543239",
    password: "hashedPassword30",
    role: "lab",
  },
];

const users = [
  {
    name: "Aarav Gupta",
    mobile: "+91 9876543240",
    email: "aarav@example.com",
    password: "hashedPassword31",
    otp: "123456",
    role: "user",
  },
  {
    name: "Diya Patel",
    mobile: "+91 9876543241",
    email: "diya@example.com",
    password: "hashedPassword32",
    otp: "234567",
    role: "councilor",
  },
  {
    name: "Arjun Sharma",
    mobile: "+91 9876543242",
    email: "arjun@example.com",
    password: "hashedPassword33",
    otp: "345678",
    role: "superAdmin",
  },
  {
    name: "Ananya Singh",
    mobile: "+91 9876543243",
    email: "ananya@example.com",
    password: "hashedPassword34",
    otp: "456789",
    role: "user",
  },
  {
    name: "Rohan Kapoor",
    mobile: "+91 9876543244",
    email: "rohan@example.com",
    password: "hashedPassword35",
    otp: "567890",
    role: "councilor",
  },
  {
    name: "Ishaan Mehta",
    mobile: "+91 9876543245",
    email: "ishaan@example.com",
    password: "hashedPassword36",
    otp: "678901",
    role: "user",
  },
  {
    name: "Zara Khan",
    mobile: "+91 9876543246",
    email: "zara@example.com",
    password: "hashedPassword37",
    otp: "789012",
    role: "user",
  },
  {
    name: "Riya Desai",
    mobile: "+91 9876543247",
    email: "riya@example.com",
    password: "hashedPassword38",
    otp: "890123",
    role: "councilor",
  },
  {
    name: "Vihaan Reddy",
    mobile: "+91 9876543248",
    email: "vihaan@example.com",
    password: "hashedPassword39",
    otp: "901234",
    role: "user",
  },
  {
    name: "Myra Joshi",
    mobile: "+91 9876543249",
    email: "myra@example.com",
    password: "hashedPassword40",
    otp: "012345",
    role: "superAdmin",
  },
];

const appointments = [
  {
    type: "Lab Test",
    age: 35,
    gender: "Male",
    problem: "Annual Health Checkup",
    problemDescription: "Routine health checkup",
    status: "Pending",
    appointmentDate: new Date("2024-08-15"),
    commission: { superAdminToFranchise: 15, superAdminToAgent: 10 },
    updatedBy: null,
    updatedByModel: null,
    totalAmount: 0,
  },
  {
    type: "Lab Test",
    age: 28,
    gender: "Female",
    problem: "Thyroid Check",
    problemDescription: "Experiencing fatigue and weight gain",
    status: "Approve",
    appointmentDate: new Date("2024-08-20"),
    commission: { superAdminToFranchise: 18, superAdminToAgent: 12 },
    updatedBy: null,
    updatedByModel: null,
    totalAmount: 0,
  },
  {
    type: "Lab Test",
    age: 45,
    gender: "Male",
    problem: "Diabetes Screening",
    problemDescription: "Family history of diabetes",
    status: "Approve",
    appointmentDate: new Date("2024-08-25"),
    commission: { superAdminToFranchise: 20, superAdminToAgent: 15 },
    updatedBy: null,
    updatedByModel: null,
    totalAmount: 0,
  },
  {
    type: "Lab Test",
    age: 52,
    gender: "Female",
    problem: "Liver Function",
    problemDescription: "Occasional abdominal pain",
    status: "Pending",
    appointmentDate: new Date("2024-09-01"),
    commission: { superAdminToFranchise: 17, superAdminToAgent: 11 },
    updatedBy: null,
    updatedByModel: null,
    totalAmount: 0,
  },
  {
    type: "Lab Test",
    age: 60,
    gender: "Male",
    problem: "Kidney Function",
    problemDescription: "Routine checkup for senior citizen",
    status: "Approve",
    appointmentDate: new Date("2024-09-05"),
    commission: { superAdminToFranchise: 19, superAdminToAgent: 13 },
    updatedBy: null,
    updatedByModel: null,
    totalAmount: 0,
  },
  {
    type: "Lab Test",
    age: 30,
    gender: "Female",
    problem: "Vitamin D Deficiency",
    problemDescription: "Feeling fatigued and weak",
    status: "Approve",
    appointmentDate: new Date("2024-09-10"),
    commission: { superAdminToFranchise: 16, superAdminToAgent: 10 },
    updatedBy: null,
    updatedByModel: null,
    totalAmount: 0,
  },
  {
    type: "Lab Test",
    age: 40,
    gender: "Male",
    problem: "Iron Deficiency",
    problemDescription: "Pale skin and shortness of breath",
    status: "Pending",
    appointmentDate: new Date("2024-09-15"),
    commission: { superAdminToFranchise: 18, superAdminToAgent: 12 },
    updatedBy: null,
    updatedByModel: null,
    totalAmount: 0,
  },
  {
    type: "Lab Test",
    age: 25,
    gender: "Female",
    problem: "Allergy Test",
    problemDescription: "Frequent sneezing and rashes",
    status: "Approve",
    appointmentDate: new Date("2024-09-20"),
    commission: { superAdminToFranchise: 20, superAdminToAgent: 14 },
    updatedBy: null,
    updatedByModel: null,
    totalAmount: 0,
  },
  {
    type: "Lab Test",
    age: 35,
    gender: "Male",
    problem: "Hormone Imbalance",
    problemDescription: "Unexplained weight gain and mood swings",
    status: "Approve",
    appointmentDate: new Date("2024-09-25"),
    commission: { superAdminToFranchise: 17, superAdminToAgent: 11 },
    updatedBy: null,
    updatedByModel: null,
    totalAmount: 0,
  },
  {
    type: "Lab Test",
    age: 50,
    gender: "Female",
    problem: "Comprehensive Health Checkup",
    problemDescription: "Annual full body checkup",
    status: "Pending",
    appointmentDate: new Date("2024-09-30"),
    commission: { superAdminToFranchise: 22, superAdminToAgent: 15 },
    updatedBy: null,
    updatedByModel: null,
    totalAmount: 0,
  },
];

const reports = [
  {
    details: "Complete Blood Count results",
    file: "https://example.com/reports/cbc_result.pdf",
  },
  {
    details: "Lipid Profile analysis",
    file: "https://example.com/reports/lipid_profile.pdf",
  },
  {
    details: "Thyroid Function Test report",
    file: "https://example.com/reports/thyroid_test.pdf",
  },
  {
    details: "Liver Function Test results",
    file: "https://example.com/reports/liver_function.pdf",
  },
  {
    details: "Kidney Function Test analysis",
    file: "https://example.com/reports/kidney_function.pdf",
  },
  {
    details: "Hemoglobin A1c Test results",
    file: "https://example.com/reports/hba1c_test.pdf",
  },
  {
    details: "Vitamin D Level assessment",
    file: "https://example.com/reports/vitamin_d_level.pdf",
  },
  {
    details: "Prostate-Specific Antigen (PSA) Test report",
    file: "https://example.com/reports/psa_test.pdf",
  },
  {
    details: "Comprehensive Metabolic Panel (CMP) analysis",
    file: "https://example.com/reports/cmp_analysis.pdf",
  },
  {
    details: "Urinalysis results",
    file: "https://example.com/reports/urinalysis.pdf",
  },
];

const labBoys = [
  {
    name: "Rahul Singh",
    email: "rahul.singh@example.com",
    password: "hashedPassword1",
    contactNumber: "+91 9876543250",
    role: "labBoy",
    assignedLab: null, // Will be updated later
    lastLogin: new Date("2024-08-20T09:30:00Z"),
    lastLogout: new Date("2024-08-20T17:30:00Z"),
  },
  {
    name: "Priya Patel",
    email: "priya.patel@example.com",
    password: "hashedPassword2",
    contactNumber: "+91 9876543251",
    role: "labBoy",
    assignedLab: null, // Will be updated later
    lastLogin: new Date("2024-08-21T08:45:00Z"),
    lastLogout: new Date("2024-08-21T16:45:00Z"),
  },
  {
    name: "Amit Kumar",
    email: "amit.kumar@example.com",
    password: "hashedPassword3",
    contactNumber: "+91 9876543252",
    role: "labBoy",
    assignedLab: null, // Will be updated later
    lastLogin: new Date("2024-08-22T10:00:00Z"),
    lastLogout: new Date("2024-08-22T18:00:00Z"),
  },
  {
    name: "Neha Sharma",
    email: "neha.sharma@example.com",
    password: "hashedPassword4",
    contactNumber: "+91 9876543253",
    role: "labBoy",
    assignedLab: null, // Will be updated later
    lastLogin: new Date("2024-08-23T09:15:00Z"),
    lastLogout: new Date("2024-08-23T17:15:00Z"),
  },
  {
    name: "Vikram Desai",
    email: "vikram.desai@example.com",
    password: "hashedPassword5",
    contactNumber: "+91 9876543254",
    role: "labBoy",
    assignedLab: null, // Will be updated later
    lastLogin: new Date("2024-08-24T08:30:00Z"),
    lastLogout: new Date("2024-08-24T16:30:00Z"),
  },
  {
    name: "Anjali Reddy",
    email: "anjali.reddy@example.com",
    password: "hashedPassword6",
    contactNumber: "+91 9876543255",
    role: "labBoy",
    assignedLab: null, // Will be updated later
    lastLogin: new Date("2024-08-25T09:45:00Z"),
    lastLogout: new Date("2024-08-25T17:45:00Z"),
  },
  {
    name: "Sanjay Gupta",
    email: "sanjay.gupta@example.com",
    password: "hashedPassword7",
    contactNumber: "+91 9876543256",
    role: "labBoy",
    assignedLab: null, // Will be updated later
    lastLogin: new Date("2024-08-26T10:15:00Z"),
    lastLogout: new Date("2024-08-26T18:15:00Z"),
  },
  {
    name: "Meera Kapoor",
    email: "meera.kapoor@example.com",
    password: "hashedPassword8",
    contactNumber: "+91 9876543257",
    role: "labBoy",
    assignedLab: null, // Will be updated later
    lastLogin: new Date("2024-08-27T09:00:00Z"),
    lastLogout: new Date("2024-08-27T17:00:00Z"),
  },
  {
    name: "Rajesh Verma",
    email: "rajesh.verma@example.com",
    password: "hashedPassword9",
    contactNumber: "+91 9876543258",
    role: "labBoy",
    assignedLab: null, // Will be updated later
    lastLogin: new Date("2024-08-28T08:15:00Z"),
    lastLogout: new Date("2024-08-28T16:15:00Z"),
  },
  {
    name: "Pooja Malhotra",
    email: "pooja.malhotra@example.com",
    password: "hashedPassword10",
    contactNumber: "+91 9876543259",
    role: "labBoy",
    assignedLab: null, // Will be updated later
    lastLogin: new Date("2024-08-29T09:30:00Z"),
    lastLogout: new Date("2024-08-29T17:30:00Z"),
  },
];

async function seedDatabase() {
  try {
    // Hash the password
    const hashedPassword = await hashPassword("12345");

    // Update passwords in all entities
    franchises.forEach((franchise) => (franchise.password = hashedPassword));
    agents.forEach((agent) => (agent.password = hashedPassword));
    diagnosticLabs.forEach((lab) => (lab.password = hashedPassword));
    users.forEach((user) => (user.password = hashedPassword));

    // Clear existing data
    await Location.deleteMany({});
    await Franchise.deleteMany({});
    await Agent.deleteMany({});
    await DiagnosticTest.deleteMany({});
    await DiagnosticLab.deleteMany({});
    await User.deleteMany({});
    await Appointment.deleteMany({});
    await LabCategory.deleteMany({});
    await Report.deleteMany({});
    // Clear existing lab boys
    await LabBoy.deleteMany({});

    // Insert new data
    const createdLocations = await Location.insertMany(locations);
    console.log("Locations seeded");

    const createdLabCategories = await LabCategory.insertMany(labCategories);
    console.log("Lab Categories seeded");

    // Update diagnostic tests with created lab category IDs
    diagnosticTests.forEach((test, index) => {
      test.labCategory =
        createdLabCategories[index % createdLabCategories.length]._id;
    });
    const createdDiagnosticTests = await DiagnosticTest.insertMany(
      diagnosticTests
    );
    console.log("Diagnostic Tests seeded");

    // Update franchises with created location IDs
    franchises.forEach((franchise, index) => {
      franchise.location = createdLocations[index]._id;
    });
    const createdFranchises = await Franchise.insertMany(franchises);
    console.log("Franchises seeded");

    // Update agents with created location and franchise IDs
    agents.forEach((agent, index) => {
      agent.location = createdLocations[index]._id;
      agent.franchise = createdFranchises[index]._id;
    });
    const createdAgents = await Agent.insertMany(agents);
    console.log("Agents seeded");

    // Update diagnostic labs with created location IDs and test IDs
    diagnosticLabs.forEach((lab, index) => {
      lab.address = createdLocations[index]._id;
      // Assign 10 random tests to each lab
      lab.testsOffered = getRandomTests(createdDiagnosticTests, 10);
    });
    const createdDiagnosticLabs = await DiagnosticLab.insertMany(
      diagnosticLabs
    );
    console.log("Diagnostic Labs seeded");

    const createdUsers = await User.insertMany(users);
    console.log("Users seeded");

    function calculateTotalAmount(appointment, diagnosticTests) {
      let totalAmount = 0;

      for (const testObj of appointment.labs.tests) {
        const test = diagnosticTests.find(
          (t) => t._id.toString() === testObj.test.toString()
        );
        if (test) {
          totalAmount += test.price;
        }
      }

      return totalAmount;
    }

    appointments.forEach((appointment, index) => {
      // Set referral
      appointment.referral = createdAgents[index % createdAgents.length]._id;

      // Set lab and tests
      const lab = createdDiagnosticLabs[index % createdDiagnosticLabs.length];
      appointment.labs = {
        lab: lab._id,
        tests: [],
      };

      // Assign 1-3 random tests from the lab's offered tests
      const testCount = Math.floor(Math.random() * 3) + 1;
      const labTests = getRandomTests(lab.testsOffered, testCount);
      appointment.labs.tests = labTests.map((testId) => {
        const status = ["Pending", "In Progress", "Completed"][
          Math.floor(Math.random() * 3)
        ];
        const updateModels = ["User", "DiagnosticLab"];
        const randomModel =
          updateModels[Math.floor(Math.random() * updateModels.length)];
        let updatedBy;

        switch (randomModel) {
          case "User":
            // Find a superAdmin or councilor
            const adminOrCouncilor = createdUsers.filter(
              (user) => user.role === "superAdmin" || user.role === "councilor"
            );
            if (adminOrCouncilor.length > 0) {
              updatedBy =
                adminOrCouncilor[
                  Math.floor(Math.random() * adminOrCouncilor.length)
                ]._id;
            } else {
              // Fallback to lab if no admin or councilor
              updatedBy = lab._id;
              randomModel = "DiagnosticLab";
            }
            break;
          case "DiagnosticLab":
            updatedBy = lab._id;
            break;
        }

        return {
          test: testId,
          status: status,
          updatedBy: updatedBy,
          updatedByModel: randomModel,
          updatedAt: new Date(),
        };
      });

      // Calculate total amount after setting up the tests
      appointment.totalAmount = calculateTotalAmount(
        appointment,
        createdDiagnosticTests
      );

      // Set other appointment fields (these remain unchanged)
      appointment.createdBy = createdUsers[index % createdUsers.length]._id;
      appointment.createdByModel = "User";

      const now = new Date();
      const futureDate = new Date(
        now.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000
      );
      appointment.appointmentDate = futureDate;

      appointment.status = ["Pending", "Approve", "Reject"][
        Math.floor(Math.random() * 3)
      ];

      appointment.commission = {
        superAdminToFranchise: Math.floor(Math.random() * 10) + 15,
        superAdminToAgent: Math.floor(Math.random() * 10) + 10,
      };
    });
    const createdAppointments = await Appointment.insertMany(appointments);
    console.log("Appointments seeded");

    // Seed reports
    const reportsToInsert = reports.map((report, index) => ({
      ...report,
      appointment: createdAppointments[index % createdAppointments.length]._id,
      generatedAt: new Date(
        Date.now() - Math.floor(Math.random() * 10000000000)
      ), // Random date within the last ~4 months
    }));

    await Report.insertMany(reportsToInsert);
    console.log("Reports seeded");

    // Assign labs to lab boys and set the common password
    const labBoysToInsert = labBoys.map((labBoy, index) => ({
      ...labBoy,
      password: hashedPassword,
      assignedLab:
        createdDiagnosticLabs[index % createdDiagnosticLabs.length]._id,
    }));

    // Insert lab boys
    const createdLabBoys = await LabBoy.insertMany(labBoysToInsert);
    console.log("Lab Boys seeded");

    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.disconnect();
  }
}

// Helper function to get random tests
function getRandomTests(tests, count) {
  const shuffled = tests.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map((test) => test._id);
}

seedDatabase();

//=======================================

// // Function to hash password
// async function hashPassword(password) {
//   const saltRounds = 10;
//   return await bcrypt.hash(password, saltRounds);
// }

// // Generate 25 locations
// const locations = Array.from({ length: 25 }, (_, i) => ({
//   address: `${i + 1} Main Street`,
//   city: ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai"][i % 5],
//   state: ["Maharashtra", "Delhi", "Karnataka", "Telangana", "Tamil Nadu"][
//     i % 5
//   ],
//   pinCode: `${400000 + i}`,
// }));

// // Generate 25 franchises
// const franchises = Array.from({ length: 25 }, (_, i) => ({
//   name: `Franchise ${i + 1}`,
//   contactNumber: `+91 98765432${i.toString().padStart(2, "0")}`,
//   email: `franchise${i + 1}@example.com`,
//   password: "12345", // This will be hashed later
//   role: "franchise",
//   lastLogin: new Date(),
//   lastLogout: new Date(),
// }));

// // Generate 25 agents
// const agents = Array.from({ length: 25 }, (_, i) => ({
//   name: `Agent ${i + 1}`,
//   email: `agent${i + 1}@example.com`,
//   password: "12345", // This will be hashed later
//   contact: `+91 87654321${i.toString().padStart(2, "0")}`,
//   role: "agent",
//   lastLogin: new Date(),
//   lastLogout: new Date(),
// }));

// // Generate 25 lab categories
// const labCategories = Array.from({ length: 25 }, (_, i) => ({
//   name: `Lab Category ${i + 1}`,
//   image: `https://example.com/images/category${i + 1}.jpg`,
// }));

// // Generate 25 diagnostic tests
// const diagnosticTests = Array.from({ length: 25 }, (_, i) => ({
//   description: `Diagnostic Test ${i + 1}`,
//   price: 500 + i * 100,
//   labCategory: null, // Will be updated later
// }));

// // Generate 25 diagnostic labs
// const diagnosticLabs = Array.from({ length: 25 }, (_, i) => ({
//   name: `Diagnostic Lab ${i + 1}`,
//   email: `lab${i + 1}@example.com`,
//   contactNumber: `+91 76543210${i.toString().padStart(2, "0")}`,
//   password: "12345", // This will be hashed later
//   role: "lab",
//   isLabLogIn: false,
//   handleView: false,
//   lastLogin: new Date(),
//   lastLogout: new Date(),
// }));

// // Generate 25 users
// const users = Array.from({ length: 25 }, (_, i) => ({
//   name: `User ${i + 1}`,
//   mobile: `+91 65432109${i.toString().padStart(2, "0")}`,
//   email: `user${i + 1}@example.com`,
//   password: "12345", // This will be hashed later
//   otp: "123456",
//   role: ["user", "councilor", "superAdmin"][i % 3],
//   assignedCounselor: null,
//   adminDetails: {},
//   profileImage: "",
//   lastLogin: new Date(),
//   lastLogout: new Date(),
// }));

// // Generate 25 appointments
// const appointments = Array.from({ length: 25 }, (_, i) => ({
//   type: "Lab Test",
//   age: 20 + i,
//   gender: i % 2 === 0 ? "Male" : "Female",
//   problem: `Health Issue ${i + 1}`,
//   problemDescription: `Description for health issue ${i + 1}`,
//   status: ["Pending", "Approve", "Reject"][i % 3],
//   appointmentDate: new Date(Date.now() + i * 86400000), // Each appointment is a day apart
//   commission: {
//     superAdminToFranchise: 15 + (i % 10),
//     superAdminToAgent: 10 + (i % 10),
//   },
// }));

// // Generate 25 reports
// const reports = Array.from({ length: 25 }, (_, i) => ({
//   details: `Report details for Test ${i + 1}`,
//   file: `https://example.com/reports/report${i + 1}.pdf`,
// }));

// async function seedDatabase() {
//   try {
//     // // Connect to MongoDB
//     // await mongoose.connect("your_mongodb_connection_string_here", {
//     //   useNewUrlParser: true,
//     //   useUnifiedTopology: true,
//     // });

//     // Hash the password
//     const hashedPassword = await hashPassword("12345");

//     // Update passwords in all entities
//     franchises.forEach((franchise) => (franchise.password = hashedPassword));
//     agents.forEach((agent) => (agent.password = hashedPassword));
//     diagnosticLabs.forEach((lab) => (lab.password = hashedPassword));
//     users.forEach((user) => (user.password = hashedPassword));

//     // Clear existing data
// await Location.deleteMany({});
// await Franchise.deleteMany({});
// await Agent.deleteMany({});
// await DiagnosticTest.deleteMany({});
// await DiagnosticLab.deleteMany({});
// await User.deleteMany({});
// await Appointment.deleteMany({});
// await LabCategory.deleteMany({});
// await Report.deleteMany({});

//     // Insert new data
//     const createdLocations = await Location.insertMany(locations);
//     const createdLabCategories = await LabCategory.insertMany(labCategories);

//     // Update diagnostic tests with created lab category IDs
//     diagnosticTests.forEach((test, index) => {
//       test.labCategory = createdLabCategories[index]._id;
//     });
//     const createdDiagnosticTests = await DiagnosticTest.insertMany(
//       diagnosticTests
//     );

//     // Update franchises with created location IDs
//     franchises.forEach((franchise, index) => {
//       franchise.location = createdLocations[index]._id;
//     });
//     const createdFranchises = await Franchise.insertMany(franchises);

//     // Update agents with created location and franchise IDs
//     agents.forEach((agent, index) => {
//       agent.location = createdLocations[index]._id;
//       agent.franchise = createdFranchises[index]._id;
//     });
//     const createdAgents = await Agent.insertMany(agents);

//     // Update diagnostic labs with created location IDs and test IDs
//     diagnosticLabs.forEach((lab, index) => {
//       lab.address = createdLocations[index]._id;
//       lab.testsOffered = createdDiagnosticTests
//         .slice(0, 10)
//         .map((test) => test._id); // Assign first 10 tests to each lab
//     });
//     const createdDiagnosticLabs = await DiagnosticLab.insertMany(
//       diagnosticLabs
//     );

//     const createdUsers = await User.insertMany(users);

//     // Update appointments
//     appointments.forEach((appointment, index) => {
//       appointment.referral = createdAgents[index % createdAgents.length]._id;
//       appointment.labs = {
//         lab: createdDiagnosticLabs[index % createdDiagnosticLabs.length]._id,
//         tests: createdDiagnosticTests.slice(0, 5).map((test) => ({
//           test: test._id,
//           status: ["Pending", "In Progress", "Completed", "Closed"][index % 4],
//           updatedBy: createdUsers[index % createdUsers.length]._id,
//           updatedByModel: "User",
//           updatedAt: new Date(),
//         })),
//       };
//       appointment.createdBy = createdUsers[index % createdUsers.length]._id;
//       appointment.createdByModel = "User";
//     });
//     const createdAppointments = await Appointment.insertMany(appointments);

//     // Update reports with appointment IDs
//     reports.forEach((report, index) => {
//       report.appointment = createdAppointments[index]._id;
//     });
//     await Report.insertMany(reports);

//     console.log("Database seeded successfully with 25 entries for each model");
//   } catch (error) {
//     console.error("Error seeding database:", error);
//   } finally {
//     await mongoose.disconnect();
//   }
// }

// seedDatabase();
//=============================================================

// mongoose.connect(
//   "mongodb+srv://shahzad201415:L6drIrBh0AYy97yN@cluster0.drcxrzd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
// );

// const PASSWORD = "12345";
// const hashedPassword = bcrypt.hashSync(PASSWORD, 10);

// async function seedData() {
//   try {
//     await mongoose.connection.dropDatabase();

//     await Location.deleteMany({});
//     await Franchise.deleteMany({});
//     await Agent.deleteMany({});
//     await DiagnosticTest.deleteMany({});
//     await DiagnosticLab.deleteMany({});
//     await User.deleteMany({});
//     await Appointment.deleteMany({});
//     await LabCategory.deleteMany({});
//     await Report.deleteMany({});
//     await SalesRange.deleteMany({});
//     // Seed Locations
//     const locations = [];
//     for (let i = 0; i < 100; i++) {
//       const location = new Location({
//         address: faker.address.streetAddress(),
//         city: faker.address.city(),
//         state: faker.address.state(),
//         pinCode: faker.address.zipCode(),
//       });
//       locations.push(location);
//     }
//     await Location.insertMany(locations);

//     // Seed Franchises
//     const franchises = [];
//     for (let i = 0; i < 50; i++) {
//       const franchise = new Franchise({
//         name: faker.company.name(),
//         contactNumber: faker.phone.number(),
//         email: faker.internet.email(),
//         password: hashedPassword,
//         location: faker.helpers.arrayElement(locations)._id,
//       });
//       franchises.push(franchise);
//     }
//     await Franchise.insertMany(franchises);

//     // Seed Users
//     const users = [];
//     for (let i = 0; i < 100; i++) {
//       const user = new User({
//         name: faker.name.fullName(),
//         mobile: faker.phone.number(),
//         email: faker.internet.email(),
//         password: hashedPassword,
//         otp: faker.random.alphaNumeric(6),
//         role: faker.helpers.arrayElement(["user", "councilor", "superAdmin"]),
//       });
//       users.push(user);
//     }
//     await User.insertMany(users);

//     // Seed Agents
//     const agents = [];
//     for (let i = 0; i < 500; i++) {
//       const agent = new Agent({
//         name: faker.name.fullName(),
//         email: faker.internet.email(),
//         password: hashedPassword,
//         contact: faker.phone.number(),
//         location: faker.helpers.arrayElement(locations)._id,
//         franchise: faker.helpers.arrayElement(franchises)._id,
//       });
//       agents.push(agent);
//     }
//     await Agent.insertMany(agents);

//     // Seed Lab Categories
//     const labCategories = [];
//     for (let i = 0; i < 20; i++) {
//       const category = new LabCategory({
//         name: faker.commerce.department(),
//       });
//       labCategories.push(category);
//     }
//     await LabCategory.insertMany(labCategories);

//     // Seed Diagnostic Labs and Tests
//     const labs = [];
//     const tests = [];
//     for (let i = 0; i < 200; i++) {
//       const lab = new DiagnosticLab({
//         name: faker.company.name(),
//         email: faker.internet.email(),
//         address: faker.helpers.arrayElement(locations)._id,
//         contactNumber: faker.phone.number(),
//         password: hashedPassword,
//       });
//       labs.push(lab);

//       for (let j = 0; j < 10; j++) {
//         const test = new DiagnosticTest({
//           description: faker.lorem.sentence(),
//           price: faker.commerce.price(200, 3000),
//           labCategory: faker.helpers.arrayElement(labCategories)._id,
//         });
//         tests.push(test);
//       }
//     }
//     await DiagnosticLab.insertMany(labs);
//     await DiagnosticTest.insertMany(tests);

//     // Seed Sales Ranges
//     const salesRanges = [
//       {
//         name: "0 to 5 Lakh",
//         minAmount: 0,
//         maxAmount: 500000,
//         franchiseCommissionPercentage: 10,
//         agentCommissionPercentage: 5,
//       },
//       {
//         name: "5 to 10 Lakh",
//         minAmount: 500001,
//         maxAmount: 1000000,
//         franchiseCommissionPercentage: 12,
//         agentCommissionPercentage: 6,
//       },
//       {
//         name: "10 to 15 Lakh",
//         minAmount: 1000001,
//         maxAmount: 1500000,
//         franchiseCommissionPercentage: 14,
//         agentCommissionPercentage: 7,
//       },
//       {
//         name: "15 to 20 Lakh",
//         minAmount: 1500001,
//         maxAmount: 2000000,
//         franchiseCommissionPercentage: 14,
//         agentCommissionPercentage: 7,
//       },
//     ];
//     await SalesRange.insertMany(salesRanges);

//     // // Seed Appointments
//     // const appointments = [];
//     // const startDate = new Date(2023, 0, 1); // January 1, 2023
//     // const endDate = new Date(); // Current date
//     // const dayRange = (endDate - startDate) / (1000 * 60 * 60 * 24);

//     // for (let i = 0; i < 1000; i++) {
//     //   const appointmentDate = new Date(
//     //     startDate.getTime() +
//     //       Math.random() * (endDate.getTime() - startDate.getTime())
//     //   );

//     //   // Select a random number of tests (1 to 5) for this appointment
//     //   const numTests = Math.floor(Math.random() * 5) + 1;
//     //   const appointmentTests = [];
//     //   let totalAmount = 0;

//     //   for (let j = 0; j < numTests; j++) {
//     //     const randomTest = faker.helpers.arrayElement(tests);
//     //     appointmentTests.push({
//     //       test: randomTest._id,
//     //       status: "Closed",
//     //     });
//     //     totalAmount += randomTest.price;
//     //   }

//     //   const appointment = new Appointment({
//     //     type: faker.lorem.word(),
//     //     age: faker.datatype.number({ min: 18, max: 65 }),
//     //     gender: faker.helpers.arrayElement(["Male", "Female", "Other"]),
//     //     problem: faker.lorem.sentence(),
//     //     problemDescription: faker.lorem.paragraph(),
//     //     referral: faker.helpers.arrayElement(agents)._id,
//     //     labs: {
//     //       lab: faker.helpers.arrayElement(labs)._id,
//     //       tests: appointmentTests,
//     //     },
//     //     status: faker.helpers.arrayElement(["Pending", "Approve", "Reject"]),
//     //     appointmentDate: appointmentDate,
//     //     createdBy: faker.helpers.arrayElement(users)._id,
//     //     createdByModel: faker.helpers.arrayElement([
//     //       "User",
//     //       // "Agent",
//     //       // "Franchise",
//     //       // "SuperAdmin",
//     //     ]),
//     //     commission: {
//     //       superAdminToFranchise: faker.datatype.number({ min: 0, max: 100 }),
//     //       superAdminToAgent: faker.datatype.number({ min: 0, max: 100 }),
//     //     },
//     //     totalAmount: totalAmount, // Set total amount based on sum of test prices
//     //   });
//     //   appointments.push(appointment);
//     // }
//     // await Appointment.insertMany(appointments);

//     // Seed Appointments
//     const appointments = [];

//     // Set the start and end date to cover a 3-month period
//     const startDate = new Date(2023, 0, 1); // January 1, 2023
//     const endDate = new Date(
//       startDate.getFullYear(),
//       startDate.getMonth() + 3,
//       startDate.getDate()
//     ); // 3 months after start date

//     for (let i = 0; i < 1000; i++) {
//       const appointmentDate = new Date(
//         startDate.getTime() +
//           Math.random() * (endDate.getTime() - startDate.getTime())
//       );

//       // Select a random number of tests (1 to 5) for this appointment
//       const numTests = Math.floor(Math.random() * 5) + 1;
//       const appointmentTests = [];
//       let totalAmount = 0;

//       for (let j = 0; j < numTests; j++) {
//         const randomTest = faker.helpers.arrayElement(tests);
//         appointmentTests.push({
//           test: randomTest._id,
//           status: "Closed",
//         });
//         totalAmount += randomTest.price;
//       }

//       const appointment = new Appointment({
//         type: faker.lorem.word(),
//         age: faker.datatype.number({ min: 18, max: 65 }),
//         gender: faker.helpers.arrayElement(["Male", "Female", "Other"]),
//         problem: faker.lorem.sentence(),
//         problemDescription: faker.lorem.paragraph(),
//         referral: faker.helpers.arrayElement(agents)._id,
//         labs: {
//           lab: faker.helpers.arrayElement(labs)._id,
//           tests: appointmentTests,
//         },
//         status: faker.helpers.arrayElement(["Approve"]),
//         appointmentDate: appointmentDate,
//         createdBy: faker.helpers.arrayElement(users)._id,
//         createdByModel: faker.helpers.arrayElement([
//           "User",
//           // "Agent",
//           // "Franchise",
//           // "SuperAdmin",
//         ]),
//         commission: {
//           superAdminToFranchise: faker.datatype.number({ min: 0, max: 100 }),
//           superAdminToAgent: faker.datatype.number({ min: 0, max: 100 }),
//         },
//         totalAmount: totalAmount, // Set total amount based on sum of test prices
//       });
//       appointments.push(appointment);
//     }
//     await Appointment.insertMany(appointments);

//     // Seed Reports
//     const reports = [];
//     for (let i = 0; i < 500; i++) {
//       const report = new Report({
//         appointment: faker.helpers.arrayElement(appointments)._id,
//         details: faker.lorem.paragraph(),
//         file: faker.system.filePath(),
//       });
//       reports.push(report);
//     }
//     await Report.insertMany(reports);

//     console.log("Data seeded successfully");
//   } catch (error) {
//     console.error("Error seeding data:", error);
//   } finally {
//     mongoose.connection.close();
//   }
// }

// seedData();
//=========

// async function seedData() {
//   try {
//     await mongoose.connection.dropDatabase();

//     await Location.deleteMany({});
//     await Franchise.deleteMany({});
//     await Agent.deleteMany({});
//     await DiagnosticTest.deleteMany({});
//     await DiagnosticLab.deleteMany({});
//     await User.deleteMany({});
//     await Appointment.deleteMany({});
//     await LabCategory.deleteMany({});
//     await Report.deleteMany({});
//     await SalesRange.deleteMany({});

//     // Seed Locations
//     const locations = [];
//     for (let i = 0; i < 100; i++) {
//       const location = new Location({
//         address: faker.address.streetAddress(),
//         city: faker.address.city(),
//         state: faker.address.state(),
//         pinCode: faker.address.zipCode(),
//       });
//       locations.push(location);
//     }
//     await Location.insertMany(locations);

//     // Seed Franchises
//     const franchises = [];
//     for (let i = 0; i < 50; i++) {
//       const franchise = new Franchise({
//         name: faker.company.name(),
//         contactNumber: faker.phone.number(),
//         email: faker.internet.email(),
//         password: hashedPassword,
//         location: faker.helpers.arrayElement(locations)._id,
//       });
//       franchises.push(franchise);
//     }
//     await Franchise.insertMany(franchises);

//     // Seed Users
//     const users = [];
//     for (let i = 0; i < 100; i++) {
//       const user = new User({
//         name: faker.name.fullName(),
//         mobile: faker.phone.number(),
//         email: faker.internet.email(),
//         password: hashedPassword,
//         otp: faker.random.alphaNumeric(6),
//         role: faker.helpers.arrayElement(["user", "councilor", "superAdmin"]),
//       });
//       users.push(user);
//     }
//     await User.insertMany(users);

//     // Seed Agents
//     const agents = [];
//     for (let i = 0; i < 500; i++) {
//       const agent = new Agent({
//         name: faker.name.fullName(),
//         email: faker.internet.email(),
//         password: hashedPassword,
//         contact: faker.phone.number(),
//         location: faker.helpers.arrayElement(locations)._id,
//         franchise: faker.helpers.arrayElement(franchises)._id,
//       });
//       agents.push(agent);
//     }
//     await Agent.insertMany(agents);

//     // Seed Lab Categories
//     const labCategories = [];
//     for (let i = 0; i < 20; i++) {
//       const category = new LabCategory({
//         name: faker.commerce.department(),
//       });
//       labCategories.push(category);
//     }
//     await LabCategory.insertMany(labCategories);

//     // Seed Diagnostic Labs and Tests
//     const labs = [];
//     const tests = [];
//     for (let i = 0; i < 200; i++) {
//       const lab = new DiagnosticLab({
//         name: faker.company.name(),
//         email: faker.internet.email(),
//         address: faker.helpers.arrayElement(locations)._id,
//         contactNumber: faker.phone.number(),
//         password: hashedPassword,
//       });
//       labs.push(lab);

//       for (let j = 0; j < 10; j++) {
//         const test = new DiagnosticTest({
//           description: faker.lorem.sentence(),
//           price: faker.commerce.price(200, 3000),
//           labCategory: faker.helpers.arrayElement(labCategories)._id,
//         });
//         tests.push(test);
//       }
//     }
//     await DiagnosticLab.insertMany(labs);
//     await DiagnosticTest.insertMany(tests);

//     // Seed Sales Ranges
//     const salesRanges = [
//       {
//         name: "0 to 5 Lakh",
//         minAmount: 0,
//         maxAmount: 500000,
//         franchiseCommissionPercentage: 10,
//         agentCommissionPercentage: 5,
//       },
//       {
//         name: "5 to 10 Lakh",
//         minAmount: 500001,
//         maxAmount: 1000000,
//         franchiseCommissionPercentage: 12,
//         agentCommissionPercentage: 6,
//       },
//       {
//         name: "10 to 15 Lakh",
//         minAmount: 1000001,
//         maxAmount: 1500000,
//         franchiseCommissionPercentage: 14,
//         agentCommissionPercentage: 7,
//       },
//       {
//         name: "15 to 20 Lakh",
//         minAmount: 1500001,
//         maxAmount: 2000000,
//         franchiseCommissionPercentage: 14,
//         agentCommissionPercentage: 7,
//       },
//     ];
//     await SalesRange.insertMany(salesRanges);

//     // Seed Appointments
//     const appointments = [];
//     const months = [
//       {
//         month: "April",
//         start: new Date(2024, 3, 1),
//         end: new Date(2024, 3, 30),
//       },
//       {
//         month: "May",
//         start: new Date(2024, 4, 1),
//         end: new Date(2024, 4, 31),
//       },
//       {
//         month: "June",
//         start: new Date(2024, 5, 1),
//         end: new Date(2024, 5, 30),
//       },
//       {
//         month: "July",
//         start: new Date(2024, 6, 1),
//         end: new Date(2024, 6, 31),
//       },
//     ];

//     for (const month of months) {
//       for (let i = 0; i < 200; i++) {
//         // Randomly select a sales range
//         const range = faker.helpers.arrayElement(salesRanges);
//         const minAmount = range.minAmount;
//         const maxAmount = range.maxAmount;

//         const appointmentDate = faker.date.between(month.start, month.end);

//         // Select a random number of tests (1 to 5) for this appointment
//         const numTests = Math.floor(Math.random() * 5) + 1;
//         const appointmentTests = [];
//         let totalAmount = 0;

//         for (let j = 0; j < numTests; j++) {
//           const randomTest = faker.helpers.arrayElement(tests);
//           appointmentTests.push({
//             test: randomTest._id,
//             status: faker.helpers.arrayElement(["Closed", "Completed"]),
//           });
//           totalAmount += randomTest.price;
//         }

//         // Ensure the total amount fits within the selected range
//         if (totalAmount < minAmount) {
//           totalAmount = minAmount;
//         } else if (totalAmount > maxAmount) {
//           totalAmount = maxAmount;
//         }

//         const appointment = new Appointment({
//           type: faker.lorem.word(),
//           age: faker.datatype.number({ min: 18, max: 65 }),
//           gender: faker.helpers.arrayElement(["Male", "Female", "Other"]),
//           problem: faker.lorem.sentence(),
//           problemDescription: faker.lorem.paragraph(),
//           referral: faker.helpers.arrayElement(agents)._id,
//           labs: {
//             lab: faker.helpers.arrayElement(labs)._id,
//             tests: appointmentTests,
//           },
//           status: faker.helpers.arrayElement(["Approve"]),
//           appointmentDate: appointmentDate,
//           createdBy: faker.helpers.arrayElement(users)._id,
//           createdByModel: faker.helpers.arrayElement(["User"]),
//           commission: {
//             superAdminToFranchise: faker.datatype.number({ min: 0, max: 100 }),
//             superAdminToAgent: faker.datatype.number({ min: 0, max: 100 }),
//           },
//           totalAmount: totalAmount, // Set total amount based on range
//         });
//         appointments.push(appointment);
//       }
//     }
//     await Appointment.insertMany(appointments);

//     // Seed Reports
//     const reports = [];
//     for (let i = 0; i < 500; i++) {
//       const report = new Report({
//         appointment: faker.helpers.arrayElement(appointments)._id,
//         details: faker.lorem.paragraph(),
//         file: faker.system.filePath(),
//       });
//       reports.push(report);
//     }
//     await Report.insertMany(reports);

//     console.log("Data seeded successfully");
//   } catch (error) {
//     console.error("Error seeding data:", error);
//   } finally {
//     mongoose.connection.close();
//   }
// }

// seedData();
