// Khởi động toàn bộ chức năng đang dùng trên trang
document.addEventListener("DOMContentLoaded", () => {
  initRevealObserver();
  initCounterObserver();
  initToast();
  initSearchForms();
  initActionHandlers();
  initFilters();
  renderProducts();
  initHorizontalScroll();
  initCountdown();
});

// Biến dùng chung để quản lý observer và toast.
let revealObserver = null;
let actionToast = null;
let counterObserver = null;

// Trạng thái hiện tại của bộ lọc, từ khóa tìm kiếm, giỏ hàng và yêu thích.
const state = {
  activeFilter: "all",
  searchTerm: "",
  cartCount: 0,
  likedProducts: new Set(),
};

// Dữ liệu sản phẩm để render ra khu "Sản phẩm hot" và "Bộ sưu tập mới".
const products = [
  {
    id: "nova-x-pro-15",
    name: "Nova X Pro 15",
    category: "phone",
    categoryLabel: "Điện thoại",
    tag: "Best seller",
    price: "899",
    oldPrice: "1,099",
    rating: "4.9",
    highlight: "AI camera",
    icon: "bi-phone",
    description: "Flagship mỏng nhẹ, tối ưu quay chụp và đa nhiệm cho người dùng thích mọi thứ phải mượt.",
  },
  {
    id: "flare-note-air",
    name: "Flare Note Air",
    category: "phone",
    categoryLabel: "Điện thoại",
    tag: "Pin trâu",
    price: "659",
    oldPrice: "799",
    rating: "4.8",
    highlight: "5,500mAh",
    icon: "bi-phone-flip",
    description: "Mẫu máy cân bằng giữa pin, màn hình sáng và hiệu năng ổn cho học tập, công việc lẫn giải trí.",
  },
  {
    id: "sketch-tab-12",
    name: "Sketch Tab 12",
    category: "tablet",
    categoryLabel: "Máy tính bảng",
    tag: "Creator pick",
    price: "699",
    oldPrice: "829",
    rating: "4.9",
    highlight: "Bút cảm ứng",
    icon: "bi-tablet",
    description: "Tablet 12 inch phù hợp ghi chú, phác thảo, làm slide và xem nội dung với màu sắc dễ chịu.",
  },
  {
    id: "nova-tab-mini",
    name: "Nova Tab Mini",
    category: "tablet",
    categoryLabel: "Máy tính bảng",
    tag: "Gọn nhẹ",
    price: "459",
    oldPrice: "549",
    rating: "4.7",
    highlight: "Travel ready",
    icon: "bi-tablet-landscape",
    description: "Thiết kế nhỏ gọn cho người hay di chuyển, đọc tài liệu, học online và giải trí trước khi ngủ.",
  },
  {
    id: "aero-book-14",
    name: "Aero Book 14",
    category: "laptop",
    categoryLabel: "Laptop",
    tag: "Work smart",
    price: "1,249",
    oldPrice: "1,449",
    rating: "4.9",
    highlight: "1.3kg",
    icon: "bi-laptop",
    description: "Ultrabook cho dân văn phòng và designer cần thiết bị đẹp, nhẹ và vẫn đủ mạnh cho công việc hằng ngày.",
  },
  {
    id: "forge-studio-16",
    name: "Forge Studio 16",
    category: "laptop",
    categoryLabel: "Laptop",
    tag: "Hiệu năng",
    price: "1,799",
    oldPrice: "2,099",
    rating: "4.8",
    highlight: "RTX ready",
    icon: "bi-pc-display-horizontal",
    description: "Workstation gọn cho người dựng video, làm 3D cơ bản hoặc cần mở nhiều phần mềm cùng lúc.",
  },
  {
    id: "pulse-buds-pro",
    name: "Pulse Buds Pro",
    category: "accessory",
    categoryLabel: "Phụ kiện",
    tag: "Âm thanh",
    price: "189",
    oldPrice: "239",
    rating: "4.8",
    highlight: "ANC",
    icon: "bi-earbuds",
    description: "Tai nghe chống ồn chủ động, âm trường cân bằng và kết nối nhanh cho lối sống di động.",
  },
  {
    id: "dock-hub-9in1",
    name: "Dock Hub 9-in-1",
    category: "accessory",
    categoryLabel: "Phụ kiện",
    tag: "Desk setup",
    price: "119",
    oldPrice: "149",
    rating: "4.7",
    highlight: "USB-C",
    icon: "bi-usb-drive",
    description: "Hub đa cổng cho góc làm việc gọn gàng hơn, đặc biệt hợp với laptop mỏng nhẹ và tablet.",
  },
];

