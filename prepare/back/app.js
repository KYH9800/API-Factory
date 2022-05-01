const express = require('express');
const app = express();

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

app.get('/', (req, res) => {
  res.send('Wellcome, API Factory');
});

app.use('/user', userRouter);

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
