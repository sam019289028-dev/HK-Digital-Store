const orderStatusPendingPayment = "待付款";
const orderIdStorageKey = "hkDigitalStoreLastOrderId";
const orderPaymentSessionKey = "hkDigitalStorePaymentSession";
const orderCartKey = "hkDigitalStoreCart";
const orderScreenshotBucket = "payment-screenshots";

function getSupabaseOrdersClient() {
  return window.supabaseClient || null;
}

async function getSupabaseOrderUser() {
  if (window.hkSupabaseAuth && typeof window.hkSupabaseAuth.getCurrentUser === "function") {
    return window.hkSupabaseAuth.getCurrentUser();
  }

  const client = getSupabaseOrdersClient();
  if (!client) return null;

  const { data, error } = await client.auth.getUser();
  if (error) return null;
  return data && data.user ? data.user : null;
}

function getOrderPaymentSession() {
  const fallback = {
    amount: 158,
    method: "FPS",
    productName: getCartProductName() || "待確認商品"
  };

  try {
    const session = JSON.parse(sessionStorage.getItem(orderPaymentSessionKey) || "null")
      || JSON.parse(localStorage.getItem(orderPaymentSessionKey) || "null")
      || {};
    return {
      ...fallback,
      ...session,
      productName: session.productName || getCartProductName() || fallback.productName
    };
  } catch (error) {
    return fallback;
  }
}

function getCartProductName() {
  try {
    const cart = JSON.parse(localStorage.getItem(orderCartKey) || "[]");
    if (!Array.isArray(cart) || !cart.length) return "";
    const firstName = cart[0].name || cart[0].productName || "待確認商品";
    return cart.length > 1 ? `${firstName} 等 ${cart.length} 件商品` : firstName;
  } catch (error) {
    return "";
  }
}

function formatOrderMoney(amount) {
  return `HK$${(Number(amount) || 0).toFixed(2)}`;
}

function formatOrderDate(value) {
  if (!value) return "未有日期";
  try {
    return new Intl.DateTimeFormat("zh-HK", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(value));
  } catch (error) {
    return value;
  }
}

function getOrderErrorText(error) {
  if (!error) return "未知錯誤";
  const parts = [error.message, error.details, error.hint, error.code].filter(Boolean);
  return parts.join(" / ");
}

function getCheckoutField(session, name) {
  const checkout = session && session.checkout ? session.checkout : {};
  return String(checkout[name] || "").trim();
}

function buildOrderAdminNote(session) {
  session = session || {};
  const checkout = session && session.checkout ? session.checkout : {};
  const lines = [
    `電郵地址: ${checkout.email || ""}`,
    `WhatsApp: ${checkout.contact_value || ""}`,
    `付款方式: ${checkout.payment_method || session.method || ""}`,
    `綁定電郵: ${checkout.bind_email || ""}`,
    `訂單備註: ${checkout.note || ""}`
  ];

  if (Array.isArray(session.items) && session.items.length) {
    lines.push("購物車內容:");
    session.items.forEach((item) => {
      lines.push(`- ${item.productName || "商品"} / ${item.plan || "方案"} / x${item.quantity || 1} / HK$${item.total || item.unitPrice || 0}`);
    });
  }

  return lines.filter((line) => !line.endsWith(": ")).join("\n");
}

function escapeOrderHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getOrderResumeProducts() {
  const sources = [
    window.hkSupabaseProducts,
    window.HKDigitalStoreLocalProducts
  ].filter(Array.isArray);

  try {
    const cachedProducts = JSON.parse(localStorage.getItem("hkDigitalStoreProductCache") || "[]");
    if (Array.isArray(cachedProducts)) sources.push(cachedProducts);
  } catch (error) {
    console.warn("Product cache unavailable", error);
  }

  return sources.flat().filter(Boolean);
}

function normalizeOrderProductText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[()（）[\]【】.,，:：;；|/\\-]/g, "");
}

function getOrderProductTokens(productName) {
  return String(productName || "")
    .split(/[、,+，]/)
    .map((token) => token.replace(/\bx\s*\d+\b/i, "").trim())
    .filter(Boolean);
}

