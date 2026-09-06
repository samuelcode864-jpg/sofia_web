// ==========================================================================
// SOFÍA IA • MOTOR INMERSIVO Y EXPERIENCIA INTERACTIVA
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initHeroParallax3D();
  initSofiaVoiceAudio();
  initWhatsAppSimulator();
  initIndustryTabs();
  initFaqAccordion();
  initPricingToggle();
  initStickyAssistant();
});

/* --------------------------------------------------------------------------
   1. PARALLAX 3D INTERACTIVO CON EL MOUSE (EFECTO TRYHOLO)
   -------------------------------------------------------------------------- */
function initHeroParallax3D() {
  const stage = document.querySelector('.hero-stage');
  const card = document.querySelector('.hero-3d-card');
  const badges = document.querySelectorAll('.parallax-badge');

  if (!stage || !card) return;

  stage.addEventListener('mousemove', (e) => {
    const rect = stage.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = -(y / rect.height) * 14;
    const rotY = (x / rect.width) * 14;

    card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;

    badges.forEach((badge, index) => {
      const depth = (index + 1) * 12;
      const moveX = (x / rect.width) * depth;
      const moveY = (y / rect.height) * depth;
      badge.style.transform = `translate3d(${moveX.toFixed(1)}px, ${moveY.toFixed(1)}px, 45px)`;
    });
  });

  stage.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    card.style.transition = 'transform 0.5s ease';
    badges.forEach(badge => {
      badge.style.transform = 'translate3d(0, 0, 40px)';
      badge.style.transition = 'transform 0.5s ease';
    });
    setTimeout(() => {
      card.style.transition = 'transform 0.15s ease-out';
      badges.forEach(b => b.style.transition = 'transform 0.25s ease-out');
    }, 500);
  });
}

/* --------------------------------------------------------------------------
   2. VOZ REAL Y SALUDO INTERACTIVO DE SOFÍA (WEB AUDIO / SPEECH SYNTHESIS)
   -------------------------------------------------------------------------- */
function initSofiaVoiceAudio() {
  const voiceBtn = document.getElementById('sofiaVoiceBtn');
  const voiceWaves = document.getElementById('voiceWaves');
  const voiceStatus = document.getElementById('voiceStatusText');

  if (!voiceBtn) return;

  let isSpeaking = false;

  const sofiaPitch = "¡Hola! Soy Sofía. Estoy lista para atender a los clientes de tu negocio las 24 horas del día por WhatsApp, responder notas de voz al instante y cerrar ventas en piloto automático.";

  voiceBtn.addEventListener('click', () => {
    if (!('speechSynthesis' in window)) {
      alert('Tu navegador no soporta reproducción de voz por IA');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      stopVoiceAnimation();
      return;
    }

    window.speechSynthesis.cancel(); // Cancel any existing speech

    const utterance = new SpeechSynthesisUtterance(sofiaPitch);
    utterance.lang = 'es-ES';
    utterance.rate = 1.05; // Natural pleasant rhythm
    utterance.pitch = 1.25; // Youthful and warm tone matching Sofia

    // Try finding a warm Spanish voice
    const voices = window.speechSynthesis.getVoices();
    const spanishVoice = voices.find(v => v.lang.startsWith('es') && (v.name.includes('Monica') || v.name.includes('Helena') || v.name.includes('Lucia') || v.name.includes('Google') || v.name.includes('Natural')));
    if (spanishVoice) utterance.voice = spanishVoice;

    utterance.onstart = () => {
      isSpeaking = true;
      voiceBtn.classList.add('bg-emerald-600', 'text-white');
      if (voiceStatus) voiceStatus.textContent = 'Sofía hablando...';
      if (voiceWaves) voiceWaves.classList.remove('opacity-0');
      const icon = voiceBtn.querySelector('i');
      if (icon) icon.setAttribute('data-lucide', 'square');
      if (window.lucide) window.lucide.createIcons();
    };

    utterance.onend = () => {
      stopVoiceAnimation();
    };

    utterance.onerror = () => {
      stopVoiceAnimation();
    };

    window.speechSynthesis.speak(utterance);
  });

  function stopVoiceAnimation() {
    isSpeaking = false;
    voiceBtn.classList.remove('bg-emerald-600', 'text-white');
    if (voiceStatus) voiceStatus.textContent = 'Escuchar saludo de Sofía 🎙️';
    if (voiceWaves) voiceWaves.classList.add('opacity-0');
    const icon = voiceBtn.querySelector('i');
    if (icon) icon.setAttribute('data-lucide', 'volume-2');
    if (window.lucide) window.lucide.createIcons();
  }
}

