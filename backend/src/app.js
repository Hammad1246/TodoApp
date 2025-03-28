import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(
  cors({
    origin:'http://localhost:5173',
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
