module.exports = (sequelize, DataTypes) => {
  const Pet = sequelize.define(
    "Pet",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      birth: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      breed: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gender: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      neutered: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      disease: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      weight: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      vet: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      history: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      species: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      admission: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      device_code: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "Organizations",
          key: "device_code",
        },
      },
      pet_code: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      fur_color: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
    },
    {
      charset: "utf8mb4",
      collate: "utf8mb4_bin",
    }
  );

  Pet.associate = (db) => {
    db.Pet.belongsTo(db.Organization, { foreignKey: "device_code" });
  };

  return Pet;
};
