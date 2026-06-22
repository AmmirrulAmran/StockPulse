import {Request, Response} from "express"
import { ProductService } from "../services/product.services"

export class ProductController{
    static async getProducts(req:Request, res:Response){
        try{
            const products = await ProductService.getAllProducts();
            res.status(200).json({ success: true, data: products });
        }

        catch (error) {
      res.status(500).json({ success: false, message: "Server Error" });
    }
    }


    static async createProduct(req:Request, res:Response){
 
        try {
      const newProduct = await ProductService.createProduct(req.body);
      res.status(201).json({ success: true, data: newProduct });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server Error" });
    }
}



    static async updateProduct(req:Request, res:Response){
         try {
      const id = req.params.id as string;
      const updatedProduct = await ProductService.updatedProduct(id, req.body);
      
      if (!updatedProduct) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }
      res.status(200).json({ success: true, data: updatedProduct });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server Error" });
    }
    }

static async deleteProduct(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const deletedCount = await ProductService.deleteProduct(id);
      
      if (deletedCount === 0) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }
      res.status(204).send(); // 204 means success, but no JSON body to return
    } catch (error) {
      res.status(500).json({ success: false, message: "Server Error" });
    }
  }
}



