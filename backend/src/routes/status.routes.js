import { Router } from "express";
import {
  createStatus,
  getAllStatus,
  deleteStatus,
  singleStatusData,
  updateStatus,
} from "../controllers/status.controller.js";

const router = Router();
router.route("/createstatus").post(createStatus);
router.route("/getallstatus").get(getAllStatus);
router.route("/deletestatus/:id").delete(deleteStatus);
router.route("/singlestatusdata/:id").get(singleStatusData);
router.route("/updatestatus/:id").put(updateStatus);

// Testing Route
// router.get('/test', (req, res) => {
//   res.json({ message: 'Route works!' });
// });

export default router;
