import { db } from "../db/connection";

export class ProductService{
    static async getAllProducts(){
        return db("products").select("*").orderBy("name", "asc");
    }




    static async createProduct(productData:any){
         
    const [newProduct] = await db("products") // runs last because of await, destructors
      .insert(productData)
      .returning("*");
    return newProduct; // returned a single object, we dont want that so we destructor
    }



    static async updatedProduct(id: string, updateData:any){
        const[updatedProduct] = await db("products")
        .where({ id })
        .update(updateData)
        .returning("*");

        return updatedProduct;
    }


    static async deleteProduct(id:string){
        return db("products").where({ id }).del();
    }



}
