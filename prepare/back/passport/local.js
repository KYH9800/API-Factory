// local login 전략
const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const { User } = require('../models');

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
};
