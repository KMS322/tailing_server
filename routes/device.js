const express = require('express');
const router = express.Router();
const {Device} = require("../models");

router.post("/check", async(req, res, next) => {
  try {
    const { deviceCode} = req.body;
    const exDevice = await Device.findOne({
      where: {device_code : deviceCode}
    }) 

    if(!exDevice) {
      console.log("유효하지 않은 디바이스 코드입니다.");
      return res.status(400).json({message : "유효하지 않은 디바이스 코드입니다."})
    }
    if(exDevice.used) {
      console.log("이미 등록된 디바이스 코드입니다.");
      return res.status(400).json({message : "이미 등록된 디바이스 코드입니다."})
    }

    return res.status(200).json({message : "등록 가능한 디바이스 코드입니다."})

      
  } catch(e) {
    console.error(e);
    next(e);
  }
})
module.exports = router;

