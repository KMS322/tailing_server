module.exports = (sequelize, DataTypes) => {
  const Device = sequelize.define(
    "Device",
    {
      device_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      used: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      charset: "utf8mb4",
      collate: "utf8mb4_bin",
    }
  );
  Device.associate = (db) => {};
  
  return Device;
};
