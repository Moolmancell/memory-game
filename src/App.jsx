import { useEffect, useState } from 'react';

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
      name: data.name 
    };
  } catch (error) {
    console.log(error);
  }
}

function App() {
  const [isAssetLoaded, setAssetLoaded] = useState(false);
  const [arr, setArr] = useState([]);

  useEffect(() => {
    async function fetchPokemons() {
      let array = [];
      let fetchedIds = new Set();

      while (array.length < 10) {
        const pokemon = await loadPokemon();

        if (pokemon && !fetchedIds.has(pokemon.id)) {
          fetchedIds.add(pokemon.id); // Mark ID as fetched
          array.push(pokemon);
        }
      }

      setArr(array);
      setAssetLoaded(true);
    }

    fetchPokemons();
  }, []);

  return (
    <div>
      <h1>Memory Game</h1>
      {!isAssetLoaded && <p>Loading...</p>}
      {isAssetLoaded &&
        arr.map((item) => (
          <button key={item.id} onClick={() => {
            setArr(shuffle(arr))
          }}>
            <img src={item.url} alt={item.name} />
          </button>
        ))}
    </div>
  );
}

export default App;
