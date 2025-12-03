document.addEventListener('DOMContentLoaded', () => {
  
  // 1. DYNAMIC PARTICLES FUNCTION
  // We wrap this in a function so we can reload it when the theme changes
  function loadParticles(isDark) {
    if (typeof particlesJS !== 'undefined') {
        const particleColor = isDark ? "#FFD700" : "#007BFF"; // Gold for Dark, Blue for Light
        
        particlesJS("particles-js", {
            "particles": {
                "number": { "value": 60, "density": { "enable": true, "value_area": 800 } }, 
                "color": { "value": particleColor }, 
                "shape": { "type": "circle" },
                "opacity": { "value": 0.5, "random": false },
                "size": { "value": 3, "random": true },
                "line_linked": { 
                    "enable": true, 
                    "distance": 150, 
                    "color": particleColor, // Line color matches particle color
                    "opacity": 0.2, 
                    "width": 1 
                },
                "move": { "enable": true, "speed": 2, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": true, "mode": "push" }, "resize": true },
                "modes": { "grab": { "distance": 140, "line_linked": { "opacity": 1 } }, "push": { "particles_nb": 4 } }
            },
            "retina_detect": true
        });
    }
  }

  // 2. VANILLA TILT INITIALIZATION
  if (typeof VanillaTilt !== 'undefined') {
      VanillaTilt.init(document.querySelectorAll(".project-focus-card, .certificate-tile"), {
          max: 10,       
          speed: 400,    
          glare: true,   
          "max-glare": 0.3, 
          scale: 1.02    
      });
  }

  // 3. DARK MODE TOGGLE & PARTICLE RELOAD
  const toggleBtn = document.getElementById('theme-toggle');
  
  // Helper function to apply theme AND reload particles
  function setDarkTheme(isDark) {
    if (isDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        if(toggleBtn) toggleBtn.style.color = '#FFD700'; // Set icon to Gold
    } else {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        if(toggleBtn) toggleBtn.style.color = ''; // Reset to default
    }
    // Reload particles with the new color preference
    loadParticles(isDark);
  }

  // Check saved theme on load
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
      setDarkTheme(true);
  } else {
      // If no saved theme (or light), load default blue particles
      loadParticles(false);
  }

  if(toggleBtn) {
      toggleBtn.addEventListener('click', () => {
          const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
          setDarkTheme(!isDark);
      });
  }

  // ===== Navbar Scroll Behavior =====
  const navbar = document.querySelector('.navbar');
  let lastScrollTop = 0;
  const scrollThreshold = 80; 

  if (navbar) {
    window.addEventListener('scroll', () => {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
        navbar.classList.add('scrolled-down'); 
      } else {
        navbar.classList.remove('scrolled-down'); 
      }
      if (scrollTop > 50) { 
        navbar.classList.add('scrolled'); 
      } else {
        navbar.classList.remove('scrolled');
      }
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; 
    }, false);
  }

  // ===== Typewriter Effect =====
  const nameTypewriterElement = document.querySelector('h1.hero-name .typewriter-text');
  const nameToType = "Aditya Nitin Bhavsar";
  let nameCharIndex = 0;

  function typeNameEffect() {
    if (!nameTypewriterElement) {
        if (animatedRolesElement) setTimeout(animateRoles, 500);
        return;
    }
    if (nameCharIndex < nameToType.length) {
      nameTypewriterElement.textContent += nameToType.charAt(nameCharIndex);
      nameCharIndex++;
      setTimeout(typeNameEffect, 100);
    } else {
      const nameContainer = nameTypewriterElement.closest('.typewriter-text-container');
      if(nameContainer) nameContainer.classList.add('typed-name-complete');
      if (animatedRolesElement) setTimeout(animateRoles, 500); 
    }
  }

  if (nameTypewriterElement) {
    nameTypewriterElement.textContent = ''; 
    setTimeout(typeNameEffect, 500); 
  } else { 
     const staticNameElement = document.querySelector('h1.hero-name');
     if(staticNameElement && !nameTypewriterElement) { 
        staticNameElement.textContent = nameToType;
     }
     if (animatedRolesElement) setTimeout(animateRoles, 500);
  }

  // ===== Animated Roles =====
  const rolesToAnimate = ["A Data Scientist", "An AI Developer", "An ML Engineer", "A Data Analyst", "A Python Programmer", "A Cloud Enthusiast"];
  const animatedRolesElement = document.getElementById('animated-roles');
  let roleIndex = 0;
  let currentRoleCharIndex = 0;
  let isDeletingRoles = false;
  const roleTypingSpeed = 100;
  const roleDeletingSpeed = 50;
  const pauseBetweenAnimatedRoles = 2000; 
  const pauseBeforeTypingRole = 300; 

  function animateRoles() {
    if (!animatedRolesElement) return;
    const currentRoleText = rolesToAnimate[roleIndex];
    if (isDeletingRoles) {
      animatedRolesElement.textContent = currentRoleText.substring(0, currentRoleCharIndex - 1);
      currentRoleCharIndex--;
      if (currentRoleCharIndex === 0) {
        isDeletingRoles = false;
        roleIndex = (roleIndex + 1) % rolesToAnimate.length;
        setTimeout(animateRoles, pauseBeforeTypingRole);
      } else {
        setTimeout(animateRoles, roleDeletingSpeed);
      }
    } else {
      animatedRolesElement.textContent = currentRoleText.substring(0, currentRoleCharIndex + 1);
      currentRoleCharIndex++;
      if (currentRoleCharIndex === currentRoleText.length) {
        isDeletingRoles = true;
        setTimeout(() => { 
             setTimeout(animateRoles, pauseBetweenAnimatedRoles);
        }, 500); 
      } else {
        setTimeout(animateRoles, roleTypingSpeed);
      }
    }
  }

  // ===== Intersection Observer =====
  const observerCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains('reveal-on-scroll')) {
          entry.target.classList.add('show'); 
          const innerAnimatedElements = entry.target.querySelectorAll('.section-content-wrapper .animate-on-reveal');
          innerAnimatedElements.forEach(el => {
            let delay = el.dataset.animationDelay || '0s'; 
            if (el.classList.contains('stagger-item') && el.dataset.staggerDelayFactor) {
                const baseDelayForSection = 0;
                const factor = parseInt(el.dataset.staggerDelayFactor) || 0;
                delay = `${(baseDelayForSection) + (0.1 * factor)}s`; 
            }
            el.style.transitionDelay = delay;
          });
        } 
      }
    });
  };

  const animationObserver = new IntersectionObserver(observerCallback, { rootMargin: '0px', threshold: 0.15 });
  document.querySelectorAll('section.reveal-on-scroll').forEach(el => animationObserver.observe(el));

  // ===== Modal Functionality =====
  const modalOverlay = document.getElementById('modalOverlay');
  const projectCards = document.querySelectorAll('.project-focus-card[data-modal-target]'); 
  const closeButtons = document.querySelectorAll('.modal-close-btn');
  let previouslyFocusedElement = null;
  let currentlyOpenModal = null; 

  function openModal(modalId) {
    const modalToOpen = document.getElementById(modalId);
    if (!modalToOpen || !modalOverlay) return;
    previouslyFocusedElement = document.activeElement; 
    if (currentlyOpenModal && currentlyOpenModal !== modalToOpen) { 
        currentlyOpenModal.classList.remove('active');
        currentlyOpenModal.setAttribute('aria-hidden', 'true');
    }
    modalOverlay.classList.add('active');
    modalToOpen.classList.add('active'); 
    document.body.style.overflow = 'hidden';
    modalToOpen.setAttribute('aria-hidden', 'false');
    modalOverlay.setAttribute('aria-hidden', 'false');
    currentlyOpenModal = modalToOpen; 
  }

  function closeModal() {
    if (modalOverlay && currentlyOpenModal) { 
      modalOverlay.classList.remove('active');
      currentlyOpenModal.classList.remove('active'); 
      currentlyOpenModal.setAttribute('aria-hidden', 'true');
      modalOverlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (previouslyFocusedElement) previouslyFocusedElement.focus(); 
      currentlyOpenModal = null; 
    }
  }

  projectCards.forEach(card => {
    card.addEventListener('click', (event) => {
      if (event.target.closest('.project-external-link')) return;
      const modalId = card.dataset.modalTarget.substring(1);
      openModal(modalId);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
         e.preventDefault();
         if (e.target.closest('.project-external-link')) return;
         const modalId = card.dataset.modalTarget.substring(1);
         openModal(modalId);
      }
    });
  });

  closeButtons.forEach(button => button.addEventListener('click', closeModal));
  if (modalOverlay) modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  // Mobile Menu
  const mobileMenuButton = document.getElementById('mobileMenuToggle');
  const mainNavLinks = document.querySelector('nav .nav-links');
  if (mobileMenuButton && mainNavLinks) {
    mobileMenuButton.addEventListener('click', () => {
      mainNavLinks.classList.toggle('active'); 
      const isExpanded = mainNavLinks.classList.contains('active');
      mobileMenuButton.setAttribute('aria-expanded', isExpanded);
      mobileMenuButton.innerHTML = isExpanded ? '<span class="icon-close"></span>' : '<span class="icon-menu"></span>';
    });
  }
  
  // Update Year
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();
});
