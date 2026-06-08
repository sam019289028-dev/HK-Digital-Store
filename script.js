const products = [
  {
    id: "chatgpt-subscription",
    name: "ChatGPT",
    type: "AI 工具",
    price: 158,
    region: "全球或指定地區",
    delivery: "客服確認後提供訂閱啟用安排",
    badge: "AI Workspace",
    visual: "visual-chatgpt",
    image: "assets/chatgpt-product.png",
    icon: "assets/chatgpt-icon.svg",
    tags: ["熱門", "即開", "需確認地區"],
    plans: ["1個月", "3個月", "12個月"],
    afterSales: "提供啟用指引與基本售後跟進，實際處理以客服確認為準。",
    featured: true,
    description: "AI 助手訂閱方案，適合文字、工作和內容生成。"
  },
  {
    id: "claude-subscription",
    name: "Claude",
    type: "AI 工具",
    price: 158,
    region: "全球或指定地區",
    delivery: "客服確認後提供訂閱啟用安排",
    badge: "Writing AI",
    visual: "visual-claude",
    image: "assets/claude-subscription-card.png",
    icon: "assets/claude-icon.svg",
    tags: ["熱門", "需確認地區"],
    plans: ["1個月", "3個月", "12個月"],
    afterSales: "協助核對方案和啟用狀態，售後細節由客服跟進。",
    featured: true,
    description: "高品質文字與分析工具，適合長文和工作流。"
  },
  {
    id: "gemini-subscription",
    name: "Gemini",
    type: "AI 工具",
    price: 148,
    region: "全球或指定地區",
    delivery: "客服確認後提供訂閱啟用安排",
    badge: "Google AI",
    visual: "visual-gemini",
    image: "assets/gemini-subscription-card.png",
    icon: "assets/gemini-icon.svg",
    tags: ["即開", "多平台"],
    plans: ["1個月", "3個月", "12個月"],
    afterSales: "提供訂閱啟用提醒，帳號地區與方案限制需下單前確認。",
    featured: true,
    description: "多平台 AI 工具方案，適合搜尋、寫作與整理。"
  },
  {
    id: "grok-subscription",
    name: "Grok",
    type: "AI 工具",
    price: 148,
    region: "全球或指定地區",
    delivery: "客服確認後提供訂閱啟用安排",
    badge: "Live AI",
    visual: "visual-grok",
    icon: "assets/grok-icon.svg",
    tags: ["新品", "需確認地區"],
    plans: ["1個月", "3個月", "12個月"],
    afterSales: "客服會先確認帳號條件，再跟進啟用和使用提示。",
    featured: true,
    description: "即時資訊取向 AI 方案，適合社交平台使用者。"
  },
  {
    id: "perplexity-subscription",
    name: "Perplexity",
    type: "AI 工具",
    price: 148,
    region: "全球或指定地區",
    delivery: "客服確認後提供訂閱啟用安排",
    badge: "AI Search",
    visual: "visual-perplexity",
    icon: "assets/perplexity-icon.svg",
    tags: ["熱門", "即開"],
    plans: ["1個月", "3個月", "12個月"],
    afterSales: "協助確認方案內容，提供基本啟用跟進。",
    featured: true,
    description: "AI 搜尋與資料整理方案，適合研究和查詢。"
  },
  {
    id: "netflix-subscription",
    name: "Netflix",
    type: "影音串流",
    price: 98,
    region: "指定地區",
    delivery: "客服確認後提供訂閱啟用安排",
    badge: "Streaming",
    visual: "visual-netflix",
    icon: "assets/netflix-icon.svg",
    tags: ["需確認地區", "售後跟進"],
    plans: ["1個月", "3個月", "12個月"],
    afterSales: "如遇啟用問題，可聯絡客服核對方案和地區限制。",
    featured: false,
    description: "影音串流訂閱方案，購買前需確認地區。"
  },
  {
    id: "spotify-subscription",
    name: "Spotify",
    type: "影音串流",
    price: 68,
    region: "指定地區",
    delivery: "客服確認後提供訂閱啟用安排",
    badge: "Music Plan",
    visual: "visual-spotify",
    icon: "assets/spotify-icon.svg",
    tags: ["即開", "需確認地區"],
    plans: ["1個月", "3個月", "12個月"],
    afterSales: "客服會跟進啟用狀態，實際方案以確認為準。",
    featured: false,
    description: "音樂串流訂閱方案，適合個人或多月使用。"
  },
  {
    id: "youtube-subscription",
    name: "YouTube",
    type: "影音串流",
    price: 78,
    region: "指定地區",
    delivery: "客服確認後提供訂閱啟用安排",
    badge: "Video Plan",
    visual: "visual-youtube",
    icon: "assets/youtube-icon.svg",
    tags: ["多平台", "需確認地區"],
    plans: ["1個月", "3個月", "12個月"],
    afterSales: "提供方案確認與啟用跟進，帳戶限制需先核對。",
    featured: false,
    description: "影片平台訂閱方案，適合日常觀看和多設備。"
  },
  {
    id: "x-subscription",
    name: "X",
    type: "社交平台",
    price: 88,
    region: "指定地區",
    delivery: "客服確認後提供訂閱啟用安排",
    badge: "Social Plus",
    visual: "visual-x",
    icon: "assets/x-icon.svg",
    tags: ["需確認地區", "售後跟進"],
    plans: ["1個月", "3個月", "12個月"],
    afterSales: "客服會先確認帳號地區和方案可用性，再跟進啟用。",
    featured: false,
    description: "社交平台訂閱方案，購買前需確認帳戶條件。"
  }
];

const cartKey = "hkDigitalStoreCart";
const currentUserKey = "hkDigitalStoreCurrentUser";
const recentViewedKey = "hkDigitalStoreRecentViewed";
const paymentSessionKey = "hkDigitalStorePaymentSession";
let pendingCartIntent = null;
let cartDrawerScrollY = 0;

const paymentMethods = {
  FPS: {
    name: "FPS",
    displayName: "FPS（轉數快）",
    accountName: "HK Digital Store",
    fpsId: "123456",
    bankName: "",
    bankAccount: "",
    binancePayId: "123456",
    qrCodeImage: "",
    note: "付款前請確認金額及收款人資料。"
  },
  PayMe: {
    name: "PayMe",
    displayName: "PayMe",
    accountName: "HK Digital Store",
    fpsId: "",
    bankName: "",
    bankAccount: "",
    binancePayId: "123456",
    qrCodeImage: "",
    note: "如需 PayMe 二維碼，請在 paymentMethods 設定圖片。"
  },
  AlipayHK: {
    name: "AlipayHK",
    displayName: "AlipayHK",
    accountName: "HK Digital Store",
    fpsId: "",
    bankName: "",
    bankAccount: "",
    binancePayId: "123456",
    qrCodeImage: "",
    note: "請以客服確認的收款資料付款。"
  },
  "Bank Transfer": {
    name: "Bank Transfer",
    displayName: "銀行轉賬",
    accountName: "HK Digital Store",
    fpsId: "",
    bankName: "請在 paymentMethods 設定銀行名稱",
    bankAccount: "請在 paymentMethods 設定銀行帳號",
    binancePayId: "",
    qrCodeImage: "",
    note: "轉賬後請聯絡客服確認。"
  },
  "WeChat Pay": {
    name: "WeChat Pay",
    displayName: "WeChat Pay",
    accountName: "HK Digital Store",
    fpsId: "",
    bankName: "",
    bankAccount: "",
    binancePayId: "123456",
    qrCodeImage: "",
    note: "如需 WeChat Pay 二維碼，請在 paymentMethods 設定圖片。"
  },
  "Binance Pay": {
    name: "Binance Pay",
    displayName: "Binance Pay",
    accountName: "HK Digital Store",
    fpsId: "",
    bankName: "",
    bankAccount: "",
    binancePayId: "123456",
    qrCodeImage: "",
    note: "此為商店自行收款資料，不代表 Binance 官方。"
  }
};

function getCurrentUser() {
  if (window.hkSupabaseAuth) {
    const user = window.hkSupabaseAuth.getCachedUser();
    if (user) {
      return {
        name: user.user_metadata?.display_name || user.email,
        email: user.email
      };
    }
    return null;
  }
  return JSON.parse(localStorage.getItem(currentUserKey) || "null");
}

function getRecentViewed() {
  return JSON.parse(localStorage.getItem(recentViewedKey) || "[]");
}

function saveRecentViewed(items) {
  localStorage.setItem(recentViewedKey, JSON.stringify(items));
}

function rememberProductView(productId) {
  const ids = getRecentViewed().filter((id) => id !== productId);
  ids.unshift(productId);
  saveRecentViewed(ids.slice(0, 8));
}

function setCurrentUser(user) {
  localStorage.setItem(currentUserKey, JSON.stringify({
    name: user.name,
    email: user.email
  }));
  updateAuthNav();
}

function clearCurrentUser() {
  if (window.hkSupabaseAuth) {
    window.hkSupabaseAuth.logout();
    return;
  }
  localStorage.removeItem(currentUserKey);
  updateAuthNav();
}

