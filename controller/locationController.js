const Location = require("../model/location");

exports.getLocationById = async (req, res) => {
  try {
    const { locationId } = req.body;
    // Find the location by ID
    const location = await Location.findById(locationId);

    if (!location) {
      // If no location is found, send a 404 response
      return res.status(404).json({ message: "Location not found" });
    }

    // Send the found location as the response
    res.status(200).json(location);
  } catch (error) {
    // Handle any errors that occur during the query
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
