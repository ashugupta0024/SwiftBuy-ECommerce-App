import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import usermodel from "../models/usermodel.js";
import ordermodel from "../models/orderModel.js";
import JWT from "jsonwebtoken";
// import usermodel from "../models/userModel";

export const registerController = async (req, res) => {
	try {
		const { name, email, password, phone, address, answer } = req.body;
		//validation
		if (!name) {
			return res.send({ message: "Name is Required" });
		}
		if (!password) {
			return res.send({ message: "Password is Required" });
		}
		if (!email) {
			return res.send({ message: "Email is Required" });
		}
		if (!phone) {
			return res.send({ message: "Phone is Required" });
		}
		if (!address) {
			return res.send({ message: "Address is Required" });
		}
		if (!answer) {
			return res.send({ message: "Answer is Required" });
		}
		//check user
		const existingUser = await usermodel.findOne({ email });
		//existing User
		if (existingUser) {
			return res.status(200).send({
				success: false,
				message: "Already existing user, Please login",
			});
		}
		//register User
		const hashedPassword = await hashPassword(password);
		//save
		const user = await new usermodel({
			name,
			email,
			phone,
			address,
			password: hashedPassword,
			answer,
		}).save();

		res.status(201).send({
			success: true,
			message: "User Register Successfully",
			user,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			message: "Error in Registration",
			error,
		});
	}
};

// POST LOGIN
export const loginController = async (req, res) => {
	try {
		const { email, password } = req.body;
		//validation
		if (!email || !password) {
			return res.status(404).send({
				success: false,
				message: "Invalid email or password",
			});
		}
		//check user
		const user = await usermodel.findOne({ email });
		if (!user) {
			return res.status(404).send({
				success: false,
				message: "Email is not registered",
			});
		}
		const match = await comparePassword(password, user.password); //Hamare password ko user ke hashed password se compare karare uss function se jo humne controller mei banaya hai
		if (!match) {
			return res.status(200).send({
				success: false,
				message: "Invalid Password",
			});
		}
		//token
		const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
			expiresIn: "7d",
		});
		res.status(200).send({
			success: true,
			message: "Login Sucessfuly",
			user: {
				_id: user._id,
				name: user.name,
				email: user.email,
				address: user.address,
				phone: user.phone,
				role: user.role,
			},
			token,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			message: "Error in Login",
			error,
		});
	}
};

//forgot password controller
export const forgotPasswordController = async (req, res) => {
	try {
		const { email, answer, newPassword } = req.body;
		if (!email) {
			res.status(400).send({ message: "Email is required" });
		}
		if (!answer) {
			res.status(400).send({ message: "Answer is required" });
		}
		if (!newPassword) {
			res.status(400).send({ message: "newPassword is required" });
		}
		//check
		const user = await usermodel.findOne({ email, answer });
		//validation
		if (!user) {
			return res.status(500).send({
				success: false,
				message: "Something went wrong",
				error,
			});
		}
		const hashed = await hashPassword(newPassword);
		await usermodel.findByIdAndUpdate(user._id, { password: hashed });
		res.status(200).send({
			success: true,
			message: "Password reset successfuly",
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			message: "Something Went Wrong",
			error,
		});
	}
};

//Test Controller
export const testController = (req, res) => {
	try {
		res.send("Protected Routes");
	} catch (error) {
		console.log(error);
		res.send({ error });
	}
};

//Update Profile Controller
export const updateProfileController = async (req, res) => {
	try {
		const { name, email, password, address, phone } = req.body;
		const user = await usermodel.findById(req.user._id);

		//password
		if (password && password.length < 6) {
			return res.json({ error: "Passsword is required and 6 character long" });
		}
		const hashedPassword = password ? await hashPassword(password) : undefined;
		const updatedUser = await usermodel.findByIdAndUpdate(
			req.user._id,
			{
				name: name || user.name,
				password: hashedPassword || user.password,
				phone: phone || user.phone,
				address: address || user.address,
			},
			{ new: true }
		);
		res.status(200).send({
			success: true,
			message: "Profile Updated SUccessfully",
			updatedUser,
		});
	} catch (error) {
		console.log(error);
		res.status(400).send({
			success: false,
			message: "Error While Update profile",
			error,
		});
	}
};

// Get orders list
export const getOrdersController = async (req, res) => {
	try {
		const orders = await ordermodel
			.find({})
			.populate("products", "-photo")
			.populate("buyer", "name")
			.sort({ createdAt: "-1" });
		res.json(orders);
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			message: "Error WHile Geting Orders",
			error,
		});
	}
};

//Get all orders
export const getAllOrdersController = async (req, res) => {
	try {
		const orders = await ordermodel
			.find({})
			.populate("products", "-photo")
			.populate("buyer", "name")
			.sort({ createdAt: "-1" });
		res.json(orders);
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			message: "Error WHile Geting Orders",
			error,
		});
	}
};

// Get order Status
export const orderStatusController = async (req, res) => {
	try {
		const { orderId } = req.params;
		const { status } = req.body;
		const orders = await ordermodel.findByIdAndUpdate(
			orderId,
			{ status },
			{ new: true }
		);
		res.json(orders);
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			message: "Error While Updateing Order",
			error,
		});
	}
};
