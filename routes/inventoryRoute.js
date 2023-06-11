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

module.exports = router;