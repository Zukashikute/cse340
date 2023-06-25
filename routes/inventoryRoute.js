// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const classValidate = require("../utilities/inventory-validation")

// GET REQUESTS

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by vehicle view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

// Route to build management vehicle view
router.get("/",
   utilities.checkLogin,
   utilities.checkPermission,
   utilities.handleErrors(invController.buildVehicleManagement));

// Route to Add Classification View
router.get("/addclassification",
   utilities.checkLogin,
   utilities.checkPermission,
   utilities.handleErrors(invController.buildAddClassification));

// Route to Add Inventory View
router.get("/addinventory",
   utilities.checkLogin,
   utilities.checkPermission,
   utilities.handleErrors(invController.buildAddInventory));

// Select an Item from Inventory Activity
router.get("/getInventory/:classification_id",
   utilities.checkLogin,
   utilities.checkPermission,
   utilities.handleErrors(invController.getInventoryJSON))

// Update an Item from Inventory Activity
router.get("/edit/:inv_id",
   utilities.checkLogin,
   utilities.checkPermission,
   utilities.handleErrors(invController.buildEditInventory))

// Delete an Invetory Item Activity
router.get("/delete/:inv_id",
   utilities.checkLogin,
   utilities.checkPermission,
   utilities.handleErrors(invController.buildDeleteInventory))

// POST REQUESTS

// Process the add Classification data
router.post('/addclassification',
   utilities.checkLogin,
   utilities.checkPermission,
   classValidate.classificationRules(),
   classValidate.checkClassData,
   utilities.handleErrors(invController.addClassification));

// Process the add Inventory data
router.post('/addinventory',
   utilities.checkLogin,
   utilities.checkPermission,
   classValidate.inventoryRules(),
   classValidate.checkInvData,
   utilities.handleErrors(invController.addInventory));

// Processing the update of an Item from Inventory Activity
router.post("/update/",
   utilities.checkLogin,
   utilities.checkPermission,
   classValidate.newInventoryRules(),
   classValidate.checkUpdateData,
   utilities.handleErrors(invController.updateInventory));

// Process the deletion of an Inventory Item
router.post("/delete/", utilities.handleErrors(invController.deleteInventory));

module.exports = router;