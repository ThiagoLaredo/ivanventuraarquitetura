// Import Swiper and modules
import gsap from 'gsap';
import Swiper from 'swiper';
import { Navigation, Pagination, Scrollbar, Mousewheel, HashNavigation, Manipulation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/effect-cards';
import 'swiper/css/mousewheel';

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
    pagination.style.display = 'none'; // Inicia com a paginação escondida.
    if (this.isEstudioPage() || this.isProjetosPage() ) {
      pagination.style.opacity = '1';
      pagination.style.display = 'flex';
      paginationBullets.forEach(bullet => bullet.classList.add('black'));

    } else {
      // pagination.style.opacity = '0'; 
      pagination.style.display = 'none'; // Esconde inicialmente a paginação usando display none
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
      simulateTouch: true,
      touchRatio: 1.5,
      touchAngle: 45,
      threshold: 20,
      allowTouchMove: true,
      followFinger: true,
      mousewheel: true,
      passiveListeners: true,
      observer: true,
      observeParents: true,
      slidesPerView: 1,
      preloadImages: false,
      watchSlidesVisibility: true,
      watchSlidesProgress: true, 
      lazy: {
        loadPrevNext: true,
        loadPrevNextAmount: 5,
        loadOnTransitionStart: true,
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
        slideChangeTransitionStart: this.handleSlideChangeStart.bind(this),
        slideChangeTransitionEnd: this.handleSlideChangeEnd.bind(this),
        slideChange: this.slideChange.bind(this),
        init: this.handleSwiperInit.bind(this),
        imagesReady: this.handleImagesReady.bind(this)
      },
    });

    console.log("Swiper inicializado:", this.swiper);
    document.dispatchEvent(new CustomEvent('SwiperReady')); // Event indicating Swiper is ready
}

  handleSwiperInit() {
    console.log("Swiper instance initialization complete.");

    if (this.isEstudioPage()) {
      const paginationBullets = document.querySelectorAll('.swiper-pagination-bullet');
      paginationBullets.forEach(bullet => bullet.classList.add('black'));
    }
    if (!this.isNotIndexPage()) { // Assuming this method checks if it's not the index page
      this.applyDisplayNoneToFirstBullet();
    }
    this.animateSubtitles();
    this.animateButtons();
  }


  handleSlideChangeStart() {
    let currentSlide = this.swiper.slides[this.swiper.activeIndex];
    this.clearSlideAnimations(currentSlide); // Limpeza opcional de animações anteriores
    this.animateSlideElements(currentSlide); // Inicia a animação dos elementos
    this.clearImageAnimations(currentSlide); // Limpeza opcional de animações anteriores
    this.animateSlideImage(currentSlide); 

  }

  handleSlideChangeEnd() {

    let currentSlideIndex = this.swiper.realIndex;
    if (currentSlideIndex === this.swiper.slides.length - 1 && window.location.hash === '#ficha-tecnica') {
      this.updateUIForLastSlide();
    }
  }

  selectSubtitles() {
    // Selecionar elementos
    const subtitle1 = document.querySelector('.subtitle__part1');
    const subtitle2 = document.querySelector('.subtitle__part2');
    const subtitle3 = document.querySelector('.subtitle__part3');
  
    return [subtitle1, subtitle2, subtitle3].filter(sub => sub !== null);
  }
  
  selectButtons() {
    const botaoLogo = document.querySelector('.nav__button__home');
    const botaoProjetos = document.querySelector('.menu__projetos');
    const botaoMobile = document.querySelector('.nav__button__mobile');
    const botaoEstudio = document.querySelector('.nav__button__estudio');
    const botaoContato = document.querySelector('.nav__button__contato');
    const botaoDown = document.getElementById('botao-down');
    const botaoVoltar = document.getElementById('botao-voltar');
  
    return [botaoLogo, botaoProjetos, botaoMobile, botaoEstudio, botaoContato, botaoDown, botaoVoltar].filter(btn => btn !== null);
  }
  
  animateSubtitles() {
    const subtitles = this.selectSubtitles();
    gsap.set(subtitles, {opacity: 0, y: 400});
  
    // if (subtitles.length === 0) {
    //     return; // Encerra a função se não houver elementos suficientes
    // }
  
    const tl = gsap.timeline({defaults: {ease: "power2.out"}});
    subtitles.forEach(subtitle => {
        tl.to(subtitle, {opacity: 1, y: "25vh", duration: 0.5}, "+=0.1");
    });
    tl.to(subtitles, {y: 0, duration: 0.3, stagger: 0.1});
  }
  
  animateButtons() {
    const buttons = this.selectButtons();
    gsap.set(buttons, {opacity: 0, y: 0});
  
    if (buttons.length === 0) {
        console.error('Required button elements not found');
        return; // Encerra a função se não houver elementos suficientes
    }
  
    const tl = gsap.timeline({defaults: {ease: "power2.out"}, delay: 2});
    tl.to(buttons, {opacity: 1, y: 0, duration: 0.3, stagger: 0.1}, "+=0.1");
  }

  animateSlideElements(slide) {
    const subtitle1 = slide.querySelector('.subtitle__part2');
    const subtitle2 = slide.querySelector('.subtitle__part3');
    const titleLinkDiv = slide.querySelector('.slide__title__link');

      // Verificação se os elementos existem antes de prosseguir com a animação
      if (!subtitle1 || !subtitle2 || !titleLinkDiv) {
        return; // Interrompe a execução da função se algum elemento for null
    }

    gsap.set([titleLinkDiv, subtitle1, subtitle2], {opacity: 0, y: 20});
    // Exemplo simples de parallax para quando o slide entra em foco
    // Certifique-se de que seu CSS inclua `filter: blur(5px);` inicialmente na `.slide-background-img`

    const tl = gsap.timeline({defaults: {duration: 0.4, ease: "power2.out"}});

    tl.to(subtitle1, {opacity: 1, y: 0}, "+=0.3")  // Certifique-se de adicionar um pequeno delay se necessário
      .to(subtitle2, {opacity: 1, y: 0})
      .to(titleLinkDiv, {opacity: 1, y: 0});
  }

  animateSlideImage(slide) {
    const bgImage = slide.querySelector('.slide-background-img');
    if (!bgImage) {
      return; // Interrompe a execução da função se o elemento for null
    }

    gsap.fromTo(bgImage, {scale: 1}, {scale: 1.05, duration: 1.5, ease: 'power2.inOut'});
  }

  clearSlideAnimations(slide) {
    const elements = slide.querySelectorAll('.slide__title, .slide__title__arrow, .subtitle__part2, .subtitle__part3');
    elements.forEach(el => {
      gsap.set(el, { clearProps: "all" });
    });
  }

  clearImageAnimations(slide) {
    const bgImage = slide.querySelector('.slide-background-img');
    if (!bgImage) {
      return; // Interrompe a execução se o elemento for null
  }
    gsap.set(bgImage, { clearProps: "scale" });
  }

  handleImagesReady() {
    console.log("All images have loaded.");
    this.precarregarImagens(this.swiper);
  }

