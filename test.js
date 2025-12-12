const express = require("express");
const path = require("path");
const app = express();
const port = 4000;

app.use(express.static(path.join(__dirname, "build")));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.post("/items", async (req, res, next) => {
  try {
    const data = req.body;
    console.log("req.body : ", req.body);

    res.send("ok");
  } catch (e) {
    console.error(e);
    next(e);
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
});
