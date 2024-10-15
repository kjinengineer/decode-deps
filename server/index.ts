import express from "express";
import dependencyTree from "./dependencyTree";
import cors from "cors";

const corsOptions = {
  origin: "http://localhost:5173", // 허용할 도메인
  optionsSuccessStatus: 200, // 일부 브라우저에서 204 대신 200 응답을 반환
};

const app = express();
app.use(cors(corsOptions));

app.get("/dependencies", (req, res) => {
  res.json(dependencyTree);
});

app.listen(4000, () => {
  console.log("Server is running on http://localhost:4000");
});
