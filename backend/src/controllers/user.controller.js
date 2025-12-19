import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Op } from "sequelize";

const createUser = asyncHandler(async (req, res) => {
  const name = req.body.name;
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  if (!name) {
    throw new ApiError(400, "Validation error", [
      { path: "name", message: "Name is required" },
    ]);
  }

  if (!username) {
    throw new ApiError(400, "Validation error", [
      { path: "username", message: "Username is required" },
    ]);
  }

  if (!email) {
    throw new ApiError(400, "Validation error", [
      { path: "email", message: "Email is required" },
    ]);
  }

  if (!password) {
    throw new ApiError(400, "Validation error", [
      { path: "password", message: "Password is required" },
    ]);
  }

  // const existingUser = await User.findOne({
  //   where: {
  //     [Op.or]: [{ username }, { email }],
  //   },
  // });

  const existingUsername = await User.findOne({ where: { username } });
  if (existingUsername) {
    throw new ApiError(409, "Validation error", [
      { path: "username", message: "Username already exists" },
    ]);
  }

  const existingEmail = await User.findOne({ where: { email } });
  if (existingEmail) {
    throw new ApiError(409, "Validation error", [
      { path: "email", message: "Email already exists" },
    ]);
  }

  const newUser = await User.create({
    name,
    username,
    email,
    password,
    active: true,
  });

  if (!newUser)
    throw new ApiError(400, "Something went wrong while registering the user");

  const { password: _, ...safeUser } = newUser.toJSON();

  return res
    .status(201)
    .json(new ApiResponse(201, safeUser, "User registered successfully"));
});

const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  // const isdeleted = await User.destroy({ where: { id: userId } });
  const disabledUser = await User.findByPk(userId);
  if (!disabledUser) throw new ApiError(400, "User not found");

  disabledUser.active = false;
  await disabledUser.save();

  res.status(200).json(new ApiResponse(200, null, "User deleted successfully"));
});

const getAllUser = asyncHandler(async (req, res) => {
  const isAllUser = await User.findAll({
    where: { active: true },
    attributes: { exclude: ["password"] },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, isAllUser, "All users fetched successfully"));
});

const getSingleUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const isSingleUser = await User.findOne({
    where: { id: userId, active: true },
  });

  if (!isSingleUser) throw new ApiError(404, "User not found");

  const { password: _, ...safeUser } = isSingleUser.toJSON();

  return res
    .status(200)
    .json(new ApiResponse(200, safeUser, "Single user fetched successfully"));
});

const updatedUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const { name, username, email, password } = req.body;

  const user = await User.findByPk(userId);
  if (!user) throw new ApiError(404, "User not found");

  const errors = [];

  // update username if provided
  if (username !== undefined) {
    const existingUsername = await User.findOne({
      where: {
        username: username,
        id: { [Op.ne]: userId },
      },
    });
    if (existingUsername) {
      errors.push({ path: "username", message: "Username already exists" });
    } else {
      user.username = username;
    }
  }

  // update email if provided
  if (email !== undefined) {
    const existingEmail = await User.findOne({
      where: {
        email: email,
        id: { [Op.ne]: userId },
      },
    });
    if (existingEmail) {
      errors.push({ path: "email", message: "Email already exists" });
    } else {
      user.email = email;
    }
  }


  // Check name and password updates
  if (name !== undefined) {
    user.name = name;
  }
  if (password) {
    user.password = password;
  }

  if (errors.length > 0) {
    throw new ApiError(409, "Validation error", errors);
  }

  await user.save();
  // if (username || email) {
  //   const conflict = await User.findOne({
  //     where: {
  //       [Op.or]: [
  //         username ? { username } : null,
  //         email ? { email } : null,
  //       ].filter(Boolean),
  //       id: { [Op.ne]: userId },
  //     },
  //   });

  //   if (conflict) {
  //     throw new ApiError(409, "Username or email already in use");
  //   }
  // }

  const { password: _, ...safeUser } = user.toJSON();

  return res
    .status(200)
    .json(new ApiResponse(200, safeUser, "User updated successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const identifier = req.body.identifier;
  const password = req.body.password;

  if (!identifier) {
    throw new ApiError(400, "Validation error", [
      { path: "identifier", message: "Username or email is required" },
    ]);
  }

  if (!password) {
    throw new ApiError(400, "Validation error", [
      { path: "password", message: "Password is required" },
    ]);
  }

  const user = await User.findOne({
    where: {
      [Op.or]: [
        { username: identifier.toLowerCase() },
        { email: identifier.toLowerCase() },
      ],
    },
  });

  if (!user) {
    throw new ApiError(401, "Validation error", [
      { path: "identifier", message: "User not found" },
    ]);
  }

  if (!user.active) {
    throw new ApiError(403, "Validation error", [
      { path: "identifier", message: "Account is disabled" },
    ]);
  }

  const isMatch = await user.isPasswordCorrect(password);
  if (!isMatch) {
    throw new ApiError(400, "Validation error", [
      { path: "password", message: "Invalid password" },
    ]);
  }

  // req.session.user = {
  //   __username: user.username,
  //   __user_id: user.id,
  // };

  req.session.user = {
    id: user.id,
    username: user.username,
  };

  console.log("SESSION AFTER LOGIN:", req.session);

  const { password: _, ...safeuser } = user.toJSON();

  return res
    .status(200)
    .json(new ApiResponse(200, safeuser, "Login successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
  if (!req.session) {
    return res.status(200).json({ message: "Already logged out" });
  }

  req.session.destroy((err) => {
    if (err) throw new ApiError(500, "Logout failed");
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
