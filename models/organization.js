module.exports = (sequelize, DataTypes) => { 
  const Organization = sequelize.define(
    "Organization",
    {
      device_code: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true,
      },
      org_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      org_address: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      org_id: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
      },
      org_pw: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      org_phone: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
      org_email: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    }
  );
  Organization.associate = (db) => {
    db.Organization.hasMany(db.Pet, {foreignKey: "device_code"});
  };
  return Organization;
}


