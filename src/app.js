import express from "express";
import handlerbars from "express-handlebars";
import { productsRouter } from "./routers/products.router.js";
import { cartsRouter } from "./routers/carts.router.js";
import { realTimeProducts } from "./routers/realtimeproducts.router.js";
import { initSocket } from "./socket.js";

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", handlerbars.engine());
app.set("views", "views/");
app.set("view engine", "handlebars");
app.use(express.static("public"));
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/realtimeproducts", realTimeProducts);

const webServer = app.listen(8080, () => {
  console.log("Puerto 8080 escuchando...");
});

const io = initSocket(webServer);

export { io };