// Tạo hiệu ứng hiện dần cho các khối có gắn data-reveal.
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

// Gắn observer cho các phần tử cần animate.
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

// Theo dõi các con số ở hero để chạy hiệu ứng đếm khi nhìn thấy.
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

// Chạy hiệu ứng tăng số mượt từ 0 đến giá trị mục tiêu.
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

// Khởi tạo toast Bootstrap nếu sau này HTML có thêm khối toast.
function initToast() {
  const toastElement = document.getElementById("actionToast");

  if (!toastElement || !window.bootstrap) return;

  actionToast = new bootstrap.Toast(toastElement, {
    delay: 2400,
  });
}

// Cập nhật nội dung toast và hiển thị nếu toast tồn tại.
function showToast(message) {
  const toastMessage = document.getElementById("toastMessage");

  if (toastMessage) {
    toastMessage.textContent = message;
  }

  if (actionToast) {
    actionToast.show();
  }
}

// Xử lý form tìm kiếm và form đăng ký email.
function initSearchForms() {
  document.querySelectorAll(".search-form").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const input = form.querySelector("input");
      const query = input ? input.value.trim() : "";

      state.searchTerm = query.toLowerCase();
      syncSearchInputs(query);
      renderProducts();

      document.getElementById("featured")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      if (query) {
        showToast(`Đang hiển thị kết quả cho "${query}".`);
      } else {
        showToast("Đã quay lại danh sách sản phẩm nổi bật.");
      }
    });
  });

  const newsletterForm = document.querySelector(".newsletter-form");
  if (!newsletterForm) return;

  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    newsletterForm.reset();
    showToast("Đã ghi nhận email. Ưu đãi mới sẽ được gửi khi có đợt phù hợp.");
  });
}

// Đồng bộ giá trị giữa các ô tìm kiếm đang có trên trang.
function syncSearchInputs(value) {
  document.querySelectorAll(".search-form input").forEach((input) => {
    input.value = value;
  });
}

// Bắt click cho các nút giỏ hàng, mua ngay và yêu thích.
function initActionHandlers() {
  document.addEventListener("click", (event) => {
    const cartButton = event.target.closest("[data-add-cart]");
    if (cartButton) {
      handleAddToCart(cartButton.dataset.addCart || "");
      return;
    }

    const likeButton = event.target.closest("[data-toggle-like]");
    if (likeButton) {
      handleToggleLike(likeButton.dataset.toggleLike || "");
      return;
    }

    const buyButton = event.target.closest("[data-buy-now]");
    if (buyButton) {
      handleBuyNow(buyButton.dataset.buyNow || "");
    }
  });
}

// Thêm sản phẩm vào giỏ và cập nhật số lượng trong state.
function handleAddToCart(identifier) {
  const product = resolveProduct(identifier);
  const productName = product ? product.name : identifier;

  state.cartCount += 1;
  updateCountBadges();
  showToast(`${productName} đã được thêm vào giỏ hàng.`);
}

// Mô phỏng hành động mua nhanh.
function handleBuyNow(identifier) {
  const product = resolveProduct(identifier);
  const productName = product ? product.name : identifier;

  state.cartCount += 1;
  updateCountBadges();
  showToast(`Đã đưa ${productName} vào quy trình mua nhanh.`);
}

// Thêm hoặc bỏ sản phẩm khỏi danh sách yêu thích.
function handleToggleLike(identifier) {
  const product = resolveProduct(identifier);
  const productKey = product ? product.id : identifier;
  const productName = product ? product.name : identifier;

  if (state.likedProducts.has(productKey)) {
    state.likedProducts.delete(productKey);
    showToast(`Đã bỏ ${productName} khỏi danh sách yêu thích.`);
  } else {
    state.likedProducts.add(productKey);
    showToast(`Đã lưu ${productName} vào danh sách yêu thích.`);
  }

  updateCountBadges();
  syncWishlistButtons();
}

