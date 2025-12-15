import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

const createUser = asyncHandler(async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username) throw new ApiError(400, "username is required");
  if (!password) throw new ApiError(400, "password is required");

  const isUser = await User.create({
    username,
    password,
    active: true,
  });

  if (!isUser) throw new ApiError(400, "Something went wrong while registering the user");

  return res
    .status(201)
    .json(new ApiResponse(201, isUser, "User registered successfully"));
});

const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const isdeleted = await User.destroy({ where: { id: userId } });

  if (!isdeleted) throw new ApiError(400, "User not found or already deleted");

  res.status(200).json(new ApiResponse(200, null, "User deleted successfully"));
});

const getAllUser = asyncHandler(async (req, res) => {
  const isAllUser = await User.findAll();
  return res
    .status(200)
    .json(new ApiResponse(200, isAllUser, "All users fetched successfully"));
});

const getSingleUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const isSingleUser = await User.findByPk(userId);

  if (!isSingleUser) throw new ApiError(404, "User not found");

  return res
    .status(200)
    .json(
      new ApiResponse(200, isSingleUser, "Single user fetched successfully")
    );
});

const updatedUser = asyncHandler(async (req, res) => {
  const userId = req.params.id; 

  const [updateCount, updatedRows] = await User.update(req.body, {
    where: { id: userId },
    returning: true,
    individualHooks: true,
  });

  if (updateCount === 0) {
    throw new ApiError(404, `User with ID ${userId} not found`);
  }

  const updatedUser = updatedRows[0];

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User updated successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  console.log("ok11...");
  const username = req.body.username;
  const password = req.body.password;
  console.log("ok22...");

  console.log("login user..", username);
  console.log("login pass..", password);
  console.log("ok33...");

  if (!username || !password) {
    throw new ApiError(400, "Username and password required");
  }
  console.log("ok44...");

  const user = await User.findOne({
    where: { username: username.toLowerCase() },
  });

  if (!user) throw new ApiError(401, "user not found");

  if (!user.active) throw new ApiError(403, "Account is disabled");

  const isMatch = await user.isPasswordCorrect(password);
  if (!isMatch) throw new ApiError(400, "Invalid credentials");

  req.session.user = {
    __username: user.username,
    __user_id: user.id,
  };

  console.log("SESSION AFTER LOGIN:", req.session);

  const { password: _, ...safeuser } = user.toJSON();

  return res
    .status(200)
    .json(new ApiResponse(200, safeuser, "Login successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
  req.session.destroy((err) => {
    res.clearCookie("connect.sid", {
      path: "/",
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      secure: false,
      sameSite: "strict",
    });
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Logout Successfully"));
  });
});

const checkAuth = asyncHandler(async (req, res) => {
  if (req.session && req.session.user) {
    return res
      .status(200)
      .json(new ApiResponse(200, req.session.user, "Authenticated"));
  } else {
    throw new ApiError(401, "Not Authenticated");
  }
});

export {
  createUser,
  deleteUser,
  getAllUser,
  getSingleUser,
  updatedUser,
  loginUser,
  logoutUser,
  checkAuth,
};
