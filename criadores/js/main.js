/* ==========================================================================
   TOOKAS CREATORS - INTERACTIVE JAVASCRIPT (v5.0)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initCalculator();
  initFormHandler();
  initPills();
  initSmoothScroll();
  initContractModal();
});

/* 1. Navbar Glassmorphism Scroll Effect */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* 2. Interactive Earnings & Rewards Calculator (Ticket R$ 230 | Comissão 10%) */
function initCalculator() {
  const followersInput = document.getElementById('followersRange');
  const salesInput = document.getElementById('salesRange');
  
  const followersValDisplay = document.getElementById('followersVal');
  const salesValDisplay = document.getElementById('salesVal');
  
  const recommendedTierDisplay = document.getElementById('calcRecommendedTier');
  const totalValueDisplay = document.getElementById('calcTotalValue');
  const productVoucherDisplay = document.getElementById('calcProductVoucher');
  const estCommissionDisplay = document.getElementById('calcEstCommission');

  if (!followersInput || !salesInput) return;

  function updateCalculator() {
    const followers = parseInt(followersInput.value);
    const sales = parseInt(salesInput.value);

    // Format Displays
    followersValDisplay.textContent = followers >= 100000 ? '+100k' : `${(followers / 1000).toFixed(0)}k`;
    salesValDisplay.textContent = `${sales} vendas/mês`;

    let tierName = 'TOOKAS CREATOR';
    let productVoucher = 300;

    if (followers >= 35000 || sales >= 60) {
      tierName = 'TOOKAS AMBASSADOR';
      productVoucher = 1000;
    } else if (followers >= 10000 || sales >= 25) {
      tierName = 'TOOKAS PERFORMANCE';
      productVoucher = 600;
    }

    // Commission logic: Ticket médio R$ 230 * 10% comissão = R$ 23,00 por venda
    const avgTicket = 230;
    const commissionRate = 0.10;
    const monthlyCommission = Math.round(sales * avgTicket * commissionRate);
    const totalBenefit = productVoucher + monthlyCommission;

    // DOM Updates
    recommendedTierDisplay.textContent = `NÍVEL RECOMENDADO: ${tierName}`;
    productVoucherDisplay.textContent = `R$ ${productVoucher.toLocaleString('pt-BR')}`;
    estCommissionDisplay.textContent = `R$ ${monthlyCommission.toLocaleString('pt-BR')}`;
    totalValueDisplay.textContent = `R$ ${totalBenefit.toLocaleString('pt-BR')}/mês`;
  }

  followersInput.addEventListener('input', updateCalculator);
  salesInput.addEventListener('input', updateCalculator);
  
  // Initial run
  updateCalculator();
}

/* 3. Form & Dual Destination Handler (WhatsApp + Email) */
function initFormHandler() {
  const form = document.getElementById('creatorAppForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('appName').value.trim();
    const instagram = document.getElementById('appInstagram').value.trim();
    const followers = document.getElementById('appFollowers').value;
    const tier = document.getElementById('appTier').value;
    const city = document.getElementById('appCity').value.trim();
    const contractAccepted = document.getElementById('appContractCheck') ? document.getElementById('appContractCheck').checked : true;

    if (!name || !instagram) {
      showToast('Por favor, preencha seu Nome e Instagram!', 'error');
      return;
    }

    if (!contractAccepted) {
      showToast('Você precisa aceitar os termos do contrato para continuar!', 'error');
      return;
    }

    // 1. Dispatch background email notification to criativo.tookas@gmail.com
    fetch('https://formspree.io/f/criativo.tookas@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        nome: name,
        instagram: instagram,
        seguidores: followers,
        plano: tier,
        cidade: city || 'Não informada',
        contrato_aceito: 'Sim (Aceite Digital no Site)',
        destino_email: 'criativo.tookas@gmail.com'
      })
    }).catch(err => console.log('Envio por e-mail em segundo plano:', err));

    // 2. Format WhatsApp Direct Message
    const message = `Olá! Quero me tornar um Afiliado Tookas.\n\n*Dados de Cadastro:*\n- Nome: ${name}\n- Instagram: @${instagram.replace('@', '')}\n- Seguidores: ${followers}\n- Plano Pretendido: ${tier}\n- Cidade: ${city || 'Não informada'}\n- Contrato Aceito: Sim (Aceito no site)`;

    const encodedMsg = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/554792415457?text=${encodedMsg}`;

    showToast('Enviando dados de cadastro...', 'success');

    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 800);
  });
}

/* 4. Contract Modal Toggle */
function initContractModal() {
  const openBtns = document.querySelectorAll('.open-contract-modal');
  const closeBtn = document.getElementById('closeContractModal');
  const modal = document.getElementById('contractModal');

  if (!modal) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  });
}

/* 5. Manifesto Pills Switcher */
function initPills() {
  const pills = document.querySelectorAll('.pill-tag');
  const manifestoText = document.getElementById('manifestoDynamicText');

  const texts = {
    'MODA': 'A Tookas cria peças com caimento impecável, tecidos tecnológicos e cortes modernos que acompanham a evolução do streetwear esportivo.',
    'ESPORTE': 'Desenvolvido para alta performance. Do treino pesado na academia até corridas noturnas, nossas peças entregam resistência e conforto máximo.',
    'MOVIMENTO': 'O movimento é o nosso DNA. Não ficamos parados e buscamos criadores autênticos que vivem em constante evolução.',
    'PERFORMANCE': 'Para quem transforma conteúdo em resultado. Nossos embaixadores recebem suporte completo e produtos de alta qualidade.'
  };

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const tag = pill.getAttribute('data-tag');
      if (manifestoText && texts[tag]) {
        manifestoText.style.opacity = '0';
        setTimeout(() => {
          manifestoText.textContent = texts[tag];
          manifestoText.style.opacity = '1';
        }, 150);
      }
    });
  });
}

/* 6. Smooth Scroll links */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/* 7. Toast Notification System */
function showToast(message, type = 'success') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    const container = document.createElement('div');
    container.className = 'toast-container';
    container.innerHTML = `<div class="toast"><span class="toast-msg"></span></div>`;
    document.body.appendChild(container);
    toast = container.querySelector('.toast');
  }

  const msgSpan = toast.querySelector('.toast-msg');
  msgSpan.textContent = message;

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}
