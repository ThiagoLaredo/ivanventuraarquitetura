// Import Swiper and modules
import Swiper from 'swiper';
import { Navigation, Pagination, Scrollbar, Mousewheel, HashNavigation, Manipulation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/effect-cards';
import 'swiper/css/mousewheel';
// import 'swiper/css/hash-navigation';

export default class MySwiper {
  constructor(carregaProjetosInstance = null) {
    this.swiper = null;
    this.allSlides = [];
    this.allMenuItems = [];
    this.filtroAtivo = false; // Adiciona a flag de controle de filtro
  }

  initialize() {
    document.addEventListener('DOMContentLoaded', () => {
      this.initializeSwiper();
      this.setupFilterLinks();
      this.applyFilterFromURL(); // Certifique-se de que está sendo chamado corretamente
    });
  }

  initializeSwiper() {
    const pagination = document.querySelector('.swiper-pagination');
    const paginationBullets = document.querySelectorAll('.swiper-pagination-bullet');
    const menuLateral = document.querySelector('.menu-lateral');
    const menuElements = document.querySelectorAll('.nav__button, .nav__menu__projetos a, .nav__button__projetos p, [data-menu-projetos="button"], [data-menu="button"], #hamburguer, #botao-voltar');

    // Initialize Swiper instance
    this.initializeSwiperInstance();
    if (this.isEstudioPage()) {
      this.initializeSwiper2();
      this.initializeSwiper3();
    }

    // Initialize pagination and menu lateral if they exist, and hide them initially
    if (this.isProjetosPage()) {
      menuElements.forEach(el => el.classList.add('white-color'));
    }

  if (pagination) {
    this.initializePagination(pagination, !!menuLateral);
    if (this.isEstudioPage() || this.isProjetosPage() ) {
      pagination.style.opacity = '1';
      pagination.style.display = 'flex';
      paginationBullets.forEach(bullet => bullet.classList.add('black'));

    } else {
      pagination.style.opacity = '0'; // Hide pagination initially
    }
  }  

    if (menuLateral) {
      this.initializeMenuLateral(menuLateral);
      menuLateral.style.display = 'none'; // Hide menu lateral initially
    }
  
    // Collect slides and menu items
    this.allSlides = Array.from(document.querySelectorAll('.swiper-slide'));
    this.allMenuItems = Array.from(document.querySelectorAll('.project-menu-item'));
  
    // Setup filter links
    this.setupFilterLinks();
    if (!this.isNotIndexPage()) {
      this.applyFilterFromURL();
    }
  }

  initializeSwiperInstance() {
    console.log("Inicializando Swiper...");

    this.swiper = new Swiper(".mySwiper", {
      modules: [Navigation, Pagination, Scrollbar, Mousewheel, HashNavigation, Manipulation],
      direction: "vertical",
      speed: 1000,
      touchRatio: 1,
      allowTouchMove: true,
      mousewheel: true,
      passiveListeners: true,
      observer: true,
      observeParents: true,
      slidesPerView: 1,
      preloadImages: false, // Desabilita o carregamento automático de todas as imagens
      watchSlidesVisibility: true, // Assegura que o lazy loading considere a visibilidade dos slides
      lazy: {
        loadPrevNext: true, // Ativa o pré-carregamento das imagens dos slides adjacentes
        loadPrevNextAmount: 3, // Altere este valor conforme necessário para pré-carregar mais slides
        loadOnTransitionStart: true, // Garante que o carregamento comece assim que a transição iniciar
      },
      scrollbar: {
        el: '.swiper-scrollbar',
        draggable: true,
      },
      effect: 'slide',
      preventClicksPropagation: false,
      hashNavigation: {
        watchState: true,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      on: {
        // animateSubtitleParts: function () {
        // },       

        slideChangeTransitionStart: function() {
          carregarImagemDoProximoSlide(this);
        },

        slideChange: this.slideChange.bind(this),
        slideChangeTransitionStart: this.slideChangeTransitionStart.bind(this), 

        slideChangeTransitionStart: function () {
          // this.allowTouchMove = false; 
        },
  
        slideChangeTransitionEnd: function () {
          // this.allowTouchMove = true; 
          let currentSlideIndex = this.realIndex;
          if (currentSlideIndex === this.slides.length - 1 && window.location.hash === '#ficha-tecnica') {
            const menuElements = document.querySelectorAll('.nav__button, .nav__menu__projetos a, .nav__button__projetos p, [data-menu-projetos="button"], [data-menu="button"], #hamburguer, #botao-voltar');
            const paginationBullets = document.querySelectorAll('.swiper-pagination-bullet');
        
            // Correção aplicada aqui: garantindo que 'el' é definido como o elemento atual do loop
            menuElements.forEach((el) => {
                el.classList.remove('white-color');
            });
        
            paginationBullets.forEach((bullet) => {
                bullet.classList.add('black');
            });
          }
        },

        init: () => {
          // This code runs after the Swiper instance is initialized
          if (this.isEstudioPage()) {
              const paginationBullets = document.querySelectorAll('.swiper-pagination-bullet');
              paginationBullets.forEach(bullet => bullet.classList.add('black'));
          }
        // Este código é executado após a instância do Swiper ser inicializada
          if (!this.isNotIndexPage()) { // Se for a página index
            this.applyDisplayNoneToFirstBullet();
          }
        },
      },
    });
    
    this.allSlides = Array.from(document.querySelectorAll('.swiper-slide'));
    this.allMenuItems = Array.from(document.querySelectorAll('.project-menu-item'));

    this.setupFilterLinks();
 
    console.log("Swiper inicializado:", this.swiper);
    document.dispatchEvent(new CustomEvent('SwiperReady')); // Dispara um evento indicando que o Swiper está pronto
  }

  initializeSwiper2() {
    // Lógica para inicializar swiper2 aqui
    this.swiper2 = new Swiper(".mySwiper2", {
      modules: [Navigation, Pagination, Scrollbar, Mousewheel, HashNavigation],
      mousewheel: true,
      spaceBetween: 10,
      grabCursor: true,
      slidesPerView: 1,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        800: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
      },
    });
  }

  initializeSwiper3() {
    // Lógica para inicializar swiper3 aqui
    this.swiper3 = new Swiper(".mySwiper3", {
      modules: [Navigation, Pagination, Scrollbar, Mousewheel, HashNavigation],
      mousewheel: false,
      slidesPerView: 1,
      grabCursor: true,
      pagination: {
        el: '.swiper-pagination-2',
        bulletClass: 'custom-pagination-bullet-2',
        clickable: true,
      },
    });
  }

  carregarImagemDoProximoSlide(swiper) {
    // Obter o índice do próximo slide
    let proximoSlideIndex = swiper.realIndex + 1;
    
    // Ajustar caso seja o último slide e você queira voltar ao início
    if (proximoSlideIndex >= swiper.slides.length) {
        proximoSlideIndex = 0;
    }

    // Obter o próximo slide usando o índice
    const proximoSlide = swiper.slides[proximoSlideIndex];
    
    // Encontrar todas as imagens dentro do próximo slide com data-src
    const imagensLazy = proximoSlide.querySelectorAll('img[data-src]');
    
    // Alterar data-src para src para cada imagem
    imagensLazy.forEach(img => {
        const src = img.getAttribute('data-src');
        if (src) {
            img.setAttribute('src', src);
            img.removeAttribute('data-src'); // Opcional: remover o atributo data-src após o carregamento
        }
    });
  }

  isEstudioPage() {
    return window.location.pathname.endsWith('estudio');
  }

  isProjetosPage() {
    return window.location.pathname.includes('/projeto.html');
  }
  
  isFichaTecnicaSlide() {
    return window.location.hash.includes('#ficha-tecnica');
  }

  isNotIndexPage() {
    const path = window.location.pathname;
    // Adicione aqui a lógica para verificar corretamente se está na página index
    return !(path === '/' || path.endsWith('index.html') || path === '/index/');
  }

  applyDisplayNoneToFirstBullet() {
    const firstPaginationBullet = document.querySelector('.swiper-pagination .swiper-pagination-bullet');
    if (firstPaginationBullet) {
      firstPaginationBullet.style.display = 'none';
    }
  }

  initializePagination(pagination, hasMenuLateral) {
    if (hasMenuLateral) {
      // Logic for pages with menu lateral (like index.html)
      pagination.addEventListener('mouseenter', () => {
        this.hidePagination();
        this.showProjectMenu();
      });
      pagination.addEventListener('mouseleave', () => {
        this.hideProjectMenu();
        this.showPagination();
      });
    } else {
      this.showPagination();
    }
  }

  initializeMenuLateral(menuLateral) {
    // Setup for menu lateral
    menuLateral.addEventListener('mouseenter', () => {
      this.hidePagination();
      this.showProjectMenu();
    });

    menuLateral.addEventListener('mouseleave', () => {
      this.hideProjectMenu();
      this.showPagination();
    });
  }

  hasMenuLateral() {
    return !!document.querySelector('.menu-lateral');
  }

  update() {
    if (this.swiper) {
        this.swiper.update();
    }
  }
 
  updatePaginationAndMenuVisibility(currentSlideIndex) {
    const pagination = document.querySelector('.swiper-pagination');
    const menuLateral = document.querySelector('.menu-lateral');
  
    if (!pagination || !menuLateral) return;
  
    const deveExibir = currentSlideIndex > 0 || this.filtroAtivo;
    pagination.style.display = menuLateral.style.display = deveExibir ? 'flex' : 'none';
    pagination.style.opacity = deveExibir ? '1' : '0';
    if (this.filtroAtivo) {
      const menuElements = document.querySelectorAll('.nav__button, .nav__menu__projetos a, .nav__button__projetos p, [data-menu-projetos="button"], [data-menu="button"], #hamburguer');
      menuElements.forEach(el => el.classList.add('white-color'));
    }
  }

  setFiltroAtivo(ativo) {
    this.filtroAtivo = ativo;
    this.updatePaginationAndMenuVisibility(this.swiper ? this.swiper.realIndex : 0);
    this.slideChange(); // Chame slideChange ou uma função dedicada para atualizar a visibilidade da seta aqui
    let indiceSlideAtivo = ativo ? 0 : this.swiper.realIndex;

    // Atualiza o menu de projetos para refletir o slide ativo.
    this.updateProjectMenu(indiceSlideAtivo);
  }

  applyFilter(filterCategory) {
    console.log(`Aplicando filtro: ${filterCategory}`);

    // Verifica se está na página index e a instância de CarregaProjetos está disponível
    if (document.body.id === "index-page" && this.carregaProjetosInstance && typeof this.carregaProjetosInstance.filtrarEExibirProjetos === 'function') {
      // Aplica o filtro
      this.carregaProjetosInstance.filtrarEExibirProjetos(filterCategory);
      this.setFiltroAtivo(true);

      // Atualiza a URL sem recarregar a página
      const novaUrl = `${window.location.pathname}?filter=${filterCategory}`;
      window.history.pushState({ path: novaUrl }, '', novaUrl);
    } else if (this.isNotIndexPage()) {
      // Se não estiver na página index, redireciona para a index com o parâmetro de filtragem
      window.location.href = `/index.html?filter=${filterCategory}`;
      
    } else {
      console.log('A instância de CarregaProjetos ou o método filtrarEExibirProjetos não está disponível.');
    }
  }

  setupFilterLinks() {
    const filterLinks = document.querySelectorAll('.nav__menu__projetos a[data-filter]');
    filterLinks.forEach(link => {
      link.addEventListener('click', (event) => {
        event.preventDefault(); // Prevenir a ação padrão

        // Pega a categoria do atributo data-filter do link clicado
        const category = link.getAttribute('data-filter');
        this.applyFilter(category); // Isso deveria chamar o console.log
        this.navigateToFirstSlideOfCategory(category); // Navega para o primeiro slide da categoria
        this.markActiveLink(category); // Marca o link como ativo ao clicar

        if (this.isNotIndexPage()) {
          // Se não estiver na página index, redireciona para a index com o parâmetro de filtragem
          window.location.href = `/index.html?filter=${category}`;
        } else {
          // Está na página index, aplica a filtragem como antes
          this.filterSlides(category);
        }
      });
    });
  }
  
  applyFilterFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const filterCategory = urlParams.get('filter');
    if (filterCategory) {
        this.filterSlides(filterCategory);
        this.navigateToFirstSlideOfCategory(filterCategory); // Opcional, dependendo se você quer que a navegação pule para o primeiro slide filtrado
        this.setFiltroAtivo(true);

        // Adiciona lógica para marcar o link ativo
      this.markActiveLink(filterCategory);
    }
  }

  markActiveLink(filterCategory) {
    // Remove a classe active-link de todos os links
    const links = document.querySelectorAll('.nav__menu__projetos a[data-filter]');
    links.forEach(link => link.classList.remove('active-link'));
  
    // Encontra o link correspondente e adiciona a classe active-link
    const activeLink = Array.from(links).find(link => link.getAttribute('data-filter') === filterCategory);
    if (activeLink) {
        activeLink.classList.add('active-link');
    }
  }
 
  filterSlides(category) {
    let filteredSlides;

    // Filtra os slides baseado na categoria, excluindo o slide de apresentação (#slide1)
    if (category === 'all') {
        // Se a categoria for 'all', adiciona todos os slides exceto o slide de apresentação
        filteredSlides = this.allSlides.filter(slide => slide.getAttribute('data-hash') !== 'slide1');
    } else {
        // Filtra slides que correspondem à categoria, excluindo o slide de apresentação
        filteredSlides = this.allSlides.filter(slide => 
            slide.getAttribute('data-filter') === category && slide.getAttribute('data-hash') !== 'slide1'
        );
    }

    this.swiper.removeAllSlides();
    this.swiper.appendSlide(filteredSlides);
    this.swiper.update();
    this.updateProjectMenu(0);

    // Navega automaticamente para o primeiro slide do filtro, que agora é o primeiro slide nos slides filtrados
    if (filteredSlides.length > 0) {
        this.swiper.slideTo(0, 0); // Navega sem delay
    }
  }

  navigateToFirstSlideOfCategory(category) {
    if (category === 'all') {
        // Se 'all', navega para o segundo slide, assumindo que o primeiro é sempre o slide1
        this.swiper.slideTo(1);
        return;
    }
    // Encontra o índice do primeiro slide que corresponde à categoria após o slide1.
    const startIndex = 1; // Ignora o slide1 presumindo que ele sempre é o primeiro slide.
    for (let i = startIndex; i < this.swiper.slides.length; i++) {
        const slide = this.swiper.slides[i];
        if (slide.getAttribute('data-filter') === category) {
            this.swiper.slideTo(i); // Move para o primeiro slide da categoria.
            break; // Interrompe o loop após encontrar o primeiro slide correspondente.
        }
    }
  }

   // Método para definir a instância de CarregaProjetos
  setCarregaProjetosInstance(carregaProjetosInstance) {
    this.carregaProjetosInstance = carregaProjetosInstance;
    // Agora você pode usar this.carregaProjetosInstance dentro de MySwiper
  }

  slideChange() {
    // First, check if swiper is defined and initialized
    if (!this.swiper || !this.swiper.slides) return;
  
    // Get the current and previous slide indexes
    let currentSlideIndex = this.swiper.realIndex;
    let previousSlideIndex = this.swiper.previousIndex;

    const navButtonArrow = document.getElementById('botao-down');
    if (navButtonArrow) {
      if (currentSlideIndex === 0 && !this.filtroAtivo) {
        // Mostra a seta apenas no primeiro slide e se o filtro não estiver aplicado
        navButtonArrow.style.display = '';
      } else {
        // Esconde a seta nos outros slides ou quando o filtro está aplicado
        navButtonArrow.style.display = 'none';
      }
    }
    
    // Update UI elements based on the current slide index
    this.updatePaginationAndMenu(currentSlideIndex);
    // this.updateSlideTitlesAndSubtitles(currentSlideIndex, previousSlideIndex);
    this.updateProjectMenu(currentSlideIndex);
    this.updatePaginationAndMenuVisibility(this.swiper.realIndex);
  }

  /**
  * Updates pagination and menu based on the current slide index.
  * @param {number} currentSlideIndex - The index of the current slide.
  */
  updatePaginationAndMenu(currentSlideIndex) {
    const pagination = document.querySelector('.swiper-pagination');
    const menuLateral = document.querySelector('.menu-lateral');
    const menuElements = document.querySelectorAll('.nav__button, .nav__menu__projetos a, .nav__button__projetos p, [data-menu-projetos="button"], [data-menu="button"], #hamburguer, #botao-voltar');
    const paginationBullets = document.querySelectorAll('.swiper-pagination-bullet');
  
    if (pagination) {
      if (this.isEstudioPage() || this.isProjetosPage()) {
        pagination.style.opacity = '1';
        pagination.style.display = 'flex';
      } else {
        pagination.style.opacity = currentSlideIndex >= 1 ? '1' : '0';
        const displayStyle = currentSlideIndex >= 1 ? 'flex' : 'none';
        pagination.style.display = displayStyle;
      }
    }
  
    if (menuLateral) {
      const displayStyle = currentSlideIndex >= 1 ? 'flex' : 'none';
      menuLateral.style.display = displayStyle;
    }
 
    if (pagination && menuLateral) {
      const deveExibir = currentSlideIndex > 0 || this.filtroAtivo;
      pagination.style.display = deveExibir ? 'flex' : 'none';
      menuLateral.style.display = deveExibir ? 'flex' : 'none';
      // Ajusta a opacidade da paginação para 1 quando deve ser exibida, e para 0 quando não
      pagination.style.opacity = deveExibir ? '1' : '0';
      if (this.filtroAtivo) {
        menuElements.forEach(el => el.classList.add('white-color'));
    } else {
        menuElements.forEach(el => el.classList.remove('white-color'));
    }
  }

  // Supondo que menuElements já esteja definido e acessível aqui
  if (this.isEstudioPage()) {
    menuElements.forEach(el => {
      const classNameAction = 'remove';
      el.classList[classNameAction]('white-color');
    });
  } else {
    menuElements.forEach(el => {
      const classNameAction = currentSlideIndex >= 1 ? 'add' : 'remove';
      el.classList[classNameAction]('white-color');
    });
  }

    // Specific logic for pages with "projetos" in the URL
  if (this.isProjetosPage()) {
    // Remove 'white-color' class only on the second slide
    menuElements.forEach(el => {
      if (currentSlideIndex === 0) {
        el.classList.add('white-color');
      }
      if (currentSlideIndex === 1) {
        el.classList.remove('white-color');
      }
    });

    paginationBullets.forEach(bullet => bullet.classList.remove('black'));

    // Adiciona a classe 'black' apenas no slide 2 (índice 1)
    if (currentSlideIndex === 1) { // Lembre-se que os índices começam em 0
      paginationBullets.forEach(bullet => bullet.classList.add('black'));
    }  
  }
    // Update pagination opacity if pagination exists
    if (pagination && this.swiper.pagination.el) {

      if (this.isEstudioPage() || this.isProjetosPage()) {
        this.swiper.pagination.el.style.opacity = '1';

      } else {
        this.swiper.pagination.el.style.opacity = currentSlideIndex >= 1 ? '1' : '0';
      }
    }
  }

  /**
  * Updates the project menu based on the current slide index.
  * @param {number} currentSlideIndex - The index of the current slide.
  */
  updateProjectMenu(currentSlideIndex) {
    // Update project menu items
    document.querySelectorAll('.project-menu-item').forEach(el => el.classList.remove('active'));

    let currentSlide = this.swiper.slides[currentSlideIndex];
    if (currentSlide) {
        let currentSlideHash = currentSlide.getAttribute('data-hash');
        let correspondingMenuItem = document.querySelector(`.project-menu-item[href="#${currentSlideHash}"]`);
        if (correspondingMenuItem) correspondingMenuItem.classList.add('active');
    }
  }


  hideProjectMenu() {
    // Verifica se a largura da tela é maior que 800px
    if (window.innerWidth > 800) {
      const projectMenu = document.querySelector('.project-menu-hover');
      const pagination = document.querySelector('.pagination');
  
      if (projectMenu) {
        projectMenu.classList.remove('show-element');
        pagination.style.display = 'flex';
      }
    }
  }
  
  showProjectMenu() {
    // Verifica se a largura da tela é maior que 800px
    if (window.innerWidth > 800) {
      const projectMenu = document.querySelector('.project-menu-hover');
      const pagination = document.querySelector('.pagination');
  
      if (projectMenu) {
        projectMenu.classList.add('show-element');
        pagination.style.display = 'none';
      }
    }
  }
  
  hidePagination() {
    // Verifica se a largura da tela é maior que 800px
    if (window.innerWidth > 800) {
      const pagination = document.querySelector('.pagination');
      if (pagination) {
        pagination.classList.remove('show-element');
      }
    }
  }
  
  showPagination() {
    // Verifica se a largura da tela é maior que 800px
    if (window.innerWidth > 800) {
      const pagination = document.querySelector('.pagination');
      if (pagination) {
        pagination.classList.add('show-element');
      }
    }
  }
  
  slideChangeTransitionStart() {   
  }

  getSwiperInstance() {
    console.log(this.swiper);
    return this.swiper;
  }
}
 
















