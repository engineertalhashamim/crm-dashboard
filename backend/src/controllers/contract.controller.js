import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Contract } from "../models/contract.model.js";
import { Client } from "../models/client.model.js";
import { Op } from "sequelize";

const createContract = asyncHandler(async (req, res) => {
  // console.log("crtest1");
  const parentCustomerId = req.body.parentCustomerId;
  const subject = req.body.subject;
  const contractValue = req.body.contractValue;
  const contractType = req.body.contractType;
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  const status = req.body.status;
  const description = req.body.description;

  console.log("crtest2");

  if (!parentCustomerId) throw new ApiError(400, "customer is required");
  if (!subject) throw new ApiError(400, "subject is required");

  console.log("crtest4");

  const createContract = await Contract.create({
    parentCustomerId,
    subject,
    contractValue,
    contractType,
    startDate,
    endDate,
    status,
    description,
  });

  console.log("crtest5");

  if (!createContract) throw new ApiError(400, "Contract creation failed");
  const createdResData = await getParentCustomerWithContract(createContract.id);

  return res
    .status(200)
    .json(
      new ApiResponse(200, createdResData, "Contract created successfully")
    );
});

const getParentCustomerWithContract = async (contractId) => {
  const customerData = await Contract.findOne({
    where: {
      id: contractId, // object
    },
    include: [
      {
        model: Client,
        as: "parentCustomer",
        attributes: ["id", "companyname"],
      },
    ],
  });
  return customerData;
};

const deleteContract = asyncHandler(async (req, res) => {
  const contractId = req.params.id;
  const deleteContract = await Contract.destroy({ where: { id: contractId } });

  if (!deleteContract) {
    throw new ApiError(400, "contractId not found or already deleted");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "contract deleted successfully"));
});

const getAllContract = asyncHandler(async (req, res) => {
  const allContractData = await Contract.findAll({
    include: [
      {
        model: Client,
        as: "parentCustomer",
        attributes: ["id", "companyname"],
      },
    ],
  });
  return res
    .status(200)
    .json(
      new ApiResponse(200, allContractData, "All Contract fetched successfully")
    );
});

const singleContractData = asyncHandler(async (req, res) => {
  const contractId = req.params.id;

  const contract = await Contract.findOne({
    where: { id: contractId },
    include: [
      {
        model: Client,
        as: "parentCustomer",
        attributes: ["id", "companyname"],
      },
    ],
  });
  console.log("kch console karaya hai rimsha ne...");
  if (!contract) {
    throw new ApiError(404, `Contract with ID ${contractId} not found`);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, contract, "Contract details retrieved successfully")
    );
});

const updateContract = asyncHandler(async (req, res) => {
  const contractId = req.params.id;
  const [updateCount, updatedRows] = await Contract.update(req.body, {
    where: { id: contractId },
    returning: true,
    individualHooks: true,
  });
  // console.log('update updateCount..', updateCount);
  // console.log('update updatedRows..', updatedRows);

  if (updatedRows.length === 0) {
    throw new ApiError(404, `Contract with ID ${contractId} not found`);
  }

  const updatedContract = updatedRows[0];

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedContract, "Contract updated successfully")
    );
});

const searchParent = asyncHandler(async (req, res) => {
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
  createContract,
  getAllContract,
  deleteContract,
  singleContractData,
  updateContract,
  searchParent,
};
