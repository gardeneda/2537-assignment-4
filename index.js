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

		clone.querySelector(".front-face").id = `pokemon-${i}`;
		clone.querySelector(".front-face").src =
			finalPokemon[i].sprites.other["official-artwork"].front_default;
		destination.appendChild(clone);
	}

	// addFlip();
}

// function addFlip() {
// 	const cardArr = document.querySelectorAll(".gamecard");
// 	cardArr.forEach((card) => {
// 		card.addEventListener("click", () => {
// 			console.log("This code is run.");
// 			card.classList.toggle("flip");
// 		});
// 	});
// }

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
			document.querySelectorAll(".active").forEach((doc) => {
				doc.classList.remove("active");
			});
			btn.parentElement.classList.toggle("active");
		});
	});
}

// ###############################################
// INITIATING GAME CONTROLLER ####################

function resetGame(difficulty) {
	const btn = document.getElementById("reset");
	btn.addEventListener("click", () => {});
}

function initButtons() {
	const reset = document.getElementById("reset");
	reset.addEventListener("click", resetGame);
	const start = document.getElementById("start");
	start.addEventListener("click", startGame);
}

// ###############################################
// STARTING THE GAME LOGIC #######################

function startGame() {
	const difficulty = document.querySelector(".active").childNodes[1].value;
	game(difficulty);
}

async function game(difficulty) {
	const pokemonList = await fetchRandomPokemon();
	switch (difficulty) {
		case "easy":
			await initPokemonCards(EASY, pokemonList);
			gameSession(EASY);
			break;

		case "medium":
			await initPokemonCards(MEDIUM, pokemonList);
			gameSession(MEDIUM);
			break;

		case "hard":
			await initPokemonCards(HARD, pokemonList);
			gameSession(HARD);
			break;
	}
}

function gameSession(difficulty) {
	console.log("This thing started");
	let matched = 0;
	const maxTime = getMaxTime(difficulty);
	console.log(maxTime);
	let time = 0;
	let flippedCard = null;
	let numClicks = 0;

	const flipCard = (card) => {
		card.classList.toggle("flip");
	};

	const checkMatch = (card1, card2) => {
		const frontFace1 = card1.querySelector(".front-face");
		const frontFace2 = card2.querySelector(".front-face");

		if (frontFace1.src === frontFace2.src) {
			console.log("match");
			matched++;
			card1.removeEventListener("click", cardClickHandler);
			card2.removeEventListener("click", cardClickHandler);
		} else {
			console.log("no match");
			setTimeout(() => {
				flipCard(card1);
				flipCard(card2);
			}, 1000);
		}
		flippedCard = null;
	};

	const cardClickHandler = (event) => {
		numClicks++;
		const currentCard = event.currentTarget;
		if (currentCard === flippedCard) {
			return; // Ignore clicks on the same card
		}
		flipCard(currentCard);
		if (!flippedCard) {
			flippedCard = currentCard;
		} else {
			checkMatch(flippedCard, currentCard);
		}
	};

	const cards = document.querySelectorAll(".gamecard");
	cards.forEach((card) => {
		card.addEventListener("click", cardClickHandler);
	});

	const interval = setInterval(() => {
		time++;
		document.getElementById("max-time").textContent = maxTime;
		document.getElementById("time-count").textContent = time;

		if (matched >= difficulty || time >= maxTime) {
			clearInterval(interval);
			cards.forEach((card) => {
				card.removeEventListener("click", cardClickHandler);
			});
		}
	}, 1000);

	const test = () => {
		console.log("Lol this a test.");
	};

	test;
}

function getMaxTime(difficulty) {
	switch (difficulty) {
		case EASY:
			return 100;

		case MEDIUM:
			return 120;

		case HARD:
			return 150;
	}
}

// ###############################################

async function init() {
	initDifficulty();
	initButtons();
}

init();
