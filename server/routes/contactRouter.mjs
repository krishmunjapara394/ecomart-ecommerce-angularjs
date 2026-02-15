import express from "express";
import {
  createContact,
  getAllContacts,
  getContact,
  updateContactStatus,
  deleteContact,
  replyToContact,
} from "../controllers/contactController.mjs";
import { protect } from "../controllers/authController.mjs";

const router = express.Router();

// Public route — anyone can submit a contact form
router.post("/", createContact);

// Protected routes — admin only
router.get("/", protect, getAllContacts);
router.get("/:id", protect, getContact);
router.patch("/:id/status", protect, updateContactStatus);
router.post("/:id/reply", protect, replyToContact);
router.delete("/:id", protect, deleteContact);

export default router;
