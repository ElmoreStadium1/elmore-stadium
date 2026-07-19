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
  document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));
});
