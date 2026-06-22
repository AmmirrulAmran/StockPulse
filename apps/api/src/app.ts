import express from "express";
import cors from "cors";
import supplierRoutes from "./routes/supplier.routes";
import productRoutes from "./routes/product.routes";


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1/suppliers", supplierRoutes);
app.use("/api/v1/products", productRoutes);

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

export default app;
