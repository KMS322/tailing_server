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
  );
  Device.associate = (db) => {};
  
  return Device;
};
