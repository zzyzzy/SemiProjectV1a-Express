const express = require("express");
const router = express.Router();
const path = require('path');

router.get('/list', (req, res) => {
    res.render('board/list', {title: '게시판 목록'});
});

router.get('/write', (req, res) => {
    res.render('board/write', {title: '게시판 새글쓰기'});
});

router.get('/view', (req, res) => {
    res.render('board/view', {title: '게시판 본문보기'});
});

router.get('/delete', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'delete.html'));
});

router.get('/update', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'update.html'));
});

module.exports = router;