import express from "express";
import {
  adminAccessController,
  deleteUserController,
} from "../controllers/adminController.js";

// router Object
const router = express.Router();

// delete User route
router.post("/deleteUser", deleteUserController);

// Admin access
router.post("/adminAccess", adminAccessController);

// Login route
// router.post("/login", SigninController);

export default router;