function findOrderProductByName(token) {
  const normalizedToken = normalizeOrderProductText(token);
  if (!normalizedToken) return null;

  const products = getOrderResumeProducts();
  const directMatch = products.find((product) => {
    const normalizedName = normalizeOrderProductText(product.name);
    return normalizedName && (
      normalizedName === normalizedToken
      || normalizedToken.includes(normalizedName)
      || normalizedName.includes(normalizedToken)
    );
  });
  if (directMatch) return directMatch;

  const fallbackIds = {
    chatgpt: "chatgpt-subscription",
    claude: "claude-subscription",
    gemini: "gemini-subscription",
    grok: "grok-subscription",
    perplexity: "perplexity-subscription",
    netflix: "netflix-subscription",
    spotify: "spotify-subscription",
    youtube: "youtube-subscription",
    canva: "canva-subscription"
  };
  const fallbackKey = Object.keys(fallbackIds).find((key) => normalizedToken.includes(key));
  if (fallbackKey) {
    return getOrderResumeProducts().find((product) => product.id === fallbackIds[fallbackKey]) || null;
  }

  return null;
}

function buildCartFromOrder(order) {
  const tokens = getOrderProductTokens(order.product_name);
  if (!tokens.length) return [];

  const amount = Number(order.amount_hkd) || 0;
  const fallbackPrice = tokens.length && amount ? Math.round((amount / tokens.length) * 100) / 100 : 0;

  return tokens.map((token) => {
    const product = findOrderProductByName(token);
    if (!product) return null;

    return {
      id: product.id,
      plan: token,
      price: fallbackPrice || product.price || product.price_hkd || 0,
      region: product.region || "",
      usage: null
    };
  }).filter(Boolean);
}

function isOrderPendingPayment(order) {
  return String(order.status || orderStatusPendingPayment).trim() === orderStatusPendingPayment;
}

function resumeOrderInCart(order) {
  const cart = buildCartFromOrder(order);
  if (!cart.length) {
    if (window.showToast) window.showToast("未能還原這張訂單，請重新選擇商品。");
    window.location.href = "products.html";
    return;
  }

  localStorage.setItem(orderCartKey, JSON.stringify(cart));
  sessionStorage.setItem(orderPaymentSessionKey, JSON.stringify({
    amount: Number(order.amount_hkd) || cart.reduce((sum, item) => sum + (Number(item.price) || 0), 0),
    productName: order.product_name || getCartProductName(),
    method: "FPS",
    resumedOrderId: order.id || "",
    resumedAt: new Date().toISOString()
  }));
  window.location.href = "cart.html";
}

function bindResumePendingOrderCards() {
  document.querySelectorAll("[data-resume-order]").forEach((card) => {
    if (card.dataset.resumeBound === "true") return;
    card.dataset.resumeBound = "true";
    card.addEventListener("click", (event) => {
      if (event.target.closest("a, button")) return;
      resumeOrderInCart(JSON.parse(card.dataset.resumeOrder || "{}"));
    });
    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      resumeOrderInCart(JSON.parse(card.dataset.resumeOrder || "{}"));
    });
  });
}

async function getOrderScreenshotUrl(path) {
  const client = getSupabaseOrdersClient();
  if (!client || !path) return "";

  const { data, error } = await client.storage
    .from(orderScreenshotBucket)
    .createSignedUrl(path, 60 * 10);

  if (error) {
    console.warn("Payment screenshot signed URL failed", error);
    return "";
  }

  return data && data.signedUrl ? data.signedUrl : "";
}

function renderOrderAuthGate(title, description) {
  return `
    <div class="cart-empty-state auth-gate">
      <div class="empty-icon">HD</div>
      <h3>${title}</h3>
      <p>${description}</p>
      <div class="auth-gate-actions">
        <a class="button primary" href="login.html">登入</a>
        <a class="button ghost" href="register.html">建立帳戶</a>
      </div>
    </div>
  `;
}

function renderOrderTabs(active) {
  return `
    <div class="account-page-tabs">
      <a class="${active === "account" ? "active" : ""}" href="account.html">我的帳戶</a>
      <a class="${active === "orders" ? "active" : ""}" href="order-history.html">訂購紀錄</a>
      <a class="${active === "recent" ? "active" : ""}" href="recent-viewed.html">最近瀏覽</a>
      <button type="button" data-supabase-logout>登出</button>
    </div>
  `;
}

