const express = require('express');
const router = express.Router();
const SignupController = require('../controllers/signup.controller');
const signupController = new SignupController();

router.post('/', signupController.signupUser);

module.exports = router;

//로그인 토큰을 가진 사람이 회원가입/로그인 페이지에 접근할 수 없는 장치 필요 