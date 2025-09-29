// DOM elements and configuration
const CONFIG = {
  navHeight: 100,
  scrollOffset: 150,
  revealDelay: 200,
  typeDelay: 50,
};

// Utility functions
const isElementInViewport = (el) => {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

const throttle = (func, delay) => {
  let timeoutId;
  let lastExecTime = 0;
  
  return function (...args) {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func.apply(this, args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
};

// Initialize loading animation
const initLoader = () => {
  // Add loading class to all elements that should animate in
  const elementsToLoad = document.querySelectorAll(
    '.header, .main-content section, .experience-item, .project-item, .goal-phase'
  );
  
  elementsToLoad.forEach((el, index) => {
    el.classList.add('loading');
    
    // Stagger the loading animation
    setTimeout(() => {
      el.classList.add('loaded');
    }, index * 100 + 300); // Start after 300ms, then stagger by 100ms
  });
};

// Smooth scrolling for navigation links
const initSmoothScrolling = () => {
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        const offsetTop = targetSection.offsetTop - CONFIG.navHeight;
        
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
};

// Active navigation tracking
const initNavTracking = () => {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  
  const updateActiveNav = () => {
    const scrollPosition = window.scrollY + CONFIG.scrollOffset;
    
    let currentSection = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      
      if (href === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  };
  
  // Throttle the scroll event for better performance
  window.addEventListener('scroll', throttle(updateActiveNav, 100));
  
  // Initial call
  updateActiveNav();
};

// Reveal animations on scroll
const initScrollReveal = () => {
  const revealElements = document.querySelectorAll(
    '.strength-item, .improvement-item, .experience-item, .project-item, .goal-phase'
  );
  
  // Add reveal class to all elements
  revealElements.forEach(el => {
    el.classList.add('reveal');
  });
  
  const revealOnScroll = () => {
    revealElements.forEach((el, index) => {
      const elementTop = el.getBoundingClientRect().top;
      const elementVisible = 150;
      
      if (elementTop < window.innerHeight - elementVisible) {
        setTimeout(() => {
          el.classList.add('revealed');
        }, index * 100); // Stagger animation
      }
    });
  };
  
  window.addEventListener('scroll', throttle(revealOnScroll, 200));
  
  // Initial call
  revealOnScroll();
};

// Typewriter effect for the name
const initTypewriter = () => {
  const nameElement = document.querySelector('.name');
  if (!nameElement) return;
  
  const text = nameElement.textContent;
  nameElement.textContent = '';
  nameElement.style.borderRight = '2px solid var(--green)';
  
  let index = 0;
  
  const typeChar = () => {
    if (index < text.length) {
      nameElement.textContent += text.charAt(index);
      index++;
      setTimeout(typeChar, CONFIG.typeDelay);
    } else {
      // Remove cursor after typing is complete
      setTimeout(() => {
        nameElement.style.borderRight = 'none';
      }, 1000);
    }
  };
  
  // Start typing after initial load delay
  setTimeout(typeChar, 1000);
};

// Parallax effect for sections
const initParallax = () => {
  const parallaxElements = document.querySelectorAll('.experience-item, .project-item');
  
  const handleParallax = () => {
    const scrolled = window.pageYOffset;
    
    parallaxElements.forEach((el, index) => {
      const rate = scrolled * -0.02 * (index % 2 === 0 ? 1 : -1);
      el.style.transform = `translateY(${rate}px)`;
    });
  };
  
  window.addEventListener('scroll', throttle(handleParallax, 16));
};

// Mouse tracking for interactive elements
const initMouseTracking = () => {
  const trackableElements = document.querySelectorAll(
    '.experience-item, .project-item, .strength-item'
  );
  
  trackableElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
    
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    });
  });
};

// Keyboard navigation
const initKeyboardNavigation = () => {
  const focusableElements = document.querySelectorAll(
    '.nav-link, .social-link, .contact-button, .project-link'
  );
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      // Custom tab navigation behavior can be added here
    }
    
    if (e.key === 'Escape') {
      // Remove focus from currently focused element
      document.activeElement.blur();
    }
  });
};

