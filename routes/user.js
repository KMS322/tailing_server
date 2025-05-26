const express = require("express");
const bcrypt = require("bcrypt");
const {  Organization } = require("../models");
const { Device } = require("../models");
const { isLoggedIn, isNotLoggedIn } = require("../middlewares/auth");
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post("/signup", isNotLoggedIn, async(req,res,next) => {
  try {
    const { deviceCode, org_name, org_address, org_id, org_pw, org_phone, org_email, marketingAgreed, smsAgreed, emailAgreed, pushAgreed } = req.body;
    const exUser = await Organization.findOne({ where: { org_id } });
    if (exUser) {
      return res.status(400).json({ message: "이미 가입된 아이디입니다." });
    }

    const exDeviceOrg = await Device.findOne({ where: { device_code: deviceCode, used: true } });
    if (exDeviceOrg) {
      return res.status(400).json({ message: "이미 등록된 디바이스입니다." });
    }
    
    const hashedPassword = await bcrypt.hash(org_pw, 12);

    const organization = await Organization.create({
      device_code: deviceCode,
      org_name,
      org_address,
      org_id,
      org_pw: hashedPassword,
      org_phone,
      org_email,
      agree_marketing : marketingAgreed,
      agree_sms : smsAgreed,
      agree_email : emailAgreed,  
      agree_push : pushAgreed
    });
    await Device.update(
      { used: true },
      { where: { device_code: deviceCode } }
    );
 

    res.status(201).json({
      message: "회원가입이 완료되었습니다.",
      data: {
        organization: {
          org_id: organization.org_id,
          org_name: organization.org_name,
          device_code: organization.device_code
        }
      }
    });
  } catch(e){
    console.error(e);
    next(e);
  }
})

router.post("/checkId", isNotLoggedIn, async(req,res,next) => {
  try {
    const {org_id} = req.body;
    const exUser = await Organization.findOne({ where: { org_id } });
    if (exUser) {
      return res.status(400).json({ message: "이미 가입된 아이디입니다." });
    }
    res.status(200).json({ message: "사용 가능한 아이디입니다." });
  } catch(e){
    console.error(e);
    next(e);
  }
});

router.post("/login", isNotLoggedIn, async(req,res,next) => {
  try {
    const { id, password } = req.body;
    const exUser = await Organization.findOne({ where: { org_id : id } });
    if(!exUser){
      return res.status(400).json({ message: "존재하지 않는 아이디입니다." });
    }
    const isMatch = await bcrypt.compare(password, exUser.org_pw);
    if(!isMatch){
      return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });
    }

    const token = jwt.sign(
      { 
        org_id: exUser.org_id,
        device_code: exUser.device_code
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(200).json({ 
      data: { token },
      message: "로그인 성공" 
    });
  } catch(e){
    console.error(e);
    next(e);
  }
});

module.exports = router;
