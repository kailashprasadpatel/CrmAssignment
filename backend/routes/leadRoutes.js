// routes/leadRoutes.js
import express from 'express';
import {
  getLeads,
  createLead,
  updateLead,
  deleteLead,
  updateStatus,
} from '../controllers/leadController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Get all leads (admin & telecaller) / Create lead (telecaller only)
router
  .route('/')
  .get(protect, getLeads)
  .post(protect, authorizeRoles('telecaller'), createLead);

// Update or delete a lead (telecaller only)
router
  .route('/:id')
  .put(protect, authorizeRoles('telecaller'), updateLead)
  .delete(protect, authorizeRoles('telecaller'), deleteLead);

// Update lead status (telecaller only)
router.patch('/:id/status', protect, authorizeRoles('telecaller'), updateStatus);

 

export default router;
