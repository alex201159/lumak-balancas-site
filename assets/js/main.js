(function(){
  var toggle = document.getElementById('navtoggle');
  var panel = document.getElementById('mobilePanel');
  toggle.addEventListener('click', function(){
    var open = panel.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  panel.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){
      panel.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a, .mobile-panel a').forEach(function(link){
    var href = link.getAttribute('href');
    if(href && href.split('#')[0] === currentPage){
      link.setAttribute('aria-current', 'page');
    }
  });

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var revealEls = document.querySelectorAll('.reveal:not(.in)');
  if('IntersectionObserver' in window && !reduceMotion){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold:0.14, rootMargin:'0px 0px -40px 0px' });
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in'); });
  }

  document.querySelectorAll('[data-count]').forEach(function(el){
    el.textContent = el.getAttribute('data-count');
  });

  var techForm = document.getElementById('techForm');
  if(techForm){
    techForm.addEventListener('submit', function(e){
      e.preventDefault();
      var name = (techForm.querySelector('#tf-nome').value.trim().split(' ')[0]) || 'você';
      var grid = document.getElementById('techFormGrid');
      grid.innerHTML =
        '<div class="tech-success">' +
          '<div class="icon-tile"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12l5 5L20 7"/></svg></div>' +
          '<h3 id="techSuccessName"></h3>' +
          '<p>Esta é uma demonstração do fluxo — no site final, sua equipe recebe este chamado por e-mail ou integrado ao WhatsApp.</p>' +
        '</div>';
      grid.querySelector('#techSuccessName').textContent = 'Solicitação recebida, ' + name + '!';
    });
  }

  var PRODUCT_INFO = {
    comercial: {
      title: 'Comercial',
      desc: 'Trabalhamos com modelos como a Digitron 200kg e balanças Systel (Cuora Max e Clipse), com instalação, manutenção preventiva e revisão periódica de calibração. Quando o equipamento de prateleira não atende exatamente ao seu fluxo de venda, desenvolvemos apps, programas e sistemas de pesagem sob medida para o seu negócio.'
    },
    industrial: {
      title: 'Industrial',
      desc: 'Plataformas industriais como as linhas Marte LS200 e LS300, aprovadas pelo INMETRO, com manutenção programada e revisão de calibração feitas por equipe própria. Também desenvolvemos sistemas personalizados para automatizar pesagens, registrar dados e agilizar processos quando a linha de produção exige algo além do equipamento padrão.'
    },
    rodoviaria: {
      title: 'Rodoviária',
      desc: 'Balanças rodoviárias de alta capacidade para pesagem de caminhões, com manutenção preventiva e corretiva e revisão periódica de calibração, com relatório no modelo RBC. Avaliamos o volume e o tipo de carga da sua operação para propor a solução mais adequada.'
    },
    analitica: {
      title: 'Analítica',
      desc: 'Equipamentos de alta precisão para laboratório e controle de qualidade, com manutenção especializada e revisão de calibração dentro dos padrões exigidos pelo INMETRO. Ajudamos a definir a configuração ideal para a sua rotina de análises.'
    },
    pecuaria: {
      title: 'Barra e indicador Lumak para gado',
      desc: 'Solução própria da Lumak para balança de gado: barras robustas, indicador dedicado e controle total da pesagem pelo app. O sistema é ajustado para a rotina da fazenda e pode ser integrado ao fluxo de manejo. Também desenvolvemos apps, programas e sistemas sob medida para automatizar processos de pesagem em empresas.'
    }
  };
  var modal = document.getElementById('productModal');
  if(modal){
    var modalTitle = document.getElementById('modalTitle');
    var modalDesc = document.getElementById('modalDesc');
    var modalClose = document.getElementById('modalClose');
    var lastFocused = null;
    function openModal(key){
      var info = PRODUCT_INFO[key];
      if(!info) return;
      lastFocused = document.activeElement;
      modalTitle.textContent = info.title;
      modalDesc.textContent = info.desc;
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
      modalClose.focus();
    }
    function closeModal(){
      modal.hidden = true;
      document.body.style.overflow = '';
      if(lastFocused) lastFocused.focus();
    }
    document.querySelectorAll('.go[data-product]').forEach(function(btn){
      btn.addEventListener('click', function(){ openModal(btn.getAttribute('data-product')); });
    });
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e){ if(e.target === modal) closeModal(); });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && !modal.hidden) closeModal();
    });
  }
})();
