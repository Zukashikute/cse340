const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
   try {
      const classification_id = req.params.classificationId;
      const data = await invModel.getInventoryByClassificationId(classification_id);
      const grid = await utilities.buildClassificationGrid(data);
      let nav = await utilities.getNav();
      const className = data[0].classification_name;
      res.render("./inventory/classification", {
         title: className + " vehicles",
         nav,
         grid,
      });
   } catch (error) {
      // Handle the error here
      console.error("Error in buildByClassificationId:", error);
      // You can choose to render an error page, redirect, or send an error response
      res.status(500).send("Internal Server Error");
   }
}

module.exports = invCont