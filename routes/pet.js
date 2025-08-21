const express = require("express");
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require("../middlewares/auth");
const { Pet } = require("../models");
const dayjs = require("dayjs");

router.post("/register", isLoggedIn, async (req, res, next) => {
  try {
    const data = req.body;
    const pet_code = `${data.device_code}_${dayjs().format("YYYYMMDDHHmmss")}`;
    if (data.gender) {
      data.gender = true;
    } else {
      data.gender = false;
    }

    const pet = await Pet.create({
      name: data.name,
      birth: data.birth,
      breed: data.breed,
      gender: data.gender,
      neutered: data.neutered,
      disease: data.disease,
      device_code: data.device_code,
      pet_code,
      weight: data.weight,
      vet: data.vet,
      history: data.history,
      species: data.species,
      admission: data.admission,
      fur_color: data.fur_color,
    });

    res.status(200).send("pet register success");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/load", isLoggedIn, async (req, res, next) => {
  try {
    const { device_code } = req.body;
    const pets = await Pet.findAll({
      where: { device_code },
    });
    res.status(200).json(pets);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post("/delete", async (req, res, next) => {
  try {
    const { pet_code } = req.body;
    await Pet.destroy({ where: { pet_code } });
    res.status(200).send("pet delete success");
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post("/update", async (req, res, next) => {
  try {
    const {
      pet_code,
      name,
      birth,
      breed,
      gender: originalGender,
      neutered,
      disease,
      weight,
      vet,
      history,
      species,
      admission,
      fur_color,
    } = req.body;

    const gender = originalGender ? true : false;

    await Pet.update(
      {
        name,
        birth,
        breed,
        gender,
        neutered,
        disease,
        weight,
        vet,
        history,
        species,
        admission,
        fur_color,
      },
      {
        where: { pet_code },
      }
    );

    res.status(200).send("pet edit success");
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;
