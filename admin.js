const adminOrderStatuses = ["待付款", "已付款", "處理中", "已完成", "已取消"];
const adminScreenshotBucket = "payment-screenshots";

function getAdminClient() {
  return window.supabaseClient || null;
}

async function getAdminUser() {
  if (window.hkSupabaseAuth && typeof window.hkSupabaseAuth.getCurrentUser === "function") {
    return window.hkSupabaseAuth.getCurrentUser();
  }

  const client = getAdminClient();
  if (!client) return null;
  const { data, error } = await client.auth.getUser();
  if (error) return null;
  return data && data.user ? data.user : null;
}

function adminErrorText(error) {
  if (!error) return "未知錯誤";
  return [error.message, error.details, error.hint, error.code].filter(Boolean).join(" / ");
}

function adminEscape(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function adminMoney(amount) {
  return `HK$${(Number(amount) || 0).toFixed(2)}`;
}

function adminDate(value) {
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

function renderAdminAccessDenied() {
  const shell = document.querySelector("[data-admin-shell]");
  if (!shell) return;
  shell.innerHTML = `
    <article class="panel admin-access-card">
      <div class="empty-icon">HD</div>
      <h2>無權限訪問</h2>
      <p>這個頁面只限管理員帳號使用。</p>
      <a class="button primary" href="index.html">返回首頁</a>
    </article>
  `;
}

function renderAdminError(title, message) {
  const shell = document.querySelector("[data-admin-shell]");
  if (!shell) return;
  shell.innerHTML = `
    <article class="panel admin-access-card admin-error-card">
      <h2>${adminEscape(title)}</h2>
      <p>${adminEscape(message)}</p>
      <a class="button ghost" href="index.html">返回首頁</a>
    </article>
  `;
}

async function checkIsAdmin(user) {
  const client = getAdminClient();
  if (!client) throw new Error("Supabase 尚未載入，請重新整理頁面。");

  const possibleUidColumns = ["user_id", "uid", "auth_user_id", "profile_id", "id"];
  let lastError = null;

  for (const column of possibleUidColumns) {
    const { data, error } = await client
      .from("admin_users")
      .select(column)
      .eq(column, user.id)
      .maybeSingle();

    if (!error) return Boolean(data);

    lastError = error;
    const message = `${error.message || ""} ${error.code || ""}`;
    const isMissingColumn = message.includes("does not exist") || error.code === "42703";
    if (!isMissingColumn) throw error;
  }

  throw lastError || new Error("找不到 admin_users 內可用的管理員 UID 欄位。");
}

async function getAdminScreenshotUrl(path) {
  const client = getAdminClient();
  if (!client || !path) return "";

  const { data, error } = await client.storage
    .from(adminScreenshotBucket)
    .createSignedUrl(path, 60 * 10);

  if (error) {
    console.warn("Admin screenshot signed URL failed", error);
    return "";
  }

  return data && data.signedUrl ? data.signedUrl : "";
}

async function fetchAdminOrders() {
  const client = getAdminClient();
  if (!client) throw new Error("Supabase 尚未載入，請重新整理頁面。");

  const { data, error } = await client
    .from("orders")
    .select("id, customer_name, contact_method, contact_value, product_name, amount_hkd, status, payment_screenshot_url, created_at, admin_note")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

function renderStatusOptions(currentStatus) {
  return adminOrderStatuses.map((status) => `
    <option value="${adminEscape(status)}" ${status === currentStatus ? "selected" : ""}>${adminEscape(status)}</option>
  `).join("");
}

async function renderAdminOrders() {
  const shell = document.querySelector("[data-admin-shell]");
  if (!shell) return;

  shell.innerHTML = `
    <article class="panel admin-loading-card">
      <p>正在讀取訂單...</p>
    </article>
  `;

  try {
    const orders = await fetchAdminOrders();
    if (!orders.length) {
      shell.innerHTML = `
        <article class="panel admin-access-card">
          <div class="empty-icon">HD</div>
          <h2>暫時沒有訂單</h2>
          <p>客戶提交訂單後，會在這裡顯示。</p>
        </article>
      `;
      return;
    }

    const cards = await Promise.all(orders.map(async (order) => {
      const screenshotUrl = order.payment_screenshot_url
        ? await getAdminScreenshotUrl(order.payment_screenshot_url)
        : "";
      const shortId = String(order.id || "").slice(0, 8);
      const screenshotBlock = order.payment_screenshot_url
        ? screenshotUrl
          ? `<a class="button ghost admin-shot-button" href="${screenshotUrl}" target="_blank" rel="noopener">查看截圖</a>`
          : `<span class="admin-muted">截圖連結建立失敗</span>`
        : `<span class="admin-muted">未提交</span>`;

      return `
        <article class="admin-order-card" data-admin-order-card data-order-id="${adminEscape(order.id)}">
          <div class="admin-order-top">
            <div>
              <span>訂單 ID</span>
              <strong>${adminEscape(shortId || "未有 ID")}</strong>
            </div>
            <div>
              <span>建立時間</span>
              <strong>${adminDate(order.created_at)}</strong>
            </div>
            <div>
              <span>金額</span>
              <strong class="admin-price">${adminMoney(order.amount_hkd)}</strong>
            </div>
          </div>

          <div class="admin-order-grid">
            <div>
              <span>客戶名稱</span>
              <strong>${adminEscape(order.customer_name || "未填寫")}</strong>
            </div>
            <div>
              <span>聯絡方式</span>
              <strong>${adminEscape(order.contact_method || "未填寫")}</strong>
              <small>${adminEscape(order.contact_value || "")}</small>
            </div>
            <div>
              <span>商品名稱</span>
              <strong>${adminEscape(order.product_name || "待確認商品")}</strong>
            </div>
            <div>
              <span>付款截圖</span>
              ${screenshotBlock}
            </div>
          </div>

          <form class="admin-order-form" data-admin-order-form>
            <label>
              訂單狀態
              <select name="status">
                ${renderStatusOptions(order.status || "待付款")}
              </select>
            </label>
            <label>
              admin_note
              <textarea name="admin_note" rows="3" placeholder="只給管理員看的內部備註">${adminEscape(order.admin_note || "")}</textarea>
            </label>
            <div class="admin-order-actions">
              <button class="button primary" type="submit">儲存修改</button>
              <p class="form-result" data-admin-order-result role="status"></p>
            </div>
          </form>
        </article>
      `;
    }));

    shell.innerHTML = `
      <section class="admin-dashboard">
        <div class="admin-dashboard-head">
          <div>
            <p class="eyebrow">Orders</p>
            <h2>全部訂單</h2>
          </div>
          <button class="button ghost" type="button" data-admin-refresh>重新整理</button>
        </div>
        <div class="admin-orders-list">
          ${cards.join("")}
        </div>
      </section>
    `;

    bindAdminOrderForms();
  } catch (error) {
    renderAdminError("訂單載入失敗", adminErrorText(error));
  }
}

function bindAdminOrderForms() {
  document.querySelector("[data-admin-refresh]")?.addEventListener("click", renderAdminOrders);

  document.querySelectorAll("[data-admin-order-form]").forEach((form) => {
    if (form.dataset.bound) return;
    form.dataset.bound = "true";

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const client = getAdminClient();
      const card = form.closest("[data-admin-order-card]");
      const result = form.querySelector("[data-admin-order-result]");
      const submit = form.querySelector("button[type='submit']");
      const orderId = card?.dataset.orderId || "";

      if (!client || !orderId) {
        if (result) result.textContent = "找不到 Supabase 或訂單 ID。";
        return;
      }

      if (submit) {
        submit.disabled = true;
        submit.textContent = "儲存中...";
      }
      if (result) result.textContent = "";

      const { error } = await client
        .from("orders")
        .update({
          status: form.status.value,
          admin_note: form.admin_note.value.trim(),
          updated_at: new Date().toISOString()
        })
        .eq("id", orderId);

      if (error) {
        if (result) {
          result.textContent = `儲存失敗：${adminErrorText(error)}`;
          result.classList.add("error");
        }
        if (submit) {
          submit.disabled = false;
          submit.textContent = "儲存修改";
        }
        return;
      }

      if (result) {
        result.textContent = "已儲存";
        result.classList.remove("error");
      }
      if (submit) {
        submit.disabled = false;
        submit.textContent = "儲存修改";
      }
    });
  });
}

async function initAdminPage() {
  const user = await getAdminUser();
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  try {
    const isAdmin = await checkIsAdmin(user);
    if (!isAdmin) {
      renderAdminAccessDenied();
      return;
    }
    await renderAdminOrders();
  } catch (error) {
    renderAdminError("管理員權限檢查失敗", adminErrorText(error));
  }
}

document.addEventListener("DOMContentLoaded", initAdminPage);
