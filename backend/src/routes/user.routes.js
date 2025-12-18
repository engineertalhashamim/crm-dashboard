import { Router } from "express";
import isLoggedIn from "../midlewares/auth.middleware.js";
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
router.route("/loginuser").post(loginUser);

router.route("/getalluser").get(isLoggedIn, getAllUser);
router.route("/deleteuser/:id").delete(isLoggedIn, deleteUser);
router.route("/singleuserdata/:id").get(isLoggedIn, getSingleUser);
router.route("/updateuser/:id").put(isLoggedIn, updatedUser);
router.route("/logoutuser").post(isLoggedIn, logoutUser);
router.route("/checkauth").get(isLoggedIn, checkAuth);

// Testing Route
// router.get('/test', (req, res) => {
//   res.json({ message: 'Route works!' });
// });

export default router;
