import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { allCategoryController, createCategoryController, deleteCategoryController, singleCategoryController, updateCategoryController } from "./../controllers/categoryController.js";

const router = express.Router();

//routes
//Create Category
router.post(
	"/create-category",
	requireSignIn,
	isAdmin,
	createCategoryController
);

//update Category
router.put('/update-category/:id', requireSignIn, isAdmin, updateCategoryController) //id isliy daali hai kyunki wo dynamically aayegi

//get All category
router.get('/get-category', allCategoryController)

//Single Category Controller
router.get('/single-category/:slug',singleCategoryController)

//delet Category
router.delete('/delete-category/:id',requireSignIn, isAdmin, deleteCategoryController)

export default router;