// carregarImagensDosProximosSlides(swiper, quantidadeSlides = 3) {
//   for (let i = 1; i <= quantidadeSlides; i++) {
//       let proximoSlideIndex = swiper.realIndex + i;
//       if (proximoSlideIndex >= swiper.slides.length) {
//           proximoSlideIndex -= swiper.slides.length; 
//       }

//       const proximoSlide = swiper.slides[proximoSlideIndex];
//       if (!proximoSlide) {
//           console.warn(`Slide de índice ${proximoSlideIndex} não encontrado.`);
//           continue;
//       }

//       const imagensParaCarregar = proximoSlide.querySelectorAll('img[loading="lazy"]:not([src], [srcset])');
//       imagensParaCarregar.forEach(img => {
//           const src = img.dataset.src;
//           const srcset = img.dataset.srcset;
//           if (src) {
//               img.src = src;
//               img.removeAttribute('data-src');
//           }
//           if (srcset) {
//               img.srcset = srcset;
//               img.removeAttribute('data-srcset');
//           }
//       });
//   }
// }

precarregarImagens(swiper) {
  const slidesToPreload = 3;
  for (let i = 1; i <= slidesToPreload; i++) {
    let nextSlideIndex = swiper.realIndex + i;
    if (nextSlideIndex >= swiper.slides.length) {
      nextSlideIndex -= swiper.slides.length; // Considerar looping se seu swiper for circular
    }

    let nextSlideElement = swiper.slides[nextSlideIndex];
    if (nextSlideElement) {
      const images = nextSlideElement.querySelectorAll('img');
      images.forEach(img => {
        if (!img.src) {
          const src = img.dataset.src || img.src; // Usa data-src se existir, senão usa src
          if (src) {
            img.src = src;
          }
        }
        if (!img.srcset && img.dataset.srcset) {
          img.srcset = img.dataset.srcset; // Define srcset se disponível e ainda não definido
        }
      });
    }
  }
}



  updateUIForLastSlide() {
    const menuElements = document.querySelectorAll('.nav__button, .nav__menu__projetos a, .nav__button__projetos p, [data-menu-projetos="button"], [data-menu="button"], #hamburguer, #botao-voltar');
    const paginationBullets = document.querySelectorAll('.swiper-pagination-bullet');
  
    menuElements.forEach(el => el.classList.remove('white-color'));
    paginationBullets.forEach(bullet => bullet.classList.add('black'));
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

  isEstudioPage() {
    return window.location.pathname.includes('/estudio');
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
  
  handleHashChange() {
      const hash = window.location.hash;
      const category = this.mapHashToCategory(hash);

      if (category) {
          this.filterSlides(category);
      }
  }

  mapHashToCategory(hash) {
      switch (hash) {
        case '#viw':
              return 'all';
          case '#quadritone':
              return 'residencias';
          case '#viw':
              return 'edificios';
          case '#teatrosescatalaia':
              return 'institucionais';
          default:
              return null;
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

  navigateToSlide(hash) {
    const targetSlideIndex = this.swiper.slides.findIndex(slide =>
        slide.getAttribute('data-hash') === hash
    );

    // Se um slide válido for encontrado, navega para esse slide
    if (targetSlideIndex !== -1) {
        this.swiper.slideTo(targetSlideIndex, 1000); // 1000 é o tempo da animação em milissegundos
    }
  }

   // Método para definir a instância de CarregaProjetos
  setCarregaProjetosInstance(carregaProjetosInstance) {
    this.carregaProjetosInstance = carregaProjetosInstance;
    // Agora você pode usar this.carregaProjetosInstance dentro de MySwiper
  }

  slideChange() {
    // this.carregarImagensDosProximosSlides(this.swiper, 3);

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

  /**
  * Updates titles and subtitles for the current and previous slides.
  * @param {number} currentSlideIndex - The index of the current slide.
  * @param {number} previousSlideIndex - The index of the previous slide.
  */
  // updateSlideTitlesAndSubtitles(currentSlideIndex, previousSlideIndex) {
  //   // Handling titles and subtitles animation
  //   const allTitlesAndSubtitles = document.querySelectorAll('.page__title, .page__subtitle');
  //   this.clearAnimationClasses(allTitlesAndSubtitles);

  //   // If there are no slides, return early
  //   const activeSlide = this.swiper.slides[currentSlideIndex];
  //   const previousSlide = this.swiper.slides[previousSlideIndex];
  //   if (!activeSlide || !previousSlide) return;

  //   // Adding animation classes to active slide's titles and subtitles
  //   this.addAnimationClassesToSlide(activeSlide, currentSlideIndex > previousSlideIndex);
  //   this.clearAnimationClasses(previousSlide.querySelectorAll('.slide__title, .subtitle__part1, .subtitle__part2, .subtitle__part3'));
  // }

  /**
  * Clears animation classes from the given elements.
  * @param {NodeListOf<Element>} elements - The elements to clear classes from.
  */
  // clearAnimationClasses(elements) {
  //   elements.forEach(el => {
  //       el.classList.remove('anime-up-text-active', 'anime-up-text-down', 'anime-up-active-title', 'anime-down-active-title', 'anime-up-active-sub', 'anime-down-active-sub');
  //   });
  // }

  /**
  * Adds animation classes to titles and subtitles in a slide.
  * @param {Element} slide - The slide to add animation classes to.
  * @param {boolean} isScrollingDown - Indicates if the slide is scrolling down.
  */
  // addAnimationClassesToSlide(slide, isScrollingDown) {
  //   const animationClass = isScrollingDown ? 'anime-up-active' : 'anime-down-active';
  //   slide.querySelectorAll('.slide__title, .subtitle__part1, .subtitle__part2, .subtitle__part3').forEach(el => {
  //       el.classList.add(`${animationClass}-${el.classList.contains('slide__title') ? 'title' : 'sub'}`);
  //   });
  // }
  
  // animateSubtitleParts() {
  //   var subtitleParts = document.querySelectorAll('.subtitle__part1, .subtitle__part2, .subtitle__part3');

  //   anime ({
  //     targets: subtitleParts,
  //     translateY: [100, 0], // Slide in from the bottom
  //     opacity: [0, 1], // Fade-in effect
  //     duration: 1000, // Animation duration in milliseconds
  //     easing: 'easeInOutQuad', // Easing function
  //     delay: anime.stagger(200), // Delay between animations for each element
  //   });
  // }

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
 
















 


 
















