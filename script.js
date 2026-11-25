/* =========================================
   منصة خدمتي | Khidmati — ملف JavaScript المشترك
   ========================================= */

// رقم واتساب المنصة بالصيغة الدولية (بدون + وبدون الصفر الأول)
const WHATSAPP_NUMBER = "966532010648";

// يفتح واتساب برسالة جاهزة
function openWhatsApp(message) {
  const url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
  window.open(url, "_blank", "noopener");
}

// ===== 1) قائمة الجوال =====
const toggle = document.querySelector(".menu-toggle");
const links = document.querySelector(".nav-links");
if (toggle && links) {
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });
}

// ظل خفيف للقائمة العلوية عند التمرير
const siteHeader = document.querySelector(".site-header");
window.addEventListener("scroll", () => {
  siteHeader.classList.toggle("scrolled", window.scrollY > 10);
});

// ضوء يتبع الماوس في الواجهة
document.querySelectorAll(".spotlight").forEach((area) => {
  const glow = area.querySelector(".glow-follow");
  if (!glow) return;
  area.addEventListener("mousemove", (e) => {
    const r = area.getBoundingClientRect();
    glow.style.setProperty("--x", (e.clientX - r.left) + "px");
    glow.style.setProperty("--y", (e.clientY - r.top) + "px");
  });
});

// ===== 2) أزرار «اطلب الخدمة» في صفحة الخدمات =====
document.querySelectorAll(".order-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const service = btn.dataset.service;
    openWhatsApp(
      "السلام عليكم، منصة خدمتي 👋\n" +
      "أرغب في طلب خدمة: " + service + "\n" +
      "أتمنى تزويدي بالتفاصيل والسعر."
    );
  });
});

// ===== 3) نموذج طلب الخدمة في صفحة التواصل =====
const form = document.getElementById("order-form");
if (form) {
  const note = document.getElementById("form-note");

  const showError = (id, msg) => {
    const field = document.getElementById(id).closest(".field");
    field.classList.toggle("invalid", Boolean(msg));
    field.querySelector(".error").textContent = msg || "";
    return !msg;
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const val = (id) => document.getElementById(id).value.trim();
    const name = val("name");
    const phone = val("phone").replace(/\s|-/g, "");
    const email = val("email");
    const service = val("service");
    const details = val("details");

    // التحقق من البيانات
    const checks = [
      showError("name", name.length < 2 ? "اكتب اسمك (حرفين على الأقل)." : ""),
      showError("phone", /^05\d{8}$/.test(phone) ? "" : "اكتب رقم جوال سعودي صحيح يبدأ بـ 05 ومكوّن من 10 أرقام."),
      showError("email", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "" : "اكتب بريدًا إلكترونيًا صحيحًا."),
      showError("service", service ? "" : "اختر نوع الخدمة."),
      showError("details", details.length < 10 ? "اكتب تفاصيل الطلب (10 أحرف على الأقل)." : ""),
    ];

    if (checks.includes(false)) {
      note.textContent = "فضلًا صحّح الحقول المحددة باللون الأحمر.";
      note.style.color = "var(--error)";
      const firstInvalid = form.querySelector(".field.invalid input, .field.invalid select, .field.invalid textarea");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // رسالة واتساب مرتبة
    const message =
      "📋 طلب خدمة جديد — منصة خدمتي\n\n" +
      "👤 الاسم: " + name + "\n" +
      "📞 الجوال: " + phone + "\n" +
      "✉️ البريد: " + email + "\n" +
      "🛠️ الخدمة: " + service + "\n\n" +
      "📝 التفاصيل:\n" + details;

    note.textContent = "تم تجهيز طلبك ✓ جاري فتح واتساب...";
    note.style.color = "var(--olive)";
    openWhatsApp(message);
    form.reset();
  });

  // إزالة رسالة الخطأ أثناء الكتابة
  form.querySelectorAll("input, select, textarea").forEach((el) => {
    el.addEventListener("input", () => showError(el.id, ""));
  });
}

// ===== 4) حركة ظهور العناصر عند التمرير =====
document.documentElement.classList.add("js");
const revealItems = document.querySelectorAll(".reveal");
// العناصر الظاهرة في أول الشاشة تظهر فورًا
revealItems.forEach((el) => {
  if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("visible");
});
// احتياط: كل العناصر تظهر بعد ثانيتين مهما صار
setTimeout(() => revealItems.forEach((el) => el.classList.add("visible")), 2000);
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((el) => observer.observe(el));
} else {
  revealItems.forEach((el) => el.classList.add("visible"));
}

// ===== 5) سنة حقوق النشر تلقائيًا =====
document.querySelectorAll(".year").forEach((el) => (el.textContent = new Date().getFullYear()));
