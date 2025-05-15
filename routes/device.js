const express = require('express');
const router = express.Router();
const {Device} = require("../models");

router.post("/check", async(req, res, next) => {
  try {
    const { deviceCode} = req.body;
    console.log("device_code : ", deviceCode);
    const exDevice = await Device.findOne({
      where: {device_code : deviceCode}
    }) 

    if(!exDevice) {
      return res.status(400).json({message : "잘못된 디바이스 코드입니다."})
    }

    return res.status(200).json({message : "디바이스 코드 확인 완료"})

      
  } catch(e) {
    console.error(e);
    next(e);
  }
})

module.exports = router;

