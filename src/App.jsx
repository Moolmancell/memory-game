import { useEffect, useState, useRef } from 'react';
import './Card.css'

const typeColor = {
  bug: "#26de81",
  dragon: "#ffeaa7",
  electric: "#fed330",
  fairy: "#FF0069",
  fighting: "#30336b",
  fire: "#f0932b",
  flying: "#81ecec",
  grass: "#00b894",
  ground: "#EFB549",
  ghost: "#a55eea",
  ice: "#74b9ff",
  normal: "#95afc0",
  poison: "#6c5ce7",
  psychic: "#a29bfe",
  rock: "#2d3436",
  water: "#0190FF",
  steel: "#b3b3cc",
  dark: "#33334d"
};

function randomized(min, max) { 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function shuffle(array) {
  let currentIndex = array.length;

  while (currentIndex !== 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex],
    ];
  }

  return [...array]; 
}

async function loadPokemon() {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${randomized(1, 500)}/`
    );
    const data = await response.json();
    return {
      id: data.id,
      url: data.sprites.other.dream_world.front_default,
      name: data.name[0].toUpperCase() + data.name.slice(1),
      type: data.types[0].type.name, 
      statAttack: data.stats[1].base_stat,
      statDefense: data.stats[2].base_stat,
      statSpeed: data.stats[5].base_stat,
      hp: data.stats[0].base_stat, 
      data: data
    };
  } catch (error) {
    console.log(error);
  }
}

function App() {
  const [isAssetLoaded, setAssetLoaded] = useState(false);
  const [arr, setArr] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [clickedPokemon, setClickedPokemon] = useState(new Set());

  const hasFetched = useRef(false);

  console.log(arr)
  console.log(clickedPokemon)

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    async function fetchPokemons() {
      console.log("Fetching Pokémon")
      let array = [];
      let fetchedIds = new Set();

      while (array.length < 10) {
        const pokemon = await loadPokemon();

        if (pokemon && !fetchedIds.has(pokemon.id)) {
          fetchedIds.add(pokemon.id);
          array.push(pokemon);
        }
      }

      setArr(array);
      setAssetLoaded(true);
    }

    fetchPokemons();
  }, []);

  function handlePokemonClick(id) {
    if (clickedPokemon.has(id)) {
      setScore(0);
      setClickedPokemon(new Set());
    } else {
      setScore((prevScore) => {
        const newScore = prevScore + 1;
        if (newScore > bestScore) setBestScore(newScore);
        return newScore;
      });
      setClickedPokemon((prevSet) => new Set(prevSet).add(id));
    }
    setArr(shuffle(arr));
  }

  return (
    <div>
      <h1>Memory Game</h1>
      <h2>Score: {score}</h2>
      <h2>Best Score: {bestScore}</h2>
      {!isAssetLoaded && <p>Loading...</p>}
      <div className='container'>
      {isAssetLoaded &&
        arr.map((item) => (
          <button
            key={item.id}
            onClick={() => handlePokemonClick(item.id)}
            id='card'
            style={{
              background: `radial-gradient(circle at 50% 0%, ${typeColor[item.data.types[0].type.name]} 36%, #ffffff 36%)`
            }}
          >
            <p className="hp">
              <span>HP</span>
              {item.hp}
            </p>
            <img src={item.url} alt={item.name} />
            <h2 className="poke-name">{item.name}</h2>
            <div className="types">
              {item.data.types.map((type) => (
                <span key={type.type.name} style={{ backgroundColor: typeColor[type.type.name] }}>
                  {type.type.name}
                </span>
              ))}
            </div>
            <div className="stats">
              <div>
                <h3>{item.statAttack}</h3>
                <p>Attack</p>
              </div>
              <div>
                <h3>{item.statDefense}</h3>
                <p>Defense</p>
              </div>
              <div>
                <h3>{item.statSpeed}</h3>
                <p>Speed</p>
              </div>
            </div>
          </button>
        ))}
      </div>
      
    </div>
  );
}

export default App;
