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
	let widthCard = 0;
	let marginBottom = 0;
	const template = document.querySelector(".card-template");
	const destination = document.querySelector("#pokemon-container");
	
	if (difficulty == EASY) {
		widthCard = '33.3%';
		marginBottom = '5%'
	} else if (difficulty == MEDIUM){
		widthCard = '25%';
		marginBottom = '15%';
	} else if (difficulty == HARD) {
		widthCard = '16.66%';
		marginBottom = '20%';
	}

	for (let i = 0; i < finalPokemon.length; i++) {
		const clone = template.content.cloneNode(true);

		clone.querySelector(".front-face").id = `pokemon-${i}`;
		clone.querySelector(".gamecard").style.width = widthCard;
		clone.querySelector(".gamecard").style.margin = `0 0 ${marginBottom} 0`;
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

function initButtons() {
	const start = document.getElementById("start");
	start.addEventListener("click", startGame);
	const dark = document.getElementById("dark");
	dark.addEventListener("click", () => {
		document.querySelector('body').classList.add("bg-dark");
		document.querySelector('.statistics').classList.add("text-white");
	});
	const light = document.getElementById("light");
	light.addEventListener("click", () => {
		document.querySelector('body').classList.remove("bg-dark");
		document.querySelector('.statistics').classList.remove("text-white");
	});
}

// ###############################################
// STARTING THE GAME LOGIC #######################

function startGame() {
	document.getElementById("pokemon-container").innerHTML = "";
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
	let matched = 0;
	const maxTime = getMaxTime(difficulty);
	let time = 0;
	let flippedCard = null;
	let numClicks = 0;

	document.querySelector(".statistics").classList.remove("hidden");
	document.querySelector("#start").classList.add("hidden");
	document.getElementById("max-match").textContent = difficulty;

	const flipCard = (card) => {
		card.classList.toggle("flip");
	};

	const checkMatch = (card1, card2) => {
		const frontFace1 = card1.querySelector(".front-face");
		const frontFace2 = card2.querySelector(".front-face");

		if (frontFace1.src === frontFace2.src) {
			console.log("match");
			matched++;
			frontFace1.parentElement.classList.add("matched");
			frontFace2.parentElement.classList.add("matched");
			document.querySelector("#current-match").textContent = matched;
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
		document.getElementById("click-count").textContent = Math.floor(numClicks / 2);
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
		document.getElementById("time-count").textContent = maxTime - time;

		// Power Up
		if (time % 20 == 0 && time != 0) {
			alert("Power up!");
			setTimeout(() => {
				document.querySelectorAll("div:not(.matched)").forEach( card => {
					flipCard(card);
				})
			}, 1000);
			document.querySelectorAll("div:not(.matched)").forEach( card => {
				flipCard(card);
			})
		}

		if (time >= maxTime) {
			clearInterval(interval);
			cards.forEach((card) => {
				card.removeEventListener("click", cardClickHandler);
			});
			alert("Time out. You lose!");
		} else if (matched >= difficulty) {
			clearInterval(interval);
			cards.forEach((card) => {
				card.removeEventListener("click", cardClickHandler);
			});
			alert("You win!");
		}
	}, 1000);


	document.getElementById("reset").addEventListener('click', () => {
		document.querySelector('#pokemon-container').innerHTML = "";
		document.getElementById("start").classList.remove("hidden");
		document.querySelector(".statistics").classList.add("hidden");
		clearInterval(interval);
	})
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
