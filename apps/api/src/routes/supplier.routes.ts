import { Router } from "express";
import { SupplierController } from "../controllers/supplier.controller";

const router = Router();

router.get("/", SupplierController.getSuppliers);

export default router;