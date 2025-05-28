module.exports = (sequelize, DataTypes) => {
  const Board = sequelize.define('Board', {
    board_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT, 
      allowNull: false,
    },
    isPinned: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },  {
    charset: "utf8mb4",
    collate: "utf8mb4_bin",
  }
  );
  Board.associate = (db) => {
  };
  return Board;
};
