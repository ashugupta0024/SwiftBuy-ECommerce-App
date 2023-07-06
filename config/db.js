import mongoose from 'mongoose'; //mongoDB dhang se chalane ke liye ek library types
import colors from "colors";

const connectDB = async() => {          //Server se connect krega 
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Connected to MongoDB databse ${conn.connection.host}` .bgMagenta.white);
    }
    catch(error)
    {
        console.log(`Error in MongoDb ${error}` .bgRed.white);
    }
};

export default connectDB;

