import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(
  cors({
    origin:['https://todo-app-eight-liart-80.vercel.app/ ', 'http://localhost:5173'],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());


import router from "./routes/user.routes.js";
import todoRouter from "./routes/todo.routes.js"

app.use("/api/v1/user", router);
app.use("/api/v1/todo", todoRouter);

export {app}
