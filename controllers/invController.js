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
   res.render("inventory/classification", {
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
   res.render("inventory/detail", {
      title: vehicleYear + " " + vehicleMake + " " + vehicleModel,
      nav,
      detail,
   });
}

/* ***************************
 *  Build vehicle management view
 * ************************** */
invCont.buildVehicleManagement = async (req, res, next) => {
   let nav = await utilities.getNav()
   const management = utilities.buildVehicleManagementView();
   res.render("inventory/management", {
      title: "Vehicle Management",
      nav,
      management,
   });
}

/* ***************************
 *  Build vehicle management view
 * ************************** */
invCont.buildAddClassification = async (req, res, next) => {
   let nav = await utilities.getNav()
   res.render("inventory/addclassification", {
      title: "Add New Classification",
      nav,
      errors: null,
   });
}

invCont.addClassification = async function (req, res) {
   const { classification_name } = req.body
   const addResult = await invModel.registerAddClassification(classification_name)
   let nav = await utilities.getNav()
   const management = utilities.buildVehicleManagementView();

   if (addResult) {
      req.flash(
         "notice",
         `The ${classification_name} classification was succesfully added.`

      )
      res.status(201).render("inventory/management", {
         title: "Vehicle Management",
         nav,
         errors: null,
         management

      })
   } else {
      req.flash("notice", "Sorry, the operation failed.")
      res.status(501).render("inventory/addclassification", {
         title: "Add Classification",
         nav,
      })
   }
}


/* ***************************
 *  Build vehicle management view
 * ************************** */
invCont.buildAddInventory = async (req, res, next) => {
   let nav = await utilities.getNav()
   let options = await utilities.buildOptions()
   res.render("inventory/addinventory", {
      title: "Add New Inventory",
      nav,
      options,
      errors: null,
   });
}

invCont.addInventory = async function (req, res) {
   const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
   const addResult = await invModel.registerAddinventory(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color)
   let nav = await utilities.getNav()
   const management = utilities.buildVehicleManagementView();
   if (addResult) {
      req.flash(
         "notice",
         `The ${inv_model} vehicle was succesfully added.`

      )
      res.status(201).render("inventory/management", {
         title: "Vehicle Management",
         nav,
         errors: null,
         management,
      })
   } else {
      req.flash("notice", "Sorry, the operation failed.")
      res.status(501).render("inventory/addinventory", {
         title: "Add Inventory",
         nav,
      })
   }
}



module.exports = invCont