const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const postsRouter = require("./routes/posts");
const commentsRouter = require("./routes/comments");
const jwt = require('jsonwebtoken');
const app = express();

let corsOptions = {
    origin: "*", // 출처 허용 옵션
    credential: true, // 사용자 인증이 필요한 리소스(쿠키 ..등) 접근
  };

const port = 3000;

//cookie-parser 미들웨어
app.use(cookieParser());

// const { sequelize } = require('./models/index.js');

// async function main() {
//     await sequelize.sync({ force: true });
// }

// main();
app.use(cors(corsOptions));

app.use(express.json());
//loaclhost:3000/api -> postsRouter
app.use("/api", [postsRouter, commentsRouter]);
app.use(express.urlencoded({ extended: false }));

//cookie 할당
app.get("/set", (req, res) => {
    let expires = new Date();
    expires.setMinutes(expires.getMinutes() + 60); // 만료 시간을 60분으로 설정합니다.
  
    res.cookie('name', 'nodejs', {
      expires: expires
    });
    return res.status(200).end();
  });

//cookie-parser를 이용해 쿠키를 출력하는 API
app.get('/get', (req, res) => {
    //cookie를 불러오는 부분
    const cookie = req.cookies;
    console.log(cookie); // { name : 'sparta' }

    return res.status(200).json({ cookie });
});
//NOTE - Swagger 연동 코드
const { swaggerUi, specs } = require("./swagger/swagger");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// route 페이지
app.get('/', (req, res) => {
    res.send('여기는 초기 페이지!');
});

//jwt 적용하지 않은 로그인 API
// app.post('/login', function (req, res, next) {
//     const user = {
//         userId: 203,
//         email: "tjdhf@naver.com",
//         name: "박신양",
//     }
//     res.cookie('jungle', user); //jungle 이라는 이름을 가진 쿠키에 user 객체 할당
    
//     return res.status(200).end();
// });

//jwt 적용한 로그인 API
// app.post('/login', async (req, res) => {
//     const user = {
//         userId: 203,
//         email: "tjdhf@naver.com",
//         name: "박신양",
//     }

//     //사용자 정보를 JWT로 생성
//     const userJWT = await jwt.sign(user, 
//         'secretOrPrivateKey',
//         { expiresIn: "1h" }
//     );

//     res.cookie('jungle', 'Bearer ${userJWT}');
//     return res.status(200).end();
// })

//jwt를 할당한 cookie를 발급하는 API
app.post('/set-key', (req, res) => {
    const { key } = req.body;
    const token = jwt.sign({ key }, "jungle");
    res.cookie('token', token);
    return res.status(200).end();

})

//jwt를 할당한 cookie를 조회하는 API
app.get('/get-key', (req, res) => {
    const { token } = req.cookies;
    const { key } = jwt.decode(token);
    return res.status(200).json({ key }); 
})

app.listen(port, () => {
    console.log(port, '포트로 서버가 열림');
});