async function renderOrderRows(orders) {
  if (!orders.length) {
    return `
      <div class="cart-empty-state account-empty-state">
        <div class="empty-icon">HD</div>
        <h3>暫時沒有訂購紀錄</h3>
        <p>提交訂單後，客服跟進的狀態會在這裡顯示。</p>
        <a class="button primary" href="products.html">去看看商品</a>
      </div>
    `;
  }

  const rows = await Promise.all(orders.map(async (order) => {
    const screenshotPath = order.payment_screenshot_url || "";
    const signedUrl = screenshotPath ? await getOrderScreenshotUrl(screenshotPath) : "";
    const canResume = isOrderPendingPayment(order);
    const resumePayload = escapeOrderHtml(JSON.stringify({
      id: order.id || "",
      product_name: order.product_name || "",
      amount_hkd: order.amount_hkd || 0,
      status: order.status || orderStatusPendingPayment
    }));
    const screenshotBlock = screenshotPath
      ? `
        <strong class="order-status">已提交</strong>
        ${signedUrl ? `<a class="order-screenshot-link" href="${signedUrl}" target="_blank" rel="noopener">查看截圖</a>` : `<small>暫時未能建立查看連結</small>`}
      `
      : `<strong>未上傳</strong>`;

    return `
      <article class="order-record-card${canResume ? " is-resumable" : ""}" ${canResume ? `role="button" tabindex="0" data-resume-order="${resumePayload}" aria-label="返回購物車處理待付款訂單"` : ""}>
        <div>
          <span>商品名稱</span>
          <strong>${escapeOrderHtml(order.product_name || "待確認商品")}</strong>
        </div>
        <div>
          <span>金額</span>
          <strong>${formatOrderMoney(order.amount_hkd)}</strong>
        </div>
        <div>
          <span>狀態</span>
          <strong class="order-status">${escapeOrderHtml(order.status || orderStatusPendingPayment)}</strong>
        </div>
        <div>
          <span>建立時間</span>
          <strong>${formatOrderDate(order.created_at)}</strong>
        </div>
        <div>
          <span>付款截圖狀態</span>
          ${screenshotBlock}
        </div>
      </article>
    `;
  }));

  return `
    <div class="orders-list">
      ${rows.join("")}
    </div>
  `;
}

async function fetchCurrentUserOrders() {
  const client = getSupabaseOrdersClient();
  if (!client) {
    throw new Error("Supabase 尚未載入，請檢查 supabase-config.js。");
  }

  const user = await getSupabaseOrderUser();
  if (!user) {
    return { user: null, orders: [] };
  }

  const { data, error } = await client
    .from("orders")
    .select("id, product_name, amount_hkd, status, created_at, payment_screenshot_url")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return { user, orders: data || [] };
}

async function renderAccountOrdersPanel() {
  const panel = document.querySelector("[data-account-panel]");
  if (!panel) return;

  panel.innerHTML = `<article class="panel account-wide-card"><p>正在讀取帳戶資料...</p></article>`;

  try {
    const { user, orders } = await fetchCurrentUserOrders();
    if (!user) {
      panel.innerHTML = renderOrderAuthGate("請先登入", "登入後可以查看帳戶資料和自己的訂單紀錄。");
      bindSupabaseOrderLogout();
      return;
    }

    panel.innerHTML = `
      <article class="panel account-wide-card">
        ${renderOrderTabs("account")}
        <div class="account-profile-card">
          <p class="eyebrow">My Account</p>
          <h2>${user.email}</h2>
          <p>${user.email}</p>
          <div class="account-actions">
            <a class="button primary" href="cart.html">查看購物車</a>
          </div>
        </div>
        <div class="account-orders-block">
          <div class="section-heading compact-heading">
            <p class="eyebrow">Orders</p>
            <h2>最近訂單</h2>
          </div>
          ${await renderOrderRows(orders.slice(0, 5))}
        </div>
      </article>
    `;
    bindResumePendingOrderCards();
    bindSupabaseOrderLogout();
  } catch (error) {
    panel.innerHTML = `
      <article class="panel account-wide-card">
        ${renderOrderTabs("account")}
        <div class="order-error-card">
          <h3>訂單載入失敗</h3>
          <p>${getOrderErrorText(error)}</p>
        </div>
      </article>
    `;
    bindSupabaseOrderLogout();
  }
}

async function renderOrderHistoryPanel() {
  const panel = document.querySelector("[data-order-history-panel]");
  if (!panel) return;

  panel.innerHTML = `<article class="panel account-wide-card"><p>正在讀取訂購紀錄...</p></article>`;

  try {
    const { user, orders } = await fetchCurrentUserOrders();
    if (!user) {
      panel.innerHTML = renderOrderAuthGate("請先登入", "登入後可以查看自己的訂購紀錄。");
      bindSupabaseOrderLogout();
      return;
    }

    panel.innerHTML = `
      <article class="panel account-wide-card">
        ${renderOrderTabs("orders")}
        <div class="section-heading compact-heading">
          <p class="eyebrow">Order History</p>
          <h2>我的訂購紀錄</h2>
        </div>
        ${await renderOrderRows(orders)}
      </article>
    `;
    bindResumePendingOrderCards();
    bindSupabaseOrderLogout();
  } catch (error) {
    panel.innerHTML = `
      <article class="panel account-wide-card">
        ${renderOrderTabs("orders")}
        <div class="order-error-card">
          <h3>訂購紀錄載入失敗</h3>
          <p>${getOrderErrorText(error)}</p>
        </div>
      </article>
    `;
    bindSupabaseOrderLogout();
  }
}

