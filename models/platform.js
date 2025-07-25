const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const platform = sequelize.define(
    "platform",
    {
      platform_code: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      platform_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      platform_version_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      platform_build_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "platform",
      underscored: true,
    }
  );

  // 관계 설정
  platform.associate = (models) => {};

  return platform;
};
