import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { validate } from "../middlewares/validate";

import {
    createProductSchema,
    updateProductSchema,
    deleteProductSchema
} from "../validators/validators";



const router = Router();


router.get("/", ProductController.getProducts);
router.post("/", validate(createProductSchema), ProductController.createProduct);
router.put("/:id", validate(updateProductSchema), ProductController.updateProduct);
router.delete("/:id", validate(deleteProductSchema), ProductController.deleteProduct);


export default router;
