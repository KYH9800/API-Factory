'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      email: {
        type: DataTypes.STRING(50), // 문자열 30글자 이내, STRING 외: TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME
        allowNull: false, // 필수
        unique: true, // 고유한 값
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      userIdName: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true, // 고유한 값
      },
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci', // 한글 저장
    }
  );
  User.associate = (db) => {
    // hasOne
    db.User.hasOne(db.UserProfileImage);
    db.User.hasOne(db.UserInfo);
    // hasMany
    db.User.hasMany(db.Post); // 한 사람이 Post(게시글)를 여러개 가질 수 있다(작성자는 한명)
    db.User.hasMany(db.Comment); // 한 사람이 댓글을 여러개 쓸 수 있다(작성자는 한명)
    // belongsToMany
    db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked' }); // 내가 좋아요를 누른 게시물
    db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followers', foreignKey: 'FollowingId' });
    db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followings', foreignKey: 'FollowerId' });
    // associations can be defined here / 관계 설정
    // hasOne, hasMany, belongsTo, belongsToMany
    // db.User.hasMany(db.Post);
    // db.User.hasMany(db.Comment);
  };
  return User;
};
