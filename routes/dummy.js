const {Pet} = require("../models");
const { deviceCodes } = require("./deviceCode");

const dummyPet = async () => {
  try {
    const exPet = await Pet.findAll();
    if(exPet.length < 1) {    
    await Pet.create({
      name: "1번개",
      birth: "2020-01-01",
      breed: "dog1",
      gender: false,
      neutered: true,
      device_code: deviceCodes[0],
      pet_code: `${deviceCodes[0]}_20250519104529`,
    });
    await Pet.create({
      name: "2콩이",
      birth: "2019-03-15",
      breed: "dog2",
      gender: true,
      neutered: false,
      device_code: deviceCodes[0],
      pet_code: `${deviceCodes[0]}_20250519104530`,
    });
    await Pet.create({
      name: "3초코",
      birth: "2018-07-21",
      breed: "dog3",
      gender: false,
      neutered: true,
      device_code: deviceCodes[0],
      pet_code: `${deviceCodes[0]}_20250519104531`,
    });
    await Pet.create({
      name: "4하늘",
      birth: "2021-05-05",
      breed: "dog4",
      gender: true,
      neutered: false,
      device_code: deviceCodes[0],
      pet_code: `${deviceCodes[0]}_20250519104532`,
    });
    await Pet.create({
      name: "5달이",
      birth: "2022-11-11",
      breed: "dog5",
      gender: false,
      neutered: false,
      device_code: deviceCodes[0],
      pet_code: `${deviceCodes[0]}_20250519104533`,
    });

    }

  } catch(e) {
    console.error(e);
  }
}

module.exports = {dummyPet};