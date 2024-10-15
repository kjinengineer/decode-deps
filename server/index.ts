import express from "express";
import dependencyTree from "./dependencyTree";
import cors from "cors";

const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
};

const app = express();
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/dependencies", (req, res) => {
  console.log("res", res);
  res.json(dependencyTree);
});

app.listen(4000, () => {
  console.log("Server is running on http://localhost:4000");
});
