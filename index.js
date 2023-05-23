const EASY = 3;
const MEDIUM = 6;
const HARD = 12;
const TOTAL_POKEMON = 1000;

// ###############################################
// POKEMON CARD SETUPS ###########################

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

async function initPokemonCards(difficulty, pokemons) {
	const pokemonList = await getRandomPokemon(difficulty, pokemons);
	const finalPokemon = shuffle(pokemonList);

	const template = document.querySelector(".card-template");
	const destination = document.querySelector("#pokemon-container");

	for (let i = 0; i < finalPokemon.length; i++) {
		const clone = template.content.cloneNode(true);
		clone.querySelector(".front-face").src =
			finalPokemon[i].sprites.other["official-artwork"].front_default;
		destination.appendChild(clone);
	}

	addFlip();
}

function addFlip() {
	const cardArr = document.querySelectorAll(".gamecard");
	cardArr.forEach((card) => {
		card.addEventListener("click", () => {
			console.log("This code is run.");
			card.classList.toggle("flip");
		});
	});
}

function createPairsPokemon(pokemonList) {
	const arr = [];
	pokemonList.forEach((pokemon) => {
		arr.push(pokemon);
		arr.push(pokemon);
	});

	return arr;
}

function shuffle(pokemonList) {
	const arr = createPairsPokemon(pokemonList);
	for (let i = 0; i < arr.length / 2; i++) {
		const random = Math.floor(Math.random() * arr.length);
		const temp = arr[i];
		arr[i] = arr[random];
		arr[random] = temp;
	}

	return arr;
}

// ###############################################
// INITIATING DIFFICULTY #########################

function initDifficulty() {
	const allDifficulty = document.querySelectorAll('input[type="radio"]');
	allDifficulty.forEach((btn) => {
		btn.addEventListener("change", () => {
			document.querySelectorAll('.active').forEach(doc => {
				doc.classList.remove('active');
			})
			btn.parentElement.classList.toggle("active");
		});
	});
}

// ###############################################
// INITIATING GAME CONTROLLER ####################

function resetGame() {}

function initButtons() {
	const reset = document.getElementById("reset");
	reset.addEventListener("click", resetGame);
	const start = document.getElementById("start");
	start.addEventListener("click", startGame);
}

function startGame() {
	const difficulty = document.querySelector('.active').childNodes[1].value;
	console.log(difficulty);
	game();
}

function game() {}

async function init() {
	const pokemonList = await fetchRandomPokemon();
	await initPokemonCards(HARD, pokemonList);
	initButtons();
	initDifficulty();
}

init();
