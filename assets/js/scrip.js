document.addEventListener("DOMContentLoaded", initPage);

// Khởi động các chức năng đang được dùng trên trang.
async function initPage() {
  await fetchProducts();
  state.visibleLimit = calculateItemsLimit();
  initCountdown();
  initRevealObserver();
  initCounterObserver();
  initSearchForms();
  initActionHandlers();
  initFilters();
  renderProducts();
}

let revealObserver = null;
let counterObserver = null;

const state = {
  activeFilter: "all",
  searchTerm: "",
  cartCount: 0,
  likedProducts: new Set(),
  visibleLimit: 12,
};

let products = [];

async function fetchProducts() {
  try {
    const response = await fetch("../../assets/json/products.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    products = await response.json(); // Gán dữ liệu vào mảng products
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu sản phẩm:", error);
  }
}

// Tạo hiệu ứng hiện dần cho các phần tử có thuộc tính data-reveal.
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

// Gắn observer vào các phần tử cần chạy hiệu ứng hiện dần.
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

// Theo dõi các số liệu trong hero để bắt đầu hiệu ứng đếm khi chúng xuất hiện.
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

// Chạy hiệu ứng tăng số từ 0 đến giá trị mục tiêu.
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

// Xử lý form tìm kiếm và render lại danh sách sản phẩm theo từ khóa.
function initSearchForms() {
  document.querySelectorAll(".search-form").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const input = form.querySelector("input");
      const query = input ? input.value.trim() : "";

      state.searchTerm = query.toLowerCase();
      state.visibleLimit = calculateItemsLimit();
      syncSearchInputs(query);
      renderProducts();

      document.getElementById("featured")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });
}

// Đồng bộ nội dung giữa các ô tìm kiếm nếu trang có nhiều form search.
function syncSearchInputs(value) {
  document.querySelectorAll(".search-form input").forEach((input) => {
    input.value = value;
  });
}

// Lắng nghe các nút thêm giỏ hàng, mua ngay, yêu thích và xem thêm
function initActionHandlers() {
  document.addEventListener("click", (event) => {
    const loadMoreBtn = event.target.closest("#loadMoreBtn");
    if (loadMoreBtn) {
      state.visibleLimit += calculateItemsLimit();
      renderProducts();
      return;
    }

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

// Tăng số lượng giỏ hàng khi người dùng bấm nút thêm vào giỏ.
function handleAddToCart(identifier) {
  if (!resolveProduct(identifier)) return;

  state.cartCount += 1;
  updateCountBadges();
}

// Tăng số lượng giỏ hàng khi người dùng bấm nút mua ngay.
function handleBuyNow(identifier) {
  if (!resolveProduct(identifier)) return;

  state.cartCount += 1;
  updateCountBadges();
}

// Bật hoặc tắt trạng thái yêu thích của một sản phẩm.
function handleToggleLike(identifier) {
  const product = resolveProduct(identifier);
  if (!product) return;

  if (state.likedProducts.has(product.id)) {
    state.likedProducts.delete(product.id);
  } else {
    state.likedProducts.add(product.id);
  }

  updateCountBadges();
  syncWishlistButtons();
}

// Cập nhật các badge hiển thị số lượng giỏ hàng và yêu thích.
function updateCountBadges() {
  document.querySelectorAll("[data-cart-count]").forEach((badge) => {
    badge.textContent = state.cartCount;
  });

  document.querySelectorAll("[data-wishlist-count]").forEach((badge) => {
    badge.textContent = state.likedProducts.size;
  });
}

// Đồng bộ trạng thái icon trái tim theo danh sách yêu thích hiện tại.
function syncWishlistButtons() {
  document.querySelectorAll("[data-toggle-like]").forEach((button) => {
    const product = resolveProduct(button.dataset.toggleLike || "");
    if (!product) return;

    const isActive = state.likedProducts.has(product.id);
    const icon = button.querySelector("i");

    button.classList.toggle("is-active", isActive);

    if (icon) {
      icon.className = isActive ? "bi bi-heart-fill" : "bi bi-heart";
    }
  });
}

// Tìm sản phẩm trong mảng dữ liệu theo id.
function resolveProduct(identifier) {
  return products.find((product) => product.id === identifier) || null;
}

// Gắn sự kiện lọc sản phẩm cho nút filter và shortcut danh mục.
function initFilters() {
  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      setFilter(button.dataset.filter || "all");
    });
  });

  document.querySelectorAll("[data-filter-shortcut]").forEach((shortcut) => {
    shortcut.addEventListener("click", (event) => {
      event.preventDefault();
      handleShortcutNavigation(shortcut);
    });
  });
}