/* --------------------------------------------------------------------------
   3. SIMULADOR INTERACTIVO DE WHATSAPP
   -------------------------------------------------------------------------- */
const chatScenarios = {
  audio: {
    user: {
      type: 'audio',
      duration: '0:14',
      time: '10:42 AM'
    },
    bot: {
      text: '¡Hola! Escuché tu nota de voz perfectamente 🎧. Tengo disponibilidad para odontología mañana a las 3:30 PM con la Dra. Castillo. ¿Deseas que te reserve con tu nombre y cédula?',
      time: '10:42 AM'
    }
  },
  photo: {
    user: {
      type: 'photo',
      caption: '¿Tienen este medicamento en stock?',
      image: 'assets/images/sofia-services.jpeg',
      time: '11:15 AM'
    },
    bot: {
      text: '¡Foto analizada con éxito! 🔍 Leí tu récipe: <b>Amoxicilina 500mg</b> (caja 14 cápsulas). Tenemos 5 unidades disponibles a <b>$8.50</b> (o al cambio oficial BCV). ¿Deseas delivery o retiro en tienda?',
      time: '11:15 AM'
    }
  },
  citas: {
    user: {
      type: 'text',
      text: 'Hola Sofía, quiero reservar un turno para corte y barba hoy en la tarde porfa',
      time: '2:10 PM'
    },
    bot: {
      text: '¡Con gusto! Para hoy en la tarde con Carlos tengo estos horarios disponibles:<br><br>• <b>4:00 PM</b><br>• <b>5:30 PM</b><br><br>¿Cuál de los dos te acomoda mejor?',
      time: '2:10 PM'
    }
  },
  ecommerce: {
    user: {
      type: 'text',
      text: 'Buenas noches, ¿tienen el conjunto lila en talla M?',
      time: '11:45 PM'
    },
    bot: {
      text: '¡Hola! Sí, nos quedan las últimas 2 unidades en talla M por <b>$28</b> ✨. Aceptamos Pago Móvil, Zelle o Tarjeta. ¿Te aparto uno antes de que se agote?',
      time: '11:45 PM'
    }
  }
};

