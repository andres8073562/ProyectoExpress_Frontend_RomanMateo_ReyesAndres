document.addEventListener('DOMContentLoaded', () => {

    const loginForm = document.querySelector('.login-form form');
    const emailInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = emailInput.value;
        const password = passwordInput.value;
        const apiUrl = 'https://karenflix-api.onrender.com/api/v1/users/login';

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            // Si la respuesta es un error (credenciales incorrectas, etc.)
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || 'Error en el inicio de sesión');
            }


            const data = await response.json();
            const token = data.token;

            // 1. Guardamos el token en localStorage
            localStorage.setItem('user_token', token);

            // 2. Decodificamos el payload del token para leer el rol
            const payload = JSON.parse(atob(token.split('.')[1]));
            
            // 3. Verificamos el rol y redirigimos
            if (payload.role === 'admin') {
                alert('¡Bienvenido, Admin Pro hacker!');
                window.location.href = 'admin.html'; // Redirigir al panel de admin
            } else {
                alert('Inicio de sesión exitoso!');
                window.location.href = 'principalPage.html'; // Redirigir a la página principal
            }

        } catch (error) {
            console.error('Error en el login:', error);
            alert(error.message);
        }
    });
});