// Chuyển tới khu sản phẩm và bật bộ lọc tương ứng với mục menu vừa nhấn.
function handleShortcutNavigation(shortcut) {
  setFilter(shortcut.dataset.filterShortcut || "all");
  scrollToAnchorTarget(shortcut.getAttribute("href"));
  closeMobileMenu();
}

// Cuộn mượt tới section được khai báo trong thuộc tính href dạng hash.
function scrollToAnchorTarget(targetSelector) {
  if (!targetSelector || !targetSelector.startsWith("#")) return;

  document.querySelector(targetSelector)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

// Đóng offcanvas mobile sau khi người dùng chọn xong một mục điều hướng.
function closeMobileMenu() {
  const mobileMenu = document.getElementById("mobileMenu");

  if (!mobileMenu || !window.bootstrap) return;

  const offcanvas = bootstrap.Offcanvas.getInstance(mobileMenu);
  if (!offcanvas) return;

  offcanvas.hide();
}

// Đổi bộ lọc hiện tại rồi render lại danh sách sản phẩm.
function setFilter(filter) {
  state.activeFilter = filter;
  state.visibleLimit = calculateItemsLimit();
  updateFilterButtons();
  renderProducts();
}

// Đánh dấu nút filter đang được chọn.
function updateFilterButtons() {
  document.querySelectorAll("[data-filter]").forEach((button) => {
    const isActive = button.dataset.filter === state.activeFilter;
    button.classList.toggle("active", isActive);
  });
}

// Lấy các sản phẩm phù hợp với bộ lọc và từ khóa tìm kiếm hiện tại.
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

// Render danh sách sản phẩm nổi bật ra khu vực featuredProducts.
function renderProducts() {
  const featuredContainer = document.getElementById("featuredProducts");
  if (!featuredContainer) return;

  const visibleProducts = getVisibleProducts();

  if (!visibleProducts.length) {
    featuredContainer.innerHTML = `<div class="col-12">${buildEmptyState()}</div>`;
    observeRevealTargets(featuredContainer);
    return;
  }

  const currentProducts = visibleProducts.slice(0, state.visibleLimit);

  featuredContainer.innerHTML = currentProducts.map((product) => buildProductCard(product)).join("");

  if (visibleProducts.length > state.visibleLimit) {
    const loadMoreHTML = `
      <div class="col-12 d-flex justify-content-center mt-5 mb-2" id="loadMoreContainer">
        <button id="loadMoreBtn" class="btn btn-outline-dark px-5 py-2 fw-bold" style="border-width: 2px;" type="button">
          Xem thêm <i class="bi bi-chevron-down ms-1"></i>
        </button>
      </div>
    `;
    featuredContainer.insertAdjacentHTML("beforeend", loadMoreHTML);
  }

  observeRevealTargets(featuredContainer);
  syncWishlistButtons();
  updateCountBadges();
}

// Tạo HTML cho một card sản phẩm.
function buildProductCard(product) {
  const liked = state.likedProducts.has(product.id);
  const visualContent = product.image
    ? `<img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: contain; position: relative; z-index: 1;">`
    : `<i class="bi ${product.icon}"></i>`;

  return `
    <div class="col-6 col-md-4 col-lg-3 d-flex align-items-stretch">
      <article class="product-card w-100" data-reveal>
        <div class="product-card-top">
          <span class="product-badge">${product.tag}</span>
          <button class="icon-button ${liked ? "is-active" : ""}" type="button" data-toggle-like="${product.id}" aria-label="Lưu ${product.name}">
            <i class="bi ${liked ? "bi-heart-fill" : "bi-heart"}"></i>
          </button>
        </div>

        <div class="product-visual product-visual--${product.category}">
          ${visualContent}
        </div>

        <span class="product-category">${product.categoryLabel}</span>
        
        <h3 class="product-name" title="${product.name}">${product.name}</h3>
        <p class="product-desc" title="${product.description}">${product.description}</p>

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

function buildEmptyState() {
  return `
    <div class="product-card text-center w-100" data-reveal>
      <div class="product-visual product-visual--accessory mx-auto" style="max-width: 150px; min-height: 150px;">
        <i class="bi bi-search"></i>
      </div>
      <h3 class="product-name mb-2">Chưa có kết quả phù hợp</h3>
      <p class="product-desc mb-0">
        Hãy thử từ khóa khác hoặc quay lại bộ lọc "Tất cả" để xem thêm các sản phẩm khác.
      </p>
    </div>
  `;
}

// Hàm tính toán số lượng sản phẩm cho 3 hàng dựa trên kích thước màn hình
function calculateItemsLimit() {
  const width = window.innerWidth;
  if (width >= 992) return 12;
  if (width >= 768) return 9;
  return 6;
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
