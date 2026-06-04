document.addEventListener('DOMContentLoaded', () => {

  // ── Page Loader ──────────────────────────────────────────────────────────
  const loader = document.getElementById('page-loader');
  window.addEventListener('load', () => {
    loader.classList.add('hidden');
    setTimeout(() => loader.remove(), 600);
  });

  // ── Scroll Progress Bar ───────────────────────────────────────────────────
  const progressBar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = total > 0 ? (scrolled / total * 100) + '%' : '0%';
  }, { passive: true });

  // ── Header shadow on scroll ───────────────────────────────────────────────
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

  // ── Active nav link on scroll ─────────────────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => sectionObserver.observe(s));

  // ── Mobile Nav Toggle ─────────────────────────────────────────────────────
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinksEl = document.getElementById('nav-links');

  mobileToggle.addEventListener('click', () => {
    const open = navLinksEl.classList.toggle('open');
    mobileToggle.innerHTML = open ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
  });

  navLinksEl.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinksEl.classList.remove('open');
      mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
    });
  });

  // ── Smooth Scrolling ──────────────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = header.offsetHeight + 8;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
      }
    });
  });

  // ── Fade-in on scroll ─────────────────────────────────────────────────────
  const fadeEls = document.querySelectorAll('.fade-in');
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  fadeEls.forEach(el => fadeObserver.observe(el));

  // ── Typewriter Effect ─────────────────────────────────────────────────────
  const roles = ['Data Analyst', 'ML Engineer', 'Data Visualization Expert', 'Problem Solver'];
  let roleIdx = 0, charIdx = 0, deleting = false;
  const typeEl = document.getElementById('typewriter-text');

  function type() {
    if (!typeEl) return;
    const current = roles[roleIdx];
    if (deleting) {
      typeEl.textContent = current.substring(0, charIdx--);
      if (charIdx < 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; setTimeout(type, 400); return; }
      setTimeout(type, 50);
    } else {
      typeEl.textContent = current.substring(0, charIdx++);
      if (charIdx > current.length) { deleting = true; setTimeout(type, 1800); return; }
      setTimeout(type, 90);
    }
  }
  setTimeout(type, 600);

  // ── Dark / Light Mode Toggle ──────────────────────────────────────────────
  const themeBtn = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') applyDark();

  themeBtn.addEventListener('click', () => {
    if (document.body.classList.contains('dark-mode')) {
      document.body.classList.remove('dark-mode');
      themeBtn.innerHTML = '<i class="fas fa-moon"></i><span>Dark</span>';
      localStorage.setItem('theme', 'light');
    } else {
      applyDark();
      localStorage.setItem('theme', 'dark');
    }
  });

  function applyDark() {
    document.body.classList.add('dark-mode');
    themeBtn.innerHTML = '<i class="fas fa-sun"></i><span>Light</span>';
  }

  // ── Project Filter Bar ────────────────────────────────────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        const cats = card.dataset.category || '';
        if (filter === 'all' || cats.includes(filter)) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ── Admin Modal ───────────────────────────────────────────────────────────
  document.getElementById('adminBtn').addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('loginModal').style.display = 'flex';
    // GA tracked in the GA block above
  });
  document.getElementById('loginModal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
  });

  // Close CV modal on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.getElementById('cvModal').style.display = 'none';
      closeModal();
    }
  });

  // ── GA Event Tracking ─────────────────────────────────────────────────────

  // CV Download
  document.querySelector('.cv-download-button')?.addEventListener('click', () => {
    if (typeof gtag !== 'undefined') gtag('event', 'cv_download', {
      event_category: 'engagement', event_label: 'CV Button'
    });
  });

  // GitHub profile (about section social link)
  document.querySelector('.social-links a[href*="github.com"]')?.addEventListener('click', () => {
    if (typeof gtag !== 'undefined') gtag('event', 'github_click', {
      event_category: 'social', event_label: 'GitHub Profile'
    });
  });

  // LinkedIn profile (about section social link)
  document.querySelector('.social-links a[href*="linkedin.com"]')?.addEventListener('click', () => {
    if (typeof gtag !== 'undefined') gtag('event', 'linkedin_click', {
      event_category: 'social', event_label: 'LinkedIn Profile'
    });
  });

  // Medium profile
  document.querySelector('.social-links a[href*="medium.com"]')?.addEventListener('click', () => {
    if (typeof gtag !== 'undefined') gtag('event', 'medium_click', {
      event_category: 'social', event_label: 'Medium Profile'
    });
  });

  // Email link (about section)
  document.querySelector('.social-links a[href^="mailto:"]')?.addEventListener('click', () => {
    if (typeof gtag !== 'undefined') gtag('event', 'email_click', {
      event_category: 'contact', event_label: 'Email Link - About'
    });
  });

  // Phone click (contact section)
  document.querySelector('a[href^="tel:"]')?.addEventListener('click', () => {
    if (typeof gtag !== 'undefined') gtag('event', 'phone_click', {
      event_category: 'contact', event_label: 'Phone Number'
    });
  });

  // Email link (contact section)
  document.querySelector('#contact a[href^="mailto:"]')?.addEventListener('click', () => {
    if (typeof gtag !== 'undefined') gtag('event', 'email_click', {
      event_category: 'contact', event_label: 'Email Link - Contact Section'
    });
  });

  // Project GitHub repo clicks — track each project individually
  document.querySelectorAll('.project-card .github-link a').forEach(link => {
    link.addEventListener('click', () => {
      const title = link.closest('.project-card')?.querySelector('h3')?.textContent?.trim();
      if (typeof gtag !== 'undefined') gtag('event', 'project_click', {
        event_category: 'projects', event_label: title || 'Unknown Project'
      });
    });
  });

  // Publication paper clicks
  document.querySelectorAll('#publications .github-link a').forEach(link => {
    link.addEventListener('click', () => {
      const title = link.closest('.project-card')?.querySelector('h3')?.textContent?.trim();
      if (typeof gtag !== 'undefined') gtag('event', 'publication_click', {
        event_category: 'publications', event_label: title || 'Unknown Paper'
      });
    });
  });

  // Internship card clicks
  document.querySelectorAll('.timeline-card').forEach(link => {
    link.addEventListener('click', () => {
      const company = link.querySelector('.timeline-company')?.textContent?.trim();
      if (typeof gtag !== 'undefined') gtag('event', 'internship_click', {
        event_category: 'experience', event_label: company || 'Unknown Company'
      });
    });
  });

  // Certification view clicks
  document.querySelectorAll('.cert-view-btn').forEach(link => {
    link.addEventListener('click', () => {
      const title = link.closest('.cert-card')?.querySelector('h4')?.textContent?.trim();
      if (typeof gtag !== 'undefined') gtag('event', 'cert_view', {
        event_category: 'certifications', event_label: title || 'Unknown Cert'
      });
    });
  });

  // Platform logo clicks (Coursera, edX, etc.)
  document.querySelectorAll('.platform-logo').forEach(img => {
    img.closest('a')?.addEventListener('click', () => {
      if (typeof gtag !== 'undefined') gtag('event', 'platform_click', {
        event_category: 'certifications', event_label: img.alt || 'Platform'
      });
    });
  });

  // Project filter bar usage
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (typeof gtag !== 'undefined') gtag('event', 'project_filter', {
        event_category: 'engagement', event_label: btn.dataset.filter
      });
    });
  });

  // Dark mode toggle
  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    const mode = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
    if (typeof gtag !== 'undefined') gtag('event', 'theme_toggle', {
      event_category: 'engagement', event_label: mode
    });
  });

  // Admin login modal open
  document.getElementById('adminBtn')?.addEventListener('click', () => {
    if (typeof gtag !== 'undefined') gtag('event', 'admin_modal_open', {
      event_category: 'admin', event_label: 'Admin Login Opened'
    });
  });

});

