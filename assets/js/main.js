/**
 * JF FUNILARIA & PINTURA EXPRESS
 * Interactive Core Engine & WhatsApp Integration
 */

// Global Configuration
const CONFIG = {
  // Número de WhatsApp da JF Funilaria Oficial: (48) 98455-6805
  whatsappPhone: "5548984556805", 
  companyName: "JF Funilaria & Pintura Express"
};

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initBeforeAfterSlider();
  initQuoteCalculator();
  initFaqAccordion();
  initContactForm();
  initSmoothScroll();
  initCarousels();
});

/* ==========================================================================
   1. NAVBAR & MOBILE MENU
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky header background on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    highlightActiveSection();
  });

  // Mobile menu toggle
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !menuToggle.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

// Highlight current section in navbar
function highlightActiveSection() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPosition = window.scrollY + 180;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

    if (navLink) {
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLink.classList.add('active');
      } else {
        navLink.classList.remove('active');
      }
    }
  });
}

/* ==========================================================================
   2. INTERACTIVE BEFORE & AFTER SLIDER
   ========================================================================== */
function initBeforeAfterSlider() {
  const container = document.getElementById('beforeAfterContainer');
  const afterWrapper = document.getElementById('afterWrapper');
  const handle = document.getElementById('sliderHandle');

  if (!container || !afterWrapper || !handle) return;

  let isDragging = false;

  function updateSliderPosition(x) {
    const rect = container.getBoundingClientRect();
    let position = x - rect.left;

    // Constrain position within container
    if (position < 0) position = 0;
    if (position > rect.width) position = rect.width;

    const percentage = (position / rect.width) * 100;
    afterWrapper.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;
  }

  // Mouse Events
  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    updateSliderPosition(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updateSliderPosition(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Touch Events (Mobile Support)
  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    updateSliderPosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    updateSliderPosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  // Synchronize After image width to match container width on all viewports
  function syncAfterImage() {
    const afterImg = afterWrapper.querySelector('.comp-img');
    if (afterImg && container) {
      afterImg.style.width = `${container.clientWidth}px`;
      afterImg.style.minWidth = `${container.clientWidth}px`;
      afterImg.style.height = `${container.clientHeight}px`;
    }
  }
  window.addEventListener('resize', syncAfterImage);
  setTimeout(syncAfterImage, 50);

  // Optional: Auto subtle bounce animation when user scrolls into view
  let animatedOnce = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animatedOnce) {
        animatedOnce = true;
        animateHandleGreeting();
      }
    });
  }, { threshold: 0.4 });

  observer.observe(container);

  function animateHandleGreeting() {
    afterWrapper.style.transition = 'width 1s cubic-bezier(0.16, 1, 0.3, 1)';
    handle.style.transition = 'left 1s cubic-bezier(0.16, 1, 0.3, 1)';

    afterWrapper.style.width = '65%';
    handle.style.left = '65%';

    setTimeout(() => {
      afterWrapper.style.width = '50%';
      handle.style.left = '50%';
      setTimeout(() => {
        afterWrapper.style.transition = '';
        handle.style.transition = '';
      }, 1000);
    }, 1200);
  }
}

/* ==========================================================================
   3. QUICK QUOTE SIMULATOR (CALCULADORA DE ORÇAMENTO INTELIGENTE)
   ========================================================================== */
