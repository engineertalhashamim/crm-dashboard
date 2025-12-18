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

  if (!isUser)
    throw new ApiError(400, "Something went wrong while registering the user");

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
  const { username, password } = req.body;

  const user = await User.findByPk(userId);
  if (!user) throw new ApiError(404, "User not found");

  // update username if provided
  if (username !== undefined) {
    user.username = username;
  }

  if (password) {
    user.password = password;
  }

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User updated successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username) {
    throw new ApiError(400, "Validation error", [
      { path: "username", message: "Username is required" },
    ]);
  }

  if (!password) {
    throw new ApiError(400, "Validation error", [
      { path: "password", message: "Password is required" },
    ]);
  }

  const user = await User.findOne({
    where: { username: username.toLowerCase() },
  });

  if (!user) {
    throw new ApiError(401, "Validation error", [
      { path: "username", message: "User not found" },
    ]);
  }

  if (!user.active) {
    throw new ApiError(403, "Validation error", [
      { path: "username", message: "Account is disabled" },
    ]);
  }

  const isMatch = await user.isPasswordCorrect(password);
  if (!isMatch) {
    throw new ApiError(400, "Validation error", [
      { path: "password", message: "Invalid password" },
    ]);
  }

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
  console.log("logou test1..");
  if (!req.session) {
    return res.status(200).json({ message: "Already logged out" });
  }
  console.log("logou test3..");

  req.session.destroy((err) => {
    res.clearCookie("connect.sid", {
      path: "/",
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      secure: false,
      sameSite: "strict",
    });
    console.log("logou test3..");

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Logout Successfully"));
  });
});

const checkAuth = asyncHandler(async (req, res) => {
  console.log("auth api test 1..");
  if (req.session && req.session.user) {
    console.log("auth api test 1..");
    console.log("req.session test ..", req.session);
    console.log("req.session.user test ..", req.session.user);

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
