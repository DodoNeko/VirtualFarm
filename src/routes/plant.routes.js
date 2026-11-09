import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";

import {
    create
} from "../controllers/plant.controller.js";


const router = Router();


router.post(
    "/create", authMiddleware,
    create
);

export default router;