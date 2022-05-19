'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserInfo = sequelize.define(
    'UserInfo',
    {
      userEmail: {
        type: DataTypes.STRING(50), // 문자열 30글자 이내, STRING 외: TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME
        allowNull: false, // 필수
      },
      webSite: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      introduce: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      phoneNum: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      sex: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci', // 한글 저장
    }
  );
  UserInfo.associate = (db) => {
    db.UserInfo.belongsTo(db.User);
  };
  return UserInfo;
};
