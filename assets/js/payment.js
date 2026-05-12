const payBtn = document.getElementById("payBtn");

payBtn.addEventListener("click", function () {

    // Lấy dữ liệu input
    const fullName = document.querySelector('input[placeholder="Nhập họ và tên"]').value.trim();
    const address = document.querySelector('input[placeholder="123 Đường ABC, Phường XYZ"]').value.trim();
    const phone = document.querySelector('input[placeholder="(084) 123 456"]').value.trim();
    const note = document.querySelector("textarea").value.trim();

    // Kiểm tra họ tên
    if (fullName === "") {
        alert("Vui lòng nhập họ và tên!");
        return;
    }

    // Kiểm tra địa chỉ
    if (address === "") {
        alert("Vui lòng nhập địa chỉ giao hàng!");
        return;
    }

    // Kiểm tra số điện thoại
    if (phone === "") {
        alert("Vui lòng nhập số điện thoại!");
        return;
    }

    // Regex kiểm tra số điện thoại VN
    const phoneRegex = /^(0|\+84)[0-9]{9}$/;

    if (!phoneRegex.test(phone)) {
        alert("Số điện thoại không hợp lệ!");
        return;
    }

    // Kiểm tra phương thức thanh toán
    const paymentMethods = document.querySelectorAll('input[name="payment"]');
    let selectedPayment = "";

    paymentMethods.forEach((method) => {
        if (method.checked) {
            selectedPayment = method.nextElementSibling.innerText;
        }
    });

    if (selectedPayment === "") {
        alert("Vui lòng chọn phương thức thanh toán!");
        return;
    }

    // Thành công
    alert(
        "Xác nhận thanh toán thành công!\n\n" +
        "Họ tên: " + fullName + "\n" +
        "Địa chỉ: " + address + "\n" +
        "SĐT: " + phone + "\n" +
        "Thanh toán: " + selectedPayment
    );

});
