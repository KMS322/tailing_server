const { Device,Organization } = require("../models");
const bcrypt = require("bcrypt");
const { deviceCodes } = require("./deviceCode");

const InitDevice = async () => {
    try {
        const exDevice = await Device.findAll();

        if(exDevice.length > 0) {
            return;
        }
        deviceCodes.forEach(async (code) => {
            await Device.create({
                device_code: code,
                used: false,
            });
        });

        const exUser = await Organization.findAll();
        if(exUser.length > 0) {
            return;
        }
        const hashedPassword = await bcrypt.hash("a", 12);
        const organization = await Organization.create({
            device_code: "Ab3cD4eF",
            org_name : "동물병원",
            org_address : "여기저기",
            org_id: "admin",
            org_pw: hashedPassword,
            org_phone : "010-1234-5678",
            org_email : "admin@gmail.com"
          });
      
          await Device.update(
            { used: true },
            { where: { device_code: "Ab3cD4eF" } }
          );
    } catch(e) {
        console.error(e);
    }
}

module.exports = { InitDevice };