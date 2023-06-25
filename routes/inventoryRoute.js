// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const classValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by vehicle view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

// Route to build management vehicle view
router.get("/", utilities.handleErrors(invController.buildVehicleManagement));

// Route to Add Classification View
router.get("/addclassification", utilities.handleErrors(invController.buildAddClassification));

// Route to Add Inventory View
router.get("/addinventory", utilities.handleErrors(invController.buildAddInventory));

// Process the add Classification data
router.post('/addclassification', classValidate.classificationRules(),
   classValidate.checkClassData,
   utilities.handleErrors(invController.addClassification));

// Process the add Inventory data
router.post('/addinventory', classValidate.inventoryRules(),
   classValidate.checkInvData,
   utilities.handleErrors(invController.addInventory));

// Select an Item from Inventory Activity
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Update an Item from Inventory Activity
router.get("/edit/:inv_id", utilities.handleErrors(invController.buildEditInventory))

// Processing the update of an Item from Inventory Activity
router.post("/update/", classValidate.newInventoryRules(),
   classValidate.checkUpdateData,
   utilities.handleErrors(invController.updateInventory))

// Delete an Invetory Item Activity
router.get("/delete/:inv_id", utilities.handleErrors(invController.buildDeleteInventory))

// Process the deletion of an Invetory Item
router.post("/delete/", utilities.handleErrors(invController.deleteInventory))

module.exports = router;