function initQuoteCalculator() {
  const serviceButtons = document.querySelectorAll('.sim-btn');
  const partButtons = document.querySelectorAll('.part-btn');
  const estimateTimeDisplay = document.getElementById('calcEstimatedTime');
  const speedTagDisplay = document.getElementById('calcSpeedTag');
  const estimateSummaryDisplay = document.getElementById('calcSummaryDesc');
  const processStepsDisplay = document.getElementById('calcProcessSteps');
  const sendWhatsAppBtn = document.getElementById('calcWhatsAppBtn');

  if (!serviceButtons.length || !sendWhatsAppBtn) return;

  let selectedService = "Riscos e Arranhões Superficiais";
  let selectedPart = "Para-choque Dianteiro / Traseiro";

  const estimateMap = {
    "Riscos e Arranhões Superficiais": {
      time: "4h a 8h",
      speedTag: "⚡ Pronto no Mesmo Dia",
      desc: "Retoque express localizado em estufa pressurizada com secagem por lâmpadas infravermelhas. Ideal para riscos e arranhões sem afetar a peça inteira.",
      steps: [
        "Colorimetria 100% fiel à montadora",
        "Aplicação em cabine pressurizada livre de poeira",
        "Secagem infravermelha e polimento técnico"
      ]
    },
    "Martelinho de Ouro (PDR)": {
      time: "2h a 5h",
      speedTag: "⚡ Pronto no Mesmo Dia",
      desc: "Desamassamento milimétrico com ferramentas alemãs de alta precisão. Remove mossas e batidas preservando 100% da tinta original de fábrica.",
      steps: [
        "Leitura de vincos por luminária de LED de alta definição",
        "Massagem da chapa por trás do painel sem romper a tinta",
        "Inspeção final e polimento de acabamento espelhado"
      ]
    },
    "Pintura de Peça Inteira": {
      time: "24h a 48h",
      speedTag: "⭐ Padrão Premium",
      desc: "Preparação completa da peça, primer fosfatizante de alta aderência, tinta formulada por código original e verniz alto sólido com secagem em estufa.",
      steps: [
        "Descontaminação química e nivelamento do painel",
        "Pintura em cabine pressurizada com filtro de partículas",
        "Cura térmica controlada e vitrificação de proteção"
      ]
    },
    "Funilaria & Restauração Completa": {
      time: "1 a 3 dias",
      speedTag: "🛠️ Reparo Estrutural Completo",
      desc: "Recuperação profunda de lataria pós-colisão, repuxamento milimétrico, alinhamento de vincos e gaps, com acabamento perfeito sem ondulações.",
      steps: [
        "Alinhamento de tolerâncias de gap entre peças",
        "Solda ponto automotiva e tratamento anticorrosivo",
        "Preparação de estufa, fundo epóxi e pintura premium"
      ]
    }
  };

  function updateEstimate() {
    const info = estimateMap[selectedService] || {
      time: "4h a 24h",
      speedTag: "⚡ Reparo Rápido",
      desc: "Avaliação técnica imediata conforme a profundidade do dano.",
      steps: [
        "Análise minuciosa da peça e formulação da cor",
        "Tratamento da lataria e estufa pressurizada",
        "Inspeção de controle de qualidade final"
      ]
    };

    if (estimateTimeDisplay) {
      estimateTimeDisplay.innerHTML = `⏱️ <span>${info.time}</span>`;
    }

    if (speedTagDisplay) {
      speedTagDisplay.textContent = info.speedTag;
    }

    if (estimateSummaryDisplay) {
      estimateSummaryDisplay.innerHTML = `<strong>${selectedService}</strong> no <strong>${selectedPart}</strong>.<br><span>${info.desc}</span>`;
    }

    if (processStepsDisplay && info.steps) {
      processStepsDisplay.innerHTML = info.steps.map((step, idx) => `
        <div class="step-item"><span class="step-dot">${idx + 1}</span> ${step}</div>
      `).join('');
    }

    // Build personalized WhatsApp URL
    const message = `Olá JF Funilaria! Estimei meu reparo no site:\n\n*Tipo de Reparo:* ${selectedService}\n*Área do Carro:* ${selectedPart}\n*Prazo Estimado:* ${info.time} (${info.speedTag})\n_(Prazo estimado a contar do início do serviço, sujeito à fila da oficina)_\n\nVou enviar fotos do meu veículo a seguir para confirmação do orçamento!`;
    const encodedMessage = encodeURIComponent(message);
    sendWhatsAppBtn.href = `https://wa.me/${CONFIG.whatsappPhone}?text=${encodedMessage}`;
  }

  const step2Element = document.getElementById('simStep2');
  const resultBoxElement = document.getElementById('simResultBox') || document.querySelector('.sim-result-box');

  function smoothScrollToElement(el) {
    if (!el) return;
    const headerOffset = 80;
    const elementPosition = el.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }

  serviceButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      serviceButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedService = btn.getAttribute('data-service') || btn.innerText.trim();
      updateEstimate();

      // Desce automaticamente para o Passo 2 conforme solicitado
      setTimeout(() => {
        smoothScrollToElement(step2Element);
      }, 150);
    });
  });

  partButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      partButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedPart = btn.getAttribute('data-part') || btn.innerText.trim();
      updateEstimate();

      // Desce automaticamente para o Resultado / Cockpit conforme solicitado
      setTimeout(() => {
        smoothScrollToElement(resultBoxElement);
      }, 150);
    });
  });

  // Initial calculation
  updateEstimate();
}

/* ==========================================================================
   4. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      if (isActive) {
        item.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================================================
   5. FAST CONTACT FORM -> WHATSAPP REDIRECT
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('fastQuoteForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('clientName')?.value || '';
    const phone = document.getElementById('clientPhone')?.value || '';
    const carModel = document.getElementById('clientCar')?.value || '';
    const serviceType = document.getElementById('clientService')?.value || 'Orçamento Geral';
    const notes = document.getElementById('clientNotes')?.value || '';

    if (!name.trim()) {
      alert('Por favor, informe seu nome.');
      return;
    }

    const message = `Olá JF Funilaria! Solicitação de Orçamento pelo Site:\n\n*Nome:* ${name}\n*Telefone:* ${phone}\n*Veículo:* ${carModel}\n*Serviço de Interesse:* ${serviceType}\n*Detalhes do Dano:* ${notes}\n\nEstou no aguardo do contato!`;
    const whatsappUrl = `https://wa.me/${CONFIG.whatsappPhone}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
  });
}

/* ==========================================================================
   6. SMOOTH SCROLL FOR INTERNAL LINKS
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || !href) return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ==========================================================================
   7. INTERACTIVE CAROUSELS (SERVICES & GOOGLE REVIEWS WITH AUTO-PLAY)
   ========================================================================== */
