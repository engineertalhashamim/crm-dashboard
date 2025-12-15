import { Router } from "express";
import {
  createStatus,
  getAllStatus,
  deleteStatus,
  singleStatusData,
  updateStatus,
} from "../controllers/status.controller.js";
import {
  checkAuth,
  createUser,
  deleteUser,
  getAllUser,
  getSingleUser,
  loginUser,
  logoutUser,
  updatedUser,
} from "../controllers/user.controller.js";

const router = Router();
router.route("/createuser").post(createUser);
router.route("/getalluser").get(getAllUser);
router.route("/deleteuser/:id").delete(deleteUser);
router.route("/singleuserdata/:id").get(getSingleUser);
router.route("/updateuser/:id").put(updatedUser);
router.route("/loginuser").get(loginUser);
router.route("/logoutUser").get(logoutUser);
router.route("/checkauth").get(checkAuth);

// Testing Route
// router.get('/test', (req, res) => {
//   res.json({ message: 'Route works!' });
// });

export default router;
