// Esperamos a que todo el contenido del HTML se haya cargado
document.addEventListener('DOMContentLoaded', () => {

    // 1. Seleccionamos los elementos del formulario
    const loginForm = document.querySelector('.login-form form');
    const emailInput = document.getElementById('username'); // Ojo con este ID, ver nota al final
    const passwordInput = document.getElementById('password');

    // 2. Añadimos un "escuchador" para el evento de envío del formulario
    loginForm.addEventListener('submit', async (event) => {
        // Prevenimos el comportamiento por defecto del formulario (que es recargar la página)
        event.preventDefault();

        // 3. Obtenemos los valores de los campos de email y contraseña
        const email = emailInput.value;
        const password = passwordInput.value;

        // La URL completa de tu endpoint de login en Render
        const apiUrl = 'https://karenflix-api.onrender.com/api/v1/users/login';

        // 4. Hacemos la petición a la API con fetch
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,       // La API espera un campo 'email'
                    password: password
                })
            });

            // 5. Manejamos la respuesta de la API
            if (response.ok) { // Si la respuesta es exitosa (status 2xx)
                const data = await response.json();
                
                // Guardamos el token en el navegador para usarlo después
                localStorage.setItem('user_token', data.token);
                
                
                // Redirigimos al usuario a la página principal de películas (ej. movies.html)
                window.location.href = '../html/principalPage.html'; 

            } else { // Si la respuesta es un error (status 4xx o 5xx)
                const errorData = await response.json();
                alert(`Error: ${errorData.msg || 'Credenciales incorrectas'}`);
            }

        } catch (error) {
            // Manejamos errores de red (ej. no hay conexión a internet)
            console.error('Error de red:', error);
            alert('No se pudo conectar con el servidor. Inténtalo más tarde.');
        }
    });
});