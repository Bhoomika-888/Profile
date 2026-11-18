/**
 * ==========================================================================
 * BHOOMIKA - DEVELOPER PORTFOLIO JAVASCRIPT
 * Modern, Accessible, Zero-Dependency Vanilla Implementation
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Theme Toggle (Dark & Light Mode with LocalStorage & OS Preference)
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  const STORAGE_KEY = 'bhoomika_portfolio_theme';

  function getPreferredTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    // Default is dark per requirements, but check if OS strongly prefers light
    return 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);

    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', theme === 'dark' ? '#0a192f' : '#f8fafc');
    }

    if (themeToggleBtn) {
      themeToggleBtn.setAttribute(
        'title',
        theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
      );
      themeToggleBtn.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
      );
    }
  }

  // Initialize Theme
  applyTheme(getPreferredTheme());

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      showToast(`Switched to ${newTheme} mode`);
    });
  }

  // --------------------------------------------------------------------------
  // 2. Sticky Header & Active ScrollSpy Navigation
  // --------------------------------------------------------------------------
  const siteHeader = document.getElementById('header');
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function handleScroll() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Header shadow on scroll
    if (siteHeader) {
      if (scrollY > 30) {
        siteHeader.classList.add('header-scrolled');
      } else {
        siteHeader.classList.remove('header-scrolled');
      }
    }

    // ScrollSpy: Detect which section is currently in view
    let currentSectionId = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    // Update Desktop Nav Active Link
    desktopNavLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === `#${currentSectionId}`) {
        link.classList.add('active-link');
      } else {
        link.classList.remove('active-link');
      }
    });

    // Update Mobile Nav Active Link
    mobileNavLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === `#${currentSectionId}`) {
        link.classList.add('active-link');
      } else {
        link.classList.remove('active-link');
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // --------------------------------------------------------------------------
  // 3. Mobile Navigation Drawer
  // --------------------------------------------------------------------------
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');

  function openDrawer() {
    if (!mobileDrawer || !drawerBackdrop) return;
    mobileDrawer.classList.add('active');
    drawerBackdrop.classList.add('active');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    drawerBackdrop.setAttribute('aria-hidden', 'false');
    if (mobileMenuBtn) {
      mobileMenuBtn.setAttribute('aria-expanded', 'true');
    }
    document.body.style.overflow = 'hidden';

    // Focus on close button inside drawer for keyboard accessibility
    if (drawerCloseBtn) {
      drawerCloseBtn.focus();
    }
  }

  function closeDrawer() {
    if (!mobileDrawer || !drawerBackdrop) return;
    mobileDrawer.classList.remove('active');
    drawerBackdrop.classList.remove('active');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    drawerBackdrop.setAttribute('aria-hidden', 'true');
    if (mobileMenuBtn) {
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      mobileMenuBtn.focus();
    }
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', closeDrawer);
  }

  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', closeDrawer);
  }

  // Close drawer when clicking any mobile nav link
  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', closeDrawer);
  });

  // Close drawer on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('active')) {
      closeDrawer();
    }
  });

  // --------------------------------------------------------------------------
  // 4. Project Category Filtering Tabs
  // --------------------------------------------------------------------------
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.project-card');

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const filterValue = tab.getAttribute('data-filter');

      // Update Tab Active State
      filterTabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Filter Cards
      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = '';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 5. Smart Object Analyzer Modal Dialog
  // --------------------------------------------------------------------------
  const openModalBtn = document.getElementById('open-analyzer-modal');
  const projectModal = document.getElementById('project-modal');
  const closeModalBtn = document.getElementById('modal-close-btn');
  const dismissModalBtn = document.getElementById('modal-dismiss-btn');

  function openModal() {
    if (!projectModal) return;
    projectModal.classList.add('active');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (closeModalBtn) {
      closeModalBtn.focus();
    }
  }

  function closeModal() {
    if (!projectModal) return;
    projectModal.classList.remove('active');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (openModalBtn) {
      openModalBtn.focus();
    }
  }

  if (openModalBtn) {
    openModalBtn.addEventListener('click', openModal);
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  if (dismissModalBtn) {
    dismissModalBtn.addEventListener('click', closeModal);
  }

  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal && projectModal.classList.contains('active')) {
      closeModal();
    }
  });

  // --------------------------------------------------------------------------
  // 6. Copy Email to Clipboard with Toast Notification
  // --------------------------------------------------------------------------
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  let toastTimeout;

  function showToast(msg) {
    if (!toast) return;
    if (toastMessage) {
      toastMessage.textContent = msg;
    }
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = 'bhoomika0942@gmail.com';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email)
          .then(() => {
            showToast('Copied bhoomika0942@gmail.com to clipboard!');
          })
          .catch(() => {
            fallbackCopy(email);
          });
      } else {
        fallbackCopy(email);
      }
    });
  }

  function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast('Copied email to clipboard!');
    } catch (err) {
      showToast('Email: bhoomika0942@gmail.com');
    }
    document.body.removeChild(textArea);
  }

  // --------------------------------------------------------------------------
  // 7. Interactive Quick Message Form (Mailto Generator)
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('sender-name')?.value.trim() || '';
      const email = document.getElementById('sender-email')?.value.trim() || '';
      const subject = document.getElementById('message-subject')?.value.trim() || 'Inquiry for Bhoomika';
      const message = document.getElementById('message-body')?.value.trim() || '';

      if (!name || !email || !message) {
        showToast('Please fill out all required fields.');
        return;
      }

      const bodyText = `Hello Bhoomika,\n\n${message}\n\nFrom: ${name} (${email})`;
      const mailtoUrl = `mailto:bhoomika0942@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;

      // Open email client
      window.location.href = mailtoUrl;
      showToast('Opening your default email client...');
    });
  }

  // --------------------------------------------------------------------------
  // 8. Back to Top Button
  // --------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --------------------------------------------------------------------------
  // 9. Dynamic Current Year in Footer
  // --------------------------------------------------------------------------
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Log portfolio initialized
  console.log('%c<Bhoomika.dev />%c Portfolio initialized successfully.', 'color: #00f2fe; font-weight: bold; font-size: 14px;', 'color: #94a3b8;');
});
