document.addEventListener('DOMContentLoaded', () => {

    // 1. Seleccionamos los elementos del formulario
    const registerForm = document.querySelector('.login-form form');
    const emailInput = document.getElementById('email');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    // 2. Añadimos un "escuchador" para el evento de envío del formulario
    registerForm.addEventListener('submit', async (event) => {
        // Prevenimos el comportamiento por defecto (recargar la página)
        event.preventDefault();

        // 3. Obtenemos los valores de los campos
        const email = emailInput.value;
        const username = usernameInput.value;
        const password = passwordInput.value;

        // La URL completa de tu endpoint de registro
        const apiUrl = 'https://karenflix-api.onrender.com/api/v1/users/register';

        // 4. Hacemos la petición a la API con fetch
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            // 5. Manejamos la respuesta de la API
            if (response.ok) { // Si el registro fue exitoso (status 201)
                alert(data.msg || '¡Registro exitoso! Ahora puedes iniciar sesión.');
                
                // Redirigimos al usuario a la página de login
                window.location.href = 'index.html'; 

            } else { // Si la respuesta es un error (ej. usuario ya existe, datos inválidos)
                // Si express-validator devuelve errores, los mostramos
                if (data.errors) {
                    const errorMessages = data.errors.map(error => error.msg).join('\n');
                    alert(`Errores de validación:\n${errorMessages}`);
                } else {
                    alert(`Error: ${data.msg || 'No se pudo completar el registro.'}`);
                }
            }

        } catch (error) {
            console.error('Error de red:', error);
            alert('No se pudo conectar con el servidor. Inténtalo más tarde.');
        }
    });
});