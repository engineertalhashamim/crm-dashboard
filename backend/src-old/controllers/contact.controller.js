import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Contact } from '../models/contact.model.js';

const createContact = asyncHandler(async (req, res) => {
  console.log("backend test1");
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const position = req.body.position;
  const email = req.body.email;
  const direction = req.body.direction || null;
  const phone = req.body.phone;
  const password = req.body.password;
  console.log("backend test2");

  if (!firstname) throw new ApiError(400, 'firstname is required');

  if (!lastname) throw new ApiError(400, 'lastname is required');
  console.log("backend test3");

  const newContact = await Contact.create({
    firstname,
    lastname,
    position,
    email,
    direction,
    phone,
    password,
  });
  console.log("backend test4");

  if (!newContact) throw new ApiError(400, 'Contact creation failed');
  return res
    .status(200)
    .json(new ApiResponse(200, newContact, 'Contact created successfully'));
});

const deleteContact = asyncHandler(async (req, res) => {
  const contactId = req.params.id;
  const deleteContact = await Contact.destroy({ where: { id: contactId } });

  if (!deleteContact) {
    throw new ApiError(400, 'Contact not found or already deleted');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, 'Contact deleted successfully'));
});

const getAllContact = asyncHandler(async (req, res) => {
  const allContactData = await Contact.findAll();
  return res
    .status(200)
    .json(
      new ApiResponse(200, allContactData, 'All Contact fetched successfully')
    );
});


const singleContactData = asyncHandler(async (req, res) => {

  const contactId = req.params.id;
  const contact = await Contact.findByPk(contactId);

  if (!contact) {
    throw new ApiError(404, `Contact with ID ${contactId} not found`);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, contact, 'Contact details retrieved successfully')
    );
});


const updateContact = asyncHandler(async (req, res) => {
  const contactId = req.params.id;
  const [updateCount, updatedRows] = await Contact.update(req.body, {
    where: { id: contactId },
    returning: true,
    individualHooks: true,
  });
  // console.log('update updateCount..', updateCount);
  // console.log('update updatedRows..', updatedRows);

  if (updatedRows.length === 0) {
    throw new ApiError(404, `Contact with ID ${contactId} not found`);
  }

  const updatedContact = updatedRows[0];

  return res
    .status(200)
    .json(new ApiResponse(200, updatedContact, 'Contact updated successfully'));
});


export { createContact, getAllContact, deleteContact, singleContactData, updateContact };
