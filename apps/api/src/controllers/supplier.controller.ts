import { Request,Response } from "express";
import { SupplierService } from "../services/supplier.services";


export class SupplierController{
    //static methods cannot be accessed by instances
    static async getSuppliers(req:Request, res:Response){


        try{
            const suppliers = await SupplierService.getAllSuppliers();
            res.status(200).json({
                success:true,
                data:suppliers,
            })
        }


        catch(error){
            console.error(error);
            res.status(500).json({success:false, message:"Internal Server Error"})
        }
    }
}