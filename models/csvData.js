module.exports = (sequelize, DataTypes) => {
  const CsvData = sequelize.define(
    "CsvData",
    {
      device_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pet_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      file_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      charset: "utf8mb4",
      collate: "utf8mb4_bin",
    }
  );
  CsvData.associate = (db) => {};
  
  return CsvData;
};
