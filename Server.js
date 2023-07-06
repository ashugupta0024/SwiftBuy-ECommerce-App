import express from "express"; //Requests vgrh call krne ke liye
import colors from "colors"; //colours laane ke liye thode se
import dotenv from "dotenv"; //Port ko private rkhne ke liye
import morgan from "morgan"; // provides logging functionality for HTTP requests. It logs information about incoming requests and outgoing responses, helping you to monitor and debug your application.
import connectDB from "./config/db.js"; //DB se connect and stuff
import authRoute from "./routes/authRoute.js";
import cors from "cors";
import categoryRoutes from "./routes/CategoryRoutes.js";
import productRoutes from "./routes/ProductRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

//configure env
dotenv.config();

//esmodule fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//rest object
const app = express();

//database config
connectDB();

//middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(express.static(path.join(__dirname, "./client/build")));

//routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);

//rest api

// app.get("/", (req, res) => {
// 	res.send("<h1> Welcome to E-Commerce MERN Stack APP </h1>");
// });

//Deployment
app.use("*", function (req, res) {
	res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

//PORT
const PORT = process.env.PORT || 8080;

//run listen
app.listen(PORT, () => {
	console.log(
		`Server is Running in ${process.env.DEV_MODE} mode on ${PORT}`.bgCyan.white
	);
});
