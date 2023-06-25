// Needed Resources 
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require("../utilities/account-validation")

// Route to build inventory by classification view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build inventory by classification view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Unit 05 JWT Auth Activity
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement));

//Route for logout process
router.get("/logout", utilities.handleErrors(accountController.logoutProcess));

// Route to Update Account view
router.get("/update/:accountId", utilities.handleErrors(accountController.updateAccountView))

// Route to post info in database
router.post('/register',
   regValidate.registrationRules(),
   regValidate.checkRegData,
   utilities.handleErrors(accountController.registerAccount)
)

// Process login attempt
router.post('/login',
   regValidate.loginRules(),
   regValidate.checkLoginData,
   utilities.handleErrors(accountController.accountLogin)
)

// Process the update for account and password
router.post(
   "/",
   regValidate.accountRules(),
   regValidate.checkUpdateData,
   utilities.handleErrors(accountController.updateAccount)
)

router.post(
   "/update/updatepassword",
   regValidate.passwordRules(),
   regValidate.checkPasswordData,
   utilities.handleErrors(accountController.updatePassword)
)


module.exports = router