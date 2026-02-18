import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Project } from "../models/project.model.js";
import { Client } from "../models/client.model.js";
import { Op } from "sequelize";
import {
  billingTypeOptions,
  statusOptions,
} from "../constants/projectOptions.js";

const createProject = asyncHandler(async (req, res) => {
  const {
    project_name,
    customer_id,
    billing_type,
    status,
    total_rate,
    rate_per_hour,
    estimated_hours,
    // members,
    start_date,
    deadline,
    tags,
    description,
    active,
  } = req.body;

  const customerExists = await Client.findByPk(customer_id);
  if (!customerExists) {
    throw new ApiError(400, "Validation error", [
      { path: "customer_id", message: "Customer not found" },
    ]);
  }

  const existingProject = await Project.findOne({
    where: { project_name },
  });

  if (existingProject) {
    throw new ApiError(409, "Validation error", [
      { path: "project_name", message: "Project name already exists" },
    ]);
  }

  // if (start_date && deadline && new Date(start_date) > new Date(deadline)) {
  //   throw new ApiError(400, "Validation error", [
  //     { path: "deadline", message: "Deadline must be after start date" },
  //   ]);
  // }

  const createdProject = await Project.create({
    project_name,
    customer_id,
    billing_type,
    status,
    total_rate,
    rate_per_hour,
    estimated_hours,
    // members: members || [],
    start_date,
    deadline,
    tags: tags || [],
    description,
    active: active !== undefined ? active : true,
  });

  const createdResData = await getAutoCompleteDataInObj(createdProject.id);

  return res
    .status(201)
    .json(new ApiResponse(201, createdResData, "Project created successfully"));
});

const getAutoCompleteDataInObj = async (projectId) => {
  const resData = await Project.findOne({
    where: { id: projectId },
    include: [
      {
        model: Client,
        as: "customer",
        attributes: ["id", "companyname"],
      },
    ],
  });
  return resData;
};

const getAllProject = asyncHandler(async (req, res) => {
  const allProj = await Project.findAll({
    where: { active: true },
    include: [
      {
        model: Client,
        as: "customer",
        attributes: ["id", "companyname"],
      },
    ],
  });

  return res
    .status(200)
    .json(new ApiResponse(200, allProj, "All projects fetched successfully"));
});

const deleteProject = asyncHandler(async (req, res) => {
  const projectId = req.params.id;

  const disabledProject = await Project.findByPk(projectId);
  if (!disabledProject) throw new ApiError(400, "Project not found");

  disabledProject.active = false;
  await disabledProject.save();

  res
    .status(200)
    .json(new ApiResponse(200, null, "Project deleted successfully"));
});

const singleProjectData = asyncHandler(async (req, res) => {
  const projectId = req.params.id;
  const singleProject = await Project.findOne({
    where: { id: projectId },
    include: [
      {
        model: Client,
        as: "customer",
        attributes: ["id", "companyname"],
      },
    ],
  });

  if (!singleProject)
    throw new ApiError(400, `Project with ID ${projectId} not found`);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        singleProject,
        "Project details retrieved successfully1",
      ),
    );
});

const updateProject = asyncHandler(async (req, res) => {
  const projectId = req.params.id;

  const [updateCount, updatedRows] = await Project.update(req.body, {
    where: { id: projectId },
    returning: true,
    individualHooks: true,
  });

  console.log("updatedRows is..", updatedRows);
  console.log("updateCount is..", updateCount);

  if (updatedRows.length === 0) {
    throw new ApiError(400, `Project with ID ${projectId} not found`);
  }

  const upadatedProject = updatedRows[0];

  return res
    .status(200)
    .json(
      new ApiResponse(200, upadatedProject, "Project updated successfully"),
    );
});

const getProjectOptions = asyncHandler(async (req, res) => {
  return res.json({
    billingTypeOptions,
    statusOptions,
  });
});

const searchClient = asyncHandler(async (req, res) => {
  const keyword = req.query.q;

  if (!keyword) return res.json([]);
  const results = await Client.findAll({
    where: {
      companyname: {
        [Op.iLike]: `%${keyword}%`,
      },
    },
    limit: 50,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, results, "Data fetched successfully"));
});

export {
  createProject,
  getAllProject,
  deleteProject,
  searchClient,
  updateProject,
  getProjectOptions,
  singleProjectData,
};