function isLoggedIn() {
  return Boolean(getCurrentUser());
}

function getCart() {
  return JSON.parse(localStorage.getItem(cartKey) || "[]");
}

function saveCart(cart) {
  localStorage.setItem(cartKey, JSON.stringify(cart));
  updateCartCount();
  if (document.querySelector("[data-cart-drawer]")) {
    renderCartDrawer();
  }
}

function formatPrice(price) {
  return `HK$${price}`;
}

function formatStartPrice(price) {
  return `${formatPrice(price)} 起`;
}

function getProductHeroImage(product) {
  const image = String(product?.image || "").trim();
  if (image) return image;

  const brand = getProductBrand(product);
  if (brand === "gemini") return "assets/gemini-subscription-card.png";
  if (brand === "claude") return "assets/claude-subscription-card.png";
  if (brand === "chatgpt") return "assets/chatgpt-product.png";
  return "";
}

function getProductBrand(product) {
  const textIdentity = `${product?.name || ""} ${product?.type || ""} ${product?.category || ""}`.toLowerCase();
  const isXProduct = /(^|[\s/|+·,，:：-])x($|[\s/|+·,，:：-]|premium|平台|pro|訂閱|会员|會員)/i.test(textIdentity)
    || textIdentity.includes("twitter");
  if (textIdentity.includes("chatgpt")) return "chatgpt";
  if (textIdentity.includes("claude")) return "claude";
  if (textIdentity.includes("gemini")) return "gemini";
  if (textIdentity.includes("grok")) return "grok";
  if (textIdentity.includes("spotify")) return "spotify";
  if (textIdentity.includes("youtube")) return "youtube";
  if (textIdentity.includes("perplexity")) return "perplexity";
  if (textIdentity.includes("netflix")) return "netflix";
  if (isXProduct) return "x";
  if (textIdentity.includes("canva")) return "canva";

  const visualIdentity = `${product?.visual || ""}`.toLowerCase();
  if (visualIdentity.includes("chatgpt")) return "chatgpt";
  if (visualIdentity.includes("claude")) return "claude";
  if (visualIdentity.includes("gemini")) return "gemini";
  if (visualIdentity.includes("grok")) return "grok";
  if (visualIdentity.includes("spotify")) return "spotify";
  if (visualIdentity.includes("youtube")) return "youtube";
  if (visualIdentity.includes("perplexity")) return "perplexity";
  if (visualIdentity.includes("netflix")) return "netflix";
  if (visualIdentity.includes("visual-x") || visualIdentity === "x") return "x";
  if (visualIdentity.includes("canva")) return "canva";
  return "";
}

function getProductIcon(product) {
  const icon = String(product?.icon || "").trim();
  const brand = getProductBrand(product);

  if (brand === "chatgpt") return "assets/chatgpt-icon.svg";
  if (brand === "claude") return "assets/claude-icon.svg";
  if (brand === "gemini") return "assets/gemini-icon.svg";
  if (brand === "grok") return "assets/grok-icon.svg";
  if (brand === "spotify") return "assets/spotify-icon.svg";
  if (brand === "youtube") return "assets/youtube-icon.svg";
  if (brand === "perplexity") return "assets/perplexity-icon.svg";
  if (brand === "netflix") return "assets/netflix-icon.svg";
  if (brand === "x") return "assets/x-icon.svg";
  if (brand === "canva") return "assets/canva-icon.svg";
  if (icon && icon.toUpperCase() !== "EMPTY" && !/^[A-Z]$/i.test(icon)) return icon;
  return "";
}

function hydrateProductAssets(product) {
  if (!product) return product;
  const icon = getProductIcon(product);
  return icon && product.icon !== icon ? { ...product, icon } : product;
}

function findProduct(id) {
  const supabaseProduct = (window.hkSupabaseProducts || []).find((product) => product.id === id);
  if (supabaseProduct) return hydrateProductAssets(supabaseProduct);

  try {
    const cachedProducts = JSON.parse(localStorage.getItem("hkDigitalStoreProductCache") || "[]");
    const cachedProduct = cachedProducts.find((product) => product.id === id);
    if (cachedProduct) return hydrateProductAssets(cachedProduct);
  } catch (error) {
    console.warn("Product cache unavailable", error);
  }

  return hydrateProductAssets(products.find((product) => product.id === id) || products[0]);
}

function getPlanPrice(product, planIndex) {
  const multipliers = [1, 2.85, 10.8];
  return Math.round(product.price * (multipliers[planIndex] || 1));
}

function getPlanLabel(planIndex) {
  return ["店長主推", "更優惠", "長期使用"][planIndex] || "可選方案";
}

function getPlanDescription(product, plan) {
  return `${plan} ${product.name} 訂閱啟用安排`;
}

function normalizeCartEntry(entry) {
  if (typeof entry === "string") {
    return { id: entry, plan: null, price: null };
  }
  return entry;
}

function getCartItems() {
  return getCart().map((entry) => {
    const normalized = normalizeCartEntry(entry);
    const product = findProduct(normalized.id);
    return {
      product,
      plan: normalized.plan,
      price: normalized.price || product.price
    };
  });
}

function getGroupedCartItems() {
  const groups = new Map();

  getCartItems().forEach((item, index) => {
    const key = `${item.product.id}|${item.plan || ""}|${item.price}`;
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        product: item.product,
        plan: item.plan,
        price: item.price,
        quantity: 0,
        indexes: []
      });
    }

    const group = groups.get(key);
    group.quantity += 1;
    group.indexes.push(index);
  });

  return Array.from(groups.values());
}

function updateCartCount() {
  const count = getCart().length;
  document.querySelectorAll("[data-cart-count]").forEach((node) => {
    node.textContent = count;
  });
}

function iconSvg(name) {
  const icons = {
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m21 21-4.35-4.35"></path><circle cx="11" cy="11" r="7"></circle></svg>',
    cart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6h15l-1.6 8.2a2 2 0 0 1-2 1.6H9.1a2 2 0 0 1-2-1.6L5 3H2"></path><circle cx="9" cy="20" r="1.6"></circle><circle cx="18" cy="20" r="1.6"></circle></svg>',
    user: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"></circle><path d="M4 21a8 8 0 0 1 16 0"></path></svg>'
  };
  return icons[name] || "";
}

