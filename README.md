# Proyecto de Express - Karenfix

  

Este proyecto es una simulación interactiva de películas y series desarrollada con tecnologías Front-End y Back-End. Ofrece una experiencia digital completa que permite a los usuarios registrarse, filtrar, buscar, hacer reseñas y ver películas a través de una interfaz dinámica.

  

La propuesta de diseño para la mejor experiencia usario aquì:

  

[Figma](https://www.figma.com/design/syma0ZNPnsJna3Be3dYPQs/Untitled?node-id=0-1&t=leVwK794CGF3GAWD-0)

  

## Tabla de contenidos

  




| Carpeta/Archivo                  | Explicación  |
|------------------------------|--------------|
| [Login.html](./index.html) y [register](./register.html)     | Página principal del proyecto. Presenta opciones de ingreso para el administrador o el usuario, cada uno con su respectivo logo. |
| [Pagina Pricipal](./html/principalPage.html)      | Contiene los archivos HTML destinados a la interfaz del **usuario**. Incluye el apartado de las peliculas la cual cuenta con filtro y otra pagina que es la de ver el perfil completo de la pelicula donde podermos hacer reseñas sobre la pelicula. |
| [Admin](./html/admin.html)      | En este apartado podemos ver el codigo desarrollado de la parte de admin que seria el crud, para eliminar, actualizar y agregar, tanto para peliculas como para reseñas. |
| [script](./js/)              | Código JavaScript, que tiene toda la lógica del proyecto para ambas experiencias, ya sea usuario o administrador. |
| [style](./Style/)                | Hojas de estilo CSS que definen el aspecto visual del proyecto. Incluye estilos adaptados para distintos componentes. |
| [storage](./STORAGE/)           |  Archivos relacionados con almacenamiento de datos, como las fuentes de letras e imagenes para un funcionamiento básico de la web. |

---
## Explicación del Proyecto

  

La aplicación presenta dos tipos de usuarios:

  

### Usuario

- Puede acceder a la interfaz donde puede interactuar al ver, hacer reseñas , buscar y filtrar.

- Visualiza los distintos atributos de las peliculas, como autor, duracion, calificacion y descripcion.

  
  

### Administrador

- Tiene acceso a un panel de control con permisos para crear, editar y eliminar peliculas y series(CRUD).

- Utiliza formularios integrados para ingresar datos de manera sencilla.

  

### Diseño e Interactividad

- La navegación es clara y simple.

- El diseño fue pensado en Figma antes de la implementación.

- Se utiliza una separación lógica con dos repositorios entre Back End Y Front End, para mantener la organizacion y escabilidad de codigo.

  

## Tecnologías Utilizadas

  

-  **HTML5**: Para la estructura del contenido.

-  **CSS3**: Para los estilos visuales y diseño responsive.

-  **JavaScript**: Para la lógica de la aplicación, simulaciones y manipulación del DOM.

-  **Express**: para el desarrollo de la base de datos.

-  **Figma**: Para el diseño previo y planificación de la interfaz.

  

## Capturas de Pantalla

  

> Puedes agregar aquí algunas imágenes relevantes del diseño o funcionamiento del sistema. Por ejemplo:

>  - Vista principal del index

![image](/STORAGE/registro.png)

![image](/STORAGE/inicioSesion.png)

![image](/STORAGE/principal.png)



![image](/STORAGE/admin.png)

![image](/STORAGE/admin2.png)

## Controbuidores
[Andres Reyes](https://github.com/andres8073562)

[Mateo Roman](https://github.com/Mvteiio)
