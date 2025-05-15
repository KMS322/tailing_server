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
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      device_code: {
        type: DataTypes.STRING(10),
        allowNull: false,
        references: {
          model: "Organizations",
          key: "device_code",
        },
      },
      pet_code: {
        type: DataTypes.STRING(20), 
        allowNull: false,
      }
    }
  );

  Pet.associate = (db) => {
    db.Pet.belongsTo(db.Organization, { foreignKey: "device_code" });
  };

  return Pet;
};