function initWhatsAppSimulator() {
  const chatMessages = document.getElementById('chatMessages');
  const chatStatus = document.getElementById('chatStatus');
  const actionButtons = document.querySelectorAll('.scenario-btn');

  if (!chatMessages) return;

  function loadScenario(scenarioKey) {
    const data = chatScenarios[scenarioKey];
    if (!data) return;

    actionButtons.forEach(btn => {
      if (btn.dataset.scenario === scenarioKey) {
        btn.classList.add('bg-emerald-500', 'text-white', 'shadow-md');
        btn.classList.remove('bg-white', 'text-slate-700');
      } else {
        btn.classList.remove('bg-emerald-500', 'text-white', 'shadow-md');
        btn.classList.add('bg-white', 'text-slate-700');
      }
    });

    chatMessages.innerHTML = '';

    let userMsgHTML = '';
    if (data.user.type === 'audio') {
      userMsgHTML = `
        <div class="flex justify-end mb-3">
          <div class="bg-[#d9fdd3] rounded-[18px] rounded-tr-sm p-3 max-w-[85%] sm:max-w-[75%] shadow-sm">
            <div class="flex items-center gap-3">
              <button class="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow">
                <i data-lucide="play" class="w-4 h-4 ml-0.5"></i>
              </button>
              <div class="flex-1">
                <div class="flex items-center gap-1 h-5">
                  <span class="eq-bar !bg-emerald-700"></span>
                  <span class="eq-bar !bg-emerald-700"></span>
                  <span class="eq-bar !bg-emerald-700"></span>
                  <span class="eq-bar !bg-emerald-700"></span>
                  <span class="eq-bar !bg-emerald-700"></span>
                  <span class="eq-bar !bg-emerald-700"></span>
                </div>
                <span class="text-[11px] text-slate-600 font-medium">${data.user.duration}</span>
              </div>
            </div>
            <div class="text-[10px] text-slate-500 text-right mt-1">${data.user.time} <span class="text-blue-500 font-bold">✓✓</span></div>
          </div>
        </div>
      `;
    } else if (data.user.type === 'photo') {
      userMsgHTML = `
        <div class="flex justify-end mb-3">
          <div class="bg-[#d9fdd3] rounded-[18px] rounded-tr-sm p-2 max-w-[85%] sm:max-w-[75%] shadow-sm">
            <div class="rounded-xl overflow-hidden mb-1 relative">
              <img src="${data.user.image}" alt="Foto enviada" class="w-full h-32 object-cover">
              <div class="absolute inset-0 bg-emerald-950/30 backdrop-blur-[1px] flex items-center justify-center">
                <span class="bg-black/60 text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1 font-semibold">
                  <i data-lucide="scan" class="w-3 h-3 text-emerald-400"></i> Analizando récipe con Gemini...
                </span>
              </div>
            </div>
            <p class="text-xs text-slate-800 px-1 font-medium">${data.user.caption}</p>
            <div class="text-[10px] text-slate-500 text-right mt-1 px-1">${data.user.time} <span class="text-blue-500 font-bold">✓✓</span></div>
          </div>
        </div>
      `;
    } else {
      userMsgHTML = `
        <div class="flex justify-end mb-3">
          <div class="bg-[#d9fdd3] rounded-[18px] rounded-tr-sm p-3 max-w-[85%] sm:max-w-[75%] shadow-sm">
            <p class="text-xs text-slate-800 leading-relaxed font-medium">${data.user.text}</p>
            <div class="text-[10px] text-slate-500 text-right mt-1">${data.user.time} <span class="text-blue-500 font-bold">✓✓</span></div>
          </div>
        </div>
      `;
    }

    chatMessages.innerHTML = userMsgHTML;

    if (chatStatus) {
      chatStatus.textContent = 'escribiendo respuesta...';
      chatStatus.className = 'text-xs text-emerald-200 font-semibold animate-pulse';
    }

    const typingBubble = document.createElement('div');
    typingBubble.className = 'flex justify-start mb-3 typing-bubble';
    typingBubble.innerHTML = `
      <div class="bg-white rounded-[18px] rounded-tl-sm px-4 py-2 flex items-center gap-1 shadow-sm">
        <span class="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></span>
        <span class="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]"></span>
        <span class="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]"></span>
      </div>
    `;
    chatMessages.appendChild(typingBubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    setTimeout(() => {
      const existingTyping = chatMessages.querySelector('.typing-bubble');
      if (existingTyping) existingTyping.remove();

      if (chatStatus) {
        chatStatus.textContent = 'en línea 24/7';
        chatStatus.className = 'text-xs text-emerald-100 font-normal';
      }

      const botMsgHTML = `
        <div class="flex justify-start mb-2">
          <div class="bg-white rounded-[18px] rounded-tl-sm p-3.5 max-w-[90%] sm:max-w-[80%] border border-slate-100 shadow-sm">
            <p class="text-xs text-slate-800 leading-relaxed font-normal">${data.bot.text}</p>
            <div class="text-[10px] text-slate-400 text-right mt-1.5">${data.bot.time}</div>
          </div>
        </div>
      `;
      chatMessages.insertAdjacentHTML('beforeend', botMsgHTML);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      if (window.lucide) window.lucide.createIcons();
    }, 850);

    if (window.lucide) window.lucide.createIcons();
  }

  actionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      loadScenario(btn.dataset.scenario);
    });
  });

  loadScenario('audio');
}

/* --------------------------------------------------------------------------
   4. PESTAÑAS DE INDUSTRIA
   -------------------------------------------------------------------------- */
const industryData = {
  restaurantes: {
    title: 'Restaurantes, Delivery y Gastronomía',
    badge: 'Cero pedidos perdidos en horas pico',
    description: 'Envía el menú digital, toma pedidos con ingredientes adicionales, solicita dirección de entrega y gestiona reservas de mesas sin saturar a los meseros.',
    stat: '+35% ventas en delivery nocturno',
    photo: 'assets/images/sofia-restaurant.jpeg',
    quote: '"Hola Sofía, quiero 2 hamburguesas especiales sin cebolla y papas extras para delivery"'
  },
  servicios: {
    title: 'Servicios Profesionales, Asesorías y Agencias',
    badge: 'Calificación automática de prospectos',
    description: 'Filtra clientes por presupuesto y requerimientos antes de agendar con tus consultores o asesores contables, legales o de marketing.',
    stat: '85% horas ahorradas en prospección',
    photo: 'assets/images/sofia-services.jpeg',
    quote: '"Necesito una cotización para auditoría contable y declaración mensual"'
  },
  salud: {
    title: 'Clínicas, Médicos y Odontología',
    badge: 'Agendamiento y lectura de récipes',
    description: 'Organiza consultas por doctor y especialidad, lee órdenes de laboratorio y envía instrucciones de preparación (ayuno, reposo) automáticamente.',
    stat: '99% puntualidad en citas confirmadas',
    photo: 'assets/images/sofia-health.jpeg',
    quote: '"¿Tienen cita con pediatra para el viernes en la mañana?"'
  },
  nocturno: {
    title: 'Atención 24/7 y Ventas Mientras Duermes',
    badge: 'El 60% de compras se deciden fuera de horario',
    description: 'Sofía nunca se desconecta: domingos, feriados o a las 3:00 AM. Registra pagos, confirma pedidos y atiende a desvelados con la misma calidez.',
    stat: '100% de leads nocturnos rescatados',
    photo: 'assets/images/sofia-247.jpeg',
    quote: '"Hola, vi su publicación en Instagram a las 2:00 AM, ¿todavía tienen disponibilidad?"'
  }
};

