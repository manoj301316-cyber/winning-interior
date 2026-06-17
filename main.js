/* ===== HAMBURGER MENU ===== */
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('mobileMenu').classList.toggle('open');
});

/* ===== CAROUSEL SLIDER ===== */
const carouselOffsets = {};
function slide(id, dir) {
  const carousel = document.getElementById(id);
  const card = carousel.querySelector('.carousel-card');
  const cardWidth = card.offsetWidth + 24; // card + gap
  carouselOffsets[id] = (carouselOffsets[id] || 0) + dir * cardWidth;
  const maxScroll = carousel.scrollWidth - carousel.clientWidth;
  carouselOffsets[id] = Math.max(0, Math.min(carouselOffsets[id], maxScroll));
  carousel.scrollTo({ left: carouselOffsets[id], behavior: 'smooth' });
}

/* ===== BHK SELECTOR ===== */
function selectBHK(btn) {
  document.querySelectorAll('.bhk-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}
function selectPurpose(btn) {
  document.querySelectorAll('.purpose-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}
function gotoStep2() {
  const bhk = document.querySelector('.bhk-btn.active')?.textContent;
  const purpose = document.querySelector('.purpose-btn.active')?.textContent;
  if (!bhk) { alert('Please select your floorplan (BHK).'); return; }
  if (!purpose) { alert('Please select your purpose.'); return; }
  // Pre-fill main form and scroll to it
  if (document.getElementById('property')) {
    const sel = document.getElementById('property');
    for (let o of sel.options) { if (o.text.includes(bhk.replace('+ BHK','').trim())) o.selected = true; }
  }
  if (document.getElementById('purpose')) {
    const sel = document.getElementById('purpose');
    for (let o of sel.options) { if (o.text === purpose) o.selected = true; }
  }
  document.getElementById('estimate').scrollIntoView({ behavior: 'smooth' });
}

/* ===== HERO FORM ===== */
async function submitHeroForm() {
  const name = document.getElementById('hname').value.trim();
  const phone = document.getElementById('hphone').value.trim();
  const city = document.getElementById('hcity').value;
  const msg = document.getElementById('heroMsg');
  if (!name || !phone) {
    msg.className = 'form-msg error';
    msg.textContent = 'Please enter your name and mobile number.';
    return;
  }
  await sendLead({ name, phone, city }, msg);
}

/* ===== MAIN LEAD FORM ===== */
async function submitLead() {
  const btn = document.getElementById('submitBtn');
  const msg = document.getElementById('formMsg');
  const payload = {
    name: document.getElementById('fname').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    email: document.getElementById('email').value.trim(),
    property: document.getElementById('property').value,
    budget: document.getElementById('budget').value,
    purpose: document.getElementById('purpose').value,
  };
  if (!payload.name || !payload.phone) {
    msg.className = 'form-msg error';
    msg.textContent = 'Please fill in at least Name and Phone.';
    return;
  }
  btn.textContent = 'Submitting…';
  btn.disabled = true;
  await sendLead(payload, msg);
  btn.textContent = 'Book FREE 3D Design Session →';
  btn.disabled = false;
}

/* ===== SHARED API CALL ===== */
async function sendLead(payload, msgEl) {
  try {
    const res = await fetch('http://localhost:5000/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok) {
      msgEl.className = 'form-msg success';
      msgEl.textContent = '✅ Thank you! Our designer will call you within 24 hours.';
      document.querySelectorAll('input, select').forEach(el => el.value = '');
    } else {
      throw new Error(data.message || 'Server error');
    }
  } catch (err) {
    msgEl.className = 'form-msg error';
    msgEl.textContent = '❌ Could not submit. Please call us at 7989808900.';
  }
}

/* ===== SCROLL ANIMATIONS ===== */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(
  '.feature-card, .service-item, .carousel-card, .team-card'
).forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

/* ===== ACTIVE NAV HIGHLIGHT ===== */
window.addEventListener('scroll', () => {
  const scrollY = window.pageYOffset;
  document.querySelectorAll('section[id]').forEach(sec => {
    const top = sec.offsetTop - 90;
    const id = sec.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) link.style.color = (scrollY >= top && scrollY < top + sec.offsetHeight) ? 'var(--red)' : '';
  });
});

/* ===== STICKY NAV SHADOW ===== */
window.addEventListener('scroll', () => {
  document.getElementById('navbar').style.boxShadow =
    window.scrollY > 10 ? '0 2px 20px rgba(0,0,0,0.12)' : '0 2px 12px rgba(0,0,0,0.08)';
});
