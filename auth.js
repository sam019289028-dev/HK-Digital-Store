async function getSupabaseUser() {
  if (!window.supabaseClient) return null;
  const { data, error } = await window.supabaseClient.auth.getUser();
  if (error) return null;
  return data.user || null;
}

function authSiteHref(path) {
  if (window.HKDigitalStoreHref) return window.HKDigitalStoreHref(path);
  const cleanPath = String(path || "").replace(/^\/+/, "");
  if (!cleanPath || /^(https?:|mailto:|tel:|#)/i.test(cleanPath)) return path;
  if (window.location.protocol === "file:") {
    const inSubDirectory = /\/payment(\/|$)/i.test(window.location.pathname.replace(/\\/g, "/"));
    return `${inSubDirectory ? "../" : ""}${cleanPath}`;
  }
  return `/${cleanPath}`;
}

function getCachedSupabaseUser() {
  return window.hkAuthUser || null;
}

function getDisplayName(user) {
  return user?.user_metadata?.display_name || user?.email || "我的帳戶";
}

async function refreshSupabaseUser() {
  window.hkAuthUser = await getSupabaseUser();
  window.dispatchEvent(new CustomEvent("hk-auth-change", { detail: { user: window.hkAuthUser } }));
  return window.hkAuthUser;
}

async function registerWithSupabase({ name, email, password }) {
  if (!window.supabaseClient) throw new Error("Supabase 尚未載入，請重新整理頁面。");

  const { data, error } = await window.supabaseClient.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: name
      }
    }
  });

  if (error) throw error;
  return data;
}

async function loginWithSupabase({ email, password }) {
  if (!window.supabaseClient) throw new Error("Supabase 尚未載入，請重新整理頁面。");

  const { data, error } = await window.supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  window.hkAuthUser = data.user || null;
  window.dispatchEvent(new CustomEvent("hk-auth-change", { detail: { user: window.hkAuthUser } }));
  return data;
}

async function logoutWithSupabase(options = {}) {
  if (!options.skipConfirm && !window.confirm("確認登出？")) return false;

  if (window.supabaseClient) {
    await window.supabaseClient.auth.signOut();
  }
  window.hkAuthUser = null;
  window.dispatchEvent(new CustomEvent("hk-auth-change", { detail: { user: null } }));
  window.location.href = authSiteHref("index.html");
  return true;
}

function authErrorMessage(error) {
  const message = error?.message || "";
  if (message.includes("Invalid login credentials")) return "Email 或密碼不正確";
  if (message.includes("User already registered")) return "這個 Email 已經註冊過";
  if (message.includes("Password should be at least")) return "密碼至少需要 6 位";
  return message || "操作失敗，請稍後再試。";
}

function renderSupabaseAuthNav() {
  const user = getCachedSupabaseUser();
  document.querySelectorAll(".header-actions").forEach((node) => node.remove());

  document.querySelectorAll(".site-nav").forEach((nav) => {
    const wrapper = document.createElement("div");
    wrapper.className = "header-actions";
    const accountControl = user
      ? `<div class="account-menu-wrap">
           <button class="header-icon" type="button" aria-label="我的帳戶" aria-expanded="false" data-account-menu-toggle>
             ${window.iconSvg ? window.iconSvg("user") : "我的"}
           </button>
           <div class="account-menu" data-account-menu>
             <a href="${authSiteHref("account.html")}">我的帳戶</a>
             <a href="${authSiteHref("order-history.html")}">訂購紀錄</a>
             <a href="${authSiteHref("recent-viewed.html")}">最近瀏覽</a>
             <button type="button" data-supabase-logout>登出</button>
           </div>
         </div>`
      : `<a class="header-icon" href="${authSiteHref("login.html")}" aria-label="登入或註冊">
           ${window.iconSvg ? window.iconSvg("user") : "登入"}
         </a>`;

    wrapper.innerHTML = `
      <a class="header-icon cart-icon" href="${authSiteHref("cart.html")}" aria-label="購物車" data-open-cart-drawer>
        ${window.iconSvg ? window.iconSvg("cart") : "購物車"}
        <span data-cart-count>${window.getCart ? window.getCart().length : 0}</span>
      </a>
      ${accountControl}
    `;

    nav.appendChild(wrapper);
  });

  document.querySelectorAll("[data-open-cart-drawer]").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (!window.openCartDrawer) return;
      event.preventDefault();
      window.openCartDrawer();
    });
  });

  document.querySelectorAll("[data-supabase-logout]").forEach((button) => {
    button.addEventListener("click", logoutWithSupabase);
  });

  document.querySelectorAll("[data-account-menu-toggle]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const menu = button.closest(".account-menu-wrap")?.querySelector("[data-account-menu]");
      const isOpen = menu?.classList.contains("open");
      document.querySelectorAll("[data-account-menu]").forEach((node) => node.classList.remove("open"));
      document.querySelectorAll("[data-account-menu-toggle]").forEach((node) => node.setAttribute("aria-expanded", "false"));
      if (menu && !isOpen) {
        menu.classList.add("open");
        button.setAttribute("aria-expanded", "true");
      }
    });
  });

  if (!window.hkAccountMenuCloseBound) {
    document.addEventListener("click", () => {
      document.querySelectorAll("[data-account-menu]").forEach((node) => node.classList.remove("open"));
      document.querySelectorAll("[data-account-menu-toggle]").forEach((node) => node.setAttribute("aria-expanded", "false"));
    });
    window.hkAccountMenuCloseBound = true;
  }
}

