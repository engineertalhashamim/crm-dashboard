import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { User } from "../models/user.model";

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
    return new ApiError(400, "Something went wrong while registering the user");

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

  res
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
  const userId = req.params.id;
  const username = req.body.username;
  const password = req.body.password;

  if (!username && !password) {
    throw new ApiError(400, "Username and password should not be blank");
  }

  const isUser = await User.findOne({
    where: { username: username.toLowerCase },
  });
});

// const updatedUser = asyncHandler(async (req, res) => {
//   const userId = req.params.id;
//   const [updated] = await User.update(req.body, {
//     where: { id: userId },
//     returning: true, // To return updated object
//   });

//   if (!updated) throw new ApiError(400, "User not found");

//   const user = await User.findByPk(userId);

//   res.status(200).json(new ApiResponse(200, user, "User updated successfully"));
// });

export { createUser, deleteUser, getAllUser, getSingleUser, updatedUser };
