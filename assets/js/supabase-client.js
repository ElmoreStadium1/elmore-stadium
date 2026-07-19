// اتصال به Supabase — این فایل در همه صفحات مشترک است
const SUPABASE_URL = "https://njbztdhroxxlaqgjedek.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_EmnowD_Fn5MCoUSfTqbIfQ_am__8IAB";

// supabase-js از CDN لود می‌شود (نگاه کنید به تگ script در هر صفحه)
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
