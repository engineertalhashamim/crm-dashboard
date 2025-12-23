import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Status } from "../models/status.model.js";
import { Sources } from "../models/source.model.js";
import { Leads } from "../models/leads.model.js";
import { Op } from "sequelize";

const createLead = asyncHandler(async (req, res) => {
  console.log("hello 1..");
  const {
    status_id,
    source_id,
    assigned_user_id,
    tags,
    name_lead,
    position,
    email,
    website,
    phone1,
    phone2,
    leadValue,
    company,
    description,
    address,
    city,
    state,
    country,
    zipCode,
    defaultLanguage,
  } = req.body;

  if (!status_id) throw new ApiError(400, "Status is required");
  if (!source_id) throw new ApiError(400, "Source is required");

  const statusExists = await Status.findByPk(status_id);
  if (!statusExists) throw new ApiError(400, "Invalid Status");

  const sourceExists = await Sources.findByPk(source_id);
  if (!sourceExists) throw new ApiError(400, "Invalid Source");

  if (assigned_user_id) {
    const userExists = await User.findByPk(assigned_user_id);
    if (!userExists) throw new ApiError(400, "Invalid User");
  }

  const createdLead = await Leads.create({
    status_id,
    source_id,
    assigned_user_id,
    tags,
    name_lead,
    position,
    email,
    website,
    phone1,
    phone2,
    leadValue,
    company,
    description,
    address,
    city,
    state,
    country,
    zipCode,
    defaultLanguage,
  });

  if (!createdLead) {
    throw new ApiError(400, "Validation error", [
      { path: "tags", message: "Leads creation failed" },
    ]);
  }

  const createdResData = await getParentStatusWithLead(createdLead.id);

  if (tags && !Array.isArray(tags)) {
    throw new ApiError(400, "Validation error", [
      { path: "tags", message: "Tags must be an array" },
    ]);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createdResData, "Leads created successfully"));
});

const getParentStatusWithLead = async (leadId) => {
  const resData = await Leads.findOne({
    where: { id: leadId },
    include: [
      {
        model: Status,
        as: "statusId",
        attributes: ["id", "statusname"],
      },
      {
        model: Sources,
        as: "sourceId",
        attributes: ["id", "sourcename"],
      },
      {
        model: User,
        as: "assignedUserId",
        attributes: ["id", "name", "email"],
      },
    ],
  });
  return resData;
};

const searchStatus = asyncHandler(async (req, res) => {
  const keyword = req.query.q;
  if (!keyword) return res.json([]);

  const results = await Status.findAll({
    where: {
      statusname: {
        [Op.iLike]: `%${keyword}%`,
      },
    },
    limit: 50,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, results, "Data fetched successfully"));
});

const searchSource = asyncHandler(async (req, res) => {
  const keyword = req.query.q;
  if (!keyword) return res.json([]);

  const results = await Sources.findAll({
    where: {
      sourcename: {
        [Op.iLike]: `%${keyword}%`,
      },
    },
    limit: 50,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, results, "Data fetched successfully"));
});

const searchUser = asyncHandler(async (req, res) => {
  const keyword = req.query.q;
  if (!keyword) return res.json([]);
  const results = await User.findAll({
    where: {
      username: {
        [Op.iLike]: `%${keyword}%`,
      },
    },
    limit: 50,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, results, "Data fetched successfully"));
});

export { createLead, searchStatus, searchSource, searchUser };
