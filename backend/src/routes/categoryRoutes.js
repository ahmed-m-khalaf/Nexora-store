import express from 'express';
import { getAllCategories } from '../controllers/categoryController.js';

const router = express.Router();

router.get('/', getAllCategories);

export default router;
