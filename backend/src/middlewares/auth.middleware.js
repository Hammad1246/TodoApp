import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const authMiddleware = asyncHandler(async (req, _, next) =>{
    try {
        const token =  req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decoded?._id).select("-password -refeshToken")

        if (!user) {
            throw new ApiError(401, "Unauthorized request")
        }

        req.user = user;
        next();


    } catch (error) {
        throw new ApiError(401, "Unauthorized request")
    }
}) 

export  {authMiddleware}