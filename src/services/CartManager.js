import fs from "fs";

export default class CartManager {
  #id = 0;
  constructor() {
    this.path = "./src/services/carts.json";
    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, JSON.stringify([]));
      console.log("Cree el archivo vacio");
    }
  }
  async addCart() {
    try {
      const totalCarts = await this.getCarts();
      const cart = {
        products: [],
      };
      if (totalCarts.length > 0) {
        this.#id = totalCarts[totalCarts.length - 1].id;
      }
      cart.id = this.#getId();
      totalCarts.push(cart);
      await fs.promises.writeFile(this.path, JSON.stringify(totalCarts));
      return cart;
    } catch (err) {
      console.log("No puedo agregar el carrito");
    }
  }

  #getId() {
    this.#id++;
    return this.#id;
  }

  async getCarts() {
    try {
      const totalCarts = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(totalCarts);
    } catch (err) {
      console.log("No puedo darte los carritos");
    }
  }

  async getCartById(id) {
    try {
      const totalCarts = await this.getCarts();
      const findId = totalCarts.findIndex((eLe) => eLe.id === id);
      if (findId === -1) {
        console.log("ID Not Found!!!");
        return;
      } else {
        console.log("ID Cart Found!!!");
        console.log(totalCarts[findId].products);
        return totalCarts[findId].products;
      }
    } catch (err) {
      console.log("No puedo darte el ID");
    }
  }

  async addToCart(cid, pid) {
    try {
      const totalCarts = await this.getCarts();
      const findId = totalCarts.findIndex((eLe) => eLe.id === parseInt(cid));
      if (findId === -1) {
        console.log("Cart ID Not Found!!!");
        return "Cart ID Not Found";
      }
      const addprod = totalCarts[findId];
      if (addprod.products.length === 0) {
        addprod.products = [{ product: parseInt(pid), quantity: 1 }];
      } else {
        const findProduct = addprod.products.findIndex(
          (eLe) => eLe.product === parseInt(pid)
        );
        if (findProduct === -1) {
          addprod.products.push({ product: parseInt(pid), quantity: 1 });
        } else {
          addprod.products[findProduct].quantity++;
        }
      }
      
      await fs.promises.writeFile(this.path, JSON.stringify(totalCarts));
      return addprod.products;
    } catch (err) {
      console.log("No puedo agregar el carrito");
    }
  }
}
