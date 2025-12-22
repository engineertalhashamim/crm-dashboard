import { Router } from 'express';
import {
  createClient,
  deleteClient,
  getAllClients,
  singleClientData,
  updateClient,
} from '../controllers/client.controller.js';

const router = Router();
router.route('/createclient').post(createClient);
router.route('/getallclients').get(getAllClients);
router.route('/deleteclient/:id').delete(deleteClient);
router.route('/singleclientdata/:id').get(singleClientData);
router.route('/updateclient/:id').put(updateClient);

export default router;
