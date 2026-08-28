import express from "express";
import { saveAddress, getAddress, setAddressActive } from "../controllers/addressController.js";

const router = express.Router();

router.post("/add", saveAddress);
router.get("/:userId", getAddress);
router.post("/set-active", setAddressActive);
export default router;
