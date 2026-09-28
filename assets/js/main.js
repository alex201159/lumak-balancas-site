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
      if(!techForm.checkValidity()){
        techForm.reportValidity();
        return;
      }
      var message = [
        'Olá, preciso de assistência técnica da Lumak.',
        'Nome: ' + techForm.querySelector('#tf-nome').value.trim(),
        'Telefone: ' + techForm.querySelector('#tf-tel').value.trim(),
        'E-mail: ' + techForm.querySelector('#tf-email').value.trim(),
        'Mensagem: ' + techForm.querySelector('#tf-msg').value.trim()
      ].join('\n');
      window.open('https://wa.me/5537999948194?text=' + encodeURIComponent(message), '_blank', 'noopener');
    });
  }

  var contactForm = document.getElementById('contactForm');
  if(contactForm){
    contactForm.addEventListener('submit', function(e){
      e.preventDefault();
      if(!contactForm.checkValidity()){
        contactForm.reportValidity();
        return;
      }
      var message = [
        'Olá, gostaria de solicitar um orçamento com a Lumak Balanças.',
        'Nome: ' + contactForm.querySelector('#cf-nome').value.trim(),
        'Telefone: ' + contactForm.querySelector('#cf-tel').value.trim(),
        'Cidade: ' + contactForm.querySelector('#cf-cidade').value.trim(),
        'Necessidade: ' + contactForm.querySelector('#cf-necessidade').value.trim()
      ].join('\n');
      window.open('https://wa.me/5537999948194?text=' + encodeURIComponent(message), '_blank', 'noopener');
    });
  }

  var PRODUCT_INFO = {
    comercial: {
      title: 'Comercial',
      desc: 'Balanças de balcão e checkout para mercados, açougues, padarias, hortifrútis e lojas, com opções que pesam, etiquetam e imprimem. Indicamos o modelo certo para a sua rotina, instalamos, damos manutenção preventiva e revisamos a calibração periodicamente.'
    },
    industrial: {
      title: 'Industrial',
      desc: 'Balança de plataforma com comando Urano UR 10.000 Light: 150kg de capacidade, divisão de 50g, bandeja e estrutura em aço carbono, classe III INMETRO conforme a portaria nº 366/2021. Indicada para recebimento de matéria-prima na indústria. Manutenção programada e revisão de calibração feitas por equipe própria.'
    },
    rodoviaria: {
      title: 'Rodoviária',
      desc: 'Balanças rodoviárias de alta capacidade para pesagem de caminhões, com manutenção preventiva e corretiva e revisão periódica de calibração, com relatório no modelo RBC. Avaliamos o volume e o tipo de carga da sua operação para propor a solução mais adequada.'
    },
    pecuaria: {
      title: 'Barra e indicador Lumak para gado',
      desc: 'Produto próprio da Lumak para balança de gado: barras robustas, indicador dedicado e controle total da pesagem pelo app. O sistema é ajustado para a rotina da fazenda e pode ser integrado ao fluxo de manejo. Também desenvolvemos apps, programas e sistemas sob medida para automatizar processos de pesagem em empresas.'
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

  var igSection = document.getElementById('instagram');
  var igGrid = document.getElementById('igGrid');
  var igFallback = document.getElementById('igFallback');
  var igFeedUrl = igSection && igSection.getAttribute('data-feed-url');
  if(igGrid && igFeedUrl && window.fetch){
    fetch(igFeedUrl)
      .then(function(res){ if(!res.ok) throw new Error(res.status); return res.json(); })
      .then(function(data){
        var posts = (Array.isArray(data) ? data : data.posts || []).slice(0, 6);
        if(!posts.length) return;
        posts.forEach(function(post){
          var size = post.sizes && (post.sizes.medium || post.sizes.small);
          var src = (size && size.mediaUrl) || (post.mediaType === 'VIDEO' ? post.thumbnailUrl : post.mediaUrl);
          if(!src) return;
          var caption = (post.prunedCaption || post.caption || '').trim();
          var link = document.createElement('a');
          link.className = 'ig-post';
          link.href = post.permalink || 'https://www.instagram.com/lumakbalancas/';
          link.target = '_blank';
          link.rel = 'noopener';
          link.setAttribute('aria-label', caption ? 'Post no Instagram: ' + caption.slice(0, 80) : 'Ver post no Instagram');
          var img = document.createElement('img');
          img.src = src;
          img.alt = post.altText || caption.slice(0, 120) || 'Postagem da Lumak Balanças no Instagram';
          img.loading = 'lazy';
          link.appendChild(img);
          if(post.mediaType === 'VIDEO' || post.mediaType === 'CAROUSEL_ALBUM'){
            var type = document.createElement('span');
            type.className = 'ig-post-type';
            type.innerHTML = post.mediaType === 'VIDEO'
              ? '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>'
              : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="7" y="7" width="13" height="13" rx="2"/><path d="M4 16V6a2 2 0 012-2h10"/></svg>';
            link.appendChild(type);
          }
          if(caption){
            var overlay = document.createElement('span');
            overlay.className = 'ig-post-overlay';
            var p = document.createElement('p');
            p.textContent = caption;
            overlay.appendChild(p);
            link.appendChild(overlay);
          }
          igGrid.appendChild(link);
        });
        if(igGrid.children.length && igFallback) igFallback.hidden = true;
      })
      .catch(function(){});
  }

  var floatingWhatsApp = document.createElement('a');
  floatingWhatsApp.className = 'floating-whatsapp';
  floatingWhatsApp.href = 'https://wa.me/5537999948194?text=Ol%C3%A1%2C%20gostaria%20de%20falar%20com%20a%20Lumak%20Balan%C3%A7as.';
  floatingWhatsApp.target = '_blank';
  floatingWhatsApp.rel = 'noopener';
  floatingWhatsApp.setAttribute('aria-label', 'Falar com a Lumak no WhatsApp');
  floatingWhatsApp.title = 'Falar no WhatsApp';
  floatingWhatsApp.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M17.6 6.3A8 8 0 006 17.7L4.5 21.5l3.9-1.4A8 8 0 1017.6 6.3z"/><path d="M9 9.5c0 3.5 3 6.5 6.5 6.5.6 0 1-.5.9-1l-.3-1.4a1 1 0 00-1-.8l-1.4.2a5 5 0 01-3-3l.2-1.4a1 1 0 00-.8-1L9.5 8.5c-.5-.1-1 .3-1 .9z"/></svg>';
  document.body.appendChild(floatingWhatsApp);
})();
