import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken"

const generateAccessOrRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      "Something went wrong while generating referesh and access token",
      error.message
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if ([email, username, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  const user = await User.create({
    username,
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

 return res
    .status(201)
    .json(new ApiResponse(201, "User registered successfully", createdUser));
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!(email && password)) {
    throw new ApiError(400, "Both email and password is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  
  if (!user) {
    throw new ApiError(401, "User not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid Password");
  }

  const { accessToken, refreshToken } = await generateAccessOrRefreshToken(
    user._id
  );
  
  const userData = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    secure: true,
    httpOnly: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, "User logged in successfully", {accessToken,user:userData}));
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    secure: true,
    httpOnly: true,
  };

  return res
    .status(201)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(201, "User logged out successfully", {}));
});

const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies; // Extract refresh token from cookies
  if (!refreshToken) {
    throw new ApiError(401, "Refresh token is missing");
  }

  // Verify refresh token
  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  const user = await User.findById(decoded._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Generate new access and refresh tokens
  const { accessToken, refreshToken: newRefreshToken } = await generateAccessOrRefreshToken(user._id);

  // Update refresh token in cookies
  const options = { httpOnly: true, secure: true };
  res
    .cookie("refreshToken", newRefreshToken, options)
    .status(200)
    .json(new ApiResponse(200, "Token refreshed successfully", { accessToken }));
});

const getUserProfile = asyncHandler(async (req, res) => {
  const userData = await User.findById(req.user._id).select(
    "-password -refreshToken"
  );
  return res.json(new ApiResponse(200, "User profile fetched successfully", userData));
});



export { registerUser, loginUser, logoutUser, refreshToken, getUserProfile};
