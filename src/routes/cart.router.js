import express from "express";
import { CartManager } from "../managers/cart.manager.js";

const router = express.Router();
const cartManager = new CartManager("./src/data/carts.json");

router.post('/', async (req, res) => {
  try {
    const cart = await cartManager.createCart();
    res.status(200).json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const cartId = Number(cid);
    const cart = await cartManager.getCartById(cartId);
    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
    } else {
      res.status(200).json(cart);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cartId = Number(cid);
    const productId = Number(pid);
    const cart = await cartManager.getCartById(cartId);
    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
    } else {
      await cartManager.saveProductToCart(cartId, productId);
      res.status(200).json({ message: "Product added to cart" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
