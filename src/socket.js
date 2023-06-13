import { Server } from "socket.io";
import ProductManager from "./services/ProductManager.js";

const productManager = new ProductManager();

export function initSocket(server) {
  const io = new Server(server);

  io.on("connection", async (socket) => {
    console.log("Nuevo cliente conectado!");

    socket.emit("products", await productManager.getProducts());

    socket.on("new-product", async (element) => {
      await productManager.addProduct(element);

      io.emit("products", await productManager.getProducts());
    });

    socket.on("del-product", async (element) => {
      await productManager.deleteProduct(element);

      io.emit("products", await productManager.getProducts());
    });
  });

  return io;
}
