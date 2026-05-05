// Khởi tạo các chức năng
document.addEventListener("DOMContentLoaded", () => {
  initRevealObserver();
  initCounterObserver();
  // initToast();
  // initHorizontalScroll();
  // initCountdown();
  // initBackToTop();
  // initFilters();
  // initSearchForms();
  // initActionHandlers();
  // renderProducts();
});

// Phần tạo hiệu ứng khi lướt màng hình
let revealObserver = null;

//Khởi tạo bộ theo dõi hiệu ứng xuất hiện
function initRevealObserver() {
  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll("[data-reveal]").forEach((element) => {
      element.classList.add("is-visible");
    });
    return;
  }

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -20px 0px",
    },
  );
  observeRevealTargets(document);
}

// Theo dõi các mục tiêu cần hiệu ứng xuất hiện
function observeRevealTargets(root) {
  const targets = root.querySelectorAll ? root.querySelectorAll("[data-reveal]") : [];

  targets.forEach((element) => {
    if (!revealObserver) {
      element.classList.add("is-visible");
      return;
    }
    revealObserver.observe(element);
  });
}

// Khởi tạo trình theo dõi bộ đếm
function initCounterObserver() {
  const counters = document.querySelectorAll("[data-counter]");

  if (!counters.length) return;

  if (!("IntersectionObserver" in window)) {
    counters.forEach((counter) => animateCounter(counter));
    return;
  }

  counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.5,
    },
  );
  counters.forEach((counter) => counterObserver.observe(counter));
}

// Chạy hiệu ứng đếm số
function animateCounter(counter) {
  const target = Number(counter.dataset.counter || 0);
  const duration = 1400;
  const startTime = performance.now();

  const update = (currentTime) => {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(target * eased);

    counter.textContent = value;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      counter.textContent = target;
    }
  };
  requestAnimationFrame(update);
}
