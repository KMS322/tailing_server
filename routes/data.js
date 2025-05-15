const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// CSV 파일을 저장할 기본 디렉토리 경로
const DATA_DIR = path.join(__dirname, '../data');

// 디렉토리 생성 함수
const createDirectoryIfNotExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
};

router.post("/save", async(req, res, next) => {
  try {
    const { filename, data } = req.body;

    if (!filename || !data) {
      return res.status(400).json({ error: 'Filename and data are required' });
    }

    // 파일명에서 디바이스 코드와 날짜 추출
    // 예: DEVICE001_PET001_20240315-143022.csv
    const [deviceCode] = filename.split('_');
    const dateStr = filename.split('_')[2].split('-')[0]; // YYYYMMDD 부분 추출

    // 디렉토리 경로 생성
    const deviceDir = path.join(DATA_DIR, deviceCode);
    const dateDir = path.join(deviceDir, dateStr);

    // 필요한 디렉토리 생성
    createDirectoryIfNotExists(deviceDir);
    createDirectoryIfNotExists(dateDir);

    // 파일 저장 경로
    const filePath = path.join(dateDir, filename);

    // CSV 데이터를 파일로 저장
    fs.writeFileSync(filePath, data, 'utf8');

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

// 특정 날짜와 펫에 해당하는 CSV 파일 목록 가져오기
router.post("/load", async(req, res, next) => {
  try {
    const { date, petId } = req.body;
    console.log(date, petId);

    if (!date || !petId) {
      return res.status(400).json({ error: 'Date and petId are required' });
    }

    // 날짜 형식 변환 (YYYY-MM-DD -> YYYYMMDD)
    const formattedDate = date.replace(/-/g, '');
    
    // 디바이스 코드는 임시로 DEVICE001 사용
    const deviceDir = path.join(DATA_DIR, 'DEVICE001');
    const dateDir = path.join(deviceDir, formattedDate);

    // 해당 날짜 디렉토리가 없으면 빈 배열 반환
    if (!fs.existsSync(dateDir)) {
      return res.json([]);
    }

    // 디렉토리 내의 모든 파일 읽기
    const files = fs.readdirSync(dateDir);

    // 펫 ID에 해당하는 파일만 필터링
    const petFiles = files.filter(file => file.includes(`PET${petId}`));

    // 파일 정보 생성
    const records = petFiles.map(filename => {
      const filePath = path.join(dateDir, filename);
      const stats = fs.statSync(filePath);
      
      return {
        filename,
        timestamp: stats.mtime.toISOString(),
        size: stats.size
      };
    });

    // 타임스탬프 기준으로 정렬 (최신순)
    records.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json(records);
  } catch(e) {
    console.error('Error loading records:', e);
    next(e);
  }
});

module.exports = router;