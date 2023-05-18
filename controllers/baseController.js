const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function (req, res) {
  try {
    const nav = await utilities.getNav();
    res.render("index", { title: "Home", nav });
  } catch (error) {
    // Handle the error here
    console.error("Error retrieving navigation:", error);
    // You can choose to render an error page, redirect, or send an error response
    res.status(500).send("Internal Server Error");
  }
}

module.exports = baseController