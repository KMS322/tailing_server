const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { CsvData } = require('../models');

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
    const filename = `${pet_code}_${date}-${time}.csv`;
    createDirectoryIfNotExists(deviceDir);
    createDirectoryIfNotExists(dateDir);

    const filePath = path.join(dateDir, filename);
    const header = "time,ir,red,spo2,hr,temp\n";
    fs.writeFileSync(filePath, header, 'utf8');

    await CsvData.create({
      device_code,
      pet_code,
      date,
      file_name: filename,
    })


    res.status(200).send("csv 파일 생성 완료");
  } catch(e) {
    console.error('Error creating data:', e);
    next(e);
  }
});

router.post("/send", async(req, res, next) => {
  try {
    const {data, connectedDevice} = req.body;
    console.log("data.length : ", data.length);
    const {startDate, startTime, petCode, deviceCode} = connectedDevice;  

    const deviceDir = path.join(DATA_DIR, deviceCode);
    const dateDir = path.join(deviceDir, startDate);
    const filename = `${deviceCode}_${petCode}_${startDate}-${startTime}.csv`;
    const filePath = path.join(dateDir, filename);

    const csvData = data.map(point => 
      `${point.timestamp},${point.ir},${point.red},${point.spo2},${point.hr},${point.temp}`
    ).join('\n');

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

    const dataLists = await CsvData.findAll({
      where: {
        device_code,
        pet_code,
        date,
      }
    })

    res.status(200).json({
      success: true,
      dataLists,
    })
  } catch(e) {
    console.error('Error loading records:', e);
    next(e);
  }
});

router.post("/downloadCSV", async(req, res, next) => {
  try {
    const {filename} = req.body;
    const firstDir = filename.split("_")[0];
    const secondDir = filename.split("_")[1].split("-")[0].slice(0,8);
    const filePath = path.join(DATA_DIR, firstDir, secondDir, filename);
    if(fs.existsSync(filePath)){
    res.download(filePath, filename, (err) => {
        if (err) {
          console.error('Error sending file:', err);
          res.status(500).json({ error: '파일 전송 중 오류가 발생했습니다.' });
        }
      });
    } else {
      res.status(404).json({ error: '파일을 찾을 수 없습니다.' });
    }
  } catch(e) {
    console.error('Error downloading CSV:', e);
    next(e);
  }
})

module.exports = router;