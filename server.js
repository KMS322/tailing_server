const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./models");
const errorHandler = require("./middlewares/error");
dotenv.config();
const app = express();
const userRouter = require("./routes/user");
const petRouter = require("./routes/pet");
const deviceRouter = require("./routes/device");
const dataRouter = require("./routes/data");
const orgRouter = require("./routes/org");
const boardRouter = require("./routes/board");
const { InitDevice } = require("./routes/initDevice");
const { dummyPet } = require("./routes/dummy");

db.sequelize
  .sync()
  .then(async () => {
    console.log("db connected");
    await InitDevice();
    await dummyPet();
  })
  .catch(console.err);

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost",
      "http://localhost:8081",
      "http://175.45.195.45:3000",
      "http://175.45.195.45",
    ],
    // origin: "*",
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.get("/", (req, res) => {
  console.log("server accessed");
  res.status(200).send("server on");
});

app.use("/user", userRouter);
app.use("/pet", petRouter);
app.use("/device", deviceRouter);
app.use("/data", dataRouter);
app.use("/org", orgRouter);
app.use("/board", boardRouter);
// 에러 핸들링 미들웨어는 라우터 다음에 위치해야 합니다
app.use(errorHandler);

const port = 3060;

app.listen(port, "0.0.0.0", () => {
  console.log(`${port}에서 서버 실행 중`);
});
