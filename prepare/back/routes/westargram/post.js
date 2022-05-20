const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Post, Comment, Image, User, UserProfileImage, Hashtag } = require('../../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

try {
  fs.accessSync('uploads');
} catch (error) {
  console.log('uploads 폴더가 없으므로 생성합니다.');
  fs.mkdirSync('uploads');
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, 'uploads');
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname); // filename: 고윤혁.png > 확장자 추출(.png)
      const basename = path.basename(file.originalname, ext); // 고윤혁
      done(null, basename + new Date().getTime() + ext); // 고윤혁2021070424239281.png
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, // 파일크기: 20MB
}); // 지금은 하드디스크에 저장하지만 AWS 배포 시 storage 옵션만 S3 서비스로 갈아끼울 예정

// POST /post, 게시글 작성
router.post('/', isLoggedIn, upload.none(), async (req, res, next) => {
  try {
    // const hashtags = req.body.content.match(/#[^\s#]+/g); // 해쉬태그를 꺼내온다
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });
    if (req.body.image) {
      if (Array.isArray(req.body.image)) {
        const images = await Promise.all(req.body.image.map((image) => Image.create({ src: image }))); // 이미지를 여러 개 올리면 image: [고윤혁.png, 태연.png]
        await post.addImages(images);
      } else {
        const image = await Image.create({ src: req.body.image }); // 이미지를 하나만 올리면 image: 고윤혁.png
        await post.addImages(image);
      }
    }
    // if (hashtags) {
    //   const result = await Promise.all(
    //     hashtags.map((tag) =>
    //       Hashtag.findOrCreate({
    //         where: { name: tag.slice(1).toLowerCase() },
    //       })
    //     )
    //   ); // [노드, true][리액트, true]
    //   await post.addHashtags(result.map((v) => v[0])); // 첫 번째 것만 추출해서 findOrCreate({...})
    // }
    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
        {
          model: Image,
        },
        {
          model: User, // 게시글 작성자
          attributes: ['id', 'userIdName'],
        },
        {
          model: User,
          include: [
            {
              model: UserProfileImage,
              attributes: ['id', 'src'],
            },
          ],
        },
        {
          model: Comment,
          include: [
            {
              model: User, // 댓글 작성자
              attributes: ['id', 'userIdName'],
            },
          ],
        },
        {
          model: User, // 좋아요 누른 사람
          as: 'Likers',
          attributes: ['id', 'userIdName'],
        },
      ],
    });
    res.status(201).json(fullPost);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// POST /post/images, 이미지 업로드
router.post('/images', isLoggedIn, upload.array('image'), (req, res, next) => {
  console.log('이미지 파일 정보:', req.files); // 업로드가 어떻게 됬는지 정보들이 담겨있음
  res.json(req.files.map((v) => v.filename)); // 어디로 업로드 되었는지에 대한 파일명들을 프론트로 보내줌
});

// DELETE /post, 게시글 삭제하기
router.delete('/:postId', isLoggedIn, async (req, res, next) => {
  try {
    await Post.destroy({
      where: {
        id: req.params.postId,
        UserId: req.user.id, // 이렇게 하면 다른 사람이 못 지움(해당 작성자만 지울수 있음)
      },
    }); // destroy: 파괴하다
    res.status(200).json({ PostId: parseInt(req.params.postId, 10) });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
