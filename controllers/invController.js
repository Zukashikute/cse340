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
         title: className + " Vehicles",
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

/* ***************************
 *  Build inventory by id view
 * ************************** */
invCont.buildByInventoryId = async (req, res, next) => {
   try {
      const inv_id = req.params.inventoryId;
      const data = await invModel.getVehicleByInventoryId(inv_id);
      const detail = await utilities.buildDetailView(data);
      let nav = await utilities.getNav();
      const vehicleYear = data[0].inv_year
      const vehicleMake = data[0].inv_make;
      const vehicleModel = data[0].inv_model;
      res.render("./inventory/detail", {
         title: vehicleYear + " " + vehicleMake + " " + vehicleModel,
         nav,
         detail,
      });
   } catch (error) {
      // Handle the error here
      console.error("Error in buildByInventoryId:", error);
      // You can choose to render an error page, redirect, or send an error response
      res.status(500).send("Internal Server Error");
   }
}

module.exports = invCont