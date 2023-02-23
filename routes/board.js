const express = require("express");
const router = express.Router();
const Board = require('../models/Board');
const ppg = 15;

// 페이징 기능 지원
// 현재 페이지를 의미하는 변수 : cpg
// 현재 페이지에 해당하는 게시물들을 조회하려면 해당범위의 시작값과 종료값 계산
// cpg : 1   => 1 ~ 5
// cpg : 2   => 6 ~ 10
// cpg : 3   => 11 ~ 15
// 페이지당 게시물 수 ppg : 5
// stnum : (cpg - 1) * ppg + 1
// ednum : stnum + ppg
router.get('/list', async (req, res) => {
    let { cpg } = req.query;
    cpg = cpg ? cpg : 1;
    let stnum = (cpg - 1) * ppg + 1;  // 지정한 페이지 범위 시작값 계산
    let stpgn = parseInt((cpg - 1) / 10) * 10 + 1; // 페이지네이션 시작값 계산

    // 페이지네이션 블럭 생성
    let stpgns = [];
    for (let i = stpgn; i < stpgn + 10; ++i){
        let iscpg = (i == cpg) ? true : false;  // 현재페이지 표시
        let pgn = { 'num': i, 'iscpg': iscpg };
        stpgns.push(pgn);
    }

    let alpg = new Board().selectCount().then((cnt) => cnt);  // 총게시물 수

    let isprev = (cpg - 1 > 0) ? true: false;
    let isnext = (cpg < alpg) ? true: false;
    let pgn = {'prev': stpgn - 1, 'next': stpgn + 9 + 1,
            'isprev': isprev, 'isnext': isnext};

    let bds = new Board().select(stnum).then((bds) => bds);
    console.log(cpg, stnum, stpgn);

    res.render('board/list', {title: '게시판 목록',
            bds: await bds, stpgns: stpgns, pgn: pgn });
});

router.get('/write', (req, res) => {
    if (!req.session.userid)
        res.redirect(303, '/member/login');
    else
        res.render('board/write', {title: '게시판 새글쓰기'});
});

router.post('/write', async (req, res) => {
    let viewName = '/board/failWrite';
    let { title, uid, contents } = req.body;

    let rowcnt = new Board(null, title, uid,
                null, contents, null).insert()
            .then((result) => result);
    if (await rowcnt > 0) viewName = '/board/list';

    res.redirect(303, viewName);
});

router.get('/view', async (req, res) => {
    let bno = req.query.bno;

    let bds = new Board().selectOne(bno).then((bds) => bds);

    res.render('board/view', {title: '게시판 본문보기', bds: await bds});
});

router.get('/delete', async (req, res) => {
    let { bno, uid } = req.query;
    let suid = req.session.userid;

    if (suid && uid && (suid == uid)) { // 글 작성자와 삭제자가 일치하는 경우
        new Board().delete(bno).then(cnt => cnt);
    }

    res.redirect(303, '/board/list');
});

router.get('/update', async (req, res) => {
    let { bno, uid } = req.query;
    let suid = req.session.userid;

    if (uid && suid && (uid == suid)) {
        let bds = new Board().selectOne(bno).then(bds => bds);
        res.render('board/update',
            {title: '게시판 수정하기', bds: await bds});
    } else {
        res.redirect(303, '/board/list');
    }
});

router.post('/update', (req, res) => {
    let { title, uid, contents } = req.body;
    let bno = req.query.bno;
    let suid = req.session.userid;

    if (uid && suid && (uid == suid)) {
        new Board(bno, title, uid, 0, contents, 0)
            .update().then(cnt => cnt);
        res.redirect(303, `/board/view?bno=${bno}`);
    } else {
        res.redirect(303, '/board/list');
    }

});

module.exports = router;