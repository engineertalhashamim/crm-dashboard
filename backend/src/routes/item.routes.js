import { Router } from "express";
import {
  createItem,
  deleteItem,
  getAllItem,
  getItemOptions,
  singleItemData,
  updateItem,
} from "../controllers/item.controller.js";

const router = Router();
router.route("/createitem").post(createItem);
router.route("/getallitem").get(getAllItem);
router.route("/deleteitem/:id").delete(deleteItem);
router.route("/getitemoptions").get(getItemOptions);

router.route("/singleitemdata/:id").get(singleItemData);
router.route("/updateitem/:id").put(updateItem);

export default router;
