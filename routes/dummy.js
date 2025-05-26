const {Pet, CsvData} = require("../models");
const { deviceCodes } = require("./deviceCode");

const dummyPet = async () => {
  try {
    const exPet = await Pet.findAll();
    if(exPet.length < 1) {    
    await Pet.create({
      name: "1번개",
      birth: "2020-01-01",
      admission: "1999-01-01",
      breed: "dog1",
      gender: false,
      neutered: true,
      weight: "50",
      vet: "dr. park",
      history: "두통, 복통",
      species: "개",
      disease: "고열",
      device_code: deviceCodes[0],
      pet_code: `${deviceCodes[0]}_20250519104529`,
    });
    await Pet.create({
      name: "2콩이",
      birth: "2019-03-15",
      admission: "1999-01-01",
      breed: "dog2",
      gender: true,
      neutered: false,
      weight: "50",
      vet: "dr. park",
      history: "두통, 복통",
      species: "개",
      disease: "고열",
      device_code: deviceCodes[0],
      pet_code: `${deviceCodes[0]}_20250519104530`,
    });
    await Pet.create({
      name: "3초코",
      birth: "2018-07-21",
      admission: "1999-01-01",
      breed: "dog3",
      gender: false,
      neutered: true,
      weight: "50",
      vet: "dr. park",
      history: "두통, 복통",
      species: "개",
      disease: "고열",
      device_code: deviceCodes[0],
      pet_code: `${deviceCodes[0]}_20250519104531`,
    });
    await Pet.create({
      name: "4하늘",
      birth: "2021-05-05",
      admission: "1999-01-01",
      breed: "dog4",
      gender: true,
      neutered: false,
      weight: "50",
      vet: "dr. park",
      history: "두통, 복통",
      species: "개",
      disease: "고열",
      device_code: deviceCodes[0],
      pet_code: `${deviceCodes[0]}_20250519104532`,
    });
    await Pet.create({
      name: "5달이",
      birth: "2022-11-11",
      admission: "1999-01-01",
      breed: "dog5",
      gender: false,
      neutered: false,
      weight: "50",
      vet: "dr. park",
      history: "두통, 복통",
      species: "개",
      disease: "고열",
      device_code: deviceCodes[0],
      pet_code: `${deviceCodes[0]}_20250519104533`,
    });

    }

    const exCsvData = await CsvData.findAll();
    if(exCsvData.length < 1) {
      await CsvData.create({
        device_code: deviceCodes[0],
        pet_code: `${deviceCodes[0]}_20250519104530`,
        date: "20250519",
        file_name: `${deviceCodes[0]}_20250519104530_20250519-114457.csv`
      })
      await CsvData.create({
        device_code: deviceCodes[0],
        pet_code: `${deviceCodes[0]}_20250519104530`,
        date: "20250519",
        file_name: `${deviceCodes[0]}_20250519104530_20250519-114517.csv`
      })
      await CsvData.create({
        device_code: deviceCodes[0],
        pet_code: `${deviceCodes[0]}_20250519104530`,
        date: "20250519",
        file_name: `${deviceCodes[0]}_20250519104530_20250519-114551.csv`
      })
      await CsvData.create({
        device_code: deviceCodes[0],
        pet_code: `${deviceCodes[0]}_20250519104530`,
        date: "20250519",
        file_name: `${deviceCodes[0]}_20250519104530_20250519-114625.csv`
      })
      await CsvData.create({
        device_code: deviceCodes[0],
        pet_code: `${deviceCodes[0]}_20250519104530`,
        date: "20250519",
        file_name: `${deviceCodes[0]}_20250519104530_20250519-114638.csv`
      })
    }
  } catch(e) {
    console.error(e);
  }
}

module.exports = {dummyPet};