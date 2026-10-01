/**
 * NexusTech Landing Page JavaScript
 * Handles navigation, theme switching, animated counters,
 * active scroll spying, contact form validation, and interactive UI states.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. DOM Elements
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const themeToggle = document.getElementById('theme-toggle');
  const backToTopBtn = document.getElementById('back-to-top');
  const statNumbers = document.querySelectorAll('.stat-number');
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const formAlert = document.getElementById('form-alert');

  // ==========================================
  // 2. THEME TOGGLE (Dark / Light Mode)
  // ==========================================
  const savedTheme = localStorage.getItem('nexus_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

  document.documentElement.setAttribute('data-theme', initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('nexus_theme', newTheme);
    });
  }

  // ==========================================
  // 3. MOBILE MENU TOGGLE
  // ==========================================
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking any nav link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  }

  // ==========================================
  // 4. NAVBAR SCROLL EFFECT & BACK-TO-TOP
  // ==========================================
  const handleScroll = () => {
    const scrollPos = window.scrollY;

    // Sticky navbar styling
    if (scrollPos > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollPos > 400) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.pointerEvents = 'auto';
      } else {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.pointerEvents = 'none';
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ==========================================
  // 5. SCROLL SPY (ACTIVE NAV LINK)
  // ==========================================
  const sections = document.querySelectorAll('section[id]');

  const highlightNavOnScroll = () => {
    const scrollY = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const targetLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (targetLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach((link) => link.classList.remove('active'));
          targetLink.classList.add('active');
        }
      }
    });
  };

  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });

  // ==========================================
  // 6. ANIMATED COUNTER ON SCROLL (ABOUT SECTION)
  // ==========================================
  let countersAnimated = false;

  const animateCounters = () => {
    statNumbers.forEach((counter) => {
      const target = +counter.getAttribute('data-target');
      const duration = 1800; // ms
      const stepTime = 25;
      const totalSteps = duration / stepTime;
      const increment = target / totalSteps;
      let currentVal = 0;

      const timer = setInterval(() => {
        currentVal += increment;
        if (currentVal >= target) {
          counter.textContent = target;
          clearInterval(timer);
        } else {
          counter.textContent = Math.ceil(currentVal);
        }
      }, stepTime);
    });
  };

  const statsSection = document.querySelector('.about-stats-col');
  if (statsSection) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !countersAnimated) {
            countersAnimated = true;
            animateCounters();
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(statsSection);
  }

  // ==========================================
  // 7. CONTACT FORM VALIDATION & SUBMISSION
  // ==========================================
  if (contactForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');

    const validateEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // Clear input errors on input
    [nameInput, emailInput, messageInput].forEach((input) => {
      input.addEventListener('input', () => {
        input.classList.remove('invalid');
        const errSpan = document.getElementById(`${input.id}-error`);
        if (errSpan) errSpan.textContent = '';
      });
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        nameInput.classList.add('invalid');
        nameError.textContent = 'გთხოვთ მიუთითოთ სახელი';
        isValid = false;
      } else if (nameInput.value.trim().length < 2) {
        nameInput.classList.add('invalid');
        nameError.textContent = 'სახელი უნდა შედგებოდეს მინიმუმ 2 სიმბოლოსგან';
        isValid = false;
      } else {
        nameInput.classList.remove('invalid');
        nameError.textContent = '';
      }

      // Validate Email
      if (!emailInput.value.trim()) {
        emailInput.classList.add('invalid');
        emailError.textContent = 'გთხოვთ მიუთითოთ ელ-ფოსტის მისამართი';
        isValid = false;
      } else if (!validateEmail(emailInput.value.trim())) {
        emailInput.classList.add('invalid');
        emailError.textContent = 'გთხოვთ შეიყვანოთ სწორი ელ-ფოსტა';
        isValid = false;
      } else {
        emailInput.classList.remove('invalid');
        emailError.textContent = '';
      }

      // Validate Message
      if (!messageInput.value.trim()) {
        messageInput.classList.add('invalid');
        messageError.textContent = 'გთხოვთ შეიყვანოთ თქვენი შეტყობინება';
        isValid = false;
      } else if (messageInput.value.trim().length < 8) {
        messageInput.classList.add('invalid');
        messageError.textContent = 'შეტყობინება უნდა შედგებოდეს მინიმუმ 8 სიმბოლოსგან';
        isValid = false;
      } else {
        messageInput.classList.remove('invalid');
        messageError.textContent = '';
      }

      if (!isValid) return;

      // Show Loading State
      const btnText = submitBtn.querySelector('.btn-text');
      const btnSpinner = submitBtn.querySelector('.btn-spinner');

      submitBtn.disabled = true;
      btnText.style.display = 'none';
      btnSpinner.style.display = 'inline-block';

      // Simulate API call / form submission
      setTimeout(() => {
        submitBtn.disabled = false;
        btnText.style.display = 'inline-block';
        btnSpinner.style.display = 'none';

        // Show Success Alert
        formAlert.style.display = 'flex';
        contactForm.reset();

        // Auto-hide alert after 5 seconds
        setTimeout(() => {
          formAlert.style.display = 'none';
        }, 5000);
      }, 1000);
    });
  }
});
