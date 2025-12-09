import { Router } from 'express';
import {
  createContact,
  getAllContact,
  deleteContact,
  singleContactData,
  updateContact
} from '../controllers/contact.controller.js';

const router = Router();
router.route('/createcontact').post(createContact);
router.route('/getallcontact').get(getAllContact);
router.route('/singlecontactdata/:id').get(singleContactData);
router.route('/deletecontact/:id').delete(deleteContact);
router.route('/updatecontact/:id').put(updateContact);

export default router;
