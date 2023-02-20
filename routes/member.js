const express = require("express");
const router = express.Router();
const path = require('path');
const Member = require('../models/Member');

router.get('/join', (req, res) => {
    res.render('join', {title: '회원가입'});
});

router.post('/join', (req, res, next) => {
    //console.log(req.body.uid, req.body.name, req.body.email);
    let {uid, pwd, pwd2, name, email} = req.body;

    new Member(uid, pwd, name, email).insert();

    res.redirect(303, '/member/login');
});

router.get('/login', (req, res) => {
    res.render('login', {title: '회원로그인'});
});

router.post('/login', async (req, res) => {
    let { uid, pwd } = req.body;
    let viewName = '/member/loginfail';

    let isLogin = new Member().login(uid, pwd).then(result => result);

    //console.log(await isLogin);
    if (await isLogin > 0) {
        viewName = '/member/myinfo';
        req.session.userid = uid;  // 아이디를 세션변수로 등록
    }

    res.redirect(303, viewName);
});

router.get('/logout', (req, res) => {
    req.session.destroy(() => req.session);

    res.redirect(303, '/');
});

router.get('/myinfo', (req, res) => {
    res.render('myinfo', {title: '회원정보'});
});

module.exports = router;