// Dynamic background particles
const initBackgroundParticles = () => {
  const createParticle = () => {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: fixed;
      width: 2px;
      height: 2px;
      background-color: var(--green);
      opacity: 0.3;
      border-radius: 50%;
      pointer-events: none;
      z-index: 1;
      top: ${Math.random() * 100}vh;
      left: ${Math.random() * 100}vw;
      animation: particle-float ${5 + Math.random() * 10}s linear infinite;
    `;
    
    document.body.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, 15000);
  };
  
  // Create particles periodically
  setInterval(createParticle, 2000);
};

// Add CSS for particle animation
const addParticleStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes particle-float {
      0% {
        transform: translateY(0) translateX(0) rotate(0deg);
        opacity: 0;
      }
      10% {
        opacity: 0.3;
      }
      90% {
        opacity: 0.3;
      }
      100% {
        transform: translateY(-100vh) translateX(50px) rotate(360deg);
        opacity: 0;
      }
    }
    
    .nav-link {
      position: relative;
      overflow: hidden;
    }
    
    .nav-link::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(100, 255, 218, 0.2), transparent);
      transition: left 0.5s;
    }
    
    .nav-link:hover::after {
      left: 100%;
    }
    
    /* Enhanced hover effects */
    .experience-item:hover,
    .project-item:hover,
    .strength-item:hover {
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    }
    
    /* Focus indicators */
    .nav-link:focus-visible,
    .social-link:focus-visible,
    .contact-button:focus-visible {
      outline: 2px solid var(--green);
      outline-offset: 3px;
      border-radius: 4px;
    }
    
    /* Mobile navigation improvements */
    @media (max-width: 768px) {
      .nav-list {
        gap: 20px;
      }
      
      .nav-link {
        padding: 15px 10px;
        border-bottom: 2px solid transparent;
        transition: border-color 0.3s ease;
      }
      
      .nav-link.active {
        border-bottom-color: var(--green);
      }
    }
  `;
  
  document.head.appendChild(style);
};

// Performance monitoring
const initPerformanceMonitoring = () => {
  // Monitor scroll performance
  let scrolling = false;
  
  window.addEventListener('scroll', () => {
    if (!scrolling) {
      requestAnimationFrame(() => {
        // Scroll-based animations go here
        scrolling = false;
      });
      scrolling = true;
    }
  });
  
  // Preload critical resources
  const preloadResources = () => {
    const criticalFonts = [
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700',
      'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700'
    ];
    
    criticalFonts.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = font;
      document.head.appendChild(link);
    });
  };
  
  preloadResources();
};

// Accessibility enhancements
const initAccessibility = () => {
  // Reduce motion for users who prefer it
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  
  if (prefersReducedMotion.matches) {
    document.body.classList.add('reduce-motion');
    
    const style = document.createElement('style');
    style.textContent = `
      .reduce-motion * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Skip to main content link
  const skipLink = document.createElement('a');
  skipLink.textContent = '메인 콘텐츠로 건너뛰기';
  skipLink.href = '#about';
  skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 6px;
    background: var(--green);
    color: var(--navy);
    padding: 8px;
    text-decoration: none;
    border-radius: 4px;
    z-index: 1000;
    font-weight: 600;
    transition: top 0.3s;
  `;
  
  skipLink.addEventListener('focus', () => {
    skipLink.style.top = '6px';
  });
  
  skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
  });
  
  document.body.insertBefore(skipLink, document.body.firstChild);
};

// Main initialization function
const init = () => {
  // Add particle styles first
  addParticleStyles();
  
  // Initialize all features
  initLoader();
  initSmoothScrolling();
  initNavTracking();
  initScrollReveal();
  initTypewriter();
  initParallax();
  initMouseTracking();
  initKeyboardNavigation();
  initPerformanceMonitoring();
  initAccessibility();
  
  // Initialize background particles after a delay
  setTimeout(initBackgroundParticles, 2000);
  
  console.log('🚀 Profile initialized successfully!');
};

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause animations when page is hidden
    document.body.classList.add('page-hidden');
  } else {
    // Resume animations when page is visible
    document.body.classList.remove('page-hidden');
  }
});

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    // Recalculate positions after resize
    initNavTracking();
  }, 250);
});

// Export for debugging (if needed)
if (typeof window !== 'undefined') {
  window.ProfileJS = {
    init,
    CONFIG,
    // Expose utility functions for debugging
    throttle,
    isElementInViewport,
  };
}
