/* ============================================
   AMALY Universe — Main JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- NAVBAR SCROLL ---
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  // --- MOBILE MENU ---
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileClose = document.querySelector('.mobile-nav-close');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => mobileNav.classList.add('open'));
    mobileClose?.addEventListener('click', () => mobileNav.classList.remove('open'));
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mobileNav.classList.remove('open'));
    });
  }

  // --- ACTIVE NAV LINK ---
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // --- FAQ ACCORDION ---
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-answer').classList.remove('open');
      });

      if (!isOpen) {
        item.classList.add('open');
        answer.classList.add('open');
      }
    });
  });

  // --- FAQ CATEGORY FILTER ---
  document.querySelectorAll('.faq-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.faq-cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      document.querySelectorAll('.faq-group').forEach(group => {
        if (cat === 'all' || group.dataset.cat === cat) {
          group.style.display = '';
        } else {
          group.style.display = 'none';
        }
      });
    });
  });

  // --- REGISTRATION FORM: CONDITIONAL FIELDS ---
  const pkgInputs = document.querySelectorAll('input[name="package"]');
  const addressSection = document.getElementById('address-section');

  if (pkgInputs.length && addressSection) {
    pkgInputs.forEach(input => {
      input.addEventListener('change', () => {
        if (input.value === 'basic-plus') {
          addressSection.classList.add('visible');
        } else {
          addressSection.classList.remove('visible');
        }
      });
    });
  }

  // --- REGISTRATION FORM SUBMIT ---
  const regForm = document.getElementById('registration-form');
  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Validate mandatory checkboxes
      const mandatory = regForm.querySelectorAll('.mandatory-check');
      let allChecked = true;
      mandatory.forEach(cb => {
        if (!cb.checked) allChecked = false;
      });

      if (!allChecked) {
        showToast('❌ Please accept all mandatory agreements to continue.', 'error');
        return;
      }

      const submitBtn = regForm.querySelector('.submit-btn');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting…';

      // Simulate form submission
      setTimeout(() => {
        showSuccessState();
      }, 1500);
    });
  }

  // --- CONTACT FORM SUBMIT ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Sending…';
      setTimeout(() => {
        showToast('✅ Message sent! We\'ll get back to you soon.', 'success');
        contactForm.reset();
        btn.disabled = false;
        btn.textContent = 'Send Message';
      }, 1200);
    });
  }

  // --- SMOOTH SCROLL ANCHORS ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- INTERSECTION OBSERVER: FADE IN ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

});

// --- TOAST HELPER ---
function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span class="toast-icon">${type === 'success' ? '✅' : '⚠️'}</span><span>${message}</span>`;
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 500);
  }, 4000);
}

// --- REGISTRATION SUCCESS STATE ---
function showSuccessState() {
  const form = document.getElementById('registration-form');
  const container = form?.closest('.register-container');
  if (!container) return;

  container.innerHTML = `
    <div style="text-align:center; padding: 64px 32px;">
      <div style="font-size:5rem; margin-bottom:24px;">🎉</div>
      <h2 style="font-family:var(--font-head); font-size:2rem; margin-bottom:16px; color:var(--dark);">Registration Received!</h2>
      <p style="color:var(--gray); font-size:1.05rem; max-width:520px; margin:0 auto 32px; line-height:1.7;">
        Thank you for registering for AMALY Summer Camp 2025!
        We have received your application and it is now <strong style="color:var(--primary);">PENDING PAYMENT</strong>.
      </p>
      <div style="background:var(--light); border-radius:var(--radius-lg); padding:32px; max-width:480px; margin:0 auto 40px; text-align:left;">
        <h3 style="font-size:1rem; margin-bottom:20px; color:var(--dark);">What happens next?</h3>
        <div style="display:flex; flex-direction:column; gap:16px;">
          ${['📧 Check your email for payment instructions', '💳 Complete payment via link or bank transfer', '✅ We validate your payment (within 24h)', '📲 You receive WhatsApp community access', '🎓 Google Classroom account sent to your email'].map((step, i) => `
            <div style="display:flex; align-items:flex-start; gap:12px;">
              <span style="width:28px; height:28px; border-radius:50%; background:var(--primary); color:white; display:flex; align-items:center; justify-content:center; font-size:0.75rem; font-weight:700; flex-shrink:0; margin-top:2px;">${i+1}</span>
              <span style="font-size:0.9rem; color:var(--dark);">${step}</span>
            </div>
          `).join('')}
        </div>
      </div>
      <a href="summer-camp.html" class="btn btn-primary btn-lg">Back to Summer Camp</a>
    </div>
  `;
}