function initCarousels() {
  // 1. Services Carousel Setup
  setupCarousel({
    containerId: 'servicesCarousel',
    viewportId: 'servicesViewport',
    trackId: 'servicesTrack',
    prevBtnId: 'servicesPrevBtn',
    nextBtnId: 'servicesNextBtn',
    dotsId: 'servicesDots',
    autoplay: false
  });

  // 2. Google Reviews Carousel Setup (With Slow Auto-Play & Click-to-Pause)
  setupCarousel({
    containerId: 'reviewsCarousel',
    viewportId: 'reviewsViewport',
    trackId: 'reviewsTrack',
    prevBtnId: 'reviewsPrevBtn',
    nextBtnId: 'reviewsNextBtn',
    dotsId: 'reviewsDots',
    autoplay: true,
    autoplayInterval: 5500, // Transição suave a cada 5.5s
    pauseOnClick: true      // "se a pessoa clicar ela fica parada"
  });
}

function setupCarousel(config) {
  const container = document.getElementById(config.containerId);
  const viewport = document.getElementById(config.viewportId);
  const track = document.getElementById(config.trackId);
  const prevBtn = document.getElementById(config.prevBtnId);
  const nextBtn = document.getElementById(config.nextBtnId);
  const dotsContainer = document.getElementById(config.dotsId);

  if (!container || !viewport || !track) return;

  const slides = Array.from(track.querySelectorAll('.carousel-slide'));
  if (slides.length === 0) return;

  let currentIndex = 0;
  let autoplayTimer = null;
  let userPaused = false;

  // Create Navigation Dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `carousel-dot${idx === 0 ? ' active' : ''}`;
      dot.setAttribute('aria-label', `Ir para item ${idx + 1}`);
      dot.addEventListener('click', () => {
        if (config.pauseOnClick) stopAutoplay();
        goToSlide(idx);
      });
      dotsContainer.appendChild(dot);
    });
  }

  const dots = dotsContainer ? Array.from(dotsContainer.querySelectorAll('.carousel-dot')) : [];

  function updateDots(index) {
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === index);
    });
  }

  function getSlideOffset(index) {
    if (index <= 0) return 0;
    if (index >= slides.length) index = slides.length - 1;
    const slide = slides[index];
    return slide.offsetLeft - track.offsetLeft;
  }

  function goToSlide(index) {
    if (index < 0) index = 0;
    if (index >= slides.length) index = slides.length - 1;
    currentIndex = index;
    const targetScroll = getSlideOffset(index);
    viewport.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
    updateDots(currentIndex);
  }

  // Previous & Next Navigation Buttons
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (config.pauseOnClick) stopAutoplay();
      const prevIdx = currentIndex > 0 ? currentIndex - 1 : slides.length - 1;
      goToSlide(prevIdx);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (config.pauseOnClick) stopAutoplay();
      const nextIdx = (currentIndex + 1) % slides.length;
      goToSlide(nextIdx);
    });
  }

  // Sync scroll on manual touch-swipe or wheel
  let isScrolling = false;
  viewport.addEventListener('scroll', () => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        const scrollLeft = viewport.scrollLeft;
        let closestIndex = 0;
        let minDiff = Infinity;

        slides.forEach((slide, idx) => {
          const slidePos = slide.offsetLeft - track.offsetLeft;
          const diff = Math.abs(slidePos - scrollLeft);
          if (diff < minDiff) {
            minDiff = diff;
            closestIndex = idx;
          }
        });

        if (closestIndex !== currentIndex) {
          currentIndex = closestIndex;
          updateDots(currentIndex);
        }
        isScrolling = false;
      });
      isScrolling = true;
    }
  }, { passive: true });

  // Auto-Play Logic
  function startAutoplay() {
    if (!config.autoplay || autoplayTimer || userPaused) return;
    autoplayTimer = setInterval(() => {
      if (userPaused) return;
      const nextIdx = (currentIndex + 1) % slides.length;
      goToSlide(nextIdx);
    }, config.autoplayInterval || 5500);
  }

  function stopAutoplay() {
    userPaused = true;
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function pauseAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function resumeAutoplay() {
    if (!userPaused && config.autoplay) {
      startAutoplay();
    }
  }

  if (config.autoplay) {
    startAutoplay();

    // If user clicks anywhere on the carousel, permanent stop ("se a pessoa clicar ela fica parada")
    if (config.pauseOnClick) {
      container.addEventListener('click', () => {
        stopAutoplay();
      });

      container.addEventListener('touchstart', () => {
        stopAutoplay();
      }, { passive: true });
    }

    // Pause on mouse hover, resume on mouse leave (if not clicked to stop)
    container.addEventListener('mouseenter', () => {
      pauseAutoplay();
    });

    container.addEventListener('mouseleave', () => {
      resumeAutoplay();
    });
  }
}

