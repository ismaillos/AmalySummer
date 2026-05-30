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

// --- WHATSAPP WIDGET ---
(function () {
  const WA_NUMBER = '212661527252';
  const WA_PREFILL = encodeURIComponent('Bonjour AMALY ! Je suis intéressé(e) par le Summer Camp 2026. Pouvez-vous me donner plus d\'informations ?');

  const widget = document.createElement('div');
  widget.className = 'wa-widget';
  widget.innerHTML = `
    <div class="wa-bubble" id="wa-bubble">
      <div class="wa-bubble-header">
        <div class="wa-avatar">🌟</div>
        <div class="wa-info">
          <strong>AMALY Summer Camp</strong>
          <span><span class="wa-online"></span>Équipe AMALY</span>
        </div>
      </div>
      <div class="wa-body">
        <div class="wa-msg">
          Bonjour ! 👋 Bienvenue sur AMALY Universe.<br><br>
          Comment pouvons-nous vous aider avec le Summer Camp 2026 ?
          <div class="wa-time">Aujourd'hui</div>
        </div>
      </div>
      <div class="wa-footer">
        <input class="wa-input" id="wa-input" type="text" placeholder="Écrivez votre message…" />
        <button class="wa-send" id="wa-send" aria-label="Envoyer">
          <svg viewBox="0 0 24 24"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>
        </button>
      </div>
    </div>
    <button class="wa-toggle" id="wa-toggle" aria-label="Chat WhatsApp">
      <span class="wa-notification">1</span>
      <svg class="wa-open-icon" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.553 4.103 1.522 5.831L0 24l6.335-1.502A11.947 11.947 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.875 9.875 0 01-5.031-1.374l-.361-.214-3.741.981.999-3.648-.235-.374A9.867 9.867 0 012.118 12C2.118 6.535 6.535 2.118 12 2.118S21.882 6.535 21.882 12 17.465 21.882 12 21.882z"/></svg>
      <svg class="wa-close-icon" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" stroke="white" stroke-width="2.5" stroke-linecap="round" fill="none"/></svg>
    </button>
  `;
  document.body.appendChild(widget);

  const toggle = document.getElementById('wa-toggle');
  const bubble = document.getElementById('wa-bubble');
  const sendBtn = document.getElementById('wa-send');
  const input = document.getElementById('wa-input');
  const notif = widget.querySelector('.wa-notification');

  toggle.addEventListener('click', () => {
    const isOpen = bubble.classList.contains('open');
    bubble.classList.toggle('open');
    toggle.classList.toggle('active');
    if (notif) notif.style.display = 'none';
    if (!isOpen) setTimeout(() => input.focus(), 350);
  });

  function openWhatsApp() {
    const msg = input.value.trim()
      ? encodeURIComponent(input.value.trim())
      : WA_PREFILL;
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank');
  }

  sendBtn.addEventListener('click', openWhatsApp);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') openWhatsApp();
  });
})();

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
