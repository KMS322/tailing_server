const { Device, Organization, Pet } = require("../models");
const bcrypt = require("bcrypt");
const { deviceCodes } = require("./deviceCode");

const InitDevice = async () => {
  try {
    console.log("InitDevice 시작...");
    const exDevice = await Device.findAll();

    if (exDevice.length === 0) {
      console.log("Device 테이블이 비어있습니다. 디바이스 코드를 생성합니다...");
      for (const code of deviceCodes) {
        await Device.create({
          device_code: code,
          used: false,
        });
      }
      console.log(`디바이스 코드 ${deviceCodes.length}개 생성 완료`);
    }

    const exUser = await Organization.findAll();
    if (exUser.length === 0) {
      console.log(
        "Organization 테이블이 비어있습니다. 초기 계정을 생성합니다..."
      );
      const hashedPassword = await bcrypt.hash("a", 12);

      await Organization.create({
        device_code: "aa",
        org_name: "기본 관리자",
        org_address: "기본 주소",
        org_id: "a",
        org_pw: hashedPassword,
        org_phone: "010-0000-0000",
        org_email: "admin@example.com",
        agree_marketing: false,
        agree_sms: false,
        agree_email: false,
        agree_push: false,
        isActive: true,
      });

      await Device.update({ used: true }, { where: { device_code: "aa" } });

      console.log("초기 계정 생성 완료 - ID: a, PW: a, Device Code: aa");
    }

    const exPet = await Pet.findAll();
    if (exPet.length === 0) {
      console.log("Pet 테이블이 비어있습니다. 초기 펫 데이터를 생성합니다...");

      await Pet.create({
        name: "루시",
        birth: "2020-03-15",
        breed: "골든 리트리버",
        gender: false,
        neutered: true,
        disease: "없음",
        weight: "28.5",
        vet: "서울동물병원",
        history: "정기 검진 완료",
        species: "개",
        admission: "2024-01-10",
        device_code: "aa",
        pet_code: "PET001",
        fur_color: "황금색",
      });

      await Pet.create({
        name: "코코",
        birth: "2021-07-20",
        breed: "페르시안",
        gender: false,
        neutered: true,
        disease: "없음",
        weight: "4.2",
        vet: "서울동물병원",
        history: "예방접종 완료",
        species: "고양이",
        admission: "2024-02-15",
        device_code: "aa",
        pet_code: "PET002",
        fur_color: "흰색",
      });

      await Pet.create({
        name: "초코",
        birth: "2019-11-05",
        breed: "비글",
        gender: true,
        neutered: false,
        disease: "슬개골 탈구",
        weight: "12.3",
        vet: "서울동물병원",
        history: "슬개골 치료 중",
        species: "개",
        admission: "2023-12-20",
        device_code: "aa",
        pet_code: "PET003",
        fur_color: "갈색",
      });

      console.log("초기 펫 데이터 생성 완료 - 루시, 코코, 초코 (총 3마리)");
    }

    console.log("InitDevice 완료");
  } catch (e) {
    console.error("InitDevice 에러:", e);
  }
};

module.exports = { InitDevice };
