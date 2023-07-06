import slugify from "slugify";
import CategoryModel from "../models/CategoryModel.js";

export const createCategoryController = async (req, res) => {
	try {
		const { name } = req.body;
		if (!name) {
			return res.status(401).send({ message: "Name is required" });
		}
		const existingCategory = await CategoryModel.findOne({ name });
		if (existingCategory) {
			return res.status(200).send({
				success: true,
				message: "Category already exists",
			});
		}
		const category = await new CategoryModel({
			name,
			slug: slugify(name),
		}).save();
		res.status(201).send({
			success: true,
			message: "New category created",
			category,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			error,
			message: "Error in Category",
		});
	}
};

//Update Category
export const updateCategoryController = async (req, res) => {
	try {
		const { name } = req.body;
		const { id } = req.params;
		const category = await CategoryModel.findByIdAndUpdate(
			id,
			{ name, slug: slugify(name) },
			{ new: true }
		);
		return res.status(200).send({
			success: true,
			message: "Category updated",
			category,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			error,
			message: "Error while updating Category",
		});
	}
};

//get All Category
export const allCategoryController = async (req, res) => {
	try {
		const category = await CategoryModel.find({});
		res.status(200).send({
			success: true,
			message: "All Categories List",
			category,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			error,
			message: "Error while getting all Categories",
		});
	}
};

//Single Category Controller
export const singleCategoryController = async (req, res) => {
	try {
		const { slug } = req.params;
		const category = await CategoryModel.findOne({ slug });
		res.status(200).send({
			success: true,
			message: "Single Category found",
			category,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			error,
			message: "Error while getting single Categories",
		});
	}
};

//Delete Category Controller
export const deleteCategoryController = async (req, res) => {
	try {
		const { id } = req.params;
		const category = await CategoryModel.findByIdAndDelete(id);
		res.status(200).send({
			success: true,
			message: "Single Category deleted",
			category,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			error,
			message: "Error while deleting category",
		});
	}
};