function showToast(message) {
  let toast = document.querySelector("[data-toast]");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    toast.dataset.toast = "";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function createCartIntent(productId) {
  const product = findProduct(productId);
  const qtyInput = document.querySelector("[data-product-qty]");
  const selectedPlan = document.querySelector("[data-plan-option].selected");
  const selectedPlanIndex = selectedPlan ? Number(selectedPlan.dataset.planIndex) : 0;
  const selectedPlanName = product.plans[selectedPlanIndex] || product.plans[0];
  const selectedPlanPrice = getPlanPrice(product, selectedPlanIndex);

  return {
    id: product.id,
    plan: selectedPlanName,
    price: selectedPlan ? selectedPlanPrice : product.price,
    quantity: Math.min(99, Math.max(1, Number(qtyInput?.value) || 1)),
    region: product.region,
    usage: null
  };
}

function addCartIntent(intent) {
  const cart = getCart();
  for (let index = 0; index < intent.quantity; index += 1) {
    cart.push({
      id: intent.id,
      plan: intent.plan,
      price: intent.price,
      region: intent.region,
      usage: intent.usage
    });
  }
  saveCart(cart);
}

function increaseCartGroup(group) {
  const nextCart = getCart();
  nextCart.push({
    id: group.product.id,
    plan: group.plan,
    price: group.price
  });
  saveCart(nextCart);
}

function decreaseCartGroup(group) {
  const nextCart = getCart();
  nextCart.splice(group.indexes[group.indexes.length - 1], 1);
  saveCart(nextCart);
}

function removeCartGroup(group) {
  const removeIndexes = new Set(group.indexes);
  const nextCart = getCart().filter((_, index) => !removeIndexes.has(index));
  saveCart(nextCart);
}

function cartItemThumb(product) {
  const icon = getProductIcon(product);
  return icon
    ? `<img src="${icon}" alt="${product.name}" onerror="this.replaceWith(document.createTextNode('${product.name.slice(0, 1)}'))">`
    : `<span>${product.name.slice(0, 1)}</span>`;
}

function completePendingCartIntent(message = "已加入購物車") {
  if (!pendingCartIntent) return;
  addCartIntent(pendingCartIntent);
  pendingCartIntent = null;
  showToast(message);
}

function productCard(product) {
  const cardTags = Array.from(new Set([...product.tags, "售後跟進"]));
  return `
    <article class="product-card ${product.visual}">
      <div class="product-art ${product.image ? "has-product-image" : ""}">
        ${product.image ? `
          <img src="${product.image}" alt="${product.name}" loading="lazy">
          <span class="product-art-label">${product.type}</span>
        ` : `
          <span class="product-art-label">${product.type}</span>
          <strong>${product.name}</strong>
          <small>${product.badge}</small>
        `}
        <span class="product-stock-badge">可查詢</span>
      </div>
      <div class="product-card-body">
        <div class="product-card-title-row">
          <div>
            <span class="product-card-type">${product.type}</span>
            <h3>${product.name}</h3>
          </div>
          <div class="price">${formatStartPrice(product.price)}</div>
        </div>
        <p>${product.description}</p>
        <div class="product-badges">
          ${cardTags.slice(0, 3).map((tag) => `<span>${tag}</span>`).join("")}
        </div>
        <div class="product-meta">
          <span class="tag">${product.region}</span>
          <span class="tag">${product.delivery}</span>
        </div>
        <div class="product-card-checks">
          <span>地區先核對</span>
          <span>付款後跟進</span>
        </div>
        <div class="card-actions product-card-actions">
          <a class="button primary wide" href="product.html?id=${product.id}">選擇方案</a>
        </div>
      </div>
    </article>
  `;
}

function renderProducts(target, list) {
  if (!target) return;
  const countNode = document.querySelector("[data-product-count]");
  if (countNode) {
    countNode.textContent = list.length ? `顯示 ${list.length} 件商品` : "沒有符合條件的商品";
  }
  target.innerHTML = list.map(productCard).join("");
  window.requestAnimationFrame?.(() => initLuxuryExperience());
}

function getLocalProductSearchText() {
  return (document.querySelector("[data-product-search]")?.value || "").trim().toLowerCase();
}

function applyLocalProductDiscovery(listTarget) {
  const activeFilter = document.querySelector("[data-filter].active")?.dataset.filter || "all";
  const search = getLocalProductSearchText();
  const filtered = products.filter((product) => {
    const matchesFilter = activeFilter === "all" || product.type === activeFilter;
    const haystack = [
      product.name,
      product.type,
      product.description,
      product.region,
      product.delivery,
      product.badge,
      ...product.tags
    ].join(" ").toLowerCase();
    return matchesFilter && (!search || haystack.includes(search));
  });
  renderProducts(listTarget, filtered);
  bindAddCartButtons();
}

function bindAddCartButtons() {
  document.querySelectorAll("[data-add-cart]").forEach((button) => {
    if (button.dataset.addCartBound === "true") return;
    button.dataset.addCartBound = "true";

    button.addEventListener("click", () => {
      pendingCartIntent = createCartIntent(button.dataset.addCart);

      addCartIntent(pendingCartIntent);
      pendingCartIntent = null;
      openCartDrawer();
      showToast("已加入購物車");
      button.textContent = "已加入";
      setTimeout(() => {
        button.textContent = "加入購物車";
      }, 1200);
    });
  });
}

function bindBuyNowButtons() {
  document.querySelectorAll("[data-buy-now]").forEach((button) => {
    if (button.dataset.buyNowBound === "true") return;
    button.dataset.buyNowBound = "true";

    button.addEventListener("click", () => {
      const intent = createCartIntent(button.dataset.buyNow);
      addCartIntent(intent);
      window.location.href = "cart.html";
    });
  });
}

window.HKDigitalStoreAddCart = (productId, button) => {
  const intent = createCartIntent(productId);
  addCartIntent(intent);
  openCartDrawer();
  showToast("已加入購物車");

  if (button) {
    button.textContent = "已加入";
    window.setTimeout(() => {
      button.textContent = "加入購物車";
    }, 1200);
  }
};

function initProductLists() {
  const featuredTarget = document.querySelector("[data-featured-products]");
  renderProducts(featuredTarget, products.filter((product) => product.featured).slice(0, 4));

  const listTarget = document.querySelector("[data-product-list]");
  renderProducts(listTarget, products);

  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-filter]").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      applyLocalProductDiscovery(listTarget);
    });
  });

  const searchInput = document.querySelector("[data-product-search]");
  if (searchInput && searchInput.dataset.localSearchBound !== "true") {
    searchInput.dataset.localSearchBound = "true";
    searchInput.addEventListener("input", () => applyLocalProductDiscovery(listTarget));
  }
}

function initProductDetail() {
  const target = document.querySelector("[data-product-detail]");
  if (!target) return;
  const params = new URLSearchParams(window.location.search);
  const product = findProduct(params.get("id"));
  rememberProductView(product.id);
  const heroImage = getProductHeroImage(product);
  if (heroImage && !product.image) product.image = heroImage;

  target.innerHTML = `
      <div class="detail-art ${product.visual} ${product.image ? "has-product-image" : ""}">
        ${product.image ? `
          <img src="${product.image}" alt="${product.name} 官方商品圖片">
          <div class="detail-photo-caption">
            <span>${product.type}</span>
            <strong>${product.name}</strong>
            <small>${product.badge}</small>
          </div>
        ` : `
          <div class="mock-product-photo">
            <div class="mock-envelope"></div>
            <div class="mock-card">
              <span>${product.type}</span>
              <strong>${product.name}</strong>
              <small>${product.badge}</small>
            </div>
            <div class="mock-caption">
              <span>${product.type}</span>
              <strong>${product.name}</strong>
              <small>${product.badge}</small>
            </div>
          </div>
        `}
      </div>
      <div class="detail-copy">
        <p class="eyebrow">${product.type}</p>
        <h1>${product.name}</h1>
        <p>${product.description}</p>
        <div class="product-badges detail-badges">
          ${product.tags.map((tag) => `<span>${tag}</span>`).join("")}
        </div>
        <div class="detail-trust-grid">
          <div>
            <strong>地區先確認</strong>
            <span>${product.region}</span>
          </div>
          <div>
            <strong>交付方式</strong>
            <span>${product.delivery}</span>
          </div>
          <div>
            <strong>售後跟進</strong>
            <span>${product.afterSales}</span>
          </div>
        </div>
        <div class="plans-box">
          <div class="plans-box-head">
            <h2>選擇你的方案</h2>
            <span>選好週期，再加入購物車或直接付款</span>
          </div>
          <div class="plan-options">
            ${product.plans.map((plan, index) => `
              <button class="plan-option ${index === 0 ? "selected" : ""}" type="button" data-plan-option data-plan-index="${index}" data-plan-price="${getPlanPrice(product, index)}">
                <span class="plan-thumb ${product.visual}">
                  ${product.icon ? `<img src="${product.icon}" alt="${product.name}" onerror="this.replaceWith(document.createTextNode('${product.name.slice(0, 1)}'))">` : product.name.slice(0, 1)}
                </span>
                <span class="plan-main">
                  <strong>${plan}</strong>
                  <small>${getPlanDescription(product, plan)}</small>
                </span>
                <span class="plan-side">
                  <em>${getPlanLabel(index)}</em>
                  <strong>${formatPrice(getPlanPrice(product, index))}</strong>
                </span>
              </button>
            `).join("")}
          </div>
        </div>
        <div class="purchase-summary">
          <div>
            <span>今日價格</span>
            <strong data-selected-price>${formatPrice(getPlanPrice(product, 0))}</strong>
          </div>
          <div>
            <span>優惠前</span>
            <s data-original-price>${formatPrice(Math.round(getPlanPrice(product, 0) * 1.18))}</s>
          </div>
          <em>有貨</em>
        </div>
        <p class="notice detail-notice">下單前需確認帳號地區和可用方案。請不要提交與下單無關的私人敏感資料、帳戶密碼或一次性驗證碼。</p>
        <div class="detail-concierge">
          <div>
            <strong>不確定這個方案是否適合？</strong>
            <span>把你的帳戶地區、用途和預算交給客服先核對。</span>
          </div>
          <a href="contact.html">問客服</a>
        </div>
        <div class="detail-service-stack">
          <article>
            <span>01</span>
            <strong>先核對</strong>
            <p>確認地區、帳戶條件和方案週期。</p>
          </article>
          <article>
            <span>02</span>
            <strong>再付款</strong>
            <p>付款頁會顯示金額和所選付款方式。</p>
          </article>
          <article>
            <span>03</span>
            <strong>後續跟進</strong>
            <p>保留截圖與訂單紀錄，方便客服追蹤。</p>
          </article>
        </div>
        <div class="detail-buy-row">
          <label class="qty-control">
            數量
            <input type="number" min="1" max="99" value="1" data-product-qty>
          </label>
          <button class="button primary" type="button" data-add-cart="${product.id}">加入購物車</button>
          <button class="button ghost" type="button" data-buy-now="${product.id}">立刻付款</button>
        </div>
      </div>
  `;

  document.querySelectorAll("[data-plan-option]").forEach((option) => {
    option.addEventListener("click", () => {
      document.querySelectorAll("[data-plan-option]").forEach((item) => item.classList.remove("selected"));
      option.classList.add("selected");
      const selectedPrice = Number(option.dataset.planPrice);
      document.querySelector("[data-selected-price]").textContent = formatPrice(selectedPrice);
      document.querySelector("[data-original-price]").textContent = formatPrice(Math.round(selectedPrice * 1.18));
    });
  });

  bindAddCartButtons();
  bindBuyNowButtons();
}

