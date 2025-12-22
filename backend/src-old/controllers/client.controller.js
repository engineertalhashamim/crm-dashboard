import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Client } from '../models/client.model.js';

const createClient = asyncHandler(async (req, res) => {
  const companyname = req.body.companyname;
  const vatnumber = req.body.vatnumber;
  const phone = req.body.phone;
  const email = req.body.email;
  const website = req.body.website || null;
  const address = req.body.address;
  const city = req.body.city;
  const state = req.body.state;
  const zipcode = req.body.zipcode;
  const country = req.body.country;
  const source = req.body.source;
  const assigned = req.body.assigned;

  // if (!companyname) throw new ApiError(400, "Validation Error", {
  //   companyname: "Company name is required",
  //   }); //throw new ApiError(400, 'companyname is required');

  // const existingClient = await Client.findOne({ where: { companyname } });

  // if (existingClient) {
  //   throw new ApiError(400, "Validation Error", {
  //    companyname: "Company name is already exist",
  //   });
  // }

  const newClient = await Client.create({
    companyname,
    vatnumber,
    phone,
    email,
    website,
    address,
    city,
    state,
    zipcode,
    country,
    source,
    assigned,
  });

  //if (!newClient) throw new ApiError(400, 'Client creation failed');
  return res
    .status(200)
    .json(new ApiResponse(200, newClient, 'Client created successfully'));
});

const getAllClients = asyncHandler(async (req, res) => {
  const allClientsData = await Client.findAll();
  return res
    .status(200)
    .json(
      new ApiResponse(200, allClientsData, 'All Clients fetched successfully')
    );
});

const deleteClient = asyncHandler(async (req, res) => {
  const clientId = req.params.id;
  const deleteClient = await Client.destroy({ where: { id: clientId } });

  if (!deleteClient) {
    throw new ApiError(400, 'Client not found or already deleted');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, 'Client deleted successfully'));
});

const singleClientData = asyncHandler(async (req, res) => {
  const clientId = req.params.id;
  const client = await Client.findByPk(clientId);
  if (!client) {
    throw new ApiError(404, `Client with ID ${clientId} not found`);
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, client, 'Client details retrieved successfully')
    );
});

const updateClient = asyncHandler(async (req, res) => {
  const clientId = req.params.id;
  const [updateCount, updatedRows] = await Client.update(req.body, {
    where: { id: clientId },
    returning: true,
    individualHooks: true,
  });
  console.log('update updateCount..', updateCount);
  console.log('update updatedRows..', updatedRows);

  if (updatedRows.length === 0) {
    throw new ApiError(404, `Client with ID ${clientId} not found`);
  }
  console.log('update run33..');

  const updatedClient = updatedRows[0];

  return res
    .status(200)
    .json(new ApiResponse(200, updatedClient, 'Client updated successfully'));
});

export {
  createClient,
  getAllClients,
  deleteClient,
  singleClientData,
  updateClient,
};
