const {Pet} = require("../models");

const dummyPet = async () => {
  try {
    await Pet.create({
      name: "1번개",
      birth: "2020-01-01",
      breed: "dog1",
      gender: false,
      neutered: true,
      device_code: "DEVICE001",
      pet_code: "PET001",
    });
    await Pet.create({
      name: "2콩이",
      birth: "2019-03-15",
      breed: "dog2",
      gender: true,
      neutered: false,
      device_code: "DEVICE001",
      pet_code: "PET002",
    });
    await Pet.create({
      name: "3초코",
      birth: "2018-07-21",
      breed: "dog3",
      gender: false,
      neutered: true,
      device_code: "DEVICE001",
      pet_code: "PET003",
    });
    await Pet.create({
      name: "4하늘",
      birth: "2021-05-05",
      breed: "dog4",
      gender: true,
      neutered: false,
      device_code: "DEVICE001",
      pet_code: "PET004",
    });
    await Pet.create({
      name: "5달이",
      birth: "2022-11-11",
      breed: "dog5",
      gender: false,
      neutered: false,
      device_code: "DEVICE001",
      pet_code: "PET005",
    });
  } catch(e) {
    console.error(e);
  }
}

module.exports = {dummyPet};