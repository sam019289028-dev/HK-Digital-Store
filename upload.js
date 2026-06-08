const paymentScreenshotBucket = "payment-screenshots";
const paymentScreenshotOrderIdKey = "hkDigitalStoreLastOrderId";

function getUploadClient() {
  return window.supabaseClient || null;
}

async function getUploadUser() {
  if (window.hkSupabaseAuth && typeof window.hkSupabaseAuth.getCurrentUser === "function") {
    return window.hkSupabaseAuth.getCurrentUser();
  }

  const client = getUploadClient();
  if (!client) return null;

  const { data, error } = await client.auth.getUser();
  if (error) return null;
  return data && data.user ? data.user : null;
}

function getUploadErrorText(error) {
  if (!error) return "未知錯誤";
  return [error.message, error.details, error.hint, error.code].filter(Boolean).join(" / ");
}

function getScreenshotExtension(file) {
  const typeMap = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp"
  };
  return typeMap[file.type] || "jpg";
}

function validateScreenshotFile(file) {
  if (!file) return "請先選擇付款截圖。";
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    return "只支援 JPG、PNG 或 WEBP 圖片。";
  }
  return "";
}

function setUploadResult(message, isError = false) {
  const result = document.querySelector("[data-upload-result]");
  if (!result) return;
  result.textContent = message;
  result.classList.toggle("error", isError);
}

function showUploadSection(orderId) {
  const section = document.querySelector("[data-payment-upload-section]");
  const input = document.querySelector("[data-upload-order-id]");
  if (!section) return;

  const resolvedOrderId = orderId
    || sessionStorage.getItem(paymentScreenshotOrderIdKey)
    || localStorage.getItem(paymentScreenshotOrderIdKey)
    || "";

  if (!resolvedOrderId) return;

  if (input) input.value = resolvedOrderId;
  section.hidden = false;
  setUploadResult("訂單已建立。付款後可以在這裡提交截圖。");
  section.scrollIntoView({ behavior: "smooth", block: "center" });
}

async function handleScreenshotUpload(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const client = getUploadClient();
  const user = await getUploadUser();
  const submit = form.querySelector("[data-submit-screenshot]");
  const orderId = form.order_id.value;
  const fileInput = form.payment_screenshot;
  const file = fileInput.files && fileInput.files[0] ? fileInput.files[0] : null;

  if (!client) {
    setUploadResult("Supabase 尚未載入，暫時不能上傳。", true);
    return;
  }

  if (!user) {
    setUploadResult("請先登入後再提交付款截圖。", true);
    return;
  }

  if (!orderId) {
    setUploadResult("找不到訂單編號，請先提交訂單。", true);
    return;
  }

  const validationError = validateScreenshotFile(file);
  if (validationError) {
    setUploadResult(validationError, true);
    return;
  }

  const timestamp = Date.now();
  const extension = getScreenshotExtension(file);
  const path = `${user.id}/${orderId}-${timestamp}.${extension}`;
  console.info("Uploading payment screenshot", {
    bucket: paymentScreenshotBucket,
    orderId,
    fileType: file.type
  });

  if (submit) {
    submit.disabled = true;
    submit.textContent = "上傳中...";
  }
  setUploadResult("");

  const { error: uploadError } = await client.storage
    .from(paymentScreenshotBucket)
    .upload(path, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false
    });

  if (uploadError) {
    setUploadResult(`付款截圖上傳失敗：${getUploadErrorText(uploadError)}`, true);
    if (submit) {
      submit.disabled = false;
      submit.textContent = "提交付款截圖";
    }
    return;
  }

  const { data: updatedOrder, error: updateError } = await client
    .from("orders")
    .update({
      payment_screenshot_url: path,
      status: "已付款",
      updated_at: new Date().toISOString()
    })
    .eq("id", orderId)
    .eq("user_id", user.id)
    .select("id, status, payment_screenshot_url")
    .maybeSingle();

  if (updateError) {
    setUploadResult(`訂單更新失敗：${getUploadErrorText(updateError)}`, true);
    if (submit) {
      submit.disabled = false;
      submit.textContent = "提交付款截圖";
    }
    return;
  }

  console.info("Payment screenshot order update result", updatedOrder);

  if (!updatedOrder || updatedOrder.status !== "已付款") {
    setUploadResult("付款截圖已上傳，但找不到可以更新的訂單。請重新提交訂單或聯絡客服。", true);
    if (submit) {
      submit.disabled = false;
      submit.textContent = "提交付款截圖";
    }
    return;
  }

  setUploadResult("付款截圖已提交，客服會盡快處理");
  document.dispatchEvent(new CustomEvent("hk-payment-screenshot-uploaded", {
    detail: {
      orderId,
      path
    }
  }));

  if (typeof window.renderAccountSections === "function") {
    window.renderAccountSections();
  }

  if (submit) {
    submit.textContent = "已提交";
    submit.disabled = true;
  }

  if (window.showToast) {
    window.showToast("付款截圖已提交");
  }
}

function initPaymentScreenshotUpload() {
  const form = document.querySelector("[data-payment-upload-form]");
  if (!form) return;

  form.addEventListener("submit", handleScreenshotUpload);

  const existingOrderId = sessionStorage.getItem(paymentScreenshotOrderIdKey)
    || localStorage.getItem(paymentScreenshotOrderIdKey);
  if (existingOrderId) {
    showUploadSection(existingOrderId);
  }

  document.addEventListener("hk-order-created", (event) => {
    const orderId = event.detail && event.detail.orderId ? event.detail.orderId : "";
    showUploadSection(orderId);
  });
}

document.addEventListener("DOMContentLoaded", initPaymentScreenshotUpload);

window.hkPaymentUpload = {
  show: showUploadSection
};
