// middlewares/auth-middleware.js

const jwt = require("jsonwebtoken");
const { Users } = require("../models");

module.exports = async (req, res, next) => {
  console.log(req.headers);
  // const authorization = req.headers['authorization'];
  // if(!authorization) {
  //   return res.status(401).json({ error : 'No credentials sent!'});
  // }
  // const token = authorization.split(' ')[1];

  try {
    const { authorization } = req.cookies;
    console.log(req.cookies);
    const [tokenType, token] = authorization.split(" ");
    if (tokenType !== "Bearer") {
      return res.status(401).json({ message: "토큰 타입이 일치하지 않습니다." });
    }

    const decodedToken = jwt.verify(token, "customized_secret_key");
    const userId = decodedToken.userId;

    const user = await Users.findOne({ where: { userId } });
    if (!user) {
      res.clearCookie("authorization");
      return res.status(401).json({ message: "토큰 사용자가 존재하지 않습니다." });
    }
    res.locals.user = user;

    next();
  } catch (error) {
    console.log(error);
    res.clearCookie("authorization");
    return res.status(401).json({
      message: "비정상적인 요청입니다."
    });
  }
}