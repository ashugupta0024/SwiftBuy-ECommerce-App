import JWT from 'jsonwebtoken';
import usermodel from "../models/usermodel.js";

//Protected Routes token base
export const requireSignIn= async(req,res,next) => { //req jab krenge tab pehle next validate hoga and uss ke baad hi response send hoga
    try{
        const decode = JWT.verify(req.headers.authorization, process.env.JWT_SECRET); //token jo hai woh headers mei hota hai isliy req.body nahi kiya
        req.user=decode;
        next();
    }
    catch(error){
        console.log(error)
    }
};   

//Admin access
export const isAdmin = async(req,res,next) => {
    try{
        const user = await usermodel.findById(req.user._id);
        if(user.role !== 1){
            return res.status(401).send({
                success: false,
                message: "Unauthorized Access"
            });
        }
        else{
            next();
        }
    }
    catch(error){
        console.log(error);
        res.status(401).send({
            success: false,
            error,
            message: "Error in admin middleware"
        });
    }
}