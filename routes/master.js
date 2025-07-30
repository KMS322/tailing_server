const express = require("express");
const router = express.Router();
const { Organization, CsvData, Pet } = require("../models");
const fs = require("fs");
const path = require("path");

router.get("/loadOrg", async (req, res, next) => {
  try {
    const allOrgLists = await Organization.findAll({ raw: true });
    const allCsvLists = await CsvData.findAll({
      raw: true,
    });
    res.status(200).json({ allOrgLists, allCsvLists });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post("/loadData", async (req, res, next) => {
  try {
    const { code } = req.body;

    const csvLists = await CsvData.findAll({
      where: {
        device_code: code,
      },
      raw: true,
    });

    const baseDir = path.join(__dirname, "../data", code); // "../data/device_code"

    const dataLists = await Promise.all(
      csvLists.map(async (item) => {
        const currentDay = item.file_name.split("_")[2].split("-")[0];
        const filePath = path.join(baseDir, currentDay, item.file_name);

        try {
          const stats = await fs.promises.stat(filePath);
          const sizeBytes = stats.size;
          const sizeKB = (sizeBytes / 1024).toFixed(2);
          return {
            ...item,
            size: sizeKB,
          };
        } catch (err) {
          console.error(`파일 크기 확인 실패: ${filePath}`, err);
          return {
            ...item,
            size: null, // 또는 0, 또는 에러 메시지
          };
        }
      })
    );

    let petInfos;
    if (csvLists.length >= 1) {
      petInfos = await Pet.findAll({
        where: {
          device_code: code,
        },
        raw: true,
      });
    }

    res.status(200).json({ dataLists, petInfos });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post("/downloadFile", async (req, res, next) => {
  try {
    const { fileName, type } = req.body;
    const device_code = fileName.split("_")[0];
    let filePath;
    const currentDay = fileName.split("_")[2].split("-")[0];
    if (type === "customer") {
      filePath = path.join(
        __dirname,
        "../data",
        device_code,
        currentDay,
        fileName
      ); // 파일 경로
    } else {
      filePath = path.join(
        __dirname,
        "../data",
        device_code,
        currentDay,
        `creamoff_${fileName}`
      ); // 파일 경로
    }

    // 파일 존재 확인
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "파일을 찾을 수 없습니다." });
    }
    // 다운로드 헤더 설정
    const downloadFileName = path.basename(filePath);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${downloadFileName}"; filename*=UTF-8''${encodeURIComponent(
        downloadFileName
      )}`
    );

    // 파일 스트림으로 전송
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;
