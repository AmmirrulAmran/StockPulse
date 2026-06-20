import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("products", (table)=>{
        table.uuid("id").primary().defaultTo(knex.fn.uuid());
        table.string("name").notNullable();
    table.string("sku").notNullable().unique();
    table.integer("price_cents").notNullable();
    table.integer("stock").notNullable().defaultTo(0);


    // Each product belongs to a supplier (Many-to-One relationship)
// supplier_id references suppliers.id to ensure data integrity
// If a supplier is deleted, supplier_id is set to NULL to avoid breaking product records
    table.uuid("supplier_id")
    .references("id")
    .inTable("suppliers")
    .onDelete("SET NULL");




    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("products")
}

