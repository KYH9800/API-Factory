const router = require('express').Router();
const bcrypt = require('bcrypt');
const passport = require('passport');

const { User } = require('../../models');

// GET /user
router.get('/', async (req, res, next) => {
  try {
    console.log('req.headers.cookie:', req.headers.cookie); // headers 안에 cookie가 들어있다
    if (req.user) {
      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.user.id },
        attributes: {
          exclude: ['password'],
        },
      });
      res.status(200).json(fullUserWithoutPassword);
    } else {
      res.status(200).json(null);
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// POST /user/login
router.post('/login', (req, res, next) => {
  // passport.authenticate('local', (serverErr, 성공객체, clientErr) => {...}
  passport.authenticate('local', (err, user, clientInfo) => {
    console.log('err:', err, 'user:', user, 'clientInfo:', clientInfo);
    if (err) {
      // 서버 에러가 생기면..
      console.error(err);
      next(err);
    }
    if (clientInfo) {
      // client 에러가 생기면 알려준다. / '존재하지 않는 사용자 입니다.' / '비밀번호가 틀렸습니다.'
      return res.status(401).send(clientInfo.reason);
    }
    // 서버와 클라이언트 에러가 없고 성공객체를 받아오면, user에 사용자 정보가 들어있다.
    // req.login 통해 passport에서 로그인을 할 수 있게 해준다.
    return req.login(user, async (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }
      const fullUserWithoutPassword = await User.findOne({
        where: { id: user.id },
        attributes: {
          exclude: ['password'], // 원하는 정보만 가져오거나 가져오지 않겠다 / 현재: pw 빼고 다 가져오겠다
        },
      });
      // res.setHeader("cookie", "cxlhy"); // 내부적으로 랜덤한 문자열의 cookie를 프론트에 보내줌 (cookie / app.js의 cookieParser())
      return res.status(200).json(fullUserWithoutPassword);
    });
  })(req, res, next);
});

// POST /user/logout
router.post('/logout', async (req, res, next) => {
  try {
    // req.user: 로그인 된 user 정보
    req.logout();
    req.session.destroy();
    res.send('logout ok');
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// POST /user/userIdName, 회원가입 사용자 아이디 중복확인
router.post('/userIdName', async (req, res, next) => {
  try {
    const alreadyUserIdName = await User.findOne({
      where: {
        userIdName: req.body.userIdName,
      },
    });
    if (alreadyUserIdName) {
      res.status(403).send('이미 사용중인 아이디 입니다.');
    }
    res.status(200).send('사용 가능한 아이디 입니다.');
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// POST /user, 회원가입
router.post('/', async (req, res, next) => {
  console.log('req.body.email', req.body.email);
  try {
    // 이메일 중복확인
    const alreadyUserEmail = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (alreadyUserEmail) {
      return res.status(403).send('이미 사용중인 계정입니다.');
    }
    const alreadyUserIdName = await User.findOne({
      where: {
        userIdName: req.body.userIdName,
      },
    });
    if (alreadyUserIdName) {
      return res.status(403).send('아래의 기입된 정보를 확인하세요.');
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
