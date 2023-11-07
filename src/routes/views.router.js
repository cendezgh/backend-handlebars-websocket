import { Router } from "express";
const router = Router();
import fs from 'fs';

router.get("/", async(req, res) => {
    const productsFilePath = './src/data/products.json';
    const productsData = await fs.readFileSync(productsFilePath, 'utf-8');
    const products = JSON.parse(productsData);
    res.render("home", { products })
});
router.get("/realtimeproducts", (req, res) => {
    res.render("realTimeProducts")
});

export default router;
