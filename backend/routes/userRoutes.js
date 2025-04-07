import express from 'express';
import { getTelecallers } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
const router = express.Router();
router.get('/', protect, authorizeRoles('admin'), getTelecallers);
export default router;