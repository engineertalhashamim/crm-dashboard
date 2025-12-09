import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Status } from "../models/status.model.js";

const createStatus = asyncHandler(async (req, res) => {
  const statusname = req.body.statusname;
  const color = req.body.color;

  if (!statusname) throw new ApiError(400, "status name is required");
  // if (!color) throw new ApiError(400, "color is required");

  const createStatus = await Status.create({
    statusname,
    color,
  });

  if (!createStatus) throw new ApiError(400, "status creation failed");

  return res
    .status(200)
    .json(new ApiResponse(200, createStatus, "status created successfully"));
});

// const getParentCustomerWithContract = async (contractId) => {
//   const customerData = await Contract.findOne({
//     where: {
//       id: contractId, // object
//     },
//     include: [
//       {
//         model: Client,
//         as: "parentCustomer",
//         attributes: ["id", "companyname"],
//       },
//     ],
//   });
//   return customerData;
// };

const deleteStatus = asyncHandler(async (req, res) => {
  const statusId = req.params.id;
  const deletestatus = await Status.destroy({ where: { id: statusId } });

  if (!deletestatus) {
    throw new ApiError(400, "statusId not found or already deleted");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "status deleted successfully"));
});

const getAllStatus = asyncHandler(async (req, res) => {
  const allStatusData = await Status.findAll();
  return res
    .status(200)
    .json(
      new ApiResponse(200, allStatusData, "All Status fetched successfully")
    );
});

const singleStatusData = asyncHandler(async (req, res) => {
  const statusId = req.params.id;

  const statuses = await Status.findOne({
    where: { id: statusId },
  });

  if (!statuses) {
    throw new ApiError(404, `status with ID ${statusId} not found`);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, statuses, "status details retrieved successfully")
    );
});

const updateStatus = asyncHandler(async (req, res) => {
  const statusId = req.params.id;
  const [updateCount, updatedRows] = await Status.update(req.body, {
    where: { id: statusId },
    returning: true,
    individualHooks: true,
  });

  // console.log("update updateCount..", updateCount);
  // console.log("update updatedRows..", updatedRows);

  if (updatedRows.length === 0) {
    throw new ApiError(404, `status with ID ${statusId} not found`);
  }

  const updatedStatus = updatedRows[0];

  return res
    .status(200)
    .json(new ApiResponse(200, updatedStatus, "Status updated successfully"));
});

export {
  createStatus,
  getAllStatus,
  deleteStatus,
  singleStatusData,
  updateStatus,
};
