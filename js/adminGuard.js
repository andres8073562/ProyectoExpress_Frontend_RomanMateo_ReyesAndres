(function checkAdminAccess() {
    const token = localStorage.getItem('user_token');

    if (!token) {
        // Si no hay token, no está logueado. 
        window.location.href = 'index.html';
        return;
    }

    try {
        // Decodificamos el payload del token para leer el rol.
        // El payload es la parte del medio del token, y está en formato Base64.
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        if (payload.role !== 'admin') {
            // Si el rol no es 'admin', pa fuera.
            alert('No tienes permisos para acceder a esta página.');
            window.location.href = 'principalPage.html'; 
        }

    } catch (error) {
        console.error('Error al decodificar el token:', error);
        
        window.location.href = 'index.html';
    }
})();