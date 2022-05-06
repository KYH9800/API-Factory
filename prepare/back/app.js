const express = require('express');
const app = express();
require('dotenv').config; // dotenv

const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
// 로그인
const passportConfig = require('./passport');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
// models
const db = require('./models');
// router
const userRouter = require('./routes/westargram/user');

// sequelize
db.sequelize
  .sync()
  .then(() => {
    console.log('db 연결 성공');
  })
  .catch(console.error);

db.sequelize.sync({
  alter: true,
}); // sequelize model sync() 수정하기

app.use(morgan('dev')); // 프론트에서 백엔드로 어떤 요청을 보냈는가 확인
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// 로그인 session / cookie
passportConfig(); // 로그인, passport
app.use(cookieParser(process.env.COOKIESCRET)); //* 프론트에서 cookie(랜덤한 문자열의 정보 key)를 가지고 있는다
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIESCRET, // secret으로 데이터 복원 가능 때문에 보안을 위해 감춘다
  })
); //* server에서 통째로 들고있는 정보: session
// passport.session() in index.js(passport)
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send('Wellcome, API Factory');
});

// json 형식으로 데이터를 전달 받기 위한 라이브러리
app.use(bodyParser.json());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// router
app.use('/user', userRouter);

// 3065 port를 사용
app.listen(3065, () => {
  console.log('app listening on port 3065');
});

// 1. mySQL과 sequelize 연결
// 2. sequelize model 만들기
// 3. sequelize 관계 설정하기
// 4. sequelize sync
// 5. 회원가입 구현
// 6. cors 문제 해결
// 7. passport로 로그인 전략 구현
// 8. cookie && session, 로그인 흐름 파악
// 9. 로그인 문제 해결하기
// 10. 미들웨어로 라우터 검사(로그인 유뮤 확인)
// 11. credentials로 cookie 공유하기
// 12. 내 로그인 정보 매번 불러오기
