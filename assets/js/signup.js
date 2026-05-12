const registerForm =
    document.querySelector('.register-form');

const inputBoxes =
    document.querySelectorAll('.input-box');

const registerBtn =
    document.querySelector('.btn-register');

// =========================
// INPUT EFFECT
// =========================

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
// EMAIL VALIDATION
// =========================

function isValidEmail(email){

    const regex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(email);

}

// =========================
// PASSWORD VALIDATION
// =========================

function isStrongPassword(password){

    return password.length >= 6;

}

// =========================
// SHOW / HIDE PASSWORD
// =========================

const passwordInputs =
    document.querySelectorAll('input[type="password"]');

passwordInputs.forEach(input => {

    const parent = input.parentElement;

    const eyeIcon =
        document.createElement('i');

    eyeIcon.className =
        'fa-solid fa-eye password-toggle';

    eyeIcon.style.cursor = 'pointer';

    eyeIcon.style.color = '#6b7280';

    eyeIcon.style.marginLeft = '10px';

    parent.appendChild(eyeIcon);

    eyeIcon.addEventListener('click', () => {

        if(input.type === 'password'){

            input.type = 'text';

            eyeIcon.classList.remove('fa-eye');

            eyeIcon.classList.add('fa-eye-slash');

        }
        else{

            input.type = 'password';

            eyeIcon.classList.remove('fa-eye-slash');

            eyeIcon.classList.add('fa-eye');

        }

    });

});

// =========================
// FORM SUBMIT
// =========================

registerForm.addEventListener('submit', function(e){

    e.preventDefault();

    // =========================
    // GET INPUTS
    // =========================

    const fullName =
        document.querySelector('input[type="text"]').value.trim();

    const email =
        document.querySelector('input[type="email"]').value.trim();

    const passwords =
        document.querySelectorAll('input[type="password"]');

    const password =
        passwords[0].value.trim();

    const confirmPassword =
        passwords[1].value.trim();

    // =========================
    // EMPTY CHECK
    // =========================

    if(
        fullName === '' ||
        email === '' ||
        password === '' ||
        confirmPassword === ''
    ){

        alert('Vui lòng nhập đầy đủ thông tin!');
        return;

    }

    // =========================
    // EMAIL CHECK
    // =========================

    if(!isValidEmail(email)){

        alert('Email không hợp lệ!');
        return;

    }

    // =========================
    // PASSWORD LENGTH
    // =========================

    if(!isStrongPassword(password)){

        alert('Mật khẩu phải có ít nhất 6 ký tự!');
        return;

    }

    // =========================
    // PASSWORD MATCH
    // =========================

    if(password !== confirmPassword){

        alert('Mật khẩu nhập lại không khớp!');
        return;

    }

    // =========================
    // LOADING BUTTON
    // =========================

    registerBtn.disabled = true;

    registerBtn.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> ĐANG XỬ LÝ...';

    // =========================
    // FAKE API
    // =========================

    setTimeout(() => {

        alert('Đăng ký tài khoản thành công!');

        registerBtn.disabled = false;

        registerBtn.innerHTML = 'ĐĂNG KÝ';

        registerForm.reset();

        // remove active class
        inputBoxes.forEach(box => {

            box.classList.remove('active');

        });
        window.location.href = "signin.html";

    }, 1800);

});
