const listaPokemones = document.querySelector("#lista-Pokemones"); // Selecciona el contenedor de la lista de Pokémon por su ID (ajustado al nuevo ID)
const botonesHeader = document.querySelectorAll(".btn-header"); // Selecciona todos los botones de filtrado de tipos en el header
const searchInput = document.getElementById("search-input"); // Obtiene el campo de búsqueda por su ID
const searchButton = document.getElementById("search-button"); // Obtiene el botón de búsqueda por su ID
let allPokemons = []; // Variable para almacenar todos los Pokémon una vez obtenidos

// Función para obtener todos los Pokémon
async function fetchPokemons() {
    const URL = "https://pokeapi.co/api/v2/pokemon/"; // URL base de la PokeAPI
    for (let i = 1; i <= 151; i++) { // Bucle para obtener los primeros 151 Pokémon
        try {
            const response = await fetch(`${URL}${i}`); // Hace la petición a la API para obtener los datos del Pokémon
            const data = await response.json(); // Convierte la respuesta a formato JSON
            allPokemons.push(data); // Guarda los datos del Pokémon en el array `allPokemons`
            mostrarPokemon(data); // Llama a la función para mostrar el Pokémon en el DOM
        } catch (error) {
            console.error('Error obteniendo Pokémon', error); // Muestra un error en la consola si ocurre algún problema con la petición
        }
    }
}

// Función para mostrar un Pokémon en el DOM
function mostrarPokemon(poke) {
    let tipos = poke.types.map((type) => `<p class="${type.type.name} tipo">${type.type.name}</p>`); 
    // Crea una lista de los tipos del Pokémon y los transforma en un elemento <p> con la clase correspondiente a cada tipo
    tipos = tipos.join(''); // Une todos los elementos tipo <p> en una sola cadena

    let pokeId = poke.id.toString().padStart(3, '0'); // Convierte el ID del Pokémon a un formato de 3 dígitos (ej. 001, 002)

    const div = document.createElement("div"); // Crea un nuevo elemento <div>
    div.classList.add("pokemon"); // Añade la clase "pokemon" al div
    div.innerHTML = `
        <p class="pokemon-id-back">#${pokeId}</p> 
        <div class="pokemon-imagen">
            <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}">
        </div>
        <div class="pokemon-info">
            <div class="nombre-contenedor">
                <p class="pokemon-id">#${pokeId}</p>
                <h2 class="pokemon-nombre">${poke.name}</h2>
            </div>
            <div class="pokemon-tipos">
                ${tipos} <!-- Inserta los tipos del Pokémon -->
            </div>
            <div class="pokemon-stats">
                <p class="stat">${poke.height}m</p> <!-- Muestra la altura del Pokémon -->
                <p class="stat">${poke.weight}kg</p> <!-- Muestra el peso del Pokémon -->
            </div>
        </div>
    `;

    // Agrega un evento click para abrir el lightbox con los detalles del Pokémon
    div.addEventListener("click", () => mostrarLightbox(poke));

    listaPokemones.append(div); // Añade el Pokémon al contenedor de la lista
}

// Función para filtrar Pokémon por tipo
function filtrarPokemonPorTipo(tipo) {
    listaPokemones.innerHTML = ""; // Limpia el contenedor de la lista de Pokémon
    const pokemonsFiltrados = allPokemons.filter(pokemon => pokemon.types.some(t => t.type.name === tipo)); 
    // Filtra los Pokémon que tengan el tipo seleccionado
    pokemonsFiltrados.forEach(pokemon => mostrarPokemon(pokemon)); // Muestra solo los Pokémon filtrados
}

// Evento para botones de filtrado
botonesHeader.forEach(boton => boton.addEventListener("click", (event) => {
    const botonId = event.currentTarget.id; // Obtiene el ID del botón que se clickeó

    if (botonId === "ver-todos") { // Si el botón es "ver todos"
        listaPokemones.innerHTML = ""; // Limpia el contenedor
        allPokemons.forEach(pokemon => mostrarPokemon(pokemon)); // Muestra todos los Pokémon
    } else {
        filtrarPokemonPorTipo(botonId); // Filtra los Pokémon por el tipo según el ID del botón
    }
}));

