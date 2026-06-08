const productCacheKey = "hkDigitalStoreProductCache";
const paymentSessionKeyForProducts = "hkDigitalStorePaymentSession";

function getDefaultProductIcon(product) {
  const identity = `${product?.name || ""} ${product?.category || ""} ${product?.type || ""}`.toLowerCase();
  const isXProduct = /(^|[\s/|+·,，:：-])x($|[\s/|+·,，:：-]|premium|平台|pro|訂閱|会员|會員)/i.test(identity)
    || identity.includes("twitter");
  if (identity.includes("chatgpt")) return "assets/chatgpt-icon.svg";
  if (identity.includes("claude")) return "assets/claude-icon.svg";
  if (identity.includes("gemini")) return "assets/gemini-icon.svg";
  if (identity.includes("grok")) return "assets/grok-icon.svg";
  if (identity.includes("spotify")) return "assets/spotify-icon.svg";
  if (identity.includes("youtube")) return "assets/youtube-icon.svg";
  if (identity.includes("perplexity")) return "assets/perplexity-icon.svg";
  if (identity.includes("netflix")) return "assets/netflix-icon.svg";
  if (isXProduct) return "assets/x-icon.svg";
  if (identity.includes("canva")) return "assets/canva-icon.svg";
  return "";
}

function normalizeSupabaseProduct(row) {
  const name = row.name || "未命名商品";
  const category = row.category || "數碼商品";
  const price = Number(row.price_hkd) || 0;
  const fallbackVisual = "visual-chatgpt";
  const imageUrl = row.image_url && String(row.image_url).trim().toUpperCase() !== "EMPTY"
    ? String(row.image_url).trim()
    : "";

  return {
    id: String(row.id || name.toLowerCase().replace(/\s+/g, "-")),
    name,
    type: category,
    category,
    price,
    price_hkd: price,
    region: row.region || "下單前確認",
    delivery: row.delivery || "客服確認後提供交付安排",
    badge: row.badge || category,
    visual: row.visual || fallbackVisual,
    image: imageUrl,
    icon: getDefaultProductIcon({ name, category }) || imageUrl,
    tags: Array.isArray(row.tags) && row.tags.length ? row.tags : ["需確認地區", "售後跟進"],
    plans: Array.isArray(row.plans) && row.plans.length ? row.plans : ["1個月", "3個月", "12個月"],
    afterSales: row.after_sales || "客服會協助確認地區、方案和交付安排。",
    featured: true,
    description: row.description || "下單前可先確認地區、方案和交付方式。"
  };
}

function saveProductCache(products) {
  window.hkSupabaseProducts = products;
  try {
    localStorage.setItem(productCacheKey, JSON.stringify(products));
  } catch (error) {
    console.warn("Product cache save failed", error);
  }
}

function formatProductPrice(price) {
  return `HK$${Number(price || 0)} 起`;
}

function isProductUserLoggedIn() {
  return Boolean(window.hkSupabaseAuth?.getCachedUser?.());
}

function requireProductLogin() {
  if (isProductUserLoggedIn()) return true;
  if (window.showToast) {
    window.showToast("請先登入後再繼續");
  }
  window.setTimeout(() => {
    window.location.href = "login.html";
  }, 650);
  return false;
}

function productImageMarkup(product) {
  if (!product.image) {
    return `
      <span class="product-art-label">${product.type}</span>
      <strong>${product.name}</strong>
      <small>${product.badge}</small>
    `;
  }

  return `
    <img src="${product.image}" alt="${product.name}" loading="lazy">
    <span class="product-art-label">${product.type}</span>
  `;
}

