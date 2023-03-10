const { Users } = require('../../models');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = process.env;
const logger = require('../../config/loggers');

// try catch 를 이용한게 아니라 error 처리 미들웨어를 이용해서 하는 방법 ???
module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const [tokenType, tokenValue] = authorization.split(' ');   //bearer토큰이 아닐 경우에 대한 검증필요 
    if (!authorization) {
      return res
        .status(401)
        .json({ error: '로그인 후 이용 가능한 기능입니다.' });
    }

    // 해당하는 jwt 가 유효한가에 대한 검증과 복호화
    const { userId } = jwt.verify(tokenValue, SECRET_KEY);
    Users.findByPk(userId).then((user) => {      //토큰을 까면 우리 유저라는 정보가 있을텐데 굳이 db에 접속해서 찾을 필요가 있을까? 
      res.locals.user = user;                    //jwt 토큰 특징 재정리 (예외처리에 대해서 생각해보자)
      next();
    });
  } catch (err) {
    logger.error(err.message);
    return res.status(401).json({ error: '로그인 후 이용 가능한 기능입니다.' });
  }
};

//로그인 토큰을 전달한 채로 로그인 API 또는 회원가입 API를 호출한 경우 "이미 로그인이 되어있습니다."라는 에러 메세지를 response에 포함하기
