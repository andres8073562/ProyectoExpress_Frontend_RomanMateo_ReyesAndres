document.addEventListener('DOMContentLoaded', () => {
    const carouselItems = document.querySelectorAll('.carousel-item');
    let currentSlide = 0; // Índice del slide actual

    function showSlide(index) {
        // Quita la clase 'active' de todos los slides
        carouselItems.forEach(item => {
            item.classList.remove('active');
        });

        // Asegura que el índice esté dentro del rango
        if (index >= carouselItems.length) {
            currentSlide = 0; // Vuelve al primer slide si se pasa
        } else if (index < 0) {
            currentSlide = carouselItems.length - 1; // Va al último slide si va hacia atrás
        } else {
            currentSlide = index;
        }

        // Añade la clase 'active' al slide actual
        carouselItems[currentSlide].classList.add('active');
    }

    // Función para avanzar al siguiente slide
    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    // Inicializa el carrusel mostrando el primer slide
    showSlide(currentSlide);

    // Configura el intervalo para cambiar de slide cada 5 segundos (5000 milisegundos)
    setInterval(nextSlide, 5000);

     // --- LÓGICA MODIFICADA PARA CARGAR PELÍCULAS ---

     const moviesContainer = document.querySelector('.container');
     // 1. Seleccionamos nuestra plantilla HTML
     const movieTemplate = document.getElementById('movie-template');
 
     async function fetchAndDisplayMovies() {
         const apiUrl = 'https://karenflix-api.onrender.com/api/v1/movies';
 
         try {
             const response = await fetch(apiUrl);
             if (!response.ok) {
                 throw new Error(`Error en la red: ${response.statusText}`);
             }
 
             const data = await response.json();
             const movies = data.data;
 
             // Limpiamos el contenedor (esto eliminará cualquier contenido previo, 
             // pero nuestra plantilla no está dentro, así que no hay problema si 
             // la seleccionamos antes).
             // Para más seguridad, primero clonamos y luego limpiamos.
             
             movies.forEach(movie => {
                 // 2. Clonamos la plantilla para cada película
                 // El 'true' es importante para que copie también los elementos hijos (img, p)
                 const movieClone = movieTemplate.cloneNode(true);
 
                 // 3. Modificamos el clon con los datos de la API
                 // Buscamos los elementos DENTRO del clon
                 movieClone.querySelector('img').src = movie.imageUrl;
                 movieClone.querySelector('img').alt = movie.title;
                 movieClone.querySelector('p').textContent = movie.title;
 
                 // 4. Hacemos visible el clon
                 movieClone.style.display = 'block'; // O 'grid', dependiendo de tu CSS
                 movieClone.removeAttribute('id'); // Le quitamos el ID para no tener duplicados
 
                 // 5. Añadimos el clon relleno al contenedor
                 moviesContainer.appendChild(movieClone);
             });
 
         } catch (error) {
             console.error('Error al obtener las películas:', error);
             moviesContainer.innerHTML = '<p>No se pudieron cargar las películas.</p>';
         }
     }
 
     fetchAndDisplayMovies();
    
});