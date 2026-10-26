
import { useState, useEffect } from "react";

export default function App() {
  const [id, setId] = useState(1);
  const [pokemon, setPokemon] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function buscarPokemon() {
      setCarregando(true);
      setErro(null);

      try {
        const resposta = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${id}`
        );

        if (!resposta.ok) {
          throw new Error("Pokémon não encontrado!");
        }

        const dados = await resposta.json();
        setPokemon(dados);
      } catch (error) {
        setErro(error.message);
        setPokemon(null);
      } finally {
        setCarregando(false);
      }
    }

    buscarPokemon();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-red-600 mb-6">
        Pokédex
      </h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() =>
            setId((atual) => Math.max(1, atual - 1))
          }
          disabled={id === 1 || carregando}
          className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Anterior
        </button>

        <button
          onClick={() => setId((atual) => atual + 1)}
          disabled={carregando}
          className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Próximo
        </button>
      </div>

      <p className="text-lg font-semibold text-gray-700 mb-4">
        ID: {id}
      </p>

      {carregando && (
        <p className="text-gray-500">
          Carregando Pokémon...
        </p>
      )}

      {erro && (
        <p className="text-red-600 font-medium">
          {erro}
        </p>
      )}

      {pokemon && !carregando && (
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center w-full max-w-sm">
          <h2 className="text-2xl font-bold capitalize text-gray-800 mb-4">
            {pokemon.name}
          </h2>

          <div className="flex justify-center gap-2 mb-6">
            {pokemon.types.map((tipo) => (
              <span
                key={tipo.type.name}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm capitalize"
              >
                {tipo.type.name}
              </span>
            ))}
          </div>

          <img
            src={
              pokemon.sprites.other?.["official-artwork"]?.front_default ||
              pokemon.sprites.front_default
            }
            alt={pokemon.name}
            className="w-40 h-40 object-contain"
          />

          <div className="mt-4 text-gray-700 space-y-2 text-center">
            <p>Altura: {pokemon.height / 10} m</p>
            <p>Peso: {pokemon.weight / 10} kg</p>
          </div>
        </div>
      )}
    </div>
  );
}
