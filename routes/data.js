const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');

const createDirectoryIfNotExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
};

router.post("/create", async(req, res, next) => {
  try {
    const {date, time, pet_code, device_code} = req.body;
    const deviceDir = path.join(DATA_DIR, device_code);
    const dateDir = path.join(deviceDir, date);
    const filename = `${device_code}_${pet_code}_${date}-${time}.csv`;
    createDirectoryIfNotExists(deviceDir);
    createDirectoryIfNotExists(dateDir);

    const filePath = path.join(dateDir, filename);
    const header = "time,ir,red,spo2,hr,temp\n";
    fs.writeFileSync(filePath, header, 'utf8');

    res.status(200).send("csv 파일 생성 완료");
  } catch(e) {
    console.error('Error creating data:', e);
    next(e);
  }
});

router.post("/save", async(req, res, next) => {
  try {
    const { filename, data } = req.body;

    if (!filename || !data) {
      return res.status(400).json({ error: 'Filename and data are required' });
    }

    const [deviceCode] = filename.split('_');
    const dateStr = filename.split('_')[2].split('-')[0]; // YYYYMMDD 부분 추출

    const deviceDir = path.join(DATA_DIR, deviceCode);
    const dateDir = path.join(deviceDir, dateStr);

    createDirectoryIfNotExists(deviceDir);
    createDirectoryIfNotExists(dateDir);

    const filePath = path.join(dateDir, filename);

    fs.writeFileSync(filePath, "data", 'utf8');

    res.json({ 
      success: true, 
      message: 'Data saved successfully',
      filePath 
    });
  } catch(e) {
    console.error('Error saving data:', e);
    next(e);
  }
});

router.post("/send", async(req, res, next) => {
  try {
    const {data, connectedDevice} = req.body;
    console.log("data.length : ", data.length);
    const {startDate, startTime, petCode, deviceCode} = connectedDevice;  

    // 디렉토리 경로 생성
    const deviceDir = path.join(DATA_DIR, deviceCode);
    const dateDir = path.join(deviceDir, startDate);
    const filename = `${deviceCode}_${petCode}_${startDate}-${startTime}.csv`;
    const filePath = path.join(dateDir, filename);

    // 데이터를 CSV 형식으로 변환
    const csvData = data.map(point => 
      `${point.timestamp},${point.ir},${point.red},${point.spo2},${point.hr},${point.temp}`
    ).join('\n');

    // 파일이 존재하면 추가, 없으면 에러
    if (fs.existsSync(filePath)) {
      fs.appendFileSync(filePath, '\n' + csvData, 'utf8');
      res.status(200).send("data saved successfully");
    } else {
      res.status(400).send("File does not exist. Please create file first.");
    }
  } catch(e) {
    console.error('Error sending data:', e);
    next(e);
  }
}); 

router.post("/load", async(req, res, next) => {
  try {
    const {date, pet_code, device_code} = req.body;

    const csvName = `${device_code}_${pet_code}_${date}`;
  } catch(e) {
    console.error('Error loading records:', e);
    next(e);
  }
});

module.exports = router;