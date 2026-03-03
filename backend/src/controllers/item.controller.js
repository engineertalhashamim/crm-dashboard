import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Item } from "../models/item.model.js";
import { itemGroupOptions, itemTaxOptions } from "../constants/itemOptions.js";

const createItem = asyncHandler(async (req, res) => {
  const {
    description,
    long_description,
    rate,
    tax_1,
    tax_2,
    unit,
    item_group,
    active,
  } = req.body;

  const existingDesc = await Item.findOne({
    where: { description },
  });

  if (existingDesc) {
    throw new ApiError(409, "Validation error", [
      { path: "description", message: "Description already exists" },
    ]);
  }

  const createdItem = await Item.create({
    description,
    long_description,
    rate,
    tax_1,
    tax_2,
    unit,
    item_group,
    active: active !== undefined ? active : true,
  });

  if (!createdItem) {
    throw new ApiError(400, "Something went wrong while creating item");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdItem, "Item created successfully"));
});

const getAllItem = asyncHandler(async (req, res) => {
  const allItems = await Item.findAll({
    where: { active: true },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, allItems, "All items fetched successfully"));
});

const deleteItem = asyncHandler(async (req, res) => {
  const itemId = req.params.id;

  const disabledItem = await Item.findByPk(itemId);
  if (!disabledItem) throw new ApiError(400, "Item not found");

  disabledItem.active = false;
  await disabledItem.save();

  res.status(200).json(new ApiResponse(200, null, "Item deleted successfully"));
});

const singleItemData = asyncHandler(async (req, res) => {
  const itemId = req.params.id;
  const singleItem = await Item.findOne({
    where: { id: itemId },
  });

  if (!singleItem) throw new ApiError(400, `Item with ID ${itemId} not found`);

  return res
    .status(200)
    .json(
      new ApiResponse(200, singleItem, "Item details retrieved successfully"),
    );
});

const updateItem = asyncHandler(async (req, res) => {
  const itemId = req.params.id;

  const [updateCount, updatedRows] = await Item.update(req.body, {
    where: { id: itemId },
    returning: true,
    individualHooks: true,
  });

  // console.log("updatedRows is..", updatedRows);
  // console.log("updateCount is..", updateCount);

  if (updatedRows.length === 0) {
    throw new ApiError(400, `Item with ID ${itemId} not found`);
  }

  const upadatedItem = updatedRows[0];

  return res
    .status(200)
    .json(new ApiResponse(200, upadatedItem, "Item updated successfully"));
});

const getItemOptions = asyncHandler(async (req, res) => {
  return res.json({
    itemTaxOptions,
    itemGroupOptions,
  });
});

export {
  createItem,
  getAllItem,
  deleteItem,
  singleItemData,
  updateItem,
  getItemOptions,
};
