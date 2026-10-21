/**
 * JF FUNILARIA & PINTURA EXPRESS
 * Interactive Core Engine & WhatsApp Integration
 */

// Global Configuration
const CONFIG = {
  // Número de WhatsApp da JF Funilaria (pode ser alterado facilmente aqui)
  whatsappPhone: "5511999999999", 
  companyName: "JF Funilaria & Pintura Express"
};

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initBeforeAfterSlider();
  initQuoteCalculator();
  initFaqAccordion();
  initContactForm();
  initSmoothScroll();
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
   3. QUICK QUOTE SIMULATOR (CALCULADORA DE ORÇAMENTO)
   ========================================================================== */
function initQuoteCalculator() {
  const serviceButtons = document.querySelectorAll('.sim-btn, .service-option-btn');
  const partButtons = document.querySelectorAll('.part-btn, .part-option-btn');
  const estimateTimeDisplay = document.getElementById('calcEstimatedTime');
  const estimateSummaryDisplay = document.getElementById('calcSummaryDesc');
  const sendWhatsAppBtn = document.getElementById('calcWhatsAppBtn');

  if (!serviceButtons.length || !sendWhatsAppBtn) return;

  let selectedService = "Pintura Express (Mesmo Dia)";
  let selectedPart = "Para-choque Dianteiro / Traseiro";

  const estimateMap = {
    "Pintura Express (Mesmo Dia)": {
      time: "4h a 8h",
      desc: "Reparo em estufa pressurizada com secagem infravermelha rápida. Ideal para riscos e retoques no mesmo dia."
    },
    "Funilaria & Martelinho (PDR)": {
      time: "2h a 6h",
      desc: "Desamassamento artesanal sem danificar a tinta original. Preserva o valor de fábrica do veículo."
    },
    "Pintura de Peça Inteira": {
      time: "24h a 48h",
      desc: "Preparação completa, aplicação de primer, tinta original com colorimetria computadorizada e verniz alto sólido."
    },
    "Polimento Técnico & Proteção": {
      time: "6h a 12h",
      desc: "Remoção de micro-riscos, correção do verniz e aplicação de proteção de brilho espelhado."
    }
  };

  function updateEstimate() {
    const info = estimateMap[selectedService] || { time: "4h a 24h", desc: "Avaliação rápida conforme a extensão do dano." };
    if (estimateTimeDisplay) {
      estimateTimeDisplay.innerHTML = `Tempo Médio: <span>${info.time}</span>`;
    }
    if (estimateSummaryDisplay) {
      estimateSummaryDisplay.innerHTML = `<strong>Serviço:</strong> ${selectedService}<br><strong>Região:</strong> ${selectedPart}<br><span style="color: #94a3b8; font-size: 0.9rem;">${info.desc}</span>`;
    }

    // Build personalized WhatsApp URL
    const message = `Olá JF Funilaria! Gostaria de um orçamento rápido:\n\n*Serviço:* ${selectedService}\n*Área do Carro:* ${selectedPart}\n*Tempo Estimado pelo Simulador:* ${info.time}\n\nVou enviar fotos do meu veículo a seguir para confirmação do valor!`;
    const encodedMessage = encodeURIComponent(message);
    sendWhatsAppBtn.href = `https://wa.me/${CONFIG.whatsappPhone}?text=${encodedMessage}`;
  }

  serviceButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      serviceButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedService = btn.getAttribute('data-service') || btn.innerText.trim();
      updateEstimate();
    });
  });

  partButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      partButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedPart = btn.getAttribute('data-part') || btn.innerText.trim();
      updateEstimate();
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
