document.addEventListener('DOMContentLoaded', () => {

    // --- ELEMENTOS DEL DOM ---
    const moviesContainer = document.querySelector('.container');
    const movieTemplate = document.getElementById('movie-template');
    const dropdownContainer = document.querySelector('.dropdown-container');
    const categoriesMenu = document.querySelector('.menuCategories');
    const homeLink = document.getElementById('home-link');
    const carouselItems = document.querySelectorAll('.carousel-item');
    
    // --- NUEVO: Selectores para el modal ---
    const modal = document.querySelector('.modalTemplate');
    const reviewsContainerModal = modal.querySelector('.reviewsContainer'); // El contenedor de reseñas dentro del modal

    const rankedLink = document.getElementById('ranked-link');
    const popularLink = document.getElementById('popular-link');

    let allCategories = [];
    const token = localStorage.getItem('user_token');
    const apiUrlBase = 'https://karenflix-api.onrender.com/api/v1';

    // --- Obtenemos el ID del usuario logueado ---
    let currentUserId = null;
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            currentUserId = payload.id;
        } catch (e) {
            console.error('Token inválido:', e);
            localStorage.removeItem('user_token'); // Limpiamos el token si es inválido
        }
    }


    // --- LÓGICA EXISTENTE ---
    if(homeLink) {
        homeLink.addEventListener('click', (e) => {
            e.preventDefault();
            fetchAndDisplayMovies();
        });
    }

    // Evento para el enlace "Mejor Rankeadas"
    if(rankedLink) {
        rankedLink.addEventListener('click', (e) => {
            e.preventDefault();
            fetchAndDisplayRankedMovies(); // Llama a la nueva función de ranking
        });
    }

    // Evento para el enlace "Popular"
    if(popularLink) {
        popularLink.addEventListener('click', (e) => {
            e.preventDefault();
            fetchAndDisplayMovies({ sortBy: 'popular' }); // Llama a la función con la opción de ordenar
        });
    }


    // HEADER PARA QUE APAREZCA O SE ESCONDA SEGUN EL SCROLL
    const header = document.querySelector('.cabecera');
    let lastScrollY = window.scrollY; // Guarda la última posición de scroll

    window.addEventListener('scroll', () => {
        if (lastScrollY < window.scrollY) {
            // Si la nueva posición es mayor que la anterior, estás bajando
            header.classList.add('hidden');
        } else {
            // Si la nueva posición es menor, estás subiendo
            header.classList.remove('hidden');
        }
        
        // Actualiza la última posición de scroll
        lastScrollY = window.scrollY;
    }); 


    // --- FUNCIÓN PARA ELIMINAR UNA RESEÑA PROPIA ---
    async function deleteReview(reviewId, movieId) {
        if (!confirm('¿Estás seguro de que quieres eliminar tu reseña?')) return;

        try {
            const response = await fetch(`${apiUrlBase}/reviews/${reviewId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || 'No se pudo eliminar la reseña.');
            }

            alert('Reseña eliminada con éxito.');
            openMovieDetails(movieId); // Recargamos el modal para que desaparezca la reseña

        } catch (error) {
            console.error('Error al eliminar reseña:', error);
            alert(`Error: ${error.message}`);
        }
    }



     // --- FUNCIÓN PARA MANEJAR LIKES/DISLIKES ---
    async function handleInteraction(reviewId, movieId, type) {
        if (!token) {
            return alert('Debes iniciar sesión para valorar una reseña.');
        }

        const url = `${apiUrlBase}/reviews/${reviewId}/${type}`; // El 'type' puede ser 'like' o 'dislike'

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || `No se pudo registrar la acción de '${type}'.`);
            }
            
            // Si la acción fue exitosa, recargamos el modal para ver los contadores actualizados
            openMovieDetails(movieId);

        } catch (error) {
            console.error(`Error en la interacción '${type}':`, error);
            alert(`Error: ${error.message}`);
        }
    }



    // --- LÓGICA PARA LA BARRA DE BÚSQUEDA ---
    const searchInput = document.querySelector('.barra-busqueda input');
    let debounceTimeout;

    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            // Esta función solo se ejecutará 500ms después de que el usuario deje de teclear
            const searchTerm = searchInput.value.trim();
            
            // Llamamos a la función de búsqueda con el término
            fetchAndDisplayMovies({ search: searchTerm });

        }, 500); // 500 milisegundos de espera
    });

    async function handleReviewSubmit(movieId) {
        // Seleccionamos los inputs dentro del modal
        const reviewCommentInput = modal.querySelector('.review-input');
        const reviewRatingInput = modal.querySelector('.review-inputCalificacion');

        const comment = reviewCommentInput.value.trim();
        const ratingString = reviewRatingInput.value.trim();
        const token = localStorage.getItem('user_token');

        // Verificaciones
        if (!token) {
            return alert('Debes iniciar sesión para dejar una reseña.');
        }
        if (!comment || !ratingString) {
            return alert('Por favor, escribe un comentario y una calificación.');
        }

        const rating = parseFloat(ratingString);
        if (isNaN(rating) || rating < 1 || rating > 5) {
            return alert('Por favor, introduce una calificación válida entre 1 y 5.');
        }

        const reviewData = {
            movieId: movieId,
            title: "Nueva Reseña", // Título por defecto
            comment: comment,
            rating: rating // Usamos la calificación del nuevo input
        };

        try {
            const response = await fetch('https://karenflix-api.onrender.com/api/v1/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(reviewData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || 'No se pudo enviar la reseña.');
            }
            
            alert('¡Reseña enviada con éxito!');
            
            // Recargamos el modal para mostrar la nueva reseña al instante
            openMovieDetails(movieId);

        } catch (error) {
            console.error('Error al enviar la reseña:', error);
            alert(`Error: ${error.message}`);
        }
    }

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

    // --- NUEVA LÓGICA PARA EL MODAL ---

    // Función para cerrar el modal
    function closeModal() {
        if(modal) modal.style.display = 'none';
    }
    
    // Evento de clic en el modal para el cierre inteligente
    if (modal) {
        modal.addEventListener('click', (e) => {
            // Si el clic fue FUERA del contenedor de reseñas (y sus elementos hijos)
            if (!reviewsContainerModal.contains(e.target)) {
                closeModal();
            }
        });
    }

    // Función para abrir y rellenar el modal con los datos de una película
    async function openMovieDetails(movieId) {
        if (!modal) return;
        const apiUrl = `https://karenflix-api.onrender.com/api/v1/movies/${movieId}`;
        
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('Película no encontrada');
            
            const movieData = await response.json();
            const movie = movieData.data;

            // Rellenamos el modal con los datos
            modal.querySelector('#modalTitleMovie').textContent = movie.title;
            modal.querySelector('#modalDescriptionMovie').textContent = movie.description;
            modal.querySelector('#modalYearMovie').textContent = `Year: ${movie.year}`;
            modal.querySelector('#modalURLimage').src = movie.imageUrl;
            
            // Lógica para los géneros (sin cambios)
            const categoryNames = movie.categoryIds.map(id => {
                const category = allCategories.find(cat => cat._id === id);
                return category ? category.name : 'Desconocido';
            });
            modal.querySelector('#modalCategoryMovie').textContent = `Géneros: ${categoryNames.join(', ')}`;

            // Lógica para la calificación (sin cambios)
            if (movie.averageRating) {
                modal.querySelector('#modalRankingMovie').textContent = `Calificación: ${movie.averageRating.toFixed(1)} ⭐`;
            } else {
                modal.querySelector('#modalRankingMovie').textContent = 'Calificación: Aún no calificada';
            }
            
            // 1. Apuntamos al contenedor donde IRÁN las reseñas.
            const reviewsListContainer = modal.querySelector('#reviews-list');
            reviewsListContainer.innerHTML = '';

            if (movie.reviews && movie.reviews.length > 0) {
                movie.reviews.forEach(review => {
                    const reviewElement = document.createElement('div');
                    reviewElement.className = 'review-item';
                    
                    const likeIconClass = review.userInteractionType === 'like' ? 'fa-solid' : 'fa-regular';
                    const dislikeIconClass = review.userInteractionType === 'dislike' ? 'fa-solid' : 'fa-regular';

                    // Empezamos el HTML sin el botón de eliminar
                    let actionsHTML = `
                        <button class="btn-like">
                            <i class="${likeIconClass} fa-thumbs-up"></i> <span>${review.likeCount}</span>
                        </button>
                        <button class="btn-dislike">
                            <i class="${dislikeIconClass} fa-thumbs-down"></i> <span>${review.dislikeCount}</span>
                        </button>
                    `;

                    // --- ¡LA CONDICIÓN DE PROPIEDAD! ---
                    // Si el usuario actual es el dueño de la reseña, añadimos el botón de eliminar.
                    if (currentUserId && currentUserId === review.userId) {
                        actionsHTML += `
                            <button class="btn-delete-review">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        `;
                    }

                    reviewElement.innerHTML = `
                        <p class="review-text">
                            <b>${review.username}:</b> ${review.comment} (${review.rating}⭐)
                        </p>
                        <div class="review-actions">${actionsHTML}</div>
                    `;
                    
                    // Añadimos los listeners para like/dislike (sin cambios)
                    reviewElement.querySelector('.btn-like').addEventListener('click', () => handleInteraction(review._id, movie._id, 'like'));
                    reviewElement.querySelector('.btn-dislike').addEventListener('click', () => handleInteraction(review._id, movie._id, 'dislike'));

                    // --- AÑADIMOS EL LISTENER PARA EL BOTÓN DE ELIMINAR (SI EXISTE) ---
                    const deleteBtn = reviewElement.querySelector('.btn-delete-review');
                    if (deleteBtn) {
                        deleteBtn.addEventListener('click', () => {
                            deleteReview(review._id, movie._id);
                        });
                    }

                reviewsListContainer.appendChild(reviewElement);
            });
            } else {
                const noReviewsElement = document.createElement('p');
                noReviewsElement.className = 'review-text';
                noReviewsElement.textContent = 'Aún no hay reseñas. ¡Sé el primero!';
                reviewsListContainer.appendChild(noReviewsElement);
            }

            // ... (Tu lógica para el botón de enviar reseña sigue igual) ...
            const submitBtn = modal.querySelector('.btn-submit');
            const newSubmitBtn = submitBtn.cloneNode(true);
            submitBtn.parentNode.replaceChild(newSubmitBtn, submitBtn);
            newSubmitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                handleReviewSubmit(movieId);
            });

            modal.style.display = 'flex';
        } catch (error) {
            console.error('Error al obtener detalles de la película:', error);
            alert('No se pudieron cargar los detalles.');
        }
    }

    // --- MODIFICACIÓN: Separamos la lógica de mostrar de la de obtener ---

    // Nueva función solo para mostrar las películas en el grid y añadir el clic
    function displayMovies(movies) {
        moviesContainer.innerHTML = '';
        movies.forEach(movie => {
            const movieClone = movieTemplate.cloneNode(true);
            movieClone.querySelector('img').src = movie.imageUrl;
            movieClone.querySelector('img').alt = movie.title;
            movieClone.querySelector('p').textContent = movie.title;
            movieClone.style.display = 'flex';
            movieClone.removeAttribute('id');

            // AÑADIMOS EL EVENTO DE CLIC A CADA PELÍCULA
            movieClone.addEventListener('click', () => {
                openMovieDetails(movie._id);
            });

            moviesContainer.appendChild(movieClone);
        });
    }
    
    // Tu función de fetch ahora llama a displayMovies
    async function fetchAndDisplayMovies(options = {}) {
        const { categoryName, sortBy, search } = options;
        const baseUrl = 'https://karenflix-api.onrender.com/api/v1/movies';
        
        // Construimos la URL con parámetros de forma segura
        const params = new URLSearchParams();
        if (categoryName) {
            params.append('category', categoryName);
        }
        if (sortBy) {
            params.append('sortBy', sortBy);
        }
        if (search) { 
        params.append('search', search);
    }
        
        const apiUrl = `${baseUrl}?${params.toString()}`;
        
        moviesContainer.innerHTML = '<p>Cargando películas...</p>';

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('Error en la red');
            
            const data = await response.json();
            
            if (data.data.length === 0) {
                moviesContainer.innerHTML = '<p>No se encontraron películas.</p>';
            } else {
                displayMovies(data.data); // Usa la misma función de display
            }
        } catch (error) {
            console.error('Error al obtener las películas:', error);
            moviesContainer.innerHTML = '<p>No se pudieron cargar las películas.</p>';
        }
    }

    async function fetchAndDisplayRankedMovies() {
        const apiUrl = 'https://karenflix-api.onrender.com/api/v1/movies/ranked';
        moviesContainer.innerHTML = '<p>Cargando ranking...</p>';
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('Error en la red');
            
            const data = await response.json();
            
            if (data.data.length === 0) {
                moviesContainer.innerHTML = '<p>No se encontraron películas en el ranking.</p>';
            } else {
                displayMovies(data.data); // Reutilizamos la misma función de display
            }
        } catch (error) {
            console.error('Error al obtener el ranking:', error);
            moviesContainer.innerHTML = '<p>No se pudo cargar el ranking.</p>';
        }
    }

    // --- Función para poblar el menú de categorías ---
    async function populateCategoriesMenu() {
    if (!categoriesMenu) return;
    const apiUrl = 'https://karenflix-api.onrender.com/api/v1/categories';
    try {
        const response = await fetch(apiUrl);
        const responseData = await response.json();
        const categories = responseData.data; 

        
        allCategories = categories; 

        categoriesMenu.innerHTML = '';
        categories.forEach(category => {
            const categoryOption = document.createElement('p');
            categoryOption.textContent = category.name;
            categoryOption.addEventListener('click', () => {
                fetchAndDisplayMovies({ categoryName: category.name });
                categoriesMenu.classList.remove('show');
            });
            categoriesMenu.appendChild(categoryOption);
        });
    } catch (error) {
        console.error('Error al obtener las categorías:', error);
    }
}

    // --- LLAMADAS INICIALES AL CARGAR LA PÁGINA ---
    populateCategoriesMenu();
    fetchAndDisplayMovies();
});