// Cập nhật số đếm nếu trong HTML có gắn data-cart-count hoặc data-wishlist-count.
function updateCountBadges() {
  document.querySelectorAll("[data-cart-count]").forEach((badge) => {
    badge.textContent = state.cartCount;
  });

  document.querySelectorAll("[data-wishlist-count]").forEach((badge) => {
    badge.textContent = state.likedProducts.size;
  });
}

// Đồng bộ trạng thái trái tim giữa state và nút trên giao diện.
function syncWishlistButtons() {
  document.querySelectorAll("[data-toggle-like]").forEach((button) => {
    const identifier = button.dataset.toggleLike || "";
    const product = resolveProduct(identifier);
    const productKey = product ? product.id : identifier;
    const isActive = state.likedProducts.has(productKey);

    button.classList.toggle("is-active", isActive);

    const icon = button.querySelector("i");
    if (!icon) return;
    icon.className = isActive ? "bi bi-heart-fill" : "bi bi-heart";
  });
}

// Tìm sản phẩm theo id hoặc tên.
function resolveProduct(identifier) {
  return products.find((product) => product.id === identifier || product.name === identifier) || null;
}

// Gắn sự kiện cho nút lọc danh mục và shortcut ở dải category.
function initFilters() {
  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      setFilter(button.dataset.filter || "all");
    });
  });

  document.querySelectorAll("[data-filter-shortcut]").forEach((shortcut) => {
    shortcut.addEventListener("click", () => {
      const nextFilter = shortcut.dataset.filterShortcut || "all";
      setFilter(nextFilter);
    });
  });
}

// Đổi bộ lọc hiện tại và render lại danh sách sản phẩm.
function setFilter(filter) {
  state.activeFilter = filter;
  updateFilterButtons();
  renderProducts();
}

// Đánh dấu nút lọc nào đang được chọn.
function updateFilterButtons() {
  document.querySelectorAll("[data-filter]").forEach((button) => {
    const isActive = button.dataset.filter === state.activeFilter;
    button.classList.toggle("active", isActive);
  });
}

// Lấy danh sách sản phẩm phù hợp theo bộ lọc và từ khóa tìm kiếm.
function getVisibleProducts() {
  return products.filter((product) => {
    const matchFilter = state.activeFilter === "all" || product.category === state.activeFilter;
    const query = state.searchTerm.trim();

    if (!matchFilter) return false;
    if (!query) return true;

    const haystack = `${product.name} ${product.description} ${product.categoryLabel} ${product.highlight}`.toLowerCase();
    return haystack.includes(query);
  });
}

// Render danh sách sản phẩm cho 2 khu featured và arrivals.
function renderProducts() {
  const featuredContainer = document.getElementById("featuredProducts");
  const latestContainer = document.getElementById("latestProducts");
  const visibleProducts = getVisibleProducts();

  if (!featuredContainer || !latestContainer) return;

  if (!visibleProducts.length) {
    const emptyState = buildEmptyState();
    featuredContainer.innerHTML = emptyState;
    latestContainer.innerHTML = `<div class="col-12">${emptyState}</div>`;
    observeRevealTargets(featuredContainer);
    observeRevealTargets(latestContainer);
    return;
  }

  featuredContainer.innerHTML = visibleProducts.map((product) => buildProductCard(product, false)).join("");
  latestContainer.innerHTML = buildLatestProducts(visibleProducts)
    .map((product) => buildProductCard(product, true))
    .join("");

  observeRevealTargets(featuredContainer);
  observeRevealTargets(latestContainer);
  syncWishlistButtons();
  updateCountBadges();
}

// Giới hạn khu arrivals tối đa 4 sản phẩm, thiếu thì bù từ danh sách gốc.
function buildLatestProducts(visibleProducts) {
  const selection = [...visibleProducts.slice(0, 4)];

  if (selection.length === 4) return selection;

  const selectedIds = new Set(selection.map((product) => product.id));

  products.forEach((product) => {
    if (selection.length === 4 || selectedIds.has(product.id)) return;

    selection.push(product);
    selectedIds.add(product.id);
  });

  return selection;
}

