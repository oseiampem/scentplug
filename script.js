/* ============================================
   THE SCENT PLUG — script.js
   Interactive functionality for luxury perfume site
============================================= */

(function () {
  'use strict';

  /* ------------------------------------------
     1. LOADING SCREEN
  ------------------------------------------ */
  const loader = document.getElementById('loader');

  window.addEventListener('load', () => {
    document.body.classList.add('loading');
    // Minimum display time for the loading animation
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.classList.remove('loading');
    }, 1800);
  });

  /* ------------------------------------------
     2. NAVBAR — Scroll Effect & Active Link
  ------------------------------------------ */
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('.section, .hero');
  const navLinks = document.querySelectorAll('.nav-link');

  function handleNavbarScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // Highlight active nav link based on scroll position
  function updateActiveLink() {
    let current = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', () => {
    handleNavbarScroll();
    updateActiveLink();
  }, { passive: true });

  /* ------------------------------------------
     3. MOBILE MENU TOGGLE
  ------------------------------------------ */
  const menuToggle = document.getElementById('menuToggle');
  const navLinksContainer = document.getElementById('navLinks');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('open');
    navLinksContainer.classList.toggle('open');
  });

  // Close mobile menu when a link is clicked
  navLinksContainer.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('open');
      navLinksContainer.classList.remove('open');
    });
  });

  /* ------------------------------------------
     4. TAB SYSTEM
  ------------------------------------------ */
  document.querySelectorAll('.tabs').forEach((tabGroup) => {
    const tabs = tabGroup.querySelectorAll('.tab');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const targetId = tab.dataset.tab;

        // Deactivate all tabs in this group
        tabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');

        // Show corresponding panel (find sibling panels)
        const parent = tabGroup.closest('.container');
        parent.querySelectorAll('.tab-panel').forEach((panel) => {
          panel.classList.remove('active');
        });

        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
          targetPanel.classList.add('active');
          // Re-trigger reveal animations for newly visible cards
          targetPanel.querySelectorAll('.reveal').forEach((el) => {
            el.classList.remove('visible');
            // Force reflow, then add class
            void el.offsetWidth;
            setTimeout(() => el.classList.add('visible'), 50);
          });
        }
      });
    });
  });

  /* ------------------------------------------
     5. SCROLL REVEAL (Intersection Observer)
  ------------------------------------------ */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  /* ------------------------------------------
     6. HERO PARTICLES
  ------------------------------------------ */
  const particlesContainer = document.getElementById('heroParticles');

  function createParticles(count) {
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = (6 + Math.random() * 10) + 's';
      particle.style.animationDelay = Math.random() * 8 + 's';
      particle.style.width = (1 + Math.random() * 2) + 'px';
      particle.style.height = particle.style.width;
      particlesContainer.appendChild(particle);
    }
  }

  // Reduce particle count on mobile for performance
  const isMobile = window.innerWidth < 768;
  createParticles(isMobile ? 15 : 35);

  /* ------------------------------------------
     7. CART FUNCTIONALITY (UI Only)
  ------------------------------------------ */
  let cartCount = 0;
  const cartCountEl = document.querySelector('.cart-count');

  function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2800);
  }

  document.querySelectorAll('.add-to-cart').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.product-card');
      const name = card.dataset.name;

      cartCount++;
      cartCountEl.textContent = cartCount;

      // Brief button feedback
      btn.textContent = 'Added ✓';
      btn.style.background = 'rgba(201, 168, 76, 0.3)';
      btn.style.color = '#e0c068';

      setTimeout(() => {
        btn.textContent = 'Add to Cart';
        btn.style.background = '';
        btn.style.color = '';
      }, 1200);

      showToast(`${name} added to cart`);
    });
  });

  // Cart button click feedback
  document.querySelector('.cart-btn').addEventListener('click', () => {
    if (cartCount === 0) {
      showToast('Your cart is empty');
    } else {
      showToast(`You have ${cartCount} item${cartCount > 1 ? 's' : ''} in your cart`);
    }
  });

  /* ------------------------------------------
     8. SPECIAL ORDER FORM HANDLING
  ------------------------------------------ */
  const specialOrderForm = document.getElementById('specialOrderForm');

  specialOrderForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('soName').value.trim();
    const phone = document.getElementById('soPhone').value.trim();
    const perfume = document.getElementById('soPerfume').value.trim();
    const message = document.getElementById('soMessage').value.trim();

    if (!name || !phone || !perfume) {
      showToast('Please fill in all required fields');
      return;
    }

    // Build WhatsApp message with form data
    const waMessage = encodeURIComponent(
      `Hello The Scent Plug!\n\n` +
      `*Special Order Request*\n` +
      `Name: ${name}\n` +
      `Phone: ${phone}\n` +
      `Perfume: ${perfume}\n` +
      `${message ? 'Details: ' + message : ''}`
    );

    // Open WhatsApp with the pre-filled message
    window.open(`https://wa.me/233535402722?text=${waMessage}`, '_blank');

    // Reset form and confirm
    specialOrderForm.reset();
    showToast('Redirecting to WhatsApp...');
  });

  /* ------------------------------------------
     9. SMOOTH SCROLL for Anchor Links
  ------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80; // navbar height
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

})();
