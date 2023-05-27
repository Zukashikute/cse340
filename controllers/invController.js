const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
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
}

/* ***************************
 *  Build inventory by id view
 * ************************** */
invCont.buildByInventoryId = async (req, res, next) => {
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
}

module.exports = invCont