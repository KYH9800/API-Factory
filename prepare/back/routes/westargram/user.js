const bcrypt = require('bcrypt');
const router = require('express').Router();

const { User } = require('../../models');

// GET /user
router.get('/', (req, res) => {
  res.send('user router');
});

// POST /user/login
router.post('/login', (req, res) => {
  // todo: 로그안
});

// POST /user, 회원가입
router.post('/', async (req, res, next) => {
  console.log('req.body.email', req.body.email);
  try {
    const alreadyUserId = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (alreadyUserId) {
      return res.status(403).send('이미 사용중인 계정입니다.');
    }
    // User table에 가입 정보 생성
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await User.create({
      email: req.body.email,
      password: hashedPassword, // 비밀번호를 그대로 받아오면 보안에 위협, 라이브러리를 통한 보안 장치 장착
      name: req.body.name,
      userIdName: req.body.userIdName,
    });
    res.status(201).send('signup OK');
  } catch (err) {
    console.error(err);
    next(err); // status 500, next를 통해 error를 보낼 수 있다
  }
});

router.post('/logout', (req, res) => {
  // todo: 로그아웃
});

module.exports = router;
