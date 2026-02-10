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

let testData = 0;
router.post("/changeData", async (req, res, next) => {
  try {
    const { data } = req.body;

    testData = data;
    console.log("testData : ", testData);
    res.status(200).send("changed ok");
  } catch (e) {
    console.error(e);
    next(e);
  }
});
router.get("/serverData", async (req, res, next) => {
  try {
    console.log("요청 들어옴");

    res.status(200).json({ data: testData });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

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
    const header = "time,ir,red,green,spo2,hr,temp\n";
    const header2 = "time,ir,red,green,spo2,hr,temp\n";
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
    // 받은 데이터 전체 로깅
    console.log("=".repeat(50));
    // console.log("받은 데이터:", JSON.stringify(req.body, null, 2));
    console.log("=".repeat(50));

    // 데이터 구조 확인: req.body.data가 객체인지 배열인지 확인
    let sampling_rate, start_timestamp, data, hr, spo2, temp, connectedDevice;

    if (
      req.body.data &&
      typeof req.body.data === "object" &&
      !Array.isArray(req.body.data)
    ) {
      // 새로운 형식: req.body.data가 객체인 경우
      const dataObj = req.body.data;
      sampling_rate = dataObj.sampling_rate;
      start_timestamp = dataObj.start_timestamp;
      data = dataObj.raw_data || dataObj.data; // raw_data 또는 data 배열
      hr = dataObj.hr;
      spo2 = dataObj.spo2;
      temp = dataObj.temp;
      connectedDevice = req.body.connectedDevice;
    } else {
      // 기존 형식: 최상위 레벨에 있는 경우
      ({
        sampling_rate,
        start_timestamp,
        data,
        hr,
        spo2,
        temp,
        connectedDevice,
      } = req.body);
    }

    // 필수 데이터 검증
    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ error: "data 배열이 필요합니다." });
    }
    if (sampling_rate === undefined || sampling_rate === null) {
      return res.status(400).json({ error: "sampling_rate가 필요합니다." });
    }
    if (!start_timestamp) {
      return res.status(400).json({ error: "start_timestamp가 필요합니다." });
    }
    if (!connectedDevice) {
      return res.status(400).json({ error: "connectedDevice가 필요합니다." });
    }

    // sampling_rate가 0이면 기본값 사용 (예: 100Hz)
    const effectiveSamplingRate = sampling_rate > 0 ? sampling_rate : 100;
    console.log(
      `${dayjs().format("mm:ss:SSS")} : 데이터 ${
        data.length
      }개 수신, 샘플링 레이트: ${effectiveSamplingRate}Hz (원본: ${sampling_rate}Hz)`,
    );

    const { startDate, startTime, petCode, deviceCode } = connectedDevice;

    const deviceDir = path.join(DATA_DIR, deviceCode);
    const dateDir = path.join(deviceDir, startDate);
    const filename = `${petCode}_${startDate}-${startTime}.csv`;
    const filename2 = `creamoff_${petCode}_${startDate}-${startTime}.csv`;
    const filePath = path.join(dateDir, filename);
    const filePath2 = path.join(dateDir, filename2);

    // 샘플링 간격 계산 (밀리초 단위)
    const samplingInterval = 1000 / effectiveSamplingRate; // Hz -> ms 간격

    // start_timestamp 파싱
    let startTime_ms;
    if (start_timestamp.includes(":")) {
      // HH:mm:ss:SSS 형식
      const [hours, minutes, seconds, milliseconds] = start_timestamp
        .split(":")
        .map(Number);
      startTime_ms =
        hours * 3600000 +
        minutes * 60000 +
        seconds * 1000 +
        (milliseconds || 0);
    } else if (start_timestamp.length >= 13) {
      // 숫자 문자열 형식 (예: "20251212132516735" = YYYYMMDDHHmmssSSS)
      // 마지막 9자리: HHmmssSSS (시간, 분, 초, 밀리초)
      const timeStr = start_timestamp.slice(-9);
      const hours = parseInt(timeStr.slice(0, 2));
      const minutes = parseInt(timeStr.slice(2, 4));
      const seconds = parseInt(timeStr.slice(4, 6));
      const milliseconds = parseInt(timeStr.slice(6, 9));
      startTime_ms =
        hours * 3600000 + minutes * 60000 + seconds * 1000 + milliseconds;
    } else {
      // 알 수 없는 형식이면 현재 시간 사용
      const now = dayjs();
      startTime_ms =
        now.hour() * 3600000 +
        now.minute() * 60000 +
        now.second() * 1000 +
        now.millisecond();
      console.warn(
        `알 수 없는 start_timestamp 형식: ${start_timestamp}, 현재 시간 사용`,
      );
    }

    // CSV 데이터 생성
    const csvRows = [];
    const csvRows2 = [];

    data.forEach((dataPoint, index) => {
      // 콤마로 구분된 문자열 파싱: "ir,red,green"
      const [ir, red, green] = dataPoint.split(",");

      // 각 데이터 포인트의 timestamp 계산
      const currentTime_ms = startTime_ms + index * samplingInterval;
      const hrs = Math.floor(currentTime_ms / 3600000) % 24;
      const mins = Math.floor((currentTime_ms % 3600000) / 60000);
      const secs = Math.floor((currentTime_ms % 60000) / 1000);
      const ms = Math.floor(currentTime_ms % 1000);

      const formattedTime = `${hrs.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}:${ms
        .toString()
        .padStart(3, "0")}`;

      // 마지막 행(250번째)인 경우 hr, spo2, temp 값 사용, 아니면 0
      const isLastRow = index === data.length - 1;
      const hrValue = isLastRow ? hr : 0;
      const spo2Value = isLastRow ? spo2 : 0;
      const tempValue = isLastRow ? temp : 0;

      // 고객용 CSV와 원본 CSV 동일한 형식
      const csvRow = `${formattedTime},${ir},${red},${green},${spo2Value},${hrValue},${tempValue}`;
      csvRows.push(csvRow);
      csvRows2.push(csvRow);
    });

    const csvData = csvRows.join("\r\n") + "\r\n";
    const csvData2 = csvRows2.join("\n") + "\n";

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
    const csvParts = filename.split("_");
    const secondDir = csvParts[csvParts.length - 1].split("-")[0];
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
      },
    );

    res.status(200).send("CSV 파일 삭제 완료");
  } catch (e) {
    console.error("Error deleting CSV:", e);
    next(e);
  }
});

router.post("/test", async (req, res, next) => {
  try {
    const { text } = req.body;
    console.log("=".repeat(50));
    console.log("테스트 메시지 수신:", text);
    console.log("=".repeat(50));
    res.status(200).json({
      success: true,
      message: "서버가 메시지를 받았습니다",
      receivedText: text,
    });
  } catch (e) {
    console.error("Error in test route:", e);
    next(e);
  }
});

module.exports = router;
