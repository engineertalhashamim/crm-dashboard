import { Router } from "express";
import { createLead, searchSource, searchStatus, searchUser } from "../controllers/lead.controller.js";

const router = Router();
router.route("/createlead").post(createLead);
router.route("/searchstatus").get(searchStatus);
router.route("/searchsource").get(searchSource);
router.route("/searchuser").get(searchUser);
// router.route("/getallstatus").get(getAllStatus);
// router.route("/deletestatus/:id").delete(deleteStatus);
// router.route("/singlestatusdata/:id").get(singleStatusData);
// router.route("/updatestatus/:id").put(updateStatus);

// Testing Route
router.get('/test', (req, res) => {
  res.json({ message: 'Route works!' });
});

export default router;
