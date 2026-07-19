// توابع کمکی احراز هویت — روی sb (کلاینت Supabase) کار می‌کند

// ثبت‌نام کاربر جدید
async function elmoreSignUp(fullName, phone, email, password) {
  const { data, error } = await sb.auth.signUp({ email, password });
  if (error) return { error };

  // اگر ثبت‌نام موفق بود، پروفایل تکمیلی را هم بسازیم
  if (data.user) {
    await sb.from("profiles").insert({
      id: data.user.id,
      full_name: fullName,
      phone: phone,
    });
  }
  return { data };
}

// ورود کاربر
async function elmoreSignIn(email, password) {
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  return { data, error };
}

// خروج کاربر
async function elmoreSignOut(redirectUrl) {
  await sb.auth.signOut();
  window.location.href = redirectUrl || "../public/auth.html";
}

// گرفتن کاربر فعلی (یا null)
async function elmoreGetUser() {
  const { data } = await sb.auth.getUser();
  return data.user || null;
}

// محافظت از صفحات پنل کاربری: اگر لاگین نبود، به صفحه ورود می‌فرستد
async function elmoreRequireAuth(loginPageUrl) {
  const user = await elmoreGetUser();
  if (!user) {
    window.location.href = loginPageUrl || "../public/auth.html";
    return null;
  }
  return user;
}

// محافظت از پنل مدیریت: فقط کاربرانی که role=admin دارند اجازه ورود دارند
async function elmoreRequireAdmin(loginPageUrl) {
  const user = await elmoreGetUser();
  if (!user) {
    window.location.href = loginPageUrl || "../public/auth.html";
    return null;
  }
  const { data: profile } = await sb.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || profile.role !== "admin") {
    alert("شما دسترسی مدیر ندارید.");
    window.location.href = "../public/index.html";
    return null;
  }
  return user;
}

// نمایش نام کاربر در بالای پنل (اگر عنصر user-chip-name وجود داشته باشد)
async function elmoreShowUserName() {
  const user = await elmoreGetUser();
  if (!user) return;
  const { data: profile } = await sb.from("profiles").select("full_name").eq("id", user.id).single();
  const nameEl = document.getElementById("userChipName");
  if (nameEl) nameEl.textContent = (profile && profile.full_name) || user.email;
  const avEl = document.getElementById("userChipAvatar");
  if (avEl) {
    const initial = ((profile && profile.full_name) || user.email || "?").trim().charAt(0);
    avEl.textContent = initial;
  }
}

// نمایش پیام خطا/موفقیت ساده زیر فرم‌ها
function elmoreShowMessage(elementId, message, isError) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = message;
  el.style.display = "block";
  el.style.color = isError ? "#f87171" : "#4ade80";
}
