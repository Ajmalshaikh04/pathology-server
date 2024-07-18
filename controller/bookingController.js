const appointment = require("../model/appointment");

const createAppointemnt = async (req, res) => {
  try {
    const { type, age, gender, problem, problemdistription } = req.body;

    const res2 = await appointment.create({
      type: type,
      age: age,
      gender: gender,
      problem: problem,
      problemdistription: problemdistription || "",
    });
    return res
      .status(201)
      .json({ success: true, message: "appointment created", data: res2 });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = {
  createAppointemnt,
};
