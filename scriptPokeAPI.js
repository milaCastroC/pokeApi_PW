const gallery = document.getElementById('gallery');
const modal = document.getElementById('pokemonModal');
const modalContent = document.getElementById('pokemonDetails');
const closeModal = document.querySelector('.close');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

//ASINCRONISMO ASYNC = asincronico AWAIT = espera

async function fetchPokemons() {
    for(let id = 1; id <= 30; id++){
        await fetchPokemoByIdOrName(id);
    }
}

async function fetchPokemoByIdOrName(identifier){
    try{
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${identifier}`);
        if(!response.ok){
            alert('POKEMON NO ENCONTRADO');
            return;
        }
        const data =  await response.json();
        createPokemonCard(data);
    }catch(error){
        console.error('Error obteniendo pokemon',error);
    }
}

function createPokemonCard(pokemon){
    const imageUrl = pokemon.sprites.other.home.front_default;
    const pokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

    //CREAR CARDS
    const card = document.createElement('div');
    card.classList.add('card');
    const img = document.createElement('img');
    img.classList.add('img');
    img.src = imageUrl;
    img.alt = pokemonName;

    const cardContent = document.createElement('div');
    cardContent.classList.add('card-content');

    const title = document.createElement('h2');
    title.textContent = pokemonName;

    cardContent.appendChild(title);
    card.appendChild(img);
    card.appendChild(cardContent);

    gallery.appendChild(card);

}

fetchPokemons();