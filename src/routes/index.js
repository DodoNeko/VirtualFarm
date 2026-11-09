import { Router } from "express";
import authRoutes from "./auth.routes.js";
import plantRoutes from "./plant.routes.js";

const router = Router();


router.use(
    "/auth",
    authRoutes
);

router.use(
    "/plant",
    plantRoutes
);


export default router;