/* ==================================
   PORTFOLIO CAROUSEL
================================== */

const carouselOffsets = {};

function slide(id, dir) {
  const carousel = document.getElementById(id);

  if (!carousel) return;

  const card = carousel.querySelector(".carousel-card");

  if (!card) return;

  const cardWidth = card.offsetWidth + 24;

  carouselOffsets[id] =
    (carouselOffsets[id] || 0) + dir * cardWidth;

  const maxScroll =
    carousel.scrollWidth - carousel.clientWidth;

  carouselOffsets[id] = Math.max(
    0,
    Math.min(carouselOffsets[id], maxScroll)
  );

  carousel.scrollTo({
    left: carouselOffsets[id],
    behavior: "smooth"
  });
}

/* ==================================
   BHK SELECTION
================================== */

function selectBHK(btn) {
  document
    .querySelectorAll(".bhk-btn")
    .forEach(item => item.classList.remove("active"));

  btn.classList.add("active");
}

function selectPurpose(btn) {
  document
    .querySelectorAll(".purpose-btn")
    .forEach(item => item.classList.remove("active"));

  btn.classList.add("active");
}

function gotoStep2() {
  const bhk =
    document.querySelector(".bhk-btn.active")?.textContent;

  const purpose =
    document.querySelector(".purpose-btn.active")?.textContent;

  if (!bhk) {
    alert("Please select your floor plan.");
    return;
  }

  if (!purpose) {
    alert("Please select your purpose.");
    return;
  }

  const propertySelect =
    document.getElementById("property");

  const purposeSelect =
    document.getElementById("purpose");

  if (propertySelect) {
    [...propertySelect.options].forEach(option => {
      if (option.text.includes(bhk.replace("+", ""))) {
        option.selected = true;
      }
    });
  }

  if (purposeSelect) {
    [...purposeSelect.options].forEach(option => {
      if (option.text === purpose) {
        option.selected = true;
      }
    });
  }

  const estimateSection =
    document.getElementById("estimate");

  if (estimateSection) {
    estimateSection.scrollIntoView({
      behavior: "smooth"
    });
  }
}

/* ==================================
   LEAD FORM SUBMISSION
================================== */

async function submitLead() {
  const btn = document.getElementById("submitBtn");
  const msg = document.getElementById("formMsg");

  const payload = {
    name: document.getElementById("fname").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    email: document.getElementById("email").value.trim(),
    property: document.getElementById("property").value,
    budget: document.getElementById("budget").value,
    purpose: document.getElementById("purpose").value
  };

  if (!payload.name || !payload.phone) {
    msg.className = "form-msg error";
    msg.textContent =
      "Please fill in Name and Phone Number.";
    return;
  }

  btn.disabled = true;
  btn.textContent = "Submitting...";

  await sendLead(payload, msg);

  btn.disabled = false;
  btn.textContent =
    "Book FREE 3D Design Session →";
}

async function sendLead(payload, msgEl) {
  try {
    const res = await fetch(
      "http://localhost:5000/api/leads",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.message || "Submission failed"
      );
    }

    msgEl.className = "form-msg success";
    msgEl.textContent =
      "✅ Thank you! Our designer will contact you shortly.";

    document
      .querySelectorAll(
        "#fname, #phone, #email"
      )
      .forEach(input => (input.value = ""));

    document
      .querySelectorAll("select")
      .forEach(select => (select.selectedIndex = 0));

  } catch (err) {
    msgEl.className = "form-msg error";
    msgEl.textContent =
      "❌ Submission failed. Please call 7989808900.";
  }
}

/* ==================================
   SCROLL ANIMATIONS
================================== */

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform =
          "translateY(0)";
      }
    });
  },
  {
    threshold: 0.1
  }
);

document
  .querySelectorAll(
    ".feature-card, .service-item, .carousel-card"
  )
  .forEach(el => {
    el.style.opacity = "0";
    el.style.transform =
      "translateY(20px)";
    el.style.transition =
      "opacity .5s ease, transform .5s ease";

    observer.observe(el);
  });

/* ==================================
   NAVBAR SHADOW
================================== */

window.addEventListener("scroll", () => {
  const navbar =
    document.getElementById("navbar");

  if (!navbar) return;

  navbar.style.boxShadow =
    window.scrollY > 10
      ? "0 4px 20px rgba(0,0,0,0.12)"
      : "0 2px 12px rgba(0,0,0,0.08)";
});