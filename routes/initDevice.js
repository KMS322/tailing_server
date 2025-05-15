const { Device } = require("../models");
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

    } catch(e) {
        console.error(e);
    }
}

module.exports = { InitDevice };