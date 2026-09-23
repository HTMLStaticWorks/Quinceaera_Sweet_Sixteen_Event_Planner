/**
 * LUNA & LACE EVENTS — Main JavaScript
 * Quinceañera & Sweet Sixteen Luxury Celebration Planner
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ------------------------------------------------------------------------
   * 1. Light / Dark Theme Manager (localStorage + system preference)
   * ------------------------------------------------------------------------ */
  const THEME_KEY = 'luna_lace_theme';
  const htmlEl = document.documentElement;

  const getPreferredTheme = () => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const updateThemeUI = (theme) => {
    htmlEl.setAttribute('data-bs-theme', theme);
    document.querySelectorAll('.btn-theme-toggle').forEach(btn => {
      const icon = btn.querySelector('i');
      if (icon) {
        if (theme === 'dark') {
          icon.className = 'bi bi-sun-fill text-warning';
          btn.setAttribute('aria-label', 'Switch to light theme');
          btn.setAttribute('title', 'Switch to light theme');
        } else {
          icon.className = 'bi bi-moon-stars-fill text-plum';
          btn.setAttribute('aria-label', 'Switch to dark theme');
          btn.setAttribute('title', 'Switch to dark theme');
        }
      }
    });
  };

  // Initialize Theme immediately
  const initialTheme = getPreferredTheme();
  updateThemeUI(initialTheme);

  // Bind Toggle Buttons
  document.querySelectorAll('.btn-theme-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentTheme = htmlEl.getAttribute('data-bs-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      localStorage.setItem(THEME_KEY, newTheme);
      updateThemeUI(newTheme);
    });
  });

  // Listen to system preference changes if user hasn't explicitly set a preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_KEY)) {
      updateThemeUI(e.matches ? 'dark' : 'light');
    }
  });

  /* ------------------------------------------------------------------------
   * 1b. RTL / LTR Direction Manager (localStorage persistence)
   * ------------------------------------------------------------------------ */
  const RTL_KEY = 'luna_lace_direction';

  const getPreferredDirection = () => {
    const savedDir = localStorage.getItem(RTL_KEY);
    if (savedDir === 'rtl' || savedDir === 'ltr') {
      return savedDir;
    }
    return 'ltr';
  };

  const updateDirectionUI = (dir) => {
    htmlEl.setAttribute('dir', dir);
    document.querySelectorAll('.btn-rtl-toggle').forEach(btn => {
      // Inside RTL button, strictly "RTL" text is displayed as requested
      btn.textContent = 'RTL';
      if (dir === 'rtl') {
        btn.classList.add('active-rtl');
        btn.setAttribute('aria-label', 'Switch to LTR layout');
        btn.setAttribute('title', 'Switch to LTR layout');
      } else {
        btn.classList.remove('active-rtl');
        btn.setAttribute('aria-label', 'Switch to RTL layout');
        btn.setAttribute('title', 'Switch to RTL layout');
      }
    });
  };

  // Initialize Direction immediately
  const initialDir = getPreferredDirection();
  updateDirectionUI(initialDir);

  // Bind RTL Toggle Buttons
  document.querySelectorAll('.btn-rtl-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentDir = htmlEl.getAttribute('dir') || 'ltr';
      const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
      localStorage.setItem(RTL_KEY, newDir);
      updateDirectionUI(newDir);
    });
  });

  /* ------------------------------------------------------------------------
   * 2. Sticky Navbar & Header Shrink
   * ------------------------------------------------------------------------ */
  const navbar = document.querySelector('.luna-navbar');
  const backToTopBtn = document.querySelector('.back-to-top');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (navbar) {
      if (scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ------------------------------------------------------------------------
   * 3. Portfolio Masonry Filter & Dynamic Lightbox
   * ------------------------------------------------------------------------ */
  const filterBtns = document.querySelectorAll('.portfolio-filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter') || '*';

      portfolioItems.forEach(item => {
        if (filterVal === '*' || item.classList.contains(filterVal.replace('.', ''))) {
          item.style.display = 'block';
          item.style.animation = 'fadeIn 0.4s ease-out forwards';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Lightbox functionality
  const lightboxModal = document.getElementById('lunaLightboxModal');
  const lightboxImg = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
  const lightboxNextBtn = document.getElementById('lightboxNextBtn');

  let activeLightboxIndex = 0;
  let currentGalleryItems = [];

  const updateCurrentGallery = () => {
    currentGalleryItems = Array.from(document.querySelectorAll('.open-lightbox')).filter(el => {
      const parent = el.closest('.portfolio-item');
      return !parent || parent.style.display !== 'none';
    });
  };

  const showLightboxImage = (index) => {
    if (!currentGalleryItems.length) return;
    if (index < 0) index = currentGalleryItems.length - 1;
    if (index >= currentGalleryItems.length) index = 0;
    activeLightboxIndex = index;

    const el = currentGalleryItems[activeLightboxIndex];
    const src = el.getAttribute('data-img') || el.getAttribute('href') || (el.querySelector('img') ? el.querySelector('img').src : '');
    const caption = el.getAttribute('data-caption') || (el.querySelector('img') ? el.querySelector('img').alt : 'Celebration Moment');

    if (lightboxImg) lightboxImg.src = src;
    if (lightboxCaption) lightboxCaption.textContent = caption;
  };

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.open-lightbox');
    if (trigger) {
      e.preventDefault();
      updateCurrentGallery();
      activeLightboxIndex = currentGalleryItems.indexOf(trigger);
      if (activeLightboxIndex === -1) activeLightboxIndex = 0;
      showLightboxImage(activeLightboxIndex);
      if (lightboxModal) {
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }
  });

  const closeLightbox = () => {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  if (lightboxPrevBtn) {
    lightboxPrevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showLightboxImage(activeLightboxIndex - 1);
    });
  }

  if (lightboxNextBtn) {
    lightboxNextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showLightboxImage(activeLightboxIndex + 1);
    });
  }

  // Keyboard navigation for Lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showLightboxImage(activeLightboxIndex - 1);
    if (e.key === 'ArrowRight') showLightboxImage(activeLightboxIndex + 1);
  });

  /* ------------------------------------------------------------------------
   * 4. Password Toggle
   * ------------------------------------------------------------------------ */
  document.querySelectorAll('.password-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.closest('.password-toggle-wrapper').querySelector('input');
      const icon = btn.querySelector('i');
      if (input) {
        if (input.type === 'password') {
          input.type = 'text';
          if (icon) icon.className = 'bi bi-eye-slash-fill';
          btn.setAttribute('aria-label', 'Hide password');
        } else {
          input.type = 'password';
          if (icon) icon.className = 'bi bi-eye-fill';
          btn.setAttribute('aria-label', 'Show password');
        }
      }
    });
  });

  /* ------------------------------------------------------------------------
   * 5. Contact / Inquiry Form Validation & Success State
   * ------------------------------------------------------------------------ */
  const contactForm = document.getElementById('celebrationInquiryForm');
  const inquirySuccessCard = document.getElementById('inquirySuccessCard');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!contactForm.checkValidity()) {
        contactForm.classList.add('was-validated');
        const firstInvalid = contactForm.querySelector(':invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Collect form summary for celebration card
      const name = document.getElementById('clientName')?.value || 'Valued Client';
      const eventType = document.getElementById('celebrationType')?.value || 'Celebration';
      const eventDate = document.getElementById('eventDate')?.value || 'Upcoming Date';
      const guestCount = document.getElementById('guestCount')?.value || '150';

      const summaryPlaceholder = document.getElementById('inquirySummaryText');
      if (summaryPlaceholder) {
        summaryPlaceholder.innerHTML = `Thank you, <strong>${name}</strong>! We have received your inquiry for your <strong>${eventType}</strong> on <strong>${eventDate}</strong> (est. ${guestCount} guests). Our master celebration planner will reach out within 24 business hours to curate your unforgettable consultation.`;
      }

      contactForm.style.display = 'none';
      if (inquirySuccessCard) {
        inquirySuccessCard.style.display = 'block';
        inquirySuccessCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  /* ------------------------------------------------------------------------
   * 6. Authentication Forms (Login, Signup, Forgot Password - No Dashboard)
   * ------------------------------------------------------------------------ */
  const loginForm = document.getElementById('loginForm');
  const loginAlert = document.getElementById('loginDemoAlert');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!loginForm.checkValidity()) {
        loginForm.classList.add('was-validated');
        return;
      }
      if (loginAlert) {
        loginAlert.classList.remove('d-none');
        loginAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  const signupForm = document.getElementById('signupForm');
  const signupAlert = document.getElementById('signupDemoAlert');

  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const pwd = document.getElementById('signupPassword')?.value;
      const confirmPwd = document.getElementById('signupConfirmPassword')?.value;

      if (pwd !== confirmPwd) {
        const confirmEl = document.getElementById('signupConfirmPassword');
        if (confirmEl) {
          confirmEl.setCustomValidity('Passwords do not match');
        }
      } else {
        const confirmEl = document.getElementById('signupConfirmPassword');
        if (confirmEl) confirmEl.setCustomValidity('');
      }

      if (!signupForm.checkValidity()) {
        signupForm.classList.add('was-validated');
        return;
      }

      if (signupAlert) {
        signupAlert.classList.remove('d-none');
        signupAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  const forgotPasswordForm = document.getElementById('forgotPasswordForm');
  const forgotSuccessAlert = document.getElementById('forgotSuccessAlert');

  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!forgotPasswordForm.checkValidity()) {
        forgotPasswordForm.classList.add('was-validated');
        return;
      }
      forgotPasswordForm.style.display = 'none';
      if (forgotSuccessAlert) {
        forgotSuccessAlert.classList.remove('d-none');
      }
    });
  }

  /* ------------------------------------------------------------------------
   * 7. Coming Soon Countdown
   * ------------------------------------------------------------------------ */
  const countdownContainer = document.getElementById('countdownTimer');
  if (countdownContainer) {
    // Set target date to 150 days in future
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 150);

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        countdownContainer.innerHTML = '<h3 class="font-serif text-gold">The Celebration Has Begun!</h3>';
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      const elDays = document.getElementById('countdownDays');
      const elHours = document.getElementById('countdownHours');
      const elMins = document.getElementById('countdownMinutes');
      const elSecs = document.getElementById('countdownSeconds');

      if (elDays) elDays.textContent = String(days).padStart(2, '0');
      if (elHours) elHours.textContent = String(hours).padStart(2, '0');
      if (elMins) elMins.textContent = String(minutes).padStart(2, '0');
      if (elSecs) elSecs.textContent = String(seconds).padStart(2, '0');
    };

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  /* ------------------------------------------------------------------------
   * 8. GSAP Scroll & Entrance Animations (respects reduced motion)
   * ------------------------------------------------------------------------ */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (window.gsap && !prefersReducedMotion) {
    // Hero Entrance
    gsap.from('.hero-content > *', {
      duration: 1,
      y: 35,
      opacity: 0,
      stagger: 0.15,
      ease: 'power3.out'
    });

    // Subtle fade in on cards when in viewport
    const revealCards = document.querySelectorAll('.celebration-card, .package-card, .process-step-card');
    if ('IntersectionObserver' in window && revealCards.length) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            gsap.fromTo(entry.target, 
              { y: 30, opacity: 0 }, 
              { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
            );
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      revealCards.forEach(card => observer.observe(card));
    }
  }

  // Active link highlighters
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-nav .nav-link, .luna-dropdown-menu .dropdown-item').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ------------------------------------------------------------------------
   * 9. Client Dashboard Interactivity
   * ------------------------------------------------------------------------ */
  const initClientDashboard = () => {
    const checklistItems = document.querySelectorAll('.checklist-item');
    const progressBar = document.getElementById('checklistProgressBar');
    const progressText = document.getElementById('checklistProgressPercent');
    const countText = document.getElementById('checklistCompletedCount');
    const overallProgressMeter = document.getElementById('overallMilestoneProgress');

    if (checklistItems.length) {
      const updateChecklistStats = () => {
        const total = checklistItems.length;
        const completed = document.querySelectorAll('.checklist-item.is-completed').length;
        const percent = Math.round((completed / total) * 100);

        if (progressBar) progressBar.style.width = `${percent}%`;
        if (progressText) progressText.textContent = `${percent}%`;
        if (countText) countText.textContent = `${completed} of ${total} Milestones Completed`;
        if (overallProgressMeter) overallProgressMeter.textContent = `${percent}%`;
      };

      checklistItems.forEach(item => {
        const checkbox = item.querySelector('.custom-check-box');
        if (!checkbox) return;

        checkbox.addEventListener('click', (e) => {
          e.stopPropagation();
          const isChecked = checkbox.classList.toggle('checked');
          if (isChecked) {
            checkbox.innerHTML = '<i class="bi bi-check-lg"></i>';
            item.classList.add('is-completed');
          } else {
            checkbox.innerHTML = '';
            item.classList.remove('is-completed');
          }
          updateChecklistStats();
        });
      });

      // Filter Checklist Tasks
      const filterBtns = document.querySelectorAll('.checklist-filter-btn');
      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          filterBtns.forEach(b => b.classList.remove('active', 'btn-burgundy'));
          btn.classList.add('active');

          const filter = btn.getAttribute('data-filter');
          checklistItems.forEach(item => {
            if (filter === 'all') {
              item.style.display = 'block';
            } else if (filter === 'completed') {
              item.style.display = item.classList.contains('is-completed') ? 'block' : 'none';
            } else if (filter === 'pending') {
              item.style.display = !item.classList.contains('is-completed') ? 'block' : 'none';
            }
          });
        });
      });
    }

    // Timeline Filter
    const timelineFilterBtns = document.querySelectorAll('.timeline-filter-btn');
    const timelinePoints = document.querySelectorAll('.timeline-point');

    if (timelineFilterBtns.length && timelinePoints.length) {
      timelineFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          timelineFilterBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const role = btn.getAttribute('data-role');
          timelinePoints.forEach(point => {
            const pointRole = point.getAttribute('data-role');
            if (role === 'all' || pointRole === role || pointRole === 'all') {
              point.style.display = 'block';
            } else {
              point.style.display = 'none';
            }
          });
        });
      });
    }

    // In-page smooth scrolling for dashboard sticky nav
    const dashNavLinks = document.querySelectorAll('.dashboard-nav-link');
    dashNavLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
          e.preventDefault();
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            dashNavLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            const offset = 140;
            const topPos = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: topPos, behavior: 'smooth' });
          }
        }
      });
    });

    // Dashboard Mobile Sidebar Toggle
    const sidebar = document.getElementById('dashboardSidebar');
    const sidebarToggle = document.getElementById('dashboardSidebarToggle');
    const sidebarClose = document.getElementById('dashboardSidebarClose');
    const sidebarBackdrop = document.getElementById('dashboardSidebarBackdrop');

    const closeSidebar = () => {
      if (sidebar) sidebar.classList.remove('show');
      if (sidebarBackdrop) sidebarBackdrop.classList.remove('show');
    };

    if (sidebar && sidebarToggle) {
      sidebarToggle.addEventListener('click', (e) => {
        e.preventDefault();
        sidebar.classList.toggle('show');
        if (sidebarBackdrop) sidebarBackdrop.classList.toggle('show');
      });

      if (sidebarClose) {
        sidebarClose.addEventListener('click', (e) => {
          e.preventDefault();
          closeSidebar();
        });
      }

      if (sidebarBackdrop) {
        sidebarBackdrop.addEventListener('click', closeSidebar);
      }

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('show')) {
          closeSidebar();
        }
      });
    }
  };

  initClientDashboard();

});