function initIndustryTabs() {
  const tabButtons = document.querySelectorAll('.industry-tab-btn');
  const titleEl = document.getElementById('industryTitle');
  const badgeEl = document.getElementById('industryBadge');
  const descEl = document.getElementById('industryDesc');
  const statEl = document.getElementById('industryStat');
  const photoEl = document.getElementById('industryPhoto');
  const quoteEl = document.getElementById('industryQuote');

  if (!tabButtons.length || !titleEl) return;

  function switchIndustry(key) {
    const item = industryData[key];
    if (!item) return;

    tabButtons.forEach(btn => {
      if (btn.dataset.industry === key) {
        btn.classList.add('border-emerald-500', 'bg-emerald-50/80', 'text-emerald-900', 'shadow-sm');
        btn.classList.remove('border-transparent', 'bg-white/60', 'text-slate-600');
      } else {
        btn.classList.remove('border-emerald-500', 'bg-emerald-50/80', 'text-emerald-900', 'shadow-sm');
        btn.classList.add('border-transparent', 'bg-white/60', 'text-slate-600');
      }
    });

    titleEl.textContent = item.title;
    badgeEl.textContent = item.badge;
    descEl.textContent = item.description;
    statEl.textContent = item.stat;
    quoteEl.textContent = item.quote;

    if (photoEl) {
      photoEl.style.opacity = '0';
      setTimeout(() => {
        photoEl.src = item.photo;
        photoEl.style.opacity = '1';
      }, 200);
    }
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => switchIndustry(btn.dataset.industry));
  });
}

/* --------------------------------------------------------------------------
   5. ACORDEÓN DE PREGUNTAS FRECUENTES (FAQ)
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const content = item.querySelector('.faq-content');
    const chevron = item.querySelector('.faq-chevron');

    if (!header || !content) return;

    header.addEventListener('click', () => {
      const isOpen = !content.classList.contains('hidden');
      document.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
      document.querySelectorAll('.faq-chevron').forEach(i => i.classList.remove('rotate-180'));

      if (!isOpen) {
        content.classList.remove('hidden');
        if (chevron) chevron.classList.add('rotate-180');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   6. TOGGLE DE PRECIOS
   -------------------------------------------------------------------------- */
function initPricingToggle() {
  const toggleBtn = document.getElementById('pricingToggle');
  const priceBasic = document.getElementById('priceBasic');
  const pricePro = document.getElementById('pricePro');
  const periodBadges = document.querySelectorAll('.billing-period');

  if (!toggleBtn) return;

  let isAnnual = false;

  toggleBtn.addEventListener('click', () => {
    isAnnual = !isAnnual;
    toggleBtn.classList.toggle('bg-emerald-500', isAnnual);
    toggleBtn.classList.toggle('bg-slate-300', !isAnnual);

    const knob = toggleBtn.querySelector('span');
    if (knob) {
      knob.classList.toggle('translate-x-6', isAnnual);
      knob.classList.toggle('translate-x-1', !isAnnual);
    }

    if (isAnnual) {
      if (priceBasic) priceBasic.textContent = '$39';
      if (pricePro) pricePro.textContent = '$79';
      periodBadges.forEach(b => b.textContent = '/mes (facturado anual)');
    } else {
      if (priceBasic) priceBasic.textContent = '$49';
      if (pricePro) pricePro.textContent = '$99';
      periodBadges.forEach(b => b.textContent = '/mes');
    }
  });
}

/* --------------------------------------------------------------------------
   7. WIDGET ASISTENTE STICKY FLOTANTE
   -------------------------------------------------------------------------- */
function initStickyAssistant() {
  const widgetBtn = document.getElementById('stickySofiaWidget');
  const bubbleMsg = document.getElementById('stickySofiaBubble');

  if (!widgetBtn) return;

  setTimeout(() => {
    if (bubbleMsg) {
      bubbleMsg.classList.remove('opacity-0', 'translate-y-2', 'pointer-events-none');
      bubbleMsg.classList.add('opacity-100', 'translate-y-0');
    }
  }, 2500);

  widgetBtn.addEventListener('click', () => {
    const sim = document.getElementById('demo-interactiva');
    if (sim) sim.scrollIntoView({ behavior: 'smooth' });
  });
}
