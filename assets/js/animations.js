// این فایل انیمیشن‌های مشترک سایت (لودینگ اسکرین + ظاهرشدن هنگام اسکرول) را مدیریت می‌کند
window.addEventListener('load', function(){
  const ls = document.getElementById('loadingScreen');
  if(ls){ setTimeout(function(){ ls.classList.add('hide'); }, 500); }
});

document.addEventListener('DOMContentLoaded', function(){
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  function observeReveal(el){ revealObserver.observe(el); }
  document.querySelectorAll('[data-reveal]').forEach(observeReveal);

  // المان‌هایی که بعداً و به‌صورت داینامیک اضافه می‌شن (مثلاً کارت‌های نظرات یا دوره‌ها
  // بعد از دریافت داده از Supabase) هم باید توسط observer دیده بشن، وگرنه چون
  // در لحظه‌ی بارگذاری اولیه‌ی صفحه وجود نداشتن، هیچ‌وقت observe نمی‌شدن و برای همیشه
  // opacity:0 (نامرئی) می‌موندن. این mutation observer این مشکل رو حل می‌کنه.
  const mutationObserver = new MutationObserver(function(mutations){
    mutations.forEach(function(mutation){
      mutation.addedNodes.forEach(function(node){
        if(node.nodeType !== 1) return;
        if(node.matches && node.matches('[data-reveal]')) observeReveal(node);
        if(node.querySelectorAll) node.querySelectorAll('[data-reveal]').forEach(observeReveal);
      });
    });
  });
  mutationObserver.observe(document.body, { childList: true, subtree: true });
});
