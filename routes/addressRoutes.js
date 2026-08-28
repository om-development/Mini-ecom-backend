import express from "express";
import { saveAddress, getAddress, setAddressActive } from "../controllers/addressController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", authMiddleware, saveAddress);
router.get("/", authMiddleware, getAddress);
router.post("/set-active", authMiddleware, setAddressActive);
export default router;
