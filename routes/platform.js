const express = require("express");
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require("../middlewares/auth");
const { platform } = require("../models");
const dayjs = require("dayjs");

router.get("/platformOS", async (req, res, next) => {
  console.log("req.query", req.query);
  const platform_name = req.query.platform;
  try {
    const platformInfo = await platform.findOne({
      attributes: [
        "platform_name",
        "platform_version_name",
        "platform_build_number",
        "updated_at",
      ],
      where: { platform_name },
    });
    res.status(200).json(platformInfo);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;
