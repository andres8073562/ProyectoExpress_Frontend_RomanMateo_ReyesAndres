document.addEventListener('DOMContentLoaded', () => {
    // --- Autenticación y Variables Globales ---
    const token = localStorage.getItem('user_token');
    const apiUrlBase = 'https://karenflix-api.onrender.com/api/v1';
    const authHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    // --- Selectores del DOM ---
    const moviesContainer = document.getElementById('movies-list');
    const movieTemplate = document.getElementById('movie-template');
    const categoriesContainer = document.getElementById('categories-list');
    const categoryTemplate = document.getElementById('category-template');
    
    // --- Selectores del Modal de Películas
    const movieModal = document.getElementById('movie-form-modal');
    const movieForm = document.getElementById('movie-form');
    const modalTitle = document.getElementById('modal-form-title');
    const movieIdInput = document.getElementById('movie-id');
    const categoryCheckboxesContainer = document.getElementById('movie-categories-checkboxes');
    const addMovieBtn = document.querySelector('#peliculas-section .btn-add');

    // --- Selectores del Modal de Categorías ---
    const categoryModal = document.getElementById('category-form-modal');
    const categoryForm = document.getElementById('category-form');
    const categoryIdInput = document.getElementById('category-id');
    const categoryModalTitle = document.getElementById('category-modal-title');
    const addCategoryBtn = document.querySelector('#categorias-section .btn-add');






    // --- LÓGICA DEL MODAL DE PELÍCULAS ---

    // Función para abrir el modal (puede recibir una película para modo 'Actualizar')
    function openMovieModal(movie = null) {
        movieForm.reset(); // Limpiamos el formulario

        if (movie) { // MODO ACTUALIZAR
            modalTitle.textContent = 'Actualizar Película';
            movieIdInput.value = movie._id; // Guardamos el ID en el input oculto
            
            // Llenamos los campos con los datos de la película
            document.getElementById('movie-title').value = movie.title;
            document.getElementById('movie-description').value = movie.description;
            document.getElementById('movie-year').value = movie.year;
            document.getElementById('movie-imageUrl').value = movie.imageUrl;

            // Marcamos los checkboxes de las categorías que ya tiene la película
            movie.categoryIds.forEach(categoryId => {
                const checkbox = categoryCheckboxesContainer.querySelector(`input[value="${categoryId}"]`);
                if (checkbox) checkbox.checked = true;
            });

        } else { // MODO CREAR
            modalTitle.textContent = 'Agregar Película';
            movieIdInput.value = ''; // Nos aseguramos de que el ID esté vacío
        }

        movieModal.classList.add('show');
    }

    function closeMovieModal() {
        movieModal.classList.remove('show');
    }

     addMovieBtn.addEventListener('click', () => {
        openMovieModal(); // Llamamos sin película para abrir en modo 'Crear'
    });

    // Evento para el botón de cerrar del modal
    movieModal.querySelector('.close-btn').addEventListener('click', closeMovieModal);



    movieForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Recolectar todos los datos del formulario
        const formData = {
            title: document.getElementById('movie-title').value,
            description: document.getElementById('movie-description').value,
            year: parseInt(document.getElementById('movie-year').value),
            imageUrl: document.getElementById('movie-imageUrl').value,
            categoryIds: []
        };
        
        // Recolectamos los IDs de las categorías seleccionadas
        const checkedBoxes = categoryCheckboxesContainer.querySelectorAll('input[type="checkbox"]:checked');
        checkedBoxes.forEach(checkbox => {
            formData.categoryIds.push(checkbox.value);
        });

        // 2. Decidir si es una petición POST (Crear) o PUT (Actualizar)
        const movieId = movieIdInput.value;
        const isUpdate = movieId !== '';
        
        const method = isUpdate ? 'PUT' : 'POST';
        const url = isUpdate ? `${apiUrlBase}/movies/${movieId}` : `${apiUrlBase}/movies`;

        try {
            const response = await fetch(url, {
                method: method,
                headers: authHeaders,
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || `Error al ${isUpdate ? 'actualizar' : 'crear'} la película`);
            }

            alert(`Película ${isUpdate ? 'actualizada' : 'creada'} con éxito`);
            closeMovieModal();
            fetchAndDisplayMovies(); 

        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    });

     async function deleteMovie(movieId, movieTitle, movieElement) {
        // 1. Pedimos confirmación al usuario
        const isConfirmed = confirm(`¿Estás seguro de que quieres eliminar la película "${movieTitle}"? Esta acción no se puede deshacer.`);
        
        // Si el usuario no confirma, no hacemos nada
        if (!isConfirmed) {
            return;
        }

        try {
            // 2. Hacemos la petición DELETE a la API
            const response = await fetch(`${apiUrlBase}/movies/${movieId}`, {
                method: 'DELETE',
                headers: authHeaders
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || 'No se pudo eliminar la película.');
            }

            // 3. Si todo sale bien, eliminamos el elemento del HTML
            movieElement.remove();
            alert(`"${movieTitle}" fue eliminada con éxito.`);

        } catch (error) {
            console.error('Error al eliminar la película:', error);
            alert(`Error: ${error.message}`);
        }
    }











    // --- FUNCIÓN PARA CARGAR Y MOSTRAR PELÍCULAS ---
    async function fetchAndDisplayMovies() {
        try {
            const response = await fetch(`${apiUrlBase}/movies`);
            const data = await response.json();

            moviesContainer.innerHTML = ''; // Limpiamos el contenedor
            data.data.forEach(movie => {
                const movieClone = movieTemplate.cloneNode(true);
                movieClone.querySelector('.item-poster').src = movie.imageUrl;
                movieClone.querySelector('.item-title').textContent = movie.title;
                
                // Añadir eventos a los botones
                // Evento para el botón ACTUALIZAR
                movieClone.querySelector('.btn-update').addEventListener('click', () => openMovieModal(movie));
                // Evento para el botón ELIMINAR 
                 movieClone.querySelector('.btn-delete').addEventListener('click', () => {
                    deleteMovie(movie._id, movie.title, movieClone);
                });
                movieClone.style.display = 'flex';
                moviesContainer.appendChild(movieClone);
            });
        } catch (error) {
            console.error('Error al cargar películas:', error);
        }
    }









    // Seccion de logica de categorias


    // Función para abrir el modal de categorías
    function openCategoryModal(category = null) {
        categoryForm.reset();
        if (category) { // Modo Actualizar
            categoryModalTitle.textContent = 'Actualizar Categoría';
            categoryIdInput.value = category._id;
            document.getElementById('category-name').value = category.name;
        } else { // Modo Crear
            categoryModalTitle.textContent = 'Agregar Categoría';
            categoryIdInput.value = '';
        }
        categoryModal.classList.add('show');
    }

    // Función para cerrar el modal de categorías
    function closeCategoryModal() {
        categoryModal.classList.remove('show');
    }
    
    // Evento para el botón "Agregar Categoría"
    addCategoryBtn.addEventListener('click', () => openCategoryModal());

    // Evento para el botón de cerrar del modal de categorías
    categoryModal.querySelector('.close-btn').addEventListener('click', closeCategoryModal);

    // Evento para el envío del formulario de categorías
    categoryForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const categoryId = categoryIdInput.value;
        const categoryName = document.getElementById('category-name').value;
        const isUpdate = categoryId !== '';
        
        const method = isUpdate ? 'PUT' : 'POST';
        const url = isUpdate ? `${apiUrlBase}/categories/${categoryId}` : `${apiUrlBase}/categories`;

        try {
            const response = await fetch(url, {
                method,
                headers: authHeaders,
                body: JSON.stringify({ name: categoryName })
            });
            if (!response.ok) throw new Error(`Error al ${isUpdate ? 'actualizar' : 'crear'} la categoría`);
            
            alert(`Categoría ${isUpdate ? 'actualizada' : 'creada'} con éxito`);
            closeCategoryModal();
            fetchAndDisplayCategories(); // Recargamos la lista

        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    });
    
    // --- FUNCIÓN PARA ELIMINAR UNA CATEGORÍA ---
    async function deleteCategory(categoryId, categoryName, categoryElement) {
        if (!confirm(`¿Seguro que quieres eliminar la categoría "${categoryName}"?`)) return;
        try {
            const response = await fetch(`${apiUrlBase}/categories/${categoryId}`, { method: 'DELETE', headers: authHeaders });
            if (!response.ok) throw new Error('No se pudo eliminar la categoría.');
            
            categoryElement.remove();
            alert(`Categoría "${categoryName}" eliminada.`);
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    }

    // --- FUNCIÓN PARA CARGAR Y MOSTRAR CATEGORÍAS  ---
    async function fetchAndDisplayCategories() {
        try {
            const response = await fetch(`${apiUrlBase}/categories`);
            const responseData = await response.json();
            const categories = responseData.data || responseData; 

            categoriesContainer.innerHTML = '';
            categories.forEach(category => {
                const categoryClone = categoryTemplate.cloneNode(true);
                categoryClone.querySelector('.item-title').textContent = category.name;
                
                // --- Conectamos los botones de la lista ---
                categoryClone.querySelector('.btn-update').addEventListener('click', () => openCategoryModal(category));
                categoryClone.querySelector('.btn-delete').addEventListener('click', () => deleteCategory(category._id, category.name, categoryClone));

                categoryClone.style.display = 'flex';
                categoriesContainer.appendChild(categoryClone);
            });
            categoryCheckboxesContainer.innerHTML = '';
            categories.forEach(category => {
                const div = document.createElement('div');
                div.className = 'checkbox-item';
                // Añadimos un 'name' a los inputs para agruparlos
                div.innerHTML = `
                    <input type="checkbox" id="cat-${category._id}" value="${category._id}" name="categories">
                    <label for="cat-${category._id}">${category.name}</label>
                `;
                categoryCheckboxesContainer.appendChild(div);
            });
        } catch (error) {
            console.error('Error al cargar categorías:', error);
        }
    }


    // --- LLAMADAS INICIALES ---
    fetchAndDisplayMovies();
    fetchAndDisplayCategories();
});