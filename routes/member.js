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

router.get('/myinfo', (req, res) => {
    res.render('myinfo', {title: '회원정보'});
});

module.exports = router;