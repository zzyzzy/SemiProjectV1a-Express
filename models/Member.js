const oracledb = require('../models/Oracle');

class Member {
    insertsql = ' insert into member ' +
        ' (mno,userid,passwd,name,email) ' +
        ' values (mno.nextval, :1,:2,:3,:4) ';

    constructor(userid, passwd, name, email) {
        this.userid = userid;
        this.passwd = passwd;
        this.name = name;
        this.email = email;
    }

    // 회원정보 저장
    async insert() {
        let conn = null;
        let params = [this.userid, this.passwd, this.name, this.email];

        try {
            conn = await oracledb.makeConn();
            let result = await conn.execute(this.insertsql, params);
            await conn.commit();
            if (result.rowsAffected > 0) console.log('회원정보 저장 성공!');
        } catch (ex) {
            console.log(ex);
        } finally {
            await oracledb.closeConn(conn);
        }
    }

};

module.exports = Member;
