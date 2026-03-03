import { Router } from "express";
import {
  createProject,
  getAllProject,
  searchClient,
  deleteProject,
  singleProjectData,
  updateProject,
  getProjectOptions,
} from "../controllers/project.controller.js";

const router = Router();
router.route("/getallproject").get(getAllProject);
router.route("/createproject").post(createProject);
router.route("/deleteproject/:id").delete(deleteProject);
router.route("/singleprojectdata/:id").get(singleProjectData);
router.route("/updateproject/:id").put(updateProject);
router.route("/getprojectoptions").get(getProjectOptions);

router.route("/searchclient").get(searchClient);

export default router;
