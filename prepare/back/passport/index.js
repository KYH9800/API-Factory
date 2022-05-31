// passport 설정 파일
const passport = require('passport');
const local = require('./local');
const { User } = require('../models');
// jwt
const { ExtractJwt, Strategy: JWTStrategy } = require('passport-jwt');

// serializeUser가 req.login이 실행되면 동시에 실행된다.
module.exports = () => {
  // req.login의 user를 첫번 째 인자로 받아옴
  passport.serializeUser((user, done) => {
    return done(null, user.id); // cookie와 묶어줄 id만 저장한다 / session에 정보를 다 들고있기 무거우니까 id만 들고있는다
  }); // done(serverErr, success);

  // 저장한 id를 가지고 model(db table)에서 user의 정보를 찾아 내보내준다
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({
        where: { id }, // id를 찾고, user의 정보를 담는다
      });
      return done(null, user); // req.user 안에 user의 정보를 살려 내보내준다
    } catch (err) {
      console.error(err);
      return done(err);
    }
  });

  local(); // local 로그인 전략 실행

  // jwt
  const JWTConfig = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: 'jwt-secret-key',
  };

  const JWTVerify = async (jwtPayload, done) => {
    try {
      // payload의 id값으로 유저의 데이터 조회
      const user = await User.findOne({ where: { id: jwtPayload.id } });
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
  };

  passport.use('jwt', new JWTStrategy(JWTConfig, JWTVerify));
};
