import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
	createProductController,
	deleteProductController,
	getProductController,
	getSingleProductController,
	productCountController,
	productFilterController,
	productListController,
	productPhotoController,
	searchProductController,
	relatedProductController,
	updateProductController,
	categoryProductController,
	braintreeTokenController,
	brainTreePaymentController,
} from "../controllers/productController.js";
import ExpressFormidable from "express-formidable";
const router = express.Router();

//routes

//Create Product
router.post(
	"/create-product",
	requireSignIn,
	isAdmin,
	ExpressFormidable(),
	createProductController
);

//Get All Products
router.get("/get-product", getProductController);

//Get Single Product
router.get("/get-product/:slug", getSingleProductController);

//Get Photo of Product
router.get("/product-photo/:pid", productPhotoController);

//Delete Product
router.delete("/delete-product/:pid", deleteProductController);

//Update Product
router.put(
	"/update-product/:pid",
	requireSignIn,
	isAdmin,
	ExpressFormidable(),
	updateProductController
);

//Filter Product
router.post("/product-filter", productFilterController);

//Product Count
router.get("/product-count", productCountController);

//Products per page
router.get("/product-list/:page", productListController);

//Search Product
router.get("/search/:keyword", searchProductController);

//Similar Products
router.get("/related-product/:pid/:cid", relatedProductController);

//Category wise products
router.get("/category-product/:slug", categoryProductController)

//Payment Routes

//Token verify from site
router.get("/braintree/token", braintreeTokenController);

//Payments
router.post("/braintree/payment", requireSignIn, brainTreePaymentController);

export default router;
