'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    'Post',
    {
      content: {
        type: DataTypes.TEXT,
        allowNull: false, // 필수
      },
    },
    {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci', // 이모티콘 저장
    }
  );
  Post.associate = (db) => {
    // hasMany
    db.Post.hasMany(db.Comment);
    db.Post.hasMany(db.Image); // post.addImages, post.getImages
    // belongsTo
    db.Post.belongsTo(db.User); // db.Post.belongsTo(db.Post, { as: 'Retweet' });
    // belongsToMany
    db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' });
    db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
  };
  return Post;
};
