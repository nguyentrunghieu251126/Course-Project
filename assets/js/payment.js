const payBtn = document.getElementById("payBtn");
const popup = document.getElementById("successPopup");

payBtn.addEventListener("click", function () {

    const fullName = document.getElementById("fullname").value.trim();

    const address = document.getElementById("address").value.trim();

    const phone = document.getElementById("phone").value.trim();

    if(fullName === ""){
        alert("Vui lòng nhập họ tên!");
        return;
    }

    if(address === ""){
        alert("Vui lòng nhập địa chỉ!");
        return;
    }

    if(phone === ""){
        alert("Vui lòng nhập số điện thoại!");
        return;
    }

    const phoneRegex = /^(0|\\+84)[0-9]{9}$/;

    if(!phoneRegex.test(phone)){
        alert("Số điện thoại không hợp lệ!");
        return;
    }

    popup.style.display = "flex";

});