function initLoginPage() {
  const form = document.querySelector("#login-form, [data-login-page-form]");
  if (!form || form.dataset.supabaseBound) return;
  form.id = form.id || "login-form";
  form.dataset.supabaseBound = "true";

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const error = document.querySelector("#login-error, [data-login-page-error]");
    const submit = form.querySelector("button[type='submit']");
    const email = form.email.value.trim().toLowerCase();
    const password = form.password.value;

    if (error) error.textContent = "";
    if (!email || !password) {
      if (error) error.textContent = "請輸入 Email 和密碼";
      return;
    }

    try {
      if (submit) {
        submit.disabled = true;
        submit.textContent = "登入中...";
      }
      await loginWithSupabase({ email, password });
      window.location.href = "account.html";
    } catch (authError) {
      if (error) error.textContent = authErrorMessage(authError);
    } finally {
      if (submit) {
        submit.disabled = false;
        submit.textContent = "登入";
      }
    }
  });
}

function initRegisterPage() {
  const form = document.querySelector("#register-form, [data-register-page-form]");
  if (!form || form.dataset.supabaseBound) return;
  form.id = form.id || "register-form";
  form.dataset.supabaseBound = "true";

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const error = document.querySelector("#register-error, [data-register-page-error]");
    const submit = form.querySelector("button[type='submit']");
    const name = form.name.value.trim();
    const email = form.email.value.trim().toLowerCase();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    if (error) error.textContent = "";
    if (!name) {
      if (error) error.textContent = "請輸入你的稱呼";
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      if (error) error.textContent = "請輸入有效的 Email";
      return;
    }
    if (password.length < 6) {
      if (error) error.textContent = "密碼至少需要 6 位";
      return;
    }
    if (password !== confirmPassword) {
      if (error) error.textContent = "兩次輸入的密碼不一致";
      return;
    }

    try {
      if (submit) {
        submit.disabled = true;
        submit.textContent = "建立中...";
      }
      const result = await registerWithSupabase({ name, email, password });
      if (result.session && window.supabaseClient) {
        await window.supabaseClient.auth.signOut();
      }
      window.location.href = "login.html";
    } catch (authError) {
      if (error) error.textContent = authErrorMessage(authError);
    } finally {
      if (submit) {
        submit.disabled = false;
        submit.textContent = "建立帳戶";
      }
    }
  });
}

window.hkSupabaseAuth = {
  getCurrentUser: getSupabaseUser,
  getCachedUser: getCachedSupabaseUser,
  refreshUser: refreshSupabaseUser,
  register: registerWithSupabase,
  login: loginWithSupabase,
  logout: logoutWithSupabase,
  updateAuthNav: renderSupabaseAuthNav
};

document.addEventListener("DOMContentLoaded", () => {
  initLoginPage();
  initRegisterPage();
  refreshSupabaseUser().then(() => {
    renderSupabaseAuthNav();
    if (window.renderAccountSections) window.renderAccountSections();
  });
});

if (window.supabaseClient) {
  window.supabaseClient.auth.onAuthStateChange((_event, session) => {
    window.hkAuthUser = session?.user || null;
    renderSupabaseAuthNav();
    if (window.renderAccountSections) window.renderAccountSections();
  });
}
