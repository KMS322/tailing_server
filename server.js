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
const platformRouter = require("./routes/platform");
const masterRouter = require("./routes/master");
const hubRouter = require("./routes/hub");
const { InitDevice } = require("./routes/initDevice");
const { dummyPet } = require("./routes/dummy");

db.sequelize
  .sync()
  .then(async () => {
    console.log("db connected");
    await InitDevice();
    // await dummyPet();
  })
  .catch(console.err);

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3070",
      "http://localhost:5050",
      "http://localhost",
      "http://localhost:8081",
      "http://175.45.195.45:3000",
      "http://175.45.195.45",
      "http://210.90.113.200",
      "http://210.90.113.200:3070",
      "http://211.188.55.131:3070",
      "http://211.188.55.131:5050",
      "http://192.168.0.*",
      "http://192.168.0.61:3600",
      "http://192.168.0.61",
      "http://98.92.20.155:3000",
      "http://98.92.20.155:3070",
      "http://98.92.20.155:5050",
    ],
    // origin: "*",
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
// app.use(express.text());

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
app.use("/platform", platformRouter);
app.use("/master", masterRouter);
app.use("/hub", hubRouter);

app.post("/check/hub", async (req, res, next) => {
  try {
    const body = req.body;

    console.log("check body : ", body);
    const response = {
      isChange: false,
      wifi_id: "aaa@aaa.com",
      wifi_pw: "bbbb",
    };
    res.json(response);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

app.post("/external/device", async (req, res, next) => {
  try {
    const { deviceAddress, deviceData } = req.body;
    console.log("deviceAddress : ", deviceAddress);
    console.log("deviceData.length : ", deviceData.length);
    res.send("ok");
  } catch (e) {
    console.error(e);
    next(e);
  }
});

// 에러 핸들링 미들웨어는 라우터 다음에 위치해야 합니다
app.use(errorHandler);

const port = 3080;

app.listen(port, "0.0.0.0", () => {
  console.log(`new version server on ${port}`);
});
