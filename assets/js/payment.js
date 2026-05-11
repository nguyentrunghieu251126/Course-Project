const methods = document.querySelectorAll(".payment-method");

methods.forEach(method => {

    method.addEventListener("click", () => {

        methods.forEach(item => {

            item.classList.remove("active");

            item.querySelector("input").checked = false;

        });

        method.classList.add("active");

        method.querySelector("input").checked = true;

    });

});

/* BUTTON */

const payBtn = document.getElementById("payBtn");

payBtn.addEventListener("click", () => {

    let selected =
        document.querySelector(".payment-method.active span").innerText;

    alert("Bạn đã chọn: " + selected);

});
