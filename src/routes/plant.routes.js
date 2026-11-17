import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";

import {
    create, get, evolve, harvest, change, nextDay
} from "../controllers/plant.controller.js";


const router = Router();

router.get(
    "/", authMiddleware,
    get
);

router.post(
    "/evolve", authMiddleware,
    evolve
);

router.post(
    "/harvest", authMiddleware,
    harvest
);
router.post(
    "/change", authMiddleware,
    change
);

router.put(
    "/nextDay", authMiddleware,
    nextDay
);

router.post(
    "/create", authMiddleware,
    create
);

export default router;