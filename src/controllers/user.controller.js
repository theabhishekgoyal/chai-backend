import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation - not empty
  // check if user already exists:: username and email
  // check for images , check for avatar
  // upload them to cloudinary
  // create user object - create user object in the database
  // remove password and refresh token before sending back to client side
  // check for user creation
  // return res

  const { username, email, fullname, password } = req.body;
  console.log("Email: ", email);

  if (
    [fullname, email, password, username].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields must be required");
  }
  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User already exist!");
  }
  const avatarLoaclPath = req.files?.avatar[0]?.path;
  const coverImageLoaclPath = req.files?.coverImage[0]?.path;
  if (!avatarLoaclPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // upload on cloudinary
  const avatar = await uploadOnCloudinary(avatarLoaclPath);
  const converImage = await uploadOnCloudinary(coverImageLoaclPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }
  const user = await User.create({
    fullname,
    avatar: avatar.url,
    converImage: converImage.url || "",
    username: username.toLowerCase(),
    email,
    password,
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "something went wring while registering user");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registed successfully"));
});

export { registerUser };