function renderSupabaseAccountSections() {
  renderAccountOrdersPanel();
  renderOrderHistoryPanel();
}

function bindSupabaseOrderLogout() {
  document.querySelectorAll("[data-supabase-logout]").forEach((button) => {
    if (button.dataset.bound) return;
    button.dataset.bound = "true";
    button.addEventListener("click", async () => {
      if (window.hkSupabaseAuth && typeof window.hkSupabaseAuth.logout === "function") {
        await window.hkSupabaseAuth.logout();
      } else if (window.supabaseClient) {
        await window.supabaseClient.auth.signOut();
      }
      window.location.href = "index.html";
    });
  });
}

function fillPaymentOrderSummary() {
  const session = getOrderPaymentSession();
  document.querySelectorAll("[data-order-product-name]").forEach((node) => {
    node.textContent = session.productName || "待確認商品";
  });
  document.querySelectorAll("[data-order-amount]").forEach((node) => {
    node.textContent = formatOrderMoney(session.amount || 158);
  });
}

async function initSupabaseOrderForm() {
  const form = document.querySelector("[data-supabase-order-form]");
  if (!form) return;

  fillPaymentOrderSummary();

  const result = document.querySelector("[data-order-submit-result]");
  const submit = form.querySelector("[data-submit-order]");
  const user = await getSupabaseOrderUser();

  if (!user) {
    if (result) result.textContent = "請先登入後再提交訂單。";
    if (submit) submit.disabled = true;
    return;
  }

  const existingOrderId = sessionStorage.getItem(orderIdStorageKey) || localStorage.getItem(orderIdStorageKey);
  if (existingOrderId) {
    if (result) result.textContent = "訂單已提交，可直接上傳付款截圖。";
    if (submit) {
      submit.disabled = true;
      submit.textContent = "已提交訂單";
    }
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const client = getSupabaseOrdersClient();
    if (!client) {
      if (result) result.textContent = "Supabase 尚未載入，暫時不能提交訂單。";
      return;
    }

    const session = getOrderPaymentSession();
    const customerName = form.customer_name
      ? form.customer_name.value.trim()
      : getCheckoutField(session, "customer_name") || getCheckoutField(session, "email") || user.email || "";
    const contactMethod = form.contact_method
      ? form.contact_method.value
      : getCheckoutField(session, "contact_method") || "WhatsApp";
    const contactValue = form.contact_value
      ? form.contact_value.value.trim()
      : getCheckoutField(session, "contact_value");

    if (!customerName || !contactValue) {
      if (result) result.textContent = "找不到上一頁的聯絡資料，請返回購物車重新填寫。";
      return;
    }

    const payload = {
      user_id: user.id,
      customer_name: customerName,
      contact_method: contactMethod,
      contact_value: contactValue,
      product_name: session.productName || "待確認商品",
      amount_hkd: Number(session.amount) || 158,
      status: orderStatusPendingPayment,
      admin_note: buildOrderAdminNote(session)
    };

    if (submit) {
      submit.disabled = true;
      submit.textContent = "提交中...";
    }
    if (result) result.textContent = "";

    const { data, error } = await client
      .from("orders")
      .insert(payload)
      .select("id")
      .single();

    if (error) {
      if (result) result.textContent = `訂單提交失敗：${getOrderErrorText(error)}`;
      if (submit) {
        submit.disabled = false;
        submit.textContent = "提交訂單";
      }
      return;
    }

    if (data && data.id) {
      sessionStorage.setItem(orderIdStorageKey, data.id);
      localStorage.setItem(orderIdStorageKey, data.id);
    }

    if (result) result.textContent = `訂單已提交，訂單編號：${data && data.id ? data.id : "已建立"}`;
    if (submit) {
      submit.textContent = "已提交";
      submit.disabled = true;
    }

    if (window.showToast) {
      window.showToast("訂單已提交");
    }

    if (window.hkPaymentUpload && typeof window.hkPaymentUpload.show === "function") {
      window.hkPaymentUpload.show(data && data.id ? data.id : "");
    }

    document.dispatchEvent(new CustomEvent("hk-order-created", {
      detail: {
        orderId: data && data.id ? data.id : ""
      }
    }));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initSupabaseOrderForm();
  renderSupabaseAccountSections();
});

window.addEventListener("hk-auth-change", () => {
  renderSupabaseAccountSections();
});

window.renderAccountSections = renderSupabaseAccountSections;
