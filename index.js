const EASY = 3;
const MEDIUM = 6;
const HARD = 12;
const TOTAL_POKEMON = 1000;

async function fetchRandomPokemon() {
	const response = await axios.get(
		`https://pokeapi.co/api/v2/pokemon?limit=${TOTAL_POKEMON}`
	);
	const pokemon = response.data;

	return pokemon.results;
}

/**
 * Randomly fetches pokemon from the entire pokemon roster.
 *
 * @param {Number} number the number of pokemons to fetch
 * @param {Array} pokemons the array consisting of all the pokemons
 *
 * @returns {Array} array of the randomly selected pokemons
 */
async function getRandomPokemon(number, pokemons) {
	const arr = [];

	for (let i = 0; i < number; i++) {
		const random = Math.floor(Math.random() * (TOTAL_POKEMON + 1));
		const pokemon = await axios.get(pokemons[random].url);
		arr.push(pokemon.data);
	}

	return arr;
}

function initButtons() {
	const reset = document.getElementById("reset");
	reset.addEventListener("click", resetGame);
	const start = document.getElementById("start");
	start.addEventListener("click", startGame);
}

async function initPokemonCards(difficulty, pokemons) {
  const pokemonList = await getRandomPokemon(difficulty, pokemons);
  console.log(pokemonList);
	const template = document.querySelector(".card-template");
	const destination = document.querySelector("#pokemon-container");

	for (let i = 0; i < pokemonList.length; i++) {
		const clone = template.content.cloneNode(true);
		clone.querySelector(".front-face").src = pokemonList[i].sprites.other['official-artwork'].front_default;
		destination.appendChild(clone);
	}
}

function resetGame() {}

function startGame() {

}

function addFlip() {
  const cardArr = document.querySelectorAll('.card');
  cardArr.forEach(card => {
    card.addEventListener('click', () => {
      console.log("This code is run.");
      card.classList.toggle('flip');
    })
  })
}

async function init() {
	const pokemonList = await fetchRandomPokemon();
  await initPokemonCards(3, pokemonList);
  initButtons();
  addFlip();
}

init();