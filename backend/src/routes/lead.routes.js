import { Router } from "express";
import { createLead, deleteLead, getAllLead, searchSource, searchStatus, searchUser, singleLeadData, updateLead } from "../controllers/lead.controller.js";

const router = Router();
router.route("/createlead").post(createLead);
router.route("/getalllead").get(getAllLead);
router.route("/deletelead/:id").delete(deleteLead);
router.route("/searchstatus").get(searchStatus);
router.route("/searchsource").get(searchSource);
router.route("/searchuser").get(searchUser);

router.route("/singleleaddata/:id").get(singleLeadData);
router.route("/updatelead/:id").put(updateLead);

// Testing Route
router.get('/test', (req, res) => {
  res.json({ message: 'Route works!' });
});

export default router;
