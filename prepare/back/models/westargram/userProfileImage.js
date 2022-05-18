'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserProfileImage = sequelize.define(
    'UserProfileImage',
    {
      src: {
        type: DataTypes.STRING(200),
        allowNull: false, // 필수
      },
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci', // 이모티콘 저장
    }
  );
  UserProfileImage.associate = (db) => {
    db.UserProfileImage.belongsTo(db.User);
  };
  return UserProfileImage;
};
