const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/request", async (req, res, next) => {
  try {
    const text = req.body.data;
    res.send("aaa");
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post("/checkMacAddress", async (req, res, next) => {
  try {
    console.log("req.body : ", req.body);
    const { mac_address, user_email } = req.body;

    console.log("mac : ", mac_address);
    console.log("email : ", user_email);

    res.send("register success");
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post("/receiveIpAddress", async (req, res, next) => {
  try {
    const { ip } = req.body;
    console.log("ip : ", ip);
    console.log("req.body : ", req.body);

    res.send("ok");
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    const { mac_address } = req.body;

    console.log("AA");

    res.send("AA");
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post("/translate", async (req, res, next) => {
  try {
    const { text } = req.body;
    console.log("text : ", typeof text);

    const params = new URLSearchParams({
      source: "ko",
      target: "en",
      text: text,
    });
    const clientId = "I29zGq7rrwlCWpGwNe45";
    const clientSecret = "FpQD70jsnb";
    const response = await axios.post(
      "https://openapi.naver.com/v1/papago/n2mt",
      params,
      {
        headers: {
          "X-Naver-Client-Id": clientId,
          "X-Naver-Client-Secret": clientSecret,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("response.data : ", response.data);
    res.json({ translated: response.data.message.result.translatedText });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;
