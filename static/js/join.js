const proccessJoin = () => {
    let frm = document.join;
    if (frm.uid.value === '') alert('아이디는?');
    else if (frm.pwd.value === '') alert('비밀번호는?');
    else if (frm.repwd.value === '') alert('비밀번호 확인은?');
    else if (frm.name.value === '') alert('이름은?');
    else if (frm.email.value === '') alert('이메일은?');
    else {
        frm.method = 'post';
        frm.submit();
    }
};

let joinbtn = document.querySelector('#joinbtn');
joinbtn.addEventListener('click', proccessJoin);
