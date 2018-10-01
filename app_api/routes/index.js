var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var ctrlProfile = require('../controllers/profile');
var ctrlAuth = require('../controllers/authentication');
var ctrlStockist = require('../controllers/stockist');
var ctrlCashier = require('../controllers/cashier');

// profile
router.post('/profile/isfirstlogin', auth, ctrlProfile.isFirstLogin); 				// is first login
router.get('/profile*', auth, ctrlProfile.profileRead);
router.post('/profile*',auth, ctrlProfile.profileEdit);
/*
router.post('/upload/profilepic', [auth,multipartMiddleware],ctrlProfile.uploadImage);
router.post('/upload/assetimage', [auth,multipartMiddleware],ctrlContentCreation.uploadAssetImage);
router.get('/assets/getassets', auth, ctrlContentCreation.getAssets);
*/
//router.get('/login_external', ctrlAuth.login_external);

// google login
router.get('/login_external/auth/google', ctrlAuth.login_external_google);
/*
router.get('/auth/google*', ctrlAuth.login_external_callback_google);

// facebook login
router.get('/login_external/auth/facebook', ctrlAuth.login_external_facebook);
router.get('/auth/facebook*', ctrlAuth.login_external_callback_facebook);

// twitter login
router.get('/login_external/auth/twitter', ctrlAuth.login_external_twitter);
router.get('/auth/twitter*', ctrlAuth.login_external_callback_twitter);

// linkedin login
router.get('/login_external/auth/linkedin', ctrlAuth.login_external_linkedin);
router.get('/auth/linkedin*', ctrlAuth.login_external_callback_linkedin);
*/
// Check unique username
router.post('/username/save', auth, ctrlProfile.saveUsername);
//router.get('/username*', auth, ctrlProfile.isUsernameUnique);

// Check unique email
router.post('/email/save', ctrlProfile.saveEmail);
//router.get('/email/isverified*', auth, ctrlProfile.isEmailVerified);
router.get('/email/resend', auth, ctrlProfile.resendEmail);
router.get('/email*', ctrlProfile.isEmailUnique);

// Check save user type
router.post('/userdetails/save', auth, ctrlProfile.saveUserDetails);

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);
router.post('/verifyemail', ctrlAuth.verifyEmail);

/********* Admin ***************/
// register admin
router.post('/registeradmin', auth, ctrlAuth.saveAdminEmail);

// admin verify and login
router.post('/admin/verifyemail', ctrlAuth.adminVerifyEmail);

// admin approves joining requests of teachers/studetns
//router.post('/admin/approvebyadmin', auth, ctrlAdmin.approveByAdmin);

/*********** End of Admin *******************/



/*************************** Stockist **************************************/
//Save a particular vendor information either insert new or edit existing
router.post('/stockist/savevendor', auth, ctrlStockist.saveVendor);

//Save a particular item information either insert new or edit existing
router.post('/stockist/saveitem', auth, ctrlStockist.saveItem);

//Save a particular product information within a batch (Stock Entry) either insert new or edit existing
router.post('/stockist/saveproduct', auth, ctrlStockist.saveProduct);

//Get Items
router.get('/stockist/getitems', auth, ctrlStockist.getItems);

//Get Vendors
router.get('/stockist/getvendors', auth, ctrlStockist.getVendors);

//Get Products
router.get('/stockist/getproducts', auth, ctrlStockist.getProducts);

//Get Batches
router.get('/stockist/getbatches', auth, ctrlStockist.getBatches);

//Generate Barcode 
router.post('/stockist/generatebarcode', auth, ctrlStockist.generateBarcode);

// admin verify and login
router.post('/admin/verifyemail', ctrlAuth.adminVerifyEmail);

/************************** End of Stockiest *******************************/

/*************************** Cashier **************************************/
//Save a particular customer information either insert new or edit existing
router.post('/cashier/savecustomerdetails', auth, ctrlCashier.saveCustomerDetails);

//Save a particular customer invoice either insert new or edit existing
router.post('/cashier/savecustomerinvoice', auth, ctrlCashier.saveCustomerInvoice);

//Get Items
router.get('/cashier/getitems', auth, ctrlStockist.getItems);


/************************** End of Cashier *******************************/

module.exports = router;
