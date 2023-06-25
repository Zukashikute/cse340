const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async (req, res, next) => {
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
   const classificationSelect = await utilities.buildOptions()
   res.render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
      classificationSelect,
   });
}

/* ***************************
 *  Build adding classification view
 * ************************** */
invCont.buildAddClassification = async (req, res, next) => {
   let nav = await utilities.getNav()
   res.render("inventory/addclassification", {
      title: "Add New Classification",
      nav,
      errors: null,
   });
}

invCont.addClassification = async (req, res) => {
   const { classification_name } = req.body
   const addResult = await invModel.registerAddClassification(classification_name)
   let nav = await utilities.getNav()
   let classificationSelect = await utilities.buildOptions()
   if (addResult) {
      req.flash(
         "notice",
         `The ${classification_name} classification was succesfully added.`
      )
      res.status(201).render("inventory/management", {
         title: "Vehicle Management",
         nav,
         errors: null,
         classificationSelect
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

invCont.addInventory = async (req, res) => {
   const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
   const addResult = await invModel.registerAddinventory(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color)
   let nav = await utilities.getNav()
   let classificationSelect = await utilities.buildOptions()
   if (addResult) {
      req.flash(
         "notice",
         `The ${inv_model} vehicle was succesfully added.`
      )
      res.status(201).render("inventory/management", {
         title: "Vehicle Management",
         nav,
         errors: null,
         classificationSelect,
      })
   } else {
      req.flash("notice", "Sorry, the operation failed.")
      res.status(501).render("inventory/addinventory", {
         title: "Add Inventory",
         nav,
      })
   }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
   const classification_id = parseInt(req.params.classification_id)
   const invData = await invModel.getInventoryByClassificationId(classification_id)
   if (invData[0].inv_id) {
      return res.json(invData)
   } else {
      next(new Error("No data returned"))
   }
}

/* ***************************
 *  Unit 05: Update an Inventory Item (Build inventory id view) 
 * ************************** */
invCont.buildEditInventory = async (req, res, next) => {
   const inv_id = parseInt(req.params.inv_id)
   let nav = await utilities.getNav()
   let data = await invModel.getVehicleByInventoryId(inv_id)
   let options = await utilities.buildOptions(data[0].classification_id)
   const name = `${data[0].inv_make} ${data[0].inv_model}`;
   res.render("inventory/editinventory", {
      title: `Edit ${name} `,
      nav,
      options: options,
      errors: null,
      inv_id: data[0].inv_id,
      inv_make: data[0].inv_make,
      inv_model: data[0].inv_model,
      inv_year: data[0].inv_year,
      inv_description: data[0].inv_description,
      inv_image: data[0].inv_image,
      inv_thumbnail: data[0].inv_thumbnail,
      inv_price: data[0].inv_price,
      inv_miles: data[0].inv_miles,
      inv_color: data[0].inv_color,
      classification_id: data[0].classification_id
   });
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async (req, res, next) => {
   let nav = await utilities.getNav()
   const {
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
   } = req.body
   const updateResult = await invModel.updateInventory(
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
   )

   if (updateResult) {
      const itemName = updateResult.inv_make + " " + updateResult.inv_model
      req.flash("notice", `The ${itemName} was successfully updated.`)
      res.redirect("/inv/")
   } else {
      const classificationSelect = await utilities.buildOptions(classification_id)
      const itemName = `${inv_make} ${inv_model}`
      req.flash("notice", "Sorry, the insert failed.")
      res.status(501).render("inventory/editinventory", {
         title: "Edit " + itemName,
         nav,
         classificationSelect: classificationSelect,
         errors: null,
         inv_id,
         inv_make,
         inv_model,
         inv_year,
         inv_description,
         inv_image,
         inv_thumbnail,
         inv_price,
         inv_miles,
         inv_color,
         classification_id
      })
   }
}

/* ***************************
 *  Unit 05: Delete an Inventory Item (Build delete inventory view) 
 * ************************** */
invCont.buildDeleteInventory = async (req, res, next) => {
   const inv_id = parseInt(req.params.inv_id)
   let nav = await utilities.getNav()
   let data = await invModel.getVehicleByInventoryId(inv_id)
   const name = `${data[0].inv_make} ${data[0].inv_model}`;
   res.render("inventory/deleteconfirm", {
      title: `Deleting ${name} `,
      nav,
      errors: null,
      inv_id: data[0].inv_id,
      inv_make: data[0].inv_make,
      inv_model: data[0].inv_model,
      inv_year: data[0].inv_year,
      inv_price: data[0].inv_price,
      classification_id: data[0].classification_id
   });
}

/* ***************************
 *  Process deleting Inventory Data
 * ************************** */
invCont.deleteInventory = async (req, res, next) => {
   const inv_id = parseInt(req.body.inv_id)
   let data = await invModel.getVehicleByInventoryId(inv_id)
   const name = `${data[0].inv_make} ${data[0].inv_model}`;
   const deleteResult = await invModel.deleteInventoryItem(inv_id)

   if (deleteResult) {
      req.flash("notice", `The ${name} was successfully deleted.`)
      res.redirect("/inv/")
   } else {
      req.flash("notice", `Sorry, ${name} deletion failed.`)
      res.redirect("/inv/delete/invId")
   }
}

module.exports = invCont