// Evento para buscar Pokémon por nombre
searchButton.addEventListener("click", () => {
    const searchTerm = searchInput.value.toLowerCase().trim(); // Obtiene el valor del input de búsqueda, lo convierte a minúsculas y elimina espacios en blanco

    if (!searchTerm) { // Si no hay término de búsqueda
        alert("Por favor, introduce un nombre de Pokémon para buscar."); // Muestra un mensaje de alerta
        return;
    }

    listaPokemones.innerHTML = ""; // Limpia el contenedor
    const pokemonBuscado = allPokemons.filter(pokemon => pokemon.name.toLowerCase().includes(searchTerm)); 
    // Filtra los Pokémon cuyo nombre coincida parcialmente con el término de búsqueda
    
    if (pokemonBuscado.length === 0) { // Si no se encuentra ningún Pokémon
        const mensajeError = document.createElement("p"); 
        mensajeError.textContent = `Pokémon "${searchTerm}" no encontrado.`; // Muestra un mensaje de error
        mensajeError.classList.add("error-message");
        listaPokemones.append(mensajeError); // Añade el mensaje de error al contenedor
    } else {
        pokemonBuscado.forEach(pokemon => mostrarPokemon(pokemon)); // Muestra los Pokémon encontrados
    }
});

// Función para mostrar el lightbox con los detalles del Pokémon
function mostrarLightbox(poke) {
    const lightbox = document.getElementById("pokemon-lightbox"); // Obtiene el contenedor del lightbox
    const lightboxImg = document.getElementById("lightbox-img"); // Obtiene el contenedor de la imagen
    const lightboxName = document.getElementById("lightbox-name"); // Obtiene el contenedor del nombre
    const lightboxId = document.getElementById("lightbox-id"); // Obtiene el contenedor del ID
    const lightboxTypes = document.getElementById("lightbox-types"); // Obtiene el contenedor de los tipos
    const lightboxStats = document.getElementById("lightbox-stats"); // Obtiene el contenedor de las estadísticas

    // Rellena los datos del Pokémon en el lightbox
    lightboxImg.src = poke.sprites.other["official-artwork"].front_default; // Muestra la imagen del Pokémon
    lightboxName.textContent = poke.name; // Muestra el nombre del Pokémon
    lightboxId.textContent = `#${poke.id.toString().padStart(3, '0')}`; // Muestra el ID del Pokémon

    // Tipos del Pokémon
    lightboxTypes.innerHTML = ""; // Limpia los tipos anteriores
    poke.types.forEach(type => {
        const typeElement = document.createElement("p"); // Crea un nuevo párrafo para el tipo
        typeElement.classList.add(type.type.name); // Añade una clase basada en el nombre del tipo
        typeElement.textContent = type.type.name; // Muestra el nombre del tipo
        lightboxTypes.appendChild(typeElement); // Añade el tipo al contenedor
    });

    // Estadísticas (altura y peso)
    lightboxStats.innerHTML = `
        <p>${poke.height}m</p>
        <p>${poke.weight}kg</p>
    `;

    // Muestra el lightbox
    lightbox.style.display = "flex";
}

// Función para cerrar el lightbox
const lightboxClose = document.getElementById("lightbox-close"); // Selecciona el botón de cierre del lightbox
lightboxClose.addEventListener("click", () => {
    const lightbox = document.getElementById("pokemon-lightbox"); // Obtiene el contenedor del lightbox
    lightbox.style.display = "none"; // Cierra el lightbox (oculta el contenedor)
});

// Cargar todos los Pokémon al cargar la página
fetchPokemons(); // Llama a la función para obtener y mostrar los Pokémon
