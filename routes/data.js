const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { CsvData } = require("../models");
const dayjs = require("dayjs");

const DATA_DIR = path.join(__dirname, "../data");

const createDirectoryIfNotExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
};

router.post("/create", async (req, res, next) => {
  try {
    const { date, time, pet_code, device_code } = req.body;
    const deviceDir = path.join(DATA_DIR, device_code);
    const dateDir = path.join(deviceDir, date);
    const filename = `${pet_code}_${date}-${time}.csv`;
    const filename2 = `creamoff_${pet_code}_${date}-${time}.csv`;
    createDirectoryIfNotExists(deviceDir);
    createDirectoryIfNotExists(dateDir);

    const filePath = path.join(dateDir, filename);
    const filePath2 = path.join(dateDir, filename2);
    const header = "time,spo2,hr,temp\n";
    const header2 = "time,cnt,ir,red,green,spo2,hr,temp\n";
    fs.writeFileSync(filePath, header, "utf8");
    fs.writeFileSync(filePath2, header2, "utf8");

    await CsvData.create({
      device_code,
      pet_code,
      date,
      file_name: filename,
    });

    res.status(200).send("csv 파일 생성 완료");
  } catch (e) {
    console.error("Error creating data:", e);
    next(e);
  }
});

router.post("/send", async (req, res, next) => {
  try {
    const { data, connectedDevice } = req.body;
    console.log(`${dayjs().format("mm:ss:SSS")} : ${data.length}`);
    const { startDate, startTime, petCode, deviceCode } = connectedDevice;

    const deviceDir = path.join(DATA_DIR, deviceCode);
    const dateDir = path.join(deviceDir, startDate);
    const filename = `${petCode}_${startDate}-${startTime}.csv`;
    const filename2 = `creamoff_${petCode}_${startDate}-${startTime}.csv`;
    const filePath = path.join(dateDir, filename);
    const filePath2 = path.join(dateDir, filename2);

    // console.log("data : ", data);

    data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    const uniqueDataMap = new Map();
    data.forEach((point) => {
      if (!uniqueDataMap.has(point.timestamp)) {
        uniqueDataMap.set(point.timestamp, point);
      }
    });
    const filteredData = Array.from(uniqueDataMap.values());

    const csvData = filteredData
      .map((point) => {
        const formattedTimestamp = new Date(point.timestamp).toLocaleTimeString(
          "ko-KR",
          {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            fractionalSecondDigits: 3,
          }
        );
        return `${formattedTimestamp},${point.spo2},${point.hr},${point.temp}`;
      })
      .join("\n");
    const csvData2 = filteredData
      .map((point) => {
        const date = new Date(point.timestamp);
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const seconds = date.getSeconds().toString().padStart(2, "0");
        const milliseconds = date.getMilliseconds().toString().padStart(3, "0");

        const formattedTimestamp = `${hours}:${minutes}:${seconds}:${milliseconds}`;
        return `${formattedTimestamp},${point.cnt},${point.ir},${point.red},${point.green},${point.spo2},${point.hr},${point.temp}`;
      })
      .join("\n");

    if (fs.existsSync(filePath)) {
      fs.appendFileSync(filePath, csvData, "utf8");
      fs.appendFileSync(filePath2, csvData2, "utf8");
      res.status(200).send("data saved successfully");
    } else {
      res.status(400).send("File does not exist. Please create file first.");
    }
  } catch (e) {
    console.error("Error sending data:", e);
    next(e);
  }
});

router.post("/load", async (req, res, next) => {
  try {
    const { date, pet_code, device_code } = req.body;

    const dataLists = await CsvData.findAll({
      where: {
        device_code,
        pet_code,
        date,
        isActive: true,
      },
    });

    res.status(200).json({
      success: true,
      dataLists,
    });
  } catch (e) {
    console.error("Error loading records:", e);
    next(e);
  }
});

router.post("/downloadCSV", async (req, res, next) => {
  try {
    const { filename } = req.body;
    const firstDir = filename.split("_")[0];
    const secondDir = filename.split("_")[2].split("-")[0];
    const filePath = path.join(DATA_DIR, firstDir, secondDir, filename);
    if (fs.existsSync(filePath)) {
      res.download(filePath, filename, (err) => {
        if (err) {
          console.error("Error sending file:", err);
          res.status(500).json({ error: "파일 전송 중 오류가 발생했습니다." });
        }
      });
    } else {
      res.status(404).json({ error: "파일을 찾을 수 없습니다." });
    }
  } catch (e) {
    console.error("Error downloading CSV:", e);
    next(e);
  }
});

router.post("/deleteCSV", async (req, res, next) => {
  try {
    const { filename } = req.body;
    console.log("filename : ", filename);

    await CsvData.update(
      {
        isActive: false,
      },
      {
        where: {
          file_name: filename,
        },
      }
    );

    res.status(200).send("CSV 파일 삭제 완료");
  } catch (e) {
    console.error("Error deleting CSV:", e);
    next(e);
  }
});

module.exports = router;
