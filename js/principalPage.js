document.addEventListener('DOMContentLoaded', () => {

    const homeLink = document.getElementById('home-link');
    if(homeLink) {
        homeLink.addEventListener('click', (e) => {
            e.preventDefault(); // Previene que la página recargue
            fetchAndDisplayMovies(); // Llama a la función sin filtros
        });
    }

    // --- Lógica del Carrusel (sin cambios) ---
    const carouselItems = document.querySelectorAll('.carousel-item');
    let currentSlide = 0;
    function showSlide(index) {
        carouselItems.forEach(item => item.classList.remove('active'));
        if (index >= carouselItems.length) currentSlide = 0;
        else if (index < 0) currentSlide = carouselItems.length - 1;
        else currentSlide = index;
        carouselItems[currentSlide].classList.add('active');
    }
    function nextSlide() { showSlide(currentSlide + 1); }
    showSlide(currentSlide);
    setInterval(nextSlide, 5000);


    // --- ELEMENTOS DEL DOM ---
    const moviesContainer = document.querySelector('.container');
    const movieTemplate = document.getElementById('movie-template');
    const dropdownContainer = document.querySelector('.dropdown-container');
    const categoriesMenu = document.querySelector('.menuCategories');


    // --- FUNCIÓN PRINCIPAL PARA MOSTRAR PELÍCULAS (AHORA CON FILTRO) ---
    async function fetchAndDisplayMovies(categoryName = null) {
        let apiUrl = 'https://karenflix-api.onrender.com/api/v1/movies';

        // Si se proporciona un nombre de categoría, se añade como parámetro a la URL
        if (categoryName) {
            apiUrl += `?category=${encodeURIComponent(categoryName)}`;
        }

        moviesContainer.innerHTML = '<p style="color: white; font-size: 1.5vw;">Cargando películas...</p>';

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`Error en la red: ${response.statusText}`);
            
            const data = await response.json();
            const movies = data.data;

            moviesContainer.innerHTML = ''; // Limpiamos el contenedor

            if (movies.length === 0) {
                moviesContainer.innerHTML = '<p style="color: white; font-size: 1.5vw;">No se encontraron películas para esta categoría.</p>';
                return;
            }

            movies.forEach(movie => {
                const movieClone = movieTemplate.cloneNode(true);
                movieClone.querySelector('img').src = movie.imageUrl;
                movieClone.querySelector('img').alt = movie.title;
                movieClone.querySelector('p').textContent = movie.title;
                movieClone.style.display = 'flex';
                movieClone.removeAttribute('id');
                moviesContainer.appendChild(movieClone);
            });

        } catch (error) {
            console.error('Error al obtener las películas:', error);
            moviesContainer.innerHTML = '<p style="color: #ff4d4d;">No se pudieron cargar las películas.</p>';
        }
    }

    // --- NUEVA FUNCIÓN PARA POBLAR EL MENÚ DE CATEGORÍAS ---
    async function populateCategoriesMenu() {
        if (!categoriesMenu) return;
        const apiUrl = 'https://karenflix-api.onrender.com/api/v1/categories';
        try {
            const response = await fetch(apiUrl);
            const responseData = await response.json(); // Primero obtenemos el objeto completo
            const categories = responseData.data;

            categoriesMenu.innerHTML = ''; // Limpiamos las categorías de prueba

            // Creamos la opción "Ver Todas"
            // const allOption = document.createElement('p');
            //     allOption.textContent = 'Ver Todas';
            //     allOption.addEventListener('click', () => {
            //         fetchAndDisplayMovies();
            //         categoriesMenu.classList.remove('show');

            //     });
                // categoriesMenu.appendChild(allOption);
                
                categories.forEach(category => {
                    const categoryOption = document.createElement('p');
                    categoryOption.textContent = category.name;
                    
                    categoryOption.addEventListener('click', () => {
                        fetchAndDisplayMovies(category.name);
                        categoriesMenu.classList.remove('show');
                    });
                    categoriesMenu.appendChild(categoryOption);
                });

            } catch (error) {
                console.error('Error al obtener las categorías:', error);
            }
    }

    // --- LÓGICA PARA MOSTRAR/OCULTAR EL MENÚ (sin cambios) ---
    if (dropdownContainer) {
        const categoriasLink = dropdownContainer.querySelector('.enlace');
        categoriasLink.addEventListener('click', (e) => {
            e.preventDefault();
            categoriesMenu.classList.toggle('show');
        });
        document.addEventListener('click', (e) => {
            if (!dropdownContainer.contains(e.target)) {
                categoriesMenu.classList.remove('show');
            }
        });
    }

    // --- LLAMADAS INICIALES AL CARGAR LA PÁGINA ---
    populateCategoriesMenu();
    fetchAndDisplayMovies(); // Carga todas las películas por defecto
});