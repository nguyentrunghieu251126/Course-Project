const inputBoxes = document.querySelectorAll('.input-box');

inputBoxes.forEach(box => {

    const input = box.querySelector('input');

    input.addEventListener('focus', () => {
        box.classList.add('active');
    });

    input.addEventListener('blur', () => {

        if(input.value.trim() === ''){
            box.classList.remove('active');
        }

    });

});

// =========================
// LOGIN FORM
// =========================

const form = document.querySelector('form');

form.addEventListener('submit', function(e){

    e.preventDefault();

    const email = form.querySelector('input[type="email"]').value.trim();

    const password = form.querySelector('input[type="password"]').value.trim();

    // Validate
    if(email === '' || password === ''){

        alert('Vui lòng nhập đầy đủ thông tin!');
        return;
    }

    // Email format
    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailRegex.test(email)){

        alert('Email không hợp lệ!');
        return;
    }

    // Demo loading
    const btn = document.querySelector('.login-btn');

    btn.innerHTML = 'ĐANG ĐĂNG NHẬP...';

    btn.disabled = true;

    setTimeout(() => {

        alert('Đăng nhập thành công!');

        btn.innerHTML = 'ĐĂNG NHẬP';

        btn.disabled = false;

    }, 1500);

});
