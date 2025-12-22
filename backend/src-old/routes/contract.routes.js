import { Router } from 'express';
import { 
	 createContract,
	 getAllContract,
	 deleteContract,
	 singleContractData,
	 updateContract,
	 searchParent
} from '../controllers/contract.controller.js'

const router = Router();
router.route('/searchparent').get(searchParent);
router.route('/createcontract').post(createContract);
router.route('/getallcontract').get(getAllContract);
router.route('/singlecontractdata/:id').get(singleContractData);
router.route('/deletecontract/:id').delete(deleteContract);
router.route('/updatecontract/:id').put(updateContract);

// Testing Route 
// router.get('/test', (req, res) => {
//   res.json({ message: 'Route works!' });
// });

export default router;