function updateAuthNav() {
  if (window.hkSupabaseAuth) {
    window.hkSupabaseAuth.updateAuthNav();
    return;
  }
  const user = getCurrentUser();
  document.querySelectorAll(".header-actions").forEach((node) => node.remove());

  document.querySelectorAll(".site-nav").forEach((nav) => {
    const wrapper = document.createElement("div");
    wrapper.className = "header-actions";
    wrapper.innerHTML = `
      <a class="header-icon cart-icon" href="/cart.html" aria-label="購物車" data-open-cart-drawer>
        ${iconSvg("cart")}
        <span data-cart-count>${getCart().length}</span>
      </a>
      ${user
        ? `<div class="account-menu-wrap">
            <button class="header-icon" type="button" aria-label="我的帳戶" aria-expanded="false" data-account-menu-toggle>${iconSvg("user")}</button>
            <div class="account-menu" data-account-menu>
              <a href="/account.html">我的帳戶</a>
              <a href="/order-history.html">訂購紀錄</a>
              <a href="/recent-viewed.html">最近瀏覽</a>
              <button type="button" data-logout>登出</button>
            </div>
          </div>`
        : `<button class="header-icon" type="button" data-open-auth="login" aria-label="登入或註冊">${iconSvg("user")}</button>`}
    `;

    nav.appendChild(wrapper);
  });

  document.querySelectorAll("[data-open-cart-drawer]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      openCartDrawer();
    });
  });

  document.querySelectorAll("[data-open-auth]").forEach((button) => {
    button.addEventListener("click", () => openAuthModal(button.dataset.openAuth));
  });

  document.querySelectorAll("[data-account-menu-toggle]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const menu = button.closest(".account-menu-wrap")?.querySelector("[data-account-menu]");
      const isOpen = menu?.classList.toggle("open");
      button.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  });

  document.addEventListener("click", () => {
    document.querySelectorAll("[data-account-menu].open").forEach((menu) => {
      menu.classList.remove("open");
      menu.closest(".account-menu-wrap")?.querySelector("[data-account-menu-toggle]")?.setAttribute("aria-expanded", "false");
    });
  });

  document.querySelectorAll("[data-logout]").forEach((button) => {
    button.addEventListener("click", () => {
      clearCurrentUser();
      showToast("已登出");
      if (["account", "order-history", "recent-viewed"].includes(document.body.dataset.page)) {
        window.location.href = "index.html";
      }
      if (document.querySelector("[data-cart-items]")) {
        renderCartPage();
      }
    });
  });
}

function ensureCartDrawer() {
  if (document.querySelector("[data-cart-drawer]")) return;

  const drawer = document.createElement("aside");
  drawer.className = "cart-drawer";
  drawer.dataset.cartDrawer = "";
  drawer.setAttribute("aria-hidden", "true");
  drawer.innerHTML = `
    <div class="cart-drawer-backdrop" data-close-cart-drawer></div>
    <div class="cart-drawer-panel" role="dialog" aria-modal="true" aria-labelledby="cart-drawer-title">
      <div class="cart-drawer-head">
        <div>
          <p class="eyebrow">Cart</p>
          <h2 id="cart-drawer-title">購物車</h2>
        </div>
        <button class="auth-close" type="button" data-close-cart-drawer aria-label="關閉購物車">×</button>
      </div>
      <div class="cart-drawer-body" data-cart-drawer-items></div>
      <div class="cart-drawer-foot">
        <div class="drawer-total">
          <span>合計</span>
          <strong data-cart-drawer-total>HK$0</strong>
        </div>
        <a class="button primary wide" href="cart.html" data-close-cart-drawer>立刻付款</a>
        <p>提交前仍會先確認地區、方案及交付安排。</p>
      </div>
    </div>
  `;
  document.body.appendChild(drawer);

  drawer.querySelectorAll("[data-close-cart-drawer]").forEach((node) => {
    node.addEventListener("click", closeCartDrawer);
  });
}

function renderCartDrawer() {
  ensureCartDrawer();
  const target = document.querySelector("[data-cart-drawer-items]");
  const totalNode = document.querySelector("[data-cart-drawer-total]");
  if (!target || !totalNode) return;

  const groups = getGroupedCartItems();
  const total = groups.reduce((sum, item) => sum + item.price * item.quantity, 0);
  totalNode.textContent = formatPrice(total);

  if (!groups.length) {
    target.innerHTML = `
      <div class="drawer-empty">
        <div class="empty-icon">HD</div>
        <h3>你的購物車還是空的</h3>
        <p>先選擇需要的商品，再回來確認。</p>
        <a class="button ghost" href="products.html">去看看商品</a>
      </div>
    `;
    return;
  }

  target.innerHTML = groups.map((item, groupIndex) => `
    <article class="drawer-cart-item">
      <div class="cart-thumb ${item.product.visual}">
        ${cartItemThumb(item.product)}
      </div>
      <div class="drawer-cart-main">
        <strong>${item.product.name}</strong>
        <span>${item.plan || getPlanLabel(0)} · ${item.product.type}</span>
      </div>
      <div class="drawer-cart-side">
        <div class="cart-qty drawer-cart-qty" aria-label="${item.product.name} 數量">
          <button type="button" data-drawer-cart-decrease="${groupIndex}" aria-label="減少數量">−</button>
          <span>${item.quantity}</span>
          <button type="button" data-drawer-cart-increase="${groupIndex}" aria-label="增加數量">+</button>
        </div>
        <em>${formatPrice(item.price * item.quantity)}</em>
        <button class="drawer-remove" type="button" data-drawer-cart-remove="${groupIndex}" aria-label="移除商品">×</button>
      </div>
    </article>
  `).join("");

  target.querySelectorAll("[data-drawer-cart-decrease]").forEach((button) => {
    button.addEventListener("click", () => {
      const group = groups[Number(button.dataset.drawerCartDecrease)];
      decreaseCartGroup(group);
    });
  });

  target.querySelectorAll("[data-drawer-cart-increase]").forEach((button) => {
    button.addEventListener("click", () => {
      const group = groups[Number(button.dataset.drawerCartIncrease)];
      increaseCartGroup(group);
    });
  });

  target.querySelectorAll("[data-drawer-cart-remove]").forEach((button) => {
    button.addEventListener("click", () => {
      const group = groups[Number(button.dataset.drawerCartRemove)];
      removeCartGroup(group);
    });
  });
}

function openCartDrawer() {
  renderCartDrawer();
  const drawer = document.querySelector("[data-cart-drawer]");
  if (!drawer) return;
  cartDrawerScrollY = window.scrollY || document.documentElement.scrollTop || 0;
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  document.documentElement.classList.add("drawer-open");
  document.body.classList.add("drawer-open");
}

function closeCartDrawer() {
  const drawer = document.querySelector("[data-cart-drawer]");
  if (!drawer) return;
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
  document.documentElement.classList.remove("drawer-open");
  document.body.classList.remove("drawer-open");
  window.scrollTo(0, cartDrawerScrollY);
}

