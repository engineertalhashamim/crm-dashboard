import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Status } from "../models/status.model.js";
import { Sources } from "../models/source.model.js";
import { Leads } from "../models/leads.model.js";

const createLead = asyncHandler(async (req, res) => {
  const {
    parent_status_id,
    parent_source_id,
    parent_user_id,
    tags,
    name,
    position,
    email,
    website,
    phone,
    leadValue,
    company,
    description,
    address,
    city,
    state,
    country,
    zipCode,
    defaultLanguage,
    isPublic,
    contactedToday,
  } = req.body;

  if (!parent_status_id) throw new ApiError(400, "Status is required");
  if (!parent_source_id) throw new ApiError(400, "Source is required");

  const statusExists = await Status.findByPk(parent_status_id);
  if (!statusExists) throw new ApiError(400, "Invalid Status");

  const sourceExists = await Sources.findByPk(parent_source_id);
  if (!sourceExists) throw new ApiError(400, "Invalid Source");

  if (parent_user_id) {
    const userExists = await User.findByPk(parent_user_id);
    if (!userExists) throw new ApiError(400, "Invalid User");
  }

  const createdLead = await Leads.create({
    parent_status_id,
    parent_source_id,
    parent_user_id,
    tags,
    name,
    position,
    email,
    website,
    phone,
    leadValue,
    company,
    description,
    address,
    city,
    state,
    country,
    zipCode,
    defaultLanguage,
    isPublic,
    contactedToday,
  });

  if (!createdLead) throw new ApiError(400, "Leads creation failed");

  const createdResData = await getParentStatusWithLead(createdLead.id);

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
        as: "parentStatus",
        attributes: ["id", "statusname"],
      },
      {
        model: Sources,
        as: "parentSource",
        attributes: ["id", "sourcename"],
      },
      {
        model: User,
        as: "parentUser",
        attributes: ["id", "username"],
        // attributes: ["id", "name", "email"],
      },
    ],
  });
  return resData;
};

export { createLead };
