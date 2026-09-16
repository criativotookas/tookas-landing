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
  initVideosCriadores();
  initIrParaCadastro();
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
    const whatsapp = (document.getElementById('appWhatsapp') || {}).value ? document.getElementById('appWhatsapp').value.trim() : '';
    const email = (document.getElementById('appEmail') || {}).value ? document.getElementById('appEmail').value.trim() : '';
    const contractAccepted = document.getElementById('appContractCheck') ? document.getElementById('appContractCheck').checked : true;

    if (!name || !instagram) {
      showToast('Por favor, preencha seu Nome e Instagram!', 'error');
      return;
    }

    // WhatsApp e e-mail existem para a Tookas conseguir te achar mesmo que voce
    // nao conclua o envio no WhatsApp la embaixo.
    if (!whatsapp || whatsapp.replace(/\D/g, '').length < 10) {
      showToast('Informe seu WhatsApp com DDD. Ex: (47) 99999-9999', 'error');
      return;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      showToast('Informe um e-mail válido para receber o retorno.', 'error');
      return;
    }

    if (!contractAccepted) {
      showToast('Você precisa aceitar os termos do contrato para continuar!', 'error');
      return;
    }

    // 1. Registra a inscricao no Sistema Interno, que manda por e-mail para
    //    criativo.tookas@gmail.com e mkt@tookas.com.br (Resend).
    //    Antes isto ia para formspree.io/f/criativo.tookas@gmail.com, que
    //    responde 404 FORM_NOT_FOUND - endpoint legado, nunca configurado.
    //    O WhatsApp abaixo acontece de qualquer jeito: ele e o caminho
    //    principal da inscricao, e nao pode depender deste aviso.
    fetch('https://sistema.aitookas.com.br/api/inscricao-criador', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: 'tks-insc-40eea636d5929f3600982d82',
        nome: name,
        instagram: instagram,
        whatsapp: whatsapp,
        email: email,
        seguidores: followers,
        plano: tier,
        cidade: city || 'Nao informada',
        contrato_aceito: 'Sim (Aceite Digital no Site)'
      })
    })
      .then(res => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(dados => console.log('[inscricao] aviso por e-mail enviado', dados))
      .catch(err => console.error('[inscricao] falhou o aviso por e-mail:', err));

    // 2. Format WhatsApp Direct Message
    const message = `Olá! Quero me tornar um Afiliado Tookas.\n\n*Dados de Cadastro:*\n- Nome: ${name}\n- Instagram: @${instagram.replace('@', '')}\n- WhatsApp: ${whatsapp}\n- E-mail: ${email}\n- Seguidores: ${followers}\n- Plano Pretendido: ${tier}\n- Cidade: ${city || 'Não informada'}\n- Contrato Aceito: Sim (Aceito no site)`;

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
  // O CTA do cadastro tem dono proprio (initIrParaCadastro): ele avisa antes de
  // rolar, e dois donos no mesmo clique dariam dois scrolls.
  document.querySelectorAll('a[href^="#"]:not(.ir-para-cadastro)').forEach(anchor => {
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

  // Sem limpar o timer anterior, um segundo aviso dentro dos 4 s herda a
  // contagem do primeiro e some antes de ser lido (medido: o aviso do CTA da
  // barra nao aparecia quando vinha logo depois do aviso do topo).
  clearTimeout(toast._timer);
  toast.classList.add('show');
  toast._timer = setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

/* 8. Vídeos dos Criadores (trilha horizontal) */
function initVideosCriadores() {
  const trilha = document.getElementById('videosCriadores');
  if (!trilha) return;

  const cards = Array.from(trilha.querySelectorAll('.video-card'));

  function pararTodos(menos) {
    cards.forEach((card) => {
      const video = card.querySelector('.video-card__media');
      if (!video || video === menos) return;
      video.pause();
      video.controls = false;
      card.classList.remove('tocando');
    });
  }

  cards.forEach((card) => {
    const video = card.querySelector('.video-card__media');
    const botao = card.querySelector('.video-card__play');
    if (!video || !botao) return;

    botao.addEventListener('click', () => {
      // Um de cada vez: som de dois vídeos juntos é o jeito mais rápido
      // de a pessoa fechar a página.
      pararTodos(video);
      video.controls = true;
      card.classList.add('tocando');
      const tocou = video.play();
      if (tocou && typeof tocou.catch === 'function') {
        tocou.catch(() => {
          // Autoplay bloqueado ou arquivo indisponível: devolve o poster
          // em vez de deixar um retângulo preto sem explicação.
          video.controls = false;
          card.classList.remove('tocando');
          showToast('Não consegui abrir o vídeo. Tente de novo.', 'error');
        });
      }
    });

    // Terminou: volta ao poster, pronto para o próximo clique.
    video.addEventListener('ended', () => {
      video.controls = false;
      video.currentTime = 0;
      card.classList.remove('tocando');
    });
  });

  // Setas do desktop: andam um cartão por clique.
  const esq = document.querySelector('.videos-seta--esq');
  const dir = document.querySelector('.videos-seta--dir');
  const passo = () => (cards[0] ? cards[0].offsetWidth + 20 : 260);

  function atualizarSetas() {
    if (!esq || !dir) return;
    const fim = trilha.scrollWidth - trilha.clientWidth - 8;
    esq.hidden = trilha.scrollLeft <= 8;
    dir.hidden = trilha.scrollLeft >= fim;
  }

  if (esq) esq.addEventListener('click', () => trilha.scrollBy({ left: -passo(), behavior: 'smooth' }));
  if (dir) dir.addEventListener('click', () => trilha.scrollBy({ left: passo(), behavior: 'smooth' }));
  trilha.addEventListener('scroll', atualizarSetas, { passive: true });
  window.addEventListener('resize', atualizarSetas);
  atualizarSetas();
}

/* 9. CTA "Quero Ser Criador" (barra e topo) -> avisa e leva ao formulario */
function initIrParaCadastro() {
  const destino = document.getElementById('inscrever');
  const botoes = document.querySelectorAll('.ir-para-cadastro');
  if (!destino || !botoes.length) return;

  botoes.forEach((botao) => {
    botao.addEventListener('click', (e) => {
      e.preventDefault();
      // O aviso some sozinho (4 s, o padrao do showToast).
      showToast('Preencha seus dados abaixo para se inscrever.', 'success');
      destino.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // No desktop, deixa o cursor pronto no primeiro campo. No celular nao:
      // o teclado subiria por cima da pagina antes de a pessoa ver onde caiu.
      if (window.innerWidth >= 900) {
        const nome = document.getElementById('appName');
        if (nome) setTimeout(() => nome.focus({ preventScroll: true }), 900);
      }
    });
  });
}
