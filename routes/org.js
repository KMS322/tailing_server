const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const {Organization} = require('../models');

router.post("/load", async (req, res, next) => {
  try {
    const { device_code } = req.body;

    const org = await Organization.findOne({
      attributes: { exclude: ['org_pw'] },
      where: { device_code: device_code 
    }}); 

    if (!org) {
      return res.status(404).json({
        message: "존재하지 않는 기관입니다."
      });
    }

    res.status(200).json({
      data: org,
      message: "기관 정보 조회 성공"
    });
  } catch (error) {
    console.error("Error in /load:", error);  // 디버깅용 로그
    next(error);
  }
});

router.post("/update", async (req, res, next) => {
  try {
    const { device_code, org_name, org_address, org_phone, org_email } = req.body;
    const org = await Organization.update({
      org_name: org_name,
      org_address: org_address,
      org_phone: org_phone,
      org_email: org_email
    }, {
      where: { device_code: device_code }
    });

    if (!org) {
      return res.status(404).json({ 
        message: "존재하지 않는 기관입니다."
      });
    }
  }
  catch(error) {
    console.error("Error in /update:", error);
    next(error);
  }
})

router.post("/changePW", async(req, res, next) => {
  try {
    const { token, org_id, org_pw, org_new_pw } = req.body;

    const exUser = await Organization.findOne({
      where: {device_code: token.device_code, org_id : token.org_id}
    })

    if(!exUser) {
      return res.status(400).json({
        message: "존재하지 않는 기관입니다."
      })
    }

    const isMatch = await bcrypt.compare(org_pw, exUser.org_pw);
    if(!isMatch){
      return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });
    }

    const hash = await bcrypt.hash(org_new_pw, 12);
    await Organization.update({
      org_pw: hash
    }, {
      where: {device_code: token.device_code, org_id : token.org_id}
    })
    res.status(200).json({
      message: "비밀번호 변경 성공"
    });
  } catch(e) {
    console.error(e);
    next(e);
  }
})

router.post("/changeInfo", async(req, res, next) => {
  try {
    const { token, org_name, org_address, org_phone, org_email } = req.body;

    const exUser = await Organization.findOne({
      where: {device_code: token.device_code, org_id : token.org_id}
    })

    if(!exUser) {
      return res.status(400).json({
        message: "존재하지 않는 기관입니다."
      })
    }
    
    await Organization.update({
      org_name: org_name,
      org_address: org_address,
      org_phone: org_phone,
      org_email: org_email
    }, {
      where: {device_code: token.device_code, org_id : token.org_id}
    })
    
    res.status(200).json({
      message: "기관 정보 변경 성공"
    })
  } catch(e){
    console.error(e);
    next(e);
  }
})

router.post("/loadAgree", async(req, res, next) => {
  try {
    const { token } = req.body;
    console.log("token : ", token);
    const org = await Organization.findOne({  
      where: {device_code: token.device_code, org_id : token.org_id},
      attributes: ['agree_marketing', 'agree_sms', 'agree_email', 'agree_push']
    })

    if(!org) {
      return res.status(400).json({
        message: "존재하지 않는 기관입니다."
      })
    }

    res.status(200).json({
      data: org,
      message: "약관 조회 성공"
    })
  } catch(e) {
    console.error(e);
    next(e);
  }
})

router.post("/changeAgree", async(req, res, next) => {
  try {
    const { token, agree } = req.body;
    console.log("agree : ", agree);
    // await Organization.update({
    //   agree_marketing: agree.agree_marketing,
    //   agree_sms: agree.agree_sms,
    //   agree_email: agree.agree_email,
    //   agree_push: agree.agree_push
    // }, {
    //   where: {device_code: token.device_code, org_id : token.org_id},
    // })


    
    
  }
  catch(e) {
    console.error(e);
  }
})
module.exports = router;



