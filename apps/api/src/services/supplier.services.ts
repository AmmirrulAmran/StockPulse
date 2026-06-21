import { db } from "../db/connection";


export class SupplierService{

    static async getAllSuppliers(){
        return db("suppliers").select("*").orderBy("name","asc")
    }
}