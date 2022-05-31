// local login 전략
const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const { User } = require('../models');
// jwt
const { ExtractJwt, Strategy: JWTStrategy } = require('passport-jwt');

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email', // dispatch({email}) > data(reducer, saga) > req.body.email
        passwordField: 'password', // dispatch({password}) > data(reducer, saga) > req.body.password
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({
            where: { email }, // email: email ES6 문법으로 줄임
          });
          if (!user) {
            return done(null, false, { reason: '존재하지 않는 사용자 입니다.' }); // done(null: 서버 에러, false: 성공, reason: client 에러)
          }
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            return done(null, user);
          }
          return done(null, false, { reason: '비밀번호가 틀렸습니다.' });
        } catch (err) {
          console.error(err);
          return done(err);
        }
      }
    )
  );

  // jwt
  passport.use(
    'jwt',
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromHeader('authorization'),
        secretOrKey: 'jwt-secret-key',
      },
      async (jwtPayload, done) => {
        try {
          // payload의 id값으로 유저의 데이터 조회
          const user = await User.findOne({
            where: { id: jwtPayload.id },
          });
          // 유저 데이터가 있다면 유저 데이터 객체 전송
          if (user) {
            done(null, user);
            return;
          }
          // 유저 데이터가 없을 경우 에러 표시
          done(null, false, { reason: '올바르지 않은 인증정보 입니다.' });
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