// Tạo HTML cho từng card sản phẩm.
function buildProductCard(product, isGrid) {
  const liked = state.likedProducts.has(product.id);
  const wrapperClass = isGrid ? "col-sm-6 col-xl-3" : "product-item";

  return `
    <div class="${wrapperClass}">
      <article class="product-card" data-reveal>
        <div class="product-card-top">
          <span class="product-badge">${product.tag}</span>
          <button class="icon-button ${liked ? "is-active" : ""}" type="button" data-toggle-like="${product.id}" aria-label="Lưu ${product.name}">
            <i class="bi ${liked ? "bi-heart-fill" : "bi-heart"}"></i>
          </button>
        </div>

        <div class="product-visual product-visual--${product.category}">
          <i class="bi ${product.icon}"></i>
        </div>

        <span class="product-category">${product.categoryLabel}</span>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-desc">${product.description}</p>

        <div class="product-meta">
          <span><i class="bi bi-star-fill"></i> ${product.rating}</span>
          <span><i class="bi bi-lightning-charge-fill"></i> ${product.highlight}</span>
        </div>

        <div class="product-price-row">
          <span class="product-price">$${product.price}</span>
          <span class="product-old-price">$${product.oldPrice}</span>
        </div>

        <div class="product-actions">
          <button class="btn btn-dark-subtle" type="button" data-add-cart="${product.id}" aria-label="Thêm ${product.name} vào giỏ">
            <i class="bi bi-bag-plus"></i>
          </button>
          <button class="btn btn-accent flex-fill" type="button" data-buy-now="${product.id}">Mua ngay</button>
        </div>
      </article>
    </div>
  `;
}

// Tạo giao diện khi không có sản phẩm nào phù hợp với bộ lọc.
function buildEmptyState() {
  return `
    <div class="product-card text-center" data-reveal>
      <div class="product-visual product-visual--accessory">
        <i class="bi bi-search"></i>
      </div>
      <h3 class="product-name mb-2">Chưa có kết quả phù hợp</h3>
      <p class="product-desc mb-0">
        Hãy thử từ khóa khác hoặc quay lại bộ lọc "Tất cả" để xem thêm sản phẩm nổi bật.
      </p>
    </div>
  `;
}

// Cho phép kéo ngang danh sách featured bằng chuột hoặc touchpad.
function initHorizontalScroll() {
  document.querySelectorAll(".drag-scroll").forEach((track) => {
    let pointerDown = false;
    let startX = 0;
    let startScrollLeft = 0;

    track.addEventListener(
      "wheel",
      (event) => {
        if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

        event.preventDefault();
        track.scrollBy({
          left: event.deltaY,
          behavior: "smooth",
        });
      },
      { passive: false },
    );

    track.addEventListener("pointerdown", (event) => {
      pointerDown = true;
      startX = event.clientX;
      startScrollLeft = track.scrollLeft;
      track.classList.add("is-dragging");
    });

    track.addEventListener("pointermove", (event) => {
      if (!pointerDown) return;
      const distance = event.clientX - startX;
      track.scrollLeft = startScrollLeft - distance;
    });

    const stopDrag = () => {
      pointerDown = false;
      track.classList.remove("is-dragging");
    };

    track.addEventListener("pointerup", stopDrag);
    track.addEventListener("pointerleave", stopDrag);
    track.addEventListener("pointercancel", stopDrag);
  });
}

// Cập nhật đồng hồ đếm ngược ở khu flash deal mỗi giây.
function initCountdown() {
  const daysElement = document.getElementById("dealDays");
  const hoursElement = document.getElementById("dealHours");
  const minutesElement = document.getElementById("dealMinutes");
  const secondsElement = document.getElementById("dealSeconds");

  if (!daysElement || !hoursElement || !minutesElement || !secondsElement) return;

  const deadline = Date.now() + (1 * 24 * 60 * 60 + 13 * 60 * 60 + 42 * 60 + 18) * 1000;

  const renderCountdown = () => {
    const distance = Math.max(deadline - Date.now(), 0);
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((distance / (1000 * 60)) % 60);
    const seconds = Math.floor((distance / 1000) % 60);

    daysElement.textContent = String(days).padStart(2, "0");
    hoursElement.textContent = String(hours).padStart(2, "0");
    minutesElement.textContent = String(minutes).padStart(2, "0");
    secondsElement.textContent = String(seconds).padStart(2, "0");
  };

  renderCountdown();
  window.setInterval(renderCountdown, 1000);
}
