import { Router } from "express";
import {
  createSource,
  getAllSource,
  deleteSource,
  singleSourceData,
  updateSource,
} from "../controllers/source.controller.js";

const router = Router();
router.route("/createsource").post(createSource);
router.route("/getallsource").get(getAllSource);
router.route("/deletesource/:id").delete(deleteSource);
router.route("/singlesourcedata/:id").get(singleSourceData);
router.route("/updatesource/:id").put(updateSource);

// Testing Route
// router.get('/test', (req, res) => {
//   res.json({ message: 'Route works!' });
// });

export default router;
