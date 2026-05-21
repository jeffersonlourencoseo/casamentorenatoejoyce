// Renato & Joyce — Main Script v2 (Accordion gifts)

document.addEventListener('DOMContentLoaded', () => {
  /* ---------------- Nav scroll + hamburger ---------------- */
  const navFixed = document.getElementById('nav-fixed');
  const navToggle = document.getElementById('nav-toggle');
  const navOverlay = document.getElementById('nav-overlay');
  const navOverlayClose = document.getElementById('nav-overlay-close');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navFixed) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) navFixed.classList.add('scrolled');
      else navFixed.classList.remove('scrolled');
    }, { passive: true });
  }

  function openMenu() {
    navToggle.classList.add('active');
    navToggle.setAttribute('aria-expanded', 'true');
    navOverlay.classList.add('open');
    navOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    navOverlay.classList.remove('open');
    navOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (navToggle) navToggle.addEventListener('click', () => {
    if (navOverlay.classList.contains('open')) closeMenu();
    else openMenu();
  });

  if (navOverlayClose) navOverlayClose.addEventListener('click', closeMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  /* ---------------- Countdown ---------------- */
  const targetDate = new Date('2026-02-14T17:00:00-03:00'); // Rio timezone

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function updateCountdown() {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      document.getElementById('days').textContent = '00';
      document.getElementById('hours').textContent = '00';
      document.getElementById('minutes').textContent = '00';
      document.getElementById('seconds').textContent = '00';
      return;
    }

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    document.getElementById('days').textContent    = pad(days);
    document.getElementById('hours').textContent   = pad(hours);
    document.getElementById('minutes').textContent = pad(minutes);
    document.getElementById('seconds').textContent = pad(seconds);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ---------------- Lista de Presentes (Accordion) ---------------- */
  const giftsData = [
    { id: 1,  category: 'imoveis',       emoji: '🏠', name: 'Cobertura duplex em Ipanema', price: 59.90, meta: 'Vista pro mar inclusa' },
    { id: 2,  category: 'imoveis',       emoji: '🏠', name: 'Sítio com piscina no interior', price: 74.00, meta: 'Galinha não inclusa' },
    { id: 3,  category: 'imoveis',       emoji: '🏠', name: 'Apartamento em Paris', price: 67.50, meta: 'Janela com vista pra Torre' },
    { id: 4,  category: 'imoveis',       emoji: '🏠', name: 'Casa na praia em Búzios', price: 82.00, meta: 'Hamaca no jardim' },
    { id: 5,  category: 'imoveis',       emoji: '🏠', name: 'Chácara com lago', price: 55.00, meta: 'Peixe opcional' },
    { id: 6,  category: 'imoveis',       emoji: '🏠', name: 'Mansão em Angra dos Reis', price: 91.00, meta: 'Segurança 24h incluso' },
    { id: 7,  category: 'imoveis',       emoji: '🏠', name: 'Bangalô nas Maldivas', price: 99.90, meta: 'Voo não incluso (infelizmente)' },
    { id: 8,  category: 'imoveis',       emoji: '🏠', name: 'Cabana na neve na Suíça', price: 138.00, meta: 'Casaco por conta própria' },
    { id: 9,  category: 'veiculos',      emoji: '🚗', name: 'Ferrari 0km vermelha', price: 60.00, meta: 'Gasolina por conta' },
    { id: 10, category: 'veiculos',      emoji: '🚗', name: 'Lamborghini amarela', price: 75.00, meta: 'Para quem ama ser visto' },
    { id: 11, category: 'veiculos',      emoji: '🚗', name: 'Porsche Cayenne', price: 83.00, meta: 'Para ir ao mercado com classe' },
    { id: 12, category: 'veiculos',      emoji: '🚗', name: 'Helicóptero privativo', price: 95.00, meta: 'Piloto não incluso' },
    { id: 13, category: 'veiculos',      emoji: '🚗', name: 'Iate 40 pés', price: 120.00, meta: 'Mar por conta do comprador' },
    { id: 14, category: 'veiculos',      emoji: '🚗', name: 'Moto Ducati', price: 57.00, meta: 'Capacete obrigatório' },
    { id: 15, category: 'veiculos',      emoji: '🚗', name: 'Jatinho particular', price: 149.00, meta: 'Combustível à parte' },
    { id: 16, category: 'veiculos',      emoji: '🚗', name: 'Trator da fazenda', price: 52.00, meta: 'Ótimo pra lua de mel rural' },
    { id: 17, category: 'viagens',       emoji: '✈️', name: 'Lua de mel em Bora Bora', price: 89.00, meta: '15 dias all inclusive' },
    { id: 18, category: 'viagens',       emoji: '✈️', name: 'Cruzeiro pelo Mediterrâneo', price: 76.00, meta: 'Enjoo por conta' },
    { id: 19, category: 'viagens',       emoji: '✈️', name: 'Safari na África', price: 94.00, meta: 'Leão não incluso' },
    { id: 20, category: 'viagens',       emoji: '✈️', name: 'Viagem pra Disney', price: 61.00, meta: 'Fila de 3h grátis' },
    { id: 21, category: 'viagens',       emoji: '✈️', name: 'Tokyo + Kyoto 10 dias', price: 87.00, meta: 'Sushi liberado' },
    { id: 22, category: 'viagens',       emoji: '✈️', name: 'Volta ao mundo em 80 dias', price: 145.00, meta: 'Passaporte necessário' },
    { id: 23, category: 'viagens',       emoji: '✈️', name: 'Retiro espiritual no Tibete', price: 55.00, meta: 'Wi-fi não garantido' },
    { id: 24, category: 'viagens',       emoji: '✈️', name: 'Road trip nos EUA', price: 68.00, meta: 'Gasolina cara por lá' },
    { id: 25, category: 'familia',       emoji: '👨‍👩‍👧', name: 'Sogra simpática', price: 99.90, meta: 'ESGOTADO permanentemente' },
    { id: 26, category: 'familia',       emoji: '👨‍👩‍👧', name: 'Cunhado calado', price: 85.00, meta: 'Raro. Muito raro.' },
    { id: 27, category: 'familia',       emoji: '👨‍👩‍👧', name: 'Bebê que dorme a noite', price: 75.00, meta: 'Produto premium' },
    { id: 28, category: 'familia',       emoji: '👨‍👩‍👧', name: 'Cachorro que não late', price: 62.00, meta: 'Milagre da engenharia' },
    { id: 29, category: 'familia',       emoji: '👨‍👩‍👧', name: 'Gato que não derruba coisas', price: 57.00, meta: 'Lenda urbana' },
    { id: 30, category: 'familia',       emoji: '👨‍👩‍👧', name: 'Filho que come de tudo', price: 80.00, meta: 'Sem choro extra' },
    { id: 31, category: 'familia',       emoji: '👨‍👩‍👧', name: 'Vizinho silencioso', price: 91.00, meta: 'Produto escasso no Brasil' },
    { id: 32, category: 'familia',       emoji: '👨‍👩‍👧', name: 'Parente que não opina', price: 130.00, meta: 'Praticamente um unicórnio' },
    { id: 33, category: 'tecnologia',    emoji: '📺', name: 'TV 100 polegadas', price: 72.00, meta: 'Quarto talvez não caiba' },
    { id: 34, category: 'tecnologia',    emoji: '📺', name: 'PlayStation 6', price: 65.00, meta: 'Casamento sobrevivente opcional' },
    { id: 35, category: 'tecnologia',    emoji: '📺', name: 'iPhone do futuro', price: 88.00, meta: 'Modelo ainda não existe' },
    { id: 36, category: 'tecnologia',    emoji: '📺', name: 'Geladeira que nunca acaba', price: 79.00, meta: 'Física suspensa' },
    { id: 37, category: 'tecnologia',    emoji: '📺', name: 'Robô de limpeza inteligente', price: 54.00, meta: 'Mais inteligente que alguns convidados' },
    { id: 38, category: 'tecnologia',    emoji: '📺', name: 'Ar condicionado eterno', price: 66.00, meta: 'Conta de luz por conta de vocês' },
    { id: 39, category: 'tecnologia',    emoji: '📺', name: 'Wi-fi infinito e rápido', price: 51.00, meta: 'Operadora não garante' },
    { id: 40, category: 'tecnologia',    emoji: '📺', name: 'Máquina de café perfeito', price: 93.00, meta: 'Sonho de todo casal' },
    { id: 41, category: 'relacionamento',emoji: '💑', name: 'Controle remoto que ela não esconde', price: 58.00, meta: 'Produto histórico' },
    { id: 42, category: 'relacionamento',emoji: '💑', name: 'Direito de assistir futebol sem drama', price: 77.00, meta: 'Válido por 1 mês' },
    { id: 43, category: 'relacionamento',emoji: '💑', name: 'Paz no lar por 1 ano', price: 99.90, meta: 'Renovável' },
    { id: 44, category: 'relacionamento',emoji: '💑', name: 'Ele ter razão pelo menos uma vez', price: 50.00, meta: 'Promoção única na vida' },
    { id: 45, category: 'relacionamento',emoji: '💑', name: 'Ela admitir que estava errada', price: 140.00, meta: 'Produto raríssimo' },
    { id: 46, category: 'relacionamento',emoji: '💑', name: 'Noite de cinema sem discussão de filme', price: 63.00, meta: 'Inclui pipoca' },
    { id: 47, category: 'relacionamento',emoji: '💑', name: 'Viagem sem se perder', price: 71.00, meta: 'GPS incluso' },
    { id: 48, category: 'relacionamento',emoji: '💑', name: 'Jantar romântico sem celular', price: 84.00, meta: 'Desafio aceito?' },
    { id: 49, category: 'gastronomia',   emoji: '🍽️', name: 'Rodízio de pizza infinito', price: 53.00, meta: 'Colesterol por conta' },
    { id: 50, category: 'gastronomia',   emoji: '🍽️', name: 'Churrasco com picanha real', price: 78.00, meta: 'Sem frango disfarçado' },
    { id: 51, category: 'gastronomia',   emoji: '🍽️', name: 'Vinho que não dá ressaca', price: 96.00, meta: 'Produto inexistente mas sonhamos' },
    { id: 52, category: 'gastronomia',   emoji: '🍽️', name: 'Açaí do tamanho de uma banheira', price: 60.00, meta: 'Colher inclusa' },
    { id: 53, category: 'gastronomia',   emoji: '🍽️', name: 'Pão de queijo quentinho eternamente', price: 55.00, meta: 'Mineiro aprovaria' },
    { id: 54, category: 'gastronomia',   emoji: '🍽️', name: 'Feijoada todo sábado', price: 69.00, meta: 'Calça elástica recomendada' },
    { id: 55, category: 'gastronomia',   emoji: '🍽️', name: 'Brigadeiro artesanal a granel', price: 74.00, meta: '10kg mínimo' },
    { id: 56, category: 'gastronomia',   emoji: '🍽️', name: 'Hambúrguer gourmet sem culpa', price: 81.00, meta: 'Calorias removidas' },
    { id: 57, category: 'saude',         emoji: '💪', name: 'Academia que você vai todo dia', price: 50.00, meta: 'Motivação não inclusa' },
    { id: 58, category: 'saude',         emoji: '💪', name: 'Personal trainer paciente', price: 87.00, meta: 'Muito paciente' },
    { id: 59, category: 'saude',         emoji: '💪', name: 'Dieta que funciona sem sofrimento', price: 99.00, meta: 'Ainda em fase de pesquisa' },
    { id: 60, category: 'saude',         emoji: '💪', name: 'Sono de 8h sem bebê acordando', price: 142.00, meta: 'Disponível apenas pré-filhos' },
    { id: 61, category: 'saude',         emoji: '💪', name: 'Massagem relaxante semanal', price: 76.00, meta: 'Por 1 ano' },
    { id: 62, category: 'saude',         emoji: '💪', name: 'Spa day completo', price: 83.00, meta: 'Inclui sauna e drama zero' },
    { id: 63, category: 'trabalho',      emoji: '💼', name: 'Promoção no emprego dela', price: 67.00, meta: 'RH não foi consultado' },
    { id: 64, category: 'trabalho',      emoji: '💼', name: 'Promoção no emprego dele', price: 67.00, meta: 'Mesma situação' },
    { id: 65, category: 'trabalho',      emoji: '💼', name: 'Home office eterno', price: 73.00, meta: 'Pijama incluso' },
    { id: 66, category: 'trabalho',      emoji: '💼', name: 'Segunda renda passiva', price: 58.00, meta: 'Sem esforço, claro' },
    { id: 67, category: 'trabalho',      emoji: '💼', name: 'Dívida que some sozinha', price: 99.90, meta: 'Inclui cartão de crédito' },
    { id: 68, category: 'trabalho',      emoji: '💼', name: 'Cheque em branco do banco', price: 88.00, meta: 'Limite: sim' },
    { id: 69, category: 'lazer',         emoji: '🎭', name: 'Netflix, Max, Prime e mais 7', price: 54.00, meta: 'Por 1 ano' },
    { id: 70, category: 'lazer',         emoji: '🎭', name: 'Ingresso VIP show do artista favorito', price: 79.00, meta: 'Camarote incluso' },
    { id: 71, category: 'lazer',         emoji: '🎭', name: 'Livro que ela vai terminar de ler', price: 51.00, meta: 'Esperança eterna' },
    { id: 72, category: 'lazer',         emoji: '🎭', name: 'Jogo de tabuleiro sem briga', price: 62.00, meta: 'Inclui manual de convivência' },
    { id: 73, category: 'lazer',         emoji: '🎭', name: 'Karaokê privativo por 1 noite', price: 70.00, meta: 'Vizinhos avisados' },
    { id: 74, category: 'lazer',         emoji: '🎭', name: 'Escape room em casa', price: 85.00, meta: 'Casamento já é um' },
    { id: 75, category: 'natureza',      emoji: '🌿', name: 'Jardim que se cuida sozinho', price: 66.00, meta: 'Tecnologia ainda não existe' },
    { id: 76, category: 'natureza',      emoji: '🌿', name: 'Piscina no quintal', price: 59.00, meta: 'Quintal não incluso' },
    { id: 77, category: 'natureza',      emoji: '🌿', name: 'Papagaio que não fala besteira', price: 81.00, meta: 'Muito difícil de treinar' },
    { id: 78, category: 'natureza',      emoji: '🌿', name: 'Hamster atlético', price: 52.00, meta: 'Roda turbo' },
    { id: 79, category: 'natureza',      emoji: '🌿', name: 'Peixe dourado da sorte', price: 57.00, meta: 'Garantia de 3 dias' },
    { id: 80, category: 'natureza',      emoji: '🌿', name: 'Cavalo de corrida', price: 125.00, meta: 'Estábulo não incluso' },
    { id: 81, category: 'conhecimento',  emoji: '🎓', name: 'Curso de cozinha italiana', price: 73.00, meta: 'Massa fresca todo dia' },
    { id: 82, category: 'conhecimento',  emoji: '🎓', name: 'Aulas de dança para ele', price: 68.00, meta: 'Urgente. Muito urgente.' },
    { id: 83, category: 'conhecimento',  emoji: '🎓', name: 'MBA que ela sempre quis', price: 90.00, meta: 'Currículo agradece' },
    { id: 84, category: 'conhecimento',  emoji: '🎓', name: 'Licença de piloto de avião', price: 97.00, meta: 'Vai com o jatinho do item 15' },
    { id: 85, category: 'conhecimento',  emoji: '🎓', name: 'Japonês fluente em 30 dias', price: 55.00, meta: 'Boa sorte' },
    { id: 86, category: 'conhecimento',  emoji: '🎓', name: 'Mestrado em Felicidade Conjugal', price: 84.00, meta: 'Curso inexistente mas necessário' },
    { id: 87, category: 'casa',          emoji: '🧹', name: 'Empregada que organiza e não some', price: 78.00, meta: 'Produto mítico' },
    { id: 88, category: 'casa',          emoji: '🧹', name: 'Lava-louça que também guarda', price: 91.00, meta: 'Modelo 2026' },
    { id: 89, category: 'casa',          emoji: '🧹', name: 'Ferro de passar que usa sozinho', price: 63.00, meta: 'Em fase de testes' },
    { id: 90, category: 'casa',          emoji: '🧹', name: 'Conta de luz que não aumenta', price: 50.00, meta: 'Ficção científica' },
    { id: 91, category: 'casa',          emoji: '🧹', name: 'Gerador solar grátis', price: 86.00, meta: 'Verde e econômico' },
    { id: 92, category: 'casa',          emoji: '🧹', name: 'Reforma da cozinha completa', price: 149.00, meta: 'Dentro do orçamento impossível' },
    { id: 93, category: 'casa',          emoji: '🔑', name: 'Chave do coração (teste PIX)', price: 0.01, meta: 'Para testar o pagamento antes do grande dia' },
    { id: 94, category: 'casa',          emoji: '🎁', name: 'Café da manhã na cama (teste)', price: 0.01, meta: 'Presente de teste para o grande dia' },
    { id: 95, category: 'casa',          emoji: '🎁', name: 'Jantar à luz de velas (teste)', price: 0.01, meta: 'Presente de teste para o grande dia' },
    { id: 96, category: 'casa',          emoji: '🎁', name: 'Passeio de bike (teste)', price: 0.01, meta: 'Presente de teste para o grande dia' },
    { id: 97, category: 'casa',          emoji: '🎁', name: 'Aula de culinária juntos (teste)', price: 0.01, meta: 'Presente de teste para o grande dia' },
    { id: 98, category: 'casa',          emoji: '🎁', name: 'Cesta de piquenique (teste)', price: 0.01, meta: 'Presente de teste para o grande dia' }
  ];

  const categoryNames = {
    imoveis: 'Imóveis',
    veiculos: 'Veículos',
    viagens: 'Viagens',
    familia: 'Família',
    tecnologia: 'Tecnologia',
    relacionamento: 'Relacionamento',
    gastronomia: 'Gastronomia',
    saude: 'Saúde',
    trabalho: 'Trabalho',
    casa: 'Casa',
    natureza: 'Natureza',
    conhecimento: 'Conhecimento',
    lazer: 'Lazer'
  };

  const categoryOrder = [
    'imoveis','veiculos','viagens','familia','tecnologia','relacionamento',
    'gastronomia','saude','trabalho','casa','natureza','conhecimento','lazer'
  ];

  let unavailableIds = [];
  const accordionContainer = document.getElementById('gifts-accordion');

  function formatPrice(value) {
    return 'R$' + value.toFixed(2).replace('.', ',');
  }

  function renderGiftCard(g) {
    const isUnavailable = unavailableIds.includes(g.id);
    return `
      <div class="gift-card ${isUnavailable ? 'unavailable' : ''}">
        <div class="gift-emoji">${g.emoji}</div>
        <div class="gift-name">${g.name}${isUnavailable ? ' <span class="gift-unavailable-label">INDISPONÍVEL</span>' : ''}</div>
        <div class="gift-meta">${g.meta}</div>
        <div class="gift-price">${formatPrice(g.price)}</div>
        ${isUnavailable ? '' : `<button class="gift-btn" data-id="${g.id}">Presentear 💛</button>`}
      </div>
    `;
  }

  function renderAccordion() {
    if (!accordionContainer) return;
    accordionContainer.innerHTML = '';

    categoryOrder.forEach(cat => {
      const items = giftsData.filter(g => g.category === cat);
      if (items.length === 0) return;

      const categoryDiv = document.createElement('div');
      categoryDiv.className = 'gift-category';
      categoryDiv.dataset.category = cat;

      const availableCount = items.filter(g => !unavailableIds.includes(g.id)).length;
      const countLabel = availableCount === items.length
        ? `${items.length} presentes`
        : `${availableCount} de ${items.length} disponíveis`;

      categoryDiv.innerHTML = `
        <button class="gift-category-header" aria-expanded="false">
          <span class="gift-category-name">${categoryNames[cat]}</span>
          <span class="gift-category-count">${countLabel}</span>
          <span class="gift-category-icon">›</span>
        </button>
        <div class="gift-category-body">
          <div class="gifts-grid">
            ${items.map(renderGiftCard).join('')}
          </div>
        </div>
      `;

      accordionContainer.appendChild(categoryDiv);

      // Attach toggle
      const header = categoryDiv.querySelector('.gift-category-header');
      header.addEventListener('click', () => {
        const isOpen = categoryDiv.classList.contains('open');
        // Close all others for cleaner mobile UX
        document.querySelectorAll('.gift-category.open').forEach(el => {
          if (el !== categoryDiv) {
            el.classList.remove('open');
            el.querySelector('.gift-category-header').setAttribute('aria-expanded', 'false');
          }
        });
        categoryDiv.classList.toggle('open');
        header.setAttribute('aria-expanded', String(!isOpen));
      });
    });

    // Attach presentear buttons
    accordionContainer.querySelectorAll('.gift-btn:not(:disabled)').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.dataset.id);
        openGiftModal(id);
      });
    });
  }

  /* ---------------- Modal / PIX Flow ---------------- */
  const modalPresentear = document.getElementById('modal-presentear');
  const modalSucesso    = document.getElementById('modal-sucesso');
  const modalClose      = document.getElementById('modal-close-presentear');
  const modalBodyForm   = document.getElementById('modal-body-form');
  const modalBodyPix    = document.getElementById('modal-body-pix');
  const modalGiftName   = document.getElementById('modal-gift-name');
  const modalGiftPrice  = document.getElementById('modal-gift-price');
  const inputName       = document.getElementById('payer-name');
  const inputSurname    = document.getElementById('payer-surname');
  const btnGerarPix     = document.getElementById('btn-gerar-pix');
  const btnCopiarPix    = document.getElementById('btn-copiar-pix');
  const modalQr         = document.getElementById('modal-qr');
  const modalStatus     = document.getElementById('modal-status');
  const inputMessage    = document.getElementById('gift-message');
  const btnEnviarRecado = document.getElementById('btn-enviar-recado');
  const modalFinalMsg   = document.getElementById('modal-final-msg');
  const confettiContainer = document.getElementById('confetti-container');

  let currentGiftId = null;
  let currentCorrelationId = null;
  let pollingInterval = null;
  let currentBrCode = '';

  function openModal(overlay) {
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(overlay) {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function resetModal() {
    modalBodyForm.classList.remove('hidden');
    modalBodyPix.classList.add('hidden');
    inputName.value = '';
    inputSurname.value = '';
    modalQr.innerHTML = '';
    modalStatus.textContent = 'Aguardando pagamento...';
    currentBrCode = '';
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
  }

  function resetSucessoModal() {
    inputMessage.value = '';
    modalFinalMsg.classList.add('hidden');
    btnEnviarRecado.classList.remove('hidden');
    btnEnviarRecado.disabled = false;
    if (confettiContainer) confettiContainer.innerHTML = '';
  }

  function openGiftModal(id) {
    const gift = giftsData.find(g => g.id === id);
    if (!gift) return;
    currentGiftId = id;
    resetModal();
    modalGiftName.textContent = gift.name;
    modalGiftPrice.textContent = formatPrice(gift.price);
    openModal(modalPresentear);
  }

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      closeModal(modalPresentear);
      resetModal();
    });
  }

  modalPresentear.addEventListener('click', (e) => {
    if (e.target === modalPresentear) {
      closeModal(modalPresentear);
      resetModal();
    }
  });

  modalSucesso.addEventListener('click', (e) => {
    if (e.target === modalSucesso) {
      closeModal(modalSucesso);
      resetSucessoModal();
    }
  });

  // Gerar PIX
  if (btnGerarPix) {
    btnGerarPix.addEventListener('click', async () => {
      const nome = inputName.value.trim();
      const sobrenome = inputSurname.value.trim();
      if (!nome || !sobrenome) {
        alert('Por favor, preencha nome e sobrenome.');
        return;
      }

      const gift = giftsData.find(g => g.id === currentGiftId);
      if (!gift) return;

      btnGerarPix.disabled = true;
      btnGerarPix.textContent = 'Gerando...';

      try {
        const res = await fetch('/api/criar-cobranca', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            presente: gift.name,
            valor: gift.price,
            nome,
            sobrenome
          })
        });
        const data = await res.json();
        if (!res.ok || data.error) {
          throw new Error(data.error || 'Erro ao gerar PIX');
        }

        currentCorrelationId = data.correlationID;
        currentBrCode = data.brCode || '';

        // Show QR
        modalBodyForm.classList.add('hidden');
        modalBodyPix.classList.remove('hidden');
        modalQr.innerHTML = `<img src="${data.qrCodeImage}" alt="QR Code PIX">`;

        // Start polling
        pollingInterval = setInterval(async () => {
          try {
            const checkRes = await fetch(`/api/checar-status?id=${encodeURIComponent(currentCorrelationId)}`);
            const checkData = await checkRes.json();
            if (checkData.status === 'COMPLETED') {
              clearInterval(pollingInterval);
              pollingInterval = null;
              closeModal(modalPresentear);
              resetModal();
              showSucesso(gift, nome, sobrenome);
            } else if (checkData.status === 'EXPIRED') {
              clearInterval(pollingInterval);
              pollingInterval = null;
              modalStatus.textContent = 'Pagamento expirado. Gere um novo PIX.';
            }
          } catch (err) {
            // Silently retry
          }
        }, 3000);
      } catch (err) {
        alert(err.message || 'Erro ao gerar PIX. Tente novamente.');
      } finally {
        btnGerarPix.disabled = false;
        btnGerarPix.textContent = 'Gerar PIX 💛';
      }
    });
  }

  // Copiar código PIX
  if (btnCopiarPix) {
    btnCopiarPix.addEventListener('click', async () => {
      if (!currentBrCode) return;
      try {
        await navigator.clipboard.writeText(currentBrCode);
        const original = btnCopiarPix.textContent;
        btnCopiarPix.textContent = 'Código copiado!';
        setTimeout(() => btnCopiarPix.textContent = original, 2000);
      } catch (e) {
        const ta = document.createElement('textarea');
        ta.value = currentBrCode;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        const original = btnCopiarPix.textContent;
        btnCopiarPix.textContent = 'Código copiado!';
        setTimeout(() => btnCopiarPix.textContent = original, 2000);
      }
    });
  }

  // Confetti
  function launchConfetti() {
    if (!confettiContainer) return;
    confettiContainer.innerHTML = '';
    const colors = ['#c9a84c', '#7a2d35', '#f2c4b0', '#fdf6ee', '#2c2420'];
    for (let i = 0; i < 40; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + '%';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = (Math.random() * 1.5) + 's';
      piece.style.animationDuration = (2 + Math.random() * 2) + 's';
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      confettiContainer.appendChild(piece);
    }
  }

  function showSucesso(gift, nome, sobrenome) {
    resetSucessoModal();
    openModal(modalSucesso);
    launchConfetti();
    modalSucesso.dataset.gift = JSON.stringify(gift);
    modalSucesso.dataset.nome = nome;
    modalSucesso.dataset.sobrenome = sobrenome;
  }

  // Enviar recado
  if (btnEnviarRecado) {
    btnEnviarRecado.addEventListener('click', async () => {
      const recado = inputMessage.value.trim();
      const giftJson = modalSucesso.dataset.gift;
      const nome = modalSucesso.dataset.nome;
      const sobrenome = modalSucesso.dataset.sobrenome;
      if (!giftJson || !nome) return;

      const gift = JSON.parse(giftJson);

      btnEnviarRecado.disabled = true;
      btnEnviarRecado.textContent = 'Enviando...';

      const url = window.APP_CONFIG && window.APP_CONFIG.googleSheetsWebhookUrl
        ? window.APP_CONFIG.googleSheetsWebhookUrl
        : '';

      try {
        if (url) {
          await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({
              timestamp: new Date().toISOString(),
              nome,
              sobrenome,
              presente: gift.name,
              valor: gift.price,
              recado
            })
          });
        }

        if (!unavailableIds.includes(gift.id)) {
          unavailableIds.push(gift.id);
        }
        renderAccordion();

        modalFinalMsg.classList.remove('hidden');
        btnEnviarRecado.classList.add('hidden');
      } catch (err) {
        alert('Erro ao enviar recado. Tente novamente.');
        btnEnviarRecado.disabled = false;
        btnEnviarRecado.textContent = 'Enviar recado 💛';
      }
    });
  }

  // Fetch unavailable items from Google Apps Script
  async function loadUnavailable() {
    const url = window.APP_CONFIG && window.APP_CONFIG.googleSheetsWebhookUrl
      ? window.APP_CONFIG.googleSheetsWebhookUrl
      : '';

    if (!url) {
      renderAccordion();
      return;
    }

    try {
      const res = await fetch(url + '?aba=presentes');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const purchasedNames = data
          .filter(row => {
            const status = (
              row.Status || row.status || row.STATUS || row[6] || ''
            ).toString().toUpperCase();
            return status === 'COMPLETED';
          })
          .map(row => (
            row.Presente || row.presente || row.PRESENTE || row[3] || ''
          ).toString().trim());

        giftsData.forEach(g => {
          if (purchasedNames.includes(g.name) && !unavailableIds.includes(g.id)) {
            unavailableIds.push(g.id);
          }
        });
      }
    } catch (e) {
      // Silently fail and render all available
    }
    renderAccordion();
  }

  loadUnavailable();

  /* ---------------- RSVP ---------------- */
  const rsvpName    = document.getElementById('rsvp-name');
  const rsvpSurname = document.getElementById('rsvp-surname');
  const rsvpBtns    = document.querySelectorAll('.rsvp-btn');
  const rsvpSubmit  = document.getElementById('rsvp-submit');
  const rsvpMsg     = document.getElementById('rsvp-msg');
  let rsvpChoice = '';

  rsvpBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      rsvpBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      rsvpChoice = btn.dataset.value;
    });
  });

  if (rsvpSubmit) {
    rsvpSubmit.addEventListener('click', async () => {
      const nome = (rsvpName.value || '').trim();
      const sobrenome = (rsvpSurname.value || '').trim();
      if (!nome || !sobrenome || !rsvpChoice) {
        alert('Preencha nome, sobrenome e escolha uma opção.');
        return;
      }

      rsvpSubmit.disabled = true;
      rsvpSubmit.textContent = 'Enviando...';

      const googleUrl = window.APP_CONFIG && window.APP_CONFIG.googleSheetsWebhookUrl
        ? window.APP_CONFIG.googleSheetsWebhookUrl
        : '';

      try {
        if (googleUrl) {
          await fetch(googleUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({
              aba: 'confirmacoes',
              timestamp: new Date().toISOString(),
              nome,
              sobrenome,
              confirmacao: rsvpChoice
            })
          });
        }

        // EmailJS
        const emailjsService = window.APP_CONFIG && window.APP_CONFIG.emailjsServiceId
          ? window.APP_CONFIG.emailjsServiceId : '';
        const emailjsTemplate = window.APP_CONFIG && window.APP_CONFIG.emailjsTemplateRsvp
          ? window.APP_CONFIG.emailjsTemplateRsvp : '';
        const emailjsPublicKey = window.APP_CONFIG && window.APP_CONFIG.emailjsPublicKey
          ? window.APP_CONFIG.emailjsPublicKey : '';

        if (emailjsService && emailjsTemplate && emailjsPublicKey) {
          await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              service_id: emailjsService,
              template_id: emailjsTemplate,
              user_id: emailjsPublicKey,
              template_params: {
                to_name: 'Renato & Joyce',
                from_name: `${nome} ${sobrenome}`,
                subject: `✅ ${nome} confirmou presença!`,
                message: `${nome} ${sobrenome} confirmou. Resposta: ${rsvpChoice}`
              }
            })
          });
        }

        launchConfetti();

        rsvpMsg.classList.remove('hidden');
        rsvpSubmit.classList.add('hidden');
        rsvpName.disabled = true;
        rsvpSurname.disabled = true;
        rsvpBtns.forEach(b => b.disabled = true);
      } catch (err) {
        alert('Erro ao confirmar presença. Tente novamente.');
        rsvpSubmit.disabled = false;
        rsvpSubmit.textContent = 'Confirmar presença 💛';
      }
    });
  }

  /* ---------------- Galeria / Lightbox ---------------- */
  const lightbox     = document.getElementById('lightbox');
  const lightboxImg  = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img && img.src) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || '';
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  });

  // Swipe down to close lightbox (mobile gesture)
  let lightboxTouchStartY = 0;
  lightbox.addEventListener('touchstart', (e) => {
    lightboxTouchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    const touchEndY = e.changedTouches[0].screenY;
    if (touchEndY - lightboxTouchStartY > 80) {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }, { passive: true });

  /* ---------------- Mural de Recados ---------------- */
  const muralGrid      = document.getElementById('mural-grid');
  const muralNome      = document.getElementById('mural-nome');
  const muralMensagem  = document.getElementById('mural-mensagem');
  const btnMuralEnviar = document.getElementById('btn-mural-enviar');

  function addPostIt(nome, mensagem, animate = true) {
    if (!muralGrid) return;
    const postIt = document.createElement('div');
    postIt.className = 'post-it';
    if (!animate) postIt.style.animation = 'none';
    const rotation = (Math.random() * 6 - 3).toFixed(1);
    postIt.style.transform = `rotate(${rotation}deg)`;
    postIt.innerHTML = `
      <div class="post-it-name">${nome}</div>
      <div class="post-it-msg">${mensagem}</div>
    `;
    muralGrid.prepend(postIt);
  }

  async function loadRecados() {
    const googleUrl = window.APP_CONFIG && window.APP_CONFIG.googleSheetsWebhookUrl
      ? window.APP_CONFIG.googleSheetsWebhookUrl
      : '';
    if (!googleUrl || !muralGrid) return;

    try {
      const res = await fetch(googleUrl + '?aba=recados');
      const data = await res.json();
      if (Array.isArray(data)) {
        muralGrid.innerHTML = '';
        data.slice().reverse().forEach(r => {
          addPostIt(r.nome || r[1], r.mensagem || r[2], false);
        });
      }
    } catch (e) {
      // Silently fail
    }
  }

  if (btnMuralEnviar) {
    btnMuralEnviar.addEventListener('click', async () => {
      const nome = (muralNome.value || '').trim();
      const mensagem = (muralMensagem.value || '').trim();
      if (!nome || !mensagem) {
        alert('Preencha nome e mensagem.');
        return;
      }

      btnMuralEnviar.disabled = true;
      btnMuralEnviar.textContent = 'Enviando...';

      const googleUrl = window.APP_CONFIG && window.APP_CONFIG.googleSheetsWebhookUrl
        ? window.APP_CONFIG.googleSheetsWebhookUrl
        : '';

      try {
        if (googleUrl) {
          await fetch(googleUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({
              aba: 'recados',
              timestamp: new Date().toISOString(),
              nome,
              mensagem
            })
          });
        }

        addPostIt(nome, mensagem, true);
        muralNome.value = '';
        muralMensagem.value = '';
      } catch (err) {
        alert('Erro ao enviar recado. Tente novamente.');
      } finally {
        btnMuralEnviar.disabled = false;
        btnMuralEnviar.textContent = 'Deixar recado 💛';
      }
    });
  }

  loadRecados();
});