// ── Modal helpers (global scope for inline onclick) ───────────────────────
function closeModal() {
  document.getElementById('loginModal').style.display = 'none';
}

function openCvModal(e) {
  e.preventDefault();
  const modal = document.getElementById('cvModal');
  const frame = document.getElementById('cvFrame');
  // Lazy-load the iframe src only on first open
  if (!frame.src || frame.src === window.location.href) {
    frame.src = frame.dataset.src;
  }
  modal.style.display = 'flex';
  if (typeof gtag !== 'undefined') gtag('event', 'cv_view', {
    event_category: 'engagement', event_label: 'CV Modal Opened'
  });
}

function closeCvModal(e) {
  if (e.target === document.getElementById('cvModal')) {
    document.getElementById('cvModal').style.display = 'none';
  }
}

function togglePassword(icon) {
  const input = icon.previousElementSibling;
  input.type = input.type === 'password' ? 'text' : 'password';
  icon.classList.toggle('fa-eye-slash');
}

function validateModalLogin() {
  const password = document.getElementById('adminPassword').value;
  const error = document.getElementById('loginError');
  if (password === 'SARAVANAKUMAR1310') {
    if (typeof gtag !== 'undefined') gtag('event', 'admin_login_success', {
      event_category: 'admin', event_label: 'Admin Login Success'
    });
    window.location.href = 'dashboard.html';
  } else {
    if (typeof gtag !== 'undefined') gtag('event', 'admin_login_failed', {
      event_category: 'admin', event_label: 'Admin Login Failed'
    });
    error.textContent = '❌ Incorrect password';
  }
}
