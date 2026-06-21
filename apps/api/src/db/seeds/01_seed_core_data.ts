import { Knex } from "knex";
import { faker } from "@faker-js/faker";

//"Cleaning the slate" means completely wiping out the existing data in your tables before inserting new dummy data.
export async function seed(knex: Knex): Promise<void> {
  //delete existing data in order -- products first since it is the child of suppliers

  await knex("products").del();
  await knex("suppliers").del();
  await knex("users").del();

  //create 10 suppliers

  const suppliersToIinsert = Array.from({ length: 10 }).map(() => ({
    name: faker.company.name(),
    contact_email: faker.internet.email(),
    phone: faker.phone.number(),
  }));

  //insert suppliers array into DB and store their respective ID

  const insertedSuppliers = await knex("suppliers")
    .insert(suppliersToIinsert)
    .returning("id");

  //create 50 products and randomly assign them to our suppliers

  const productsToInsert = Array.from({ length: 50 }).map(() => {
    //choose random supplier ID

    const randomSupplier =
      insertedSuppliers[Math.floor(Math.random() * insertedSuppliers.length)];

    return {
      name: faker.commerce.productName(),
      sku: faker.string.alphanumeric(10).toUpperCase(),
      price_cents: faker.number.int({ min: 500, max: 25000 }),
      stock: faker.number.int({ min: 0, max: 10000 }),

      supplier_id: randomSupplier.id,
    };
  });

  await knex("products").insert(productsToInsert);

  //create one admin user

  await knex("users").insert([
    {
      email: "admin@stockpulse.com",
      password_hash: "dummy_hash_for_now",
      role: "admin",
    },
  ]);
}
