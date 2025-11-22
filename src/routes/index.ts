import { Router } from "express";
import clientRoutes from "./clientRoutes";
import addressRoutes from "./addressRoutes";
import productRoutes from "./productRoutes";

const router = Router();
router.use("/clients", clientRoutes);
router.use("/clients/:id/addresses", addressRoutes);
router.use("/products", productRoutes);

export default router;