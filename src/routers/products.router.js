import { Router } from "express";
import { io } from "../app.js";

import ProductManager from "../services/ProductManager.js";

const productManager = new ProductManager();

const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
  try {
    let limit = req.query.limit;
    let allProducts = await productManager.getProducts();
    if (limit === undefined) {
      res.status(201).render("home", { allProducts, filtered: false });
    } else {
      let limitProducts = [];
      for (let i = 0; i < parseInt(limit); i++) {
        limitProducts.push(allProducts[i]);
      }
      res.status(201).render("home", { limitProducts, filtered: true });
    }
  } catch (err) {
    res.status(400).send({ err });
  }
});

productsRouter.get("/:pid", async (req, res) => {
  try {
    let idFilter = await productManager.getProductById(
      parseInt(req.params.pid)
    );
    res.status(201).send(idFilter);
  } catch (err) {
    res.status(400).send({ err });
  }
});

productsRouter.post("/", async (req, res) => {
  try {
    const newProduct = await productManager.addProduct(req.body);
    io.sockets.emit("products", await productManager.getProducts());
    res.status(201).send(newProduct);
  } catch (err) {
    res.status(400).send({ err });
  }
});

productsRouter.put("/:pid", async (req, res) => {
  try {
    const updateProduct = await productManager.updateProduct(
      parseInt(req.params.pid),
      req.body
    );
    io.sockets.emit("products", await productManager.getProducts());
    res.status(201).send(updateProduct);
  } catch (err) {
    res.status(400).send({ err });
  }
});

productsRouter.delete("/:pid", async (req, res) => {
  try {
    const deleteProduct = await productManager.deleteProduct(
      parseInt(req.params.pid)
    );
    io.sockets.emit("products", await productManager.getProducts());
    res.status(201).send(deleteProduct);
  } catch (err) {
    res.status(400).send({ err });
  }
});

export { productsRouter };
