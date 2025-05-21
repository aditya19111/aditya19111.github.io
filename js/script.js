document.addEventListener('DOMContentLoaded', () => {
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

  // ===== Typewriter Effect for Hero Name =====
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


  // ===== Animated Roles in Hero Section =====
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
    const rolesContainer = animatedRolesElement.parentElement;
    
    if (rolesContainer) rolesContainer.classList.add('role-cursor-active');

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
            if (isDeletingRoles && rolesContainer) {
                 setTimeout(animateRoles, pauseBetweenAnimatedRoles);
            }
        }, 500); 
      } else {
        setTimeout(animateRoles, roleTypingSpeed);
      }
    }
  }
  // Roles animation is triggered after name typewriter finishes.

  // ===== Intersection Observer for Animations =====
  const observerCallback = (entries, observerInstance) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // For main section reveal (sliding panel)
        if (entry.target.classList.contains('reveal-on-scroll')) {
          entry.target.classList.add('show'); 
          
          // Find and apply delays to children with .animate-on-reveal within this shown section
          const innerAnimatedElements = entry.target.querySelectorAll('.section-content-wrapper .animate-on-reveal');
          innerAnimatedElements.forEach(el => {
            let delay = el.dataset.animationDelay || '0s'; // For elements with a fixed delay

            // For items that need progressive staggering based on an index/factor
            if (el.classList.contains('stagger-item') && el.dataset.staggerDelayFactor) {
                const baseDelayForSection = parseFloat(entry.target.querySelector('.section-title-container.animate-on-reveal')?.dataset.animationDelay || '0') * 1000;
                const factor = parseInt(el.dataset.staggerDelayFactor) || 0;
                // Base delay for first stagger item is 0.1s after title, then increment
                delay = `${(baseDelayForSection / 1000) + (0.15 * factor)}s`; 
            } else if (el.classList.contains('stagger-item') && el.dataset.staggerIndex) { // For skill cards
                delay = `${parseInt(el.dataset.staggerIndex) * 150}ms`;
            }

            el.style.transitionDelay = delay;
            // Adding 'show' to these individual items can be done if CSS depends on it,
            // but current CSS for .animate-on-reveal uses parent .show
            // el.classList.add('show'); // Uncomment if individual control is needed beyond CSS cascade
          });
        } 
        // For individually observed skill cards (already handled by CSS + their own .show)
        else if (entry.target.classList.contains('hidden-stagger')) {
          const staggerIndex = entry.target.dataset.staggerIndex;
          if (staggerIndex !== undefined) {
            const delay = parseInt(staggerIndex) * 150; 
            entry.target.style.transitionDelay = `${delay}ms`;
          }
          entry.target.classList.add('show');
        }
        // observerInstance.unobserve(entry.target); // Optional: animate only once
      } else {
        // Optional: Reset for re-animation on scroll up
        // if (entry.target.classList.contains('show')) {
        //   entry.target.classList.remove('show');
        //   entry.target.style.transitionDelay = '0s'; // Reset any applied delays
        // }
      }
    });
  };

  const animationObserver = new IntersectionObserver(observerCallback, {
    rootMargin: '0px',
    threshold: 0.2 
  });

  const revealSections = document.querySelectorAll('section.reveal-on-scroll');
  revealSections.forEach((el) => {
    animationObserver.observe(el);
  });

  const staggeredSkillCards = document.querySelectorAll('.skill-card.hidden-stagger');
  staggeredSkillCards.forEach((el) => animationObserver.observe(el));

  // ===== Smooth scroll for anchor links =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      const mainNavbar = document.querySelector('.navbar');
      
      if (targetElement && mainNavbar) {
        const navbarHeight = mainNavbar.offsetHeight || 70; 
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      } else if (targetElement) { 
          targetElement.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // ===== Project Modal Functionality =====
  const modalOverlay = document.getElementById('modalOverlay');
  const projectCards = document.querySelectorAll('.project-focus-card[data-modal-target]'); 
  const closeButtons = document.querySelectorAll('.modal-close-btn');
  let previouslyFocusedElement = null;
  let currentlyOpenModal = null; 

  function openModal(modalId) {
    const modalToOpen = document.getElementById(modalId);
    if (!modalToOpen || !modalOverlay) {
      console.error("Modal or Modal Overlay not found for ID:", modalId);
      return;
    }
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
    const focusableElements = modalToOpen.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusableElements.length > 0) {
        focusableElements[0].focus();
    }
  }

  function closeModal() {
    if (modalOverlay && currentlyOpenModal) { 
      modalOverlay.classList.remove('active');
      currentlyOpenModal.classList.remove('active'); 
      currentlyOpenModal.setAttribute('aria-hidden', 'true');
      modalOverlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (previouslyFocusedElement) {
        previouslyFocusedElement.focus(); 
      }
      currentlyOpenModal = null; 
    }
  }

  projectCards.forEach(card => {
    card.addEventListener('click', (event) => {
      if (event.target.closest('.project-external-link')) { 
        return; 
      }
      const modalId = card.dataset.modalTarget.substring(1);
      openModal(modalId);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (document.activeElement.closest('.project-external-link')) {
            return;
        }
        e.preventDefault(); 
        const modalId = card.dataset.modalTarget.substring(1);
        openModal(modalId);
      }
    });
  });

  closeButtons.forEach(button => {
    button.addEventListener('click', closeModal);
  });

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (event) => {
      if (event.target === modalOverlay) { 
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });


  // ===== Update Copyright Year =====
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // ===== Active Nav Link Highlighting on Scroll =====
  const navSections = document.querySelectorAll('section[id], header[id]');
  const navLiAnchors = document.querySelectorAll('.nav-links li a');
  const mainNavbarForActiveLink = document.querySelector('.navbar');

  if (navSections.length > 0 && navLiAnchors.length > 0 && mainNavbarForActiveLink) {
    const updateActiveLink = () => {
      let currentSectionId = navSections[0].id; 
      const navbarHeight = mainNavbarForActiveLink.offsetHeight || 70; 
      navSections.forEach(section => {
        const sectionTop = section.offsetTop - navbarHeight - window.innerHeight * 0.3; 
        if (window.pageYOffset >= sectionTop) {
          currentSectionId = section.getAttribute('id');
        }
      });
      navLiAnchors.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href').substring(1) === currentSectionId) {
          a.classList.add('active');
        }
      });
    };
    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink(); 
  }

  // Mobile Menu Toggle
  const mobileMenuButton = document.getElementById('mobileMenuToggle');
  const mainNavLinks = document.querySelector('nav .nav-links');

  if (mobileMenuButton && mainNavLinks) {
    mobileMenuButton.addEventListener('click', () => {
      const isExpanded = mainNavLinks.classList.toggle('active'); 
      mobileMenuButton.setAttribute('aria-expanded', isExpanded);
      if (isExpanded) {
        mobileMenuButton.innerHTML = '<span class="icon-close"></span>';
      } else {
        mobileMenuButton.innerHTML = '<span class="icon-menu"></span>';
      }
    });
  }
});