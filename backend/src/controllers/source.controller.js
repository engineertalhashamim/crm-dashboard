import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Sources } from "../models/source.model.js";

const createSource = asyncHandler(async (req, res) => {
  const sourcename = req.body.sourcename;

  if (!sourcename) throw new ApiError(400, "sources name is required");

  const createsource = await Sources.create({
    sourcename,
  });

  if (!createsource) new ApiError(404, "source creation failed");

  return res
    .status(201)
    .json(new ApiResponse(201, createsource, "sources created successfully"));
});

const deleteSource = asyncHandler(async (req, res) => {
  const sourceId = req.params.id;
  const deletestatus = await Sources.destroy({ where: { id: sourceId } });

  if (!deletestatus) {
    throw new ApiError(404, `${sourceId} not found or already deleted`);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "source deleted successfully"));
});

const getAllSource = asyncHandler(async (req, res) => {
  const allSourceData = await Sources.findAll();
  return res
    .status(200)
    .json(
      new ApiResponse(200, allSourceData, "All Source fetched successfully")
    );
});

const singleSourceData = asyncHandler(async (req, res) => {
  const sourceId = req.params.id;

  const singleSource = await Sources.findOne({
    where: { id: sourceId },
  });

  if (!singleSource) {
    throw new ApiError(404, `sources with ID ${sourceId} not found`);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        singleSource,
        "source details retrieved successfully"
      )
    );
});

const updateSource = asyncHandler(async (req, res) => {
  const sourceId = req.params.id;

  const [updateCount, updatedRows] = await Sources.update(req.body, {
    where: { id: sourceId },
    returning: true,
    individualHooks: true,
  });

  if (updateCount === 0 || updatedRows.length === 0) {
    throw new ApiError(404, `source with ID ${sourceId} not found`);
  }
  const updatedSource = updatedRows[0];

  return res
    .status(200)
    .json(new ApiResponse(200, updatedSource, "Source updated successfully"));
});

export {
  createSource,
  deleteSource,
  getAllSource,
  singleSourceData,
  updateSource,
};
