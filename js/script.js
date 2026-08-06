/* ==========================================================================
   RIESGO CERO - LOGICA INTERACTIVA DE LA INTERFAZ
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. GESTIÓN DEL TEMA (CLARO / OSCURO)
    const themeToggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'dark';

    // Aplicar tema inicial
    if (currentTheme === 'light') {
        document.body.setAttribute('data-theme', 'light');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            let theme = 'dark';
            if (!document.body.hasAttribute('data-theme')) {
                document.body.setAttribute('data-theme', 'light');
                theme = 'light';
            } else {
                document.body.removeAttribute('data-theme');
            }
            localStorage.setItem('theme', theme);
        });
    }

    // 2. MENÚ MÓVIL RESPONSIVO (HAMBURGUESA)
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            
            // Cambiar icono de hamburguesa a equis
            const isOpen = navMenu.classList.contains('active');
            menuToggle.innerHTML = isOpen 
                ? `<svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`
                : `<svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
        });

        // Cerrar menú al hacer clic fuera o en un enlace
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }

    function closeMobileMenu() {
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if (menuToggle) {
                menuToggle.innerHTML = `<svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
            }
        }
    }

    // 3. RESALTAR ENLACE ACTIVO EN EL NAVBAR Y SCROLL-SPY
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.risk-section');
    const isRisksPage = window.location.pathname.endsWith('riesgos.html') || sections.length > 0;

    // Resaltar según URL de página (para index.html)
    if (!isRisksPage) {
        const currentPath = window.location.pathname;
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            if (currentPath.endsWith(linkHref) || (currentPath === '/' && linkHref.startsWith('index.html'))) {
                link.classList.add('active');
            }
        });
    } else {
        // En riesgos.html, gestionar Scroll-Spy
        function scrollSpy() {
            let currentActiveSectionId = '';
            const scrollPosition = window.scrollY + 120; // Compensación del tamaño del header

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                if (scrollPosition >= sectionTop && scrollPosition < (sectionTop + sectionHeight)) {
                    currentActiveSectionId = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                const linkHref = link.getAttribute('href');
                if (linkHref === `#${currentActiveSectionId}` || linkHref.endsWith(`#${currentActiveSectionId}`)) {
                    link.classList.add('active');
                }
            });
        }

        // Ejecutar al cargar y al hacer scroll
        window.addEventListener('scroll', scrollSpy);
        scrollSpy();
    }

    // Cerrar menú móvil al hacer clic en un enlace de navegación
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });


    // 4. MODAL DE VISUALIZACIÓN DE IMÁGENES (ZOOM)
    const interactiveImages = document.querySelectorAll('.interactive-image-container');
    const imageModal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const modalCaption = document.getElementById('modal-caption');
    const modalCloseBtn = document.getElementById('modal-close');

    if (interactiveImages.length > 0 && imageModal && modalImg && modalCloseBtn) {
        interactiveImages.forEach(container => {
            container.addEventListener('click', () => {
                const img = container.querySelector('img');
                const title = container.querySelector('.image-overlay-title');
                const desc = container.querySelector('.image-overlay-desc');
                
                if (img) {
                    modalImg.src = img.src;
                    modalImg.alt = img.alt || 'Imagen de riesgo SST';
                    
                    let captionText = img.alt || '';
                    if (title) {
                        captionText = `<strong>${title.textContent}</strong>`;
                        if (desc) {
                            captionText += `<br><span style="font-size: 0.9rem; color: #a1a1aa;">${desc.textContent}</span>`;
                        }
                    }
                    modalCaption.innerHTML = captionText;
                    
                    imageModal.classList.add('show');
                    document.body.style.overflow = 'hidden'; // Bloquear scroll de la página
                }
            });
        });

        // Cerrar modal al hacer clic en el botón de cerrar
        modalCloseBtn.addEventListener('click', closeModal);

        // Cerrar modal al hacer clic fuera de la imagen
        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal || e.target.classList.contains('modal-content-wrapper')) {
                closeModal();
            }
        });

        // Cerrar modal con la tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && imageModal.classList.contains('show')) {
                closeModal();
            }
        });

        function closeModal() {
            imageModal.classList.remove('show');
            document.body.style.overflow = ''; // Restaurar scroll
            setTimeout(() => {
                modalImg.src = '';
                modalCaption.innerHTML = '';
            }, 300);
        }
    }

    // 5. GESTIÓN DE PESTAÑAS (TABS) PARA SEÑALIZACIÓN (COLORES Y FORMAS)
    function setupTabs(tabSelector, contentSelector) {
        const tabs = document.querySelectorAll(tabSelector);
        const contents = document.querySelectorAll(contentSelector);

        if (tabs.length > 0 && contents.length > 0) {
            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    const target = tab.getAttribute('data-tab');

                    // Remover clase active de todas las pestañas de este grupo
                    tabs.forEach(t => t.classList.remove('active'));
                    // Agregar clase active a la pestaña seleccionada
                    tab.classList.add('active');

                    // Mostrar el contenido correspondiente y ocultar el resto
                    contents.forEach(content => {
                        if (content.id === target) {
                            content.classList.add('active');
                        } else {
                            content.classList.remove('active');
                        }
                    });
                });
            });
        }
    }

    setupTabs('.color-red, .color-blue, .color-yellow, .color-green, .color-tab-btn, .color-tab', '.color-tab-content');
    setupTabs('.shape-tab, .shape-tab-btn', '.shape-tab-content');
    setupTabs('.tab-btn[data-tab^="color-"]', '.color-tab-content');
    setupTabs('.tab-btn[data-tab^="forma-"]', '.shape-tab-content');
});