function ensureAuthModal() {
  if (document.querySelector("[data-auth-modal]")) return;

  const modal = document.createElement("div");
  modal.className = "auth-modal";
  modal.dataset.authModal = "";
  modal.hidden = true;
  modal.innerHTML = `
    <div class="auth-backdrop" data-close-auth></div>
    <div class="auth-dialog" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
      <button class="auth-close" type="button" data-close-auth aria-label="關閉登入視窗">×</button>
      <p class="eyebrow">Member Access</p>
      <h2 id="auth-modal-title">登入後加入購物車</h2>
      <p>登入後可以保存購物車和訂單記錄，之後也方便查看付款和發貨狀態。</p>
      <div class="auth-tabs" role="tablist">
        <button class="active" type="button" data-auth-tab="login">登入</button>
        <button type="button" data-auth-tab="register">註冊</button>
      </div>
      <form class="auth-form active" data-auth-login>
        <label>
          Email
          <input type="email" name="email" autocomplete="email" required>
        </label>
        <label>
          密碼
          <input type="password" name="password" autocomplete="current-password" required>
        </label>
        <p class="auth-error" data-login-error role="alert"></p>
        <button class="button primary wide" type="submit">登入並加入購物車</button>
      </form>
      <form class="auth-form" data-auth-register>
        <label>
          稱呼 / 用戶名
          <input type="text" name="name" autocomplete="name" required>
        </label>
        <label>
          Email
          <input type="email" name="email" autocomplete="email" required>
        </label>
        <label>
          密碼
          <input type="password" name="password" autocomplete="new-password" required>
        </label>
        <label>
          確認密碼
          <input type="password" name="confirmPassword" autocomplete="new-password" required>
        </label>
        <p class="auth-error" data-register-error role="alert"></p>
        <button class="button primary wide" type="submit">建立帳戶並加入購物車</button>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelectorAll("[data-close-auth]").forEach((node) => {
    node.addEventListener("click", closeAuthModal);
  });

  modal.querySelectorAll("[data-auth-tab]").forEach((button) => {
    button.addEventListener("click", () => switchAuthTab(button.dataset.authTab));
  });

  modal.querySelector("[data-auth-login]").addEventListener("submit", handleModalLogin);
  modal.querySelector("[data-auth-register]").addEventListener("submit", handleModalRegister);
}

function openAuthModal(tab = "login") {
  ensureAuthModal();
  const modal = document.querySelector("[data-auth-modal]");
  modal.hidden = false;
  document.body.classList.add("modal-open");
  switchAuthTab(tab);
}

function closeAuthModal() {
  const modal = document.querySelector("[data-auth-modal]");
  if (!modal) return;
  modal.hidden = true;
  document.body.classList.remove("modal-open");
}

function switchAuthTab(tab) {
  const modal = document.querySelector("[data-auth-modal]");
  if (!modal) return;
  modal.querySelectorAll("[data-auth-tab]").forEach((button) => {
    button.classList.toggle("active", button.dataset.authTab === tab);
  });
  modal.querySelector("[data-auth-login]").classList.toggle("active", tab === "login");
  modal.querySelector("[data-auth-register]").classList.toggle("active", tab === "register");
  modal.querySelector("[data-login-error]").textContent = "";
  modal.querySelector("[data-register-error]").textContent = "";
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function handleModalLogin(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const error = document.querySelector("[data-login-error]");
  const email = form.email.value.trim().toLowerCase();
  const password = form.password.value;

  if (window.hkSupabaseAuth) {
    if (!email || !password) {
      error.textContent = "Email 或密碼不正確";
      return;
    }

    try {
      await window.hkSupabaseAuth.login({ email, password });
      closeAuthModal();
      form.reset();
      if (pendingCartIntent) {
        completePendingCartIntent("已加入購物車");
      } else {
        showToast("已登入");
      }
      renderCartPage();
    } catch (_authError) {
      error.textContent = "Email 或密碼不正確";
    }
    return;
  }

  error.textContent = "登入系統尚未載入，請重新整理頁面後再試。";
}

async function handleModalRegister(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const error = document.querySelector("[data-register-error]");
  const name = form.name.value.trim();
  const email = form.email.value.trim().toLowerCase();
  const password = form.password.value;
  const confirmPassword = form.confirmPassword.value;

  if (!name) {
    error.textContent = "請輸入你的稱呼";
    return;
  }
  if (!isValidEmail(email)) {
    error.textContent = "請輸入有效的 Email";
    return;
  }
  if (password.length < 6) {
    error.textContent = "密碼至少需要 6 位";
    return;
  }
  if (password !== confirmPassword) {
    error.textContent = "兩次輸入的密碼不一致";
    return;
  }
  if (window.hkSupabaseAuth) {
    try {
      await window.hkSupabaseAuth.register({ name, email, password });
      await window.hkSupabaseAuth.login({ email, password });
      closeAuthModal();
      form.reset();
      if (pendingCartIntent) {
        completePendingCartIntent("帳戶已建立，商品已加入購物車");
      } else {
        showToast("帳戶已建立");
      }
      renderCartPage();
    } catch (authError) {
      error.textContent = authError?.message?.includes("User already registered")
        ? "這個 Email 已經註冊過"
        : "建立帳戶失敗，請稍後再試。";
    }
    return;
  }

  error.textContent = "註冊系統尚未載入，請重新整理頁面後再試。";
}

function renderCartPage() {
  const target = document.querySelector("[data-cart-items]");
  if (!target) return;
  if (document.body.classList.contains("checkout-page") && document.querySelector(".checkout-summary-card")) return;

  const render = () => {
    const contactPanel = document.querySelector(".contact-panel");
    const checkoutSteps = document.querySelector(".checkout-steps");

    if (!isLoggedIn()) {
      if (contactPanel) contactPanel.hidden = true;
      if (checkoutSteps) checkoutSteps.hidden = true;
      target.innerHTML = `
        <div class="cart-empty-state auth-gate">
          <div class="empty-icon">HD</div>
          <h3>請先登入後再結帳</h3>
          <p>登入後可以保存訂單記錄，之後也方便查看付款和發貨狀態。</p>
          <div class="auth-gate-actions">
            <button class="button primary" type="button" data-open-auth="login">登入</button>
            <button class="button ghost" type="button" data-open-auth="register">建立帳戶</button>
          </div>
        </div>
      `;
      target.querySelectorAll("[data-open-auth]").forEach((button) => {
        button.addEventListener("click", () => openAuthModal(button.dataset.openAuth));
      });
      return;
    }

    if (contactPanel) contactPanel.hidden = false;
    if (checkoutSteps) checkoutSteps.hidden = false;

    const groups = getGroupedCartItems();
    const subtotal = groups.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (!groups.length) {
      target.innerHTML = `
        <div class="cart-empty-state">
          <div class="empty-icon">HD</div>
          <h3>你的購物車還是空的</h3>
          <p>先選擇需要的商品，再回來確認。</p>
          <a class="button primary" href="products.html">去看看商品</a>
        </div>
      `;
      return;
    }

    target.innerHTML = `
      <div class="cart-list">
      ${groups.map((item, groupIndex) => `
        <div class="cart-item">
          <div class="cart-thumb ${item.product.visual}">
            ${cartItemThumb(item.product)}
          </div>
          <div class="cart-item-main">
            <strong>${item.product.name}</strong>
            <div class="cart-item-meta">
              <span>${item.plan || getPlanLabel(0)}</span>
              <span>${item.product.type}</span>
            </div>
          </div>
          <div class="cart-item-side">
            <strong>${formatPrice(item.price)}</strong>
            <div class="cart-qty" aria-label="${item.product.name} 數量">
              <button type="button" data-cart-decrease="${groupIndex}" aria-label="減少數量">−</button>
              <span>${item.quantity}</span>
              <button type="button" data-cart-increase="${groupIndex}" aria-label="增加數量">+</button>
            </div>
            <button class="remove-button" type="button" data-cart-remove="${groupIndex}">移除</button>
          </div>
        </div>
      `).join("")}
      </div>
      <div class="order-summary-lines">
        <div><span>商品金額</span><strong>${formatPrice(subtotal)}</strong></div>
        <div><span>優惠</span><strong>暫無優惠</strong></div>
        <div class="summary-total"><span>合計</span><strong>${formatPrice(subtotal)}</strong></div>
      </div>
      <p class="checkout-reminder">最終付款方式及交付安排會由客服確認後提供。</p>
    `;

    document.querySelectorAll("[data-cart-decrease]").forEach((button) => {
      button.addEventListener("click", () => {
        const group = groups[Number(button.dataset.cartDecrease)];
        const nextCart = getCart();
        nextCart.splice(group.indexes[group.indexes.length - 1], 1);
        saveCart(nextCart);
        render();
      });
    });

    document.querySelectorAll("[data-cart-increase]").forEach((button) => {
      button.addEventListener("click", () => {
        const group = groups[Number(button.dataset.cartIncrease)];
        const nextCart = getCart();
        nextCart.push({
          id: group.product.id,
          plan: group.plan,
          price: group.price
        });
        saveCart(nextCart);
        render();
      });
    });

    document.querySelectorAll("[data-cart-remove]").forEach((button) => {
      button.addEventListener("click", () => {
        const group = groups[Number(button.dataset.cartRemove)];
        const removeIndexes = new Set(group.indexes);
        const nextCart = getCart().filter((_, index) => !removeIndexes.has(index));
        saveCart(nextCart);
        render();
      });
    });
  };

  render();
}

function renderCheckoutCartPage() {
  const target = document.querySelector("[data-cart-items]");
  if (!target) return;

  const render = () => {
    const form = document.querySelector("[data-order-form]");
    const subtotalNode = document.querySelector("[data-checkout-subtotal]");
    const totalNode = document.querySelector("[data-checkout-total]");
    const productNote = document.querySelector("[data-checkout-product-note]");
    const submitButton = document.querySelector(".checkout-submit-button");

    if (form) form.hidden = !isLoggedIn();
    const groups = getGroupedCartItems();
    const subtotal = groups.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalText = `${formatPrice(subtotal)}.00`;

    if (subtotalNode) subtotalNode.textContent = totalText;
    if (totalNode) totalNode.textContent = totalText;
    if (productNote) {
      productNote.innerHTML = groups.length
        ? `<strong>${groups[0].product.name}</strong><span>${groups[0].plan || getPlanLabel(0)}</span>`
        : `<strong>請先選擇商品</strong><span>加入商品後會顯示發貨資訊</span>`;
    }
    if (productNote && groups.length) {
      const noteItems = groups.map((item) => {
        const quantityText = item.quantity > 1 ? ` x${item.quantity}` : "";
        return `${item.product.name}${quantityText}`;
      });
      productNote.innerHTML = `<strong>${noteItems.join("、")}</strong><span>共 ${groups.length} 項</span>`;
    }
    if (submitButton) submitButton.disabled = !groups.length;

    if (!groups.length) {
      target.innerHTML = `
        <div class="cart-empty-state checkout-empty-summary">
          <div class="empty-icon">HD</div>
          <h3>你的購物車還是空的</h3>
          <p>先選擇需要的商品，再回來確認。</p>
          <a class="button primary" href="products.html">去看看商品</a>
        </div>
      `;
      return;
    }

    target.innerHTML = `
      <div class="checkout-summary-list">
        ${groups.map((item, groupIndex) => `
          <article class="checkout-summary-item">
            <div class="cart-thumb ${item.product.visual}">
              ${cartItemThumb(item.product)}
            </div>
            <div class="checkout-summary-main">
              <strong>${item.product.name}</strong>
              <span>${item.plan || getPlanLabel(0)} · ${item.product.type}</span>
              <div class="cart-qty checkout-summary-qty" aria-label="${item.product.name} 數量">
                <button type="button" data-cart-decrease="${groupIndex}" aria-label="減少數量">−</button>
                <span>${item.quantity}</span>
                <button type="button" data-cart-increase="${groupIndex}" aria-label="增加數量">+</button>
              </div>
            </div>
            <div class="checkout-summary-side">
              <button class="checkout-remove" type="button" data-cart-remove="${groupIndex}" aria-label="移除商品">×</button>
              <strong>${formatPrice(item.price * item.quantity)}</strong>
            </div>
          </article>
        `).join("")}
      </div>
    `;

    target.querySelectorAll("[data-cart-decrease]").forEach((button) => {
      button.addEventListener("click", () => {
        const group = groups[Number(button.dataset.cartDecrease)];
        decreaseCartGroup(group);
        render();
      });
    });

    target.querySelectorAll("[data-cart-increase]").forEach((button) => {
      button.addEventListener("click", () => {
        const group = groups[Number(button.dataset.cartIncrease)];
        increaseCartGroup(group);
        render();
      });
    });

    target.querySelectorAll("[data-cart-remove]").forEach((button) => {
      button.addEventListener("click", () => {
        const group = groups[Number(button.dataset.cartRemove)];
        removeCartGroup(group);
        render();
      });
    });
  };

  render();
}

function initCart() {
  renderCheckoutCartPage();
}

function initPaymentMethodSelection() {
  const paymentCards = document.querySelectorAll(".payment-logo-card");
  if (!paymentCards.length) return;

  const updateSelectedPayment = () => {
    paymentCards.forEach((card) => {
      const input = card.querySelector('input[type="radio"]');
      card.classList.toggle("selected", Boolean(input && input.checked));
    });
  };

  paymentCards.forEach((card) => {
    const input = card.querySelector('input[type="radio"]');
    if (!input) return;
    card.addEventListener("click", () => {
      input.checked = true;
      input.dispatchEvent(new Event("change", { bubbles: true }));
      updateSelectedPayment();
    });
    input.addEventListener("change", updateSelectedPayment);
  });

  document.addEventListener("click", (event) => {
    const card = event.target.closest(".payment-logo-card");
    if (!card) return;
    const input = card.querySelector('input[type="radio"]');
    if (!input) return;
    input.checked = true;
    updateSelectedPayment();
  }, true);

  updateSelectedPayment();
}

function getStoredPaymentSession() {
  try {
    return JSON.parse(sessionStorage.getItem(paymentSessionKey) || "null")
      || JSON.parse(localStorage.getItem(paymentSessionKey) || "null")
      || {};
  } catch (error) {
    return {};
  }
}

function getCheckoutTermsInput(form) {
  if (!form) return null;
  return document.querySelector(`input[name="terms"][form="${form.id}"]`) || form.terms || null;
}

function getCheckoutDraft(form) {
  const session = getStoredPaymentSession();
  const checkout = session.checkout || {};
  const selectedPayment = form
    ? form.querySelector('input[name="payment"]:checked') || document.querySelector('input[name="payment"]:checked')
    : null;
  const terms = getCheckoutTermsInput(form);

  return {
    customer_name: checkout.customer_name || "",
    email: form?.email?.value.trim() || checkout.email || "",
    contact_method: "WhatsApp",
    contact_value: form?.contact_value?.value.trim() || form?.contact?.value.trim() || checkout.contact_value || "",
    bind_email: form?.bindEmail?.value.trim() || checkout.bind_email || "",
    note: form?.note?.value.trim() || checkout.note || "",
    payment_method: selectedPayment?.value || checkout.payment_method || session.method || "",
    terms_accepted: terms ? terms.checked : Boolean(checkout.terms_accepted)
  };
}

function saveCheckoutDraft(form) {
  if (!form) return;
  const existing = getStoredPaymentSession();
  const checkout = getCheckoutDraft(form);
  const nextSession = {
    ...existing,
    method: checkout.payment_method || existing.method || "FPS",
    checkout: {
      ...(existing.checkout || {}),
      ...checkout
    },
    updatedAt: new Date().toISOString()
  };
  sessionStorage.setItem(paymentSessionKey, JSON.stringify(nextSession));
  localStorage.setItem(paymentSessionKey, JSON.stringify(nextSession));
}

function restoreCheckoutDraft(form) {
  const session = getStoredPaymentSession();
  const checkout = session.checkout || {};
  const currentUser = getCurrentUser();
  if (!Object.keys(checkout).length && !session.method && !currentUser) return;

  const email = checkout.email || currentUser?.email || "";
  if (form.email && email) form.email.value = email;
  if (form.contact_value && checkout.contact_value) form.contact_value.value = checkout.contact_value;
  if (form.contact && checkout.contact_value) form.contact.value = checkout.contact_value;
  if (form.bindEmail && checkout.bind_email) form.bindEmail.value = checkout.bind_email;
  if (form.note && checkout.note) form.note.value = checkout.note;

  const paymentMethod = checkout.payment_method || session.method || "";
  if (paymentMethod) {
    const paymentInput = Array.from(document.querySelectorAll('input[name="payment"]'))
      .find((input) => input.value === paymentMethod);
    if (paymentInput) {
      paymentInput.checked = true;
      paymentInput.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }

  const terms = getCheckoutTermsInput(form);
  if (terms && checkout.terms_accepted) terms.checked = true;
}

function refreshCheckoutFormAfterAuth() {
  const form = document.querySelector("[data-order-form]");
  if (!form) return;
  renderCheckoutCartPage();
  restoreCheckoutDraft(form);
  saveCheckoutDraft(form);
}

function initCheckoutDraftPersistence(form) {
  restoreCheckoutDraft(form);
  const terms = getCheckoutTermsInput(form);
  const controls = [
    form.email,
    form.contact_value || form.contact,
    form.bindEmail,
    form.note,
    terms,
    ...document.querySelectorAll('input[name="payment"]')
  ].filter(Boolean);

  controls.forEach((control) => {
    const eventName = control.type === "text" || control.type === "email" || control.tagName === "TEXTAREA"
      ? "input"
      : "change";
    control.addEventListener(eventName, () => saveCheckoutDraft(form));
  });
}

function initOrderForm() {
  const form = document.querySelector("[data-order-form]");
  if (!form) return;

  initCheckoutDraftPersistence(form);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const result = document.querySelector("[data-form-result]");
    const submitButton = form.querySelector("button[type='submit']") || document.querySelector(`[form="${form.id}"][type="submit"]`);
    const success = document.querySelector("[data-success-state]");

    if (!isLoggedIn()) {
      openAuthModal("login");
      return;
    }

    if (!getCart().length) {
      result.textContent = "請先選擇商品，再提交給客服確認。";
      return;
    }

    const email = form.email ? form.email.value.trim() : "";
    const contactValue = form.contact_value
      ? form.contact_value.value.trim()
      : form.contact
        ? form.contact.value.trim()
        : "";

    if (!email || !contactValue) {
      result.textContent = "請填寫電郵地址和 WhatsApp 聯絡電話。";
      return;
    }

    const selectedPayment = form.querySelector('input[name="payment"]:checked') || document.querySelector('input[name="payment"]:checked');
    if (!selectedPayment) {
      result.textContent = "請先選擇付款方式。";
      return;
    }

    const groups = getGroupedCartItems();
    const subtotal = groups.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderItems = groups.map((item) => ({
      productName: item.product.name,
      productId: item.product.id,
      icon: item.product.icon || "",
      plan: item.plan || getPlanLabel(0),
      quantity: item.quantity,
      unitPrice: item.price,
      total: item.price * item.quantity
    }));
    const productName = orderItems
      .map((item) => `${item.productName}${item.quantity > 1 ? ` x${item.quantity}` : ""}`)
      .join("、");
    const currentUser = getCurrentUser();
    const terms = getCheckoutTermsInput(form);
    const paymentSession = {
      amount: subtotal || 158,
      method: selectedPayment.value || "FPS",
      productName: productName || "待確認商品",
      productIcon: orderItems[0]?.icon || "",
      items: orderItems,
      checkout: {
        customer_name: currentUser?.name || email,
        email,
        contact_method: "WhatsApp",
        contact_value: contactValue,
        bind_email: form.bindEmail ? form.bindEmail.value.trim() : "",
        note: form.note ? form.note.value.trim() : "",
        payment_method: selectedPayment.value || "FPS",
        terms_accepted: terms ? terms.checked : false
      },
      createdAt: new Date().toISOString()
    };

    sessionStorage.setItem(paymentSessionKey, JSON.stringify(paymentSession));
    localStorage.setItem(paymentSessionKey, JSON.stringify(paymentSession));
    sessionStorage.removeItem("hkDigitalStoreLastOrderId");
    localStorage.removeItem("hkDigitalStoreLastOrderId");

    submitButton.disabled = true;
    submitButton.textContent = "前往付款...";
    result.textContent = "";
    window.location.href = "payment/";
  });
}

function formatMoney(amount) {
  const value = Number(amount) || 158;
  return `HK$${value.toFixed(2)}`;
}

function getPaymentSession() {
  try {
    return JSON.parse(sessionStorage.getItem(paymentSessionKey) || "null") || {
      amount: 158,
      method: "FPS"
    };
  } catch (error) {
    return {
      amount: 158,
      method: "FPS"
    };
  }
}

function paymentField(label, value) {
  if (!value) return "";
  return `
    <div class="payment-field">
      <span>${label}</span>
      <strong>${value}</strong>
      <button type="button" data-copy="${value}">複製</button>
    </div>
  `;
}

function initPaymentPage() {
  const amountNode = document.querySelector("[data-payment-amount]");
  const methodNameNode = document.querySelector("[data-payment-method-name]");
  const displayNameNode = document.querySelector("[data-payment-display-name]");
  const fieldsNode = document.querySelector("[data-payment-fields]");
  const qrNode = document.querySelector("[data-payment-qr]");
  const productThumbNode = document.querySelector("[data-payment-product-thumb]");
  if (!amountNode || !methodNameNode || !fieldsNode || !qrNode) return;

  const session = getPaymentSession();
  const method = paymentMethods[session.method] || paymentMethods.FPS;
  const amountText = formatMoney(session.amount);

  amountNode.textContent = amountText;
  methodNameNode.textContent = method.displayName;
  if (displayNameNode) displayNameNode.textContent = method.displayName;
  if (productThumbNode) {
    const icon = session.productIcon || session.items?.find((item) => item.icon)?.icon || "";
    const name = session.productName || "Product";
    productThumbNode.hidden = !icon;
    productThumbNode.innerHTML = icon
      ? `<img src="${icon}" alt="${name}" onerror="this.closest('[data-payment-product-thumb]').hidden = true">`
      : "";
  }

  if (method.qrCodeImage) {
    qrNode.innerHTML = `<img src="${method.qrCodeImage}" alt="${method.displayName} 收款二維碼">`;
  } else {
    qrNode.innerHTML = `
      <span>QR</span>
      <p>請在 paymentMethods 設定收款二維碼圖片</p>
    `;
  }

  let fields = "";
  if (method.name === "FPS") {
    fields += paymentField("FPS ID", method.fpsId);
  }
  if (method.name === "Bank Transfer") {
    fields += paymentField("銀行名稱", method.bankName);
    fields += paymentField("銀行帳號", method.bankAccount);
  }
  if (method.name === "Binance Pay") {
    fields += paymentField("Binance Pay ID", method.binancePayId);
  }
  if (["PayMe", "AlipayHK", "WeChat Pay"].includes(method.name)) {
    fields += paymentField("Pay ID", method.binancePayId);
  }
  fields += paymentField("收款人", method.accountName);
  fields += paymentField("付款金額", amountText);
  if (method.note) {
    fields += `<p class="payment-method-note">${method.note}</p>`;
  }
  fieldsNode.innerHTML = fields;

  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.copy);
        button.textContent = "已複製";
        setTimeout(() => {
          button.textContent = "複製";
        }, 1200);
      } catch (error) {
        button.textContent = "已複製";
        setTimeout(() => {
          button.textContent = "複製";
        }, 1200);
      }
    });
  });

  const contactButton = document.querySelector("[data-contact-payment]");
  const result = document.querySelector("[data-payment-result]");
  if (contactButton) {
    contactButton.addEventListener("click", () => {
      if (result) result.textContent = "請聯絡客服確認付款。";
      window.location.href = "/contact.html";
    });
  }
}

function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    nav.classList.toggle("open");
  });
}

function renderAuthGate(title, text) {
  return `
    <div class="cart-empty-state auth-gate">
      <div class="empty-icon">HD</div>
      <h3>${title}</h3>
      <p>${text}</p>
      <div class="auth-gate-actions">
        <a class="button primary" href="login.html">登入</a>
        <a class="button ghost" href="register.html">建立帳戶</a>
      </div>
    </div>
  `;
}

function renderAccountTabs(active) {
  return `
    <div class="account-page-tabs">
      <a class="${active === "account" ? "active" : ""}" href="account.html">我的帳戶</a>
      <a class="${active === "orders" ? "active" : ""}" href="order-history.html">訂購紀錄</a>
      <a class="${active === "recent" ? "active" : ""}" href="recent-viewed.html">最近瀏覽</a>
      <button type="button" data-logout>登出</button>
    </div>
  `;
}

function initStandaloneAuthPages() {
  if (window.hkSupabaseAuth) {
    renderAccountSections();
    return;
  }
  const loginForm = document.querySelector("[data-login-page-form]");
  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const error = document.querySelector("[data-login-page-error]");
      error.textContent = "登入系統尚未載入，請重新整理頁面後再試。";
    });
  }

  const registerForm = document.querySelector("[data-register-page-form]");
  if (registerForm) {
    registerForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const error = document.querySelector("[data-register-page-error]");
      error.textContent = "註冊系統尚未載入，請重新整理頁面後再試。";
    });
  }

  const accountPanel = document.querySelector("[data-account-panel]");
  if (accountPanel) {
    document.body.dataset.page = "account";
    const user = getCurrentUser();
    if (!user) {
      accountPanel.innerHTML = renderAuthGate("請先登入", "登入後可以查看帳戶資料、購物車和後續訂單狀態。");
      return;
    }

    accountPanel.innerHTML = `
      <article class="panel account-wide-card">
        ${renderAccountTabs("account")}
        <div class="account-profile-card">
          <p class="eyebrow">My Account</p>
          <h2>${user.name}</h2>
          <p>${user.email}</p>
          <div class="account-actions">
            <a class="button primary" href="cart.html">查看購物車</a>
          </div>
        </div>
      </article>
    `;
  }

  const orderPanel = document.querySelector("[data-order-history-panel]");
  if (orderPanel) {
    document.body.dataset.page = "order-history";
    const user = getCurrentUser();
    if (!user) {
      orderPanel.innerHTML = renderAuthGate("請先登入", "登入後可以查看訂購紀錄和後續跟進狀態。");
      return;
    }

    orderPanel.innerHTML = `
      <article class="panel account-wide-card">
        ${renderAccountTabs("orders")}
        <div class="cart-empty-state account-empty-state">
          <div class="empty-icon">HD</div>
          <h3>暫時沒有訂購紀錄</h3>
          <p>完成查詢或付款後，客服跟進的訂單可以在這裡集中查看。</p>
          <a class="button primary" href="products.html">去看看商品</a>
        </div>
      </article>
    `;
  }

  const recentPanel = document.querySelector("[data-recent-viewed-panel]");
  if (recentPanel) {
    document.body.dataset.page = "recent-viewed";
    const user = getCurrentUser();
    if (!user) {
      recentPanel.innerHTML = renderAuthGate("請先登入", "登入後可以查看最近瀏覽過的商品。");
      return;
    }

    const recentProducts = getRecentViewed().map(findProduct).filter(Boolean);
    recentPanel.innerHTML = `
      <article class="panel account-wide-card">
        ${renderAccountTabs("recent")}
        ${recentProducts.length ? `
          <div class="recent-grid">
            ${recentProducts.map((product) => `
              <a class="recent-item" href="product.html?id=${product.id}">
                <div class="cart-thumb ${product.icon ? "has-image" : product.visual}">
                  ${cartItemThumb(product)}
                </div>
                <div>
                  <strong>${product.name}</strong>
                  <span>${product.type}</span>
                </div>
                <em>${formatPrice(product.price)} 起</em>
              </a>
            `).join("")}
          </div>
        ` : `
          <div class="cart-empty-state account-empty-state">
            <div class="empty-icon">HD</div>
            <h3>暫時沒有最近瀏覽</h3>
            <p>先看看商品，之後可以在這裡快速回到看過的方案。</p>
            <a class="button primary" href="products.html">去看看商品</a>
          </div>
        `}
      </article>
    `;
  }

  document.querySelectorAll("[data-logout]").forEach((button) => {
    if (button.dataset.logoutBound) return;
    button.dataset.logoutBound = "true";
    button.addEventListener("click", () => {
      clearCurrentUser();
      showToast("已登出");
      window.location.href = "index.html";
    });
  });
}

function renderAccountSections() {
  const accountPanel = document.querySelector("[data-account-panel]");
  if (accountPanel) {
    document.body.dataset.page = "account";
    const user = getCurrentUser();
    if (!user) {
      accountPanel.innerHTML = renderAuthGate("請先登入", "登入後可以查看帳戶資料、購物車和後續訂單狀態。");
      return;
    }

    accountPanel.innerHTML = `
      <article class="panel account-wide-card">
        ${renderAccountTabs("account")}
        <div class="account-profile-card">
          <p class="eyebrow">My Account</p>
          <h2>${user.name}</h2>
          <p>${user.email}</p>
          <div class="account-actions">
            <a class="button primary" href="cart.html">查看購物車</a>
          </div>
        </div>
      </article>
    `;
  }

  const orderPanel = document.querySelector("[data-order-history-panel]");
  if (orderPanel) {
    document.body.dataset.page = "order-history";
    const user = getCurrentUser();
    if (!user) {
      orderPanel.innerHTML = renderAuthGate("請先登入", "登入後可以查看訂購紀錄和後續跟進狀態。");
      return;
    }

    orderPanel.innerHTML = `
      <article class="panel account-wide-card">
        ${renderAccountTabs("orders")}
        <div class="cart-empty-state account-empty-state">
          <div class="empty-icon">HD</div>
          <h3>暫時沒有訂購紀錄</h3>
          <p>完成查詢或付款後，客服跟進的訂單可以在這裡集中查看。</p>
          <a class="button primary" href="products.html">去看看商品</a>
        </div>
      </article>
    `;
  }

  const recentPanel = document.querySelector("[data-recent-viewed-panel]");
  if (recentPanel) {
    document.body.dataset.page = "recent-viewed";
    const user = getCurrentUser();
    if (!user) {
      recentPanel.innerHTML = renderAuthGate("請先登入", "登入後可以查看最近瀏覽過的商品。");
      return;
    }

    const recentProducts = getRecentViewed().map(findProduct).filter(Boolean);
    recentPanel.innerHTML = `
      <article class="panel account-wide-card">
        ${renderAccountTabs("recent")}
        ${recentProducts.length ? `
          <div class="recent-grid">
            ${recentProducts.map((product) => `
              <a class="recent-item" href="product.html?id=${product.id}">
                <div class="cart-thumb ${product.icon ? "has-image" : product.visual}">
                  ${cartItemThumb(product)}
                </div>
                <div>
                  <strong>${product.name}</strong>
                  <span>${product.type}</span>
                </div>
                <em>${formatPrice(product.price)} 起</em>
              </a>
            `).join("")}
          </div>
        ` : `
          <div class="cart-empty-state account-empty-state">
            <div class="empty-icon">HD</div>
            <h3>暫時沒有最近瀏覽</h3>
            <p>先看看商品，之後可以在這裡快速回到看過的方案。</p>
            <a class="button primary" href="products.html">去看看商品</a>
          </div>
        `}
      </article>
    `;
  }

  document.querySelectorAll("[data-logout]").forEach((button) => {
    if (button.dataset.logoutBound) return;
    button.dataset.logoutBound = "true";
    button.addEventListener("click", () => {
      clearCurrentUser();
    });
  });
}

function ensureStoreCategoryRail() {
  const header = document.querySelector(".site-header");
  if (!header || document.querySelector("[data-store-category-rail]")) return;

  const path = window.location.pathname.toLowerCase();
  const skipRail = [
    "cart.html",
    "payment",
    "admin",
    "login.html",
    "register.html",
    "account.html",
    "order-history.html"
  ].some((item) => path.includes(item));
  if (skipRail) return;

  const rail = document.createElement("nav");
  rail.className = "store-category-rail";
  rail.dataset.storeCategoryRail = "";
  rail.setAttribute("aria-label", "商品快捷分類");
  rail.innerHTML = `
    <a href="/products.html?category=AI 工具">人工智能</a>
    <a href="/products.html?category=影音串流">串流平台</a>
    <a href="/products.html?category=社交平台">社交平台</a>
    <a href="/products.html">辦公軟件</a>
    <a href="/products.html">設計軟件</a>
    <a href="/products.html">蘋果專區</a>
    <a href="/contact.html">客服推薦</a>
  `;
  const nav = header.querySelector(".site-nav");
  header.insertBefore(rail, nav || null);
}

function enhanceStoreFooter() {
  const footer = document.querySelector(".site-footer");
  if (!footer || footer.dataset.enhancedFooter === "true") return;
  if (window.location.pathname.toLowerCase().includes("admin")) return;

  footer.dataset.enhancedFooter = "true";
  footer.innerHTML = `
    <div class="store-footer-grid">
      <div class="footer-brand-block">
        <div class="brand footer-brand"><span class="brand-mark">HD</span><span>HK Digital Store</span></div>
        <p>香港數碼訂閱與軟件代購平台。所有價格以港幣 HKD 計算，商品地區和交付安排以下單前確認為準。</p>
      </div>
      <div>
        <h3>選購與了解</h3>
        <a href="/products.html?category=AI 工具">人工智能</a>
        <a href="/products.html?category=影音串流">串流平台</a>
        <a href="/products.html?category=社交平台">社交平台</a>
        <a href="/products.html">所有商品</a>
      </div>
      <div>
        <h3>帳戶</h3>
        <a href="/account.html">我的帳戶</a>
        <a href="/order-history.html">我的訂單</a>
        <a href="/recent-viewed.html">最近瀏覽</a>
        <a href="/cart.html">購物車</a>
      </div>
      <div>
        <h3>支援</h3>
        <a href="/faq.html">購買須知</a>
        <a href="/contact.html">聯絡客服</a>
        <a href="/about.html">關於我們</a>
      </div>
    </div>
    <div class="store-footer-bottom">
      <span>© 2026 HK Digital Store. 保留所有權利。</span>
      <span>請勿提交帳戶密碼、銀行密碼或一次性驗證碼。</span>
    </div>
  `;
}

function initLuxuryExperience() {
  const header = document.querySelector(".site-header");
  if (header && header.dataset.premiumHeaderBound !== "true") {
    header.dataset.premiumHeaderBound = "true";
    let ticking = false;
    const updateHeader = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 18);
      ticking = false;
    };
    const requestHeaderUpdate = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateHeader);
    };
    updateHeader();
    window.addEventListener("scroll", requestHeaderUpdate, { passive: true });
  }

  const revealTargets = [
    ".hero-copy",
    ".hero-visual",
    ".trust-row article",
    ".apple-category-band > *",
    ".store-advisor-band",
    ".product-card",
    ".split-band",
    ".steps article",
    ".vault-showcase",
    ".care-band",
    ".bundle-grid article",
    ".support-strip",
    ".product-page-hero > *",
    ".catalog-visual-strip",
    ".catalog-toolbar",
    ".store-search-panel",
    ".filter-row",
    ".detail-layout > *",
    ".payment-hero > *",
    ".payment-panel",
    ".auth-page",
    ".auth-page-form",
    ".auth-benefit-panel",
    ".panel",
    ".values-grid article",
    ".faq-list details",
    ".account-profile-card",
    ".order-record-card",
    ".recent-item"
  ].join(",");

  document.body.classList.add("luxury-anim-ready");
  const nodes = Array.from(document.querySelectorAll(revealTargets));
  nodes.forEach((node, index) => {
    if (node.dataset.luxuryRevealBound === "true") return;
    node.dataset.luxuryRevealBound = "true";
    node.classList.add("luxury-reveal");
    node.style.setProperty("--reveal-delay", `${Math.min((index % 8) * 70, 420)}ms`);
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    nodes.filter((node) => !node.classList.contains("is-visible")).forEach((node) => observer.observe(node));
  } else {
    nodes.forEach((node) => node.classList.add("is-visible"));
  }

  const glowSelector = document.body.classList.contains("checkout-page")
    ? ".product-card, .plan-option, .payment-panel, .payment-method"
    : ".product-card, .plan-option, .checkout-card, .checkout-summary-card, .payment-panel, .payment-method, .button";
  const glowTargets = document.querySelectorAll(glowSelector);
  glowTargets.forEach((node) => {
    if (node.dataset.luxuryGlowBound === "true") return;
    node.dataset.luxuryGlowBound = "true";
    node.addEventListener("pointermove", (event) => {
      const rect = node.getBoundingClientRect();
      node.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      node.style.setProperty("--my", `${event.clientY - rect.top}px`);
    });
  });
}

window.renderAccountSections = renderAccountSections;
window.iconSvg = iconSvg;
window.getCart = getCart;
window.openCartDrawer = openCartDrawer;
window.HKDigitalStoreLocalProducts = products;
window.showToast = showToast;
window.HKDigitalStoreInitLuxuryExperience = initLuxuryExperience;

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  ensureAuthModal();
  updateAuthNav();
  ensureStoreCategoryRail();
  enhanceStoreFooter();
  initNav();
  initProductLists();
  initProductDetail();
  initCart();
  initPaymentMethodSelection();
  initOrderForm();
  initPaymentPage();
  initStandaloneAuthPages();
  bindAddCartButtons();
  bindBuyNowButtons();
  initLuxuryExperience();
});

window.addEventListener("hk-auth-change", refreshCheckoutFormAfterAuth);