function supabaseProductCard(product) {
  const cardTags = Array.from(new Set([...(product.tags || []), "售後跟進"]));
  return `
    <article class="product-card ${product.visual}" data-supabase-product-card="${product.id}">
      <div class="product-art ${product.image ? "has-product-image" : ""}">
        ${productImageMarkup(product)}
        <span class="product-stock-badge">可查詢</span>
      </div>
      <div class="product-card-body">
        <div class="product-card-title-row">
          <div>
            <span class="product-card-type">${product.type}</span>
            <h3>${product.name}</h3>
          </div>
          <div class="price">${formatProductPrice(product.price)}</div>
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

function supabaseFeaturedProductCard(product) {
  const icon = product.icon || getDefaultProductIcon(product);
  const fallback = String(product.name || "?").trim().slice(0, 1);
  return `
    <article class="product-card featured-logo-card ${product.visual}" data-supabase-product-card="${product.id}">
      <a class="featured-logo-link" href="product.html?id=${product.id}" aria-label="查看 ${product.name} 方案">
        <div class="featured-logo-mark">
          ${icon ? `<img src="${icon}" alt="${product.name}" loading="lazy" onerror="this.replaceWith(document.createTextNode('${fallback}'))">` : `<span>${fallback}</span>`}
        </div>
        <div class="featured-logo-footer">
          <span class="featured-logo-price">${formatProductPrice(product.price)}</span>
          <span class="featured-logo-action">查看方案</span>
        </div>
      </a>
    </article>
  `;
}

function renderSupabaseProducts(target, products) {
  if (!target) return;
  const countNode = document.querySelector("[data-product-count]");
  if (countNode) {
    countNode.textContent = products.length ? `顯示 ${products.length} 件商品` : "沒有符合條件的商品";
  }
  target.innerHTML = products.length
    ? products.map(supabaseFeaturedProductCard).join("")
    : `
      <div class="cart-empty-state product-empty-state">
        <div class="empty-icon">HD</div>
        <h3>暫時沒有可顯示商品</h3>
        <p>請稍後再查看，或先聯絡客服確認需要的商品。</p>
        <a class="button primary" href="contact.html">聯絡客服</a>
      </div>
    `;
}

function renderSupabaseFeaturedProducts(target, products) {
  if (!target) return;
  target.innerHTML = products.length
    ? products.map(supabaseFeaturedProductCard).join("")
    : "";
}

function renderSupabaseProductLoading(target, count = 6) {
  if (!target) return;
  const countNode = document.querySelector("[data-product-count]");
  if (countNode) {
    countNode.textContent = "正在整理熱門方案";
  }
  target.innerHTML = `
    <div class="product-loading-grid" aria-label="商品載入中">
      ${Array.from({ length: count }).map(() => `
        <article class="product-card product-skeleton" aria-hidden="true">
          <div class="product-art"></div>
          <div class="product-card-body">
            <span></span>
            <strong></strong>
            <p></p>
            <div></div>
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function formatSupabaseError(error) {
  if (!error) return "未知錯誤";
  if (typeof error === "string") return error;
  return [
    error.message,
    error.details,
    error.hint,
    error.code ? `code: ${error.code}` : ""
  ].filter(Boolean).join(" | ") || JSON.stringify(error);
}

function renderSupabaseProductError(target, error) {
  if (!target) return;
  target.innerHTML = `
    <div class="cart-empty-state product-empty-state">
      <div class="empty-icon">HD</div>
      <h3>商品暫時未能載入</h3>
      <p>請稍後再試，或先聯絡客服查詢需要的方案。</p>
      <small class="product-load-error">${formatSupabaseError(error)}</small>
    </div>
  `;
}

async function loadSupabaseProducts(limit) {
  if (!window.supabaseClient) {
    throw new Error("找不到 supabaseClient，請確認 supabase-config.js 已在 products.js 之前載入。");
  }

  console.info("[products] 正在讀取 Supabase products");
  console.info("[products] Supabase URL exists:", Boolean(window.SUPABASE_URL));
  console.info("[products] Supabase key starts with sb_publishable_:", String(window.SUPABASE_PUBLISHABLE_KEY || "").startsWith("sb_publishable_"));

  const query = window.supabaseClient
    .from("products")
    .select("id,name,category,description,price_hkd,image_url,is_active")
    .eq("is_active", true);

  if (limit) query.limit(limit);

  const { data, error } = await query;
  if (error) {
    console.error("[products] Supabase query error:", error);
    throw error;
  }

  console.info("[products] Supabase returned data:", data);
  console.info("[products] Supabase product count:", data?.length || 0);

  const normalized = (data || []).map(normalizeSupabaseProduct);
  return normalized;
}

function bindSupabaseProductActions() {
  document.querySelectorAll("[data-supabase-product-card] .button").forEach((button) => {
    button.addEventListener("click", () => {
      saveProductCache(window.hkSupabaseProducts || []);
    });
  });
}

function getProductSearchText() {
  return (document.querySelector("[data-product-search]")?.value || "").trim().toLowerCase();
}

const productCategoryAliases = [
  {
    group: "AI 工具",
    terms: ["AI 工具", "人工智能", "chatgpt", "openai", "claude", "gemini", "grok", "perplexity", "copilot", "midjourney"]
  },
  {
    group: "影音串流",
    terms: ["影音串流", "串流平台", "串流娛樂", "影音娛樂", "娛樂", "netflix", "youtube", "spotify", "disney", "hbo", "prime video", "apple tv", "music"]
  },
  {
    group: "社交平台",
    terms: ["社交平台", "社交", "social", "twitter", "x premium", "instagram", "facebook", "telegram", "discord"]
  },
  {
    group: "辦公軟件",
    terms: ["辦公軟件", "辦公", "office", "microsoft", "365", "windows", "防毒", "antivirus", "software"]
  },
  {
    group: "設計軟件",
    terms: ["設計軟件", "設計", "adobe", "photoshop", "illustrator", "canva", "capcut", "剪片", "creative"]
  },
  {
    group: "蘋果專區",
    terms: ["蘋果專區", "蘋果", "apple", "icloud", "app store", "itunes", "apple one"]
  }
];

function normalizeProductText(value) {
  return String(value || "").toLowerCase().replace(/\s+/g, "");
}

function getCanonicalProductFilter(filter) {
  if (!filter || filter === "all") return "all";
  const normalized = normalizeProductText(filter);
  const match = productCategoryAliases.find(({ group, terms }) => (
    normalizeProductText(group) === normalized ||
    terms.some((term) => {
      const normalizedTerm = normalizeProductText(term);
      return normalized === normalizedTerm || normalized.includes(normalizedTerm);
    })
  ));
  return match?.group || filter;
}

function getProductCategoryText(product) {
  return [
    product.name,
    product.type,
    product.category,
    product.description,
    product.badge,
    ...(product.tags || [])
  ].filter(Boolean).join(" ");
}

function getProductCategoryGroup(product) {
  const haystack = normalizeProductText(getProductCategoryText(product));
  const match = productCategoryAliases.find(({ terms }) => (
    terms.some((term) => haystack.includes(normalizeProductText(term)))
  ));
  return match?.group || product.type || product.category || "";
}

function productMatchesCategoryFilter(product, filter) {
  const canonicalFilter = getCanonicalProductFilter(filter);
  if (canonicalFilter === "all") return true;
  if (getProductCategoryGroup(product) === canonicalFilter) return true;
  return normalizeProductText(getProductCategoryText(product)).includes(normalizeProductText(canonicalFilter));
}

function updateProductFilterAvailability(products) {
  document.querySelectorAll("[data-filter]").forEach((button) => {
    const filter = getCanonicalProductFilter(button.dataset.filter);
    const hasProducts = filter === "all" || products.some((product) => productMatchesCategoryFilter(product, filter));
    button.hidden = !hasProducts;
    if (!hasProducts) button.classList.remove("active");
  });
}

function getActiveProductFilter() {
  return getCanonicalProductFilter(document.querySelector("[data-filter].active")?.dataset.filter || "all");
}

function applySupabaseProductDiscovery(products) {
  const target = document.querySelector("[data-product-list]");
  const filter = getActiveProductFilter();
  const search = getProductSearchText();
  const filtered = products.filter((product) => {
    const matchesFilter = productMatchesCategoryFilter(product, filter);
    const haystack = [
      product.name,
      product.type,
      product.category,
      product.description,
      product.region,
      product.delivery,
      product.badge,
      ...(product.tags || [])
    ].join(" ").toLowerCase();
    return matchesFilter && (!search || haystack.includes(search));
  });

  renderSupabaseProducts(target, filtered);
  bindSupabaseProductActions();
  window.HKDigitalStoreInitLuxuryExperience?.();
}

function bindSupabaseProductDiscovery(products) {
  updateProductFilterAvailability(products);

  const params = new URLSearchParams(window.location.search);
  const requestedCategory = params.get("category");
  const requestedSearch = params.get("search");
  if (requestedCategory) {
    const canonicalRequestedCategory = getCanonicalProductFilter(requestedCategory);
    document.querySelectorAll("[data-filter]").forEach((button) => {
      button.classList.toggle("active", getCanonicalProductFilter(button.dataset.filter) === canonicalRequestedCategory);
    });
    if (!document.querySelector("[data-filter].active")) {
      document.querySelector('[data-filter="all"]')?.classList.add("active");
    }
  }

  document.querySelectorAll("[data-filter]").forEach((button) => {
    if (button.dataset.supabaseFilterBound === "true") return;
    button.dataset.supabaseFilterBound = "true";

    button.addEventListener("click", () => {
      document.querySelectorAll("[data-filter]").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      applySupabaseProductDiscovery(products);
    });
  });

  const searchInput = document.querySelector("[data-product-search]");
  if (searchInput && requestedSearch && !searchInput.value) {
    searchInput.value = requestedSearch;
  }

  if (searchInput && searchInput.dataset.supabaseSearchBound !== "true") {
    searchInput.dataset.supabaseSearchBound = "true";
    searchInput.addEventListener("input", () => applySupabaseProductDiscovery(products));
  }
}

async function initSupabaseProductSections() {
  const productListTarget = document.querySelector("[data-product-list]");
  const featuredTarget = document.querySelector("[data-featured-products]");
  if (!productListTarget && !featuredTarget) return;

  renderSupabaseProductLoading(productListTarget, 6);
  renderSupabaseProductLoading(featuredTarget, 3);

  let allProducts = [];
  try {
    allProducts = await loadSupabaseProducts();
    saveProductCache(allProducts);
  } catch (error) {
    console.warn("Supabase products load failed", error);
    renderSupabaseProductError(productListTarget, error);
    renderSupabaseProductError(featuredTarget, error);
    return;
  }

  if (productListTarget) {
    bindSupabaseProductDiscovery(allProducts);
    applySupabaseProductDiscovery(allProducts);
  }

  if (featuredTarget) {
    renderSupabaseFeaturedProducts(featuredTarget, allProducts.slice(0, 3));
  }

  bindSupabaseProductActions();
}

document.addEventListener("DOMContentLoaded", initSupabaseProductSections);
