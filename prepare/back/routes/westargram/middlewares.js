// 로그인이 된 경우
exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next(); // 로그인이 되어 있으면, 다음 미들웨어로 간다.
  } else {
    res.status(401).send('로그인이 필요합니다.');
  }
};

// 로그인이 되지 않은 경우
exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next(); // 로그인이 안되있으면(비어있으면), 다음 미들웨어로 간다.
  } else {
    res.status(401).send('로그인하지 않은 사용자만 접근이 가능합니다.');
  }
};
